# Lemma Debt

**Theorems are property. Understanding is a liability.**

**[Play in your browser](https://s4turn.github.io/lemma-debt/)** · [Source on GitHub](https://github.com/s4turn/lemma-debt)

An original, darkly comic browser tactics game about corporations privatizing mathematical truth. Command three obsolete mathematicians through eighteen operations and three connected campaigns, recover the evidence, and decide whether to verify the work or automate the claim.

No downloads needed. Inspired by Syndicate [Bullfrog, 1993]. FreeSynd was consulted during research; its code and assets are not included. See [provenance](PROVENANCE.md).

**Revision 04.2 connects the three campaigns through revised briefings, aftermaths and endings, with specific consequences for checked, automated and repaired evidence. Console cancellation now needs an intervening enemy response to recharge; cooling uses still reopen sealed evidence.**

**Night School’s opening is a guided drill: follow a named agent, a marked target and confirmation before the next instruction.**

**Tactical revision 02:** visible enemy orders, three squad abilities, four officer behaviors, circuit-controlled doors and enemies, defended hearings, and a compact phone grid.

## Play locally

From this directory:

```sh
python3 -m http.server 38741 --bind 127.0.0.1
```

Open **http://127.0.0.1:38741/**. Leave Terminal running while playing; Control-C stops the server. This address is local to your computer. A public hosted URL can be opened directly on a phone.

The game needs a modern browser with JavaScript, Canvas and localStorage. Audio uses optional Web Audio. There are no runtime packages, downloaded fonts, analytics, multiplayer servers or cloud saves.

## Play

- Select a READY agent, then tap a bright blue tile. The white destination and route preview show the move; **Confirm move** spends the action.
- Tap a red-ringed officer to preview damage, then confirm an attack.
- Recover the gold evidence and upload at that same terminal. Old in-battle saves retain their cyan exit.
- Each agent has one action per round. Enemies respond after all surviving agents act, or when you end the round.

Short, dismissible tooltips introduce new objectives, circuit layouts and mechanics. Tap the **?** controls to reopen explanations or pause automatic tips. The first operation and first school class have an optional, contextual tutorial: its prompts and “Show me” previews respond to your actual moves, attacks and recovery. You still confirm every order. Toggle it off or resume it at any time.

Choose **Night school · learn by playing** at the opening screen to learn movement and combat, two-signature seals, linked switches, and a witnessed two-round decode. Its first class begins with a fixed demonstration: only the designated input advances the instruction. **Locate control** points without choosing or executing anything. After **Take command**, recovery and upload are yours to solve. **Skip guided drill** explicitly unlocks free play; later classes are open-ended. Every class uses the real tactical rules, with a fresh squad and no rival clock. School progress is session-only and never overwrites a campaign; leaving or reloading returns to the opening screen.

The optional **How to play** guide has four short action cards and expandable rules. Headquarters offers small practice boards that use the real rules without changing campaign progress.

## Campaigns

1. **The Broken Register** — a repossessed proof exposes the lemma beneath the ownership system.
2. **The Department of Comprehension** — workers and an inconvenient model investigate implants that suppress explanations.
3. **The Last Audit** — the squad challenges a subscription to reality and a circular public audit.

Each campaign has six operations and three possible endings. Credits, understanding, upgrades and recorded outcomes carry forward. Choices change the next operation’s enforcement and get persistent case-file entries. Checked endings require three specific evidence links as well as enough review and understanding; old saves do not invent missing history.

## Saves

Progress saves automatically in the current browser under `lemma-debt-save-v1`. Saves are separate for each device, browser and website origin. **Save / restore** exports a portable text backup: use it when moving between a private development site, GitHub Pages or a custom domain. Clearing browser data removes the local save. A new campaign replaces it after confirmation.

## Source and checks

| File | Purpose |
| --- | --- |
| `engine.js`, `encounters.js` | Tactical rules, eighteen encounter layouts, progression and save state |
| `expansions.js`, `narrative.js` | Campaigns, characters, branches and endings |
| `game.js`, `style.css`, `index.html` | Interface, Canvas map, help and synthesized audio |
| `figures.js`, `logo.svg`, `mark.svg`, `landing-art.svg` | Original pixel characters, portraits, title-screen art and branding |
| `scenes.js`, `practice.js`, `tutorial.js` | Animated scenes, playable rehearsals and first-mission coaching |
| `school.js`, `drill.js`, `hints.js` | Independent school scenario, required opening sequence and contextual explanations |
| `tests/` | Campaign simulations, narrative coverage and mocked UI interactions |

Node.js 20 or newer runs the checks; no package installation is needed:

```sh
npm test
npm run build
```

In a Git checkout, `npm run check:public` checks tracked filenames against the release allowlist before publication.

The title-screen logo and scene can be regenerated with `node scripts/title-art.mjs`; all letterforms and illustration shapes are authored in that script.

The build copies an explicit list of game assets into `dist/`. It does not bundle tests, development records or hosting credentials.

## Hosting

The included GitHub Actions workflow checks every change and deploys the static game from `main` when GitHub Pages is configured to use **GitHub Actions**. Forks must enable Pages themselves. Pull requests run checks without deploying. The build also works on any static host; upload the contents of `dist/`.

Gameplay runs entirely in each player's browser. The complete game payload is about 286 KB before compression, so 500 fresh loads transfer roughly 143 MB of file content. This supports using static hosting for hundreds of independent players; it is not a load-tested concurrency guarantee. GitHub Pages documents a [100 GB monthly soft bandwidth limit](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

## License

[MIT](LICENSE), copyright (c) 2026 Marshall Ball, covering the original code, writing, art and synthesized audio. Referenced projects retain their own licenses and trademarks. This is an independent game, with no claim of affiliation or endorsement.
