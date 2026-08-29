/* App shell: routing, rendering, progress, sim mounting. */
const $ = s => document.querySelector(s);
const el = (t,c,h)=>{ const e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e; };
const store = {
  get(){ try{ return JSON.parse(localStorage.getItem('pl_progress')||'{}'); }catch(e){ return {}; } },
  set(v){ localStorage.setItem('pl_progress', JSON.stringify(v)); }
};
let CURRENT = null;      // current chapter object
let simLoop = null;      // active animation frame id

/* ---------- progress ---------- */
function markRead(id){ const p=store.get(); p[id]=p[id]||{}; p[id].read=true; store.set(p); renderNav(); updateGlobal(); }
function saveQuiz(id, correct, total){ const p=store.get(); p[id]=p[id]||{}; p[id].quiz={correct,total,at:Date.now()}; store.set(p); renderNav(); updateGlobal(); }
function chapterDone(id){ const r=store.get()[id]; return !!(r && r.read && r.quiz && r.quiz.correct/r.quiz.total>=0.6); }
function updateGlobal(){
  const done = ALL_CHAPTERS.filter(c=>chapterDone(c.id)).length;
  $('#globalProgress').textContent = Math.round(done/ALL_CHAPTERS.length*100)+'%';
}

/* ---------- navigation ---------- */
function renderNav(filter=''){
  const tree = $('#navTree'); tree.innerHTML='';
  const f = filter.trim().toLowerCase();
  SUBJECTS.forEach(sub => sub.units.forEach(u => {
    const matches = u.chapters.filter(c => !f ||
      (c.title+' '+c.summary+' '+(c.terms||[]).join(' ')+' '+(c.formulas||[]).map(x=>x.f).join(' ')).toLowerCase().includes(f));
    if(!matches.length) return;
    const box = el('div','nav-unit'+(f||(CURRENT && CURRENT._unit.id===u.id)?' open':''));
    const btn = el('button',null,`<span>${u.icon}</span><span>${u.title}</span>`);
    btn.onclick = ()=> box.classList.toggle('open');
    box.appendChild(btn);
    const kids = el('div','kids');
    matches.forEach(c=>{
      const a = el('a','nav-ch'+(CURRENT&&CURRENT.id===c.id?' active':'')+(chapterDone(c.id)?' done':''),
        `<span class="dot"></span><span>${c.title}</span>`);
      a.href = '#/c/'+c.id;
      kids.appendChild(a);
    });
    box.appendChild(kids);
    tree.appendChild(box);
  }));
}

/* ---------- simulation mounting ---------- */
function mountSim(container, simId){
  const sim = SIMS[simId]; if(!sim) return;
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
  const play = el('button','btn small','⏸ Pause');
  play.onclick = ()=>{ playing=!playing; play.textContent = playing?'⏸ Pause':'▶ Play'; };
  const reset = el('button','btn small ghost','↺ Reset');
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
    const dt = Math.min(0.05,(now-last)/1000); last=now;
    if(playing && sim.step) sim.step(state, dt, params);
    sim.draw(ctx, state, params, 800, 450);
    const rows = sim.read ? sim.read(state, params) : null;
    if(rows) ro.innerHTML = rows.map(r=>`<div><span>${r[0]}</span> = ${r[1]}</div>`).join('');
    else ro.style.display='none';
    simLoop = requestAnimationFrame(frame);
  }
  cancelAnimationFrame(simLoop);
  simLoop = requestAnimationFrame(frame);
}

