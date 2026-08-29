/* App shell: routing, rendering, progress, sim mounting, language. */
const $ = s => document.querySelector(s);
const el = (t,c,h)=>{ const e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e; };
const store = {
  get(){ try{ return JSON.parse(localStorage.getItem('pl_progress')||'{}'); }catch(e){ return {}; } },
  set(v){ localStorage.setItem('pl_progress', JSON.stringify(v)); }
};
let CURRENT = null;
let simLoop = null;
let simGen = 0;
const MODE = {
  get(){ return localStorage.getItem('pl_mode')||'simple'; },
  set(v){ localStorage.setItem('pl_mode', v); },
  toggle(){ const n = this.get()==='simple'?'full':'simple'; this.set(n); return n; }
};          // generation token so old loops cannot survive a route change

/* ---------- progress ---------- */
function markUnderstood(id){
  const p = store.get(); p[id] = p[id]||{}; p[id].read = true; p[id].at = Date.now();
  store.set(p); STREAK.touch(); renderNav($('#searchBox').value); updateGlobal();
}
function saveQuiz(id, correct, total){
  const p = store.get(); p[id] = p[id]||{}; p[id].quiz = {correct,total,at:Date.now()};
  store.set(p); STREAK.touch(); renderNav($('#searchBox').value); updateGlobal();
}
function chapterDone(id){ const r = store.get()[id]; return !!(r && r.read && r.quiz && r.quiz.correct/r.quiz.total >= 0.6); }
function updateGlobal(){
  const done = ALL_CHAPTERS.filter(c=>chapterDone(c.id)).length;
  $('#globalProgress').textContent = Math.round(done/ALL_CHAPTERS.length*100)+'%';
  const due = SRS.due().length;
  const pill = $('#duePill');
  pill.textContent = '🧠 ' + due;
  pill.style.opacity = due ? 1 : .45;
}

/* ---------- navigation ---------- */
function renderNav(filter=''){
  const tree = $('#navTree'); tree.innerHTML='';
  const f = (filter||'').trim().toLowerCase();
  SUBJECTS.forEach(sub => sub.units.forEach(u => {
    const matches = u.chapters.filter(c => !f ||
      (c.title+' '+(c.bn_title||'')+' '+c.summary+' '+(c.bn_summary||'')+' '+(c.terms||[]).join(' ')+' '+
       (c.formulas||[]).map(x=>x.f).join(' ')).toLowerCase().includes(f));
    if(!matches.length) return;
    const open = f || (CURRENT && CURRENT._unit.id===u.id);
    const box = el('div','nav-unit'+(open?' open':''));
    const btn = el('button',null,`<span>${u.icon}</span><span>${tr(u,'title')}</span>`);
    btn.onclick = ()=> box.classList.toggle('open');
    box.appendChild(btn);
    const kids = el('div','kids');
    matches.forEach(c=>{
      const a = el('a','nav-ch'+(CURRENT&&CURRENT.id===c.id?' active':'')+(chapterDone(c.id)?' done':''),
        `<span class="dot"></span><span>${tr(c,'title')}</span>`);
      a.href = '#/c/'+c.id;
      kids.appendChild(a);
    });
    box.appendChild(kids);
    tree.appendChild(box);
  }));
  const foot = $('#sidebarFoot');
  const due = SRS.due().length;
  foot.innerHTML = `
    <a href="#/review">${t('review')} ${due?`<span class="tag" style="margin-left:auto">${due}</span>`:''}</a>
    <a href="#/lab">${t('lab')}</a>
    <a href="#/games">${t('games')}</a>
    <a href="#/formulas">${t('formulas')}</a>
    <a href="#/notes">${t('notes')}</a>
    <a href="#/progress">${t('progress')}</a>`;
  $('#searchBox').placeholder = t('search');
}

