'use strict';
const assert=require('node:assert/strict');
const E=require('../engine');
const key=p=>p.x+','+p.y;
const maskOf=b=>b.network.reduce((mask,n)=>mask|(n.on?1<<n.id:0),0);
const setMask=(b,mask)=>b.network.forEach(n=>n.on=!!(mask>>n.id&1));
function solutions(b,initial=maskOf(b)){
 const answers=[];for(let subset=0;subset<16;subset++){let bits=initial;
  for(let id=0;id<4;id++)if(subset>>id&1)for(const n of E.affected(b,id))bits^=1<<n.id;
  if(!bits)answers.push(subset);
 }return answers;
}
function distance(b,agent,goal){let best=Infinity;
 for(let y=0;y<E.N;y++)for(let x=0;x<E.N;x++)if(E.dist({x,y},goal)<=1){const path=E.path(b,agent,{x,y},agent);if(path)best=Math.min(best,path.length);}
 return best;
}
// Exhaust the small position/signal subsystem using the actual order validator.
// Officers and other agents retain their starting occupancy. Threat responses,
// HP and action refresh are separate from this structural no-softlock check.
function auditAccess(s,index){const b=s.battle,a=b.agents[index];b.selected=index;
 const occupied=new Set([...b.agents.filter((q,i)=>i!==index&&q.hp>0),...b.enemies.filter(e=>e.alive)].map(key));
 const cells=[];for(let y=0;y<E.N;y++)for(let x=0;x<E.N;x++)if(!b.walls.includes(key({x,y}))&&!occupied.has(key({x,y})))cells.push(y*E.N+x);
 const reverse=new Map(),goals=b.network.concat([b.relay,b.target]),access=goals.map(()=>[]),darkGold=[];
 for(let mask=0;mask<16;mask++)for(const cell of cells){const id=mask*81+cell;reverse.set(id,[]);}
 let edges=0;
 for(let mask=0;mask<16;mask++){setMask(b,mask);
  for(const cell of cells){a.x=cell%E.N;a.y=Math.floor(cell/E.N);a.ap=1;const id=mask*81+cell;
   for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(Math.abs(dx)+Math.abs(dy)>0&&Math.abs(dx)+Math.abs(dy)<=2){
    const x=a.x+dx,y=a.y+dy,o=E.order(s,x,y);if(o.ok&&o.kind==='move'){const next=mask*81+y*E.N+x;assert.ok(reverse.has(next));reverse.get(next).push(id);edges++;}
   }
   for(let j=0;j<goals.length;j++){const goal=goals[j];if(E.dist(a,goal)<=1)access[j].push(id);}
   const secure=E.order(s,b.target.x,b.target.y);if(secure.ok&&secure.kind==='secure')darkGold.push(id);
   for(const node of b.network){const o=E.order(s,node.x,node.y);if(!o.ok||o.kind!=='toggle')continue;let nextMask=mask;for(const hit of E.affected(b,node.id))nextMask^=1<<hit.id;
    reverse.get(nextMask*81+cell).push(id);edges++;
   }
  }
 }
 function predecessors(seeds){const seen=new Set(seeds),queue=[...seen];for(let head=0;head<queue.length;head++)for(const previous of reverse.get(queue[head]))if(!seen.has(previous)){seen.add(previous);queue.push(previous);}return seen;}
 // Every position, even a switch reached by Traverse or a newly closed gate,
 // can regain access to every control and gold in every one of the 16 masks.
 for(let j=0;j<goals.length;j++)assert.equal(predecessors(access[j]).size,reverse.size,`Op${s.mission+1} agent${index}: inaccessible control ${j}`);
 const canFinish=predecessors(darkGold);
 for(let mask=0;mask<16;mask++)for(const cell of cells)assert.equal(canFinish.has(mask*81+cell),solutions(b,mask).length>0,`Op${s.mission+1} agent${index}: positional softlock at ${mask}/${cell}`);
 return {states:reverse.size,legalTransitions:edges};
}
const report=[];
for(const mission of [2,8,14,17]){const s=E.fresh();s.mission=mission;E.start(s);const b=s.battle,initial=maskOf(b),answers=solutions(b);
 assert.ok(answers.length);if(mission!==2){assert.ok(!answers.includes(5),'Later circuits must not repeat A+C');assert.ok(Math.min(...answers.map(x=>x.toString(2).replaceAll('0','').length))>=3);}
 const features=[...b.network,b.target,b.relay,...b.gates];assert.equal(new Set(features.map(key)).size,features.length,'A control must not hide another interaction');
 for(const p of features){assert.ok(p.x>=0&&p.y>=0&&p.x<E.N&&p.y<E.N);assert.ok(!b.walls.includes(key(p)));assert.ok(![...b.agents,...b.enemies].some(q=>key(p)===key(q)));}
 const gateEffects=[];
 for(const gate of b.gates){assert.ok(b.network.some(n=>n.id===gate.node));setMask(b,15);const closed=b.agents.flatMap(a=>[...b.network,b.target].map(goal=>distance(b,a,goal)));b.network[gate.node].on=false;const open=b.agents.flatMap(a=>[...b.network,b.target].map(goal=>distance(b,a,goal)));
  const differences=open.map((d,i)=>closed[i]-d).filter(d=>d>0);assert.ok(differences.some(d=>d>=2),`Op${mission+1}: door ${gate.node} must change a required route`);
  gateEffects.push({signal:gate.node,largestTileSaving:Math.max(...differences)===Infinity?'opens access':Math.max(...differences)});
 }
 const positions=[];for(let agent=0;agent<3;agent++){const q=E.fresh();q.mission=mission;E.start(q);positions.push(auditAccess(q,agent));}
 report.push({operation:mission+1,initial,solutions:answers,gateEffects,positions});
}
assert.equal(new Set(report.map(r=>r.solutions.join(','))).size,report.length,'Each authored circuit needs a different solution structure');
// Cooling's repeated source is a geographical choice, not adjacent duplicate buttons.
{const s=E.fresh();s.mission=14;E.start(s);const b=s.battle;
 assert.deepEqual(E.affected(b,0).map(n=>n.id),E.affected(b,1).map(n=>n.id));assert.ok(E.dist(b.network[0],b.network[1])>=6);
 const before=distance(b,b.agents[0],b.network[3]);assert.equal(before,Infinity);
 for(const n of E.affected(b,0))n.on=!n.on;assert.ok(Number.isFinite(distance(b,b.agents[0],b.network[3])));assert.ok(b.enemies.filter(e=>e.node!==undefined).every(e=>!E.powered(b,e)));
}
// Isolated final-hearing fixture: even after every officer is removed, the
// circuit, decoder, round boundary and witness remain real requirements.
{const s=E.fresh();s.mission=17;E.start(s);s.practice=true;const b=s.battle;b.enemies=[];
 Object.assign(b.agents[0],{x:6,y:2});Object.assign(b.agents[1],{x:6,y:1});Object.assign(b.agents[2],{x:8,y:1});setMask(b,12);
 b.selected=1;assert.equal(E.order(s,b.target.x,b.target.y).ok,false);assert.match(E.order(s,b.target.x,b.target.y).detail,/every connected signal OFF/);
 b.selected=0;assert.ok(E.act(s,b.network[3].x,b.network[3].y).ok);assert.equal(maskOf(b),0);
 b.selected=1;assert.ok(E.act(s,b.target.x,b.target.y).ok);assert.equal(b.puzzle.progress,1);assert.equal(b.secured,false);
 b.selected=2;assert.ok(E.act(s,8,3).ok);assert.equal(b.turn,1,'The last action must execute the intervening response');
 b.selected=1;assert.equal(E.order(s,b.target.x,b.target.y).ok,false);assert.match(E.order(s,b.target.x,b.target.y).detail,/second living witness/);
 const lit=JSON.parse(JSON.stringify(s));lit.battle.selected=0;assert.ok(E.act(lit,lit.battle.network[3].x,lit.battle.network[3].y).ok);lit.battle.selected=1;assert.equal(E.order(lit,b.target.x,b.target.y).ok,false);assert.match(E.order(lit,b.target.x,b.target.y).detail,/every connected signal OFF/);
 const wrong=JSON.parse(JSON.stringify(s));Object.assign(wrong.battle.agents[2],{x:8,y:1});wrong.battle.selected=2;assert.equal(E.order(wrong,7,1).ok,false);assert.match(E.order(wrong,7,1).detail,/same decoder/);
 const resumed=JSON.parse(JSON.stringify(s));for(const state of [s,resumed]){state.battle.selected=2;assert.ok(E.ability(state,8,1).ok);state.battle.selected=1;assert.ok(E.act(state,7,1).ok);assert.ok(state.battle.secured);}
 assert.deepEqual(resumed,s,'A restored final hearing executes identically');
}
console.log('Circuit progression, every-state legal access, material doors and combined final hearing:',JSON.stringify(report));
