'use strict';const assert=require('node:assert/strict');const {E,play,switches}=require('./harness');
const results=[];
for(const route of ['verify','automate','mixed']){let s=E.fresh(),rows=[];E.buy(s,'tools');for(let i=0;i<18;i++){while(s.understanding<50&&s.credits>=25)E.buy(s,'seminar');rows.push(play(s));s=JSON.parse(JSON.stringify(s));assert.ok(E.resolve(s,route==='mixed'?(i%2?'automate':'verify'):route));if(s.phase==='ending'){assert.equal(s.ending,route==='verify'?'commons':route==='automate'?'hollow':'contested');if(i<17)assert.ok(E.continueCampaign(s));}}assert.equal(s.mission,18);assert.equal(s.caseRecords.length,18);results.push({route,rounds:rows.map(r=>r.rounds),ending:s.ending});}
console.log('Full campaign policies:',JSON.stringify(results));
// Every previewed legal destination must execute exactly, independent of sprites.
let s=E.fresh();E.start(s);for(let y=0;y<9;y++)for(let x=0;x<9;x++){const o=E.order(s,x,y);if(o.ok&&o.kind==='move'){const copy=JSON.parse(JSON.stringify(s));assert.ok(E.act(copy,x,y).ok);assert.equal(copy.battle.agents[0].x,x);assert.equal(copy.battle.agents[0].y,y);assert.equal(copy.battle.agents[0].ap,0);}}
// Recovery uploads at the record. A distant agent cannot remotely extract the squad.
s=E.fresh();E.start(s);let b=s.battle;b.secured=true;assert.equal(E.order(s,b.exit.x,b.exit.y).ok,false);b.agents[0].x=b.exit.x;b.agents[0].y=b.exit.y;b.agents[1].x=b.exit.x+1;b.agents[1].y=b.exit.y;b.selected=1;assert.equal(E.order(s,b.exit.x,b.exit.y).kind,'extract');assert.ok(E.act(s,b.exit.x,b.exit.y).ok);assert.equal(s.phase,'decision');
// Explain does not refresh through abort, defeat, restart or JSON restoration.
s=E.fresh();s.understanding=20;E.start(s);assert.ok(E.recenter(s));assert.equal(s.understanding,26);for(let i=0;i<8;i++){E.abort(s);s=JSON.parse(JSON.stringify(s));E.start(s);assert.equal(E.recenter(s),false);}assert.equal(s.understanding,26);
// Telegraphed fire hits the shown tile; walking aside avoids it.
s=E.fresh();E.start(s);b=s.battle;b.enemies=[{x:1,y:3,hp:4,max:4,id:0,alive:true,type:'sentinel'}];E.planEnemies(s);const aim={...b.enemies[0].intent};assert.equal(aim.kind,'fire');const victim=b.agents.find(a=>a.x===aim.x&&a.y===aim.y);const hp=victim.hp;victim.x=0;E.wait(s);assert.equal(victim.hp,hp);
// Ada interrupts a certifier; Wren protects a decoder; Quill can traverse at low understanding.
s=E.fresh();E.start(s);b=s.battle;b.enemies=[{x:1,y:3,hp:4,max:4,id:0,alive:true,type:'clerk'}];E.planEnemies(s);b.selected=0;assert.ok(E.ability(s,1,3).ok);E.wait(s);assert.equal(b.certification,0);
s=E.fresh();s.mission=5;E.start(s);b=s.battle;b.enemies=[{x:5,y:1,hp:4,max:4,id:0,alive:true,type:'sentinel'}];b.agents[0].x=5;b.agents[0].y=2;b.agents[1].x=4;b.agents[1].y=2;b.agents[2].x=5;b.agents[2].y=4;E.planEnemies(s);assert.ok(E.act(s,5,3).ok);assert.equal(b.puzzle.progress,1);b.selected=1;assert.ok(E.ability(s,0,0).ok);E.wait(s);assert.equal(b.puzzle.progress,1);b.selected=0;assert.ok(E.act(s,5,3).ok);assert.ok(b.secured);
s=E.fresh();s.understanding=10;E.start(s);b=s.battle;b.selected=2;b.turn=3;let traverse;for(let y=0;y<9;y++)for(let x=0;x<9;x++){const o=E.abilityOrder(s,x,y);if(o.ok&&o.path.length===3)traverse={x,y};}assert.ok(traverse);assert.ok(E.ability(s,traverse.x,traverse.y).ok);assert.equal(b.agents[2].x,traverse.x);
// A real hold resets on damage, departure, or missing the following round.
for(const cause of ['damage','departure','delay']){s=E.fresh();s.mission=5;E.start(s);b=s.battle;b.enemies=[];b.hearing=false;b.agents[0].x=5;b.agents[0].y=2;assert.ok(E.act(s,5,3).ok);if(cause==='damage'){b.enemies=[{x:5,y:1,hp:4,id:0,alive:true,type:'sentinel'}];E.planEnemies(s);E.wait(s);}else if(cause==='departure'){E.wait(s);b.selected=0;assert.ok(E.act(s,5,0).ok);}else{E.wait(s);E.wait(s);}assert.equal(b.puzzle.progress,0,cause);}
// Filing seals the evidence; the console reopens it. Killing a clerk is not a retroactive unseal.
s=E.fresh();E.start(s);b=s.battle;b.enemies=[{x:7,y:7,hp:4,id:0,alive:true,type:'clerk'}];E.planEnemies(s);for(let i=0;i<3;i++)E.wait(s);assert.ok(b.sealed);b.agents[0].x=b.relay.x;b.agents[0].y=b.relay.y+1;assert.ok(E.act(s,b.relay.x,b.relay.y).ok);assert.equal(b.sealed,false);assert.equal(b.certification,0);
// Circuit edges really affect movement, sight and powered enemies, and each configured state is solvable.
for(const i of [2,8,14]){s=E.fresh();s.mission=i;E.start(s);b=s.battle;assert.ok(switches(b).length);const g=b.gates.find(g=>E.gateClosed(b,g));assert.ok(g);assert.ok(E.blocked(b,g.x,g.y));b.network[g.node].on=false;assert.equal(E.blocked(b,g.x,g.y),false);for(const e of b.enemies.filter(e=>e.node!==undefined)){b.network[e.node].on=false;assert.equal(E.powered(b,e),false);}for(let bits=0;bits<16;bits++){b.network.forEach((n,j)=>n.on=!!(bits>>j&1));let count=0;for(let mask=0;mask<16;mask++){const next=b.network.map(n=>n.on);for(let j=0;j<4;j++)if(mask>>j&1)for(const n of E.affected(b,j))next[n.id]=!next[n.id];if(next.every(x=>!x))count++;}if(i===14)assert.ok(count===0||count===2,'Cooling graph has two solutions on its reachable states');else assert.equal(count,1,'Unique solution for configured graph '+i);}}
// Specific dependencies, not totals, determine the checked ending.
s=E.fresh();for(let i=0;i<6;i++){s.phase='decision';s.battle={captured:false};E.resolve(s,i<4?'verify':'automate');}assert.equal(s.ending,'contested');assert.deepEqual(s.endingGaps,[4,5]);
s=E.fresh();s.phase='decision';s.battle={captured:false,forced:true};E.resolve(s,'verify');assert.equal(E.caseStatus(s,0),'fragile');const credit=s.credits;assert.ok(E.repair(s,0));assert.equal(s.credits,credit-30);assert.equal(E.caseStatus(s,0),'checked');assert.equal(E.repair(s,0),false);
// Publication choices change actual next-board enforcement, and repairs change that consequence.
for(const method of ['verify','automate']){s=E.fresh();s.phase='decision';s.battle={captured:false};E.resolve(s,method);E.start(s);assert.equal(s.battle.consequence,method==='verify'?'checked':'contested');assert.equal(s.battle.jammed,method==='verify');assert.equal(s.battle.enemies.filter(e=>e.type==='clerk').length,method==='verify'?1:2);}
// Saving during a channel preserves queued threats, shields, circuit and the decoder identity.
s=E.fresh();s.mission=5;E.start(s);b=s.battle;b.agents[0].x=5;b.agents[0].y=2;E.act(s,5,3);const copy=JSON.parse(JSON.stringify(s));E.wait(s);E.wait(copy);assert.deepEqual(copy,s);
// Multiple routes are viable but have different costs. This is policy evidence, not human fun.
const comparisons=[];for(const mission of [0,1,2,5,8,14,17]){const row={mission:mission+1};for(const [name,opts] of Object.entries({ordinary:{},alternate:{reverse:true,cooperate:true,objectiveFirst:true},forced:{force:true}})){const q=E.fresh();q.mission=mission;row[name]=play(q,opts);}assert.equal(row.forced.understanding,60);comparisons.push(row);}console.log('Representative route comparisons:',JSON.stringify(comparisons));
console.log('Extraction, abort recovery, intent, roles, protected hold, certification, topology, case dependencies, branching boards and save persistence passed.');
// The reviewed full-bypass policy is viable as an emergency route, but cannot earn checked endings for free.
let bypass=E.fresh(),bypassEndings=[];E.buy(bypass,'tools');for(let i=0;i<18;i++){while(bypass.understanding<45&&bypass.credits>=25)E.buy(bypass,'seminar');assert.ok(bypass.understanding>=20);play(bypass,{force:true});assert.equal(bypass.battle.forced,true);E.resolve(bypass,'verify');if(bypass.phase==='ending'){bypassEndings.push(bypass.ending);assert.notEqual(bypass.ending,'commons');if(i<17)E.continueCampaign(bypass);}}console.log('Forced-access campaign:',JSON.stringify({endings:bypassEndings,understanding:bypass.understanding,credits:bypass.credits}));
// Authored geometry never places a unit or required control inside a static wall or another unit.
for(let i=0;i<18;i++){const q=E.fresh();q.mission=i;E.start(q);const z=q.battle,units=[...z.agents,...z.enemies];assert.equal(new Set(units.map(p=>p.x+','+p.y)).size,units.length,'unit overlap '+i);for(const p of [...units,z.target,z.relay,z.lock,...(z.network||[])].filter(Boolean))assert.ok(!z.walls.includes(p.x+','+p.y),'wall overlap '+i+' '+p.x+','+p.y);}

