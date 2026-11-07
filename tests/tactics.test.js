'use strict';
const assert = require('node:assert/strict');
const E = require('../engine');
const clone = value => JSON.parse(JSON.stringify(value));

function officer(id, x, y, intent = {kind: 'watch'}, type = 'sentinel', hp = 4) {
  return {id, x, y, intent, type, hp, max: hp, alive: true};
}

function fixture() {
  const s = E.fresh();
  E.start(s);
  Object.assign(s.battle, {
    walls: [], gates: [], enemies: [], lock: null,
    relay: null, target: {x: 8, y: 8}, exit: {x: 8, y: 8}, hearing: false,
    jammed: false, rival: 0, certification: 0, sealed: false,
    puzzle: {type: 'recovery', progress: 0, lastRound: -1, channel: null}
  });
  s.battle.agents.forEach((a, i) => Object.assign(a, {x: i, y: 8, ap: 1}));
  s.battle.selected = 0;
  return s;
}

// A push translates an existing firing tile; it does not choose a new target.
for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
  for (const intent of [
    {kind: 'fire', x: 1, y: 2, damage: 3},
    {kind: 'move', x: 4, y: 3}, {kind: 'certify'}, {kind: 'watch'}
  ]) {
    const s = fixture(), b = s.battle, a = b.agents[0];
    Object.assign(a, {x: 4 - dx, y: 4 - dy});
    const e = officer(7, 4, 4, clone(intent));
    b.enemies = [e];
    const before = clone(s), preview = E.shoveOrder(s, 4, 4);
    assert.deepEqual(s, before, 'Reassign preview is pure');
    assert.equal(preview.ok, true);
    assert.equal(preview.damage, 1);
    assert.equal(preview.enemy, 7);
    assert.deepEqual(preview.destination, {x: 4 + dx, y: 4 + dy});
    assert.deepEqual(preview.aim, intent.kind === 'fire'
      ? {...intent, x: intent.x + dx, y: intent.y + dy} : null);
    assert.equal(E.shove(s, 4, 4).ok, true);
    assert.equal(e.hp, 3);
    assert.deepEqual({x: e.x, y: e.y}, preview.destination);
    assert.deepEqual(e.intent, preview.aim || intent);
    assert.equal(a.ap, 0);
    assert.equal(b.turn, 0, 'A push does not execute the response early');
  }
}

// Every obstruction and invalid selection has the same preview and execution
// result, with neither damage, action expenditure, nor incidental state changes.
const invalidCases = {
  wall: s => s.battle.walls.push('5,4'),
  closedDoor: s => {
    s.battle.network = [{id: 0, on: true}];
    s.battle.gates = [{x: 5, y: 4, node: 0}];
  },
  ally: s => Object.assign(s.battle.agents[1], {x: 5, y: 4}),
  officer: s => s.battle.enemies.push(officer(8, 5, 4)),
  edge: s => {
    s.battle.agents[0].x = 7;
    s.battle.enemies[0].x = 8;
  },
  distant: s => s.battle.agents[0].x = 2,
  diagonal: s => s.battle.agents[0].y = 3,
  acted: s => s.battle.agents[0].ap = 0,
  incapacitated: s => s.battle.agents[0].hp = 0,
  defeatedOfficer: s => s.battle.enemies[0].alive = false,
  oldSave: s => delete s.battle.tactics,
  legacyRules: s => s.battle.rules = 1,
  headquarters: s => s.phase = 'hub'
};
for (const [name, configure] of Object.entries(invalidCases)) {
  const s = fixture();
  Object.assign(s.battle.agents[0], {x: 3, y: 4});
  s.battle.enemies = [officer(0, 4, 4)];
  configure(s);
  const e = s.battle.enemies[0], before = clone(s);
  const preview = E.shoveOrder(s, e.x, e.y);
  assert.equal(preview.ok, false, name);
  assert.deepEqual(E.shove(s, e.x, e.y), preview, name);
  assert.deepEqual(s, before, name + ' must not mutate the battle');
}
{
  const s = fixture(), before = clone(s);
  assert.equal(E.shoveOrder(s, 4, 4).ok, false);
  assert.equal(E.shove(s, 4, 4).ok, false);
  assert.deepEqual(s, before);
}

