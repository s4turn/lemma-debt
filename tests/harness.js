const E=require('../engine');
function switches(b){if(!b.network)return [];for(let mask=0;mask<16;mask++){const bits=b.network.map(n=>n.on);for(let i=0;i<4;i++)if(mask>>i&1)for(const n of E.affected(b,i))bits[n.id]=!bits[n.id];if(bits.every(x=>!x))return b.network.filter((n,i)=>mask>>i&1);}throw Error('Unsolvable network');}
function play(s,{force=false,reverse=false,alreadyStarted=false,cooperate=false,objectiveFirst=false}={}){if(!alreadyStarted)E.start(s);const b=s.battle;let orders=0,attacks=0,abilities=0,relays=0;for(let tick=0;tick<1000&&s.phase==='battle';tick++){
 E.ensureRound(b);const ready=b.agents.map((a,i)=>({a,i})).filter(z=>z.a.hp>0&&z.a.ap);
 let nodes=switches(b);if(reverse)nodes.reverse();const goal=b.secured?b.exit:b.sealed?b.relay:force?b.target:nodes.length?nodes[0]:b.lock&&!b.lock.unlocked&&!cooperate?b.lock:b.target;
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
 for(let x=0;x<9;x++)for(let y=0;y<9;y++){if(Math.abs(x-goal.x)+Math.abs(y-goal.y)>1)continue;const p=E.path(b,a,{x,y},a);if(!p?.length)continue;for(const step of [p[Math.min(i===2?3:2,p.length)-1],p[0]]){const ability=i===2&&p.length>2,o=ability?E.abilityOrder(s,step.x,step.y):E.order(s,step.x,step.y);if(o.ok&&['move','traverse'].includes(o.kind)){const danger=b.enemies.filter(e=>e.alive&&E.powered(b,e)&&e.intent?.kind==='fire'&&e.intent.x===step.x&&e.intent.y===step.y).reduce((n,e)=>n+e.intent.damage,0);options.push({i,x:step.x,y:step.y,ability,score:p.length+danger*3});break;}}}}
 if(!options.length){E.wait(s);continue;}options.sort((a,z)=>a.score-z.score);const z=options[0];b.selected=z.i;const r=z.ability?E.ability(s,z.x,z.y):E.act(s,z.x,z.y);if(!r.ok)throw Error('Invalid planned order '+JSON.stringify(r));orders++;if(z.ability)abilities++;
 }
 if(s.phase!=='decision')throw Error(`Operation ${s.mission+1} failed: ${s.phase} turn ${b.turn} ${b.log.join('; ')}`);return {rounds:b.turn,orders,attacks,abilities,relays,damage:b.agents.reduce((n,a)=>n+a.max-a.hp,0),understanding:s.understanding,forced:!!b.forced,captured:b.captured};
}
module.exports={E,play,switches};
