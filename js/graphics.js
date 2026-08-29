/* Inline animated SVG art. Self-contained (SMIL + CSS vars), so nothing depends on
   an external image host, nothing breaks offline, and every drawing follows the theme. */
const ART = {};
const svg = (id, inner, vb='0 0 400 200') =>
  ART[id] = `<svg class="art" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;

const GROUND = `<rect x="0" y="170" width="400" height="30" fill="var(--line)"/>`;
const SKY = `<rect width="400" height="200" fill="var(--panel-2)"/>`;

svg('measure', `${SKY}
  <rect x="40" y="80" width="320" height="34" rx="4" fill="var(--panel)" stroke="var(--line)"/>
  ${[...Array(17)].map((_,i)=>`<line x1="${40+i*20}" y1="80" x2="${40+i*20}" y2="${i%5?92:104}" stroke="var(--muted)" stroke-width="2"/>`).join('')}
  <g><rect x="60" y="46" width="90" height="26" rx="6" fill="var(--accent)"/>
    <animateTransform attributeName="transform" type="translate" values="0 0; 150 0; 0 0" dur="6s" repeatCount="indefinite"/></g>
  <text x="200" y="150" text-anchor="middle" font-size="15" fill="var(--muted)">every measurement = number + unit</text>`);

svg('vector', `${SKY}
  <defs><marker id="ah" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
    <path d="M0,0 L9,4.5 L0,9 z" fill="context-stroke"/></marker></defs>
  <line x1="60" y1="150" x2="220" y2="150" stroke="var(--accent)" stroke-width="4" marker-end="url(#ah)"/>
  <line x1="220" y1="150" x2="220" y2="60" stroke="var(--accent-2)" stroke-width="4" marker-end="url(#ah)"/>
  <line x1="60" y1="150" x2="220" y2="60" stroke="var(--warn)" stroke-width="4" marker-end="url(#ah)" stroke-dasharray="300" >
    <animate attributeName="stroke-dashoffset" values="300;0" dur="2.5s" repeatCount="indefinite"/></line>
  <text x="140" y="172" font-size="14" fill="var(--accent)">3 steps east</text>
  <text x="230" y="105" font-size="14" fill="var(--accent-2)">4 north</text>
  <text x="90" y="90" font-size="14" fill="var(--warn)">= 5 diagonal</text>`);

svg('speed', `${SKY}${GROUND}
  <g><circle cx="40" cy="150" r="14" fill="var(--accent)"/>
    <animateTransform attributeName="transform" type="translate" values="0 0;300 0" dur="3s" repeatCount="indefinite"/></g>
  <g><circle cx="40" cy="110" r="14" fill="var(--warn)"/>
    <animateTransform attributeName="transform" type="translate" values="0 0;300 0" dur="1.5s" repeatCount="indefinite"/></g>
  <text x="360" y="155" text-anchor="end" font-size="13" fill="var(--muted)">slow</text>
  <text x="360" y="115" text-anchor="end" font-size="13" fill="var(--muted)">twice as fast</text>`);

svg('graphs', `${SKY}
  <line x1="50" y1="170" x2="370" y2="170" stroke="var(--muted)" stroke-width="2"/>
  <line x1="50" y1="20" x2="50" y2="170" stroke="var(--muted)" stroke-width="2"/>
  <path d="M50,170 L370,40" stroke="var(--accent)" stroke-width="4" fill="none" stroke-dasharray="400">
    <animate attributeName="stroke-dashoffset" values="400;0" dur="3s" repeatCount="indefinite"/></path>
  <text x="200" y="192" text-anchor="middle" font-size="13" fill="var(--muted)">time →</text>
  <text x="150" y="80" font-size="14" fill="var(--accent)">steeper line = faster</text>`);

svg('projectile', `${SKY}${GROUND}
  <path id="arc" d="M40,170 Q200,-10 360,170" stroke="var(--line)" stroke-width="3" fill="none" stroke-dasharray="6 6"/>
  <circle r="10" fill="var(--warn)"><animateMotion dur="3s" repeatCount="indefinite"
    path="M40,170 Q200,-10 360,170"/></circle>
  <text x="200" y="196" text-anchor="middle" font-size="13" fill="var(--muted)">forward at steady speed · falling all the while</text>`);

svg('forces', `${SKY}
  <rect x="150" y="80" width="100" height="60" rx="8" fill="var(--accent)"/>
  <line x1="250" y1="110" x2="330" y2="110" stroke="var(--good)" stroke-width="5"/>
  <polygon points="330,102 350,110 330,118" fill="var(--good)"/>
  <line x1="150" y1="110" x2="80" y2="110" stroke="var(--warn)" stroke-width="5"/>
  <polygon points="80,102 60,110 80,118" fill="var(--warn)"/>
  <text x="300" y="96" font-size="13" fill="var(--good)">push</text>
  <text x="70" y="96" font-size="13" fill="var(--warn)">friction</text>
  <text x="200" y="175" text-anchor="middle" font-size="14" fill="var(--muted)">equal arrows = no change in motion</text>
  <animateTransform attributeName="transform" type="translate" values="0 0;6 0;0 0" dur="1.6s" repeatCount="indefinite"/>`);

svg('friction', `${SKY}
  <polygon points="30,170 330,170 330,60" fill="var(--line)"/>
  <g><rect x="-25" y="-18" width="50" height="36" rx="5" fill="var(--accent)" transform="rotate(-20)"/>
    <animateTransform attributeName="transform" type="translate" values="290 78; 120 138" dur="3s" repeatCount="indefinite"/></g>
  <text x="200" y="192" text-anchor="middle" font-size="13" fill="var(--muted)">steeper slope wins over grip → it slides</text>`);

svg('circular', `${SKY}
  <circle cx="200" cy="100" r="70" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="5 5"/>
  <circle cx="200" cy="100" r="5" fill="var(--muted)"/>
  <g><line x1="200" y1="100" x2="270" y2="100" stroke="var(--muted)" stroke-width="2"/>
     <circle cx="270" cy="100" r="12" fill="var(--accent)"/>
     <line x1="264" y1="100" x2="232" y2="100" stroke="var(--warn)" stroke-width="4"/>
     <polygon points="232,94 222,100 232,106" fill="var(--warn)"/>
     <animateTransform attributeName="transform" type="rotate" values="0 200 100;360 200 100" dur="3s" repeatCount="indefinite"/></g>
  <text x="200" y="190" text-anchor="middle" font-size="13" fill="var(--muted)">something must pull it inward, always</text>`);

svg('orbit', `<rect width="400" height="200" fill="#0b0f1c"/>
  ${[...Array(30)].map((_,i)=>`<circle cx="${(i*67)%400}" cy="${(i*43)%200}" r="1.2" fill="#5a6488"/>`).join('')}
  <circle cx="200" cy="100" r="26" fill="#4a6cff"/>
  <ellipse cx="200" cy="100" rx="130" ry="60" fill="none" stroke="#7b8cff55" stroke-width="2"/>
  <circle r="7" fill="#2ee0cd"><animateMotion dur="5s" repeatCount="indefinite"
    path="M330,100 A130,60 0 1,1 70,100 A130,60 0 1,1 330,100"/></circle>
  <text x="200" y="190" text-anchor="middle" font-size="13" fill="#9aa3bd">falling forever, missing the ground</text>`);

svg('energy', `${SKY}
  <path d="M30,60 Q120,60 200,150 T370,150" stroke="var(--line)" stroke-width="6" fill="none"/>
  <circle r="12" fill="var(--accent)"><animateMotion dur="3s" repeatCount="indefinite"
    path="M30,48 Q120,48 200,138 T370,138"/></circle>
  <rect x="40" y="20" width="14" height="30" fill="var(--acc2, var(--accent-2))"/>
  <text x="60" y="35" font-size="12" fill="var(--muted)">stored high up</text>
  <text x="250" y="120" font-size="12" fill="var(--muted)">spent as speed low down</text>`);

svg('collision', `${SKY}
  <g><circle cx="90" cy="100" r="22" fill="var(--accent)">
    <animate attributeName="cx" values="90;170;90" dur="2.4s" repeatCount="indefinite"/></circle></g>
  <g><circle cx="290" cy="100" r="16" fill="var(--acc2, var(--accent-2))">
    <animate attributeName="cx" values="290;340;290" dur="2.4s" repeatCount="indefinite"/></circle></g>
  <text x="200" y="180" text-anchor="middle" font-size="13" fill="var(--muted)">the push each one feels is equal and opposite</text>`);

svg('spring', `${SKY}
  <line x1="60" y1="30" x2="340" y2="30" stroke="var(--line)" stroke-width="6"/>
  <g><path d="M200,30 l0,20 l-16,10 l32,10 l-32,10 l32,10 l-16,10" stroke="var(--muted)" stroke-width="3" fill="none"/>
     <rect x="180" y="100" width="40" height="30" rx="5" fill="var(--accent)"/>
     <animateTransform attributeName="transform" type="translate" values="0 -20;0 35;0 -20" dur="1.6s" repeatCount="indefinite"/></g>
  <text x="200" y="185" text-anchor="middle" font-size="13" fill="var(--muted)">pulled back harder the further it goes</text>`);

svg('wave', `${SKY}
  <path stroke="var(--accent)" stroke-width="4" fill="none"
    d="M0,100 C25,40 75,40 100,100 C125,160 175,160 200,100 C225,40 275,40 300,100 C325,160 375,160 400,100">
    <animateTransform attributeName="transform" type="translate" values="0 0;-200 0" dur="2.5s" repeatCount="indefinite"/></path>
  <circle cx="120" cy="100" r="8" fill="var(--warn)">
    <animate attributeName="cy" values="100;40;100;160;100" dur="2.5s" repeatCount="indefinite"/></circle>
  <text x="200" y="188" text-anchor="middle" font-size="13" fill="var(--muted)">the dot only bobs — the shape travels</text>`);

svg('standing', `${SKY}
  <path stroke="var(--accent)" stroke-width="4" fill="none" d="M40,100 C110,20 190,20 200,100 C210,180 290,180 360,100">
    <animate attributeName="d" dur="1.4s" repeatCount="indefinite"
      values="M40,100 C110,20 190,20 200,100 C210,180 290,180 360,100;
              M40,100 C110,180 190,180 200,100 C210,20 290,20 360,100;
              M40,100 C110,20 190,20 200,100 C210,180 290,180 360,100"/></path>
  <circle cx="40" cy="100" r="6" fill="var(--good)"/><circle cx="200" cy="100" r="6" fill="var(--good)"/>
  <circle cx="360" cy="100" r="6" fill="var(--good)"/>
  <text x="200" y="186" text-anchor="middle" font-size="13" fill="var(--muted)">green points never move — that is a node</text>`);

svg('doppler', `${SKY}
  ${[0,1,2,3].map(i=>`<circle cx="140" cy="100" r="20" fill="none" stroke="var(--accent)" stroke-width="2">
    <animate attributeName="r" values="10;150" dur="3s" begin="${i*0.75}s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0" dur="3s" begin="${i*0.75}s" repeatCount="indefinite"/></circle>`).join('')}
  <g><rect x="-24" y="-12" width="48" height="24" rx="5" fill="var(--warn)"/>
    <animateTransform attributeName="transform" type="translate" values="80 100;330 100" dur="3s" repeatCount="indefinite"/></g>
  <text x="200" y="188" text-anchor="middle" font-size="13" fill="var(--muted)">waves squash in front, stretch behind</text>`);

svg('lens', `${SKY}
  <line x1="0" y1="100" x2="400" y2="100" stroke="var(--muted)" stroke-width="1"/>
  <ellipse cx="200" cy="100" rx="12" ry="65" fill="var(--accent)" opacity=".65"/>
  ${[60,80,120,140].map(y=>`<path d="M20,${y} L200,${y} L340,${200-y}" stroke="var(--warn)" stroke-width="2" fill="none" opacity=".8"/>`).join('')}
  <circle cx="290" cy="100" r="5" fill="var(--good)"/>
  <text x="292" y="90" font-size="12" fill="var(--good)">focus</text>
  <text x="200" y="190" text-anchor="middle" font-size="13" fill="var(--muted)">glass bends light to one point</text>`);

svg('gas', `${SKY}
  <rect x="60" y="30" width="280" height="140" fill="none" stroke="var(--accent)" stroke-width="3"/>
  ${[...Array(14)].map((_,i)=>`<circle r="5" fill="var(--accent)">
    <animateMotion dur="${2+i%4}s" repeatCount="indefinite"
      path="M${80+i*18},${50+(i*23)%100} l${60-(i%3)*70},${40-(i%4)*30} l${-50+(i%2)*80},${-60+(i%3)*40} z"/></circle>`).join('')}
  <text x="200" y="192" text-anchor="middle" font-size="13" fill="var(--muted)">hotter = faster bouncing = more pressure</text>`);

svg('charge', `${SKY}
  <circle cx="120" cy="100" r="24" fill="var(--warn)"/><text x="120" y="107" text-anchor="middle" fill="#fff" font-size="20">+</text>
  <circle cx="280" cy="100" r="24" fill="var(--accent)"/><text x="280" y="107" text-anchor="middle" fill="#fff" font-size="20">−</text>
  ${[-40,0,40].map(dy=>`<path d="M146,${100+dy*0.4} Q200,${100+dy} 254,${100+dy*0.4}" stroke="var(--muted)" stroke-width="2" fill="none" stroke-dasharray="4 4">
    <animate attributeName="stroke-dashoffset" values="16;0" dur="1s" repeatCount="indefinite"/></path>`).join('')}
  <text x="200" y="180" text-anchor="middle" font-size="13" fill="var(--muted)">opposite charges pull together</text>`);

svg('circuit', `${SKY}
  <rect x="70" y="50" width="260" height="110" rx="10" fill="none" stroke="var(--ink)" stroke-width="4"/>
  <rect x="60" y="90" width="20" height="30" fill="var(--warn)"/>
  <rect x="180" y="40" width="46" height="20" fill="var(--accent)"/>
  <circle cx="200" cy="160" r="16" fill="#ffd650"><animate attributeName="opacity" values="1;.35;1" dur="1.6s" repeatCount="indefinite"/></circle>
  ${[...Array(6)].map((_,i)=>`<circle r="4" fill="var(--acc2, var(--accent-2))">
    <animateMotion dur="4s" begin="${i*0.66}s" repeatCount="indefinite"
      path="M70,160 L330,160 L330,50 L70,50 Z"/></circle>`).join('')}
  <text x="200" y="192" text-anchor="middle" font-size="13" fill="var(--muted)">charge goes round and round; energy is dropped off</text>`);

svg('magnet', `${SKY}
  <rect x="150" y="80" width="50" height="40" fill="var(--warn)"/><rect x="200" y="80" width="50" height="40" fill="var(--accent)"/>
  <text x="175" y="106" text-anchor="middle" fill="#fff" font-size="16">N</text>
  <text x="225" y="106" text-anchor="middle" fill="#fff" font-size="16">S</text>
  ${[30,60,90].map(r=>`<ellipse cx="200" cy="100" rx="${r+60}" ry="${r}" fill="none" stroke="var(--muted)" stroke-width="1.5" opacity=".6" stroke-dasharray="5 5">
    <animate attributeName="stroke-dashoffset" values="20;0" dur="1.5s" repeatCount="indefinite"/></ellipse>`).join('')}`);

svg('induction', `${SKY}
  ${[...Array(6)].map((_,i)=>`<ellipse cx="${160+i*16}" cy="100" rx="9" ry="45" fill="none" stroke="var(--muted)" stroke-width="3"/>`).join('')}
  <g><rect x="-24" y="-12" width="24" height="24" fill="var(--warn)"/><rect x="0" y="-12" width="24" height="24" fill="var(--accent)"/>
    <animateTransform attributeName="transform" type="translate" values="60 100;340 100;60 100" dur="4s" repeatCount="indefinite"/></g>
  <text x="200" y="186" text-anchor="middle" font-size="13" fill="var(--muted)">move the magnet →電 electricity appears</text>`);

svg('photon', `${SKY}
  <rect x="250" y="40" width="26" height="120" fill="var(--muted)"/>
  ${[70,100,130].map((y,i)=>`<circle r="6" fill="var(--warn)"><animateMotion dur="1.6s" begin="${i*0.4}s" repeatCount="indefinite" path="M20,${y} L246,${y}"/></circle>`).join('')}
  ${[80,120].map((y,i)=>`<circle r="5" fill="var(--acc2, var(--accent-2))"><animateMotion dur="1.6s" begin="${0.8+i*0.4}s" repeatCount="indefinite" path="M280,${y} L390,${y-20}"/></circle>`).join('')}
  <text x="200" y="190" text-anchor="middle" font-size="13" fill="var(--muted)">one packet of light knocks out one electron</text>`);

svg('atom', `${SKY}
  <circle cx="200" cy="100" r="16" fill="var(--warn)"/>
  ${[45,80].map((r,i)=>`<circle cx="200" cy="100" r="${r}" fill="none" stroke="var(--line)" stroke-width="2"/>
    <circle r="6" fill="var(--accent)"><animateMotion dur="${2+i}s" repeatCount="indefinite"
      path="M${200+r},100 A${r},${r} 0 1,1 ${200-r},100 A${r},${r} 0 1,1 ${200+r},100"/></circle>`).join('')}
  <text x="200" y="190" text-anchor="middle" font-size="13" fill="var(--muted)">electrons sit on fixed steps, never between</text>`);

svg('decay', `${SKY}
  ${[...Array(24)].map((_,i)=>`<circle cx="${60+(i%8)*40}" cy="${50+Math.floor(i/8)*40}" r="9" fill="var(--accent)">
    <animate attributeName="fill" values="var(--accent);var(--accent);var(--line)" dur="6s" begin="${(i*0.37)%6}s" repeatCount="indefinite"/></circle>`).join('')}
  <text x="200" y="190" text-anchor="middle" font-size="13" fill="var(--muted)">each one pops at random — half gone every half-life</text>`);

svg('relativity', `${SKY}
  <rect x="40" y="60" width="150" height="80" rx="10" fill="none" stroke="var(--muted)" stroke-width="3"/>
  <circle cx="115" cy="100" r="26" fill="none" stroke="var(--accent)" stroke-width="3"/>
  <line x1="115" y1="100" x2="115" y2="82" stroke="var(--accent)" stroke-width="3">
    <animateTransform attributeName="transform" type="rotate" values="0 115 100;360 115 100" dur="2s" repeatCount="indefinite"/></line>
  <rect x="215" y="60" width="150" height="80" rx="10" fill="none" stroke="var(--muted)" stroke-width="3"/>
  <circle cx="290" cy="100" r="26" fill="none" stroke="var(--warn)" stroke-width="3"/>
  <line x1="290" y1="100" x2="290" y2="82" stroke="var(--warn)" stroke-width="3">
    <animateTransform attributeName="transform" type="rotate" values="0 290 100;360 290 100" dur="5s" repeatCount="indefinite"/></line>
  <text x="115" y="168" text-anchor="middle" font-size="13" fill="var(--muted)">your clock</text>
  <text x="290" y="168" text-anchor="middle" font-size="13" fill="var(--muted)">a fast traveller's clock</text>`);

