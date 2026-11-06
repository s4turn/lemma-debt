'use strict';
const assert=require('node:assert/strict'),E=require('../engine'),S=require('../school'),R=require('../drill'),T=require('../tutorial');
// The exact sequence uses legal ordinary rules and produces the advertised outcomes.
let s=S.create(E),mode='move',plan=null;
for(let i=0;i<R.steps.length;i++){
 const step=R.current(s),before=JSON.stringify(s);assert.equal(step,R.steps[i]);
 for(const event of [{kind:'dismiss'},{kind:'help'},{kind:'recenter'},{kind:'force'},{kind:'select',agent:9},{kind:'tile',x:8,y:8,mode:'move'}]){assert.equal(R.allowed(s,event),false);assert.equal(R.advance(s,event),false);}
 assert.equal(JSON.stringify(s),before,'wrong inputs cannot change state');
 if(step.kind!=='wait')assert.equal(R.allowed(s,{kind:'wait'}),false);
 if(step.kind==='select'){s.battle.selected=step.agent;mode='move';plan=null;}
 if(step.kind==='mode'){mode=step.mode;plan=mode==='ability'&&s.battle.selected===1?{x:2,y:5}:null;}
 if(step.kind==='tile'){assert.ok(R.allowed(s,{kind:'tile',x:step.x,y:step.y,mode}));assert.ok(R.preview(s,step.x,step.y,mode,step.action));const o=mode==='ability'?E.abilityOrder(s,step.x,step.y):E.order(s,step.x,step.y);assert.ok(o.ok);plan={x:step.x,y:step.y};if(step.action==='attack')mode='attack';}
 if(step.kind==='confirm'){assert.deepEqual(plan,{x:step.x,y:step.y});const event={kind:'confirm',...plan,mode,action:step.action};assert.ok(R.allowed(s,event));const r=mode==='ability'?E.ability(s,plan.x,plan.y):E.act(s,plan.x,plan.y);assert.equal(r.kind,step.action);assert.ok(r.ok);T.record(s,r.kind);plan=null;mode='move';}
 if(step.kind==='wait'){E.wait(s);assert.deepEqual(s.battle.agents.map(a=>a.hp),[10,11,9]);assert.ok(s.battle.agents.every(a=>a.ap===1));}
 assert.ok(R.advance(s,{...step}));assert.equal(s.school.drill.step,i+1);
 s=JSON.parse(JSON.stringify(s)); // no implicit reset if a session state is copied
}
assert.equal(R.active(s),false);assert.equal(s.battle.turn,2);assert.equal(s.battle.enemies[0].alive,false);assert.equal(s.battle.enemies[0].hp,0);assert.equal(E.dist(s.battle.agents[2],s.battle.target),1);assert.deepEqual(s.battle.agents.map(a=>a.hp),[10,11,9]);
assert.ok(E.act(s,s.battle.target.x,s.battle.target.y).ok);E.wait(s);assert.ok(E.act(s,s.battle.target.x,s.battle.target.y).ok);assert.equal(s.phase,'decision');
for(let stage=1;stage<4;stage++)assert.equal(R.active(S.create(E,stage)),false);
s=S.create(E);R.skip(s);assert.equal(R.active(s),false);assert.equal(R.allowed(s,{kind:'wait'}),true);
console.log('Fixed drill: 19 exact inputs, rejected wrong inputs, shield absorbs 3, two 2-damage attacks, automatic round refresh, Traverse beside gold, release and upload passed.');