// Open doors and empty former unit positions really are legal destinations.
for (const obstacle of ['openDoor', 'deadAlly', 'deadOfficer']) {
  const s = fixture(), b = s.battle;
  Object.assign(b.agents[0], {x: 3, y: 4});
  b.enemies = [officer(0, 4, 4)];
  if (obstacle === 'openDoor') {
    b.network = [{id: 0, on: false}]; b.gates = [{x: 5, y: 4, node: 0}];
  } else if (obstacle === 'deadAlly') {
    Object.assign(b.agents[1], {x: 5, y: 4, hp: 0});
  } else {
    b.enemies.push({...officer(1, 5, 4), alive: false, hp: 0});
  }
  assert.equal(E.shoveOrder(s, 4, 4).ok, true, obstacle);
  assert.equal(E.shove(s, 4, 4).ok, true, obstacle);
  assert.equal(b.enemies[0].x, 5);
}

// A lethal push cancels the officer without moving its body or queued order.
{
  const s = fixture(), b = s.battle;
  Object.assign(b.agents[0], {x: 3, y: 4});
  const aim = {kind: 'fire', x: 3, y: 4, damage: 3};
  b.enemies = [officer(0, 4, 4, aim, 'sentinel', 1)];
  assert.equal(E.shove(s, 4, 4).ok, true);
  assert.equal(b.enemies[0].alive, false);
  assert.equal(b.enemies[0].hp, 0);
  assert.equal(b.enemies[0].x, 4);
  E.wait(s);
  assert.equal(b.agents[0].hp, b.agents[0].max);
}

// Aim may leave the map even though the officer must remain on an empty tile.
// The translated empty aim remains locked until the response, despite nearby allies.
{
  const s = fixture(), b = s.battle;
  Object.assign(b.agents[0], {x: 3, y: 4});
  Object.assign(b.agents[1], {x: 5, y: 3});
  b.enemies = [officer(0, 4, 4, {kind: 'fire', x: 8, y: 4, damage: 3})];
  const hp = b.agents.map(a => a.hp), preview = E.shoveOrder(s, 4, 4);
  assert.equal(preview.ok, true);
  assert.deepEqual(preview.aim, {kind: 'fire', x: 9, y: 4, damage: 3});
  E.shove(s, 4, 4);
  assert.equal(b.enemies[0].intent.x, 9);
  E.wait(s);
  assert.deepEqual(b.agents.map(a => a.hp), hp);
  assert.ok(b.log.some(line => line.includes('empty tile')));
  assert.notEqual(b.enemies[0].intent.x, 9, 'Only the next round replans');
}

// Actual redirected fire kills a later-numbered certifier before it can file.
// Array order must not affect the result; IDs 2 and 10 catch lexical sorting.
function redirectFixture(reverse = false, modern = true) {
  const s = fixture(), b = s.battle;
  if (!modern) delete b.tactics;
  Object.assign(b.agents[0], {x: 4, y: 3});
  const shooter = officer(2, 3, 3, {kind: 'fire', x: 3, y: 4, damage: 3});
  const clerk = officer(10, 2, 4, {kind: 'certify'}, 'clerk', 3);
  b.enemies = reverse ? [clerk, shooter] : [shooter, clerk];
  return s;
}
for (const reverse of [false, true]) {
  const s = redirectFixture(reverse), b = s.battle;
  const preview = E.shoveOrder(s, 3, 3);
  assert.match(preview.detail, /Certifier 11/);
  assert.equal(E.shove(s, 3, 3).ok, true);
  const saved = clone(s);
  E.wait(s); E.wait(saved);
  assert.deepEqual(saved, s, 'Save restoration preserves redirected response execution');
  assert.equal(b.enemies.find(e => e.id === 10).alive, false);
  assert.equal(b.certification, 0, 'A killed certifier cannot file later in the response');
  assert.ok(b.agents.every(a => a.hp === a.max));
}

