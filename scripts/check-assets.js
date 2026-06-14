const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const assetFile = path.join(root, 'src/data/assets.js');
const text = fs.readFileSync(assetFile, 'utf8');
const matches = [...text.matchAll(/src:\s*"([^"]+)"/g)].map(m => m[1]);
let ok = true;
for (const rel of matches) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    console.error('Missing asset:', rel);
    ok = false;
  }
}
if (!ok) process.exit(1);
console.log(`OK: ${matches.length} assets found.`);