// Exercise real UI handlers, including disabled-control bypass attempts and keyboard/map input.
const elements={},events={},ctx=new Proxy({}, {get(t,k){return t[k]||(t[k]=()=>{})},set(t,k,v){t[k]=v;return true}});
function el(id){return elements[id]||(elements[id]={id,hidden:false,innerHTML:'',textContent:'',style:{},dataset:{},disabled:false,focus(){},scrollIntoView(){},classList:{add(){},remove(){}},setAttribute(){},removeAttribute(){},addEventListener(n,f){this['on'+n]=f},getBoundingClientRect(){return {width:390,height:390,left:0,top:0,bottom:390}},getContext(){return ctx}});}
function group(key,container){const html=el(container).innerHTML,re=new RegExp('data-'+key+'="(\\d+)"','g');return [...html.matchAll(re)].map(m=>{const a=el(key+'-'+m[1]);a.dataset[key]=m[1];return a;});}
global.document={getElementById:el,querySelectorAll(selector){return selector==='[data-agent]'?group('agent','agents'):selector==='[data-cell]'?group('cell','grid-controls'):selector==='[data-enemy]'?group('enemy','enemies'):[];},querySelector(selector){const m=selector.match(/^\[data-(agent|cell)="(\d+)"\]$/);return m?el(m[1]+'-'+m[2]):null;}};
global.window=global;global.devicePixelRatio=1;global.innerHeight=844;global.innerWidth=390;global.matchMedia=()=>({matches:true});global.addEventListener=(n,f)=>events[n]=f;global.confirm=()=>true;
const campaign=JSON.stringify(E.fresh()),storage={'lemma-debt-save-v1':campaign};global.localStorage={getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v};
require('../narrative');require('../scenes');require('../practice');require('../figures');require('../hints');require('../game');
el('night-school').onclick();el('school-enter').onclick();
const counter=()=>el('tutorial').innerHTML.match(/STEP (\d+) \/ 19/)?.[1];
el('backup').onclick();events.keydown({key:'1'});assert.equal(counter(),'1','modal typing cannot select an agent');el('close-modal').onclick();events.keydown({key:'1',target:{closest:()=>true}});assert.equal(counter(),'1');events.keydown({key:'1',target:{isContentEditable:true}});assert.equal(counter(),'1');
for(let i=0;i<R.steps.length;i++){
 const step=R.steps[i];assert.equal(+counter(),i+1);assert.equal(el('coach-tip').hidden,true,'no competing automatic popover');
 const preview=el('order-preview').innerHTML;
 el('tutorial-hint').onclick();assert.equal(+counter(),i+1);assert.equal(el('order-preview').innerHTML,preview,'Locate cannot plan or select');
 if(step.kind!=='wait'){el('wait').onclick();assert.equal(+counter(),i+1);assert.equal(el('wait').disabled,true);}
 if(step.kind!=='select'||step.agent!==2){events.keydown({key:'3'});assert.equal(+counter(),i+1);}
 el('recenter').onclick();el('force').onclick();assert.equal(+counter(),i+1);
 el('cell-80').onclick();assert.equal(+counter(),i+1);el('board').onpointerup({clientX:0,clientY:0});assert.equal(+counter(),i+1);
 el('map-view').onclick();el('map-view').onclick();events.resize();assert.equal(+counter(),i+1);assert.equal(el('cell-80').disabled,true);
 el('tutorial-explain').onclick();el('tip-close').onclick();assert.equal(+counter(),i+1);assert.equal(el('tip-auto').hidden,true);
 if(step.kind==='select'){const a=el('agent-'+step.agent);assert.equal(a.disabled,false);a.onclick();}
 if(step.kind==='mode'){const button=el(step.mode==='ability'?'ability':'mode-'+step.mode);assert.equal(button.disabled,false);button.onclick();}
 if(step.kind==='tile'){const button=el('cell-'+(step.y*9+step.x));assert.equal(button.disabled,false);button.onclick();}
 if(step.kind==='confirm'){assert.equal(el('confirm-order').disabled,false);el('confirm-order').onclick();}
 if(step.kind==='wait'){assert.equal(el('wait').disabled,false);el('wait').onclick();}
 if(step.kind==='release')el('drill-release').onclick();
 assert.equal(storage['lemma-debt-save-v1'],campaign);
}
assert.equal(counter(),undefined);assert.match(el('tutorial').innerHTML,/FINAL ASSIGNMENT/);assert.ok(!el('tutorial').innerHTML.includes('4/6 learned'));assert.equal(el('wait').disabled,false);
for(let n=0;n<60&&!el('game').hidden;n++){
 const html=el('tutorial').innerHTML,label=html.match(/id="tutorial-hint">([^<]+)/)?.[1];
 if(label==='Show confirmation')el('confirm-order').onclick();else if(label==='Show End round')el('wait').onclick();else el('tutorial-hint').onclick();
}
assert.match(el('screen').innerHTML,/Attendance Is a Liability — passed/);assert.equal(storage['lemma-debt-save-v1'],campaign);
el('school-leave').onclick();el('night-school').onclick();el('school-enter').onclick();assert.equal(counter(),'1');el('toggle-guide').onclick();assert.equal(el('wait').disabled,false);el('wait').onclick();assert.match(el('turn').textContent,/ROUND 2/);assert.equal(storage['lemma-debt-save-v1'],campaign);
console.log('Drill UI: exact sequence, rejected map/keyboard/alternate orders, non-advancing dismissal/help/view changes, free Locate, no conflicting queue, free-play completion, explicit skip and campaign isolation passed.');
