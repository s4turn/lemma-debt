/* Fixed first-school demonstration. Only matching player input advances it. */
(function(root){'use strict';
const steps=[
 {kind:'select',agent:0,title:'Select Ada',text:'Tap Dr. Ada Null’s highlighted squad card, or her figure marked 1.',focus:'agents'},
 {kind:'tile',agent:0,x:3,y:5,mode:'move',action:'move',title:'Choose the marked blue tile',text:'Tap the tile marked HERE (4,6). This only previews a two-tile move.',focus:'board'},
 {kind:'confirm',agent:0,x:3,y:5,mode:'move',action:'move',title:'Confirm Ada’s move',text:'The white route is a preview. Tap Confirm move to spend Ada’s one action.',focus:'confirm-order'},
 {kind:'select',agent:1,title:'Select Wren',text:'Ada is ACTED. Tap Prof. Emil Wren’s highlighted READY card.',focus:'agents'},
 {kind:'mode',agent:1,mode:'ability',title:'Prepare Wren’s shield',text:'The gunner will fire at Wren’s red-crossed tile. Tap Injunction · protect.',focus:'ability'},
 {kind:'confirm',agent:1,x:2,y:5,mode:'ability',action:'protect',title:'Confirm protection',text:'Tap Injunction · protect nearby allies. Wren’s shield absorbs 3 damage during the next response.',focus:'confirm-order'},
 {kind:'wait',title:'Let the enemy respond',text:'Tap End round. Quill’s unused action is lost; Wren’s shield will absorb the shot. Everyone then becomes READY.',focus:'wait'},
 {kind:'select',agent:0,title:'Select Ada again',text:'The shield absorbed the shot. Select Ada: her action has refreshed for the new round.',focus:'agents'},
 {kind:'mode',agent:0,mode:'attack',title:'Choose Attack',text:'Tap Attack to aim. Selecting an attack does not fire it.',focus:'mode-attack'},
 {kind:'tile',agent:0,x:5,y:5,mode:'attack',action:'attack',title:'Target the training gunner',text:'Tap the red-ringed gunner marked HERE (6,6). The preview will show 4 → 2 HP.',focus:'board'},
 {kind:'confirm',agent:0,x:5,y:5,mode:'attack',action:'attack',title:'Fire Ada’s shot',text:'Tap Attack · 2 damage. One action reduces the gunner from 4 to 2 HP.',focus:'confirm-order'},
 {kind:'select',agent:1,title:'Select Wren to finish the attack',text:'Ada has acted. Select Wren’s READY card; he can still fire this round.',focus:'agents'},
 {kind:'tile',agent:1,x:5,y:5,mode:'attack',action:'attack',title:'Aim directly at the gunner',text:'You can also tap an officer directly, without the Attack button. Tap HERE (6,6).',focus:'board'},
 {kind:'confirm',agent:1,x:5,y:5,mode:'attack',action:'attack',title:'Cancel its order by defeating it',text:'Tap Attack · 2 damage. At 0 HP the gunner is defeated and its queued shot is cancelled.',focus:'confirm-order'},
 {kind:'select',agent:2,title:'Select Quill',text:'Quill is still READY. Select her highlighted card to try her longer move.',focus:'agents'},
 {kind:'mode',agent:2,mode:'ability',title:'Prepare Traverse',text:'Tap Traverse · 3 tiles. Quill can move one tile farther than a normal move.',focus:'ability'},
 {kind:'tile',agent:2,x:4,y:4,mode:'ability',action:'traverse',title:'Choose Quill’s marked destination',text:'Tap HERE (5,5), beside gold. The white route shows all three steps.',focus:'board'},
 {kind:'confirm',agent:2,x:4,y:4,mode:'ability',action:'traverse',title:'Confirm the last READY action',text:'Confirm Quill’s move. Using the last READY action ends the round automatically. The defeated gunner cannot respond.',focus:'confirm-order'},
 {kind:'release',title:'Now you have command',text:'After Take command, choose your own orders. Recover the gold attendance register, then upload it. You choose the remaining orders. Ratio will grade your initiative as insubordination.',focus:'tutorial'}
];
function active(s){return !!(s?.school?.stage===0&&s.school.drill&&!s.school.drill.skipped&&s.school.drill.step<steps.length&&s.phase==='battle');}
function current(s){return active(s)?steps[s.school.drill.step]:null;}
function sameMode(a,b){return a==='ability'?b==='ability':b!=='ability';}
function allowed(s,event){const step=current(s);if(!step)return true;if(event.kind!==step.kind)return false;if(step.agent!==undefined){if(event.kind==='select'){if(event.agent!==step.agent)return false;}else if(s.battle.selected!==step.agent)return false;}
 if(['tile','confirm'].includes(step.kind)&&(!(event.x===step.x&&event.y===step.y)||!sameMode(step.mode,event.mode)))return false;
 if(step.kind==='mode'&&event.mode!==step.mode)return false;
 if(step.kind==='confirm'&&event.action!==step.action)return false;return true;
}
function advance(s,event){if(!active(s)||!allowed(s,event))return false;s.school.drill.step++;return true;}
function preview(s,x,y,mode,action){const step=current(s);return !step||(['tile','confirm'].includes(step.kind)&&step.agent===s.battle.selected&&step.x===x&&step.y===y&&sameMode(step.mode,mode)&&step.action===action);}
function skip(s){if(s?.school?.drill)s.school.drill.skipped=true;}
root.LemmaDrill={steps,active,current,allowed,advance,preview,skip};if(typeof module!=='undefined')module.exports=root.LemmaDrill;
})(typeof globalThis!=='undefined'?globalThis:this);
