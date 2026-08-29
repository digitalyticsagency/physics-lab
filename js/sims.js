/* Simulation engine.
   Each sim: {title, desc, params[], init(p), step(s,dt,p), draw(ctx,s,p,W,H), read(s,p)}
   Add a new sim by adding one entry — the UI (sliders, play/pause, readouts) builds itself. */
const W = 800, H = 450;
const P = (k,label,min,max,step,def,unit='') => ({k,label,min,max,step,def,unit});

function clear(ctx, bg){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = bg || getCSS('--panel-2'); ctx.fillRect(0,0,W,H);
}
function getCSS(v){ return getComputedStyle(document.body).getPropertyValue(v).trim() || '#888'; }
function line(ctx,x1,y1,x2,y2,c,w=2){ ctx.strokeStyle=c; ctx.lineWidth=w; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }
function circle(ctx,x,y,r,c){ ctx.fillStyle=c; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); }
function text(ctx,s,x,y,c,size=13,align='left'){ ctx.fillStyle=c; ctx.font=`${size}px ui-monospace,monospace`; ctx.textAlign=align; ctx.fillText(s,x,y); }
function arrow(ctx,x,y,dx,dy,c,w=2.5){
  const len=Math.hypot(dx,dy); if(len<1) return;
  line(ctx,x,y,x+dx,y+dy,c,w);
  const a=Math.atan2(dy,dx), h=Math.min(11,len*0.3);
  ctx.fillStyle=c; ctx.beginPath();
  ctx.moveTo(x+dx,y+dy);
  ctx.lineTo(x+dx-h*Math.cos(a-0.4), y+dy-h*Math.sin(a-0.4));
  ctx.lineTo(x+dx-h*Math.cos(a+0.4), y+dy-h*Math.sin(a+0.4));
  ctx.fill();
}
const C = {
  ink:()=>getCSS('--ink'), muted:()=>getCSS('--muted'), acc:()=>getCSS('--accent'),
  acc2:()=>getCSS('--accent-2'), warn:()=>getCSS('--warn'), good:()=>getCSS('--good'), line:()=>getCSS('--line')
};
function grid(ctx){
  ctx.strokeStyle=C.line(); ctx.lineWidth=1;
  for(let x=0;x<=W;x+=50){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
  for(let y=0;y<=H;y+=50){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
}

const SIMS = {

vectors:{
  title:'Vector Addition and Components',
  desc:'Change each vector and watch the resultant, its magnitude and its components update live. The dashed lines are the components of the resultant.',
  params:[P('a','Vector A magnitude',0,150,1,100,'N'),P('ta','Vector A angle',0,360,1,30,'°'),
          P('b','Vector B magnitude',0,150,1,80,'N'),P('tb','Vector B angle',0,360,1,120,'°')],
  init:()=>({}),
  step:()=>{},
  draw(ctx,s,p){
    clear(ctx); grid(ctx);
    const ox=W/2, oy=H/2;
    line(ctx,0,oy,W,oy,C.muted(),1); line(ctx,ox,0,ox,H,C.muted(),1);
    const ax=p.a*Math.cos(p.ta*Math.PI/180), ay=-p.a*Math.sin(p.ta*Math.PI/180);
    const bx=p.b*Math.cos(p.tb*Math.PI/180), by=-p.b*Math.sin(p.tb*Math.PI/180);
    arrow(ctx,ox,oy,ax,ay,C.acc()); text(ctx,'A',ox+ax*1.08,oy+ay*1.08,C.acc());
    arrow(ctx,ox+ax,oy+ay,bx,by,C.acc2()); text(ctx,'B',ox+ax+bx*1.05,oy+ay+by*1.05,C.acc2());
    arrow(ctx,ox,oy,ax+bx,ay+by,C.warn(),3.5); text(ctx,'R',ox+(ax+bx)*1.06,oy+(ay+by)*1.06,C.warn());
    ctx.setLineDash([5,4]);
    line(ctx,ox,oy,ox+ax+bx,oy,C.muted(),1.5);
    line(ctx,ox+ax+bx,oy,ox+ax+bx,oy+ay+by,C.muted(),1.5);
    ctx.setLineDash([]);
  },
  read(s,p){
    const ax=p.a*Math.cos(p.ta*Math.PI/180), ay=p.a*Math.sin(p.ta*Math.PI/180);
    const bx=p.b*Math.cos(p.tb*Math.PI/180), by=p.b*Math.sin(p.tb*Math.PI/180);
    const rx=ax+bx, ry=ay+by;
    let ang=Math.atan2(ry,rx)*180/Math.PI; if(ang<0) ang+=360;
    return [['Rx',rx.toFixed(1)+' N'],['Ry',ry.toFixed(1)+' N'],
            ['|R|',Math.hypot(rx,ry).toFixed(1)+' N'],['angle',ang.toFixed(1)+'°']];
  }
},

kinematics:{
  title:'Motion Graphs Explorer',
  desc:'Set initial velocity and acceleration, then watch the object move while the displacement–time and velocity–time graphs draw themselves.',
  params:[P('u','Initial velocity',-30,30,1,10,'m/s'),P('a','Acceleration',-8,8,0.5,2,'m/s²')],
  init:()=>({t:0,x:0,v:0,trail:[]}),
  step(s,dt,p){
    s.t+=dt; s.v=p.u+p.a*s.t; s.x=p.u*s.t+0.5*p.a*s.t*s.t;
    s.trail.push({t:s.t,x:s.x,v:s.v});
    if(s.t>12){ s.t=0; s.trail=[]; }
  },
  draw(ctx,s,p){
    clear(ctx);
    const road=90;
    ctx.fillStyle=C.line(); ctx.fillRect(0,road-20,W,40);
    const px = W/2 + s.x*4;
    circle(ctx, Math.max(12,Math.min(W-12,px)), road, 13, C.acc());
    arrow(ctx, px, road-28, s.v*3, 0, C.acc2(), 2);
    text(ctx,'position (1 px = 0.25 m)',8,32,C.muted(),12);
    // graphs
    const gy1=160, gy2=310, gh=110;
    [['displacement–time',gy1,'x'],['velocity–time',gy2,'v']].forEach(([lab,gy,key])=>{
      ctx.strokeStyle=C.line(); ctx.strokeRect(60,gy,W-100,gh);
      line(ctx,60,gy+gh/2,W-40,gy+gh/2,C.muted(),1);
      text(ctx,lab,64,gy-6,C.muted(),12);
      ctx.strokeStyle= key==='x'?C.acc():C.acc2(); ctx.lineWidth=2; ctx.beginPath();
      s.trail.forEach((pt,i)=>{
        const X=60+(pt.t/12)*(W-100);
        const scale = key==='x'?1.2:2.5;
        const Y=gy+gh/2-pt[key]*scale*0.6;
        i?ctx.lineTo(X,Math.max(gy,Math.min(gy+gh,Y))):ctx.moveTo(X,Y);
      });
      ctx.stroke();
    });
  },
  read:(s)=>[['t',s.t.toFixed(2)+' s'],['x',s.x.toFixed(1)+' m'],['v',s.v.toFixed(1)+' m/s']]
},

projectile:{
  title:'Projectile Launcher',
  desc:'Launch angle and speed set the whole parabola. Try 30° and 60° at the same speed — identical range, different flight. Turn on drag to see reality bite.',
  params:[P('v','Launch speed',5,60,1,25,'m/s'),P('th','Launch angle',5,85,1,45,'°'),
          P('h','Launch height',0,60,1,0,'m'),P('drag','Air drag coefficient',0,0.15,0.005,0,'')],
  init:(p)=>({t:0,x:0,y:p.h,vx:p.v*Math.cos(p.th*Math.PI/180),vy:p.v*Math.sin(p.th*Math.PI/180),trail:[],landed:false,range:0,peak:p.h}),
  step(s,dt,p){
    if(s.landed) return;
    const g=9.81, k=p.drag, sp=Math.hypot(s.vx,s.vy);
    s.vx += -k*sp*s.vx*dt; s.vy += (-g - k*sp*s.vy)*dt;
    s.x += s.vx*dt; s.y += s.vy*dt; s.t += dt;
    s.peak=Math.max(s.peak,s.y);
    s.trail.push([s.x,s.y]);
    if(s.y<=0){ s.y=0; s.landed=true; s.range=s.x; }
  },
  draw(ctx,s,p){
    clear(ctx); 
    const sc = Math.min(6, 700/Math.max(60,s.x*1.2));
    const gy=H-40, X=x=>50+x*sc, Y=y=>gy-y*sc;
    ctx.fillStyle=C.line(); ctx.fillRect(0,gy,W,H-gy);
    ctx.strokeStyle=C.acc(); ctx.lineWidth=2; ctx.beginPath();
    s.trail.forEach((pt,i)=> i?ctx.lineTo(X(pt[0]),Y(pt[1])):ctx.moveTo(X(pt[0]),Y(pt[1])));
    ctx.stroke();
    circle(ctx,X(s.x),Y(s.y),8,C.warn());
    arrow(ctx,X(s.x),Y(s.y),s.vx*1.6,-s.vy*1.6,C.acc2(),2);
    text(ctx,`scale: 1 m ≈ ${sc.toFixed(1)} px`,10,20,C.muted(),12);
    if(s.landed) text(ctx,`range ${s.range.toFixed(1)} m · flight ${s.t.toFixed(2)} s`,W-12,26,C.ink(),14,'right');
  },
  read:(s)=>[['t',s.t.toFixed(2)+' s'],['x',s.x.toFixed(1)+' m'],['y',s.y.toFixed(1)+' m'],
             ['vx',s.vx.toFixed(1)+' m/s'],['vy',s.vy.toFixed(1)+' m/s'],['peak',s.peak.toFixed(1)+' m']]
},

incline:{
  title:'Inclined Plane with Friction',
  desc:'Raise the angle until tanθ exceeds µs and the block breaks free. Watch the free-body arrows: weight splits into mg sinθ along the slope and mg cosθ into it.',
  params:[P('th','Slope angle',0,60,1,25,'°'),P('mus','Static µs',0,1.2,0.05,0.5,''),
          P('muk','Kinetic µk',0,1.2,0.05,0.35,''),P('m','Mass',1,20,0.5,5,'kg')],
  init:()=>({d:0,v:0,moving:false}),
  step(s,dt,p){
    const g=9.81, th=p.th*Math.PI/180;
    const drive=g*Math.sin(th), maxStat=p.mus*g*Math.cos(th);
    if(!s.moving && drive>maxStat) s.moving=true;
    if(s.moving){
      const a=g*Math.sin(th)-p.muk*g*Math.cos(th);
      s.v=Math.max(0,s.v+a*dt); s.d+=s.v*dt;
      if(s.d>7){ s.d=0; s.v=0; s.moving=false; }
    }
  },
  draw(ctx,s,p){
    clear(ctx);
    const th=p.th*Math.PI/180, ox=80, oy=H-60, L=600;
    const ex=ox+L*Math.cos(th), ey=oy-L*Math.sin(th);
    line(ctx,ox,oy,W-40,oy,C.muted(),1);
    ctx.fillStyle=C.line(); ctx.beginPath(); ctx.moveTo(ox,oy); ctx.lineTo(ex,ey); ctx.lineTo(ex,oy); ctx.closePath(); ctx.fill();
    const f=1-Math.min(1,s.d/7), bx=ox+(L*0.75*f+40)*Math.cos(th), by=oy-(L*0.75*f+40)*Math.sin(th);
    ctx.save(); ctx.translate(bx,by); ctx.rotate(-th);
    ctx.fillStyle=C.acc(); ctx.fillRect(-22,-30,44,30); ctx.restore();
    const g=9.81, wgt=p.m*g*1.2;
    arrow(ctx,bx,by-15,0,wgt,C.warn(),2.5); text(ctx,'mg',bx+6,by+wgt-4,C.warn(),12);
    const N=p.m*g*Math.cos(th)*1.2;
    arrow(ctx,bx,by-15,N*Math.sin(th),-N*Math.cos(th),C.acc2(),2.5);
    text(ctx,'N',bx+N*Math.sin(th)+4,by-N*Math.cos(th)-14,C.acc2(),12);
    text(ctx,`tanθ = ${Math.tan(th).toFixed(2)}   µs = ${p.mus.toFixed(2)}  →  ${Math.tan(th)>p.mus?'SLIDING':'held by static friction'}`,
         16,28,Math.tan(th)>p.mus?C.warn():C.good(),14);
  },
  read(s,p){
    const g=9.81,th=p.th*Math.PI/180;
    const a=s.moving?g*Math.sin(th)-p.muk*g*Math.cos(th):0;
    return [['N',(p.m*g*Math.cos(th)).toFixed(1)+' N'],['mg sinθ',(p.m*g*Math.sin(th)).toFixed(1)+' N'],
            ['f_max static',(p.mus*p.m*g*Math.cos(th)).toFixed(1)+' N'],['a',a.toFixed(2)+' m/s²'],['v',s.v.toFixed(2)+' m/s']];
  }
},

circular:{
  title:'Circular Motion and the Centripetal Force',
  desc:'The red arrow is the centripetal force, always pointing to the centre. The green arrow is velocity, always tangential. Cut the string to see what "centrifugal force" really is.',
  params:[P('r','Radius',40,180,5,120,'px→m'),P('v','Speed',1,14,0.5,6,'m/s'),P('m','Mass',0.5,10,0.5,2,'kg')],
  init:()=>({a:0,cut:false,cx:0,cy:0,vx:0,vy:0}),
  step(s,dt,p){
    if(!s.cut){ s.a += (p.v/(p.r/20))*dt; }
    else { s.cx+=s.vx*dt*20; s.cy+=s.vy*dt*20; if(s.cx>W||s.cx<0||s.cy>H||s.cy<0){s.cut=false;s.a=0;} }
  },
  draw(ctx,s,p){
    clear(ctx);
    const ox=W/2, oy=H/2;
    ctx.strokeStyle=C.line(); ctx.setLineDash([4,5]); ctx.beginPath(); ctx.arc(ox,oy,p.r,0,7); ctx.stroke(); ctx.setLineDash([]);
    circle(ctx,ox,oy,6,C.muted());
    let bx,by;
    if(!s.cut){
      bx=ox+p.r*Math.cos(s.a); by=oy+p.r*Math.sin(s.a);
      line(ctx,ox,oy,bx,by,C.muted(),1.5);
      const F=p.m*p.v*p.v/(p.r/20)*2;
      arrow(ctx,bx,by,(ox-bx)/p.r*Math.min(90,F),(oy-by)/p.r*Math.min(90,F),C.warn(),3);
      arrow(ctx,bx,by,-Math.sin(s.a)*p.v*8,Math.cos(s.a)*p.v*8,C.good(),2.5);
    } else { bx=s.cx; by=s.cy; }
    circle(ctx,bx,by,12,C.acc());
    text(ctx,'red = centripetal force (inward)  ·  green = velocity (tangent)',14,26,C.muted(),12);
    if(s.cut) text(ctx,'string cut → straight line, no outward force',14,46,C.warn(),13);
  },
  buttons:[{label:'Cut the string',fn:(s,p)=>{ if(!s.cut){ const ox=W/2,oy=H/2;
      s.cx=ox+p.r*Math.cos(s.a); s.cy=oy+p.r*Math.sin(s.a);
      s.vx=-Math.sin(s.a)*p.v; s.vy=Math.cos(s.a)*p.v; s.cut=true; } }}],
  read(s,p){
    const r=p.r/20, ac=p.v*p.v/r;
    return [['r',r.toFixed(1)+' m'],['a_c',ac.toFixed(2)+' m/s²'],['F_c',(p.m*ac).toFixed(1)+' N'],
            ['ω',(p.v/r).toFixed(2)+' rad/s'],['T',(2*Math.PI*r/p.v).toFixed(2)+' s']];
  }
},

orbit:{
  title:'Gravity and Orbits',
  desc:'Launch a satellite sideways. Too slow and it falls back; too fast and it escapes. In between you get an ellipse — and one exact speed gives a circle.',
  params:[P('v','Launch speed',20,90,1,52,'rel'),P('r0','Launch radius',60,200,5,140,'px'),P('M','Planet mass',20,120,5,60,'rel')],
  init:(p)=>({x:p.r0,y:0,vx:0,vy:p.v/10,trail:[],t:0}),
  step(s,dt,p){
    const GM=p.M*300;
    for(let i=0;i<4;i++){
      const r=Math.hypot(s.x,s.y)||1, a=-GM/(r*r), h=dt/4;
      s.vx+=a*(s.x/r)*h; s.vy+=a*(s.y/r)*h; s.x+=s.vx*h; s.y+=s.vy*h;
    }
    s.t+=dt;
    s.trail.push([s.x,s.y]); if(s.trail.length>900) s.trail.shift();
  },
  draw(ctx,s,p){
    clear(ctx,'#070a14');
    const ox=W/2, oy=H/2;
    for(let i=0;i<70;i++){ const sx=(i*137)%W, sy=(i*89)%H; circle(ctx,sx,sy,1,'#3a4260'); }
    circle(ctx,ox,oy,Math.sqrt(p.M)*3.4,'#4a6cff');
    ctx.strokeStyle='#7b8cff88'; ctx.lineWidth=1.5; ctx.beginPath();
    s.trail.forEach((pt,i)=> i?ctx.lineTo(ox+pt[0],oy+pt[1]):ctx.moveTo(ox+pt[0],oy+pt[1]));
    ctx.stroke();
    circle(ctx,ox+s.x,oy+s.y,5,'#2ee0cd');
    const r=Math.hypot(s.x,s.y);
    text(ctx,r>420?'ESCAPED':(r<Math.sqrt(p.M)*3.4?'CRASHED':'in orbit'),14,26, r>420?'#ff6b6f':(r<Math.sqrt(p.M)*3.4?'#ff6b6f':'#3ddc84'),14);
    text(ctx,'circular speed here = √(GM/r) ≈ '+ (Math.sqrt(p.M*300/Math.max(1,p.r0))*10).toFixed(0),14,H-16,'#9aa3bd',12);
  },
  read(s,p){
    const r=Math.hypot(s.x,s.y), v=Math.hypot(s.vx,s.vy);
    return [['r',r.toFixed(0)+' px'],['v',(v*10).toFixed(1)+' rel'],['t',s.t.toFixed(1)+' s']];
  }
},

energy:{
  title:'Energy Conversion on a Track',
  desc:'A cart rolls down a hill. The bars show kinetic, potential and (with friction) heat. Their total never changes.',
  params:[P('h','Start height',5,80,1,50,'m'),P('fr','Friction loss',0,0.3,0.01,0,'per s'),P('m','Mass',10,200,10,50,'kg')],
  init:(p)=>({x:0,v:0,heat:0,done:false}),
  step(s,dt,p){
    const g=9.81, L=600;
    const slope=p.h/ (L/6);
    if(s.x<L){
      const a=g*Math.sin(Math.atan(slope));
      s.v+=a*dt*0.6; s.v*= (1-p.fr*dt);
      const lost=0.5*p.m*s.v*s.v*p.fr*dt; s.heat+=lost;
      s.x+=s.v*dt*6;
    } else { s.x=0; s.v=0; s.heat=0; }
  },
  draw(ctx,s,p){
    clear(ctx);
    const L=600, x0=60, ybase=H-60;
    const hpx=p.h*2.2;
    ctx.fillStyle=C.line(); ctx.beginPath();
    ctx.moveTo(x0,ybase); ctx.lineTo(x0,ybase-hpx);
    for(let i=0;i<=L;i+=10){ ctx.lineTo(x0+i, ybase-hpx*Math.max(0,1-i/(L*0.85))); }
    ctx.lineTo(x0+L,ybase); ctx.closePath(); ctx.fill();
    const cx=x0+Math.min(L,s.x), frac=Math.max(0,1-Math.min(L,s.x)/(L*0.85));
    const cy=ybase-hpx*frac-10;
    circle(ctx,cx,cy,11,C.acc());
    const height=p.h*frac, PE=p.m*9.81*height, KE=0.5*p.m*s.v*s.v, tot=PE+KE+s.heat||1;
    const bars=[['KE',KE,C.acc()],['PE',PE,C.acc2()],['heat',s.heat,C.warn()]];
    bars.forEach((b,i)=>{
      const bx=40+i*90;
      ctx.fillStyle=C.line(); ctx.fillRect(bx,40,50,120);
      ctx.fillStyle=b[2]; const hgt=Math.min(120,120*b[1]/tot); ctx.fillRect(bx,160-hgt,50,hgt);
      text(ctx,b[0],bx+25,178,C.muted(),12,'center');
    });
    text(ctx,'total energy is constant',40,30,C.muted(),12);
  },
  read(s,p){
    const KE=0.5*p.m*s.v*s.v;
    return [['v',s.v.toFixed(1)+' m/s'],['KE',(KE/1000).toFixed(2)+' kJ'],['heat',(s.heat/1000).toFixed(2)+' kJ']];
  }
},

collision:{
  title:'1D Collisions',
  desc:'Set the masses and speeds, then slide elasticity from 0 (they stick) to 1 (perfectly elastic). Momentum is conserved every time; kinetic energy is not.',
  params:[P('m1','Mass 1',1,10,0.5,4,'kg'),P('u1','Velocity 1',-8,8,0.5,4,'m/s'),
          P('m2','Mass 2',1,10,0.5,2,'kg'),P('u2','Velocity 2',-8,8,0.5,-2,'m/s'),
          P('e','Elasticity',0,1,0.05,1,'')],
  init:(p)=>({x1:180,x2:620,v1:p.u1,v2:p.u2,hit:false,t:0}),
  step(s,dt,p){
    s.t+=dt;
    s.x1+=s.v1*dt*30; s.x2+=s.v2*dt*30;
    const r1=12+p.m1*2, r2=12+p.m2*2;
    if(!s.hit && s.x2-s.x1 <= r1+r2){
      const m1=p.m1,m2=p.m2,u1=s.v1,u2=s.v2,e=p.e;
      s.v1=(m1*u1+m2*u2+m2*e*(u2-u1))/(m1+m2);
      s.v2=(m1*u1+m2*u2+m1*e*(u1-u2))/(m1+m2);
      s.hit=true;
    }
    if(s.x1<0||s.x2>W||s.t>10){ s.x1=180;s.x2=620;s.v1=p.u1;s.v2=p.u2;s.hit=false;s.t=0; }
  },
  draw(ctx,s,p){
    clear(ctx);
    const y=H/2; ctx.fillStyle=C.line(); ctx.fillRect(0,y+30,W,6);
    circle(ctx,s.x1,y,12+p.m1*2,C.acc()); circle(ctx,s.x2,y,12+p.m2*2,C.acc2());
    text(ctx,p.m1+' kg',s.x1,y+4,'#fff',12,'center'); text(ctx,p.m2+' kg',s.x2,y+4,'#fff',12,'center');
    arrow(ctx,s.x1,y-40,s.v1*10,0,C.acc()); arrow(ctx,s.x2,y-40,s.v2*10,0,C.acc2());
    text(ctx, s.hit?'after collision':'before collision', 14,28, C.muted(),13);
  },
  read(s,p){
    const pTot=p.m1*s.v1+p.m2*s.v2, KE=0.5*p.m1*s.v1**2+0.5*p.m2*s.v2**2;
    const KE0=0.5*p.m1*p.u1**2+0.5*p.m2*p.u2**2;
    return [['v1',s.v1.toFixed(2)+' m/s'],['v2',s.v2.toFixed(2)+' m/s'],
            ['Σp',pTot.toFixed(2)+' kg·m/s'],['KE now',KE.toFixed(2)+' J'],['KE before',KE0.toFixed(2)+' J'],
            ['KE lost',(KE0-KE).toFixed(2)+' J']];
  }
},

shm:{
  title:'Simple Harmonic Motion',
  desc:'A mass on a spring beside a pendulum. Change k, m and damping, and read the period off the trace. Notice mass changes the spring period but not the pendulum period.',
  params:[P('k','Spring constant',20,400,10,150,'N/m'),P('m','Mass',0.2,5,0.1,1,'kg'),
          P('A','Amplitude',10,90,5,60,'px'),P('b','Damping',0,1.2,0.05,0,''),P('L','Pendulum length',0.3,3,0.1,1,'m')],
  init:()=>({t:0,trace:[]}),
  step(s,dt){ s.t+=dt; s.trace.push(s.t); if(s.trace.length>1200) s.trace.shift(); },
  draw(ctx,s,p){
    clear(ctx);
    const w=Math.sqrt(p.k/p.m), env=Math.exp(-p.b*s.t/2);
    const x=p.A*env*Math.cos(w*s.t);
    // spring
    const sx=150, sy0=60, sy=sy0+150+x;
    ctx.strokeStyle=C.muted(); ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(sx,sy0);
    for(let i=0;i<=20;i++){ ctx.lineTo(sx+(i%2?14:-14), sy0+(sy-sy0)*i/20); }
    ctx.lineTo(sx,sy); ctx.stroke();
    ctx.fillStyle=C.acc(); ctx.fillRect(sx-24,sy,48,30);
    line(ctx,sx-60,sy0+150,sx+60,sy0+150,C.line(),1);
    text(ctx,'spring',sx,40,C.muted(),12,'center');
    // pendulum
    const px=520, py=70, wp=Math.sqrt(9.81/p.L), th=(p.A/200)*Math.exp(-p.b*s.t/2)*Math.cos(wp*s.t);
    const bx=px+180*Math.sin(th), by=py+180*Math.cos(th);
    line(ctx,px,py,bx,by,C.muted(),2); circle(ctx,bx,by,16,C.acc2());
    text(ctx,'pendulum',px,40,C.muted(),12,'center');
    // trace
    ctx.strokeStyle=C.acc(); ctx.lineWidth=1.5; ctx.beginPath();
    for(let i=0;i<300;i++){
      const tt=s.t-3+i*0.01;
      const X=40+i*(W-80)/300, Y=H-60 - p.A*0.5*Math.exp(-p.b*Math.max(0,tt)/2)*Math.cos(w*tt);
      i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);
    }
    ctx.stroke();
    text(ctx,'displacement trace (last 3 s)',40,H-105,C.muted(),12);
  },
  read(s,p){
    const w=Math.sqrt(p.k/p.m);
    return [['ω spring',w.toFixed(2)+' rad/s'],['T spring',(2*Math.PI/w).toFixed(3)+' s'],
            ['T pendulum',(2*Math.PI*Math.sqrt(p.L/9.81)).toFixed(3)+' s'],
            ['v_max',(p.A*w/20).toFixed(2)+' m/s']];
  }
},

wave:{
  title:'Travelling Wave',
  desc:'v = fλ made visible. Change frequency and wavelength independently and watch the speed follow. The red dot only moves up and down — the wave moves right.',
  params:[P('A','Amplitude',10,90,5,60,'px'),P('lam','Wavelength',60,400,10,200,'px'),
          P('f','Frequency',0.2,3,0.1,1,'Hz'),P('type','Longitudinal view (0=off,1=on)',0,1,1,0,'')],
  init:()=>({t:0}),
  step(s,dt){ s.t+=dt; },
  draw(ctx,s,p){
    clear(ctx);
    const k=2*Math.PI/p.lam, w=2*Math.PI*p.f;
    if(p.type<0.5){
      line(ctx,0,H/2,W,H/2,C.line(),1);
      ctx.strokeStyle=C.acc(); ctx.lineWidth=2.5; ctx.beginPath();
      for(let x=0;x<=W;x+=2){ const y=H/2 - p.A*Math.sin(k*x-w*s.t); x?ctx.lineTo(x,y):ctx.moveTo(x,y); }
      ctx.stroke();
      const px=200, py=H/2-p.A*Math.sin(k*px-w*s.t);
      circle(ctx,px,py,8,C.warn());
      ctx.setLineDash([4,4]); line(ctx,px,H/2-p.A,px,H/2+p.A,C.muted(),1); ctx.setLineDash([]);
      // wavelength marker
      const x1=100; ctx.strokeStyle=C.acc2();
      line(ctx,x1,H-60,x1+p.lam,H-60,C.acc2(),2);
      text(ctx,`λ = ${p.lam} px`,x1+p.lam/2,H-68,C.acc2(),12,'center');
    } else {
      for(let i=0;i<400;i++){
        const x0=i*2, d=8*Math.sin(k*x0-w*s.t);
        circle(ctx,x0+d,H/2,2.2,C.acc());
      }
      text(ctx,'longitudinal: compressions and rarefactions',20,40,C.muted(),13);
    }
  },
  read:()=>null
},

superposition:{
  title:'Superposition and Standing Waves',
  desc:'Two waves travelling in opposite directions add to a standing wave with fixed nodes. Set the second wave to travel the same way to see beats and interference instead.',
  params:[P('A1','Wave 1 amplitude',0,60,5,40,'px'),P('A2','Wave 2 amplitude',0,60,5,40,'px'),
          P('lam','Wavelength',60,400,10,200,'px'),P('dir','Wave 2 direction (0=opposite,1=same)',0,1,1,0,''),
          P('df','Wave 2 frequency offset',0,0.5,0.05,0,'Hz')],
  init:()=>({t:0}),
  step(s,dt){ s.t+=dt; },
  draw(ctx,s,p){
    clear(ctx);
    const k=2*Math.PI/p.lam, w=2*Math.PI, w2=2*Math.PI*(1+p.df), sgn=p.dir<0.5?1:-1;
    const rows=[[110,'wave 1',C.acc()],[210,'wave 2',C.acc2()],[350,'resultant',C.warn()]];
    rows.forEach(([y,lab,c])=>{ line(ctx,0,y,W,y,C.line(),1); text(ctx,lab,10,y-52,C.muted(),12); });
    ctx.lineWidth=2;
    for(const [y,,c,] of [[110,0,C.acc()],[210,0,C.acc2()],[350,0,C.warn()]]) {}
    const f1=x=>p.A1*Math.sin(k*x-w*s.t), f2=x=>p.A2*Math.sin(k*x+sgn*w2*s.t);
    [[110,f1,C.acc()],[210,f2,C.acc2()],[350,x=>f1(x)+f2(x),C.warn()]].forEach(([y,fn,c])=>{
      ctx.strokeStyle=c; ctx.beginPath();
      for(let x=0;x<=W;x+=2){ const Y=y-fn(x); x?ctx.lineTo(x,Y):ctx.moveTo(x,Y); }
      ctx.stroke();
    });
    if(p.dir<0.5 && p.df===0){
      for(let n=0;n*p.lam/2<W;n++){ const x=n*p.lam/2; circle(ctx,x,350,4,C.good()); }
      text(ctx,'green dots = nodes (always zero), spacing λ/2',10,H-16,C.good(),12);
    }
  },
  read:()=>0
},

doppler:{
  title:'Doppler Effect',
  desc:'Wavefronts bunch up ahead of a moving source and stretch behind it. Push the source speed past the wave speed and the cone of a sonic boom appears.',
  params:[P('vs','Source speed',0,500,10,120,'m/s'),P('f','Source frequency',200,2000,50,600,'Hz'),P('v','Wave speed',343,343,1,343,'m/s')],
  init:()=>({t:0,x:80,waves:[],emit:0}),
  step(s,dt,p){
    s.t+=dt; s.x+=p.vs*dt*0.25;
    s.emit+=dt;
    if(s.emit>0.28){ s.emit=0; s.waves.push({x:s.x,r:0}); }
    s.waves.forEach(w=>w.r+=p.v*dt*0.25);
    s.waves=s.waves.filter(w=>w.r<900);
    if(s.x>W-40){ s.x=40; s.waves=[]; }
  },
  draw(ctx,s,p){
    clear(ctx);
    ctx.strokeStyle=C.acc(); ctx.lineWidth=1.5;
    s.waves.forEach(w=>{ ctx.beginPath(); ctx.arc(w.x,H/2,w.r,0,7); ctx.stroke(); });
    circle(ctx,s.x,H/2,9,C.warn());
    circle(ctx,W-60,H/2,10,C.good()); text(ctx,'observer',W-60,H/2+30,C.good(),12,'center');
    const fa=p.f*p.v/Math.max(1,(p.v-p.vs)), fb=p.f*p.v/(p.v+p.vs);
    text(ctx,`approaching: ${p.vs<p.v?fa.toFixed(0)+' Hz':'shock wave'}   receding: ${fb.toFixed(0)} Hz`,16,30,C.ink(),14);
    if(p.vs>=p.v) text(ctx,'Mach '+(p.vs/p.v).toFixed(2)+' — sonic boom cone',16,52,C.warn(),13);
  },
  read(s,p){
    const fa=p.vs<p.v? p.f*p.v/(p.v-p.vs):Infinity;
    return [['f approaching', isFinite(fa)?fa.toFixed(1)+' Hz':'—'],
            ['f receding',(p.f*p.v/(p.v+p.vs)).toFixed(1)+' Hz'],
            ['Mach',(p.vs/p.v).toFixed(2)]];
  }
},

lens:{
  title:'Converging Lens Ray Diagram',
  desc:'Drag the object distance across the focal point and watch the image flip from real and inverted to virtual and upright. The three construction rays are drawn for you.',
  params:[P('f','Focal length',40,200,5,100,'px'),P('u','Object distance',30,400,5,250,'px'),P('ho','Object height',20,90,5,60,'px')],
  init:()=>({}),
  step:()=>{},
  draw(ctx,s,p){
    clear(ctx);
    const cx=W/2, ax=H/2;
    line(ctx,0,ax,W,ax,C.muted(),1);
    ctx.strokeStyle=C.acc(); ctx.lineWidth=3;
    ctx.beginPath(); ctx.ellipse(cx,ax,14,110,0,0,7); ctx.stroke();
    [[-1,'F'],[1,"F'"],[-2,'2F'],[2,"2F'"]].forEach(([m,l])=>{
      const x=cx+m*p.f*(Math.abs(m)===2?0.5*2:1)/(Math.abs(m)===2?1:1);
      const xx=cx+ (Math.abs(m)===2? Math.sign(m)*2*p.f : m*p.f);
      circle(ctx,xx,ax,4,C.muted()); text(ctx,l,xx,ax+20,C.muted(),12,'center');
    });
    const ox=cx-p.u, oy=ax-p.ho;
    arrow(ctx,ox,ax,0,-p.ho,C.acc2(),3);
    const v = 1/(1/p.f - 1/p.u);
    const virtual = p.u < p.f;
    const ix = cx + (virtual? v : v), hi = -p.ho*(v/p.u);
    // ray 1: parallel then through focus
    line(ctx,ox,oy,cx,oy,C.warn(),1.5);
    if(!virtual) line(ctx,cx,oy,cx+ (ix-cx)*1.6, oy + (ax+hi-oy)*1.6, C.warn(),1.5);
    else { line(ctx,cx,oy,W,oy+(ax+ (0-oy))*0,C.warn(),1.5);
           ctx.setLineDash([4,4]); line(ctx,cx,oy,ix,ax+hi,C.warn(),1.2); ctx.setLineDash([]); }
    // ray 2: through centre
    line(ctx,ox,oy,cx+(cx-ox)*1.8, ax+(ax-oy)*1.8, C.good(),1.5);
    // image
    if(isFinite(v) && Math.abs(v)<900){
      const dash = virtual;
      if(dash) ctx.setLineDash([5,4]);
      arrow(ctx, ix, ax, 0, hi, C.acc(),3);
      ctx.setLineDash([]);
      text(ctx, virtual?'virtual, upright, magnified':'real, inverted', ix, ax+ (hi>0? 30:-8) + (hi>0?0:-hi*0), C.acc(),12,'center');
    }
    text(ctx,'object',ox,ax+22,C.acc2(),12,'center');
  },
  read(s,p){
    const v=1/(1/p.f-1/p.u), m=-v/p.u;
    return [['u',p.u+' px'],['v',isFinite(v)?v.toFixed(1)+' px':'∞'],
            ['magnification',m.toFixed(2)],['image',p.u<p.f?'virtual upright':'real inverted']];
  }
},

gas:{
  title:'Kinetic Theory of Gases',
  desc:'Particles bounce elastically off the walls. Raise the temperature and they speed up; shrink the volume and collisions get more frequent — pressure rises exactly as pV = nRT predicts.',
  params:[P('N','Number of particles',10,200,5,80,''),P('T','Temperature',50,900,10,300,'K'),P('V','Container width',200,780,20,600,'px')],
  init:(p)=>({ps:[],hits:0,pressure:0,tick:0}),
  step(s,dt,p){
    while(s.ps.length<p.N) s.ps.push({x:Math.random()*p.V,y:Math.random()*H,a:Math.random()*7});
    while(s.ps.length>p.N) s.ps.pop();
    const sp=Math.sqrt(p.T)*3.2;
    s.ps.forEach(q=>{
      q.x+=Math.cos(q.a)*sp*dt; q.y+=Math.sin(q.a)*sp*dt;
      if(q.x<4){q.x=4;q.a=Math.PI-q.a;s.hits++;}
      if(q.x>p.V-4){q.x=p.V-4;q.a=Math.PI-q.a;s.hits++;}
      if(q.y<4){q.y=4;q.a=-q.a;s.hits++;}
      if(q.y>H-4){q.y=H-4;q.a=-q.a;s.hits++;}
    });
    s.tick+=dt;
    if(s.tick>0.5){ s.pressure=s.hits/s.tick; s.hits=0; s.tick=0; }
  },
  draw(ctx,s,p){
    clear(ctx);
    ctx.fillStyle=getCSS('--panel'); ctx.fillRect(0,0,p.V,H);
    ctx.strokeStyle=C.acc(); ctx.lineWidth=3; ctx.strokeRect(1,1,p.V-2,H-2);
    const hot = p.T>500;
    s.ps.forEach(q=> circle(ctx,q.x,q.y,3.2, hot?C.warn():C.acc()));
    text(ctx,`T = ${p.T} K   V ∝ ${p.V}   p ∝ ${s.pressure.toFixed(0)}`, 12, 24, C.ink(), 14);
  },
  read(s,p){
    const k=1.38e-23, vrms=Math.sqrt(3*k*p.T/(4.8e-26));
    return [['relative p',s.pressure.toFixed(0)],['pV/T',(s.pressure*p.V/p.T).toFixed(1)],
            ['v_rms (N₂)',vrms.toFixed(0)+' m/s'],['mean KE',(1.5*k*p.T).toExponential(2)+' J']];
  }
},

efield:{
  title:'Electric Field of Two Charges',
  desc:'Field lines leave positive charge and enter negative. Flip the sign of the second charge to switch between a dipole and two like charges pushing apart.',
  params:[P('q1','Charge 1',-5,5,0.5,3,'µC'),P('q2','Charge 2',-5,5,0.5,-3,'µC'),P('d','Separation',80,500,10,260,'px')],
  init:()=>({}),
  step:()=>{},
  draw(ctx,s,p){
    clear(ctx);
    const x1=W/2-p.d/2, x2=W/2+p.d/2, y=H/2;
    // field lines by tracing
    const charges=[{x:x1,y,q:p.q1},{x:x2,y,q:p.q2}];
    ctx.lineWidth=1.2;
    charges.forEach(c=>{
      if(c.q===0) return;
      const n=Math.max(6,Math.round(Math.abs(c.q)*4));
      for(let i=0;i<n;i++){
        const a=(i/n)*2*Math.PI;
        let px=c.x+12*Math.cos(a), py=c.y+12*Math.sin(a);
        ctx.strokeStyle=c.q>0?'#ff6b6f88':'#7b8cff88';
        ctx.beginPath(); ctx.moveTo(px,py);
        for(let stp=0;stp<300;stp++){
          let ex=0,ey=0;
          charges.forEach(o=>{
            const dx=px-o.x, dy=py-o.y, r2=dx*dx+dy*dy, r=Math.sqrt(r2)||1;
            const e=o.q/r2*4000;
            ex+=e*dx/r; ey+=e*dy/r;
          });
          const m=Math.hypot(ex,ey)||1;
          const dir = c.q>0?1:-1;
          px+=dir*ex/m*4; py+=dir*ey/m*4;
          if(px<0||px>W||py<0||py>H) break;
          ctx.lineTo(px,py);
          if(charges.some(o=>o.q*c.q<0 && Math.hypot(px-o.x,py-o.y)<10)) break;
        }
        ctx.stroke();
      }
    });
    circle(ctx,x1,y,Math.abs(p.q1)*3+10, p.q1>=0?C.warn():C.acc());
    text(ctx,(p.q1>0?'+':'')+p.q1,x1,y+5,'#fff',14,'center');
    circle(ctx,x2,y,Math.abs(p.q2)*3+10, p.q2>=0?C.warn():C.acc());
    text(ctx,(p.q2>0?'+':'')+p.q2,x2,y+5,'#fff',14,'center');
  },
  read(s,p){
    const k=8.99e9, r=p.d/1000, F=k*Math.abs(p.q1*p.q2)*1e-12/(r*r);
    return [['separation',(p.d/1000).toFixed(3)+' m (scaled)'],
            ['|F|',F.toExponential(2)+' N'],
            ['type', p.q1*p.q2<0?'attraction':'repulsion']];
  }
},

circuit:{
  title:'Series and Parallel Circuits',
  desc:'Switch the two resistors between series and parallel and watch total resistance, current and power change. The lamp brightness tracks the power.',
  params:[P('V','Supply voltage',1,24,1,12,'V'),P('R1','Resistor 1',1,50,1,6,'Ω'),
          P('R2','Resistor 2',1,50,1,4,'Ω'),P('mode','0 = series, 1 = parallel',0,1,1,0,'')],
  init:()=>({}),
  step:()=>{},
  draw(ctx,s,p){
    clear(ctx);
    const series=p.mode<0.5;
    const R= series? p.R1+p.R2 : 1/(1/p.R1+1/p.R2);
    const I=p.V/R;
    const box=(x,y,label,c)=>{ ctx.fillStyle=c; ctx.fillRect(x,y,70,34); text(ctx,label,x+35,y+22,'#fff',13,'center'); };
    ctx.strokeStyle=C.ink(); ctx.lineWidth=2.5;
    if(series){
      ctx.strokeRect(120,120,560,210);
      box(250,103,p.R1+' Ω',C.acc()); box(450,103,p.R2+' Ω',C.acc2());
      ctx.fillStyle=getCSS('--panel-2'); ctx.fillRect(250,120,70,4); ctx.fillRect(450,120,70,4);
    } else {
      ctx.strokeRect(120,120,560,210);
      line(ctx,300,120,300,330,C.ink(),2.5); line(ctx,500,120,500,330,C.ink(),2.5);
      box(265,190,p.R1+' Ω',C.acc()); box(465,190,p.R2+' Ω',C.acc2());
    }
    text(ctx,p.V+' V',110,235,C.ink(),15,'right');
    line(ctx,120,215,120,255,C.warn(),4);
    const bright=Math.min(1,I/5);
    circle(ctx,W/2,360,22,`rgba(255,214,80,${0.15+bright*0.85})`);
    text(ctx,'lamp',W/2,398,C.muted(),12,'center');
    text(ctx, series?'SERIES — one path, current the same everywhere':'PARALLEL — two paths, voltage the same across each',
         W/2,40,C.muted(),13,'center');
  },
  read(s,p){
    const series=p.mode<0.5;
    const R= series? p.R1+p.R2 : 1/(1/p.R1+1/p.R2);
    const I=p.V/R;
    const rows=[['R total',R.toFixed(2)+' Ω'],['I total',I.toFixed(2)+' A'],['P total',(p.V*I).toFixed(2)+' W']];
    if(series){ rows.push(['V across R1',(I*p.R1).toFixed(2)+' V'],['V across R2',(I*p.R2).toFixed(2)+' V']); }
    else { rows.push(['I through R1',(p.V/p.R1).toFixed(2)+' A'],['I through R2',(p.V/p.R2).toFixed(2)+' A']); }
    return rows;
  }
},

magnetic:{
  title:'Charged Particle in a Magnetic Field',
  desc:'F = qvB bends the path into a circle of radius r = mv/(qB). Increase B to tighten the spiral; flip the charge sign to reverse the curve.',
  params:[P('B','Field strength',0.1,3,0.1,1,'T'),P('v','Speed',20,300,10,120,'rel'),
          P('q','Charge sign (−1 or +1)',-1,1,2,1,''),P('m','Mass',0.5,4,0.5,1,'rel')],
  init:()=>({x:120,y:H/2,vx:1,vy:0,trail:[]}),
  step(s,dt,p){
    const sp=p.v;
    let vx=s.vx*sp, vy=s.vy*sp;
    const ax=p.q*p.B*vy/p.m*2, ay=-p.q*p.B*vx/p.m*2;
    vx+=ax*dt; vy+=ay*dt;
    const n=Math.hypot(vx,vy)||1; s.vx=vx/n; s.vy=vy/n;
    s.x+=s.vx*sp*dt; s.y+=s.vy*sp*dt;
    s.trail.push([s.x,s.y]); if(s.trail.length>600) s.trail.shift();
    if(s.x<0||s.x>W||s.y<0||s.y>H){ s.x=120;s.y=H/2;s.vx=1;s.vy=0;s.trail=[]; }
  },
  draw(ctx,s,p){
    clear(ctx);
    ctx.fillStyle=C.muted();
    for(let x=30;x<W;x+=60) for(let y=30;y<H;y+=60){
      ctx.beginPath(); ctx.arc(x,y,2,0,7); ctx.fill();
      ctx.strokeStyle=C.line(); ctx.beginPath(); ctx.arc(x,y,7,0,7); ctx.stroke();
    }
    text(ctx,'⊗ field into the page',12,26,C.muted(),13);
    ctx.strokeStyle=C.acc(); ctx.lineWidth=2; ctx.beginPath();
    s.trail.forEach((t,i)=> i?ctx.lineTo(t[0],t[1]):ctx.moveTo(t[0],t[1])); ctx.stroke();
    circle(ctx,s.x,s.y,8,p.q>0?C.warn():C.acc2());
    arrow(ctx,s.x,s.y,s.vx*40,s.vy*40,C.good(),2);
  },
  read(s,p){
    const r=p.m*p.v/(Math.abs(p.q)*p.B*2);
    return [['radius r',r.toFixed(1)+' px'],['F',(Math.abs(p.q)*p.v*p.B).toFixed(1)+' rel'],
            ['direction',p.q>0?'clockwise':'anticlockwise']];
  }
},

induction:{
  title:'Electromagnetic Induction',
  desc:'Drag a magnet through a coil by changing its speed. EMF appears only while the flux is changing — and Lenz\'s law flips its sign as the magnet leaves.',
  params:[P('v','Magnet speed',0,200,5,60,'px/s'),P('N','Number of turns',10,400,10,100,''),P('B','Magnet strength',0.2,3,0.1,1,'T')],
  init:()=>({x:60,emf:0,trace:[]}),
  step(s,dt,p){
    s.x+=p.v*dt; if(s.x>W-40) s.x=40;
    const cx=W/2, sigma=60;
    const flux = x=> p.B*Math.exp(-((x-cx)**2)/(2*sigma*sigma));
    const dPhi = (flux(s.x+1)-flux(s.x-1))/2 * p.v;
    s.emf = -p.N*dPhi*0.4;
    s.trace.push(s.emf); if(s.trace.length>500) s.trace.shift();
  },
  draw(ctx,s,p){
    clear(ctx);
    const cx=W/2, cy=170;
    for(let i=0;i<8;i++){ ctx.strokeStyle=C.muted(); ctx.lineWidth=3;
      ctx.beginPath(); ctx.ellipse(cx-60+i*17,cy,10,50,0,0,7); ctx.stroke(); }
    text(ctx,`coil, N = ${p.N}`,cx,cy+75,C.muted(),12,'center');
    ctx.fillStyle=C.warn(); ctx.fillRect(s.x-30,cy-14,30,28);
    ctx.fillStyle=C.acc(); ctx.fillRect(s.x,cy-14,30,28);
    text(ctx,'N',s.x-15,cy+5,'#fff',13,'center'); text(ctx,'S',s.x+15,cy+5,'#fff',13,'center');
    line(ctx,60,H-90,W-60,H-90,C.line(),1);
    ctx.strokeStyle=C.acc2(); ctx.lineWidth=2; ctx.beginPath();
    s.trace.forEach((e,i)=>{ const X=60+i*(W-120)/500, Y=H-90-e*3;
      i?ctx.lineTo(X,Math.max(H-170,Math.min(H-10,Y))):ctx.moveTo(X,Y); });
    ctx.stroke();
    text(ctx,'induced EMF vs time',64,H-152,C.muted(),12);
  },
  read:(s,p)=>[['EMF',s.emf.toFixed(2)+' V (rel)'],['N',p.N],['note', Math.abs(s.emf)<0.05?'no flux change → no EMF':'flux changing']]
},

photoelectric:{
  title:'Photoelectric Effect',
  desc:'Below the threshold frequency nothing happens no matter how bright the light. Above it, electrons fly out instantly and brighter light means more of them, not faster ones.',
  params:[P('lam','Wavelength',200,700,10,400,'nm'),P('I','Intensity',1,10,1,5,''),
          P('phi','Work function',1.5,5,0.1,2.3,'eV')],
  init:()=>({es:[],t:0}),
  step(s,dt,p){
    s.t+=dt;
    const E=1240/p.lam, KE=E-p.phi;
    if(KE>0 && Math.random()<p.I*dt*3){
      s.es.push({x:300,y:120+Math.random()*210,v:60+KE*80});
    }
    s.es.forEach(e=>e.x+=e.v*dt);
    s.es=s.es.filter(e=>e.x<W);
  },
  draw(ctx,s,p){
    clear(ctx);
    const E=1240/p.lam, KE=E-p.phi;
    ctx.fillStyle=C.muted(); ctx.fillRect(280,100,22,250);
    text(ctx,'metal',291,370,C.muted(),12,'center');
    const hue = p.lam<420?280: p.lam<490?240: p.lam<570?120: p.lam<590?60: p.lam<620?30:0;
    ctx.strokeStyle=`hsl(${hue},85%,60%)`; ctx.lineWidth=2;
    for(let i=0;i<6;i++){
      const y=120+i*45;
      ctx.beginPath();
      for(let x=20;x<280;x+=3){ const yy=y+8*Math.sin((x/ p.lam)*60 + s.t*6); x===20?ctx.moveTo(x,yy):ctx.lineTo(x,yy); }
      ctx.stroke();
    }
    s.es.forEach(e=> circle(ctx,e.x,e.y,4,C.acc2()));
    text(ctx,`photon energy = ${E.toFixed(2)} eV   work function = ${p.phi.toFixed(2)} eV`,16,32,C.ink(),14);
    text(ctx, KE>0? `KE_max = ${KE.toFixed(2)} eV → emission`:'below threshold → NO emission at any brightness',
         16,56, KE>0?C.good():C.warn(),14);
  },
  read(s,p){
    const E=1240/p.lam, KE=E-p.phi;
    return [['photon E',E.toFixed(3)+' eV'],['KE max',KE>0?KE.toFixed(3)+' eV':'none'],
            ['threshold λ',(1240/p.phi).toFixed(0)+' nm'],['threshold f',(p.phi*1.6e-19/6.63e-34).toExponential(2)+' Hz']];
  }
},

decay:{
  title:'Radioactive Decay',
  desc:'Each nucleus decays at random, yet the population halves on a perfect schedule. Watch the count fall and the half-life markers line up.',
  params:[P('N0','Starting nuclei',100,2000,50,800,''),P('th','Half-life',0.5,8,0.5,3,'s')],
  init:(p)=>({N:p.N0,t:0,hist:[],nuc:[]}),
  step(s,dt,p){
    if(s.nuc.length===0){ for(let i=0;i<Math.min(600,p.N0);i++) s.nuc.push({x:Math.random(),y:Math.random(),alive:true}); }
    const lam=Math.LN2/p.th;
    const pd=1-Math.exp(-lam*dt);
    let decayed=0;
    s.nuc.forEach(n=>{ if(n.alive && Math.random()<pd){ n.alive=false; decayed++; } });
    s.N *= Math.exp(-lam*dt);
    s.t+=dt; s.hist.push([s.t,s.N]);
    if(s.t> p.th*6){ s.t=0; s.N=p.N0; s.hist=[]; s.nuc=[]; }
  },
  draw(ctx,s,p){
    clear(ctx);
    s.nuc.forEach(n=> circle(ctx, 20+n.x*330, 30+n.y*200, 3, n.alive?C.acc():C.line()));
    text(ctx,'blue = undecayed',20,250,C.muted(),12);
    const gx=400, gy=40, gw=370, gh=280;
    ctx.strokeStyle=C.line(); ctx.strokeRect(gx,gy,gw,gh);
    ctx.strokeStyle=C.acc2(); ctx.lineWidth=2; ctx.beginPath();
    s.hist.forEach((h,i)=>{ const X=gx+(h[0]/(p.th*6))*gw, Y=gy+gh-(h[1]/p.N0)*gh; i?ctx.lineTo(X,Y):ctx.moveTo(X,Y); });
    ctx.stroke();
    ctx.setLineDash([4,4]);
    for(let n=1;n<=6;n++){
      const X=gx+(n*p.th/(p.th*6))*gw, Y=gy+gh-(Math.pow(0.5,n))*gh;
      if(X<=gx+gw){ line(ctx,X,gy,X,gy+gh,C.line(),1); circle(ctx,X,Y,3,C.warn()); }
    }
    ctx.setLineDash([]);
    text(ctx,'N vs t, dots at each half-life',gx+4,gy-8,C.muted(),12);
    text(ctx,`N = ${Math.round(s.N)}   t = ${s.t.toFixed(1)} s`,gx+4,gy+gh+20,C.ink(),13);
  },
  read(s,p){
    const lam=Math.LN2/p.th;
    return [['λ',lam.toFixed(4)+' s⁻¹'],['N now',Math.round(s.N)],
            ['activity',(lam*s.N).toFixed(1)+' Bq'],['half-lives elapsed',(s.t/p.th).toFixed(2)]];
  }
}
};
