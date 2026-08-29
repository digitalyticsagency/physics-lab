# ⚛️ PhysicsLab — learn physics from the beginning

An interactive, self-contained physics course for absolute beginners through Year 11 and Year 12 (A-Level / HSC / IB foundation / high-school physics anywhere). Every chapter pairs a plain-language explanation with a live simulation you can play with, a worked example, real-world uses, curated video searches and a quiz that tracks your progress.

No build step, no dependencies, no account. Open `index.html` and start.

## What's inside

| | |
|---|---|
| **Beginner-first** | every chapter opens in **Simple mode**: a picture, plain English, an everyday comparison and a memory trick — formulas stay folded away until you ask for them |
| **32 chapters** | across 10 units, starting with two that contain no formulas at all |
| **32 animated diagrams** | hand-built inline SVG, themed light/dark, no external image host to break |
| **20 live simulations** | real physics recomputed every frame — projectiles, orbits, collisions, waves, circuits, fields, decay |
| **121 quiz questions** | every answer explained, right or wrong |
| **3 games** | target practice, formula rush, graph detective |
| **AI tutor** | knows which chapter you're on; works with zero setup, or with your own API key |
| **Spaced repetition** | formulas, cloze drills and every quiz question you missed come back on a widening schedule |
| **বাংলা / English** | one-click toggle for the interface, chapter titles, summaries and a Bangla key-idea box |
| **Progress tracking** | stored locally in your browser, nothing sent anywhere |

## Built for someone starting from zero

Open any chapter and you get, in this order: an animated diagram, three or four short plain-English sentences, an everyday analogy, a trick for remembering it, and a small experiment you can do with things in your kitchen. Only then — behind a **Show the full explanation** button — come the formal sections, the equations and the worked example.

The 🌱 / 📖 button in the header switches every chapter between the two levels, and the choice is remembered.

Three one-click AI buttons sit under the simple explanation of each chapter: **Explain it even simpler**, **Give me an example**, **Quiz me**. They work with no API key at all — the offline coach answers from the chapter's own plain-English layer.

## Built to be remembered, not just read

The learning design is deliberate — these are the techniques with the strongest evidence behind them:

- **Retrieval before revelation.** Worked-example steps stay hidden until you ask for them, one at a time. Attempting first (and failing) encodes far better than reading a finished solution.
- **Self-explanation.** A recall box sits before every quiz: write the chapter back in your own words. All of them collect in **My Notes** — the most useful revision material you own, because you wrote it.
- **Spaced repetition (SM-2).** Marking a chapter *understood* unlocks its formulas as flashcards. Grade yourself Again / Hard / Good / Easy and cards return after 1 day, 3 days, then ever-wider gaps. Anything you miss comes back tomorrow.
- **Cloze deletion.** Formula cards also appear with one symbol blanked out, so you reconstruct the equation instead of recognising it.
- **Error-driven review.** Every quiz question you get wrong is queued into the deck automatically and stays until you get it right.
- **Interleaving.** The daily review mixes chapters and card types rather than blocking by topic — harder in the moment, much better for transfer.
- **Prediction.** Simulations invite you to predict before moving a slider; a surprising result is a misconception being corrected.
- **Streaks.** A day counter for consistency, not a leaderboard.

### Course map

0. **Start Here** — what physics actually is · how to learn this fast *(no equations)*
1. **Foundations** — quantities and units · measurement and uncertainty · vectors
2. **Kinematics** — straight-line motion · motion graphs · projectiles
3. **Dynamics** — Newton's laws · friction and inclines · circular motion · gravitation
4. **Energy & Momentum** — work, energy, power · momentum and collisions · simple harmonic motion
5. **Waves, Sound & Light** — wave properties · superposition and standing waves · Doppler · optics
6. **Thermal** — heat and temperature · gas laws and kinetic theory · thermodynamics
7. **Electricity** — charge, field, potential · DC circuits · capacitors
8. **Magnetism & EM** — magnetic force · induction · electromagnetic waves
9. **Modern** — quantum nature of light · atomic spectra · nuclear physics · special relativity

## Run it

Just open the file:

```bash
open index.html
```

Or serve it (needed if your browser restricts local files):

```bash
python3 -m http.server 8712
```

Then visit http://localhost:8712

## The AI tutor

Two modes:

- **Offline coach** (default, no setup) — ranked retrieval over the course's own sections, formulas and worked examples. Ask "explain terminal velocity" or "centripetal force formula" and it finds and quotes the right passage.
- **Live tutoring** — click ⚙️ in the tutor panel and paste your own [Anthropic API key](https://console.anthropic.com/). The key is stored in your browser's localStorage on your device only and is sent directly to Anthropic's API, never to any other server. The tutor is given the current chapter's summary, formulas and key terms as context.

## Bangla mode

The **বাং / EN** button in the header switches the whole interface, unit and chapter titles, summaries, and adds a **মূল কথা** (key idea) box written in Bangla for all 30 chapters. Detailed explanations, worked examples and quizzes stay in English on purpose, so exam vocabulary stays familiar. Bangla strings live in `js/data/i18n.js` (`UI.bn`, `BN_UNITS`, `BN_CH`) — adding another language means adding one more block there.

## Adding another subject

The whole app is data-driven. `js/data/physics.js` ends with:

```js
const SUBJECTS = [PHYSICS];
```

Add a second object with the same shape — `{id, name, icon, tagline, units:[{id,title,icon,blurb,chapters:[…]}]}` — and the navigation, search, formula sheet and progress tracker all pick it up with no other changes. Chapters need `{id, title, level, summary, sections, formulas, example, realWorld, videos, terms}` and optionally `sim: '<id from js/sims.js>'`.

## Adding a simulation

Each entry in `js/sims.js` is:

```js
mySim: {
  title: '…', desc: '…',
  params: [P('k','Label',min,max,step,default,'unit')],
  init: (p) => ({ /* state */ }),
  step: (s, dt, p) => { /* physics */ },
  draw: (ctx, s, p, W, H) => { /* canvas */ },
  read: (s, p) => [['label','value']]
}
```

The sliders, play/pause, reset button and readout panel are generated automatically. Reference it from a chapter with `sim:'mySim'`.

## Project layout

```
index.html
css/style.css
js/
  data/physics.js   curriculum content (units → chapters)
  data/quiz.js      question bank keyed by chapter id
  sims.js           20 simulations + tiny canvas helper library
  games.js          3 games
  data/i18n.js      Bangla/English strings and per-chapter translations
  data/simple.js    beginner layer (plain words, analogy, memory hook) + the Start Here unit
  graphics.js       32 animated inline SVG diagrams
  memory.js         spaced repetition, cloze cards, recall box, notes, streak
  ai.js             tutor: live API mode + offline retrieval coach
  app.js            router, rendering, progress, sim mounting
```

## Privacy

Everything runs in your browser. Progress and settings live in `localStorage`. The only outbound requests are the ones you trigger yourself: YouTube search links you click, and API calls to Anthropic if you have added a key.

## Licence

MIT — see [LICENSE](LICENSE).
