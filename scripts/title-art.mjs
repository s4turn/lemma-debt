// Original grid-drawn title art; no font or image files are imported.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root=new URL('../',import.meta.url);
const glyphs={
 A:['01110','11011','11011','11111','11011','11011','11011'],
 B:['11110','11011','11011','11110','11011','11011','11110'],
 C:['01111','11000','11000','11000','11000','11000','01111'],
 D:['11110','11011','11011','11011','11011','11011','11110'],
 E:['11111','11000','11000','11110','11000','11000','11111'],
 F:['11111','11000','11000','11110','11000','11000','11000'],
 G:['01111','11000','11000','11011','11011','11011','01111'],
 H:['11011','11011','11011','11111','11011','11011','11011'],
 I:['11111','00100','00100','00100','00100','00100','11111'],
 J:['00111','00011','00011','00011','11011','11011','01110'],
 K:['11011','11011','11110','11100','11110','11011','11011'],
 L:['11000','11000','11000','11000','11000','11000','11111'],
 M:['10001','11011','11111','10101','10001','10001','10001'],
 N:['11011','11111','11111','11111','11011','11011','11011'],
 O:['01110','11011','11011','11011','11011','11011','01110'],
 P:['11110','11011','11011','11110','11000','11000','11000'],
 Q:['01110','11011','11011','11011','11011','11110','00011'],
 R:['11110','11011','11011','11110','11110','11011','11011'],
 S:['01111','11000','11000','01110','00011','00011','11110'],
 T:['11111','00100','00100','00100','00100','00100','00100'],
 U:['11011','11011','11011','11011','11011','11011','01110'],
 V:['11011','11011','11011','11011','11011','01110','00100'],
 W:['11011','11011','11011','11011','11111','11111','01010'],
 X:['11011','11011','01110','00100','01110','11011','11011'],
 Y:['11011','11011','01110','00100','00100','00100','00100'],
 Z:['11111','00011','00110','00100','01100','11000','11111'],
 ' ':['00000','00000','00000','00000','00000','00000','00000']
};
const rect=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
function word(text,x,y,size,color){let d='';[...text].forEach((ch,i)=>glyphs[ch].forEach((row,dy)=>[...row].forEach((bit,dx)=>{if(bit==='1')d+=`M${x+(i*6+dx)*size} ${y+dy*size}h${size}v${size}h-${size}z`;})));return `<path d="${d}" fill="${color}"/>`;}
const wrap=(w,h,title,body)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}" shape-rendering="crispEdges"><title>${title}</title>${body}</svg>\n`;
let logo='';
logo+=word('LEMMA',9,10,5,'#313e57')+word('DEBT',9,57,5,'#542d46');
logo+=word('LEMMA',4,5,5,'#ede8d0')+word('DEBT',4,52,5,'#ef7968');
logo+=rect(130,54,19,29,'#d5ec72')+rect(133,57,13,23,'#172738');
logo+=rect(138,60,3,3,'#d5ec72')+rect(135,66,3,3,'#d5ec72')+rect(141,66,3,3,'#d5ec72');
for(let i=0;i<7;i++)logo+=rect(127+i*4,81-i*2,5,4,'#ef7968');
logo+=rect(4,96,145,2,'#344557')+rect(4,96,36,2,'#75ded0');
await writeFile(new URL('logo.svg',root),wrap(158,102,'Lemma Debt — original pixel wordmark',logo));

