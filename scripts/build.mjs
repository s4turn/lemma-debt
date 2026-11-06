import { mkdir, rm, copyFile, stat, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out=path.join(root, 'dist');
const files=['index.html','style.css','engine.js','encounters.js','expansions.js','narrative.js','scenes.js','practice.js','figures.js','tutorial.js','game.js','logo.svg','mark.svg','landing-art.svg','LICENSE'];
await rm(out, {recursive:true, force:true});
await mkdir(out);
const {version}=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
for(const file of files)await copyFile(path.join(root,file),path.join(out,file));
// Each release gets new asset URLs; an old cached script cannot silently win
// over newly deployed HTML. The origin and localStorage key stay unchanged.
for(const file of ['index.html','game.js']){
 const target=path.join(out,file),source=await readFile(target,'utf8');
 await writeFile(target,source.replace(/(src|href)="([^"]+\.(?:js|css|svg))"/g,(_,attribute,name)=>`${attribute}="${name}?v=${version}"`));
}
let bytes=0;for(const file of files)bytes+=(await stat(path.join(out,file))).size;
console.log(`Built ${files.length} static files (${bytes} bytes).`);
