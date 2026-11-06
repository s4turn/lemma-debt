'use strict';
// Causal story checks. These exercise recorded state and the real rendering path;
// they do not establish that a line is funny or that a scene reads well on a phone.
const assert=require('node:assert/strict');
const E=require('../engine');require('../narrative');
const N=global.LemmaNarrative;
N.missions.forEach((m,i)=>Object.assign(E.MISSIONS[i],m));
assert.equal(typeof N.incident,'function');
const clone=value=>structuredClone(value);
function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
function readOnly(fn,state){const input=freeze(clone(state)),before=JSON.stringify(input),text=fn(input);assert.equal(typeof text,'string');assert.equal(JSON.stringify(input),before,'Story selection must not write a save');assert.equal(fn(JSON.parse(before)),text,'JSON restoration must preserve the story selection');return text;}
function hub(mission,record,history=[]){const s=E.fresh();s.mission=mission;s.verified=mission;s.history=history;s.caseRecords=record?[{mission:mission-1,...record}]:[];return s;}

// The engine is the independent authority for what happens on the next board.
// A repaired publication remains historically automated/forced, but the repair
// changes its future enforcement. A failed prior chapter can override that stay.
let combinations=0;
for(let mission=1;mission<18;mission++)for(const method of ['verify','automate'])for(const forced of [false,true])for(const repaired of [false,true]){
  const histories=mission%6===0?['commons','contested','hollow']:['none'];
  for(const outcome of histories){
    const history=outcome==='none'?[]:[{campaign:mission/6-1,outcome}];
    const s=hub(mission,{method,forced,repaired},history),prose=readOnly(N.arrival,s),board=clone(s);
    E.start(board);assert.equal(board.battle.consequence,E.consequence(s));
    if(board.battle.consequence==='contested'){
      assert.match(prose,/extra certifier/i,'Contested arrival must disclose the added officer');
      assert.equal(board.battle.jammed,false);
      assert.doesNotMatch(prose,/stays enforcement for the first response/i,'A hollow boundary cannot promise an enforcement stay');
    }else{
      assert.equal(board.battle.consequence,'checked');assert.equal(board.battle.jammed,true);
      assert.match(prose,/first response|enforcement stay/i,'Checked arrival must disclose its temporary protection');
      assert.doesNotMatch(prose,/extra certifier/i,'Corrected work must not claim ongoing added enforcement');
      if(repaired){
        assert.match(prose,/correct|repair|amend|retract/i,'Correction must be acknowledged as a correction');
        assert.notEqual(prose,N.arrival(hub(mission,{method:'verify',forced:false,repaired:false},history)),'Repair must not rewrite the original disposition as clean verification');
      }
    }
    combinations++;
  }
}
// A journal records a publication choice, not its source provenance. Without a
// case record the new mechanic is unknown, even if a legacy journal names a method.
for(const mission of [1,5,6,11,12,17]){
  const s=hub(mission),unknown=readOnly(N.arrival,s);
  for(const method of ['verify','automate']){
    const journalOnly={...clone(s),journal:[{mission:mission-1,method,captured:false}]};
    assert.equal(readOnly(N.arrival,journalOnly),unknown,'Legacy journal must not invent provenance or enforcement');
  }
  const board=clone(s);E.start(board);assert.equal(board.battle.consequence,'unknown');
}

