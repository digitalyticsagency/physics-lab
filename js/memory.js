/* Retention layer: spaced repetition, cloze drills, active-recall prompts, notes, streak.
   Everything is stored locally under pl_srs / pl_notes / pl_streak. */

const SRS = {
  load(){ try{ return JSON.parse(localStorage.getItem('pl_srs')||'{}'); }catch(e){ return {}; } },
  save(d){ localStorage.setItem('pl_srs', JSON.stringify(d)); },
  today(){ return Math.floor(Date.now()/86400000); },

  /* Every card the learner has unlocked. Chapters unlock when marked understood. */
  cards(){
    const out = [];
    const prog = store.get();
    ALL_CHAPTERS.forEach(c => {
      if(!(prog[c.id] && prog[c.id].read)) return;
      (c.formulas||[]).forEach((f,i) => {
        out.push({id:`f:${c.id}:${i}`, type:'formula', ch:c, front:chFormulaDesc(c,i), back:fText(f.f)});
        const cl = SRS.cloze(f.f);
        if(cl) out.push({id:`z:${c.id}:${i}`, type:'cloze', ch:c, front:cl.masked, back:cl.answer, hint:chFormulaDesc(c,i), opts:cl.opts});
      });
      (c.terms||[]).slice(0,3).forEach((tm,i) => {
        const q = isBn() ? `"${tr(c,'title')}" অধ্যায়ে “${tm}” বলতে কী বোঝায়?`
                         : `In "${c.title}", what does “${tm}” mean?`;
        out.push({id:`t:${c.id}:${i}`, type:'term', ch:c, front:q, back:null});
      });
    });
    // questions previously answered wrong always come back
    const wrong = JSON.parse(localStorage.getItem('pl_wrong')||'[]');
    wrong.forEach(w => {
      const c = ALL_CHAPTERS.find(x=>x.id===w.ch); const q = (quizFor(w.ch)||[])[w.i];
      if(c && q) out.push({id:`q:${w.ch}:${w.i}`, type:'quiz', ch:c, front:q.q, back:q.o[q.a], why:q.e});
    });
    return out;
  },

  /* Blank out one symbol on the right-hand side of a formula. */
  cloze(f){
    const eq = f.indexOf('=');
    if(eq < 0) return null;
    const rhs = f.slice(eq+1);
    const syms = rhs.match(/[A-Za-zμµωλθΔΣ][₀-₉a-zA-Z]?/g);
    if(!syms || !syms.length) return null;
    const pick = syms[Math.floor(Math.random()*syms.length)];
    const masked = f.slice(0,eq+1) + rhs.replace(pick, ' ___ ');
    const pool = ['v','u','a','t','m','g','r','F','E','V','I','R','C','B','Q','T','λ','f','h','c','ω','θ','N','P'];
    const opts = [pick];
    while(opts.length < 4){ const o = pool[Math.floor(Math.random()*pool.length)]; if(!opts.includes(o)) opts.push(o); }
    return {masked, answer:pick, opts: opts.sort(()=>Math.random()-0.5)};
  },

  due(){
    const d = this.load(), day = this.today();
    return this.cards().filter(c => !d[c.id] || d[c.id].due <= day);
  },

  /* SM-2, simplified: quality 0 = Again, 3 = Hard, 4 = Good, 5 = Easy. */
  grade(id, q){
    const d = this.load(), day = this.today();
    const s = d[id] || {ef:2.5, interval:0, reps:0, lapses:0};
    if(q < 3){ s.reps = 0; s.interval = 0; s.lapses++; }
    else {
      s.reps++;
      s.interval = s.reps === 1 ? 1 : s.reps === 2 ? 3 : Math.round(s.interval * s.ef);
      if(q === 3) s.interval = Math.max(1, Math.round(s.interval * 0.6));
      if(q === 5) s.interval = Math.round(s.interval * 1.3);
      s.ef = Math.max(1.3, s.ef + (0.1 - (5-q)*(0.08 + (5-q)*0.02)));
    }
    s.due = day + Math.max(0, s.interval);
    d[id] = s; this.save(d);
    STREAK.touch();
    return s;
  },

  markWrong(ch, i){
    const w = JSON.parse(localStorage.getItem('pl_wrong')||'[]');
    if(!w.some(x=>x.ch===ch && x.i===i)){ w.push({ch,i}); localStorage.setItem('pl_wrong', JSON.stringify(w)); }
  },
  clearWrong(ch, i){
    const w = JSON.parse(localStorage.getItem('pl_wrong')||'[]').filter(x=>!(x.ch===ch && x.i===i));
    localStorage.setItem('pl_wrong', JSON.stringify(w));
  }
};

const STREAK = {
  get(){ try{ return JSON.parse(localStorage.getItem('pl_streak')||'{"count":0,"last":null}'); }catch(e){ return {count:0,last:null}; } },
  touch(){
    const s = this.get(), day = SRS.today();
    if(s.last === day) return s;
    s.count = (s.last === day-1) ? s.count+1 : 1;
    s.last = day;
    localStorage.setItem('pl_streak', JSON.stringify(s));
    return s;
  }
};