svg('heat', `${SKY}
  <rect x="60" y="60" width="120" height="90" rx="8" fill="var(--warn)" opacity=".8"/>
  <rect x="220" y="60" width="120" height="90" rx="8" fill="var(--accent)" opacity=".8"/>
  ${[80,105,130].map((y,i)=>`<circle r="6" fill="#fff"><animateMotion dur="2.5s" begin="${i*0.5}s" repeatCount="indefinite" path="M180,${y} L220,${y}"/></circle>`).join('')}
  <text x="120" y="175" text-anchor="middle" font-size="13" fill="var(--muted)">hot</text>
  <text x="280" y="175" text-anchor="middle" font-size="13" fill="var(--muted)">cold</text>
  <text x="200" y="40" text-anchor="middle" font-size="13" fill="var(--muted)">energy always flows this way, never back</text>`);

svg('thermo', `${SKY}
  <rect x="80" y="40" width="120" height="120" fill="none" stroke="var(--ink)" stroke-width="3"/>
  <rect x="83" y="43" width="114" height="40" fill="var(--accent)" opacity=".5">
    <animate attributeName="height" values="40;100;40" dur="4s" repeatCount="indefinite"/></rect>
  <rect x="80" y="30" width="120" height="12" fill="var(--muted)">
    <animate attributeName="y" values="30;90;30" dur="4s" repeatCount="indefinite"/></rect>
  <text x="290" y="90" text-anchor="middle" font-size="14" fill="var(--muted)">push the piston in</text>
  <text x="290" y="112" text-anchor="middle" font-size="14" fill="var(--muted)">→ the gas heats up</text>`);

