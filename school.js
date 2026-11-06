/* Original standalone training scenario. Uses campaign rules; never owns a save. */
(function(root){'use strict';
const lessons=[
 {title:'Attendance Is a Liability',place:'Room 1 / Remedial Obedience',object:'the attendance register',mission:0,kind:'recovery',
 brief:'Welcome to the Night School of Compulsory Potential, an adult retraining programme for mathematicians whose jobs have been automated but whose debts have not. Headmistress Ratio has marked you absent. You are standing in front of her. This is your first lesson in institutional truth.',
 quote:'“The attendance officer is a training automaton. Its invoice is real.” — Headmistress Ratio',
 after:'The register now admits that you exist. Ratio deducts three hours of absence from your sentence and adds three hours of attendance to your bill. Wren asks whether those cancel. “Not in the accounting department,” she says.',
 lesson:'Follow the marked steps: select, move, protect, attack and confirm. Then take command to recover and upload the gold register.',
 starts:[[2,6],[2,5],[1,4]],target:[5,4],walls:[[1,2],[2,2],[6,1],[7,1],[7,5]],enemies:[[5,5,'sentinel']]},
 {title:'Group Work, Individual Liability',place:'Room 2 / Applied Friendship',object:'the joint permission slip',mission:1,kind:'paired',
 brief:'To enter the next classroom you need a permission slip signed by two people who accept full individual responsibility. Bring two agents beside gold, or use the orange override. The certifier is already filing your failure to collaborate.',
 quote:'“One signature is consent. Two signatures are a conspiracy we can invoice twice.” — Ratio',
 after:'The permission slip is accepted. Ada reads the small print: the signatories have volunteered to supervise one another indefinitely. Quill folds the form into a paper aeroplane. It flies six inches before receiving a management position.',
 lesson:'Two agents beside gold OR orange override. Violet console clears the certifier’s seal.',
 starts:[[2,6],[3,6],[2,5]],target:[6,2],lock:[1,3],relay:[4,4],walls:[[3,2],[3,3],[5,5]],enemies:[[7,4,'clerk']]},
 {title:'Lights Out, Tuition On',place:'Room 3 / Boolean Housekeeping',object:'the energy exemption',mission:2,kind:'network',
 brief:'The school charges you for light, darkness, and the administrative cost of distinguishing them. Switches flip themselves and their connected neighbours. Turn every signal OFF to release the energy exemption. The same circuit powers the doors and training officers.',
 quote:'“Show your working. The electricity meter certainly will.” — Ratio',
 after:'Every signal goes dark. The gunner stops. The bill continues. Wren points out that zero should mean nothing. Ratio explains that zero is a licensed service, and you have been using the premium edition.',
 lesson:'Tap a letter to preview its flips. All OFF releases gold; OFF also opens matching doors and stops linked officers.',
 starts:[[1,7],[2,7],[1,6]],target:[7,1],relay:[3,7],walls:[[5,2],[5,4],[5,5]],enemies:[[7,3,'sentinel',2],[7,5,'clerk',3]],
 nodes:[[2,5],[4,5],[4,2],[6,2]],bits:[true,false,true,true],edges:[[0,1],[1,2],[2,3]],gates:[[5,3,1],[6,1,2]]},
 {title:'The Oral Examination',place:'Room 4 / Exit Qualifications',object:'the certificate of attendance',mission:5,kind:'hold',hearing:true,
 brief:'Your certificate proves you attended the course that taught you to prove you attended. Decode beside gold in two consecutive rounds with the same unharmed agent. Bring a second witness for the final signature. The gunner is the external examiner; the certifier objects to anyone finishing.',
 quote:'“There are no wrong answers. There are answers that require another semester.” — Ratio',
 after:'Ratio signs your certificate. It certifies that you were present while being charged. Ada asks whether the school has taught them anything. “You found the exit,” says Ratio. “We normally reserve that for postgraduate study.” Outside, a printer begins producing your alumni donation requests.',
 lesson:'Same decoder, consecutive rounds, no damage. Second witness beside gold for the final signature. Protect, interrupt or jam.',
 starts:[[2,6],[3,6],[2,5]],target:[5,3],relay:[3,3],walls:[[2,2],[3,2],[4,2],[6,5],[7,5]],enemies:[[5,1,'sentinel'],[7,3,'clerk']]}
];
function create(E,stage=0,previous=null){if(!Number.isInteger(stage)||!lessons[stage])throw Error('Unknown school class');const m=lessons[stage],s=E.fresh();s.mission=m.mission;E.start(s);s.practice=true;s.school={stage,...(stage===0?{drill:{step:0,skipped:false}}:{})};if(previous?.coaching)s.coaching=JSON.parse(JSON.stringify(previous.coaching));
const b=s.battle,p=q=>({x:q[0],y:q[1]});b.agents.forEach((a,i)=>Object.assign(a,p(m.starts[i])));b.target=p(m.target);b.exit=p(m.target);b.walls=m.walls.map(q=>q.join(','));b.relay=m.relay?{...p(m.relay),used:false}:null;b.lock=m.lock?{...p(m.lock),unlocked:false}:null;
b.enemies=m.enemies.map(([x,y,type,node,hp=4],id)=>({x,y,type,...(node===undefined?{}:{node}),hp,max:hp,id,alive:true}));b.puzzle={type:m.kind,progress:0,lastRound:-1,channel:null};b.hearing=!!m.hearing;b.lesson=m.lesson;b.log=[m.lesson];b.consequence='unknown';delete b.network;delete b.edges;delete b.gates;
if(m.nodes){b.network=m.nodes.map((q,id)=>({...p(q),id,on:m.bits[id]}));b.edges=m.edges.map(q=>q.slice());b.gates=m.gates.map(([x,y,node])=>({x,y,node}));}E.planEnemies(s);return s;}
root.LemmaSchool={lessons,create};if(typeof module!=='undefined')module.exports=root.LemmaSchool;
})(typeof globalThis!=='undefined'?globalThis:this);