/* ---------- quiz ---------- */
function mountQuiz(container, chId){
  const qs = QUIZ[chId]; if(!qs) return;
  let correct = 0, answered = 0;
  const head = el('div','row');
  head.innerHTML = `<span class="tag">${qs.length} questions</span><span class="tag" id="qScore">0 / ${qs.length}</span>`;
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
        if(j===q.a) correct++; else b.classList.add('wrong');
        box.appendChild(el('div','explain', q.e));
        $('#qScore').textContent = `${correct} / ${qs.length}`;
        if(answered===qs.length){
          saveQuiz(chId, correct, qs.length);
          const msg = correct/qs.length>=0.6 ? '✅ Chapter passed — it now shows green in the sidebar.'
                                             : '↺ Below 60%. Re-read the sections above and try again.';
          container.appendChild(el('div','callout', `<div class="lbl">Result</div>${correct} out of ${qs.length}. ${msg}`));
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
  v.innerHTML = `
    <div class="crumb">Interactive course</div>
    <h1>Learn physics from the very beginning</h1>
    <p class="lede">${PHYSICS.tagline} Every chapter has explanations written for someone starting from zero, a worked example, real-world uses, a live simulation you can play with, and a quiz that unlocks your progress.</p>
    <div class="row" style="margin:1rem 0">
      <a class="btn" href="#/c/${ALL_CHAPTERS[0].id}">Start chapter 1</a>
      <a class="btn ghost" href="#/lab">Open the simulation lab</a>
      <a class="btn ghost" href="#/games">Play a game</a>
    </div>
    <div class="card"><div class="row" style="justify-content:space-between"><b>Your progress</b><span>${done} / ${ALL_CHAPTERS.length} chapters</span></div>
      <div class="bar" style="margin-top:.5rem"><i style="width:${done/ALL_CHAPTERS.length*100}%"></i></div></div>
    <h2>The course</h2>
    <div class="grid cols-3">
      ${PHYSICS.units.map(u=>`<a class="card" href="#/c/${u.chapters[0].id}" style="color:inherit">
        <div style="font-size:1.6rem">${u.icon}</div><b>${u.title}</b>
        <p class="lede" style="font-size:.88rem">${u.blurb}</p>
        <span class="tag">${u.chapters.length} chapters</span></a>`).join('')}
    </div>
    <h2>How to use this</h2>
    <div class="grid cols-2">
      <div class="card"><b>1 · Read, then play</b><p>Read the sections, then use the simulation at the bottom of the chapter. Change one slider at a time and predict what will happen before you move it — that prediction step is where the learning actually happens.</p></div>
      <div class="card"><b>2 · Take the quiz</b><p>Score 60% or more and the chapter turns green. Explanations appear after every answer, right or wrong.</p></div>
      <div class="card"><b>3 · Ask the tutor</b><p>The 🧠 button opens an AI tutor that knows which chapter you are on. It works without any setup in offline coach mode, and becomes a full conversational tutor if you add your own Anthropic API key.</p></div>
      <div class="card"><b>4 · Keep going</b><p>Nothing is locked. Jump to relativity on day one if you like — but Units 1–4 are the foundation everything else leans on.</p></div>
    </div>`;
}

function viewChapter(id){
  const ch = ALL_CHAPTERS.find(c=>c.id===id); if(!ch) return viewHome();
  CURRENT = ch;
  const idx = ALL_CHAPTERS.indexOf(ch);
  const prev = ALL_CHAPTERS[idx-1], next = ALL_CHAPTERS[idx+1];
  const levelTag = {foundation:'Beginner foundation', y11:'Year 11', y12:'Year 12'}[ch.level]||ch.level;
  const v = $('#view');
  v.innerHTML = `
    <div class="crumb">${ch._unit.icon} ${ch._unit.title}</div>
    <h1>${ch.title}</h1>
    <div class="row"><span class="tag">${levelTag}</span>${ch.sim?'<span class="tag">interactive sim</span>':''}<span class="tag">${(QUIZ[ch.id]||[]).length} quiz questions</span></div>
    <p class="lede">${ch.summary}</p>
    ${ch.sections.map(s=>`<h2>${s.h}</h2><div>${s.body}</div>`).join('')}
    <h2>Formulas to know</h2>
    ${ch.formulas.map(f=>`<div class="formula"><b>${f.f}</b>   —   ${f.d}</div>`).join('')}
    <h2>Worked example — ${ch.example.title}</h2>
    <div class="card"><p><b>Problem.</b> ${ch.example.problem}</p>
      <ol>${ch.example.steps.map(s=>`<li>${s}</li>`).join('')}</ol></div>
    <h2>Where this shows up in the real world</h2>
    <ul class="clean">${ch.realWorld.map(r=>`<li>${r}</li>`).join('')}</ul>
    ${ch.sim?`<h2>Try it — ${SIMS[ch.sim]?SIMS[ch.sim].title:''}</h2>
      <p class="lede">${SIMS[ch.sim]?SIMS[ch.sim].desc:''}</p><div id="simHost"></div>`:''}
    <h2>Watch</h2>
    <div class="vidlist">${ch.videos.map(vd=>
      `<a target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(vd.q)}">▶ ${vd.t}<span class="spacer"></span><span class="tag">YouTube</span></a>`).join('')}</div>
    <h2>Check yourself</h2>
    <div id="quizHost"></div>
    <div class="row" style="margin-top:1rem">
      <button class="btn ghost" id="markBtn">✓ Mark this chapter as read</button>
      <button class="btn ghost" id="askBtn">🧠 Ask the tutor about this chapter</button>
    </div>
    <div class="footer-nav">
      <div>${prev?`<a href="#/c/${prev.id}">← ${prev.title}</a>`:''}</div>
      <div>${next?`<a href="#/c/${next.id}">${next.title} →</a>`:''}</div>
    </div>`;
  if(ch.sim) mountSim($('#simHost'), ch.sim);
  mountQuiz($('#quizHost'), ch.id);
  $('#markBtn').onclick = ()=>{ markRead(ch.id); $('#markBtn').textContent='✓ Marked as read'; };
  $('#askBtn').onclick = ()=>{ openAI(); $('#aiText').focus(); };
  markRead(ch.id);
  renderNav($('#searchBox').value);
  setChips();
}

function viewLab(){
  CURRENT = null;
  const v = $('#view');
  v.innerHTML = `<div class="crumb">Simulation lab</div><h1>Every simulation in one place</h1>
    <p class="lede">${Object.keys(SIMS).length} live simulations. Each one recalculates real physics every frame — nothing is pre-recorded.</p>
    <div class="grid cols-3">${Object.entries(SIMS).map(([k,s])=>
      `<a class="card" href="#/sim/${k}" style="color:inherit"><b>${s.title}</b><p class="lede" style="font-size:.88rem">${s.desc}</p></a>`).join('')}</div>`;
}
function viewSim(id){
  const s = SIMS[id]; if(!s) return viewLab();
  const owner = ALL_CHAPTERS.find(c=>c.sim===id);
  CURRENT = owner || null;
  $('#view').innerHTML = `<div class="crumb"><a href="#/lab">Simulation lab</a></div><h1>${s.title}</h1>
    <p class="lede">${s.desc}</p><div id="simHost"></div>
    ${owner?`<p style="margin-top:1rem">Read the theory: <a href="#/c/${owner.id}">${owner.title}</a></p>`:''}`;
  mountSim($('#simHost'), id);
}

function viewGames(){
  CURRENT = null;
  $('#view').innerHTML = `<div class="crumb">Games</div><h1>Practise by playing</h1>
    <p class="lede">Three games that drill the skills exams actually test: predicting projectile range, recalling formulas at speed, and reading motion graphs.</p>
    <div class="grid cols-3">${GAMES.map(g=>`<a class="card" href="#/game/${g.id}" style="color:inherit"><b>${g.title}</b><p class="lede" style="font-size:.88rem">${g.blurb}</p></a>`).join('')}</div>`;
}
function viewGame(id){
  const g = GAMES.find(x=>x.id===id); if(!g) return viewGames();
  $('#view').innerHTML = `<div class="crumb"><a href="#/games">Games</a></div><h1>${g.title}</h1><p class="lede">${g.blurb}</p><div id="gameHost"></div>`;
  g.mount($('#gameHost'));
}

function viewFormulas(){
  CURRENT = null;
  let html = `<div class="crumb">Reference</div><h1>Formula sheet</h1><p class="lede">Every equation in the course, grouped by unit. Use your browser's find (⌘F / Ctrl+F).</p>`;
  PHYSICS.units.forEach(u=>{
    html += `<h2>${u.icon} ${u.title}</h2>`;
    u.chapters.forEach(c=>{
      html += `<h3><a href="#/c/${c.id}">${c.title}</a></h3>`;
      html += c.formulas.map(f=>`<div class="formula"><b>${f.f}</b>   —   ${f.d}</div>`).join('');
    });
  });
  $('#view').innerHTML = html;
}

