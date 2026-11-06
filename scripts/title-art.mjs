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
for(const [x,y] of [[14,20],[44,10],[82,28],[116,12],[160,22],[208,10],[243,23],[295,13],[277,58],[24,65]])art+=rect(x,y,2,2,'#69829b');
art+=rect(258,20,24,24,'#d5ec72')+rect(254,24,32,16,'#d5ec72')+rect(254,20,16,16,'#10162b');
// Corporate skyline, hand-placed blocks and intermittent lit offices.
for(const [x,y,w,h] of [[0,85,24,87],[20,64,35,108],[50,102,26,70],[76,74,23,98],[252,88,28,84],[282,61,38,111]]){
 art+=rect(x,y,w,h,'#222942')+rect(x+3,y+4,w-6,2,'#34405a');
 for(let wy=y+13;wy<156;wy+=13)for(let wx=x+6;wx<x+w-5;wx+=10)art+=rect(wx,wy,3,5,(wx+wy)%4?'#34405a':'#84655f');
}
art+=rect(0,171,320,79,'#1a2b3b');
for(let y=178;y<250;y+=16)art+=rect(0,y,320,1,'#263e4a');
for(let x=8;x<320;x+=24)art+=rect(x,172,1,78,'#263e4a');
// Former mathematics department; blocky right-hand shading gives shallow depth.
art+=rect(63,78,157,106,'#17202f')+rect(72,83,143,96,'#4d6070')+rect(215,96,32,83,'#2b3d50');
art+=rect(64,70,151,13,'#889790')+rect(57,76,14,7,'#889790')+rect(215,78,24,10,'#4d6070')+rect(239,86,8,10,'#4d6070');
art+=rect(79,66,120,4,'#b7c5ae')+rect(93,59,92,7,'#889790');
art+=rect(82,92,121,18,'#17202f')+word('MATHEMATICS',88,97,1,'#d5ec72');
for(const x of [81,112,173]){
 art+=rect(x,121,22,26,'#17202f')+rect(x+3,124,16,20,'#e5bc72')+rect(x+10,124,2,20,'#665c5f')+rect(x+3,132,16,2,'#665c5f');
}
art+=rect(139,120,24,59,'#17202f')+rect(144,126,13,47,'#354658')+rect(152,146,3,3,'#f1d98c');
art+=rect(63,179,155,5,'#a5ae97')+rect(58,184,166,5,'#5b7280')+rect(52,189,178,5,'#344b61');
// The cooling infrastructure is already swallowing the building.
art+=rect(230,115,58,66,'#101a2c')+rect(236,119,46,58,'#5c7882')+rect(240,123,34,50,'#75ded0')+rect(246,127,22,42,'#2d756f');
for(let y=131;y<168;y+=8)art+=rect(248,y,18,3,'#a8e5c5');
art+=rect(245,105,21,14,'#91a6a4')+rect(249,99,13,7,'#4d6070');
art+=rect(210,153,27,9,'#93a19a')+rect(207,140,9,21,'#93a19a')+rect(207,137,20,7,'#93a19a');
art+=rect(29,157,31,39,'#17202f')+rect(33,161,23,27,'#ef7968')+word('NO',39,165,1,'#17202f')+rect(37,179,15,2,'#17202f');
// A repossession crate, discarded papers and a floor chevron.
art+=rect(267,200,33,25,'#101a2c')+rect(270,197,27,7,'#e0b76e')+rect(270,204,18,18,'#9a7957')+rect(288,204,9,18,'#66515a')+rect(278,205,3,15,'#ede8d0');
art+=rect(66,211,9,6,'#ede8d0')+rect(218,220,7,5,'#ede8d0')+rect(224,217,7,5,'#bdcbb2');
for(let i=0;i<5;i++)art+=rect(296-i*4,235-i*2,4,4,'#d5ec72');
await writeFile(new URL('landing-art.svg',root),wrap(320,250,'A mathematics department being converted into corporate GPU cooling infrastructure',art));
console.log('Wrote original pixel logo and title-screen scene in '+fileURLToPath(root));
