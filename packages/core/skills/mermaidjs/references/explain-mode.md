# --explain mode

Generate a multi-format visual explanation combining ASCII art, Mermaid diagram, and prose.

## Output Structure

1. **ASCII art** — terminal-friendly box diagram of the concept (max 40 cols wide)
2. **Mermaid diagram** — formal diagram (flowchart or sequence or architecture as appropriate)
3. **Prose** — 3-5 bullet explanation of the concept

## ASCII Art Rules
- Use box-drawing chars: ┌─┐│└┘├┤┬┴┼
- Keep under 40 columns
- Show relationships with arrows: → ← ↑ ↓ ↔
- Label each box clearly

## Example (topic: "JWT auth flow")

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Client  │───▶│  Server  │───▶│  JWT Lib │
└──────────┘    └──────────┘    └──────────┘
      ▲               │
      └───────────────┘
        signed token
```