function viewProgress(){
  CURRENT = null;
  const p = store.get();
  const rows = ALL_CHAPTERS.map(c=>{
    const r = p[c.id]||{};
    const q = r.quiz ? `${r.quiz.correct}/${r.quiz.total}` : '—';
    return `<tr><td><a href="#/c/${c.id}">${c.title}</a></td><td>${c._unit.title}</td>
      <td>${r.read?'✓':'–'}</td><td>${q}</td><td>${chapterDone(c.id)?'<b style="color:var(--good)">done</b>':''}</td></tr>`;
  }).join('');
  const done = ALL_CHAPTERS.filter(c=>chapterDone(c.id)).length;
  $('#view').innerHTML = `<div class="crumb">Progress</div><h1>My progress</h1>
    <div class="card"><div class="row" style="justify-content:space-between"><b>${done} of ${ALL_CHAPTERS.length} chapters complete</b>
      <button class="btn ghost small" id="resetProg">Reset all progress</button></div>
      <div class="bar" style="margin-top:.6rem"><i style="width:${done/ALL_CHAPTERS.length*100}%"></i></div></div>
    <table class="data"><tr><th>Chapter</th><th>Unit</th><th>Read</th><th>Quiz</th><th>Status</th></tr>${rows}</table>`;
  $('#resetProg').onclick = ()=>{ if(confirm('Erase all progress on this device?')){ localStorage.removeItem('pl_progress'); route(); updateGlobal(); } };
}

