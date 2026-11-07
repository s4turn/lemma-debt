import { mkdir, rm, copyFile, stat, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out=path.join(root, 'dist');
const scripts=['expansions.js','encounters.js','engine.js','narrative.js','scenes.js','practice.js','figures.js','tutorial.js','drill.js','school.js','hints.js','game.js'];
const files=['index.html','style.css','logo.svg','mark.svg','landing-art.svg','LICENSE'];
await rm(out, {recursive:true, force:true});
await mkdir(out);
const {version}=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
for(const file of files)await copyFile(path.join(root,file),path.join(out,file));
// Load the complete rule/UI dependency chain as one cache entry. A partial
// script fetch must not leave the interface running without its save helpers.
const bundle=(await Promise.all(scripts.map(async file=>`/* ${file} */\n${await readFile(path.join(root,file),'utf8')}\n;`))).join('\n');
await writeFile(path.join(out,'bundle.js'),bundle);
let html=await readFile(path.join(out,'index.html'),'utf8');
const scriptBlock=scripts.map(file=>`<script src="${file}"></script>`).join('');
if(!html.includes(scriptBlock))throw new Error('Runtime script order changed: update the explicit build dependency list.');
await writeFile(path.join(out,'index.html'),html.replace(scriptBlock,'<script src="bundle.js"></script>'));
files.push('bundle.js');
// Each release gets new asset URLs; an old cached script cannot silently win
// over newly deployed HTML. The origin and localStorage key stay unchanged.
for(const file of ['index.html','bundle.js']){
 const target=path.join(out,file),source=await readFile(target,'utf8');
 await writeFile(target,source.replace(/(src|href)="([^"]+\.(?:js|css|svg))"/g,(_,attribute,name)=>`${attribute}="${name}?v=${version}"`));
}
let bytes=0;for(const file of files)bytes+=(await stat(path.join(out,file))).size;
console.log(`Built ${files.length} static files (${bytes} bytes).`);