const NOTES = {
  all(){ try{ return JSON.parse(localStorage.getItem('pl_notes')||'{}'); }catch(e){ return {}; } },
  get(id){ return this.all()[id]||''; },
  set(id, v){ const a = this.all(); a[id] = v; localStorage.setItem('pl_notes', JSON.stringify(a)); }
};

/* ---------- review session UI ---------- */
function renderReview(host){
  let queue = SRS.due().sort(()=>Math.random()-0.5);   // interleaved on purpose
  const streak = STREAK.get();
  const head = el('div','card');
  host.appendChild(head);
  const body = el('div');
  host.appendChild(body);

  function header(){
    head.innerHTML = `<div class="row" style="justify-content:space-between">
      <b>${queue.length} ${t('cardsLeft')}</b>
      <span class="tag">🔥 ${streak.count} ${t('streak')}</span></div>`;
    updateGlobal();
  }
  function done(){
    body.innerHTML = `<div class="card"><b>✅ ${t('noDue')}</b>
      <p class="lede">${t('reviewDoneNote')}</p>
      <a class="btn" href="#/">${t('backToCourse')}</a></div>`;
    header();
  }
  function next(){
    header();
    if(!queue.length) return done();
    const card = queue[0];
    body.innerHTML = '';
    const box = el('div','card');
    box.appendChild(el('div','crumb', tr(card.ch,'title')));

    if(card.type === 'cloze'){
      box.appendChild(el('h3',null, t('clozePrompt')));
      box.appendChild(el('div','formula', card.front));
      box.appendChild(el('p','hint', card.hint||''));
      const opts = el('div','opts');
      card.opts.forEach(o=>{
        const b = el('button','opt', o);
        b.onclick = ()=>{
          const ok = o === card.back;
          b.classList.add(ok?'correct':'wrong');
          if(!ok) [...opts.children].find(x=>x.textContent===card.back)?.classList.add('correct');
          setTimeout(()=>{ SRS.grade(card.id, ok?4:0); queue.shift(); if(!ok) queue.push(card); next(); }, ok?450:1400);
        };
        opts.appendChild(b);
      });
      box.appendChild(opts);
    } else {
      box.appendChild(el('h3',null, card.front));
      if(card.type==='formula') box.appendChild(el('p','hint', t('recallFirst')));
      const showBtn = el('button','btn', t('showAnswer'));
      const ans = el('div','hidden');
      if(card.back) ans.appendChild(el('div','formula', card.back));
      if(card.why) ans.appendChild(el('div','explain', card.why));
      if(card.type==='term') ans.appendChild(el('div','explain',
        `${t('openChapter')}: <a href="#/c/${card.ch.id}">${tr(card.ch,'title')}</a>. ${t('gradeHonestly')}`));
      const grades = el('div','row hidden');
      [[t('again'),0],[t('hard'),3],[t('good'),4],[t('easy'),5]].forEach(([lab,q])=>{
        const b = el('button','btn small'+(q===0?'':' ghost'), lab);
        b.onclick = ()=>{ SRS.grade(card.id, q); queue.shift(); if(q===0) queue.push(card); next(); };
        grades.appendChild(b);
      });
      showBtn.onclick = ()=>{ ans.classList.remove('hidden'); grades.classList.remove('hidden'); showBtn.classList.add('hidden'); };
      box.appendChild(showBtn); box.appendChild(ans); box.appendChild(grades);
    }
    body.appendChild(box);
    body.appendChild(el('p','hint', `<a href="#/c/${card.ch.id}">${tr(card.ch,'title')} →</a>`));
  }
  next();
}

/* ---------- stepped worked example (predict, then reveal) ---------- */
function steppedExample(ex, host){
  const card = el('div','card');
  card.appendChild(el('p',null, `<b>${t('problem')}.</b> ${ex.problem}`));
  card.appendChild(el('p','hint', t('predictFirst')));
  const ol = el('ol'); card.appendChild(ol);
  let shown = 0;
  const row = el('div','row');
  const one = el('button','btn small', t('reveal'));
  const all = el('button','btn small ghost', t('revealAll'));
  function reveal(n){
    while(shown < n && shown < ex.steps.length){ ol.appendChild(el('li',null, ex.steps[shown])); shown++; }
    if(shown >= ex.steps.length){ one.classList.add('hidden'); all.classList.add('hidden'); }
  }
  one.onclick = ()=> reveal(shown+1);
  all.onclick = ()=> reveal(ex.steps.length);
  row.appendChild(one); row.appendChild(all);
  card.appendChild(row);
  host.appendChild(card);
}

/* ---------- active recall box before the quiz ---------- */
function recallBox(ch, host){
  const box = el('div','callout');
  box.innerHTML = `<div class="lbl">${t('recallTitle')}</div><p class="hint">${t('recallHint')}</p>`;
  const ta = el('textarea');
  ta.style.cssText = 'width:100%;min-height:90px;padding:.6rem;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit';
  ta.value = NOTES.get(ch.id);
  const btn = el('button','btn small', t('saveNote'));
  btn.onclick = ()=>{ NOTES.set(ch.id, ta.value); btn.textContent = t('saved'); STREAK.touch(); setTimeout(()=>btn.textContent=t('saveNote'), 1500); };
  box.appendChild(ta); box.appendChild(btn);
  host.appendChild(box);
}