/* ---------- router ---------- */
function route(){
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
  else { CURRENT=null; viewHome(); }
  renderNav($('#searchBox').value);
  window.scrollTo(0,0);
  $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('on');
}

/* ---------- AI panel ---------- */
function openAI(){ $('#aiPanel').classList.add('open'); }
function setChips(){
  const chips = $('#aiChips'); chips.innerHTML='';
  const suggestions = CURRENT
    ? ['Explain this chapter simply', 'Give me a harder practice problem', 'What mistakes do students make here?', 'How is this used in real life?']
    : ['Where should I start?', 'Explain what a vector is', 'Give me a study plan for Year 11'];
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
  const saved = localStorage.getItem('pl_theme');
  if(saved) document.body.dataset.theme = saved;
  $('#themeBtn').onclick = ()=>{
    const now = document.body.dataset.theme==='dark' ? 'light':'dark';
    document.body.dataset.theme = now; localStorage.setItem('pl_theme', now);
  };
  $('#menuBtn').onclick = ()=>{ $('#sidebar').classList.toggle('open'); $('#scrim').classList.toggle('on'); };
  $('#scrim').onclick = ()=>{ $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('on'); };
  $('#searchBox').oninput = e => renderNav(e.target.value);

  $('#aiBtn').onclick = openAI;
  $('#aiCloseBtn').onclick = ()=> $('#aiPanel').classList.remove('open');
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
    const t = $('#aiText').value.trim(); if(!t) return;
    $('#aiText').value='';
    aiMsg('user', t);
    const thinking = aiMsg('bot','…');
    const reply = await AI.ask(t, CURRENT);
    thinking.textContent = reply;
    $('#aiLog').scrollTop = 1e9;
  };
  aiMsg('bot', 'Hi. Ask me anything about the chapter you are on. I work with no setup at all — add your own Anthropic API key in ⚙️ for full conversational tutoring.');
  setChips();

  window.addEventListener('hashchange', route);
  route(); updateGlobal();
}
boot();
