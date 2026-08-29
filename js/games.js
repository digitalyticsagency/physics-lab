/* Games. Each: {id,title,blurb,mount(el)} */
const GAMES = [

{ id:'target', title:'🎯 Target Practice', blurb:'Hit the moving target by choosing a launch angle and speed. Wind and a random distance every round — real projectile maths, no guessing your way through.',
  mount(el){
    el.innerHTML = `<div class="card">
      <canvas class="sim" id="tgCanvas" width="800" height="400"></canvas>
      <div class="row" style="margin-top:.7rem">
        <label>${isBn()?'কোণ':'Angle'} <b id="tgA">45</b>°<input type="range" id="tgAng" min="5" max="85" value="45"></label>
        <label>${isBn()?'বেগ':'Speed'} <b id="tgV">40</b> m/s<input type="range" id="tgVel" min="10" max="90" value="40"></label>
        <button class="btn" id="tgFire">${isBn()?'ছুঁড়ুন':'Fire'}</button>
        <button class="btn ghost" id="tgNew">${isBn()?'নতুন লক্ষ্য':'New target'}</button>
        <span class="tag">${isBn()?'স্কোর':'Score'} <b id="tgScore">0</b></span>
        <span class="tag">${isBn()?'রাউন্ড':'Round'} <b id="tgRound">1</b></span>
      </div>
      <p class="hint" id="tgMsg">${isBn()?'সমতল ভূমিতে পাল্লা R = u²sin(2θ)/g। হিসাব করে তারপর ছুঁড়ুন।':'Range on level ground is R = u²sin(2θ)/g. Work it out, then fire.'}</p></div>`;
    const cv=el.querySelector('#tgCanvas'), ctx=cv.getContext('2d');
    let target=200, wind=0, score=0, round=1, shot=null, anim=null;
    const ang=el.querySelector('#tgAng'), vel=el.querySelector('#tgVel');
    function newTarget(){ target=60+Math.random()*500; wind=(Math.random()-0.5)*6; shot=null; draw(); }
    function draw(){
      ctx.clearRect(0,0,800,400);
      ctx.fillStyle=getCSS('--panel-2'); ctx.fillRect(0,0,800,400);
      ctx.fillStyle=getCSS('--line'); ctx.fillRect(0,350,800,50);
      ctx.fillStyle=getCSS('--warn'); ctx.fillRect(60+target-14,336,28,14);
      ctx.fillStyle=getCSS('--muted'); ctx.font='13px ui-monospace,monospace';
      ctx.fillText((isBn()?`লক্ষ্য ${target.toFixed(0)} মি   বাতাস `:`target ${target.toFixed(0)} m   wind `)+`${wind>0?'+':''}${wind.toFixed(1)} m/s`,12,24);
      ctx.fillStyle=getCSS('--accent'); ctx.beginPath(); ctx.arc(60,350,10,0,7); ctx.fill();
      if(shot){ ctx.strokeStyle=getCSS('--accent'); ctx.lineWidth=2; ctx.beginPath();
        shot.forEach((p,i)=> i?ctx.lineTo(60+p[0],350-p[1]):ctx.moveTo(60+p[0],350-p[1])); ctx.stroke(); }
    }
    function fire(){
      const th=+ang.value*Math.PI/180, u=+vel.value, g=9.81;
      let x=0,y=0,vx=u*Math.cos(th),vy=u*Math.sin(th),t=0; shot=[[0,0]];
      while(y>=0 && t<30){ vx+=wind*0.02; vy-=g*0.02; x+=vx*0.02; y+=vy*0.02; t+=0.02; shot.push([x,y]); }
      const err=Math.abs(x-target);
      const msg=el.querySelector('#tgMsg');
      const pts=Math.max(10,60-Math.round(err*3));
      if(err<12){ score+=pts;
        msg.textContent = isBn()? `লেগেছে! পার্থক্য ${err.toFixed(1)} মিটার। +${pts} পয়েন্ট।`
                                : `HIT! Off by ${err.toFixed(1)} m. +${pts} points.`;
        round++; setTimeout(newTarget,900); }
      else msg.textContent = isBn()
        ? `পড়ল ${x.toFixed(0)} মিটারে — ${x<target?'কম':'বেশি'} হয়েছে ${err.toFixed(0)} মিটার। হিসাবি পাল্লা u²sin2θ/g = ${(u*u*Math.sin(2*th)/9.81).toFixed(0)} মিটার (বাতাস একে সরিয়ে দেয়)।`
        : `Landed at ${x.toFixed(0)} m — ${x<target?'short':'long'} by ${err.toFixed(0)} m. Predicted range u²sin2θ/g = ${(u*u*Math.sin(2*th)/9.81).toFixed(0)} m (wind shifts it).`;
      el.querySelector('#tgScore').textContent=score;
      el.querySelector('#tgRound').textContent=round;
      draw();
    }
    ang.oninput=()=>{el.querySelector('#tgA').textContent=ang.value;};
    vel.oninput=()=>{el.querySelector('#tgV').textContent=vel.value;};
    el.querySelector('#tgFire').onclick=fire;
    el.querySelector('#tgNew').onclick=newTarget;
    newTarget();
  }},

{ id:'formula', title:'⚡ Formula Rush', blurb:'Sixty seconds. Match each quantity to its formula. Speed builds the recall you need when an exam clock is running.',
  mount(el){
    const pairs=[['Kinetic energy','½mv²'],['Momentum','mv'],['Weight','mg'],['Power','W/t'],
      ['Ohm\'s law','V = IR'],['Centripetal acceleration','v²/r'],['Wave equation','v = fλ'],
      ['Photon energy','hf'],['Capacitance','Q/V'],['Gravitational force','Gm₁m₂/r²'],
      ['Pendulum period','2π√(L/g)'],['Ideal gas law','pV = nRT'],['Electrical power','VI'],
      ['Spring energy','½kx²'],['Impulse','FΔt'],['Magnetic force on a wire','BIL'],
      ['de Broglie wavelength','h/p'],['Half-life','ln2/λ'],['Lorentz factor','1/√(1−v²/c²)'],
      ['Transformer ratio','Ns/Np']];
    let score=0, time=60, q=null, timer=null;
    el.innerHTML=`<div class="card"><div class="row"><span class="tag">${isBn()?'স্কোর':'Score'} <b id="fScore">0</b></span>
      <span class="tag">${isBn()?'সময়':'Time'} <b id="fTime">60</b> s</span><button class="btn" id="fStart">${isBn()?'শুরু':'Start'}</button></div>
      <h3 id="fQ" style="margin-top:1rem">${isBn()?'শুরু চাপুন':'Press start'}</h3><div class="opts" id="fOpts"></div>
      <p class="hint" id="fMsg"></p></div>`;
    function next(){
      const i=Math.floor(Math.random()*pairs.length); q=pairs[i];
      const opts=[q[1]];
      while(opts.length<4){ const c=pairs[Math.floor(Math.random()*pairs.length)][1]; if(!opts.includes(c)) opts.push(c); }
      opts.sort(()=>Math.random()-0.5);
      el.querySelector('#fQ').textContent=q[0];
      const box=el.querySelector('#fOpts'); box.innerHTML='';
      opts.forEach(o=>{ const b=document.createElement('button'); b.className='opt'; b.textContent=o;
        b.onclick=()=>{ if(o===q[1]){ score+=10; el.querySelector('#fMsg').textContent=isBn()?'✅ সঠিক':'✅ correct'; }
          else { score=Math.max(0,score-5); el.querySelector('#fMsg').textContent=`❌ ${q[0]} = ${q[1]}`; }
          el.querySelector('#fScore').textContent=score; next(); };
        box.appendChild(b); });
    }
    el.querySelector('#fStart').onclick=()=>{
      score=0; time=60; el.querySelector('#fScore').textContent=0; next();
      clearInterval(timer);
      timer=setInterval(()=>{ time--; el.querySelector('#fTime').textContent=time;
        if(time<=0){ clearInterval(timer); el.querySelector('#fQ').textContent=isBn()?`সময় শেষ! মোট স্কোর ${score}`:`Time! Final score ${score}`;
          el.querySelector('#fOpts').innerHTML=''; } },1000);
    };
  }},

{ id:'graphs', title:'📈 Graph Detective', blurb:'A motion graph appears — say what the object is doing. This is the single most tested skill in Year 11 kinematics.',
  mount(el){
    const T = {
      'Constant velocity forward':'সামনে সমবেগে চলছে','Accelerating':'ত্বরিত হচ্ছে','At rest':'স্থির',
      'Moving backwards':'পেছনে যাচ্ছে','Constant velocity':'সমবেগ','Accelerating forward':'সামনে ত্বরিত হচ্ছে',
      'Decelerating':'মন্দিত হচ্ছে','Constant velocity, zero acceleration':'সমবেগ, ত্বরণ শূন্য',
      'Constant acceleration':'সমত্বরণ','Bouncing':'লাফাচ্ছে','Speeding up':'গতি বাড়ছে',
      'Constant deceleration':'সমহারে মন্দন','Circular motion':'বৃত্তীয় গতি',
      'Approaching terminal velocity':'প্রান্তিক বেগের দিকে যাচ্ছে','Decelerating to rest':'মন্দিত হয়ে থামছে',
      'Reversing':'উল্টো দিকে যাচ্ছে','Displacement':'সরণ','Velocity':'বেগ'};
    const L = x => isBn() ? (T[x]||x) : x;
    const cases=[
      {draw:c=>{c.moveTo(40,220);c.lineTo(360,60);}, q:'Displacement', a:'Constant velocity forward',
       opts:['Constant velocity forward','Accelerating','At rest','Moving backwards']},
      {draw:c=>{for(let x=40;x<=360;x+=4)c.lineTo(x,220-((x-40)/320)**2*160);}, q:'Displacement', a:'Accelerating forward',
       opts:['Constant velocity','Accelerating forward','Decelerating','At rest']},
      {draw:c=>{c.moveTo(40,140);c.lineTo(360,140);}, q:'Velocity', a:'Constant velocity, zero acceleration',
       opts:['At rest','Constant velocity, zero acceleration','Constant acceleration','Decelerating']},
      {draw:c=>{c.moveTo(40,220);c.lineTo(360,60);}, q:'Velocity', a:'Constant acceleration',
       opts:['Constant velocity','Constant acceleration','At rest','Bouncing']},
      {draw:c=>{c.moveTo(40,60);c.lineTo(360,220);}, q:'Velocity', a:'Constant deceleration',
       opts:['Speeding up','Constant deceleration','At rest','Circular motion']},
      {draw:c=>{for(let x=40;x<=360;x+=4)c.lineTo(x,220-160*(1-Math.exp(-(x-40)/70)));}, q:'Velocity', a:'Approaching terminal velocity',
       opts:['Constant acceleration','Approaching terminal velocity','Decelerating to rest','At rest']},
      {draw:c=>{c.moveTo(40,140);c.lineTo(200,140);}, q:'Displacement', a:'At rest',
       opts:['At rest','Constant velocity','Accelerating','Reversing']}
    ];
    let i=0, score=0;
    el.innerHTML=`<div class="card"><canvas id="gdC" class="sim" width="400" height="260" style="max-width:420px"></canvas>
      <h3 id="gdQ"></h3><div class="opts" id="gdO"></div>
      <p class="hint" id="gdM"></p><div class="row"><span class="tag">${isBn()?'স্কোর':'Score'} <b id="gdS">0</b></span></div></div>`;
    const cv=el.querySelector('#gdC'), ctx=cv.getContext('2d');
    function show(){
      const c=cases[i%cases.length];
      ctx.clearRect(0,0,400,260); ctx.fillStyle=getCSS('--panel-2'); ctx.fillRect(0,0,400,260);
      ctx.strokeStyle=getCSS('--muted'); ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(40,20); ctx.lineTo(40,230); ctx.lineTo(380,230); ctx.stroke();
      ctx.strokeStyle=getCSS('--accent'); ctx.lineWidth=2.5; ctx.beginPath(); ctx.moveTo(40,220); c.draw(ctx); ctx.stroke();
      ctx.fillStyle=getCSS('--muted'); ctx.font='12px ui-monospace,monospace';
      ctx.fillText(L(c.q),6,16); ctx.fillText(isBn()?'সময়':'time',350,248);
      el.querySelector('#gdQ').textContent = isBn()? `${L(c.q)}–সময় লেখচিত্র — কী ঘটছে?` : `${c.q}–time graph — what is happening?`;
      const box=el.querySelector('#gdO'); box.innerHTML='';
      c.opts.forEach(o=>{ const b=document.createElement('button'); b.className='opt'; b.textContent=L(o);
        b.onclick=()=>{ if(o===c.a){ score+=10; el.querySelector('#gdM').textContent=isBn()?'✅ সঠিক':'✅ correct'; }
          else el.querySelector('#gdM').textContent=isBn()?`❌ উত্তর: ${L(c.a)}`:`❌ answer: ${c.a}`;
          el.querySelector('#gdS').textContent=score; i++; show(); };
        box.appendChild(b); });
    }
    show();
  }}
];
