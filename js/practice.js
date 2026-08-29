/* Practice engine: randomised numeric drills with unit-aware grading,
   plus the four-level difficulty ladder. Templates live in data/practice-bank.js. */

const RNG = {
  pick(min,max,step){ const n = Math.round((max-min)/step); return +(min + step*Math.floor(Math.random()*(n+1))).toFixed(4); },
  from(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
};

/* Draw one concrete question from a template. */
function drawItem(tpl, chId){
  const v = {};
  Object.entries(tpl.vars||{}).forEach(([k,spec])=>{
    v[k] = Array.isArray(spec[0]) || typeof spec[0] === 'string' ? RNG.from(spec) : RNG.pick(spec[0],spec[1],spec[2]);
  });
  const fill = s => s.replace(/\{(\w+)\}/g, (_,k)=> v[k]);
  const ans = tpl.ans(v);
  return {
    tplId: `${chId}:${tpl.id}`,
    level: tpl.level,
    text: fill(isBn() && tpl.bn ? tpl.bn : tpl.text),
    unit: tpl.unit || '',
    answer: ans,
    tol: tpl.tol || 0.02,
    working: (tpl.working ? tpl.working(v, ans) : []),
    hint: isBn() && tpl.hint_bn ? tpl.hint_bn : (tpl.hint||'')
  };
}

/* Accepts "12.5", "12.5 m/s", "1.25e1", "১২.৫" (Bangla digits). */
function parseNumeric(raw){
  if(!raw) return null;
  const bn = '০১২৩৪৫৬৭৮৯';
  let s = String(raw).trim().replace(/[০-৯]/g, d => bn.indexOf(d));
  s = s.replace(/[×xX]\s*10\s*\^?\s*/,'e').replace(/\s+/g,' ');
  const m = s.match(/^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/);
  if(!m) return null;
  return {value: parseFloat(m[0]), unit: s.slice(m[0].length).trim()};
}

function unitOk(given, expected){
  if(!expected) return true;
  if(!given) return null;                       // no unit typed → warn, not wrong
  const norm = u => u.toLowerCase().replace(/\s|\.|·/g,'')
    .replace(/metres?|meters?/,'m').replace(/seconds?|sec/,'s').replace(/kilograms?/,'kg')
    .replace(/newtons?/,'n').replace(/joules?/,'j').replace(/watts?/,'w')
    .replace(/\^2/,'²').replace(/\^3/,'³').replace(/per/,'/');
  return norm(given) === norm(expected);
}

/* Mastery per chapter-level, stored in pl_levels. */
const LADDER = {
  load(){ try{ return JSON.parse(localStorage.getItem('pl_levels')||'{}'); }catch(e){ return {}; } },
  save(d){ localStorage.setItem('pl_levels', JSON.stringify(d)); },
  key(ch,lvl){ return ch+':'+lvl; },
  get(ch,lvl){ return this.load()[this.key(ch,lvl)] || {right:0, wrong:0, streak:0}; },
  record(ch,lvl,ok){
    const d = this.load(), k = this.key(ch,lvl);
    const s = d[k] || {right:0, wrong:0, streak:0};
    if(ok){ s.right++; s.streak++; } else { s.wrong++; s.streak = 0; }
    d[k] = s; this.save(d);
    STREAK.touch();
    return s;
  },
  /* A level is cleared at 4 correct in a row; the next one then unlocks. */
  cleared(ch,lvl){ return this.get(ch,lvl).streak >= 4 || this.get(ch,lvl).right >= 8; },
  unlocked(ch,lvl){ return lvl <= 1 ? true : this.cleared(ch, lvl-1); },
  highest(ch){ let l=1; while(l<4 && this.cleared(ch,l)) l++; return l; }
};

/* ---------- practice view ---------- */
function renderPractice(ch, host){
  const bn = isBn();
  let level = LADDER.highest(ch.id);
  let current = null;

  const wrap = el('div');
  host.appendChild(wrap);

  const levelNames = bn
    ? ['ধারণা', 'এক ধাপের অঙ্ক', 'দুই ধাপের অঙ্ক', 'পরীক্ষার ধাঁচ']
    : ['Concept', 'One-step numeric', 'Two-step numeric', 'Exam-style'];

  function bar(){
    return `<div class="row ladder">${[1,2,3,4].map(l=>{
      const st = LADDER.get(ch.id,l), open = LADDER.unlocked(ch.id,l), done = LADDER.cleared(ch.id,l);
      return `<button class="lvl${l===level?' on':''}${done?' done':''}" data-lvl="${l}" ${open?'':'disabled'}>
        ${done?'✓':(open?'':'🔒')} ${bn?'ধাপ':'Level'} ${l}<small>${levelNames[l-1]}</small>
        <i>${st.streak}/4</i></button>`;}).join('')}</div>`;
  }

  function draw(){
    if(level === 1){
      const qs = quizFor(ch.id);
      const q = qs[Math.floor(Math.random()*qs.length)];
      current = {kind:'mcq', q};
    } else {
      const pool = (PRACTICE[ch.id]||[]).filter(t=>t.level===level);
      if(!pool.length){ current = null; return; }
      current = {kind:'num', item: drawItem(RNG.from(pool), ch.id)};
    }
  }

  function render(){
    wrap.innerHTML = bar();
    const box = el('div','card practice-card');

    if(!current){
      box.innerHTML = `<p>${bn?'এই ধাপের জন্য এখনো প্রশ্ন যোগ করা হয়নি।':'No items at this level yet for this chapter.'}</p>`;
      wrap.appendChild(box);
      wireBar(); return;
    }

    if(current.kind === 'mcq'){
      const q = current.q;
      box.appendChild(el('div','qtext', q.q));
      const opts = el('div','opts');
      q.o.forEach((o,j)=>{
        const b = el('button','opt',o);
        b.onclick = ()=>{
          if(box.dataset.done) return; box.dataset.done='1';
          const ok = j===q.a;
          opts.querySelectorAll('.opt')[q.a].classList.add('correct');
          if(!ok) b.classList.add('wrong');
          LADDER.record(ch.id, 1, ok); TWIN.observe(ch.id, ok);
          if(!ok) MISTAKES.add({ch:ch.id, kind:'mcq', q:q.q, your:q.o[j], right:q.o[q.a], why:q.e, level:1});
          box.appendChild(el('div','explain', q.e));
          box.appendChild(nextBtn());
        };
        opts.appendChild(b);
      });
      box.appendChild(opts);
    } else {
      const it = current.item;
      box.appendChild(el('div','qtext', it.text));
      if(it.hint) box.appendChild(el('p','hint', it.hint));
      const row = el('div','row');
      const inp = el('input'); inp.className='num-input'; inp.placeholder = bn?`উত্তর${it.unit?' ('+it.unit+')':''}`:`answer${it.unit?' in '+it.unit:''}`;
      inp.autocomplete='off';
      const go = el('button','btn', bn?'যাচাই':'Check');
      row.appendChild(inp); row.appendChild(go);
      box.appendChild(row);
      const fb = el('div'); box.appendChild(fb);

      const submit = ()=>{
        if(box.dataset.done) return;
        const p = parseNumeric(inp.value);
        if(!p){ fb.innerHTML = `<p class="hint">${bn?'একটি সংখ্যা লিখুন।':'Type a number.'}</p>`; return; }
        const rel = Math.abs(p.value - it.answer) / (Math.abs(it.answer) || 1);
        const numOk = rel <= it.tol;
        const uOk = unitOk(p.unit, it.unit);
        box.dataset.done='1';
        LADDER.record(ch.id, level, numOk);
        const lines = [];
        if(numOk){
          lines.push(`<div class="callout"><div class="lbl">${bn?'সঠিক':'Correct'}</div>${bn?'উত্তর':'Answer'} = ${it.answer.toPrecision(3)} ${it.unit}` +
            (uOk===null && it.unit ? ` <span class="hint">— ${bn?'পরের বার এককও লিখুন':'next time write the unit too'}</span>`:'') +
            (uOk===false ? ` <span class="hint">— ${bn?'সংখ্যা ঠিক, একক ভুল':'number right, unit wrong'}</span>`:'') + `</div>`);
        } else {
          lines.push(`<div class="callout warn"><div class="lbl">${bn?'হলো না':'Not right'}</div>${bn?'তোমার উত্তর':'You wrote'} ${p.value} ${p.unit||''} · ${bn?'সঠিক':'correct'} ${it.answer.toPrecision(3)} ${it.unit}</div>`);
          MISTAKES.add({ch:ch.id, kind:'num', q:it.text, your:`${p.value} ${p.unit||''}`.trim(),
                        right:`${it.answer.toPrecision(3)} ${it.unit}`, why:it.working.join(' → '), level});
        }
        if(it.working.length) lines.push(`<div class="working">${it.working.map(w=>`<div>${w}</div>`).join('')}</div>`);
        fb.innerHTML = lines.join('');
        box.appendChild(nextBtn());
        TWIN.observe(ch.id, numOk);
      };
      go.onclick = submit;
      inp.onkeydown = e => { if(e.key==='Enter') submit(); };
      setTimeout(()=>inp.focus(), 30);
    }

    wrap.appendChild(box);
    wireBar();
  }

  function nextBtn(){
    const b = el('button','btn ghost', (isBn()?'পরের প্রশ্ন':'Next question') + ' →');
    b.onclick = ()=>{
      if(LADDER.cleared(ch.id, level) && level < 4) level = Math.min(4, level+1);
      draw(); render();
    };
    return b;
  }
  function wireBar(){
    wrap.querySelectorAll('.lvl').forEach(b=>{
      b.onclick = ()=>{ level = +b.dataset.lvl; draw(); render(); };
    });
  }

  draw(); render();
}

/* ---------- photo marking of handwritten working ---------- */
function renderPhotoCheck(host, ch){
  const bn = isBn();
  host.innerHTML = `<b>${t('checkWorking')}</b>
    <p class="hint">${t('uploadWorking')}${AI.key()?'':' — '+t('needKeyForPhoto')}</p>
    <div class="row"><input type="file" accept="image/*" id="wkFile"></div>
    <div id="wkOut"></div>`;
  const out = host.querySelector('#wkOut');
  host.querySelector('#wkFile').onchange = async e => {
    const f = e.target.files[0]; if(!f) return;
    if(f.size > 5e6){ out.innerHTML = `<p class="hint">${bn?'ছবিটি খুব বড় (৫MB-এর কম হতে হবে)।':'Image too large — keep it under 5 MB.'}</p>`; return; }
    const reader = new FileReader();
    reader.onload = async () => {
      out.innerHTML = `<img class="wk-thumb" src="${reader.result}"><p class="hint">${t('checkingWorking')}</p>`;
      const r = await AI.checkWorking(reader.result, f.type||'image/jpeg', ch);
      out.innerHTML = `<img class="wk-thumb" src="${reader.result}">
        <div class="callout${r.ok?'':' warn'}"><div class="lbl">${bn?'ফলাফল':'Marking'}</div>
        <div style="white-space:pre-wrap">${r.text.replace(/</g,'&lt;')}</div></div>`;
    };
    reader.readAsDataURL(f);
  };
}
