from __future__ import annotations

import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PLUGIN = ROOT / ".agents" / "plugin" / "kimify-commands" / "kimify-cmd.py"
COMPLETENESS_GATE = ROOT / ".agents" / "hooks" / "completeness-gate.sh"
GUARD_BASH = ROOT / ".agents" / "hooks" / "guard-bash.sh"
ALIAS_GENERATOR = ROOT / ".agents" / "scripts" / "generate-shell-aliases.sh"


def run_tool(command: list[str], payload: dict | None = None, *, env: dict[str, str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        input=json.dumps(payload) if payload is not None else None,
        text=True,
        capture_output=True,
        env=env,
        cwd=ROOT,
        check=False,
    )


class KimifySafetyTests(unittest.TestCase):
    def test_plugin_reads_valid_command_from_project_root(self) -> None:
        with tempfile.TemporaryDirectory() as project:
            commands_dir = Path(project) / ".agents" / "commands"
            commands_dir.mkdir(parents=True)
            (commands_dir / "start.md").write_text("Start procedure\n", encoding="utf-8")

            env = {**os.environ, "KIMI_PROJECT_DIR": project}
            result = run_tool(["python3", str(PLUGIN)], {"name": "/start"}, env=env)

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("Start procedure", result.stdout)

    def test_plugin_rejects_absolute_or_traversal_command_names(self) -> None:
        with tempfile.TemporaryDirectory() as project:
            commands_dir = Path(project) / ".agents" / "commands"
            commands_dir.mkdir(parents=True)

            env = {**os.environ, "KIMI_PROJECT_DIR": project}
            result = run_tool(
                ["python3", str(PLUGIN)],
                {"name": f"/{ROOT}/README"},
                env=env,
            )

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("invalid command name", result.stderr)

    def test_completeness_gate_blocks_multiedit_incomplete_markers(self) -> None:
        with tempfile.TemporaryDirectory() as project:
            knowledge_base = Path(project) / ".agents" / "knowledge-base.md"
            knowledge_base.parent.mkdir(parents=True)

            env = {**os.environ, "KIMI_PROJECT_DIR": project}
            payload = {
                "tool_name": "MultiEdit",
                "tool_input": {
                    "file_path": str(knowledge_base),
                    "edits": [
                        {"old_string": "old", "new_string": "- **Rule**: TODO fill this in"}
                    ],
                },
            }
            result = run_tool([str(COMPLETENESS_GATE)], payload, env=env)

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("permissionDecision", result.stdout)
            self.assertIn("TODO", result.stdout)

    def test_completeness_gate_allows_valid_toml_when_parser_is_available_or_absent(self) -> None:
        with tempfile.TemporaryDirectory() as project:
            config_path = Path(project) / "kimi-config.toml"

            env = {**os.environ, "KIMI_PROJECT_DIR": project}
            payload = {
                "tool_name": "Write",
                "tool_input": {
                    "file_path": str(config_path),
                    "content": '[[hooks]]\nevent = "Stop"\nmatcher = ""\ncommand = "true"\n',
                },
            }
            result = run_tool([str(COMPLETENESS_GATE)], payload, env=env)

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(result.stdout, "")

    def test_guard_logs_outside_project_redirection_warning(self) -> None:
        with tempfile.TemporaryDirectory() as project:
            env = {**os.environ, "KIMI_PROJECT_DIR": project}
            payload = {"tool_input": {"command": "python3 -c 'print(1)' > /tmp/kimify-outside-test"}}
            result = run_tool([str(GUARD_BASH)], payload, env=env)

            self.assertEqual(result.returncode, 0, result.stderr)
            incident_log = Path(project) / ".agents" / "logs" / "incident-log.md"
            self.assertIn("write outside project dir", incident_log.read_text(encoding="utf-8"))

    def test_alias_generator_quotes_command_paths_with_spaces(self) -> None:
        with tempfile.TemporaryDirectory(prefix="kimify aliases ") as project:
            commands_dir = Path(project) / ".agents" / "commands"
            commands_dir.mkdir(parents=True)
            (commands_dir / "wrap-up.md").write_text("Wrap up\n", encoding="utf-8")

            env = {**os.environ, "KIMI_PROJECT_DIR": project}
            result = subprocess.run(
                [str(ALIAS_GENERATOR)],
                text=True,
                capture_output=True,
                env=env,
                cwd=ROOT,
                check=False,
            )

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("cat", result.stdout)
            self.assertIn("kimify", result.stdout)
            self.assertIn("aliases", result.stdout)

            parse_check = subprocess.run(
                ["bash", "-lc", result.stdout + "\nalias kimi-wrap-up"],
                text=True,
                capture_output=True,
                env=env,
                cwd=ROOT,
                check=False,
            )
            self.assertEqual(parse_check.returncode, 0, parse_check.stderr)
            self.assertIn("kimi-wrap-up", parse_check.stdout)


if __name__ == "__main__":
    unittest.main()