// A last-ready-agent push runs the response immediately. A previewed shield
// reduces redirected damage, and restoring just before that action is exact.
{
  const s = fixture(), b = s.battle;
  Object.assign(b.agents[0], {x: 3, y: 4});
  Object.assign(b.agents[1], {ap: 0});
  Object.assign(b.agents[2], {x: 7, y: 3, ap: 0, shield: 2});
  b.enemies = [officer(0, 4, 4, {kind: 'fire', x: 6, y: 3, damage: 3})];
  const preview = E.shoveOrder(s, 4, 4), saved = clone(s);
  assert.ok(preview.detail.includes(b.agents[2].name));
  assert.match(preview.detail, /1 damage after shield/);
  assert.equal(E.shove(s, 4, 4).ok, true);
  assert.equal(E.shove(saved, 4, 4).ok, true);
  assert.equal(b.turn, 1);
  assert.equal(b.agents[2].hp, b.agents[2].max - 1);
  assert.deepEqual(saved, s);
}

// Friendly fire respects the same custodian armor distance shown in preview.
for (const distance of [1, 2]) {
  const s = fixture(), b = s.battle;
  Object.assign(b.agents[0], {x: 4, y: 3});
  b.enemies = [
    officer(0, 3, 3, {kind: 'fire', x: 3, y: 3 + distance, damage: 3}),
    officer(1, 2, 3 + distance, {kind: 'watch'}, 'guard')
  ];
  const preview = E.shoveOrder(s, 3, 3);
  const expected = distance === 1 ? 3 : 1;
  assert.ok(preview.detail.includes(expected + ' damage'));
  E.shove(s, 3, 3); E.wait(s);
  assert.equal(b.enemies[1].hp, 4 - expected);
}

// A later shooter cannot retroactively undo an earlier filing, and killing an
// earlier shooter before its number is reached cancels damage as well as filing.
{
  const s = redirectFixture(), b = s.battle;
  b.enemies.find(e => e.type === 'clerk').id = 1;
  E.shove(s, 3, 3); E.wait(s);
  assert.equal(b.certification, 1);
  assert.equal(b.enemies.find(e => e.type === 'clerk').alive, false);
}
{
  const s = fixture(), b = s.battle, a = b.agents[0];
  b.enemies = [
    officer(10, 3, 4, {kind: 'fire', x: a.x, y: a.y, damage: 3}, 'sentinel', 3),
    officer(2, 3, 2, {kind: 'fire', x: 3, y: 4, damage: 3})
  ];
  E.wait(s);
  assert.equal(b.enemies[0].alive, false);
  assert.equal(a.hp, a.max);
}
{
  const s = fixture(), b = s.battle;
  Object.assign(b.agents[0], {x: 4, y: 3});
  b.enemies = [
    officer(10, 3, 3, {kind: 'fire', x: 3, y: 4, damage: 3}),
    officer(2, 2, 4, {kind: 'move', x: 1, y: 4}, 'patrol')
  ];
  const before = clone(s), preview = E.shoveOrder(s, 3, 3);
  assert.match(preview.detail, /Empty tile: no one is hit/);
  assert.deepEqual(s, before, 'Projected enemy movement must not affect the real board');
  E.shove(s, 3, 3); E.wait(s);
  assert.equal(b.enemies[1].x, 1, 'Earlier MOVE executes before the later shot');
  assert.equal(b.enemies[1].hp, 4, 'The later shot must not follow a moving officer');
  assert.ok(b.log.some(line => line.includes('empty tile')));
}