svg('em', `${SKY}
  <path stroke="var(--accent)" stroke-width="3" fill="none" d="M20,100 C60,50 100,150 140,100 C180,50 220,150 260,100 C300,50 340,150 380,100">
    <animate attributeName="opacity" values="1;.4;1" dur="1.6s" repeatCount="indefinite"/></path>
  <path stroke="var(--warn)" stroke-width="3" fill="none" d="M20,100 C60,130 100,70 140,100 C180,130 220,70 260,100 C300,130 340,70 380,100">
    <animate attributeName="opacity" values=".4;1;.4" dur="1.6s" repeatCount="indefinite"/></path>
  <text x="200" y="180" text-anchor="middle" font-size="13" fill="var(--muted)">electric and magnetic, taking turns, at light speed</text>`);

svg('capacitor', `${SKY}
  <rect x="150" y="40" width="12" height="120" fill="var(--warn)"/>
  <rect x="238" y="40" width="12" height="120" fill="var(--accent)"/>
  ${[60,90,120,150].map((y,i)=>`<text x="140" y="${y}" font-size="16" fill="var(--warn)">+</text>
    <text x="256" y="${y}" font-size="16" fill="var(--accent)">−</text>`).join('')}
  <text x="200" y="188" text-anchor="middle" font-size="13" fill="var(--muted)">a bucket for charge — fills slowly, empties in a flash</text>`);

