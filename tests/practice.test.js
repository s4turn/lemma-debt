const assert=require('node:assert/strict');
const E=require('../engine'),P=require('../practice');
let s=P.create('paired'),b=s.battle;
assert.ok(E.act(s,2,2).ok);b.selected=1;assert.ok(E.act(s,3,1).ok);
b.selected=0;assert.ok(E.act(s,2,0).ok);b.selected=1;assert.ok(E.act(s,3,0).ok);assert.ok(P.done(s));
s=P.create('hold');b=s.battle;assert.ok(E.act(s,2,1).ok);assert.equal(b.puzzle.progress,1);b.selected=1;assert.equal(E.order(s,2,1).ok,false);E.wait(s);b.selected=0;assert.ok(E.act(s,2,1).ok);assert.ok(P.done(s));
s=P.create('network');assert.equal(P.done(s),false);assert.ok(E.act(s,0,1).ok);assert.ok(E.act(s,2,1).ok);assert.ok(P.done(s));
console.log('Practice: paired positioning, distinct-round decode and switch puzzle use real rules and complete.');
