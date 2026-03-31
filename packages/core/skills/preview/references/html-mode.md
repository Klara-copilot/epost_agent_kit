# --html mode

Generate a self-contained HTML file with an interactive explanation.

## Output

Single `.html` file saved to `docs/visuals/{slug}.html` (create dir if needed).
After writing, open with: `open docs/visuals/{slug}.html` (macOS)

## Content Structure

```html
<!DOCTYPE html>
<html>
<head>
  <title>{topic}</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <style>/* minimal readable styles */</style>
</head>
<body>
  <h1>{topic}</h1>
  <pre><!-- ASCII art --></pre>
  <div class="mermaid"><!-- mermaid diagram --></div>
  <ul><!-- key points --></ul>
</body>
</html>
```

## Rules
- Self-contained: no external images or fonts
- Mermaid via CDN (ok for local use)
- Light/dark toggle button (simple JS)
- Minimal CSS — readable, no framework
- File named: `docs/visuals/{topic-as-kebab}.html`