function decision(mission=0){const s=E.fresh();s.mission=mission;s.verified=mission;s.baselineVerified=Math.floor(mission/6)*6;s.caseRecords=Array.from({length:mission},(_,i)=>({mission:i,method:'verify',forced:false,repaired:false}));E.start(s);s.battle.secured=true;s.phase='decision';return s;}
for(const s of [E.fresh(),{phase:'decision'},{phase:'decision',battle:{}},{phase:'decision',battle:{agents:[]}}])assert.equal(readOnly(N.incident,s),'','Unknown injury evidence must remain unknown');
const healthy=decision(),wounded=clone(healthy),incapacitated=clone(healthy);
wounded.battle.agents[0].hp=1;incapacitated.battle.agents[0].hp=0;
const healthyText=readOnly(N.incident,healthy),woundedText=readOnly(N.incident,wounded),incapacitatedText=readOnly(N.incident,incapacitated);
assert.ok(woundedText.length>0);assert.ok(incapacitatedText.length>0);
assert.notEqual(woundedText,healthyText,'A wounded squad needs a different aftermath');
assert.notEqual(incapacitatedText,woundedText,'Incapacitation must not be described as an ordinary wound');
assert.doesNotMatch(incapacitatedText,/\b(dead|died|death|killed|funeral|cured)\b/i,'Incapacitation is not death or a cure');
const unrelated=clone(wounded);unrelated.battle.captured=true;unrelated.battle.forced=true;unrelated.journal=[{mission:0,method:'automate',captured:true}];
assert.equal(readOnly(N.incident,unrelated),woundedText,'The casualty report must not infer a publication choice or repeat rival/provenance branches');
for(const phase of ['battle','failed','hub','ending'])assert.equal(readOnly(N.incident,{...wounded,phase}),'','Live incident belongs only to the current completed operation');
for(const field of ['hp','max']){const unknown=clone(wounded);delete unknown.battle.agents[1][field];assert.equal(readOnly(N.incident,unknown),'','Partial old injury data must not be filled in');}

