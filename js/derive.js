/* Derivation graph: layered DAG render + "rebuild the child from the parent" cards. */

function deriveDepth(id, seen){
  seen = seen || new Set();
  if(seen.has(id)) return 0;
  seen.add(id);
  const n = DERIVE[id];
  if(!n || !n.from.length) return 0;
  return 1 + Math.max(...n.from.map(p=>deriveDepth(p, seen)));
}

function deriveLayers(){
  const layers = [];
  Object.keys(DERIVE).forEach(id=>{
    const d = deriveDepth(id);
    (layers[d] = layers[d] || []).push(id);
  });
  // barycentre ordering: pull each node next to the average position of its parents,
  // which removes most of the edge crossings
  for(let pass=0; pass<4; pass++){
    for(let d=1; d<layers.length; d++){
      const prevIndex = {};
      layers[d-1].forEach((id,i)=> prevIndex[id] = i);
      layers[d].sort((a,b)=>{
        const bary = id => {
          const ps = DERIVE[id].from.map(p=>prevIndex[p]).filter(x=>x!==undefined);
          return ps.length ? ps.reduce((x,y)=>x+y,0)/ps.length : 99;
        };
        return bary(a) - bary(b);
      });
    }
  }
  return layers;
}

function nodeLabel(id){
  const n = DERIVE[id];
  return isBn() && n.bn ? n.bn : n.name;
}
function nodeF(id){
  const n = DERIVE[id];
  return isBn() && n.f_bn ? n.f_bn : n.f;
}
function nodeHow(id){
  const n = DERIVE[id];
  return isBn() && n.how_bn ? n.how_bn : n.how;
}

function renderDeriveGraph(host, focusId){
  const layers = deriveLayers();
  const colW = 240, rowH = 54, pad = 24;
  const width = layers.length*colW + pad*2;
  const height = Math.max(...layers.map(l=>l.length))*rowH + pad*2;
  const pos = {};
  layers.forEach((ids,d)=> ids.forEach((id,i)=>{
    const spread = (Math.max(...layers.map(l=>l.length)) - ids.length) * rowH / 2;
    pos[id] = {x: pad + d*colW, y: pad + spread + i*rowH};
  }));

  const edges = [];
  Object.entries(DERIVE).forEach(([id,n])=> n.from.forEach(p=>{
    if(pos[p] && pos[id]) edges.push({p, id});
  }));

  const isLit = id => !focusId || id===focusId || DERIVE[focusId].from.includes(id) ||
                      DERIVE[id].from.includes(focusId);

  const svg = `<svg viewBox="0 0 ${width} ${height}" class="dag" xmlns="http://www.w3.org/2000/svg">
    ${edges.map(e=>{
      const a = pos[e.p], b = pos[e.id];
      const lit = focusId ? (e.id===focusId || e.p===focusId) : true;
      return `<path d="M${a.x+150},${a.y+14} C${a.x+200},${a.y+14} ${b.x-50},${b.y+14} ${b.x},${b.y+14}"
        fill="none" stroke="${lit?'var(--accent)':'var(--line)'}" stroke-width="${lit?2.2:1}" opacity="${lit?0.95:0.22}"/>`;
    }).join('')}
    ${Object.keys(pos).map(id=>{
      const p = pos[id], n = DERIVE[id], root = !n.from.length, lit = isLit(id);
      return `<g class="dnode${id===focusId?' focus':''}" data-id="${id}" opacity="${lit?1:0.35}">
        <rect x="${p.x}" y="${p.y}" width="150" height="28" rx="8"
          fill="${root?'var(--accent)':'var(--panel)'}" stroke="${id===focusId?'var(--warn)':'var(--line)'}" stroke-width="${id===focusId?2.5:1}"/>
        <text x="${p.x+8}" y="${p.y+13}" font-size="10" fill="${root?'#fff':'var(--muted)'}">${nodeLabel(id).slice(0,26)}</text>
        <text x="${p.x+8}" y="${p.y+24}" font-size="11" font-family="ui-monospace,monospace" fill="${root?'#fff':'var(--ink)'}">${nodeF(id).slice(0,24)}</text>
      </g>`;
    }).join('')}
  </svg>`;

  host.innerHTML = `<div class="dag-wrap">${svg}</div><div id="dagInfo"></div>`;

  host.querySelectorAll('.dnode').forEach(g=>{
    g.style.cursor = 'pointer';
    g.onclick = ()=>{
      const id = g.dataset.id;
      renderDeriveGraph(host, id);
      const n = DERIVE[id], ch = ALL_CHAPTERS.find(c=>c.id===n.ch);
      const parents = n.from.map(p=>`<b>${nodeLabel(p)}</b> (${nodeF(p)})`).join(isBn()?' এবং ':' and ');
      const kids = Object.entries(DERIVE).filter(([,x])=>x.from.includes(id)).map(([k])=>nodeLabel(k));
      host.querySelector('#dagInfo').innerHTML = `<div class="card">
        <div class="crumb">${ch?tr(ch,'title'):''}</div>
        <h3>${nodeLabel(id)}</h3>
        <div class="formula"><b>${nodeF(id)}</b></div>
        <p>${n.from.length ? `${isBn()?'যেখান থেকে আসে':'Comes from'}: ${parents}` : (isBn()?'এটি একটি মূল নীতি।':'This is a root principle.')}</p>
        <div class="callout"><div class="lbl">${isBn()?'যেভাবে পাওয়া যায়':'The move'}</div>${nodeHow(id)}</div>
        ${kids.length?`<p class="hint">${isBn()?'এখান থেকে যা আসে':'Leads to'}: ${kids.join(' · ')}</p>`:''}
        ${ch?`<a class="btn ghost small" href="#/c/${ch.id}">${isBn()?'অধ্যায়ে যান':'Open the chapter'}</a>`:''}
      </div>`;
    };
  });
}

/* Cards: given the parent, rebuild the child. Only for chapters already studied. */
function deriveCards(){
  const prog = store.get();
  return Object.entries(DERIVE)
    .filter(([,n])=> n.from.length && prog[n.ch] && prog[n.ch].read)
    .map(([id,n])=>({
      id: 'd:'+id,
      type: 'derive',
      ch: ALL_CHAPTERS.find(c=>c.id===n.ch) || ALL_CHAPTERS[0],
      front: (isBn()
        ? `${n.from.map(p=>nodeF(p)).join(' এবং ')} থেকে ${nodeLabel(id)} কীভাবে পাওয়া যায়?`
        : `Starting from ${n.from.map(p=>DERIVE[p].f).join(' and ')}, how do you get ${nodeLabel(id)}?`),
      back: nodeF(id),
      why: nodeHow(id)
    }));
}