for (const earlierOrder of ['consumeShield', 'killShooter']) {
  const s = fixture(), b = s.battle;
  Object.assign(b.agents[0], {x: 4, y: 3});
  Object.assign(b.agents[1], {x: 2, y: 4, shield: 3});
  b.enemies = [
    officer(10, 3, 3, {kind: 'fire', x: 3, y: 4, damage: 3}),
    officer(2, 0, 3, {kind: 'fire', x: 2, y: earlierOrder === 'consumeShield' ? 4 : 3, damage: 3})
  ];
  const before = clone(s), preview = E.shoveOrder(s, 3, 3);
  assert.deepEqual(s, before, 'Projecting earlier damage must not alter HP or shields');
  if (earlierOrder === 'consumeShield') {
    assert.ok(preview.detail.includes(b.agents[1].name + ': 3 damage'));
    assert.ok(!preview.detail.includes('after shield'), 'Earlier shot already exhausts the shield');
  } else {
    assert.match(preview.detail, /Officer defeated before its response/);
  }
  E.shove(s, 3, 3); E.wait(s);
  assert.equal(b.agents[1].hp, b.agents[1].max - (earlierOrder === 'consumeShield' ? 3 : 0));
  assert.equal(b.enemies[0].alive, earlierOrder === 'consumeShield');
}

// Walls still stop translated shots; powered-off and interrupted shooters do
// not execute their new aim. They never substitute a nearer agent for it.
for (const suppress of ['wall', 'power', 'interrupt', 'stay']) {
  const s = redirectFixture(), b = s.battle;
  // Move the intended victim farther down the line so there is room for a wall.
  b.enemies.find(e => e.type === 'clerk').y = 6;
  b.enemies.find(e => e.type === 'sentinel').intent.y = 6;
  if (suppress === 'wall') b.walls = ['2,4'];
  if (suppress === 'power') {
    b.network = [{id: 0, on: false}]; b.enemies[0].node = 0;
  }
  if (suppress === 'interrupt') b.enemies[0].stunned = true;
  if (suppress === 'stay') b.jammed = true;
  const preview = E.shoveOrder(s, 3, 3);
  assert.equal(preview.ok, true);
  if (suppress === 'wall') assert.match(preview.detail, /blocks this shot|shot blocked/);
  E.shove(s, 3, 3); E.wait(s);
  assert.equal(b.enemies.find(e => e.type === 'clerk').hp, 3, suppress);
  assert.ok(b.agents.every(a => a.hp === a.max), suppress);
}

// Tools II's second point applies only beside the target, for every agent and
// both armored and unarmored officers. Older saved battles keep their damage.
for (const modern of [true, false]) for (let level = 0; level <= 2; level++) {
  for (let index = 0; index < 3; index++) for (const distance of [1, 2]) {
    for (const type of ['patrol', 'guard']) {
      const s = fixture(), b = s.battle;
      if (!modern) delete b.tactics;
      s.upgrades.tools = level;
      b.selected = index;
      const a = b.agents[index];
      Object.assign(a, {x: 3, y: 3});
      const e = officer(0, 3 + distance, 3, {kind: 'watch'}, type, 10);
      b.enemies = [e];
      const bonus = modern && distance > 1 ? Math.min(1, level) : level;
      const expected = Math.max(1, a.damage + bonus - (type === 'guard' && distance > 1 ? 2 : 0));
      assert.deepEqual(E.damageRange(s, index), {
        ranged: a.damage + (modern ? Math.min(1, level) : level), adjacent: a.damage + level
      });
      assert.equal(E.order(s, e.x, e.y).damage, expected);
      assert.equal(E.act(s, e.x, e.y).ok, true);
      assert.equal(e.hp, 10 - expected);
    }
  }
}

