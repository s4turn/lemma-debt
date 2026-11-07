/* Original encounter geometry. Coordinates and wiring are authored for Lemma Debt. */
(function(root){'use strict';
const templates=[
 {kind:'recovery',target:[5,2],starts:[[1,6],[2,7],[1,5]],relay:[2,2],walls:[[3,1],[3,2],[3,4],[5,5],[6,5]],enemies:[[3,5,'guard'],[6,2,'patrol']],lesson:'Blue squares move. Red tiles show the next enemy shot. Step aside or interrupt it.'},
 {kind:'paired',target:[7,2],starts:[[1,7],[2,7],[1,6]],relay:[4,6],lock:[1,3],walls:[[3,2],[3,3],[3,4],[5,1],[5,2],[5,4]],enemies:[[6,3,'clerk'],[4,1,'sentinel'],[6,5,'patrol']],lesson:'Two signatures open gold. Or use the orange override. The clerk is filing a seal.'},
 {kind:'network',target:[7,1],starts:[[1,7],[2,7],[1,6]],relay:[3,7],walls:[[4,2],[4,3],[4,4],[6,1]],nodes:[[1,5],[3,5],[5,3],[7,3]],gates:[[4,5,1],[6,2,2]],bits:[true,false,true,true],edges:[[0,1],[1,2],[2,3]],enemies:[[6,3,'sentinel',2],[7,5,'clerk',3],[3,2,'guard']],lesson:'Tap a letter: its linked lights flip. OFF opens the matching door and powers down the linked officer.'},
 {kind:'recovery',target:[1,1],starts:[[7,7],[6,7],[7,6]],relay:[4,4],walls:[[2,2],[3,2],[4,2],[5,4],[5,5],[2,5]],enemies:[[2,1,'guard'],[3,4,'sentinel'],[1,4,'clerk']],lesson:'The guard protects the record. The gunner aims at a tile, not at a person. Make it shoot an empty square.'},
 {kind:'paired',target:[4,1],starts:[[1,7],[2,7],[1,6]],relay:[6,6],lock:[7,3],walls:[[3,3],[3,4],[3,5],[5,3],[5,4],[5,5]],enemies:[[4,3,'guard'],[6,2,'sentinel'],[2,2,'clerk']],lesson:'Split around the walls for two signatures, or send Quill to the override. Neither route requires defeating everyone.'},
 {kind:'hold',target:[5,3],starts:[[1,6],[2,6],[1,5]],relay:[3,3],walls:[[2,2],[3,2],[4,2],[6,5],[7,5]],enemies:[[5,1,'sentinel'],[7,3,'clerk'],[3,4,'patrol']],lesson:'Decode twice in consecutive rounds. The same decoder must stay beside gold and avoid damage. Wren can protect them.'}
];
// Later circuits are separate places, with doors that alter an actual route.
// Bypasses on 3/9/18 remain open; 15's inner control reopens its own chamber.
const circuits={
 2:{kind:'network',target:[7,1],starts:[[1,7],[2,7],[1,6]],relay:[3,7],
  walls:[[4,1],[4,2],[4,3],[4,4],[4,6],[4,7],[4,8],[6,0],[6,1],[6,3],[6,4]],
  nodes:[[1,5],[3,5],[5,3],[7,3]],gates:[[4,5,1],[6,2,2]],bits:[true,false,true,true],edges:[[0,1],[1,2],[2,3]],
  enemies:[[7,4,'sentinel',2],[7,5,'clerk',3],[3,2,'guard']],
  lesson:'The B door is a shortcut through the long wall. A switch may close it behind your scout. The north end stays open; OFF also stops linked officers.'},
 8:{kind:'network',target:[4,1],starts:[[3,7],[4,7],[5,7]],relay:[4,5],
  walls:[[1,3],[3,3],[4,3],[5,3],[7,3]],
  nodes:[[1,6],[2,1],[6,1],[7,6]],gates:[[2,3,0],[6,3,1]],bits:[false,true,false,false],edges:[[0,1],[1,2],[2,3],[3,0]],
  enemies:[[7,2,'sentinel',2],[3,1,'clerk',1],[4,4,'guard']],
  lesson:'Two doors cross the divider: A on the west, B on the east. Follow each switch preview before committing a route. Both outside edges remain passable.'},
 14:{kind:'network',target:[4,0],starts:[[3,7],[4,8],[5,7]],relay:[4,7],
  walls:[[2,0],[2,1],[2,2],[2,3],[3,3],[5,3],[6,3],[6,2],[6,1],[6,0]],
  nodes:[[1,3],[7,3],[4,5],[4,2]],gates:[[4,3,2]],bits:[false,false,true,false],edges:[[0,1],[0,2],[1,2],[2,3]],
  enemies:[[3,2,'sentinel',2],[5,2,'clerk',3],[1,6,'guard']],
  lesson:'A and B repeat the same source: either opens the C chamber and stops both linked officers. Choose a flank. D inside can reopen the chamber; plan who crosses before switching again.'},
 17:{kind:'hold',target:[7,1],starts:[[1,7],[2,7],[1,6]],relay:[3,6],
  walls:[[4,0],[4,1],[4,3],[4,4],[4,6],[4,7],[5,3],[6,3]],
  nodes:[[1,5],[3,2],[6,6],[7,2]],gates:[[4,5,1],[4,2,0],[7,3,2]],bits:[false,true,true,false],edges:[[0,1],[1,2],[2,3]],
  enemies:[[6,1,'sentinel',1],[8,4,'clerk',2],[6,5,'guard']],
  lesson:'The hearing combines the circuit with testimony. All signals must be OFF to decode. Keep the same decoder beside gold for two consecutive rounds, and bring a second witness for the finish. The south and east edges bypass the doors.'}
};
function get(index){const chapter=Math.floor(index/6),base=JSON.parse(JSON.stringify(templates[index%6]));

 const slot=index%6;
 if(chapter===1){
  if(slot===0)Object.assign(base,{target:[7,2],starts:[[1,7],[2,7],[1,6]],enemies:[[6,2,'guard'],[5,4,'clerk'],[7,5,'sentinel']]});
  if(slot===1)Object.assign(base,{target:[2,2],starts:[[7,7],[6,7],[7,6]],lock:[1,1],enemies:[[3,1,'guard'],[1,4,'clerk'],[5,5,'sentinel']]});
  if(slot===3)Object.assign(base,{target:[7,1],starts:[[1,7],[2,7],[1,6]],enemies:[[6,1,'guard'],[4,5,'clerk'],[2,3,'sentinel']]});
  if(slot===4)Object.assign(base,{target:[1,1],starts:[[7,7],[6,7],[7,6]],lock:[7,2],enemies:[[2,1,'guard'],[5,2,'clerk'],[1,4,'sentinel']]});
  if(slot===5)Object.assign(base,{target:[4,3],starts:[[1,7],[2,7],[1,6]],relay:[2,6],enemies:[[4,1,'sentinel'],[6,3,'clerk'],[2,4,'patrol']]});
 }
 if(chapter===2){
  if(slot===0)Object.assign(base,{target:[6,4],starts:[[1,1],[2,1],[1,2]],relay:[2,5],enemies:[[5,4,'guard'],[6,1,'clerk'],[7,5,'sentinel']]});
  if(slot===1)Object.assign(base,{target:[1,4],starts:[[7,1],[7,2],[6,1]],lock:[6,7],enemies:[[2,4,'guard'],[4,7,'clerk'],[1,7,'sentinel']]});
  if(slot===3)Object.assign(base,{target:[7,7],starts:[[1,1],[2,1],[1,2]],relay:[6,4],enemies:[[6,7,'guard'],[5,6,'sentinel'],[7,3,'clerk']]});
  if(slot===4)Object.assign(base,{target:[4,7],starts:[[1,1],[2,1],[1,2]],relay:[1,6],enemies:[[3,7,'guard'],[6,5,'clerk'],[7,7,'sentinel']]});
  if(slot===5)Object.assign(base,{target:[4,4],starts:[[1,7],[2,7],[1,6]],relay:[7,6],walls:[[3,2],[4,2],[5,2],[2,4],[6,4]],enemies:[[4,6,'sentinel'],[7,4,'clerk'],[2,3,'patrol']]});
 }
 const transform=([x,y,...rest])=>chapter===1?[8-y,x,...rest]:chapter===2?[8-x,8-y,...rest]:[x,y,...rest];
 for(const k of ['target','relay','lock'])if(base[k])base[k]=transform(base[k]);
 for(const k of ['starts','walls','enemies','nodes','gates'])if(base[k])base[k]=base[k].map(transform);
 if(circuits[index])Object.assign(base,JSON.parse(JSON.stringify(circuits[index])));
 if(index===3)Object.assign(base,{starts:[[3,4],[4,3],[1,7]],enemies:[[3,3,'sentinel'],[2,4,'clerk'],[2,1,'guard']],lesson:'When enforcement resumes, Reassign moves an officer and its aim. Redirect a shot to stop another order.'});
 base.hearing=index%6===5;base.chapter=chapter;return base;
}
root.LemmaEncounters={get};if(typeof module!=='undefined')module.exports=root.LemmaEncounters;
})(typeof globalThis!=='undefined'?globalThis:this);
