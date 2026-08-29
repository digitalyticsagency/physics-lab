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
| **Spaced repetition** | formulas, cloze drills, derivations and every quiz question you missed come back on a widening schedule |
| **500,000+ practice questions** | 96 numeric templates that randomise their numbers, graded on value *and* unit |
| **Difficulty ladder** | concept → one-step → two-step → exam-style, unlocked four-in-a-row at a time |
| **Mistake notebook** | every wrong answer collected automatically, your answer beside the right one |
| **Physics twin** | Bayesian knowledge tracing per chapter — mastery, forgetting, predicted exam score, and what to study next |
| **Derivation map** | all 56 equations traced back to eight roots, as a clickable graph |
| **Photo marking** | upload handwritten working and get it checked line by line |
| **One-page print sheets** | key idea, diagram, formulas, memory hook and five questions per chapter |
| **বাংলা / English** | one-click toggle — the entire app, including every explanation, worked example and quiz question |
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

The **বাং / EN** button in the header switches everything: interface, navigation, unit and chapter titles, summaries, the beginner layer, all 110 detailed section bodies, formula descriptions, worked examples, real-world examples, all 129 quiz questions with their explanations, the 20 simulations (titles, descriptions, slider labels), the diagram captions, all three games, and the AI tutor panel. Equations keep their standard symbols, which are the same in both languages.

Bangla lives in four files — `js/data/i18n.js` (interface), `bn-content.js` (chapters, simulations, games), `bn-detail.js` (full-detail bodies) and `bn-quiz.js` (questions). Every lookup falls back to English if a string is missing, so a partial translation can never blank the page. Adding a third language means adding the same four blocks.

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
  data/bn-content.js  Bangla chapters, simulations and games
  data/bn-detail.js   Bangla bodies for the full-detail sections
  data/bn-quiz.js     Bangla question bank
  graphics.js       32 animated inline SVG diagrams
  data/practice-bank.js  96 randomising numeric templates
  data/derivations.js    56-node derivation genealogy
  data/resources.js      95 curated free links (OpenStax, PhET, Khan, Physics Classroom)
  practice.js       ladder, numeric grading, photo marking
  twin.js           mistake store + knowledge-state model
  derive.js         DAG layout and derivation cards
  memory.js         spaced repetition, cloze cards, recall box, notes, streak
  ai.js             tutor: live API mode + offline retrieval coach
  app.js            router, rendering, progress, sim mounting
```

## Privacy

Everything runs in your browser. Progress and settings live in `localStorage`. The only outbound requests are the ones you trigger yourself: YouTube search links you click, and API calls to Anthropic if you have added a key.

## Licence

MIT — see [LICENSE](LICENSE).
