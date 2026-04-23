# /note — quick memory capture

Append the user's text to `.agents/memory.md` under the most appropriate heading. Use this when the user wants to record something to memory without a full `/sync` or `/wrap-up`.

## Procedure

1. Read `.agents/memory.md` to see the current structure and headings (typically: Now, Open Threads, Recent Decisions, Architecture notes, Blockers).

2. Classify the text to append:
   - **Now** — what's actively being worked on right now
   - **Open Threads** — unfinished work or pending research
   - **Recent Decisions** — design or architectural choices made. Prefix with today's date (YYYY-MM-DD).
   - **Architecture notes** — durable facts about how the system is wired
   - **Blockers** — things stopping progress

3. Append the text as a bullet under the chosen heading. If the heading doesn't exist yet, create it in the right spot (keep the file's existing order).

4. Keep the entry to one line where possible. If it's a decision, lead with the date: `- YYYY-MM-DD: <decision>. <one-line rationale>`.

5. After appending, confirm in one short sentence which heading you used and why.

## Input

$ARGS — the text the user wants recorded. If $ARGS is empty, ask the user what to note before proceeding.

## Example

User: `/note per-agent bash scoping uses bash-allow.txt sidecars, one per scoped agent`

Action: append `- Per-agent bash scoping uses bash-allow.txt sidecars, one per scoped agent` under "Architecture notes".

Response: "Added to Architecture notes — it's a durable fact about how scoping is wired, not a time-bound decision."

## Guardrails

- Don't exceed 100 lines total in memory.md. If you're close, recommend running `/sync` to prune first.
- If the note looks like it belongs in the knowledge base (a hard rule learned from an incident), tell the user to add it to `.agents/knowledge-nominations.md` instead — the auditor promotes those into the knowledge base.
- Don't rewrite or reorganize existing entries. Just append.
