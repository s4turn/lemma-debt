'use strict';
const assert=require('node:assert/strict'),E=require('../engine.js'),T=require('../tutorial.js');
// Follow every offered preview through the real rules. Coaching must finish the
// first mission, never spend an action itself, and never suggest an invalid order.
let s=E.fresh();E.start(s);let planned=null,mode='move',seen=new Set();
for(let step=0;step<100&&s.phase==='battle';step++){
 T.ensure(s);const before=JSON.stringify(s),hint=T.suggest(s,E,planned,mode);assert.equal(JSON.stringify(s),before);seen.add(hint.key);
 if(hint.key==='confirm'){
  const order=mode==='ability'?E.ability(s,planned.x,planned.y):E.act(s,planned.x,planned.y);assert.ok(order.ok);T.record(s,order.kind);planned=null;mode='move';
 }else{const action=hint.action;if(action.kind==='plan'){s.battle.selected=action.agent;planned={x:action.x,y:action.y};mode=action.mode;assert.ok((mode==='ability'?E.abilityOrder(s,planned.x,planned.y):E.order(s,planned.x,planned.y)).ok,JSON.stringify(hint));}
 else if(action.kind==='select'){s.battle.selected=action.agent;planned=null;mode='move';}
 else if(action.target==='wait')E.wait(s);else assert.fail('No playable next step: '+JSON.stringify(hint));}
 s=JSON.parse(JSON.stringify(s)); // mid-tutorial saves must resume accurately
}
assert.equal(s.phase,'decision');assert.deepEqual([...s.battle.guide.done].sort(),[...T.lessons].sort());for(const key of ['move','attack','ability','select','recover','upload'])assert.ok(seen.has(key),key);
// Players may ignore/reorder the lessons, dismiss them, or load an older battle.
s=E.fresh();E.start(s);T.record(s,'attack');assert.equal(T.suggest(s,E,null,'move').key,'move');T.ensure(s).off=true;const snapshot=JSON.stringify(s);assert.equal(T.suggest(s,E,null,'move'),null);assert.equal(JSON.stringify(s),snapshot);T.ensure(s).off=false;assert.equal(T.suggest(s,E,null,'move').key,'move');
s.battle.rules=undefined;assert.equal(T.ensure(s),null);s.mission=1;s.battle.rules=2;assert.equal(T.ensure(s),null);
console.log('Tutorial: all six lessons, valid suggested orders, zero-cost previews, live-rule completion, save round trips, out-of-order play, skip/resume and legacy exclusion passed.');

// A danger warning moves the threatened agent, not a more conveniently placed ally.
s=E.fresh();E.start(s);T.ensure(s).done=['move','attack','ability','round'];s.battle.enemies=[{x:1,y:2,hp:4,max:4,id:0,alive:true,type:'sentinel',intent:{kind:'fire',x:s.battle.agents[0].x,y:s.battle.agents[0].y,damage:3}}];const evade=T.suggest(s,E,null,'move');assert.equal(evade.key,'danger');assert.equal(evade.action.kind,'plan');assert.equal(evade.action.agent,s.battle.selected);assert.notDeepEqual({x:evade.action.x,y:evade.action.y},{x:s.battle.agents[0].x,y:s.battle.agents[0].y});