let art=rect(0,0,320,250,'#10162b');
// A readable cutaway: a human classroom and a machine room occupy the same department.
for(const [x,y] of [[14,20],[44,10],[82,28],[116,12],[160,22],[298,12],[18,60]])art+=rect(x,y,2,2,'#69829b');
for(const [x,y,w] of [[0,88,18],[302,68,18]]){art+=rect(x,y,w,128,'#233048');for(let yy=y+10;yy<200;yy+=17)art+=rect(x+5,yy,5,7,'#486276');}
art+=rect(0,216,320,34,'#233646');
for(let x=5;x<320;x+=24)art+=rect(x,218,1,32,'#3b4d5c');
// Stone pediment, wall and broad steps establish a university building.
art+=rect(20,80,280,128,'#7c8b91')+rect(15,75,290,8,'#c1c7b6');
art+=rect(38,65,244,10,'#98a69f')+rect(60,56,200,9,'#b4bfb0')+rect(95,48,130,8,'#c1c7b6');
art+=rect(32,84,256,23,'#27384c')+word('MATH DEPT',54,88,2,'#f1e7b7');
art+=rect(16,208,288,6,'#c1c7b6')+rect(10,214,300,6,'#657c88')+rect(4,220,312,6,'#3b5266');
// Warm classroom: chalkboard, a proof, books, a desk, and its last occupant.
art+=rect(34,112,123,89,'#b8946c')+rect(38,116,115,81,'#765745');
art+=rect(43,120,103,41,'#dac797')+rect(47,124,95,33,'#244c43');
art+=word('PROOF',51,128,1,'#dce2bb');
art+=rect(52,141,3,8,'#dce2bb')+rect(55,138,6,3,'#dce2bb')+rect(61,141,3,8,'#dce2bb')+rect(52,145,12,2,'#dce2bb');
art+=rect(70,143,10,2,'#dce2bb')+rect(74,139,2,10,'#dce2bb');
art+=rect(87,138,3,12,'#dce2bb')+rect(90,138,7,3,'#dce2bb')+rect(90,143,7,2,'#dce2bb')+rect(90,148,7,2,'#dce2bb')+rect(97,141,2,7,'#dce2bb');
art+=rect(105,141,10,2,'#dce2bb')+rect(105,146,10,2,'#dce2bb');
art+=rect(122,138,3,12,'#dce2bb')+rect(125,138,9,3,'#dce2bb')+rect(125,148,9,2,'#dce2bb');
// Professor Voss protects a physical sheet instead of posing beside a generic server.
art+=rect(105,164,11,9,'#e4b78e')+rect(103,161,15,5,'#ede5c6')+rect(102,166,4,9,'#ede5c6');
art+=rect(101,174,18,19,'#7fa6b1')+rect(107,173,5,20,'#e5dbbb')+rect(99,178,5,10,'#e4b78e');
art+=rect(106,193,5,8,'#152434')+rect(115,193,5,8,'#152434');
art+=rect(116,178,16,19,'#fff1c8')+rect(120,182,8,2,'#647a75')+rect(120,187,5,2,'#647a75');
art+=rect(45,181,51,7,'#c0935f')+rect(48,188,5,13,'#3c3030')+rect(86,188,5,13,'#3c3030');
art+=rect(49,174,9,7,'#d5ec72')+rect(61,171,6,10,'#ef7968')+rect(70,174,7,7,'#75ded0');
// Cold machinery: server racks, oversized square fans, and coolant pipes through the wall.
art+=rect(165,112,121,89,'#101b2b')+rect(171,118,39,77,'#3d6372')+rect(175,122,31,69,'#142b3c');
for(let y=126;y<188;y+=12){art+=rect(178,y,25,8,'#365461')+rect(180,y+2,3,3,'#75ded0')+rect(186,y+2,3,3,'#d5ec72')+rect(195,y+2,6,2,'#91a6a4');}
for(const y of [120,159]){art+=rect(216,y,61,35,'#668792')+rect(220,y+4,53,27,'#162e3e');for(const x of [225,250]){art+=rect(x,y+7,18,21,'#3d6570')+rect(x+7,y+8,4,18,'#8ad9cf')+rect(x+1,y+15,16,4,'#8ad9cf')+rect(x+6,y+14,6,6,'#b4f1d8');}}
art+=rect(151,120,15,82,'#303e4b')+rect(146,132,20,10,'#8eaeb0')+rect(146,132,7,43,'#8eaeb0')+rect(135,166,18,9,'#8eaeb0');
art+=rect(261,96,11,24,'#8eaeb0')+rect(266,96,26,9,'#8eaeb0')+rect(284,43,9,62,'#8eaeb0');
art+=rect(264,99,6,3,'#c5e2d0')+rect(286,49,3,44,'#c5e2d0');
// New owner's sign visibly hangs over the old department.
art+=rect(175,19,128,38,'#080e1a')+rect(179,16,120,38,'#ef7968');
art+=word('GPU',218,20,2,'#17202f')+word('COOLING',197,37,2,'#17202f');
art+=rect(186,55,4,10,'#121f31')+rect(289,55,4,24,'#121f31');
// Barricade at the classroom door and discarded notices on the pavement.
art+=rect(26,190,14,19,'#27384c')+rect(29,191,23,5,'#d3a16b')+rect(26,200,27,5,'#d3a16b');
art+=rect(49,231,11,6,'#ede8d0')+rect(267,233,13,6,'#ede8d0');
await writeFile(new URL('landing-art.svg',root),wrap(320,250,'Professor Voss holds her proof in a mathematics classroom while GPU cooling equipment takes over the other half of the department',art));
console.log('Wrote original pixel logo and title-screen scene in '+fileURLToPath(root));