/* ---------- simulation mounting ---------- */
function mountSim(container, simId){
  const sim = SIMS[simId]; if(!sim) return;
  const gen = ++simGen;
  const params = {}; (sim.params||[]).forEach(p=>params[p.k]=p.def);
  const wrap = el('div','sim-wrap');
  const left = el('div');
  const cv = el('canvas','sim'); cv.width=800; cv.height=450;
  left.appendChild(cv);
  const ctrls = el('div','controls');
  wrap.appendChild(left); wrap.appendChild(ctrls);
  container.appendChild(wrap);

  const ctx = cv.getContext('2d');
  let state = sim.init ? sim.init(params) : {};
  let playing = true, last = performance.now();

  (sim.params||[]).forEach(p=>{
    const d = el('div','ctl');
    d.innerHTML = `<label>${p.label} <span class="valbox" id="v_${p.k}">${p.def}${p.unit?' '+p.unit:''}</span></label>`;
    const inp = el('input'); inp.type='range'; inp.min=p.min; inp.max=p.max; inp.step=p.step; inp.value=p.def;
    inp.oninput = () => {
      params[p.k] = +inp.value;
      d.querySelector('#v_'+p.k).textContent = inp.value + (p.unit?' '+p.unit:'');
      if(sim.init) state = sim.init(params);
    };
    d.appendChild(inp); ctrls.appendChild(d);
  });

  const row = el('div','row');
  const play = el('button','btn small','⏸');
  play.onclick = ()=>{ playing=!playing; play.textContent = playing?'⏸':'▶'; };
  const reset = el('button','btn small ghost','↺');
  reset.onclick = ()=>{ state = sim.init?sim.init(params):{}; };
  row.appendChild(play); row.appendChild(reset);
  (sim.buttons||[]).forEach(b=>{
    const bb = el('button','btn small ghost', b.label);
    bb.onclick = ()=> b.fn(state, params);
    row.appendChild(bb);
  });
  ctrls.appendChild(row);
  const ro = el('div','readouts'); ctrls.appendChild(ro);

  function frame(now){
    if(gen !== simGen) return;                 // a newer sim owns the screen
    const dt = Math.min(0.05,(now-last)/1000); last=now;
    if(playing && sim.step) sim.step(state, dt, params);
    sim.draw(ctx, state, params, 800, 450);
    const rows = sim.read ? sim.read(state, params) : null;
    if(rows && rows.length) ro.innerHTML = rows.map(r=>`<div><span>${r[0]}</span> = ${r[1]}</div>`).join('');
    else ro.style.display='none';
    simLoop = requestAnimationFrame(frame);
  }
  simLoop = requestAnimationFrame(frame);
}

/* ---------- quiz ---------- */
function mountQuiz(container, chId){
  const qs = QUIZ[chId]; if(!qs) return;
  let correct = 0, answered = 0;
  const head = el('div','row');
  head.innerHTML = `<span class="tag">${qs.length} ${t('quizQuestions')}</span><span class="tag" id="qScore">0 / ${qs.length}</span>`;
  container.appendChild(head);
  qs.forEach((q,i)=>{
    const box = el('div','q');
    box.appendChild(el('div','qtext',`${i+1}. ${q.q}`));
    const opts = el('div','opts');
    q.o.forEach((o,j)=>{
      const b = el('button','opt',o);
      b.onclick = ()=>{
        if(box.dataset.done) return;
        box.dataset.done = '1'; answered++;
        opts.querySelectorAll('.opt')[q.a].classList.add('correct');
        if(j===q.a){ correct++; SRS.clearWrong(chId,i); }
        else { b.classList.add('wrong'); SRS.markWrong(chId,i); }
        box.appendChild(el('div','explain', q.e + (j===q.a?'':` — <i>${t('addedToDeck')}</i>`)));
        $('#qScore').textContent = `${correct} / ${qs.length}`;
        if(answered===qs.length){
          saveQuiz(chId, correct, qs.length);
          const pass = correct/qs.length >= 0.6;
          container.appendChild(el('div','callout',
            `<div class="lbl">${t('result')}</div>${correct} / ${qs.length}. ${pass?t('passed'):t('failed')}`));
        }
      };
      opts.appendChild(b);
    });
    box.appendChild(opts);
    container.appendChild(box);
  });
}

