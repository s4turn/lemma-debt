'use strict';
const assert=require('node:assert/strict');
const E=require('../engine');require('../narrative');require('../scenes');
global.LemmaNarrative.missions.forEach((m,i)=>Object.assign(E.MISSIONS[i],m));
const N=global.LemmaNarrative,scenes=global.LemmaScenes;
assert.equal(E.MISSIONS.length,18);assert.equal(N.missions.length,6);
const methods=['verify','automate'],outcomes=['commons','contested','hollow'];
const escapeHtml=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(v,label)=>assert.ok(typeof v==='string'&&v.trim().length>0,label);
const allMemos=new Set();
E.MISSIONS.forEach((m,i)=>{
  for(const f of ['title','brief','quote','after','object'])text(m[f],`Operation ${i+1} ${f}`);
  for(const method of methods){const memo=m.resolution?.[method];assert.ok(memo,`Operation ${i+1} ${method} consequence`);text(memo.title,'memo title');text(memo.body,'memo body');allMemos.add(memo.body);}
  assert.notEqual(m.resolution.verify.body,m.resolution.automate.body);
  for(const phase of ['intro','outro']){
    const shot=m.scene?.[phase];assert.ok(shot,`Operation ${i+1} ${phase}`);
    text(shot.title,'shot title');text(shot.caption,'shot caption');
    assert.ok(Array.isArray(shot.dialogue)&&shot.dialogue.length>0&&shot.dialogue.length<=2);
    for(const d of shot.dialogue){text(d.speaker,'speaker');text(d.line,'line');}
    const html=scenes.html(m,phase);assert.ok(html.includes(escapeHtml(shot.title)));assert.ok(html.includes('scene-dialogue'));assert.ok(!html.includes('undefined'));
  }
  assert.notEqual(m.scene.intro.caption,m.scene.outro.caption);
});
assert.equal(allMemos.size,36,'Each disposition has its own response');
for(let campaign=0;campaign<3;campaign++)for(const outcome of outcomes){const e=(campaign===0?N.endings:E.CAMPAIGNS[campaign].endings)[outcome];text(e.title,'ending title');text(e.body,'ending body');}
for(const family of ['ownership','implants'])for(const outcome of [...outcomes,'unknown'])text(N.legacy?.[family]?.[outcome],'legacy callback');
assert.equal(N.recaps.length,2);for(const recap of N.recaps)for(const outcome of outcomes)text(recap[outcome],'branch recap');
// All 27 outcome histories have corresponding text and preserve their recorded categories, with the right previous-campaign recap.
for(const first of outcomes)for(const second of outcomes)for(const final of outcomes){
  const s=E.fresh();s.mission=6;s.phase='ending';s.ending=first;s.verified=3;s.automated=3;
  assert.ok(E.continueCampaign(s));assert.equal(s.history[0].outcome,first);text(N.recaps[0][s.history[0].outcome],'first recap');
  s.mission=12;s.phase='ending';s.ending=second;s.verified=6;s.automated=6;assert.ok(E.continueCampaign(s));assert.equal(s.history[1].outcome,second);text(N.recaps[1][s.history[1].outcome],'second recap');
  s.mission=18;s.phase='ending';s.ending=final;assert.equal(E.continueCampaign(s),false);text(E.CAMPAIGNS[2].endings[final].body,'final text');
}
// Hollow is possible with intact understanding; do not equate its category with incapacity.
const rich=E.fresh();rich.mission=5;rich.phase='decision';rich.automated=4;rich.verified=1;rich.understanding=100;rich.battle={captured:false};
assert.ok(E.resolve(rich,'verify'));assert.equal(rich.ending,'hollow');assert.equal(rich.understanding,100);
// Old single-caption scenes still render, and dialogue is treated as text.
assert.ok(scenes.html({title:'Legacy',scene:{title:'Old caption',caption:'Still supported'}}).includes('Old caption'));
const hostile={title:'Escaping',scene:{intro:{title:'<script>',caption:'<svg onload=bad>',dialogue:[{speaker:'<b>',line:'<img src=x onerror=bad>'}]}}};
const html=scenes.html(hostile);assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;img'));
console.log('Narrative coverage: 18 missions, 36 disposition memos, 36 phase scenes, 9 endings, 6 recaps and 27 outcome-history combinations.');
console.log('Legacy scene fallback, dialogue escaping and high-understanding hollow branch checked.');
