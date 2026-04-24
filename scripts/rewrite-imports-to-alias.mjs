// One-off: rewrite relative imports under src/ to @/ alias.
// Run: node scripts/rewrite-imports-to-alias.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcRoot = path.join(root, 'src');

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out.push(...walk(p, []));
    else if (/\.(tsx?|jsx?)$/.test(name)) out.push(p);
  }
  return out;
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function rewriteFile(filePath) {
  let s = fs.readFileSync(filePath, 'utf8');
  const relFile = path.relative(srcRoot, filePath);
  const fileDir = path.dirname(filePath);

  const importRe =
    /(from\s+)(['"])(\.\.?\/[^'"]+)(['"])/g;

  s = s.replace(importRe, (_, prefix, q1, spec, q2) => {
    if (!spec.startsWith('.')) return _;
    const resolved = path.normalize(path.join(fileDir, spec));
    const rel = path.relative(srcRoot, resolved);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      console.warn('SKIP (outside src):', relFile, spec);
      return _;
    }
    const aliasPath = '@/' + toPosix(rel);
    return `${prefix}${q1}${aliasPath}${q2}`;
  });

  return s;
}

const files = walk(srcRoot);
let changed = 0;
for (const f of files) {
  const next = rewriteFile(f);
  const prev = fs.readFileSync(f, 'utf8');
  if (next !== prev) {
    fs.writeFileSync(f, next);
    changed++;
    console.log('updated', path.relative(root, f));
  }
}
console.log('done, files changed:', changed);
