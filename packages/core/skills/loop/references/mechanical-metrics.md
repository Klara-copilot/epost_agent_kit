# Mechanical Metrics — Verify Command Library

Verify commands must output a **single number** on stdout. Nothing else.

## Test Coverage

### Jest (branch coverage %)
```bash
npx jest --coverage --json --coverageReporters=json 2>/dev/null | node -e "const d=require('/dev/stdin').toString();const r=JSON.parse(d);console.log(r.coverageMap?Object.values(r.coverageMap).reduce((a,f)=>{a.s+=f.s.total;a.h+=f.s.covered;return a},{s:0,h:0}):0)"
```

Simpler (if jest outputs to coverage/coverage-summary.json):
```bash
npm run test -- --coverage --silent 2>/dev/null; node -e "const r=require('./coverage/coverage-summary.json');const t=r.total;console.log(((t.branches.covered/t.branches.total)*100).toFixed(1))"
```

### Vitest
```bash
npx vitest run --coverage 2>/dev/null | grep 'Branches' | grep -oP '\d+\.\d+' | head -1
```

## Bundle Size

### Next.js (total JS in kB)
```bash
npm run build 2>/dev/null; du -sk .next/static/chunks/*.js | awk '{s+=$1} END {print s}'
```

### Webpack / Rollup (parse stats)
```bash
npm run build --stats 2>/dev/null; node -e "const s=require('./dist/stats.json');console.log((s.assets.reduce((a,f)=>a+f.size,0)/1024).toFixed(0))"
```

### esbuild
```bash
node -e "const s=require('./dist/meta.json');console.log((Object.values(s.outputs).reduce((a,f)=>a+f.bytes,0)/1024).toFixed(0))"
```

## Lint Errors

### ESLint (error count)
```bash
npx eslint src --format json 2>/dev/null | node -e "const r=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(r.reduce((a,f)=>a+f.errorCount,0))"
```

### TypeScript errors
```bash
npx tsc --noEmit 2>&1 | grep -c 'error TS' || echo 0
```

## Lighthouse Score

### Via CLI (performance score 0-100)
```bash
npx lighthouse http://localhost:3000 --output json --quiet 2>/dev/null | node -e "const r=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(Math.round(r.categories.performance.score*100))"
```

## Custom Metrics

Any command that outputs a single number works:

```bash
# Count TODO comments
grep -r 'TODO' src --include='*.ts' | wc -l

# Dependency count
node -e "const p=require('./package.json');console.log(Object.keys(p.dependencies||{}).length)"

# File count in a directory
ls src/components | wc -l

# Cyclomatic complexity (via plato)
npx plato -r -d /tmp/plato-out src && node -e "const r=require('/tmp/plato-out/report.json');console.log(r.summary.average.maintainability.toFixed(0))"
```

## Noise Tolerance

Some metrics fluctuate between runs (e.g., Lighthouse ±3 points). Set `Min-Delta` above the noise floor:

| Metric | Typical Noise | Recommended Min-Delta |
|--------|--------------|----------------------|
| Coverage % | ±0.1% | 0.5% |
| Bundle size (kB) | ±1kB | 2kB |
| ESLint errors | 0 | 1 |
| TypeScript errors | 0 | 1 |
| Lighthouse score | ±3 | 2 |
