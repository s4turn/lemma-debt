/* Small playable introductions using the same rules as the campaign. */
(function(root){'use strict';
const E=root.Lemma||(typeof require==='function'?require('./engine'):null);
const titles={combat:'Move, then attack',paired:'Two signatures',hold:'Hold across rounds',network:'Linked switches'};
function create(kind){
  const s=E.fresh();E.start(s);const b=s.battle;s.practice=kind;
  b.walls=[];for(let x=0;x<9;x++)for(let y=0;y<9;y++)if(x>3||y>3)b.walls.push(x+','+y);
  b.target={x:3,y:0};b.exit={x:0,y:0};b.relay=null;b.lock=null;b.enemies=[];b.rival=0;
  b.agents.forEach((a,i)=>{a.x=i;a.y=3;a.ap=1;if(kind!=='paired'&&kind!=='hold'&&i>0){a.hp=0;a.ap=0}});
  b.puzzle={type:kind==='combat'?'recovery':kind,progress:0,lastRound:-1};
  if(kind==='combat')b.enemies=[{x:3,y:0,id:0,hp:4,max:4,alive:true}];
  if(kind==='paired'){b.agents[0].x=1;b.agents[1].x=3;b.agents[2].hp=0;b.agents[2].ap=0;b.lock={x:8,y:8,unlocked:false}}
  if(kind==='hold'){b.agents[0].x=1;b.agents[0].y=1;b.target={x:2,y:1}}
  if(kind==='network'){b.agents[0].x=1;b.agents[0].y=1;b.network=[[0,1],[1,0],[2,1],[1,2]].map(([x,y],id)=>({x,y,id,on:[true,false,true,true][id]}))}
  b.log=['Practice board. Campaign progress is untouched.'];return s;
}
function done(s){return s.practice==='combat'?s.battle.enemies.every(e=>!e.alive):s.practice==='network'?s.battle.network.every(n=>!n.on):s.battle.secured}
function hint(s){let b=s.battle,a=b.agents[b.selected];if(s.phase==='failed')return 'Training accident. Reset board → try again.';if(done(s))return '✓ Rehearsal complete. The company denies this counted as training.';
  if(!a.ap)return 'Action spent → select READY or end round.';
  if(s.practice==='network')return 'Tap a switch → preview flips → make all four OFF.';
  if(s.practice==='paired')return 'Bring 1 and 2 beside ◆. Then secure it.';
  if(s.practice==='hold')return b.puzzle.progress?'1/2 decoded → next round → decode again.':'Tap adjacent ◆ → decode once this round.';
  return b.enemies.some(e=>e.alive&&E.order(s,e.x,e.y).ok)?'Red officer in range → preview damage → attack.':'Blue tiles → move into firing range.';
}
root.LemmaPractice={create,done,hint,titles};if(typeof module!=='undefined')module.exports=root.LemmaPractice;
})(typeof globalThis!=='undefined'?globalThis:this);
