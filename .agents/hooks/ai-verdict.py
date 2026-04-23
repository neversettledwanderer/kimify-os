#!/usr/bin/env python3
"""
Stop-hook AI verdict — Kimi SDK replacement for Claudify's Haiku prompt hook.

Reads the Kimi Stop-event JSON payload from stdin, asks a fast Kimi model for
a strict-JSON review of the session, and emits that JSON on stdout so that
log-stop-verdict.sh (the existing shell logger) can consume it unchanged.

Wire-up (in kimi-config.toml):

    [[hooks]]
    event = "Stop"
    matcher = ""
    command = '''bash -c '"${KIMI_PROJECT_DIR:-$(pwd)}/.agents/hooks/ai-verdict.py" | "${KIMI_PROJECT_DIR:-$(pwd)}/.agents/hooks/log-stop-verdict.sh"' '''
    timeout = 20

Requires: `pip install kimi-agent-sdk` and a valid Kimi auth via `kimi /login`.

Fail-open: if the SDK call errors, emits a neutral verdict so the shell logger
has something to write and the session isn't blocked.
"""
from __future__ import annotations
import asyncio
import json
import os
import sys

VERDICT_MODEL = os.environ.get("KIMI_VERDICT_MODEL", "kimi-k2-turbo")
TIMEOUT_S = int(os.environ.get("KIMI_VERDICT_TIMEOUT", "15"))

PROMPT = """You are a JSON-only response bot. Review the conversation transcript below and return exactly one JSON object with this shape:

{"decision": "allow" | "block", "learning": string | null, "task_type": "build"|"debug"|"refactor"|"test"|"docs"|"research"|"deploy"|"admin"|"setup"|"other", "reason": string | null}

- decision is "allow" if all user-requested tasks were completed, "block" if something was missed (when block, also set reason).
- learning is a one-sentence lesson if errors were resolved (root cause + fix), otherwise null.
- task_type picks the best-fitting label.

RESPOND WITH ONLY THE JSON OBJECT. NO MARKDOWN. NO PROSE.

TRANSCRIPT:
"""

NEUTRAL = {
    "decision": "allow",
    "learning": None,
    "task_type": "other",
    "reason": None,
}


async def _get_verdict(transcript: str) -> dict:
    try:
        from kimi_agent_sdk import prompt  # type: ignore
    except ImportError:
        return {**NEUTRAL, "learning": "kimi-agent-sdk not installed; verdict hook is a no-op"}

    chunks: list[str] = []
    try:
        async for msg in prompt(
            PROMPT + transcript[-50_000:],  # tail-limit for cost/latency
            model=VERDICT_MODEL,
            yolo=True,
        ):
            text = msg.extract_text() if hasattr(msg, "extract_text") else str(msg)
            if text:
                chunks.append(text)
    except Exception as e:
        return {**NEUTRAL, "learning": f"verdict sdk error: {type(e).__name__}"}

    raw = "".join(chunks).strip()
    # Strip accidental fences
    if raw.startswith("```"):
        raw = raw.strip("`").split("\n", 1)[-1]
        if raw.endswith("```"):
            raw = raw[: -3]
    # First brace to last brace, greedy
    start = raw.find("{")
    end = raw.rfind("}")
    if start == -1 or end == -1:
        return {**NEUTRAL, "learning": "verdict model returned non-JSON"}
    try:
        parsed = json.loads(raw[start : end + 1])
    except json.JSONDecodeError:
        return {**NEUTRAL, "learning": "verdict JSON malformed"}

    # Ensure required keys
    for k, default in NEUTRAL.items():
        parsed.setdefault(k, default)
    return parsed


def main() -> int:
    payload_raw = sys.stdin.read()
    try:
        payload = json.loads(payload_raw) if payload_raw.strip() else {}
    except json.JSONDecodeError:
        payload = {}

    # Kimi's Stop event fields include session_id, cwd, stop_hook_active, and
    # (in some versions) a transcript_path. Fall back gracefully.
    transcript = payload.get("transcript") or ""
    tpath = payload.get("transcript_path")
    if not transcript and tpath and os.path.exists(tpath):
        try:
            with open(tpath) as f:
                transcript = f.read()
        except OSError:
            pass
    if not transcript:
        transcript = payload_raw  # last resort: review the raw event

    verdict = asyncio.run(asyncio.wait_for(_get_verdict(transcript), timeout=TIMEOUT_S)) \
        if transcript else NEUTRAL

    print(json.dumps(verdict))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except asyncio.TimeoutError:
        print(json.dumps({**NEUTRAL, "learning": "verdict timed out"}))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({**NEUTRAL, "learning": f"verdict hook crashed: {type(e).__name__}"}))
        sys.exit(0)
