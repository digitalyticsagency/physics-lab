/* Mistake notebook + knowledge-state model ("physics twin").
   Storage: pl_mistakes, pl_twin. */

const MISTAKES = {
  all(){ try{ return JSON.parse(localStorage.getItem('pl_mistakes')||'[]'); }catch(e){ return []; } },
  save(a){ localStorage.setItem('pl_mistakes', JSON.stringify(a.slice(-500))); },
  add(m){
    const a = this.all();
    a.push(Object.assign({t:Date.now(), fixed:false}, m));
    this.save(a);
  },
  markFixed(t){ const a = this.all(); const m = a.find(x=>x.t===t); if(m) m.fixed = !m.fixed; this.save(a); },
  remove(t){ this.save(this.all().filter(x=>x.t!==t)); },
  byChapter(){
    const g = {};
    this.all().forEach(m=>{ (g[m.ch] = g[m.ch]||[]).push(m); });
    return g;
  }
};

/* Bayesian knowledge tracing, one node per chapter.
   pL  = probability you know it · pT = chance of learning per attempt
   pS  = slip (know it, still wrong) · pG = guess (do not know it, still right) */
const TWIN = {
  P: {pL0:0.20, pT:0.16, pS:0.10, pG:0.25},
  load(){ try{ return JSON.parse(localStorage.getItem('pl_twin')||'{}'); }catch(e){ return {}; } },
  save(d){ localStorage.setItem('pl_twin', JSON.stringify(d)); },

  state(ch){
    const d = this.load();
    return d[ch] || {pL:this.P.pL0, n:0, right:0, last:Date.now()};
  },

  /* Forgetting: knowledge decays toward the prior, faster when it was learned once and left. */
  decayed(ch){
    const s = this.state(ch);
    const days = (Date.now() - (s.last||Date.now())) / 86400000;
    const halfLife = 4 + 20 * s.pL;                       // stronger knowledge fades slower
    const keep = Math.pow(0.5, days / halfLife);
    return this.P.pL0 + (s.pL - this.P.pL0) * keep;
  },

  observe(ch, correct){
    const d = this.load();
    const s = d[ch] || {pL:this.P.pL0, n:0, right:0, last:Date.now()};
    const pL = this.decayed(ch);
    const {pS, pG, pT} = this.P;
    const post = correct
      ? (pL*(1-pS)) / (pL*(1-pS) + (1-pL)*pG)
      : (pL*pS)     / (pL*pS     + (1-pL)*(1-pG));
    s.pL = post + (1-post)*pT;
    s.n++; if(correct) s.right++;
    s.last = Date.now();
    d[ch] = s; this.save(d);
    return s.pL;
  },

  /* Predicted exam score: mean mastery over every chapter, decayed to today. */
  examScore(){
    const vals = ALL_CHAPTERS.map(c=>this.decayed(c.id));
    return Math.round(100 * vals.reduce((a,b)=>a+b,0) / vals.length);
  },

  /* What to study in the next 15 minutes: the chapter with the most to gain.
     Highest gain sits mid-mastery — not the ones you know, not the ones untouched. */
  recommend(){
    const prog = store.get();
    const scored = ALL_CHAPTERS.map(c=>{
      const p = this.decayed(c.id);
      const seen = !!(prog[c.id] && prog[c.id].read);
      const mistakes = MISTAKES.all().filter(m=>m.ch===c.id && !m.fixed).length;
      // fading knowledge and unfixed mistakes are the most valuable minutes
      let gain = seen ? (1 - p) * (0.55 + 0.45*p) : 0.35;
      gain += Math.min(0.3, mistakes*0.06);
      return {c, p, seen, mistakes, gain};
    });
    scored.sort((a,b)=>b.gain-a.gain);
    return scored[0];
  },

  weakest(n=5){
    const prog = store.get();
    return ALL_CHAPTERS
      .filter(c=>prog[c.id] && prog[c.id].read)
      .map(c=>({c, p:this.decayed(c.id)}))
      .sort((a,b)=>a.p-b.p).slice(0,n);
  }
};
