'use strict';
// Smoke-test UI flow with DOM and Canvas stubs; not a visual browser test.
const assert=require('node:assert/strict');
const elements={};let storage={};
const ctx=new Proxy({}, {get(t,k){return t[k]||(t[k]=()=>{})},set(t,k,v){t[k]=v;return true}});
function el(id){return elements[id]||(elements[id]={id,hidden:false,innerHTML:'',textContent:'',style:{},dataset:{},focus(){},addEventListener(n,f){this['on'+n]=f},getBoundingClientRect(){return {width:900,height:600,left:0,top:0}},getContext(){return ctx}})}
global.document={getElementById:el,querySelectorAll(){return []}};
global.window=global;global.devicePixelRatio=1;global.addEventListener=()=>{};
global.localStorage={getItem(k){return storage[k]||null},setItem(k,v){storage[k]=v}};
global.confirm=()=>true;
require('../engine.js');require('../narrative.js');require('../scenes.js');require('../practice.js');require('../figures.js');require('../game.js');
assert.match(el('screen').innerHTML,/LEMMA/);
el('new').onclick();assert.match(el('screen').innerHTML,/Repossession of a Proof/);
const beforePractice=storage['lemma-debt-save-v1'];el('practice').onclick();assert.match(el('modal-body').innerHTML,/Blue tiles/);for(let step=0;step<10&&!el('modal-body').innerHTML.includes('Rehearsal complete');step++){const target=el('modal-body').innerHTML.match(/id="practice-cell-(\d+)" class="practice-cell available  hostile/);const cell=target?+target[1]:[8,4,5][Math.min(step,2)];el('practice-cell-'+cell).onclick();el('practice-confirm').onclick()}assert.match(el('modal-body').innerHTML,/Rehearsal complete/);assert.equal(storage['lemma-debt-save-v1'],beforePractice);el('practice-exit').onclick();assert.equal(el('modal').hidden,true);
el('deploy').onclick();assert.match(el('modal-body').innerHTML,/scene/);el('scene-deploy').onclick();assert.equal(el('game').hidden,false);assert.match(el('mission-title').textContent,/Repossession/);
assert.ok(el('board').onpointerup);el('board').onpointerup({clientX:177,clientY:264.5});
assert.match(el('order-preview').innerHTML,/Move/);assert.equal(el('confirm-order').disabled,false);el('confirm-order').onclick();let save=JSON.parse(storage['lemma-debt-save-v1']);assert.equal(save.phase,'battle');assert.equal(save.battle.turn,0);assert.equal(save.battle.agents[0].ap,0);
el('help').onclick();assert.equal(el('modal').hidden,false);assert.match(el('modal-body').innerHTML,/Field|command/);
console.log('Mock interface: title, new campaign, deployment, map order, save and help passed.');
// Backup and restore operate on complete saved state; invalid input cannot replace it.
el('backup').onclick();const exported=el('save-export').value;assert.equal(JSON.parse(exported).battle.turn,0);el('save-import').value='{bad json';el('restore').onclick();assert.match(el('restore-message').textContent,/invalid/);assert.equal(JSON.parse(storage['lemma-debt-save-v1']).battle.turn,0);el('save-import').value=exported;el('restore').onclick();assert.equal(el('game').hidden,false);assert.equal(JSON.parse(storage['lemma-debt-save-v1']).battle.turn,0);
// A browser refusing storage is surfaced and the current in-memory save remains exportable.
global.localStorage.setItem=()=>{throw Error('quota')};el('wait').onclick();assert.equal(el('storage-warning').hidden,false);assert.match(el('storage-warning').textContent,/failed/);el('backup').onclick();assert.equal(JSON.parse(el('save-export').value).battle.turn,1);
console.log('Mock interface: backup, invalid and valid restore, and storage-failure warning passed.');
// A version-1 save completed before the expansion remains valid and can continue.
global.localStorage.setItem=(k,v)=>{storage[k]=v};
let old=global.Lemma.fresh();old.mission=6;old.phase='ending';old.ending='commons';old.verified=4;old.automated=2;old.credits=123;old.upgrades.tools=1;delete old.baselineVerified;delete old.baselineAutomated;delete old.history;
el('backup').onclick();el('save-import').value=JSON.stringify(old);el('restore').onclick();assert.ok(el('screen').innerHTML.includes(global.LemmaNarrative.endings.commons.title));assert.match(el('screen').innerHTML,/The Department of Comprehension/);el('next-campaign').onclick();let continued=JSON.parse(storage['lemma-debt-save-v1']);assert.equal(continued.mission,6);assert.equal(continued.phase,'hub');assert.equal(continued.credits,123);assert.equal(continued.upgrades.tools,1);assert.deepEqual(continued.history,[{campaign:0,outcome:'commons'}]);assert.equal(continued.baselineVerified,4);assert.match(el('screen').innerHTML,/Minutes of the Disaster/);
// A second-campaign ending survives restore and leads to the final campaign.
continued.mission=12;continued.phase='ending';continued.ending='contested';continued.verified=7;continued.automated=5;continued.battle=null;el('backup').onclick();el('save-import').value=JSON.stringify(continued);el('restore').onclick();assert.ok(el('screen').innerHTML.includes(global.Lemma.CAMPAIGNS[1].endings.contested.title));el('next-campaign').onclick();continued=JSON.parse(storage['lemma-debt-save-v1']);assert.equal(continued.mission,12);assert.equal(continued.history.length,2);assert.match(el('screen').innerHTML,/Subscription to Reality/);
// A save in a later tactical mission restores its current positions and turn.
continued.mission=14;continued.verified=8;continued.automated=6;global.Lemma.start(continued);global.Lemma.wait(continued);el('backup').onclick();el('save-import').value=JSON.stringify(continued);el('restore').onclick();let later=JSON.parse(storage['lemma-debt-save-v1']);assert.equal(later.phase,'battle');assert.equal(later.mission,14);assert.equal(later.battle.turn,1);assert.match(el('mission-title').textContent,/Cooling Argument/);
console.log('Mock interface: legacy completed save, both campaign transitions and later battle restore passed.');
// First-use combat is visible before opening the manual and confirms exact damage.
let combat=global.Lemma.fresh();global.Lemma.start(combat);combat.battle.enemies[0].type='patrol';combat.battle.enemies[0].x=3;combat.battle.enemies[0].y=6;el('backup').onclick();el('save-import').value=JSON.stringify(combat);el('restore').onclick();assert.match(el('agents').innerHTML,/READY · 1 action/);assert.match(el('enemies').innerHTML,/ATTACK AVAILABLE · 2 damage/);el('board').onpointerup({clientX:333,clientY:303.5});assert.match(el('order-preview').innerHTML,/4 → 2 HP/);assert.equal(el('confirm-order').disabled,false);el('confirm-order').onclick();let hit=JSON.parse(storage['lemma-debt-save-v1']);assert.equal(hit.battle.enemies[0].hp,2);assert.equal(hit.battle.agents[0].ap,0);assert.match(el('agents').innerHTML,/ACTED · 0 actions/);assert.match(el('log').innerHTML,/2 damage/);el('backup').onclick();el('save-import').value=JSON.stringify(hit);el('restore').onclick();assert.equal(JSON.parse(storage['lemma-debt-save-v1']).battle.agents[0].ap,0);
console.log('Discoverability: visible ready states, target availability, damage preview, confirm, damage feedback and spent-action restore passed.');

// Force decode bypasses a live network: the objective must immediately become extraction.
let forced=global.Lemma.fresh();forced.mission=2;forced.verified=2;global.Lemma.start(forced);forced.battle.agents[0].x=forced.battle.target.x-1;forced.battle.agents[0].y=forced.battle.target.y;el('backup').onclick();el('save-import').value=JSON.stringify(forced);el('restore').onclick();assert.equal(el('force').disabled,false);el('force').onclick();assert.match(el('objective').textContent,/EVIDENCE SECURED/);assert.equal(JSON.parse(storage['lemma-debt-save-v1']).understanding,60);
console.log('Practice completion leaves campaign save unchanged; bypassed-network objective points to extraction.');

// Every mission's actual choice receives its own memo and persists only that choice.
const escapeHtml=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(let mission=0;mission<18;mission++)for(const method of ['verify','automate'])for(const captured of [false,true]){
  let candidate=global.Lemma.fresh();candidate.mission=mission;candidate.verified=Math.floor(mission/2);candidate.automated=mission-candidate.verified;candidate.understanding=method==='verify'?95:10;global.Lemma.start(candidate);candidate.battle.secured=true;candidate.battle.captured=captured;candidate.captured=captured?1:0;candidate.phase='decision';
  el('backup').onclick();el('save-import').value=JSON.stringify(candidate);el('restore').onclick();assert.equal(el('screen').hidden,false);
  if(mission===17)assert.ok(!el('screen').innerHTML.includes('next rival a 15-point'));
  const m=global.Lemma.MISSIONS[mission];assert.ok(el('screen').innerHTML.includes(m.after));el(method).onclick();
  let result=JSON.parse(storage['lemma-debt-save-v1']);assert.equal(result.mission,mission+1);assert.deepEqual(result.journal,[{mission,method,captured}]);
  assert.equal(el('modal-title').textContent,m.resolution[method].title);assert.ok(el('modal-body').innerHTML.includes(escapeHtml(m.resolution[method].body)));
  assert.ok(el('modal-body').innerHTML.includes(method==='verify'?'+5 UNDERSTANDING':'−10 UNDERSTANDING'.replace('−','-')));
  assert.ok(el('modal-body').innerHTML.includes((method==='verify'?20:45)-(captured?10:0)+' CREDITS'));
  if(mission===17)assert.ok(!el('modal-body').innerHTML.includes('NEXT RIVAL HEAD START'));
  el('memo-continue').onclick();assert.equal(el('modal').hidden,true);
  el('backup').onclick();el('save-import').value=JSON.stringify(result);el('restore').onclick();el('case-file').onclick();
  assert.ok(el('modal-body').innerHTML.includes(escapeHtml(m.resolution[method].body)));
  const other=method==='verify'?'automate':'verify';assert.ok(!el('modal-body').innerHTML.includes(escapeHtml(m.resolution[other].body)));
}
// Older saves keep unknown choices unknown, and malformed journals cannot replace a save.
el('backup').onclick();el('save-import').value=JSON.stringify(old);el('restore').onclick();el('case-file').onclick();assert.match(el('modal-body').innerHTML,/did not record/);assert.ok(!el('modal-body').innerHTML.includes('HUMAN REVIEW'));
let invalid={...old,journal:[{mission:7,method:'verify',captured:false}]};el('backup').onclick();el('save-import').value=JSON.stringify(invalid);el('restore').onclick();assert.match(el('restore-message').textContent,/invalid/);
console.log('Story UI: all 72 mission/choice/capture cases, clamped resource deltas, saved case files, legacy unknowns and invalid-journal rejection passed.');

// A hollow outcome can follow automation even when understanding remains intact.
for(let campaign=0;campaign<3;campaign++){
  let high=global.Lemma.fresh();high.mission=campaign*6+5;high.verified=campaign*3+1;high.automated=campaign*3+4;high.baselineVerified=campaign*3;high.baselineAutomated=campaign*3;high.understanding=100;global.Lemma.start(high);high.phase='decision';high.battle.secured=true;
  el('backup').onclick();el('save-import').value=JSON.stringify(high);el('restore').onclick();el('verify').onclick();let result=JSON.parse(storage['lemma-debt-save-v1']);assert.equal(result.ending,'hollow');assert.equal(result.understanding,100);const endings=campaign===0?global.LemmaNarrative.endings:global.Lemma.CAMPAIGNS[campaign].endings;assert.ok(el('screen').innerHTML.includes(endings.hollow.body));
}
// Contradictory known choices cannot be imported as a valid story history.
for(const journal of [[0,1,2].map(mission=>({mission,method:'automate',captured:false})),[{mission:0,method:'verify',captured:true}]]){
  el('backup').onclick();el('save-import').value=JSON.stringify({...old,journal,captured:0});el('restore').onclick();assert.match(el('restore-message').textContent,/invalid/);
}
// Fresh-page Case file reads the saved journal without requiring Continue first.
let boot=global.Lemma.fresh();boot.mission=1;boot.automated=1;boot.journal=[{mission:0,method:'automate',captured:false}];storage['lemma-debt-save-v1']=JSON.stringify(boot);delete require.cache[require.resolve('../game.js')];require('../game.js');el('case-file').onclick();assert.ok(el('modal-body').innerHTML.includes(escapeHtml(global.Lemma.MISSIONS[0].resolution.automate.body)));assert.equal(storage['lemma-debt-save-v1'],JSON.stringify(boot));
console.log('All three high-understanding hollow outcomes, journal consistency and fresh-page Case file passed.');

// Later endings acknowledge exactly the recorded earlier outcomes, including missing old history.
for(const first of ['commons','contested','hollow'])for(const second of ['commons','contested','hollow'])for(const final of ['commons','contested','hollow']){
  let finished=global.Lemma.fresh();finished.mission=18;finished.verified=9;finished.automated=9;finished.phase='ending';finished.ending=final;finished.history=[{campaign:0,outcome:first},{campaign:1,outcome:second}];
  el('backup').onclick();el('save-import').value=JSON.stringify(finished);el('restore').onclick();assert.ok(el('screen').innerHTML.includes(escapeHtml(global.LemmaNarrative.legacy.ownership[first])));assert.ok(el('screen').innerHTML.includes(escapeHtml(global.LemmaNarrative.legacy.implants[second])));assert.ok(el('screen').innerHTML.includes(global.Lemma.CAMPAIGNS[2].endings[final].body));
}
let uncertain=global.Lemma.fresh();uncertain.mission=12;uncertain.verified=6;uncertain.automated=6;uncertain.phase='ending';uncertain.ending='contested';delete uncertain.history;el('backup').onclick();el('save-import').value=JSON.stringify(uncertain);el('restore').onclick();assert.ok(el('screen').innerHTML.includes(escapeHtml(global.LemmaNarrative.legacy.ownership.unknown)));assert.ok(!el('screen').innerHTML.includes(escapeHtml(global.LemmaNarrative.legacy.implants.unknown)));
console.log('Ending UI: all 27 recorded outcome histories and neutral missing-history fallback passed.');

// Objective finding changes only the view, and recovery redirects it to extraction.
const drawnLabels=[];let badgeBounds;ctx.fillText=text=>drawnLabels.push(String(text));ctx.strokeRect=(x,y,width,height)=>{badgeBounds={x,y,width,height}};let scrollLeft=null;el('map-wrap').clientWidth=360;el('map-wrap').scrollIntoView=()=>{};el('map-wrap').scrollTo=opts=>{scrollLeft=opts.left};
let objective=global.Lemma.fresh();global.Lemma.start(objective);el('backup').onclick();el('save-import').value=JSON.stringify(objective);el('restore').onclick();
assert.match(el('objective-title').textContent,/RECOVER/);assert.equal(el('objective-step').textContent,'01 / 02');assert.equal(drawnLabels.at(-1),'◆ EVIDENCE');
const unchanged=storage['lemma-debt-save-v1'];el('board').onpointerup({clientX:badgeBounds.x+badgeBounds.width/2,clientY:badgeBounds.y+badgeBounds.height/2});assert.match(el('order-preview').innerHTML,/Secure evidence/);assert.equal(storage['lemma-debt-save-v1'],unchanged);el('locate-objective').onclick();assert.match(el('order-preview').innerHTML,/Secure evidence/);assert.equal(storage['lemma-debt-save-v1'],unchanged);assert.ok(Number.isFinite(scrollLeft)&&scrollLeft>0);
objective.battle.agents[0].x=objective.battle.target.x-1;objective.battle.agents[0].y=objective.battle.target.y;el('backup').onclick();el('save-import').value=JSON.stringify(objective);el('restore').onclick();el('force').onclick();assert.equal(el('objective-title').textContent,'TRANSMIT THE EVIDENCE');assert.equal(el('objective-step').textContent,'02 / 02');assert.equal(drawnLabels.at(-1),'↑ UPLOAD');assert.equal(el('locate-objective').textContent,'Locate uplink ↗');const extractedView=storage['lemma-debt-save-v1'];el('locate-objective').onclick();assert.match(el('order-preview').innerHTML,/Transmit evidence/);assert.equal(storage['lemma-debt-save-v1'],extractedView);
console.log('Objective UI: evidence/extraction beacons, exact stage labels and free locate actions passed.');

// Larger figure hit areas must select the person shown, including at narrow-board scale.
const actualFigureDraw=global.LemmaFigures.draw,figureBoxes=[],fills=[];
global.LemmaFigures.draw=(context,unit,x,y,width)=>{const box=actualFigureDraw(context,unit,x,y,width);figureBoxes.push({unit,box});return box};
ctx.fill=()=>fills.push(ctx.fillStyle);
el('board').getBoundingClientRect=()=>({width:580,height:360,left:0,top:0});
let visual=global.Lemma.fresh();global.Lemma.start(visual);el('backup').onclick();el('save-import').value=JSON.stringify(visual);el('restore').onclick();
const wren=figureBoxes.find(f=>f.unit.kind==='agent'&&f.unit.idx===1).box;
const headTap={clientX:wren.x+wren.width/2,clientY:wren.y+8};el('board').onpointerdown(headTap);el('board').onpointerup(headTap);
assert.equal(JSON.parse(storage['lemma-debt-save-v1']).battle.selected,1);
assert.match(el('agents').innerHTML,/agent-portrait/);
// A reachable, unoccupied destination previews a route and spends nothing until confirmed.
const beforeMove=JSON.parse(storage['lemma-debt-save-v1']);
const tileWidth=Math.min((580-30)/9,(360-100)/9*2,78),tileHeight=tileWidth/2,originY=Math.max(70,(360-9*tileHeight)/2-16);
const candidates=[];
for(let y=0;y<9;y++)for(let x=0;x<9;x++){
  const order=global.Lemma.order(beforeMove,x,y),point={clientX:290+(x-y)*tileWidth/2,clientY:originY+(x+y)*tileHeight/2+tileHeight/2};
  if(order.ok&&order.kind==='move'&&!figureBoxes.some(f=>point.clientX>=f.box.x&&point.clientX<=f.box.x+f.box.width&&point.clientY>=f.box.y&&point.clientY<=f.box.y+f.box.height+12))candidates.push({x,y,point});
}
assert.ok(candidates.length);const destination=candidates[0];el('board').onpointerdown(destination.point);el('board').onpointerup(destination.point);
assert.match(el('confirm-order').textContent,/Confirm move/);assert.match(el('board-hint').textContent,/WHITE DESTINATION/);assert.ok(drawnLabels.includes('✓'));assert.ok(fills.includes('#f4fdff'));assert.deepEqual(JSON.parse(storage['lemma-debt-save-v1']),beforeMove);
el('confirm-order').onclick();const moved=JSON.parse(storage['lemma-debt-save-v1']);assert.equal(moved.battle.agents[1].x,destination.x);assert.equal(moved.battle.agents[1].y,destination.y);assert.equal(moved.battle.agents[1].ap,0);assert.doesNotMatch(el('board-hint').textContent,/WHITE DESTINATION/);
// Help and its rehearsal never replace the active operation's save.
const beforeGuide=storage['lemma-debt-save-v1'];el('help').onclick();assert.equal(el('modal').className,'modal help-modal');el('help-practice').onclick();assert.equal(storage['lemma-debt-save-v1'],beforeGuide);assert.equal(el('modal').className,'modal ');el('practice-exit').onclick();el('help').onclick();el('help-close').onclick();assert.equal(el('modal').hidden,true);assert.equal(storage['lemma-debt-save-v1'],beforeGuide);
console.log('Visual interaction: narrow-board figure selection, white destination, route preview, explicit move confirmation and save-safe help rehearsal passed.');
// Every legal destination center wins over sprite overlap, on both map projections.
for(const view of ['iso','flat']){
 el('board').getBoundingClientRect=()=>({width:view==='flat'?390:580,height:view==='flat'?390:360,left:0,top:0});
 if(view==='flat')el('map-view').onclick();
 const start=global.Lemma.fresh();global.Lemma.start(start);
 // Reproduce Astra's original overlapping destination geometry exactly.
 if(view==='iso'){start.battle.agents[0].x=1;start.battle.agents[0].y=7;start.battle.agents[1].x=2;start.battle.agents[1].y=7;start.battle.agents[2].x=1;start.battle.agents[2].y=6;}
 let checked=0;
 for(let y=0;y<9;y++)for(let x=0;x<9;x++){
  const o=global.Lemma.order(start,x,y);if(!o.ok||o.kind!=='move')continue;
  el('backup').onclick();el('save-import').value=JSON.stringify(start);el('restore').onclick();
  const cell=354/9,tw=Math.min(550/9,260/9*2,78),th=tw/2,oy=Math.max(70,(360-9*th)/2-16);
  const point=view==='flat'?{clientX:18+(x+.5)*cell,clientY:14+(y+.5)*cell}:{clientX:290+(x-y)*tw/2,clientY:oy+(x+y)*th/2+th/2};
  el('board').onpointerdown(point);el('board').onpointerup(point);assert.equal(el('confirm-order').disabled,false,view+' '+x+','+y);
  assert.match(el('confirm-order').textContent,/Confirm move/);el('confirm-order').onclick();const result=JSON.parse(storage['lemma-debt-save-v1']);assert.equal(result.battle.agents[0].x,x);assert.equal(result.battle.agents[0].y,y);checked++;
 }
 assert.ok(checked>=5);if(view==='flat'){assert.equal(el('grid-controls').hidden,false);assert.equal((el('grid-controls').innerHTML.match(/data-cell=/g)||[]).length,81);}
}
// Optional new save fields are validated rather than trusted as executable game state.
for(const fields of [{caseRecords:'not an array'},{caseRecords:[{mission:999,method:'verify',forced:false,repaired:false}]},{endingGaps:['bad']},{explainedMission:999}]){
 el('backup').onclick();el('save-import').value=JSON.stringify({...global.Lemma.fresh(),...fields});el('restore').onclick();assert.match(el('restore-message').textContent,/invalid/);
}
console.log('All legal move centers in both projections, original sprite-overlap regression, 81 keyboard-accessible grid cells and new save validation passed.');

// Repair can raise the rival head start to 25; that campaign must remain importable.
let repaired=global.Lemma.fresh();repaired.phase='decision';repaired.battle={captured:false,forced:true};global.Lemma.resolve(repaired,'verify');assert.ok(global.Lemma.repair(repaired,0));assert.equal(repaired.headstart,25);
el('backup').onclick();el('save-import').value=JSON.stringify(repaired);el('restore').onclick();assert.equal(JSON.parse(storage['lemma-debt-save-v1']).headstart,25);assert.match(el('screen').innerHTML,/CHECKED/);
console.log('Repaired evidence with maximum rival head start survives save import.');
// Actual version-1 battle snapshots generated by the published b1308d0 engine.
for(const mission of [3,6]){
 const legacy=require('./fixtures/legacy-op'+mission+'.json'),original=JSON.parse(JSON.stringify(legacy));
 el('backup').onclick();el('save-import').value=JSON.stringify(legacy);el('restore').onclick();
 el('backup').onclick();const roundtrip=JSON.parse(el('save-export').value);
 assert.equal(roundtrip.battle.rules,undefined);assert.deepEqual(roundtrip.battle.agents,original.battle.agents);assert.deepEqual(roundtrip.battle.exit,original.battle.exit);assert.deepEqual(roundtrip.battle.walls,original.battle.walls);assert.deepEqual(roundtrip.battle.network,original.battle.network);assert.equal(roundtrip.battle.agents[0].ap,0);
 assert.doesNotThrow(()=>global.Lemma.wait(roundtrip));assert.equal(roundtrip.battle.turn,1);
}
console.log('Published-engine battle fixtures retain layout, exit, actions, circuit and playable enemy response.');