// Wren previews the actual named recipients. Shielding reaches two tiles; new
// battles also restrict filing suppression to two tiles, while old saves keep it global.
for (const modern of [true, false]) {
  const s = fixture(), b = s.battle;
  if (!modern) delete b.tactics;
  b.selected = 1;
  Object.assign(b.agents[1], {x: 4, y: 4});
  Object.assign(b.agents[0], {x: 2, y: 4});
  Object.assign(b.agents[2], {x: 7, y: 4});
  b.enemies = [officer(2, 4, 2, {kind: 'certify'}, 'clerk'), officer(10, 4, 7, {kind: 'certify'}, 'clerk')];
  const preview = E.abilityOrder(s, 0, 0);
  assert.deepEqual(preview.allies, [0, 1]);
  assert.deepEqual(preview.clerks, modern ? [2] : [2, 10]);
  for (const i of preview.allies) assert.ok(preview.detail.includes(b.agents[i].name));
  assert.ok(!preview.detail.includes(b.agents[2].name));
  assert.equal(E.ability(s, 0, 0).ok, true);
  assert.equal(b.agents[0].shield, 3);
  assert.equal(b.agents[1].shield, 3);
  assert.equal(b.agents[2].shield || 0, 0);
  assert.equal(!!b.enemies[0].stunned, true);
  assert.equal(!!b.enemies[1].stunned, !modern);
  E.wait(s);
  assert.equal(b.certification, modern ? 1 : 0);
}
{
  const s = redirectFixture(true, false), b = s.battle;
  // Legacy fire ignores enemy occupants instead of damaging them.
  const shooter = b.enemies.find(e => e.type === 'sentinel');
  shooter.x = 2; shooter.intent.x = 2;
  E.wait(s);
  assert.equal(b.enemies.find(e => e.type === 'clerk').hp, 3);
  assert.equal(b.certification, 1);
}

// Publication previews must remain pure and match actual resolution at each
// campaign boundary, including all prior publication patterns, fragile/repaired
// dependencies, understanding thresholds, captures, and either final choice.
const outcomes = new Set();
let forecasts = 0;
for (const campaign of [0, 1, 2]) for (let methods = 0; methods < 32; methods++) {
  for (let fragile = 0; fragile < 8; fragile++) for (const repaired of [false, true]) {
    const base = E.fresh();
    base.mission = campaign * 6;
    base.verified = base.baselineVerified = campaign * 3;
    base.automated = base.baselineAutomated = campaign * 3;
    for (let i = 0; i < 5; i++) {
      base.phase = 'decision';
      base.battle = {captured: false, forced: !!(fragile & (i === 0 ? 1 : i === 4 ? 2 : 0))};
      E.resolve(base, methods & (1 << i) ? 'automate' : 'verify');
    }
    if (repaired) base.caseRecords.forEach(r => {r.repaired = true;});
    for (const understanding of [0, 21, 29, 32, 39, 48, 58, 100]) {
      for (const method of ['verify', 'automate']) {
        const s = clone(base);
        s.understanding = understanding;
        s.phase = 'decision';
        s.battle = {captured: !!(methods & 1), forced: !!(fragile & 4)};
        const before = clone(s), forecast = E.forecast(s, method), actual = clone(s);
        assert.deepEqual(s, before, 'Forecast must never publish or alter its input');
        assert.equal(E.resolve(actual, method), true);
        assert.deepEqual(forecast, {
          ending: actual.ending, understanding: actual.understanding,
          credits: actual.credits, gaps: actual.endingGaps,
          mission: actual.mission, phase: actual.phase
        });
        outcomes.add(forecast.ending); forecasts++;
      }
    }
  }
}
assert.deepEqual([...outcomes].sort(), ['commons', 'contested', 'hollow']);
{
  const s = E.fresh(), before = clone(s);
  assert.equal(E.forecast(s, 'verify'), null);
  s.phase = 'decision'; s.battle = {captured: false};
  assert.equal(E.forecast(s, 'invalid'), null);
  assert.deepEqual(E.forecast(s, 'verify'), {
    ending: null, understanding: 88, credits: 75, gaps: [], mission: 1, phase: 'hub'
  });
  assert.equal(s.mission, before.mission);
  assert.equal(s.caseRecords.length, 0);
}

console.log(`Tactical rules passed: Reassign previews/execution, numeric response order, friendly fire, save compatibility, Tools II, Wren range, and ${forecasts} publication forecasts.`);