/* ---------- views ---------- */
function viewHome(){
  const v = $('#view');
  const done = ALL_CHAPTERS.filter(c=>chapterDone(c.id)).length;
  const due = SRS.due().length, streak = STREAK.get().count;
  const nextCh = ALL_CHAPTERS.find(c=>!chapterDone(c.id)) || ALL_CHAPTERS[0];
  const started = ALL_CHAPTERS.some(c=>(store.get()[c.id]||{}).read);
  const bn = LANG.get()==='bn';
  v.innerHTML = `
    <div class="crumb">${PHYSICS.icon} ${bn?'ইন্টারঅ্যাকটিভ কোর্স':'Interactive course'}</div>
    <h1>${LANG.get()==='bn'?'একদম শুরু থেকে পদার্থবিজ্ঞান শিখুন':'Learn physics from the very beginning'}</h1>
    <p class="lede">${LANG.get()==='bn'
      ? 'শূন্য থেকে শুরু করে একাদশ ও দ্বাদশ শ্রেণির পুরো পদার্থবিজ্ঞান। প্রতিটি অধ্যায়ে সহজ ব্যাখ্যা, সমাধান করা উদাহরণ, বাস্তব ব্যবহার, চালিয়ে দেখার মতো সিমুলেশন এবং কুইজ আছে — সাথে ভুলে না যাওয়ার জন্য ব্যবধানযুক্ত রিভিশন।'
      : PHYSICS.tagline + ' Every chapter has a plain-language explanation, a worked example you reveal step by step, real-world uses, a live simulation and a quiz — plus spaced review so it actually stays in your head.'}</p>
    <div class="art-wrap hero">${ART.welcome}</div>
    <div class="card next-card">
      <div class="crumb">${bn?'পরের ধাপ':'Your next step'}</div>
      <b style="font-size:1.1rem">${started ? tr(nextCh,'title') : (bn?'একদম শুরু থেকে শুরু করুন':'Start at the very beginning')}</b>
      <p class="lede" style="font-size:.92rem;margin:.3rem 0 .6rem">${started ? tr(nextCh,'summary') : (bn?'প্রথম দুটি অধ্যায়ে কোনো সূত্র নেই — পদার্থবিজ্ঞান কী আর কীভাবে দ্রুত শিখবেন, শুধু সেটাই।':'The first two chapters contain no formulas at all — just what physics is, and how to study it so it sticks.')}</p>
      <div class="row">
        <a class="btn" href="#/c/${started?nextCh.id:ALL_CHAPTERS[0].id}">${started ? (bn?'চালিয়ে যান':'Continue') : t('startCh1')}</a>
        ${due?`<a class="btn ghost" href="#/review">🧠 ${due} ${t('dueToday')}</a>`:''}
      </div>
    </div>
    <div class="row" style="margin:1rem 0">
      <a class="btn ghost" href="#/lab">${t('openLab')}</a>
      <a class="btn ghost" href="#/games">${t('playGame')}</a>
    </div>
    <div class="card"><div class="row" style="justify-content:space-between">
      <b>${t('yourProgress')}</b>
      <span>${done} / ${ALL_CHAPTERS.length} ${t('chapters')} · 🔥 ${streak} ${t('streak')}</span></div>
      <div class="bar" style="margin-top:.5rem"><i style="width:${done/ALL_CHAPTERS.length*100}%"></i></div></div>
    <h2>${t('theCourse')}</h2>
    <div class="grid cols-3">
      ${PHYSICS.units.map(u=>`<a class="card" href="#/c/${u.chapters[0].id}" style="color:inherit">
        <div style="font-size:1.6rem">${u.icon}</div><b>${tr(u,'title')}</b>
        <p class="lede" style="font-size:.88rem">${tr(u,'blurb')}</p>
        <span class="tag">${u.chapters.length} ${t('chapters')}</span></a>`).join('')}
    </div>
    <h2>${LANG.get()==='bn'?'কীভাবে পড়লে মনে থাকবে':'How to make it stick'}</h2>
    <div class="grid cols-2">
      <div class="card"><b>1 · ${LANG.get()==='bn'?'আগে অনুমান, পরে উত্তর':'Predict, then reveal'}</b><p>${LANG.get()==='bn'
        ?'উদাহরণের ধাপগুলো লুকানো থাকে। নিজে চেষ্টা করে তারপর ধাপ খুলুন — আগে চেষ্টা করে ভুল করলে স্মৃতি অনেক পোক্ত হয়।'
        :'Worked-example steps stay hidden until you ask for them. Attempting first — even failing — builds far stronger memory than reading a finished solution.'}</p></div>
      <div class="card"><b>2 · ${LANG.get()==='bn'?'নিজের ভাষায় বলুন':'Say it in your own words'}</b><p>${LANG.get()==='bn'
        ?'কুইজের আগে ছোট বাক্সে অধ্যায়টি নিজের ভাষায় লিখুন। এই স্ব-ব্যাখ্যাই বোঝা আর মুখস্থের পার্থক্য গড়ে দেয়।'
        :'A recall box sits before every quiz. Explaining a chapter back to yourself is what separates understanding from recognition.'}</p></div>
      <div class="card"><b>3 · ${LANG.get()==='bn'?'ব্যবধানযুক্ত রিভিশন':'Spaced review'}</b><p>${LANG.get()==='bn'
        ?'বোঝা হয়েছে চিহ্নিত অধ্যায়ের সূত্র ও ভুল করা প্রশ্ন ফ্ল্যাশকার্ডে চলে যায় এবং ১ দিন, ৩ দিন, তারপর ক্রমশ বাড়তে থাকা ব্যবধানে ফিরে আসে।'
        :'Formulas from chapters you finish — and every quiz question you got wrong — become flashcards that return after 1 day, 3 days, then ever-wider gaps.'}</p></div>
      <div class="card"><b>4 · ${LANG.get()==='bn'?'হাত দিয়ে দেখুন':'Touch the physics'}</b><p>${LANG.get()==='bn'
        ?'স্লাইডার নাড়ানোর আগে ভাবুন কী হবে, তারপর নাড়ান। ভুল অনুমান ধরা পড়লেই ভুল ধারণা ভাঙে।'
        :'Before moving a slider, predict what will happen, then move it. A surprised prediction is a misconception being corrected.'}</p></div>
    </div>`;
}