// Minimal DOM fixture for the actual decision / memo / archive integration.
const elements={},storage={};
const ctx=new Proxy({},{get(t,k){return t[k]||(t[k]=()=>{});},set(t,k,v){t[k]=v;return true;}});
function el(id){return elements[id]||(elements[id]={id,hidden:false,innerHTML:'',textContent:'',style:{},dataset:{},focus(){},addEventListener(n,f){this['on'+n]=f;},getBoundingClientRect(){return {width:900,height:600,left:0,top:0};},getContext(){return ctx;}});}
global.document={getElementById:el,querySelectorAll(){return [];}};global.window=global;global.devicePixelRatio=1;global.addEventListener=()=>{};global.confirm=()=>true;
global.localStorage={getItem(k){return storage[k]||null;},setItem(k,v){storage[k]=v;}};
for(const file of ['scenes','practice','figures','tutorial','drill','school','hints','game'])require('../'+file+'.js');
const escapeHtml=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function restore(s){el('backup').onclick();el('save-import').value=JSON.stringify(s);el('restore').onclick();assert.doesNotMatch(el('restore-message').textContent,/invalid/);}
for(const mission of [5,11,17])for(const method of ['verify','automate']){
  const s=decision(mission),m=E.MISSIONS[mission];s.battle.agents[0].hp=1;restore(s);
  assert.ok(el('screen').innerHTML.includes(escapeHtml(N.incident(s))),'Current injuries appear in the live aftermath');
  assert.ok(el('screen').innerHTML.includes(m.after));
  if(mission===17)assert.doesNotMatch(el('screen').innerHTML,/next operation|next rival/i,'The last publication must not promise a nonexistent next board');
  for(const candidate of ['verify','automate'])assert.ok(!el('screen').innerHTML.includes(escapeHtml(m.resolution[candidate].body)),'Publication must not be chosen before player input');
  const endings=mission===5?N.endings:E.CAMPAIGNS[Math.floor(mission/6)].endings;
  for(const ending of Object.values(endings))assert.ok(!el('screen').innerHTML.includes(ending.body),'Finale aftermath must not render an outcome before the choice');
  el(method).onclick();const saved=JSON.parse(storage['lemma-debt-save-v1']);
  assert.equal(saved.phase,'ending');assert.equal(saved.mission,mission+1);
  assert.deepEqual(saved.journal,[{mission,method,captured:false}],'The revision must keep the existing journal schema');
  assert.ok(el('modal-body').innerHTML.includes(escapeHtml(m.resolution[method].body)));
  assert.ok(!el('modal-body').innerHTML.includes(escapeHtml(m.resolution[method==='verify'?'automate':'verify'].body)));
  el('memo-continue').onclick();assert.equal(el('modal').hidden,true);
  assert.ok(el('screen').innerHTML.includes(endings[saved.ending].body),'The computed outcome is available after its memo');
}
// An archive opened during a later casualty must not rewrite a former operation's
// aftermath using the current squad's condition. Old archives cannot invent it.
const archive=decision(1);archive.journal=[{mission:0,method:'verify',captured:false}];archive.battle.agents[0].hp=0;archive.battle.agents[1].hp=1;
restore(archive);const currentIncident=N.incident(archive),sourceIncident=N.incident;let incidentReads=0;
N.incident=s=>{incidentReads++;return sourceIncident(s);};const before=storage['lemma-debt-save-v1'];el('case-file').onclick();
assert.equal(incidentReads,0,'Case file must not call the current-battle incident helper');
assert.ok(!el('modal-body').innerHTML.includes(escapeHtml(currentIncident)),'Current injuries must not appear in an older case');
assert.ok(el('modal-body').innerHTML.includes(escapeHtml(E.MISSIONS[0].resolution.verify.body)));
assert.equal(storage['lemma-debt-save-v1'],before,'Reading the archive must not alter a save');N.incident=sourceIncident;
const legacy=clone(archive);delete legacy.journal;delete legacy.caseRecords;restore(legacy);el('case-file').onclick();
assert.match(el('modal-body').innerHTML,/did not record/);
assert.ok(!el('modal-body').innerHTML.includes(escapeHtml(E.MISSIONS[0].resolution.verify.body)));
assert.ok(!el('modal-body').innerHTML.includes(escapeHtml(E.MISSIONS[0].resolution.automate.body)));
// A correction is later history, not a replacement publication or a retroactive
// chapter victory. Use actual resolve/continue/repair transitions to establish it.
const corrected=E.fresh();corrected.journal=[];
for(let mission=0;mission<6;mission++){
  corrected.phase='decision';corrected.battle={captured:false,forced:mission<2};
  E.resolve(corrected,'automate');corrected.journal.push({mission,method:'automate',captured:false});
}
assert.equal(corrected.ending,'hollow');assert.ok(E.continueCampaign(corrected));
const originalHistory=clone(corrected.history);assert.ok(E.repair(corrected,0));assert.deepEqual(corrected.history,originalHistory);
restore(corrected);const beforeArchive=storage['lemma-debt-save-v1'];el('case-file').onclick();
const entries=[...el('modal-body').innerHTML.matchAll(/<details class="case-entry">([\s\S]*?)<\/details>/g)].map(match=>match[1]);
assert.equal(entries.length,6);
assert.ok(entries[0].includes(escapeHtml(E.MISSIONS[0].resolution.automate.body)),'A repair must preserve the original automated memo');
assert.ok(!entries[0].includes(escapeHtml(E.MISSIONS[0].resolution.verify.body)),'A repair must not invent an original verification');
assert.match(entries[0],/Later repaired:[\s\S]*checked/i,'The archive must distinguish a later correction from the original publication');
assert.doesNotMatch(entries[0],/has not been repaired/i,'A repaired source cannot simultaneously be described as unrepaired');
assert.match(entries[1],/Source trail lost[\s\S]*has not been repaired/i,'Known forced provenance remains visible for the unrepaired record');
assert.doesNotMatch(entries[2],/Later repaired:|Source trail lost/i,'Ordinary automated records must not acquire a fictitious repair or forced access');
assert.equal(storage['lemma-debt-save-v1'],beforeArchive);assert.deepEqual(JSON.parse(beforeArchive).history,originalHistory);
const recordsMissing=clone(corrected);delete recordsMissing.caseRecords;restore(recordsMissing);el('case-file').onclick();
assert.doesNotMatch(el('modal-body').innerHTML,/Later repaired:|Source trail lost/i,'An older journal cannot supply missing repair/provenance facts');
assert.ok(el('modal-body').innerHTML.includes(escapeHtml(E.MISSIONS[0].resolution.automate.body)),'Known old publication choices remain readable without new provenance records');
console.log(`Narrative continuity: ${combinations} recorded enforcement combinations, legacy uncertainty, pure incident selection, all six finale choices, archive isolation and non-retroactive repair history passed.`);
