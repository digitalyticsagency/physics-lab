# ⚛️ PhysicsLab — learn physics from the beginning

An interactive, self-contained physics course for absolute beginners through Year 11 and Year 12 (A-Level / HSC / IB foundation / high-school physics anywhere). Every chapter pairs a plain-language explanation with a live simulation you can play with, a worked example, real-world uses, curated video searches and a quiz that tracks your progress.

No build step, no dependencies, no account. Open `index.html` and start.

## What's inside

| | |
|---|---|
| **30 chapters** | across 9 units, from "what is a unit" to special relativity |
| **20 live simulations** | real physics recomputed every frame — projectiles, orbits, collisions, waves, circuits, fields, decay |
| **121 quiz questions** | every answer explained, right or wrong |
| **3 games** | target practice, formula rush, graph detective |
| **AI tutor** | knows which chapter you're on; works with zero setup, or with your own API key |
| **Progress tracking** | stored locally in your browser, nothing sent anywhere |

### Course map

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
  ai.js             tutor: live API mode + offline retrieval coach
  app.js            router, rendering, progress, sim mounting
```

## Privacy

Everything runs in your browser. Progress and settings live in `localStorage`. The only outbound requests are the ones you trigger yourself: YouTube search links you click, and API calls to Anthropic if you have added a key.

## Licence

MIT — see [LICENSE](LICENSE).