function viewChapter(id){
  const ch = ALL_CHAPTERS.find(c=>c.id===id); if(!ch){ location.hash='#/'; return; }
  CURRENT = ch;
  const idx = ALL_CHAPTERS.indexOf(ch);
  const prev = ALL_CHAPTERS[idx-1], next = ALL_CHAPTERS[idx+1];
  const levelTag = {foundation:t('beginner'), y11:t('y11'), y12:t('y12')}[ch.level]||ch.level;
  const read = (store.get()[ch.id]||{}).read;
  const S = ch.simple;
  const simpleMode = MODE.get()==='simple';
  const bn = LANG.get()==='bn';
  const v = $('#view');

  const simpleBlock = S ? `
    <div class="simple-block">
      ${S.art && ART[S.art] ? `<div class="art-wrap">${ART[S.art]}</div>` : ''}
      <div class="plain">${S.what.map(w=>`<p>${w}</p>`).join('')}</div>
      <div class="callout"><div class="lbl">${bn?'সহজ তুলনা':'Think of it like this'}</div>${S.analogy}</div>
      <div class="callout remember"><div class="lbl">🧠 ${bn?'মনে রাখার কৌশল':'Trick to remember'}</div>${S.remember}</div>
      <div class="callout try"><div class="lbl">🖐 ${bn?'নিজে করে দেখুন':'Try it yourself'}</div>${S.tryThis}</div>
      <div class="row ai-quick" id="aiQuick"></div>
    </div>` : '';

  const detail = `
    ${ch.sections.map(s=>`<h2>${s.h}</h2><div>${s.body}</div>`).join('')}
    ${ch.formulas.length?`<h2>${t('formulasToKnow')}</h2>
      <p class="hint">${bn?'এখনই মুখস্থ করার দরকার নেই। প্রতিটি সূত্রের নিচে সাধারণ ভাষায় মানে লেখা আছে।'
        :'You do not need to memorise these yet. Read each one as the sentence written beside it — the flashcards will do the memorising later.'}</p>
      ${ch.formulas.map(f=>`<div class="formula"><b>${f.f}</b>   —   ${f.d}</div>`).join('')}`:''}
    ${ch.example?`<h2>${t('workedExample')} — ${ch.example.title}</h2><div id="exHost"></div>`:''}
    <h2>${t('realWorld')}</h2>
    <ul class="clean">${ch.realWorld.map(r=>`<li>${r}</li>`).join('')}</ul>`;

  v.innerHTML = `
    <div class="crumb">${ch._unit.icon} ${tr(ch._unit,'title')}</div>
    <h1>${tr(ch,'title')}</h1>
    <div class="row"><span class="tag">${levelTag}</span>${ch.sim?`<span class="tag">${t('interactiveSim')}</span>`:''}<span class="tag">${(QUIZ[ch.id]||[]).length} ${t('quizQuestions')}</span></div>
    ${(S && simpleMode && !bn) ? '' : `<p class="lede">${tr(ch,'summary')}</p>`}
    ${bn && ch.bn_keyIdea ? `<div class="callout"><div class="lbl">${t('keyIdea')}</div>${ch.bn_keyIdea}</div>` : ''}
    ${simpleBlock}
    ${S ? `<div class="row" style="margin:1.2rem 0 .4rem">
      <button class="btn ghost" id="detailBtn">${simpleMode ? (bn?'📖 পুরো ব্যাখ্যা দেখান':'📖 Show the full explanation') : (bn?'🌱 সহজ ভাষায় দেখান':'🌱 Keep it simple')}</button>
      <span class="hint">${bn?'সহজ মোড ডিফল্ট। প্রস্তুত হলে বিস্তারিত খুলুন।':'Simple mode is on by default. Open the detail when you feel ready.'}</span></div>` : ''}
    <div id="detailHost" class="${S && simpleMode ? 'hidden':''}">${detail}</div>
    ${ch.sim?`<h2>${t('tryIt')} — ${SIMS[ch.sim]?SIMS[ch.sim].title:''}</h2>
      <p class="lede">${SIMS[ch.sim]?SIMS[ch.sim].desc:''}</p>
      <p class="hint">${bn?'স্লাইডার নাড়ানোর আগে অনুমান করুন কী হবে — ভুল অনুমানই ভুল ধারণা ভাঙে।':'Predict what will happen before you move each slider. A surprise means a misconception is being corrected.'}</p>
      <div id="simHost"></div>`:''}
    <h2>${t('watch')}</h2>
    <div class="vidlist">${ch.videos.map(vd=>
      `<a target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(vd.q)}">▶ ${vd.t}<span class="spacer"></span><span class="tag">YouTube</span></a>`).join('')}
      <a target="_blank" rel="noopener" href="https://phet.colorado.edu/en/simulations/filter?q=${encodeURIComponent(ch.terms[0]||ch.title)}">🧪 ${bn?'PhET-এ আরও সিমুলেশন':'More simulations on PhET'}<span class="spacer"></span><span class="tag">PhET</span></a>
      <a target="_blank" rel="noopener" href="https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(ch.title+' physics')}&search_type=image">🖼 ${bn?'ছবি ও অ্যানিমেশন (উইকিমিডিয়া)':'Photos and animations (Wikimedia Commons)'}<span class="spacer"></span><span class="tag">free to use</span></a></div>
    <h2>${t('checkYourself')}</h2>
    <div id="recallHost"></div>
    <div id="quizHost"></div>
    <div class="row" style="margin-top:1rem">
      <button class="btn ghost" id="markBtn">${read?t('marked'):t('markRead')}</button>
      <button class="btn ghost" id="askBtn">${t('askTutor')}</button>
    </div>
    <div class="footer-nav">
      <div>${prev?`<a href="#/c/${prev.id}">← ${tr(prev,'title')}</a>`:''}</div>
      <div>${next?`<a href="#/c/${next.id}">${tr(next,'title')} →</a>`:''}</div>
    </div>`;

  if(ch.example && $('#exHost')) steppedExample(ch, $('#exHost'));
  if(ch.sim) mountSim($('#simHost'), ch.sim);
  recallBox(ch, $('#recallHost'));
  mountQuiz($('#quizHost'), ch.id);
  if(S){
    $('#detailBtn').onclick = ()=>{
      const on = MODE.toggle();
      viewChapter(id);
      if(on==='full') $('#detailHost').scrollIntoView({behavior:'smooth'});
    };
    const quick = $('#aiQuick');
    const asks = bn
      ? [['আরও সহজ করে বলো','Explain this even more simply, as if I am 12 years old'],
         ['একটা উদাহরণ দাও','Give me one more everyday example of this'],
         ['আমাকে প্রশ্ন করো','Ask me one question about this chapter and wait for my answer']]
      : [['Explain it even simpler','Explain this even more simply, as if I am 12 years old'],
         ['Give me an example','Give me one more everyday example of this'],
         ['Quiz me','Ask me one question about this chapter and wait for my answer']];
    asks.forEach(([label,prompt])=>{
      const b = el('button','btn small ghost', '🧠 '+label);
      b.onclick = ()=>{ openAI(); $('#aiText').value = prompt; $('#aiForm').dispatchEvent(new Event('submit',{cancelable:true})); };
      quick.appendChild(b);
    });
  }
  $('#markBtn').onclick = ()=>{ markUnderstood(ch.id); $('#markBtn').textContent = t('marked'); };
  $('#askBtn').onclick = ()=>{ openAI(); $('#aiText').focus(); };
  setChips();
}

function viewReview(){
  CURRENT = null;
  $('#view').innerHTML = `<div class="crumb">${t('review')}</div>
    <h1>${LANG.get()==='bn'?'ব্যবধানযুক্ত রিভিশন':'Spaced review'}</h1>
    <p class="lede">${LANG.get()==='bn'
      ?'যে অধ্যায়গুলো "বোঝা হয়েছে" চিহ্ন দিয়েছেন, তার সূত্র ও ভুল করা প্রশ্ন এখানে মিশিয়ে আসে। উত্তর দেখার আগে নিজে মনে করার চেষ্টা করুন।'
      :'Cards from chapters you have marked understood, mixed together on purpose. Try to recall before revealing — the effort is the point.'}</p>
    <div id="revHost"></div>`;
  renderReview($('#revHost'));
}

function viewNotes(){
  CURRENT = null;
  const notes = NOTES.all();
  const rows = ALL_CHAPTERS.filter(c=>notes[c.id] && notes[c.id].trim())
    .map(c=>`<div class="card"><div class="crumb">${tr(c._unit,'title')}</div>
      <b><a href="#/c/${c.id}">${tr(c,'title')}</a></b>
      <p style="white-space:pre-wrap">${notes[c.id].replace(/</g,'&lt;')}</p></div>`).join('');
  $('#view').innerHTML = `<div class="crumb">${t('notes')}</div><h1>${LANG.get()==='bn'?'আমার নোট':'My notes'}</h1>
    <p class="lede">${LANG.get()==='bn'
      ?'প্রতিটি অধ্যায়ের কুইজের আগে নিজের ভাষায় যা লিখেছেন, সব এক জায়গায়। পরীক্ষার আগে এগুলোই সবচেয়ে কাজে দেবে।'
      :'Everything you wrote in your own words before each quiz, in one place. This is the most useful revision material you own, because you wrote it.'}</p>
    ${rows || `<div class="card">${LANG.get()==='bn'?'এখনো কোনো নোট নেই। যেকোনো অধ্যায়ের কুইজের ঠিক আগের বাক্সে লিখুন।':'No notes yet. Write one in the recall box just above any chapter quiz.'}</div>`}`;
}

function viewLab(){
  CURRENT = null;
  $('#view').innerHTML = `<div class="crumb">${t('lab')}</div><h1>${LANG.get()==='bn'?'সব সিমুলেশন এক জায়গায়':'Every simulation in one place'}</h1>
    <p class="lede">${Object.keys(SIMS).length} ${LANG.get()==='bn'?'টি সিমুলেশন, প্রতিটি ফ্রেমে প্রকৃত পদার্থবিজ্ঞান হিসাব করে — কিছুই আগে থেকে রেকর্ড করা নয়।':'live simulations. Each one recomputes real physics every frame — nothing is pre-recorded.'}</p>
    <div class="grid cols-3">${Object.entries(SIMS).map(([k,s])=>
      `<a class="card" href="#/sim/${k}" style="color:inherit"><b>${s.title}</b><p class="lede" style="font-size:.88rem">${s.desc}</p></a>`).join('')}</div>`;
}
function viewSim(id){
  const s = SIMS[id]; if(!s){ location.hash='#/lab'; return; }
  const owner = ALL_CHAPTERS.find(c=>c.sim===id);
  CURRENT = owner || null;
  $('#view').innerHTML = `<div class="crumb"><a href="#/lab">${t('lab')}</a></div><h1>${s.title}</h1>
    <p class="lede">${s.desc}</p><div id="simHost"></div>
    ${owner?`<p style="margin-top:1rem">→ <a href="#/c/${owner.id}">${tr(owner,'title')}</a></p>`:''}`;
  mountSim($('#simHost'), id);
}

function viewGames(){
  CURRENT = null;
  $('#view').innerHTML = `<div class="crumb">${t('games')}</div><h1>${LANG.get()==='bn'?'খেলতে খেলতে অনুশীলন':'Practise by playing'}</h1>
    <div class="grid cols-3">${GAMES.map(g=>`<a class="card" href="#/game/${g.id}" style="color:inherit"><b>${g.title}</b><p class="lede" style="font-size:.88rem">${g.blurb}</p></a>`).join('')}</div>`;
}
function viewGame(id){
  const g = GAMES.find(x=>x.id===id); if(!g){ location.hash='#/games'; return; }
  CURRENT = null;
  $('#view').innerHTML = `<div class="crumb"><a href="#/games">${t('games')}</a></div><h1>${g.title}</h1><p class="lede">${g.blurb}</p><div id="gameHost"></div>`;
  g.mount($('#gameHost'));
}

function viewFormulas(){
  CURRENT = null;
  let html = `<div class="crumb">${t('formulas')}</div><h1>${LANG.get()==='bn'?'সূত্র তালিকা':'Formula sheet'}</h1>`;
  PHYSICS.units.forEach(u=>{
    html += `<h2>${u.icon} ${tr(u,'title')}</h2>`;
    u.chapters.forEach(c=>{
      html += `<h3><a href="#/c/${c.id}">${tr(c,'title')}</a></h3>`;
      html += c.formulas.map(f=>`<div class="formula"><b>${f.f}</b>   —   ${f.d}</div>`).join('');
    });
  });
  $('#view').innerHTML = html;
}

function viewProgress(){
  CURRENT = null;
  const p = store.get(), srs = SRS.load();
  const rows = ALL_CHAPTERS.map(c=>{
    const r = p[c.id]||{};
    const q = r.quiz ? `${r.quiz.correct}/${r.quiz.total}` : '—';
    const cards = Object.keys(srs).filter(k=>k.includes(':'+c.id+':')).length;
    return `<tr><td><a href="#/c/${c.id}">${tr(c,'title')}</a></td><td>${tr(c._unit,'title')}</td>
      <td>${r.read?'✓':'–'}</td><td>${q}</td><td>${cards||'–'}</td><td>${chapterDone(c.id)?'<b style="color:var(--good)">✓</b>':''}</td></tr>`;
  }).join('');
  const done = ALL_CHAPTERS.filter(c=>chapterDone(c.id)).length;
  const streak = STREAK.get();
  $('#view').innerHTML = `<div class="crumb">${t('progress')}</div><h1>${t('yourProgress')}</h1>
    <div class="card"><div class="row" style="justify-content:space-between">
      <b>${done} / ${ALL_CHAPTERS.length} ${t('chapters')} · 🔥 ${streak.count} ${t('streak')} · 🧠 ${SRS.due().length} ${t('dueToday')}</b>
      <button class="btn ghost small" id="resetProg">Reset all progress</button></div>
      <div class="bar" style="margin-top:.6rem"><i style="width:${done/ALL_CHAPTERS.length*100}%"></i></div></div>
    <table class="data"><tr><th>${LANG.get()==='bn'?'অধ্যায়':'Chapter'}</th><th>${LANG.get()==='bn'?'ইউনিট':'Unit'}</th>
      <th>${LANG.get()==='bn'?'পড়া':'Read'}</th><th>${LANG.get()==='bn'?'কুইজ':'Quiz'}</th>
      <th>${t('flashcards')}</th><th></th></tr>${rows}</table>`;
  $('#resetProg').onclick = ()=>{
    if(confirm('Erase all progress, notes and flashcard scheduling on this device?')){
      ['pl_progress','pl_srs','pl_notes','pl_wrong','pl_streak'].forEach(k=>localStorage.removeItem(k));
      route(); updateGlobal();
    }
  };
}

/* ---------- router ---------- */
function route(){
  simGen++;                                  // kill any running sim loop
  cancelAnimationFrame(simLoop);
  const h = location.hash.replace(/^#\/?/,'');
  const [a,b] = h.split('/');
  if(a==='c' && b) viewChapter(b);
  else if(a==='sim' && b) viewSim(b);
  else if(a==='game' && b) viewGame(b);
  else if(a==='lab') viewLab();
  else if(a==='games') viewGames();
  else if(a==='formulas') viewFormulas();
  else if(a==='progress') viewProgress();
  else if(a==='review') viewReview();
  else if(a==='notes') viewNotes();
  else { CURRENT=null; viewHome(); }
  renderNav($('#searchBox').value);
  updateGlobal();
  window.scrollTo(0,0);
  $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('on');
}

/* ---------- AI panel ---------- */
function openAI(){ $('#aiPanel').classList.add('open'); }
function closeAI(){ $('#aiPanel').classList.remove('open'); }
function setChips(){
  const chips = $('#aiChips'); chips.innerHTML='';
  const bn = LANG.get()==='bn';
  const suggestions = CURRENT
    ? (bn ? ['এই অধ্যায়টা সহজ করে বোঝাও','আরেকটা কঠিন অঙ্ক দাও','এখানে শিক্ষার্থীরা কোথায় ভুল করে?','বাস্তবে এর ব্যবহার কী?']
          : ['Explain this chapter simply','Give me a harder practice problem','What mistakes do students make here?','How is this used in real life?'])
    : (bn ? ['কোথা থেকে শুরু করব?','ভেক্টর কী?','একাদশ শ্রেণির পড়ার পরিকল্পনা দাও']
          : ['Where should I start?','Explain what a vector is','Give me a study plan for Year 11']);
  suggestions.forEach(s=>{
    const b = el('button',null,s);
    b.onclick = ()=>{ $('#aiText').value=s; $('#aiForm').dispatchEvent(new Event('submit',{cancelable:true})); };
    chips.appendChild(b);
  });
}
function aiMsg(role, text){
  const m = el('div','msg '+role, text.replace(/</g,'&lt;'));
  $('#aiLog').appendChild(m); $('#aiLog').scrollTop = 1e9; return m;
}

/* ---------- boot ---------- */
function boot(){
  const savedTheme = localStorage.getItem('pl_theme');
  document.body.dataset.theme = savedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light');
  $('#themeBtn').onclick = ()=>{
    const now = document.body.dataset.theme==='dark' ? 'light':'dark';
    document.body.dataset.theme = now; localStorage.setItem('pl_theme', now);
  };
  const syncMode = ()=>{ $('#modeBtn').textContent = MODE.get()==='simple' ? '🌱' : '📖';
    $('#modeBtn').title = MODE.get()==='simple' ? 'Simple mode — click for full detail' : 'Full detail — click for simple mode'; };
  syncMode();
  $('#modeBtn').onclick = ()=>{ MODE.toggle(); syncMode(); route(); };
  $('#langBtn').textContent = LANG.get()==='en' ? 'বাং' : 'EN';
  $('#langBtn').onclick = ()=>{
    LANG.toggle();
    document.documentElement.lang = LANG.get()==='bn' ? 'bn' : 'en';
    const syncMode = ()=>{ $('#modeBtn').textContent = MODE.get()==='simple' ? '🌱' : '📖';
    $('#modeBtn').title = MODE.get()==='simple' ? 'Simple mode — click for full detail' : 'Full detail — click for simple mode'; };
  syncMode();
  $('#modeBtn').onclick = ()=>{ MODE.toggle(); syncMode(); route(); };
  $('#langBtn').textContent = LANG.get()==='en' ? 'বাং' : 'EN';
    route(); setChips();
  };
  document.documentElement.lang = LANG.get()==='bn' ? 'bn' : 'en';

  $('#menuBtn').onclick = ()=>{ $('#sidebar').classList.toggle('open'); $('#scrim').classList.toggle('on'); };
  $('#scrim').onclick = ()=>{ $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('on'); closeAI(); };
  $('#searchBox').oninput = e => renderNav(e.target.value);
  document.addEventListener('keydown', e => { if(e.key==='Escape') closeAI(); });

  $('#aiBtn').onclick = openAI;
  $('#aiCloseBtn').onclick = closeAI;
  $('#aiSettingsBtn').onclick = ()=> $('#aiSettings').classList.toggle('hidden');
  $('#aiKey').value = AI.key(); $('#aiModel').value = AI.model();
  $('#aiSaveBtn').onclick = ()=>{
    localStorage.setItem('pl_key', $('#aiKey').value.trim());
    localStorage.setItem('pl_model', $('#aiModel').value);
    $('#aiSettings').classList.add('hidden');
    aiMsg('bot', $('#aiKey').value.trim() ? 'Key saved on this device. Live tutoring is on.' : 'Key cleared. Offline coach mode.');
  };
  $('#aiForm').onsubmit = async e => {
    e.preventDefault();
    const txt = $('#aiText').value.trim(); if(!txt) return;
    $('#aiText').value='';
    aiMsg('user', txt);
    const thinking = aiMsg('bot','…');
    thinking.textContent = await AI.ask(txt, CURRENT);
    $('#aiLog').scrollTop = 1e9;
  };
  aiMsg('bot','Hi. Ask me anything about the chapter you are on. I work with no setup at all — add your own Anthropic API key in ⚙️ for full conversational tutoring.');
  setChips();

  window.addEventListener('hashchange', route);
  route();
}
boot();
