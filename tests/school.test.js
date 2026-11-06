'use strict';
const assert=require('node:assert/strict'),{E,play,switches}=require('./harness'),S=require('../school'),H=require('../hints'),T=require('../tutorial');
// Full legal playthroughs, including both signature routes and both circuit orders.
const runs=[];
for(let stage=0;stage<S.lessons.length;stage++)for(const alternate of [false,true]){
 const s=S.create(E,stage),b=s.battle,units=[...b.agents,...b.enemies];
 assert.equal(new Set(units.map(p=>p.x+','+p.y)).size,units.length);
 for(const p of [...units,b.target,b.lock,b.relay,...(b.network||[])].filter(Boolean))assert.ok(!b.walls.includes(p.x+','+p.y));
 const stats=play(s,{alreadyStarted:true,cooperate:alternate,reverse:alternate,objectiveFirst:alternate});
 assert.equal(s.phase,'decision');assert.ok(b.secured);assert.equal(stats.forced,false);assert.equal(b.rival,0);assert.equal(s.verified,0);assert.equal(s.caseRecords.length,0);
 if(stage===1)assert.equal(b.lock.unlocked,!alternate,'Both signature routes should finish');
 if(stage===2)assert.ok(b.network.every(n=>!n.on));
 if(stage===3){assert.equal(b.puzzle.progress,2);assert.ok(b.agents.filter(a=>a.hp>0&&E.dist(a,b.target)<=1).length>=2);}
 runs.push({class:stage+1,route:alternate?'alternate':'ordinary',...stats});
 const retry=S.create(E,stage,s);assert.equal(retry.school.stage,stage);assert.equal(retry.battle.turn,0);assert.ok(retry.battle.agents.every(a=>a.hp===a.max));
}
// The optional first-class guide offers legal, free previews and reaches upload.
let s=S.create(E),planned=null,mode='move';
for(let n=0;n<100&&s.phase==='battle';n++){
 T.ensure(s);const snapshot=JSON.stringify(s),hint=T.suggest(s,E,planned,mode);assert.equal(JSON.stringify(s),snapshot);
 if(hint.key==='confirm'){const r=mode==='ability'?E.ability(s,planned.x,planned.y):E.act(s,planned.x,planned.y);assert.ok(r.ok);T.record(s,r.kind);planned=null;mode='move';}
 else {const a=hint.action;if(a.kind==='plan'){s.battle.selected=a.agent;planned={x:a.x,y:a.y};mode=a.mode;assert.ok((mode==='ability'?E.abilityOrder(s,a.x,a.y):E.order(s,a.x,a.y)).ok);}else if(a.kind==='select'){s.battle.selected=a.agent;planned=null;mode='move';}else if(a.target==='wait')E.wait(s);else assert.fail('No executable school hint: '+JSON.stringify(hint));}
}
assert.equal(s.phase,'decision');assert.deepEqual(T.ensure(s).done.slice().sort(),T.lessons.slice().sort());
// Every authored objective, including new topologies and hearing, has a short tip.
const introduced=new Set();
for(let mission=0;mission<18;mission++){
 s=E.fresh();s.mission=mission;E.start(s);const snapshot=JSON.stringify(s),key=H.objective(s);introduced.add(key);assert.ok(H.tips[key]);assert.ok(H.candidates(s,null,'move').includes(key));assert.equal(JSON.stringify(s),snapshot);
 H.acknowledge(s,key);assert.equal(H.next(s,[key]),undefined);s=JSON.parse(JSON.stringify(s));assert.equal(H.next(s,[key]),undefined);s.battle.secured=true;assert.equal(H.objective(s),'upload');
}
assert.deepEqual([...introduced].sort(),['branch','cycle','hearing','network','paired','recovery']);
s=S.create(E,3);assert.match(H.tips[H.objective(s)][1],/consecutive rounds/);assert.ok(H.candidates(s,null,'move').includes('clerk'));s.battle.sealed=true;assert.equal(H.candidates(s,null,'move')[0],'sealed');s.coaching={off:true,seen:[]};assert.equal(H.next(s,['sealed']),null);assert.ok(H.tips[H.objective(s)],'manual explanation remains available while muted');
const fresh=S.create(E,0,s);assert.notEqual(fresh.coaching,s.coaching);assert.deepEqual(fresh.coaching,s.coaching);assert.equal(switches(S.create(E,2).battle).length,2);
console.log('Night school: eight full legal classroom playthroughs, both paired routes, two circuit routes, witnessed final decode, fresh retries, first-class guide and all campaign tip coverage passed.');
console.log('School playthrough evidence:',JSON.stringify(runs));
// Imported earlier battles keep explanations consistent with their older rules.
s=S.create(E,3);s.battle.rules=1;assert.equal(H.objective(s),'legacyHold');assert.match(H.explain(s,'force').text,/15 understanding/);assert.match(H.explain(s,'low').text,/restores 10/);assert.equal(H.context(s,{kind:'relay'},'move'),'legacyRelay');