// Staying at a relay cannot suppress every enemy response. Cooling uses retain
// their seal/rival utility, and old saves without a cooldown remain loadable.
function relayFixture(rules=2){const q=E.fresh();q.mission=1;E.start(q);const z=q.battle;z.rules=rules;z.walls=[];z.lock=null;z.relay={x:2,y:3,used:false};z.agents[0].x=2;z.agents[0].y=2;z.agents[1].x=1;z.agents[1].y=3;z.agents[2].x=0;z.agents[2].y=4;z.enemies=[{x:2,y:0,hp:4,max:4,id:0,alive:true,type:'sentinel'}];z.rival=70;E.planEnemies(q);return q;}
s=relayFixture();b=s.battle;const relayHP=b.agents[0].hp;
assert.equal(E.relayReady(b),true);assert.equal(b.relay.lastStayRound,undefined);
assert.match(E.order(s,2,3).detail,/cancel the next enemy response/);
assert.ok(E.act(s,2,3).ok);assert.equal(b.relay.lastStayRound,0);assert.equal(b.jammed,true);assert.equal(b.rival,30);
E.wait(s);assert.equal(b.turn,1);assert.equal(b.agents[0].hp,relayHP);assert.equal(E.relayReady(b),false);
b.sealed=true;b.certification=3;b.rival=80;
const resumedRelay=JSON.parse(JSON.stringify(s)),cooling=E.order(s,2,3);
assert.equal(cooling.ok,true,'Cooling consoles must still be usable to reopen a seal');
assert.match(cooling.label,/cooling.*no cancellation/i);assert.match(cooling.detail,/round 3/);
assert.deepEqual(E.order(resumedRelay,2,3),cooling,'Save restoration retains the exact cooling preview');
for(const q of [s,resumedRelay]){assert.ok(E.act(q,2,3).ok);assert.equal(q.battle.jammed,false);assert.equal(q.battle.sealed,false);assert.equal(q.battle.certification,0);assert.equal(q.battle.rival,40);assert.equal(q.battle.relay.lastStayRound,0);E.wait(q);}
assert.deepEqual(s,resumedRelay,'Restored cooldowns execute identically');
assert.equal(b.turn,2);assert.equal(b.agents[0].hp,relayHP-3,'The cooling response must actually fire at its target');assert.equal(E.relayReady(b),true);
assert.ok(E.act(s,2,3).ok);assert.equal(b.relay.lastStayRound,2);E.wait(s);assert.equal(b.agents[0].hp,relayHP-3,'The recharged stay cancels its next response again');
// A second operator in the same round must neither renew nor erase a queued stay.
s=relayFixture();b=s.battle;assert.ok(E.act(s,2,3).ok);b.selected=1;assert.match(E.order(s,2,3).label,/cooling/i);assert.ok(E.act(s,2,3).ok);assert.equal(b.jammed,true);assert.equal(b.relay.lastStayRound,0);E.wait(s);assert.equal(b.agents[0].hp,b.agents[0].max);
// An earlier modern save can have used=true but no cooldown field. Its first new
// use is available; a historical one-use relay keeps its original behavior.
s=relayFixture();s.battle.relay.used=true;assert.equal(E.relayReady(s.battle),true);assert.ok(E.act(s,2,3).ok);assert.equal(s.battle.relay.lastStayRound,0);
s=relayFixture(1);b=s.battle;assert.equal(E.relayReady(b),true);assert.ok(E.act(s,2,3).ok);assert.equal(b.relay.lastStayRound,undefined);E.wait(s);assert.equal(b.agents[0].hp,b.agents[0].max);assert.equal(E.relayReady(b),false);assert.notEqual(E.order(s,2,3).kind,'relay');
console.log('Relay recharge: active shot between stays, cooling seal/rival utility, existing stay preservation, JSON restoration and legacy one-use behavior passed.');
// Movement wording follows the actual path length in both preview and incident log.
for(const length of [1,2]){s=E.fresh();E.start(s);b=s.battle;b.walls=[];b.enemies=[];const a=b.agents[0];a.x=3;a.y=3;const o=E.order(s,3+length,3);assert.equal(o.kind,'move');assert.equal(o.label,`Move · ${length} tile${length===1?'':'s'}`);assert.ok(E.act(s,3+length,3).ok);assert.equal(b.log[0],`${a.name} moves ${length} tile${length===1?'':'s'}.`);}

// Protection is a three-damage budget, not immunity to arbitrarily many small shots.
s=E.fresh();E.start(s);b=s.battle;b.agents[0].x=4;b.agents[0].y=4;b.agents[1].x=3;b.agents[1].y=4;b.walls=[];b.enemies=[{x:4,y:2,hp:4,max:4,id:0,alive:true,type:'sentinel',intent:{kind:'fire',x:4,y:4,damage:3}},{x:6,y:4,hp:4,max:4,id:1,alive:true,type:'sentinel',intent:{kind:'fire',x:4,y:4,damage:3}}];b.selected=1;E.ability(s,3,4);const shieldedHP=b.agents[0].hp;E.wait(s);assert.equal(b.agents[0].hp,shieldedHP-3);
