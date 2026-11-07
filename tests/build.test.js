'use strict';
// Execute the actual hosted bundle with browser globals: individual CommonJS
// imports cannot reveal a missing browser dependency or incorrect load order.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const E=require('../engine');
const root=path.resolve(__dirname,'..');
execFileSync(process.execPath,['scripts/build.mjs'],{cwd:root});
const files=fs.readdirSync(path.join(root,'dist')).sort();
assert.deepEqual(files,['LICENSE','bundle.js','index.html','landing-art.svg','logo.svg','mark.svg','style.css']);
const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
assert.equal((html.match(/<script /g)||[]).length,1);
assert.match(html,/<script src="bundle\.js\?v=\d+\.\d+\.\d+"><\/script>/);
const bundle=fs.readFileSync(path.join(root,'dist/bundle.js'),'utf8');
assert.match(bundle,/src="logo\.svg\?v=\d+\.\d+\.\d+"/);
const saved=E.fresh();E.start(saved);
saved.coaching={seen:['recovery','reassign','clerk','traverse'],off:false};
const raw=JSON.stringify(saved);
for(let reload=0;reload<3;reload++){
 const elements={};
 const context2d=new Proxy({}, {get:(target,key)=>target[key]||(target[key]=()=>{}),set:(target,key,value)=>(target[key]=value,true)});
 const element=id=>elements[id]||(elements[id]={id,hidden:true,innerHTML:'',textContent:'',style:{},dataset:{},focus(){},addEventListener(){},getBoundingClientRect(){return {width:390,height:844,left:0,top:0}},getContext(){return context2d}});
 const writes=[];
 const sandbox={console,document:{getElementById:element,querySelectorAll(){return []},addEventListener(){}},localStorage:{getItem(key){return key==='lemma-debt-save-v1'?raw:null},setItem(...args){writes.push(args)}},addEventListener(){},matchMedia(){return {matches:false}},devicePixelRatio:1};
 sandbox.window=sandbox;
 vm.runInNewContext(bundle,sandbox,{timeout:3000});
 assert.match(element('screen').innerHTML,/Continue campaign/,'A complete hosted load recognizes the existing coached save');
 assert.equal(element('storage-warning').hidden,true);
 assert.equal(writes.length,0,'Opening the game must not overwrite the existing save');
 for(const name of ['Lemma','LemmaHints','LemmaSchool','LemmaTutorial','LemmaDrill','LemmaNarrative','LemmaScenes','LemmaFigures','LemmaPractice'])assert.ok(sandbox[name],name+' loaded');
}
console.log('Hosted bundle: one ordered runtime, seven allowed assets, versioned art, and three fresh loads preserve a coached campaign save.');
