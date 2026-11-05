/* Original pixel figures. Every pixel, palette and silhouette is authored here. */
(function(root){
'use strict';
const palettes = [
  {o:'#071319',h:'#283a4b',H:'#577080',s:'#e7b99a',S:'#ad7566',c:'#e7eee1',C:'#b9c9c2',d:'#758c8b',a:'#6af5e3',p:'#314859',b:'#182735',w:'#e0bd79'},
  {o:'#10171c',h:'#bdc5ba',H:'#f5efdc',s:'#d9a481',S:'#966955',c:'#b99b6d',C:'#897856',d:'#5f5948',a:'#ffe18a',p:'#434c51',b:'#202c32',w:'#f8edca'},
  {o:'#14151e',h:'#4a2938',H:'#9c5269',s:'#ae806b',S:'#704b48',c:'#d6dbea',C:'#9eabc4',d:'#596786',a:'#ffbb62',p:'#34314c',b:'#202338',w:'#ba83ba'},
  {o:'#13151c',h:'#3d414f',H:'#777c8b',s:'#a1a4b5',S:'#636879',c:'#a75155',C:'#763d49',d:'#442c3c',a:'#ffb1a0',p:'#3e3545',b:'#1d2531',w:'#c4af86'}
];
// Three-quarter light: bright left/front faces, shaded right faces, offset feet.
const figures = [
  ['.....oooo.....','....ohHHho....','...ohhhhHho...','...ohsssSao...','...ohsosSao...','....osssSo....','....ocCdo.....','...occcCdo....','..ocaccCCdo...','..occcacCdo...','..oscccCCdo...','..oscccCCdo...','...occcCdoo...','...occcCdwo...','...occcCdwo...','...oCpppooo...','....oppopo....','....oppopo....','....obboobo...','...obbb.obbo..','...oooo.oooo..'],
  ['.....oooo.....','...ooHHHHo....','..oHHhhHHho...','..oHsossSao...','...osossSao...','...oHsssSo....','....oHHHo.....','...occaCdo....','..occcacCdo...','..occccCCdo...','..oscCcCCdo...','..osccccCdoo..','...occccCwwo..','...occccCwwo..','...occccCooo..','....oppopo....','....oppopo....','....oppopo....','...obboobbo...','...obbbobbb...','...oooooooo...'],
  ['.....oo.......','....ohHo......','....ohHoooo...','...ohhHHhhho..','...ohsssSho...','...ohsosSao...','....osssSo....','...occaCdo....','..occcaaCdo...','..occccaCdo...','..oscccCCdo...','..oscccCCdo...','...occcCdwoo..','...occcCdwwo..','...occcCdwoo..','....opppooo...','....oppopo....','....oppopo....','....obboobo...','...obbb.obbo..','...oooo.oooo..'],
  ['.....oooo.....','....ohHHho....','...ohhHHhho...','...ohhhhHho...','...oaaaaaao...','...ohSSSSho...','....oddddo....','...occcCCdo...','..occcaccCdo..','..occccCCddo..','..oscCcCCdso..','..oscccCCdso..','...occcdwooo..','...occcdwwwo..','...occcdwooo..','....opppoo....','....oppopo....','....oppopo....','...obbooobbo..','...obbb.obbb..','...oooo.oooo..']
];
function index(unit){return unit.kind==='enemy'?3:Math.max(0,Math.min(2,unit.idx||0));}
function pixels(i,paint){const rows=figures[i],colors=palettes[i];rows.forEach((row,y)=>[...row].forEach((p,x)=>{if(p!=='.')paint(x,y,colors[p]);}));}
function scale(tileWidth){return Math.max(2,Math.min(3,Math.round(tileWidth/30)));}
function bounds(x,y,tileWidth){const p=scale(tileWidth);return {x:Math.round(x-7*p),y:Math.round(y-21*p),width:14*p,height:21*p};}
function draw(ctx,unit,x,y,tileWidth){const p=scale(tileWidth),box=bounds(x,y,tileWidth);pixels(index(unit),(px,py,color)=>{ctx.fillStyle=color;ctx.fillRect(box.x+px*p,box.y+py*p,p,p);});return box;}
const portraits=figures.map((_,i)=>{let rects='';pixels(i,(x,y,color)=>{rects+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`;});return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 21" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;});
root.LemmaFigures={draw,bounds,portrait:i=>portraits[i],figures,palettes};
if(typeof module!=='undefined')module.exports=root.LemmaFigures;
})(typeof globalThis!=='undefined'?globalThis:this);