svg('units', `${SKY}
  ${['m','kg','s','A','K','mol','cd'].map((u,i)=>`<g>
    <rect x="${20+i*54}" y="70" width="46" height="46" rx="8" fill="var(--accent)" opacity=".85">
      <animate attributeName="opacity" values=".4;1;.4" dur="3s" begin="${i*0.4}s" repeatCount="indefinite"/></rect>
    <text x="${43+i*54}" y="99" text-anchor="middle" fill="#fff" font-size="15">${u}</text></g>`).join('')}
  <text x="200" y="150" text-anchor="middle" font-size="14" fill="var(--muted)">seven building blocks — everything else is made of these</text>`);

svg('welcome', `${SKY}
  <circle cx="80" cy="110" r="26" fill="var(--accent)"><animate attributeName="cy" values="110;70;110" dur="1.8s" repeatCount="indefinite"/></circle>
  <path d="M150,140 Q200,40 250,140" stroke="var(--warn)" stroke-width="3" fill="none" stroke-dasharray="4 4"/>
  <circle r="9" fill="var(--warn)"><animateMotion dur="2.2s" repeatCount="indefinite" path="M150,140 Q200,40 250,140"/></circle>
  <circle cx="330" cy="105" r="30" fill="none" stroke="var(--acc2, var(--accent-2))" stroke-width="3"/>
  <circle r="7" fill="var(--acc2, var(--accent-2))"><animateMotion dur="2.5s" repeatCount="indefinite"
    path="M360,105 A30,30 0 1,1 300,105 A30,30 0 1,1 360,105"/></circle>
  <text x="200" y="180" text-anchor="middle" font-size="14" fill="var(--muted)">falling · flying · circling — same three rules everywhere</text>`);

svg('brain', `${SKY}
  <rect x="40" y="120" width="60" height="50" rx="8" fill="var(--accent)"/>
  <rect x="130" y="95" width="60" height="75" rx="8" fill="var(--accent)" opacity=".85"/>
  <rect x="220" y="70" width="60" height="100" rx="8" fill="var(--accent)" opacity=".7"/>
  <rect x="310" y="45" width="60" height="125" rx="8" fill="var(--accent)" opacity=".55"/>
  <path d="M55,60 C120,40 200,150 350,30" stroke="var(--warn)" stroke-width="3" fill="none" stroke-dasharray="420">
    <animate attributeName="stroke-dashoffset" values="420;0" dur="3s" repeatCount="indefinite"/></path>
  <text x="200" y="192" text-anchor="middle" font-size="13" fill="var(--muted)">recall today, in 3 days, in a week — memory gets stronger each time</text>`);
