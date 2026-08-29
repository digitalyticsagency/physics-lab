/* AI tutor. Two modes:
   - Live mode: your own Anthropic API key, kept in localStorage on this device only.
   - Offline coach: no key needed; answers are built from the current chapter's own content. */
const AI = {
  key(){ return localStorage.getItem('pl_key')||''; },
  model(){ return localStorage.getItem('pl_model')||'claude-sonnet-5'; },
  history: [],

  systemPrompt(ch){
    let ctx = 'The learner is studying an interactive physics course covering beginner foundations through Year 11 and Year 12.';
    if(ch){
      ctx += `\n\nCurrent chapter: "${ch.title}" (${ch._unit.title}).\nSummary: ${ch.summary}\n`;
      if(ch.simple){
        ctx += 'Plain-English version the learner has already read:\n' + ch.simple.what.join(' ') +
               `\nAnalogy used: ${ch.simple.analogy}\nMemory hook given: ${ch.simple.remember}\n`;
      }
      ctx += 'Key formulas in this chapter:\n' + (ch.formulas||[]).map(f=>`- ${f.f} — ${f.d}`).join('\n');
      ctx += '\nKey terms: ' + (ch.terms||[]).join(', ');
    }
    return `You are a patient physics tutor. ${ctx}

The learner is a complete beginner. Rules:
- Use simple, short words and short sentences. Avoid jargon; when you must use a technical word, define it in the same sentence.
- Explain from first principles, building on the analogy above rather than inventing a competing one.
- Offer a memory hook (a phrase, image or rule of thumb) when it fits.
- Use a concrete real-world example in almost every answer.
- Show working line by line with units, and state the equation before substituting.
- If the learner asks you to just give an answer to a problem, give a hint first, then the full solution.
- Keep answers under 250 words unless asked to go deeper. Plain text, no markdown headers.`;
  },

  async ask(text, chapter, onChunk){
    const key = this.key();
    if(!key) return this.offline(text, chapter);
    this.history.push({role:'user', content:text});
    try{
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'content-type':'application/json','x-api-key':key,
                 'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
        body: JSON.stringify({ model:this.model(), max_tokens:1024,
          system:this.systemPrompt(chapter), messages:this.history.slice(-10) })
      });
      if(!res.ok){
        const err = await res.text();
        return `The API returned ${res.status}. ${res.status===401?'That usually means the key is wrong or expired.':''}\n\nFalling back to offline coach:\n\n` + this.offline(text, chapter);
      }
      const data = await res.json();
      const out = (data.content||[]).map(c=>c.text||'').join('');
      this.history.push({role:'assistant', content:out});
      return out;
    }catch(e){
      return 'Could not reach the API from the browser (' + e.message + ').\n\nOffline coach instead:\n\n' + this.offline(text, chapter);
    }
  },

  /* Offline coach: ranked retrieval over sections, formulas and chapter summaries. */
  offline(text, ch){
    const q = text.toLowerCase().trim();
    const stop = new Set(['what','whats','the','and','for','with','how','does','this','that','explain','tell','about','give','from','into','are','was','can','you','physics','formula','equation','equations','why','when','which']);
    const words = q.split(/[^a-z0-9]+/).filter(w=>w.length>2 && !stop.has(w));
    if(!words.length) return this.fallbackHelp();

    const strip = h => h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    const score = (hay, weight=1) => {
      const t = hay.toLowerCase();
      let n = 0;
      if(q.length>6 && t.includes(q)) n += 8;
      // adjacent word pairs are much stronger evidence than single words
      for(let i=0;i<words.length-1;i++) if(t.includes(words[i]+' '+words[i+1])) n += 4;
      words.forEach(w=>{ if(t.includes(w)) n += 1; });
      return n*weight;
    };

    const cands = [];
    const wantsSimple = /simpl|easy|easier|beginner|basic|child|12 year|explain it|what is|mean/.test(q);
    if(ch && ch.simple && wantsSimple){
      const S = ch.simple;
      return `${ch.title} — in plain words\n\n${S.what.join('\n')}\n\nThink of it like this: ${S.analogy}\n\nTrick to remember: ${S.remember}\n\nTry it yourself: ${S.tryThis}`;
    }
    ALL_CHAPTERS.forEach(c=>{
      const bonus = (ch && c.id===ch.id) ? 1.6 : 1;
      (c.sections||[]).forEach(sec=>{
        const s = score(sec.h+' '+strip(sec.body), bonus) + score(sec.h, bonus*2);
        if(s>0) cands.push({s, kind:'section', c, sec});
      });
      (c.formulas||[]).forEach(f=>{
        const s = score(f.f+' '+f.d, bonus*1.3);
        if(s>0) cands.push({s, kind:'formula', c, f});
      });
      const s = score(c.title+' '+c.summary+' '+(c.terms||[]).join(' '), bonus*1.2);
      if(s>0) cands.push({s, kind:'chapter', c});
    });

    if(!cands.length) return this.fallbackHelp();
    cands.sort((a,b)=>b.s-a.s);
    const top = cands[0];

    let out = '';
    if(top.kind==='section'){
      out += `${top.c.title} → ${top.sec.h}\n\n${strip(top.sec.body)}`;
    } else if(top.kind==='formula'){
      out += `${top.f.f}\n   ${top.f.d}\n(from ${top.c.title})`;
    } else {
      out += `${top.c.title}\n${top.c.summary}`;
    }

    const formulas = cands.filter(x=>x.kind==='formula').slice(0,4);
    if(formulas.length) out += '\n\nRelated equations:\n' + formulas.map(x=>`• ${x.f.f} — ${x.f.d}`).join('\n');

    const ex = top.c.example;
    if(ex) out += `\n\nWorked example — ${ex.title}\n${ex.problem}\n` + ex.steps.map((s,i)=>`${i+1}. ${s}`).join('\n');

    const others = cands.filter(x=>x.c.id!==top.c.id).map(x=>x.c).filter((c,i,a)=>a.indexOf(c)===i).slice(0,3);
    if(others.length) out += '\n\nAlso covered in: ' + others.map(c=>c.title).join(' · ');
    return out;
  },

  fallbackHelp(){
    return 'Offline coach mode: I answer from this course\'s own material, so ask about a topic it covers — for example "explain terminal velocity", "why does a banked curve work", or "centripetal force formula". Add your own Anthropic API key in the settings for full conversational tutoring.';
  }
};
