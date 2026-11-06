import { mkdir, rm, copyFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out=path.join(root, 'dist');
const files=['index.html','style.css','engine.js','encounters.js','expansions.js','narrative.js','scenes.js','practice.js','figures.js','game.js','logo.svg','mark.svg','landing-art.svg','LICENSE'];
await rm(out, {recursive:true, force:true});
await mkdir(out);
let bytes=0;
for(const file of files){await copyFile(path.join(root,file),path.join(out,file));bytes+=(await stat(path.join(out,file))).size;}
console.log(`Built ${files.length} static files (${bytes} bytes).`);
