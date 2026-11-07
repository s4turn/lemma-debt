const E=require('../engine');
function switches(b){if(!b.network)return [];for(let mask=0;mask<16;mask++){const bits=b.network.map(n=>n.on);for(let i=0;i<4;i++)if(mask>>i&1)for(const n of E.affected(b,i))bits[n.id]=!bits[n.id];if(bits.every(x=>!x))return b.network.filter((n,i)=>mask>>i&1);}throw Error('Unsolvable network');}
// Plan in legal movement actions: walking through a switch is possible, but
// ending a normal move there would toggle it instead. Traverse has no such limit.
function routes(b,index,goal){const a=b.agents[index],key=p=>p.x+','+p.y;
 const occupied=new Set([...b.agents.filter((q,i)=>i!==index&&q.hp>0),...b.enemies.filter(e=>e.alive)].map(key));
 const controls=new Set([b.target,b.relay,b.lock&&!b.lock.unlocked?b.lock:null,...(b.network||[])].filter(Boolean).map(key));
 const queue=[{x:a.x,y:a.y,steps:[]}],seen=new Set([key(a)]),found=[];
 for(let head=0;head<queue.length;head++){const p=queue[head];if(E.dist(p,goal)<=1){found.push(p);continue;}
  const walking=[{x:p.x,y:p.y,d:0}],walked=new Set([key(p)]);
  for(let j=0;j<walking.length;j++){const q=walking[j];if(q.d===(index===2?3:2))continue;
   for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]){const n={x:q.x+dx,y:q.y+dy,d:q.d+1},k=key(n);
    if(n.x<0||n.y<0||n.x>=E.N||n.y>=E.N||walked.has(k)||occupied.has(k)||E.blocked(b,n.x,n.y))continue;
    walked.add(k);walking.push(n);if(seen.has(k)||(index!==2&&controls.has(k)))continue;
    seen.add(k);queue.push({x:n.x,y:n.y,steps:p.steps.concat([{x:n.x,y:n.y,ability:index===2,distance:n.d}])});
   }
  }
 }
 return found.sort((a,z)=>a.steps.length-z.steps.length);
}
function nextSwitch(b,reverse){if(!switches(b).length)return null;const orders=[];
 const permute=(prefix,rest)=>{if(!rest.length){orders.push(prefix);return;}for(const id of rest)permute(prefix.concat(id),rest.filter(x=>x!==id));};
 for(let mask=1;mask<16;mask++){let bits=b.network.reduce((n,q)=>n|(q.on?1<<q.id:0),0);const ids=[];
  for(let id=0;id<4;id++)if(mask>>id&1){ids.push(id);for(const n of E.affected(b,id))bits^=1<<n.id;}
  if(!bits)permute([],ids);
 }
 orders.sort((a,z)=>a.length-z.length||a.join('').localeCompare(z.join('')));if(reverse)orders.reverse();
 for(const ids of orders){const copy=JSON.parse(JSON.stringify(b));let possible=true;
  for(const id of ids){const choices=[];for(let i=0;i<copy.agents.length;i++)if(copy.agents[i].hp>0){const route=routes(copy,i,copy.network[id])[0];if(route)choices.push({i,route});}
   choices.sort((a,z)=>a.route.steps.length-z.route.steps.length);if(!choices.length){possible=false;break;}
   const {i,route}=choices[0];copy.agents[i].x=route.x;copy.agents[i].y=route.y;for(const n of E.affected(copy,id))n.on=!n.on;
  }
  if(possible)return b.network[ids[0]];
 }
 throw Error('No physically reachable switch ordering for operation circuit');
}
function play(s,{force=false,reverse=false,alreadyStarted=false,cooperate=false,objectiveFirst=false}={}){if(!alreadyStarted)E.start(s);const b=s.battle;let orders=0,attacks=0,abilities=0,relays=0;for(let tick=0;tick<1000&&s.phase==='battle';tick++){
 E.ensureRound(b);const ready=b.agents.map((a,i)=>({a,i})).filter(z=>z.a.hp>0&&z.a.ap);
 const targetReachable=force&&b.agents.some((a,i)=>a.hp>0&&routes(b,i,b.target).length);
 const node=!b.secured&&!b.sealed&&!(force&&targetReachable)?nextSwitch(b,reverse):null;
 const goal=b.secured?b.exit:b.sealed?b.relay:force&&targetReachable?b.target:node||b.lock&&!b.lock.unlocked&&!cooperate&&b.lock||b.target;
 const direct=[];for(const {a,i} of ready){b.selected=i;const o=E.order(s,goal.x,goal.y);if(o.ok&&o.kind!=='move'&&o.kind!=='attack')direct.push({i,o});}
 // Finish a held channel before doing optional fighting, and upload without a return trip.
 const immediate=direct.find(z=>z.o.kind==='extract'||z.o.kind==='secure'&&b.puzzle.progress>0||z.o.kind==='relay'||objectiveFirst);
 if(immediate){b.selected=immediate.i;E.act(s,goal.x,goal.y);orders++;if(immediate.o.kind==='relay')relays++;continue;}
 // The logician protects an exposed decoder and interrupts all filing for a response.
 const channel=b.puzzle.progress?b.agents[b.puzzle.channel]:null;
 if(channel&&ready.some(z=>z.i===1)&&b.enemies.some(e=>e.alive&&E.powered(b,e)&&e.intent?.kind==='fire'&&e.intent.x===channel.x&&e.intent.y===channel.y)&&E.dist(b.agents[1],channel)<=2){b.selected=1;E.ability(s,0,0);abilities++;orders++;continue;}
 const shots=[];for(const {i} of ready){b.selected=i;for(const e of b.enemies.filter(e=>e.alive)){const o=E.order(s,e.x,e.y);if(o.ok&&o.kind==='attack')shots.push({i,e,o});}}
 if(shots.length){shots.sort((a,z)=>(z.e.hp<=z.o.damage?20:0)+(z.e.type==='clerk'?5:0)+z.o.damage-((a.e.hp<=a.o.damage?20:0)+(a.e.type==='clerk'?5:0)+a.o.damage));const z=shots[0];b.selected=z.i;E.act(s,z.e.x,z.e.y);attacks++;orders++;continue;}
 let forced=false;if(force&&!b.secured&&!b.sealed){for(const {a,i} of ready)if(E.dist(a,b.target)<=1){b.selected=i;if(E.forceDecode(s)){forced=true;orders++;break;}}}if(forced)continue;
 if(direct.length){const z=direct[0];b.selected=z.i;E.act(s,goal.x,goal.y);orders++;continue;}
 const options=[];for(const {a,i} of ready){if(b.puzzle.progress&&b.puzzle.channel===i)continue;b.selected=i;
 // Do not make a witness leave the hearing while bringing in the second.
 if(E.dist(a,goal)<=1&&goal===b.target&&(b.hearing||cooperate))continue;
 for(const route of routes(b,i,goal)){const step=route.steps[0];if(!step)continue;const {x,y,ability}=step,o=ability?E.abilityOrder(s,x,y):E.order(s,x,y);if(o.ok&&['move','traverse'].includes(o.kind)){const danger=b.enemies.filter(e=>e.alive&&E.powered(b,e)&&e.intent?.kind==='fire'&&e.intent.x===x&&e.intent.y===y).reduce((n,e)=>n+e.intent.damage,0);options.push({i,x,y,ability,score:route.steps.length*2+danger*3});}}}
 if(!options.length){E.wait(s);continue;}options.sort((a,z)=>a.score-z.score);const z=options[0];b.selected=z.i;const r=z.ability?E.ability(s,z.x,z.y):E.act(s,z.x,z.y);if(!r.ok)throw Error('Invalid planned order '+JSON.stringify(r));orders++;if(z.ability)abilities++;
 }
 if(s.phase!=='decision')throw Error(`Operation ${s.mission+1} failed: ${s.phase} turn ${b.turn} ${b.log.join('; ')}`);return {rounds:b.turn,orders,attacks,abilities,relays,damage:b.agents.reduce((n,a)=>n+a.max-a.hp,0),understanding:s.understanding,forced:!!b.forced,captured:b.captured};
}
module.exports={E,play,switches,routes,nextSwitch};
