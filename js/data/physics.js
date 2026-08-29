/* PhysicsLab curriculum data.
   Structure: SUBJECTS -> units -> chapters.
   Adding another subject later = push another object into SUBJECTS with the same shape. */

const CH = (o) => o; // identity, keeps the literals readable

const UNIT_1 = {
  id: 'u1', title: 'Foundations of Physics', icon: '🧭',
  blurb: 'The language every later chapter is written in: units, measurement, uncertainty and vectors.',
  chapters: [
CH({
  id:'c1-units', title:'Quantities, Units and Scale', level:'foundation',
  summary:'Physics measures the world. Before any formula makes sense you need the seven base units, prefixes, and the habit of checking dimensions.',
  sections:[
    {h:'Why units come first',
     body:`A number without a unit is not a physical answer. "The car moved 30" is meaningless; 30 m, 30 km, 30 m/s and 30 m/s² describe four different worlds. Every quantity in physics is a <b>number × unit</b>, and the unit carries as much information as the number.`},
    {h:'The seven SI base units',
     body:`Everything else is built from these. Learn them once and you never have to memorise a derived unit again — you can rebuild it from the formula.
<table class="data"><tr><th>Quantity</th><th>Unit</th><th>Symbol</th></tr>
<tr><td>Length</td><td>metre</td><td>m</td></tr>
<tr><td>Mass</td><td>kilogram</td><td>kg</td></tr>
<tr><td>Time</td><td>second</td><td>s</td></tr>
<tr><td>Electric current</td><td>ampere</td><td>A</td></tr>
<tr><td>Temperature</td><td>kelvin</td><td>K</td></tr>
<tr><td>Amount of substance</td><td>mole</td><td>mol</td></tr>
<tr><td>Luminous intensity</td><td>candela</td><td>cd</td></tr></table>
Derived units are just combinations: 1 N = 1 kg·m/s², 1 J = 1 N·m = 1 kg·m²/s², 1 W = 1 J/s.`},
    {h:'Prefixes and scientific notation',
     body:`Physics spans 10⁻¹⁵ m (a nucleus) to 10²⁶ m (the observable universe). Instead of writing zeros, use powers of ten and prefixes: n (10⁻⁹), µ (10⁻⁶), m (10⁻³), k (10³), M (10⁶), G (10⁹).<br>
Rule for calculations: convert everything to base SI units <i>first</i>, do the arithmetic, then convert the answer back if you want friendlier numbers.`},
    {h:'Dimensional analysis — your free error checker',
     body:`Any equation must have the same dimensions on both sides. Test <span class="formula" style="display:inline">v = u + at</span>: left is m/s; right is m/s + (m/s²)(s) = m/s + m/s. ✅<br>
If you ever write <i>v = u + at²</i>, dimensions give m/s vs m — instantly wrong, no marking scheme required. Use this on every formula you half-remember in an exam.`}
  ],
  formulas:[
    {f:'1 N = 1 kg·m·s⁻²', d:'newton, the derived unit of force'},
    {f:'1 J = 1 N·m = 1 kg·m²·s⁻²', d:'joule, the unit of energy'},
    {f:'[LHS] = [RHS]', d:'dimensional consistency — always true for a correct equation'}
  ],
  example:{title:'Check a formula you are unsure about',
    problem:'A student writes the period of a pendulum as T = 2π√(L·g). Is it possible?',
    steps:['Dimensions of L·g = m × m/s² = m²/s².','Square root gives m/s — that is a speed, not a time.','So the formula is wrong. The correct form must divide: T = 2π√(L/g), whose square root gives √(s²) = s. ✅']},
  realWorld:[
    'The 1999 Mars Climate Orbiter burned up because one team used pound-force·seconds and another used newton·seconds. A $327M unit-conversion error.',
    'Medication dosing errors are dominated by mg/µg and mL/L confusion — the same skill you practise here.',
    'Fuel loading on Air Canada Flight 143 (the "Gimli Glider") mixed pounds and kilograms; the plane ran out of fuel mid-flight.'
  ],
  videos:[{t:'SI units explained', q:'SI base units explained physics'},{t:'Dimensional analysis', q:'dimensional analysis physics tutorial'}],
  terms:['SI unit','derived unit','prefix','dimension','order of magnitude']
}),
CH({
  id:'c1-measure', title:'Measurement, Errors and Uncertainty', level:'y11',
  summary:'Every measurement has a range, not a value. Learn precision vs accuracy, significant figures and how uncertainties travel through a calculation.',
  sections:[
    {h:'Accuracy vs precision',
     body:`<b>Accuracy</b> = how close to the true value. <b>Precision</b> = how tightly repeated readings cluster. A miscalibrated digital balance is precise (same reading every time) but inaccurate (wrong every time). You fix accuracy by calibration, precision by better instruments and technique.`},
    {h:'Types of error',
     body:`<ul class="clean">
<li><b>Random error</b> — scatter from reaction time, turbulence, reading judgement. Reduce by repeating and averaging.</li>
<li><b>Systematic error</b> — a consistent offset: zero error on a ruler, a stopwatch that runs slow. Averaging does <i>not</i> help; you must find and remove the cause.</li>
<li><b>Parallax error</b> — reading a scale from an angle. Always read at eye level.</li></ul>`},
    {h:'Significant figures',
     body:`Your answer cannot be more precise than your worst measurement. If you measure 2.1 s and 5.34 m, the speed is 2.5 m/s (2 s.f.), not 2.542857 m/s. Rules: multiply/divide → keep the fewest significant figures of the inputs; add/subtract → keep the fewest decimal places.`},
    {h:'Propagating uncertainty',
     body:`For a value written as x ± Δx, the fractional uncertainty is Δx/x.<br>
• Adding or subtracting: add the <i>absolute</i> uncertainties.<br>
• Multiplying or dividing: add the <i>fractional</i> uncertainties.<br>
• Raising to a power n: multiply the fractional uncertainty by n.<br>
That last rule is why squaring a measured value doubles its relative uncertainty — measure lengths that get squared very carefully.`}
  ],
  formulas:[
    {f:'percentage uncertainty = (Δx / x) × 100%', d:'relative size of the error'},
    {f:'z = x ± y  ⟹  Δz = Δx + Δy', d:'absolute uncertainties add'},
    {f:'z = x·y or x/y  ⟹  Δz/z = Δx/x + Δy/y', d:'fractional uncertainties add'},
    {f:'z = xⁿ  ⟹  Δz/z = n·(Δx/x)', d:'powers multiply the fractional uncertainty'}
  ],
  example:{title:'Density of a cube',
    problem:'A cube has side 2.00 ± 0.02 cm and mass 64.0 ± 0.5 g. Find the density with its uncertainty.',
    steps:['Volume = L³ = 8.00 cm³. Fractional uncertainty in L is 0.02/2.00 = 1.0%, so in L³ it is 3 × 1.0% = 3.0%.','Density = 64.0 / 8.00 = 8.00 g/cm³.','Fractional uncertainty in mass = 0.5/64.0 = 0.78%.','Total = 3.0% + 0.78% ≈ 3.8%, i.e. 0.30 g/cm³.','Answer: ρ = 8.0 ± 0.3 g/cm³.']},
  realWorld:[
    'Every result from CERN is quoted with error bars; the Higgs boson was only announced when the signal reached 5σ — a 1-in-3.5-million chance of being random noise.',
    'GPS positioning quotes a horizontal accuracy figure; your phone draws that as the blue circle around your location dot.',
    'Clinical trials report confidence intervals for exactly the same reason: a number without a range is not evidence.'
  ],
  videos:[{t:'Uncertainty and error analysis', q:'uncertainty error analysis physics A level'},{t:'Significant figures', q:'significant figures rules physics'}],
  terms:['random error','systematic error','parallax','significant figures','uncertainty propagation']
}),
CH({
  id:'c1-vectors', title:'Vectors and Scalars', level:'y11', sim:'vectors',
  summary:'Direction changes everything. Add vectors head-to-tail, resolve them into components, and most of mechanics becomes arithmetic.',
  sections:[
    {h:'The distinction',
     body:`A <b>scalar</b> has size only: mass, time, temperature, energy, speed, distance. A <b>vector</b> has size <i>and</i> direction: displacement, velocity, acceleration, force, momentum, field strength.<br>
Walk 3 m east then 4 m west: distance travelled 7 m (scalar), displacement 1 m east (vector). Walk a full lap of a track and your displacement is zero while your distance is 400 m.`},
    {h:'Adding vectors',
     body:`Place them head-to-tail; the resultant runs from the first tail to the last head. For two perpendicular vectors use Pythagoras and tangent:
R = √(A² + B²), θ = tan⁻¹(B/A). For any other angle, resolve into components first — that method never fails.`},
    {h:'Resolving into components',
     body:`Any vector of magnitude F at angle θ to the x-axis splits into
F<sub>x</sub> = F cos θ and F<sub>y</sub> = F sin θ.
Components along perpendicular axes are independent: horizontal forces never affect vertical motion. This single fact is what makes projectile motion solvable.`},
    {h:'Choosing your axes',
     body:`You may point the axes anywhere. On an inclined plane, tilt them so x runs down the slope and y is perpendicular to it — then the acceleration has only one component and the algebra collapses. Choosing good axes is the most under-taught trick in mechanics.`}
  ],
  formulas:[
    {f:'R = √(Ax² + Ay²)', d:'magnitude from components'},
    {f:'θ = tan⁻¹(Ay / Ax)', d:'direction from components'},
    {f:'Ax = A cos θ,  Ay = A sin θ', d:'components from magnitude and direction'}
  ],
  example:{title:'Two ropes pulling a crate',
    problem:'Rope A pulls 60 N due east; rope B pulls 80 N due north. Find the resultant.',
    steps:['They are perpendicular, so R = √(60² + 80²) = √(3600 + 6400) = √10000 = 100 N.','θ = tan⁻¹(80/60) = 53.1° north of east.','Resultant: 100 N at 53° N of E. (The 3-4-5 triangle appears constantly in exams — recognise it.)']},
  realWorld:[
    'A plane heading north at 200 km/h in a 50 km/h crosswind actually travels along the vector sum — pilots call the correction the "crab angle".',
    'A river crossing: your boat velocity plus the current velocity determines where you land, which is why you aim upstream.',
    'Suspension bridge cables: the vertical components support the deck, the horizontal components pull the towers inward and must cancel.'
  ],
  videos:[{t:'Vectors and scalars', q:'vectors and scalars physics introduction'},{t:'Resolving vectors into components', q:'resolving vectors components physics'}],
  terms:['scalar','vector','resultant','component','displacement']
})
]};

const UNIT_2 = {
  id:'u2', title:'Kinematics — Describing Motion', icon:'🏃',
  blurb:'Position, velocity, acceleration and the graphs that tie them together. No forces yet — just motion.',
  chapters:[
CH({
  id:'c2-linear', title:'Motion in a Straight Line', level:'y11', sim:'kinematics',
  summary:'The four SUVAT equations solve any constant-acceleration problem. Learn which one to reach for by listing what you know.',
  sections:[
    {h:'The five quantities',
     body:`Every constant-acceleration problem involves s (displacement), u (initial velocity), v (final velocity), a (acceleration) and t (time). Each equation contains four of the five. <b>Write down the three you know, circle the one you want — that tells you the equation.</b>`},
    {h:'Velocity vs speed, and the sign convention',
     body:`Velocity is displacement per unit time and can be negative; speed is its magnitude. Pick a positive direction at the start of the problem and stick to it. Falling objects with "up positive" have a = −9.81 m/s²; the minus sign is not optional and is where most lost marks come from.`},
    {h:'Free fall',
     body:`Near Earth's surface, ignoring air resistance, every object accelerates downward at g ≈ 9.81 m/s² regardless of mass. A hammer and a feather land together in a vacuum — Apollo 15 did the experiment on the Moon. Air resistance, not gravity, is what usually separates them.`}
  ],
  formulas:[
    {f:'v = u + a·t', d:'no s'},
    {f:'s = u·t + ½·a·t²', d:'no v'},
    {f:'v² = u² + 2·a·s', d:'no t — the one everyone forgets'},
    {f:'s = ½(u + v)·t', d:'no a'}
  ],
  example:{title:'Braking distance',
    problem:'A car at 20 m/s brakes at 5 m/s². How far does it travel before stopping?',
    steps:['Known: u = 20, v = 0, a = −5. Want: s. No t involved → use v² = u² + 2as.','0 = 400 + 2(−5)s → 10s = 400 → s = 40 m.','Note: doubling the speed to 40 m/s gives s = 160 m — four times the distance, because s ∝ u². That is the whole argument for speed limits.']},
  realWorld:[
    'Road stopping-distance tables in every driving handbook are v²/(2a) plus a reaction-time term.',
    'Aircraft carrier arrestor cables must decelerate a 24 000 kg jet from 70 m/s in about 100 m.',
    'Elevator design limits acceleration to ~1 m/s² so passengers do not feel unwell.'
  ],
  videos:[{t:'SUVAT equations', q:'suvat equations of motion physics'},{t:'Free fall and g', q:'free fall acceleration due to gravity experiment'}],
  terms:['displacement','velocity','acceleration','SUVAT','free fall']
}),
CH({
  id:'c2-graphs', title:'Motion Graphs', level:'y11', sim:'kinematics',
  summary:'Gradient and area turn one graph into another. Read graphs fluently and you can solve motion problems with no algebra at all.',
  sections:[
    {h:'The two operations',
     body:`<b>Gradient</b> of displacement–time = velocity. <b>Gradient</b> of velocity–time = acceleration.<br>
<b>Area</b> under velocity–time = displacement. <b>Area</b> under acceleration–time = change in velocity.<br>
Going down the chain you differentiate (gradient); going up you integrate (area).`},
    {h:'Reading shapes',
     body:`A curved displacement–time graph means changing velocity. A horizontal velocity–time line means constant velocity and <i>zero</i> acceleration — not zero motion. A velocity–time line crossing zero means the object reversed direction; area below the axis is negative displacement.`},
    {h:'Terminal velocity on a graph',
     body:`A skydiver's velocity–time graph starts steep (a = g), curves as drag grows, and flattens at terminal velocity where drag equals weight. The gradient falling to zero <i>is</i> the statement "net force reached zero".`}
  ],
  formulas:[
    {f:'v = ds/dt', d:'gradient of displacement–time'},
    {f:'a = dv/dt', d:'gradient of velocity–time'},
    {f:'s = ∫v dt = area under v–t', d:'area gives displacement'}
  ],
  example:{title:'Trapezium area',
    problem:'A train accelerates from rest to 30 m/s in 20 s, holds it for 60 s, then brakes to rest in 40 s. Total distance?',
    steps:['Split the v–t graph into triangle + rectangle + triangle.','Triangle 1: ½ × 20 × 30 = 300 m.','Rectangle: 60 × 30 = 1800 m.','Triangle 2: ½ × 40 × 30 = 600 m.','Total = 2700 m = 2.7 km.']},
  realWorld:[
    'Fitness watches integrate accelerometer data to estimate distance — area under a curve, done 100 times a second.',
    'Black-box flight recorders are read as graph traces; investigators recover the whole flight profile by taking gradients.',
    'Car magazines quote 0–100 km/h times, which is just the gradient of the v–t line.'
  ],
  videos:[{t:'Motion graphs explained', q:'displacement velocity acceleration graphs physics'},{t:'Area under velocity time graph', q:'area under velocity time graph displacement'}],
  terms:['gradient','area under curve','terminal velocity','tangent']
}),
CH({
  id:'c2-projectile', title:'Projectile Motion', level:'y11', sim:'projectile',
  summary:'Two independent one-dimensional problems wearing a trench coat: constant velocity horizontally, free fall vertically.',
  sections:[
    {h:'The key idea: independence',
     body:`Gravity acts only vertically, so it never changes the horizontal velocity. Horizontally: a = 0, so x = u<sub>x</sub>t. Vertically: a = −g and full SUVAT applies. Solve the two separately and <b>time is the only quantity they share</b>.`},
    {h:'Launch at an angle',
     body:`Split the launch speed u at angle θ: u<sub>x</sub> = u cos θ, u<sub>y</sub> = u sin θ. At the top of the flight, v<sub>y</sub> = 0 but v<sub>x</sub> is unchanged — the projectile is still moving. On level ground, flight time = 2u sin θ / g and range R = u² sin 2θ / g, which is maximum at θ = 45°.`},
    {h:'Complementary angles',
     body:`Because sin 2θ = sin(180° − 2θ), launch angles of 30° and 60° give the <i>same range</i> with different flight times and heights. Artillery calls the two solutions the low and high trajectory.`}
  ],
  formulas:[
    {f:'x = u·cosθ·t', d:'horizontal: constant velocity'},
    {f:'y = u·sinθ·t − ½·g·t²', d:'vertical: free fall'},
    {f:'R = u²·sin(2θ) / g', d:'range on level ground'},
    {f:'H = u²·sin²θ / (2g)', d:'maximum height'}
  ],
  example:{title:'Ball off a cliff',
    problem:'A ball is thrown horizontally at 15 m/s from a 20 m cliff. How far from the base does it land?',
    steps:['Vertical: 20 = ½(9.81)t² → t² = 4.077 → t = 2.02 s.','Horizontal: x = 15 × 2.02 = 30.3 m.','The horizontal speed never entered the time calculation — that is the independence principle doing the work.']},
  realWorld:[
    'Basketball free throws: the optimum release angle is about 52°, not 45°, because the hoop is above release height.',
    'Long jumpers take off near 20° because a human cannot generate a fast run-up and a 45° launch at the same time.',
    'Water fountains and irrigation sprinklers are shaped to the parabolic envelope of all possible launch angles.'
  ],
  videos:[{t:'Projectile motion', q:'projectile motion physics explained'},{t:'Horizontal and vertical independence', q:'projectile independence horizontal vertical motion demo'}],
  terms:['projectile','trajectory','range','independence of components','parabola']
})
]};

const UNIT_3 = {
  id:'u3', title:'Dynamics — Forces and Newton', icon:'⚙️',
  blurb:'Why motion changes. Newton\'s three laws, friction, circular motion and universal gravitation.',
  chapters:[
CH({
  id:'c3-newton', title:"Newton's Three Laws", level:'y11', sim:'incline',
  summary:'Force is not what keeps things moving — it is what changes motion. Free-body diagrams make every problem tractable.',
  sections:[
    {h:'First law — inertia',
     body:`An object continues at rest or at constant velocity unless a <b>net</b> external force acts. Constant velocity needs zero net force, not zero force. A car cruising at 100 km/h has a large engine thrust exactly cancelled by drag and friction.`},
    {h:'Second law — F = ma',
     body:`Net force = mass × acceleration, and acceleration is always in the direction of the net force. Written more generally, F = dp/dt: force is the rate of change of momentum, which is the version that still works when mass changes (rockets).`},
    {h:'Third law — action and reaction',
     body:`If A pushes B with force F, B pushes A with force −F. The pair acts on <b>different objects</b>, which is why they never cancel. You walk because you push the Earth backwards and it pushes you forwards. A book on a table: weight and normal force are <i>not</i> a third-law pair — both act on the book, they are a first-law balance.`},
    {h:'Free-body diagrams',
     body:`Draw the object as a dot. Draw every force acting <i>on</i> it as an arrow leaving the dot: weight (always mg, down), normal (perpendicular to surface), friction (along surface, opposing relative motion), tension, applied force, drag. Then apply ΣF = ma along each axis. Do this every time and force problems stop being guesswork.`}
  ],
  formulas:[
    {f:'ΣF = m·a', d:"Newton's second law"},
    {f:'W = m·g', d:'weight — a force, measured in newtons'},
    {f:'F_AB = −F_BA', d:'third law pair, on two different bodies'}
  ],
  example:{title:'Lift on a scale',
    problem:'A 70 kg person stands on a scale in a lift accelerating upward at 2 m/s². What does the scale read?',
    steps:['Forces on the person: normal force N up, weight mg = 686 N down.','ΣF = ma → N − 686 = 70 × 2 = 140.','N = 826 N. The scale reads the normal force, so it shows about 84 kg-equivalent.','In free fall (a = −g) N = 0 — that is weightlessness, and why astronauts float in orbit even though gravity is still strong there.']},
  realWorld:[
    'Seatbelts and airbags exist because of the first law: in a crash the car stops, you do not.',
    'Rocket launch is pure third law — exhaust pushed down, rocket pushed up; no air to "push against" required.',
    'Headrests prevent whiplash: the seat accelerates your torso but not your head, until the neck supplies the force.'
  ],
  videos:[{t:"Newton's laws", q:"Newton's three laws of motion explained"},{t:'Free-body diagrams', q:'free body diagram physics tutorial'}],
  terms:['inertia','net force','free-body diagram','normal force','action-reaction pair']
}),
CH({
  id:'c3-friction', title:'Friction and Inclined Planes', level:'y11', sim:'incline',
  summary:'Real surfaces resist. Static vs kinetic friction, the coefficient µ, and the standard inclined-plane analysis.',
  sections:[
    {h:'Static and kinetic friction',
     body:`Static friction adjusts itself to prevent sliding, up to a maximum f<sub>s,max</sub> = µ<sub>s</sub>N. Once sliding begins, kinetic friction f<sub>k</sub> = µ<sub>k</sub>N acts, and µ<sub>k</sub> < µ<sub>s</sub> — which is why a stuck box lurches when it finally moves.`},
    {h:'It depends on N, not on area',
     body:`Friction is proportional to the normal force, not the contact area (to a good approximation for rigid surfaces). Pushing down on a box makes it harder to slide; a wider box of the same weight is not harder. Racing slicks break this rule because rubber deforms and adds adhesion.`},
    {h:'The inclined plane',
     body:`Tilt your axes with the slope. The weight mg splits into mg sin θ down the slope and mg cos θ into it. So N = mg cos θ and the driving force is mg sin θ.<br>
Sliding begins when mg sin θ > µ<sub>s</sub> mg cos θ, i.e. when <b>tan θ > µ<sub>s</sub></b> — the mass cancels entirely. Measuring the tipping angle is the standard lab method for finding µ.`}
  ],
  formulas:[
    {f:'f = µ·N', d:'friction force, µ dimensionless'},
    {f:'N = m·g·cosθ', d:'on a slope of angle θ'},
    {f:'a = g(sinθ − µ·cosθ)', d:'acceleration down a rough slope'},
    {f:'tanθ_crit = µ_s', d:'angle at which sliding starts'}
  ],
  example:{title:'Block on a rough ramp',
    problem:'A 5 kg block sits on a 30° ramp with µk = 0.20. Find its acceleration once it slides.',
    steps:['a = g(sin30° − 0.20·cos30°) = 9.81(0.500 − 0.173).','a = 9.81 × 0.327 = 3.21 m/s² down the slope.','Mass never appeared — every block on that ramp accelerates identically.']},
  realWorld:[
    'ABS brakes pump the pads to keep tyres in the static-friction regime, where grip is highest; a locked, skidding wheel drops to the lower kinetic value.',
    'Wheelchair ramp codes cap the gradient near 1:12 so the required force stays manageable.',
    'Avalanche forecasting is a friction-on-a-slope problem with a snow layer as the sliding interface.'
  ],
  videos:[{t:'Friction explained', q:'static and kinetic friction physics'},{t:'Inclined plane problems', q:'inclined plane friction physics problem'}],
  terms:['static friction','kinetic friction','coefficient of friction','normal force','critical angle']
}),
CH({
  id:'c3-circular', title:'Circular Motion', level:'y12', sim:'circular',
  summary:'Moving in a circle means accelerating even at constant speed, because the direction of velocity keeps changing.',
  sections:[
    {h:'Centripetal acceleration',
     body:`Velocity is a vector; turning changes it, so there is an acceleration even when the speedometer is steady. It points to the centre and has magnitude a = v²/r = ω²r, where ω = v/r is the angular velocity in rad/s.`},
    {h:'There is no centrifugal force',
     body:`The outward push you feel on a roundabout is your inertia — your body continuing in a straight line while the seat forces you around. In an inertial frame, only the inward (centripetal) force is real. Naming the required inward force correctly (tension, friction, gravity, normal force) is the whole skill.`},
    {h:'Standard situations',
     body:`<ul class="clean">
<li>Car on a flat bend: friction supplies mv²/r, so v<sub>max</sub> = √(µgr).</li>
<li>Banked track: the horizontal component of N supplies it — tan θ = v²/(rg), no friction needed at the design speed.</li>
<li>Vertical loop: at the top, mg + N = mv²/r; the minimum speed to keep contact (N = 0) is v = √(gr).</li>
<li>Satellite: gravity is the centripetal force.</li></ul>`}
  ],
  formulas:[
    {f:'a_c = v²/r = ω²·r', d:'centripetal acceleration, directed inward'},
    {f:'F_c = m·v²/r', d:'required inward net force'},
    {f:'ω = 2π/T = 2πf', d:'angular velocity'},
    {f:'v_max = √(µ·g·r)', d:'fastest safe speed on a flat bend'}
  ],
  example:{title:'Loop-the-loop',
    problem:'What is the minimum speed at the top of a 10 m radius loop for a cart to keep contact with the track?',
    steps:['At minimum speed the track force N = 0, so gravity alone supplies the centripetal force.','mg = mv²/r → v = √(gr) = √(9.81 × 10).','v = 9.9 m/s ≈ 36 km/h. Any slower and the cart leaves the track.']},
  realWorld:[
    'Velodrome bankings reach 45° so riders need no sideways friction at racing speed.',
    'A centrifuge separates blood at ~3000 g by making r small and ω enormous.',
    'Washing machine spin cycles: the drum wall supplies the centripetal force to the clothes; water has no wall, so it exits through the holes in a straight line.'
  ],
  videos:[{t:'Circular motion basics', q:'uniform circular motion centripetal force physics'},{t:'Banked curves', q:'banked curve physics problem'}],
  terms:['centripetal','angular velocity','period','banking','radian']
}),
CH({
  id:'c3-gravity', title:'Universal Gravitation and Orbits', level:'y12', sim:'orbit',
  summary:'One inverse-square law explains falling apples, the Moon, satellites and Kepler\'s laws.',
  sections:[
    {h:"Newton's law of gravitation",
     body:`Every mass attracts every other with F = Gm₁m₂/r², with G = 6.674 × 10⁻¹¹ N·m²/kg². The r is measured between <b>centres</b>, not surfaces. Doubling the separation quarters the force — inverse square, not inverse.`},
    {h:'Field strength and weight',
     body:`Gravitational field strength g = GM/r² (N/kg) is the force per kilogram. At Earth's surface that evaluates to 9.81. On the ISS at 400 km altitude, g is still 8.7 N/kg — about 89% of surface gravity. Astronauts float because they are in free fall, not because gravity is absent.`},
    {h:'Orbits',
     body:`Set gravity equal to the centripetal requirement: GMm/r² = mv²/r, giving orbital speed v = √(GM/r) — independent of the satellite's mass. Combining with v = 2πr/T yields <b>Kepler's third law</b>, T² ∝ r³. Geostationary orbit is the radius where T = 24 h, about 42 200 km from Earth's centre.`},
    {h:'Escape velocity',
     body:`Escaping means total energy ≥ 0: ½mv² − GMm/r = 0, so v<sub>esc</sub> = √(2GM/r) = 11.2 km/s from Earth. Again independent of the escaping object's mass.`}
  ],
  formulas:[
    {f:'F = G·m₁·m₂ / r²', d:'universal gravitation'},
    {f:'g = G·M / r²', d:'field strength'},
    {f:'v_orbit = √(G·M / r)', d:'circular orbital speed'},
    {f:'T² = (4π²/GM)·r³', d:"Kepler's third law"},
    {f:'v_esc = √(2·G·M / r)', d:'escape velocity'}
  ],
  example:{title:'How high is geostationary orbit?',
    problem:'Find the orbital radius for a 24 h period around Earth (M = 5.97×10²⁴ kg).',
    steps:['T = 86400 s. Use r³ = GMT²/(4π²).','GM = 6.674e-11 × 5.97e24 = 3.986e14.','r³ = 3.986e14 × (86400)² / 39.48 = 7.54e22 m³.','r = 4.22e7 m = 42 200 km, i.e. about 35 800 km above the surface.']},
  realWorld:[
    'Every TV satellite dish points at a fixed spot because geostationary satellites match Earth\'s rotation.',
    'GPS satellites orbit at 20 200 km with 12 h periods; their clocks are corrected for both special and general relativity.',
    'Gravity-assist flybys steal a tiny amount of a planet\'s orbital energy to accelerate spacecraft for free.'
  ],
  videos:[{t:'Universal gravitation', q:'Newton universal law of gravitation explained'},{t:"Kepler's laws", q:"Kepler's laws of planetary motion explained"}],
  terms:['inverse-square law','gravitational field','orbital speed','geostationary','escape velocity']
})
]};

const UNIT_4 = {
  id:'u4', title:'Energy, Momentum and Oscillations', icon:'⚡',
  blurb:'Conservation laws — the most powerful shortcuts in physics — plus simple harmonic motion.',
  chapters:[
CH({
  id:'c4-energy', title:'Work, Energy and Power', level:'y11', sim:'energy',
  summary:'Energy is never created or destroyed. Track where it goes and many problems need no forces at all.',
  sections:[
    {h:'Work',
     body:`W = Fs cos θ, where θ is the angle between force and displacement. Carrying a bag horizontally does <b>zero</b> work against gravity (θ = 90°), no matter how tired you feel. A force perpendicular to motion — like the centripetal force on a satellite — never does work, which is why orbital speed is constant.`},
    {h:'Kinetic and potential energy',
     body:`KE = ½mv², so speed matters quadratically: doubling speed quadruples the energy that brakes must dissipate. Gravitational PE near the surface is ΔPE = mgh. Elastic PE in a spring is ½kx².`},
    {h:'Conservation and efficiency',
     body:`In the absence of friction, KE + PE is constant. With friction, the missing energy became heat and sound — it is not destroyed. Efficiency = useful output / total input, always < 100% for any real machine. A car engine is ~30% efficient; an electric motor can exceed 90%.`},
    {h:'Power',
     body:`Power is the rate of energy transfer: P = W/t, and for a constant force at constant speed P = Fv. That last form explains why a car's top speed is where engine power equals drag power: drag grows as v², so power needed grows as v³.`}
  ],
  formulas:[
    {f:'W = F·s·cosθ', d:'work done by a force'},
    {f:'KE = ½·m·v²', d:'kinetic energy'},
    {f:'ΔPE = m·g·Δh', d:'gravitational PE near Earth'},
    {f:'E_spring = ½·k·x²', d:'elastic potential energy'},
    {f:'P = W/t = F·v', d:'power'}
  ],
  example:{title:'Roller coaster drop',
    problem:'A 500 kg car starts at rest 40 m up a frictionless track. Speed at the bottom?',
    steps:['All PE converts to KE: mgh = ½mv².','Mass cancels: v = √(2gh) = √(2 × 9.81 × 40).','v = √784.8 = 28 m/s ≈ 101 km/h. The mass never mattered.']},
  realWorld:[
    'Regenerative braking in EVs converts KE back into chemical energy instead of brake heat, recovering ~70%.',
    'Pumped-storage hydro lifts water uphill at night and drops it at peak demand — grid-scale mgh.',
    'Pole vaulting is a three-stage conversion: chemical → kinetic (run) → elastic (pole bends) → gravitational (height).'
  ],
  videos:[{t:'Work and energy', q:'work energy theorem physics explained'},{t:'Conservation of energy', q:'conservation of energy roller coaster physics'}],
  terms:['work','kinetic energy','potential energy','conservation','efficiency','power']
}),
CH({
  id:'c4-momentum', title:'Momentum, Impulse and Collisions', level:'y11', sim:'collision',
  summary:'Momentum is conserved in every collision. Kinetic energy is not — and that difference defines elastic vs inelastic.',
  sections:[
    {h:'Momentum and impulse',
     body:`p = mv, a vector. Newton's second law in its original form is F = Δp/Δt, so <b>impulse</b> J = FΔt = Δp. To reduce the force in a collision, extend the time — that is the entire design principle behind airbags, crumple zones, crash mats and bending your knees when you land.`},
    {h:'Conservation of momentum',
     body:`With no external force, total momentum before = total momentum after. This holds in explosions, collisions and recoil, in each direction independently. Always assign signs by direction before substituting.`},
    {h:'Elastic vs inelastic',
     body:`<b>Elastic</b>: momentum and kinetic energy both conserved (snooker balls, gas molecules). <b>Inelastic</b>: momentum conserved, KE partly converted to heat/deformation. <b>Perfectly inelastic</b>: objects stick together, maximum KE loss consistent with conservation of momentum.`}
  ],
  formulas:[
    {f:'p = m·v', d:'momentum (kg·m/s)'},
    {f:'J = F·Δt = Δp', d:'impulse–momentum theorem'},
    {f:'Σp_before = Σp_after', d:'conservation of momentum'},
    {f:'m₁u₁ + m₂u₂ = (m₁+m₂)v', d:'perfectly inelastic collision'}
  ],
  example:{title:'Recoil of a rifle',
    problem:'A 4.0 kg rifle fires a 0.020 kg bullet at 400 m/s. Find the recoil speed.',
    steps:['Initial momentum = 0.','0 = (0.020)(400) + (4.0)v → 8.0 + 4.0v = 0.','v = −2.0 m/s: 2 m/s backwards. Holding the rifle against your shoulder increases the effective mass and the stopping time, cutting the force.']},
  realWorld:[
    'Crumple zones lengthen a crash from ~10 ms to ~150 ms, cutting peak force by more than ten times.',
    'Rocket propulsion is momentum conservation: expelled mass carries momentum one way, the rocket the other.',
    'Newton\'s cradle demonstrates that momentum <i>and</i> energy conservation together force the one-ball-out result.'
  ],
  videos:[{t:'Momentum and impulse', q:'momentum impulse physics explained'},{t:'Elastic vs inelastic collisions', q:'elastic inelastic collisions physics'}],
  terms:['momentum','impulse','elastic collision','inelastic collision','recoil']
}),
CH({
  id:'c4-shm', title:'Simple Harmonic Motion', level:'y12', sim:'shm',
  summary:'Whenever the restoring force is proportional to displacement, you get a sine wave in time — springs, pendulums, atoms, circuits.',
  sections:[
    {h:'The defining condition',
     body:`SHM exists when a = −ω²x: acceleration proportional to displacement and directed back toward equilibrium. The minus sign is the physics; without it you get exponential runaway, not oscillation.`},
    {h:'Solutions and phase',
     body:`x = A cos(ωt + φ), v = −Aω sin(ωt + φ), a = −Aω² cos(ωt + φ). Velocity leads displacement by 90°, acceleration by 180°. Maximum speed Aω happens at the centre; maximum acceleration Aω² at the extremes, where the speed is zero.`},
    {h:'Springs and pendulums',
     body:`Mass on a spring: T = 2π√(m/k). Simple pendulum (small angles): T = 2π√(L/g) — <b>amplitude and mass do not appear</b>, which is why pendulum clocks work. Beyond about 15° the small-angle approximation sin θ ≈ θ fails and the period lengthens.`},
    {h:'Damping and resonance',
     body:`Real oscillators lose energy: light damping decays slowly, critical damping returns fastest without overshoot (car suspension, door closers), over-damping is sluggish. Drive an oscillator at its natural frequency and the amplitude grows dramatically — resonance. Useful in MRI and radio tuning, destructive in bridges and buildings.`}
  ],
  formulas:[
    {f:'a = −ω²·x', d:'definition of SHM'},
    {f:'x = A·cos(ω·t + φ)', d:'displacement solution'},
    {f:'v_max = A·ω,  a_max = A·ω²', d:'peak values'},
    {f:'T = 2π√(m/k)', d:'mass–spring period'},
    {f:'T = 2π√(L/g)', d:'simple pendulum period'},
    {f:'E = ½·k·A²', d:'total energy, constant'}
  ],
  example:{title:'Tuning a spring oscillator',
    problem:'A 0.50 kg mass on a k = 200 N/m spring is pulled 0.10 m and released. Find T and maximum speed.',
    steps:['ω = √(k/m) = √(200/0.5) = 20 rad/s.','T = 2π/ω = 0.314 s.','v_max = Aω = 0.10 × 20 = 2.0 m/s at the equilibrium point.']},
  realWorld:[
    'Quartz watches count the SHM of a crystal oscillating at 32 768 Hz — exactly 2¹⁵ ticks per second.',
    'The Tacoma Narrows bridge failed through wind-driven resonant torsional oscillation.',
    'Tuned mass dampers — a 660 t pendulum in Taipei 101 — cancel building sway by oscillating out of phase.'
  ],
  videos:[{t:'Simple harmonic motion', q:'simple harmonic motion physics explained'},{t:'Resonance demonstrations', q:'resonance physics demonstration'}],
  terms:['SHM','amplitude','angular frequency','phase','damping','resonance']
})
]};

const UNIT_5 = {
  id:'u5', title:'Waves, Sound and Light', icon:'🌊',
  blurb:'Energy moving without matter moving. Superposition, standing waves, Doppler, and geometric optics.',
  chapters:[
CH({
  id:'c5-waves', title:'Wave Properties', level:'y11', sim:'wave',
  summary:'Amplitude, wavelength, frequency and speed — plus the transverse/longitudinal split that separates light from sound.',
  sections:[
    {h:'What a wave carries',
     body:`A wave transfers <b>energy and information</b>, not matter. Water molecules in an ocean wave move in small circles and return; the wave crosses an ocean. Ripples on a pond move a floating cork up and down, not outward.`},
    {h:'The wave equation',
     body:`v = fλ, and it follows from the definition: one full wavelength passes every period, so speed = λ/T = fλ. <b>The speed is set by the medium</b>. When a wave enters a new medium, frequency stays the same (the source still shakes at the same rate) and the wavelength changes to match — this is exactly why light refracts.`},
    {h:'Transverse vs longitudinal',
     body:`Transverse: oscillation perpendicular to travel (light, water surface, waves on a string). These can be <b>polarised</b>. Longitudinal: oscillation parallel to travel, as compressions and rarefactions (sound, seismic P-waves). Sound cannot be polarised, and cannot cross a vacuum.`},
    {h:'Reflection, refraction, diffraction',
     body:`Reflection: angle in = angle out. Refraction: speed change bends the wave, n₁sin θ₁ = n₂sin θ₂. Diffraction: waves spread through gaps, and the spreading is significant when the gap is comparable to the wavelength — which is why you hear round corners (λ ≈ 1 m) but cannot see round them (λ ≈ 5×10⁻⁷ m).`}
  ],
  formulas:[
    {f:'v = f·λ', d:'the wave equation'},
    {f:'T = 1/f', d:'period and frequency'},
    {f:'n₁·sinθ₁ = n₂·sinθ₂', d:"Snell's law of refraction"},
    {f:'sinθ_c = n₂/n₁', d:'critical angle for total internal reflection'}
  ],
  example:{title:'Radio wavelength',
    problem:'An FM station broadcasts at 100 MHz. What is the wavelength? (c = 3.0×10⁸ m/s)',
    steps:['λ = v/f = 3.0e8 / 1.0e8.','λ = 3.0 m — which is why FM aerials are about 1.5 m (half a wavelength) long.']},
  realWorld:[
    'Fibre optics rely on total internal reflection to trap light over thousands of kilometres.',
    'Seismologists deduced Earth\'s liquid outer core because S-waves (transverse) cannot cross liquids while P-waves can.',
    'Polarised sunglasses cut glare because light reflected off water is partly horizontally polarised.'
  ],
  videos:[{t:'Wave basics', q:'wave properties frequency wavelength physics'},{t:'Refraction and Snell law', q:'Snell law refraction physics explained'}],
  terms:['amplitude','wavelength','frequency','transverse','longitudinal','refraction','diffraction']
}),
CH({
  id:'c5-super', title:'Superposition, Interference and Standing Waves', level:'y12', sim:'superposition',
  summary:'When waves meet they add. Path difference decides constructive from destructive, and reflections create standing waves.',
  sections:[
    {h:'The superposition principle',
     body:`Where waves overlap, the resultant displacement is the vector sum of the individual displacements. Afterwards each wave continues unchanged — waves pass through each other, unlike particles.`},
    {h:'Interference and path difference',
     body:`For two coherent sources (same frequency, constant phase relationship):<br>
constructive when path difference = nλ; destructive when path difference = (n + ½)λ.<br>
Young's double slit gives bright fringes at spacing w = λD/s, which is how the wavelength of light was first measured — and the strongest early evidence that light is a wave.`},
    {h:'Standing waves',
     body:`A wave reflecting back on itself interferes with the incoming wave, producing fixed <b>nodes</b> (zero amplitude) and <b>antinodes</b> (maximum). No energy travels along a standing wave. Node-to-node spacing is λ/2.<br>
String fixed at both ends: f<sub>n</sub> = nv/2L, giving the full harmonic series. Pipe open at both ends: same. Pipe closed at one end: only odd harmonics, f<sub>n</sub> = nv/4L with n odd — which is why a clarinet sounds hollow compared with a flute.`}
  ],
  formulas:[
    {f:'constructive: Δpath = n·λ', d:'in phase'},
    {f:'destructive: Δpath = (n + ½)·λ', d:'antiphase'},
    {f:'w = λ·D / s', d:'double-slit fringe spacing'},
    {f:'f_n = n·v / 2L', d:'harmonics, string or open pipe'},
    {f:'f_n = n·v / 4L (n odd)', d:'closed pipe harmonics'}
  ],
  example:{title:'Wavelength from a double slit',
    problem:'Slits 0.50 mm apart, screen 2.0 m away, fringes 2.4 mm apart. Find λ.',
    steps:['λ = w·s/D = (2.4e-3 × 0.50e-3) / 2.0.','λ = 6.0e-7 m = 600 nm — orange-red light.']},
  realWorld:[
    'Noise-cancelling headphones generate an antiphase wave: destructive interference by design.',
    'Anti-reflective lens coatings are one quarter-wavelength thick so reflections cancel.',
    'Every musical instrument is a standing-wave device; its harmonic mix is what we hear as timbre.'
  ],
  videos:[{t:'Interference and Young double slit', q:'Young double slit experiment physics'},{t:'Standing waves and harmonics', q:'standing waves harmonics strings pipes physics'}],
  terms:['superposition','coherence','path difference','node','antinode','harmonic']
}),
CH({
  id:'c5-doppler', title:'Sound and the Doppler Effect', level:'y12', sim:'doppler',
  summary:'Relative motion shifts observed frequency — from ambulance sirens to the expansion of the universe.',
  sections:[
    {h:'Sound as a pressure wave',
     body:`Sound is a longitudinal pressure wave; its speed depends on the medium's stiffness and density. In air at 20°C it is ~343 m/s, in water ~1480 m/s, in steel ~5000 m/s. In air, v ≈ 331 + 0.6T (T in °C).<br>
Loudness is measured logarithmically: dB = 10 log(I/I₀). Every +10 dB is ten times the intensity but only about twice the perceived loudness.`},
    {h:'The Doppler effect',
     body:`Motion compresses the wavefronts ahead and stretches them behind. For a moving source, f' = f·v/(v ∓ v<sub>s</sub>) — minus when approaching (higher pitch), plus when receding (lower). The pitch does not fall <i>during</i> the approach; it drops suddenly as the source passes.`},
    {h:'Shock waves',
     body:`When the source reaches the wave speed, wavefronts pile up into a Mach cone and you get a sonic boom. The boom is continuous along the flight path, not a one-off event at the moment of "breaking" the sound barrier.`},
    {h:'Redshift',
     body:`The same maths applied to light gives z = Δλ/λ ≈ v/c for small speeds. Distant galaxies are redshifted, and the shift grows with distance — Hubble's law, and the primary evidence that the universe is expanding.`}
  ],
  formulas:[
    {f:"f' = f·v / (v ∓ v_s)", d:'moving source (− approaching)'},
    {f:"f' = f·(v ± v_o) / v", d:'moving observer (+ approaching)'},
    {f:'dB = 10·log₁₀(I / I₀)', d:'sound intensity level'},
    {f:'z = Δλ / λ ≈ v/c', d:'redshift for v ≪ c'}
  ],
  example:{title:'Ambulance siren',
    problem:'A 1000 Hz siren approaches at 30 m/s. What do you hear? (v = 343 m/s)',
    steps:["f' = 1000 × 343/(343 − 30) = 343000/313.","f' = 1096 Hz approaching.","After it passes: 1000 × 343/373 = 920 Hz. The audible jump is about 176 Hz — roughly three semitones."]},
  realWorld:[
    'Doppler radar measures storm rotation, revealing tornado formation before it touches down.',
    'Medical Doppler ultrasound images blood flow direction and speed non-invasively.',
    'Police speed guns bounce radar off your car and read the frequency shift.'
  ],
  videos:[{t:'Doppler effect', q:'Doppler effect physics explained'},{t:'Sonic boom explained', q:'sonic boom shock wave physics'}],
  terms:['Doppler shift','Mach number','decibel','redshift','shock wave']
}),
CH({
  id:'c5-optics', title:'Geometric Optics — Lenses and Mirrors', level:'y11', sim:'lens',
  summary:'Ray diagrams and one equation describe cameras, telescopes, glasses and your own eye.',
  sections:[
    {h:'Refraction at a lens',
     body:`A converging (convex) lens bends parallel rays to a focal point at distance f. A diverging (concave) lens spreads them so they appear to come from a virtual focus. Power P = 1/f in dioptres — the number on a spectacle prescription.`},
    {h:'The thin lens equation',
     body:`1/f = 1/u + 1/v, with magnification m = −v/u = h<sub>i</sub>/h<sub>o</sub>. Sign convention (real-is-positive): u positive for a real object, v positive for a real image on the far side, f positive for converging. A negative v means a virtual image on the same side as the object.`},
    {h:'The three construction rays',
     body:`<ul class="clean">
<li>Parallel to the axis → refracts through the far focus.</li>
<li>Through the centre → continues undeviated.</li>
<li>Through the near focus → emerges parallel.</li></ul>
Any two locate the image. Object beyond 2f → small, inverted, real. Between f and 2f → magnified, inverted, real (a projector). Inside f → magnified, upright, virtual (a magnifying glass).`}
  ],
  formulas:[
    {f:'1/f = 1/u + 1/v', d:'thin lens / mirror equation'},
    {f:'m = −v/u', d:'magnification; negative means inverted'},
    {f:'P = 1/f  (dioptres)', d:'lens power, f in metres'}
  ],
  example:{title:'Projector lens',
    problem:'An object is 30 cm from a lens of focal length 20 cm. Where is the image and how big?',
    steps:['1/20 = 1/30 + 1/v → 1/v = 1/20 − 1/30 = 1/60.','v = 60 cm on the far side: a real image.','m = −60/30 = −2: twice the size and inverted.']},
  realWorld:[
    'Myopia is corrected with diverging lenses (negative dioptres); long-sightedness with converging ones.',
    'Phone cameras stack 5–7 tiny lens elements to cancel chromatic and spherical aberration.',
    'Reflecting telescopes use mirrors instead of lenses because mirrors have no chromatic aberration and can be made huge.'
  ],
  videos:[{t:'Lens ray diagrams', q:'converging lens ray diagram physics'},{t:'Thin lens equation problems', q:'thin lens equation problems physics'}],
  terms:['focal length','real image','virtual image','magnification','dioptre']
})
]};

const UNIT_6 = {
  id:'u6', title:'Thermal Physics', icon:'🔥',
  blurb:'Heat, temperature, gas laws and the two laws that govern every engine ever built.',
  chapters:[
CH({
  id:'c6-heat', title:'Temperature, Heat and Thermal Energy', level:'y11', sim:'gas',
  summary:'Temperature measures average particle kinetic energy; heat is energy in transit because of a temperature difference.',
  sections:[
    {h:'Temperature vs heat vs internal energy',
     body:`<b>Temperature</b> is proportional to the average kinetic energy per particle. <b>Internal energy</b> is the total kinetic + potential energy of all particles. <b>Heat</b> is energy flowing from hot to cold. A bathtub at 40°C holds far more internal energy than a spark at 1000°C, which is why the spark cannot hurt you.<br>
Kelvin is absolute: T(K) = T(°C) + 273.15, and 0 K is the point where particle motion is minimal. Always use kelvin in gas laws.`},
    {h:'Specific and latent heat',
     body:`Q = mcΔT raises temperature; Q = mL changes state at <i>constant</i> temperature. Water's specific heat capacity, 4180 J/kg·K, is unusually high — which is why oceans moderate climate and why water is the standard coolant. Its latent heat of vaporisation, 2.26 MJ/kg, is why steam burns are so much worse than boiling-water burns.`},
    {h:'Heat transfer',
     body:`<b>Conduction</b> — vibration passed particle to particle; metals excel because free electrons carry energy too. <b>Convection</b> — bulk movement of heated fluid, driven by density differences. <b>Radiation</b> — infrared electromagnetic waves, the only mechanism that crosses a vacuum, with power ∝ T⁴ (Stefan–Boltzmann).`}
  ],
  formulas:[
    {f:'Q = m·c·ΔT', d:'sensible heat, temperature changes'},
    {f:'Q = m·L', d:'latent heat, state changes at constant T'},
    {f:'T(K) = T(°C) + 273.15', d:'absolute temperature'},
    {f:'P = e·σ·A·T⁴', d:'Stefan–Boltzmann radiated power'}
  ],
  example:{title:'Melting and heating ice',
    problem:'How much energy turns 0.50 kg of ice at 0°C into water at 25°C? (L_f = 3.34×10⁵ J/kg, c = 4180 J/kg·K)',
    steps:['Melt: Q₁ = mL = 0.50 × 3.34e5 = 1.67e5 J.','Heat: Q₂ = mcΔT = 0.50 × 4180 × 25 = 5.2e4 J.','Total ≈ 2.19e5 J. Melting alone took three times as much energy as the 25° temperature rise.']},
  realWorld:[
    'Sweating cools you through latent heat of vaporisation — the energy comes out of your skin.',
    'Vacuum flasks defeat all three transfer modes: vacuum stops conduction and convection, silvering reflects radiation.',
    'Thermal imaging cameras read the T⁴ radiation law to find heat leaks in buildings and fevers in people.'
  ],
  videos:[{t:'Specific heat capacity', q:'specific heat capacity latent heat physics'},{t:'Heat transfer methods', q:'conduction convection radiation physics'}],
  terms:['temperature','heat','internal energy','specific heat capacity','latent heat','kelvin']
}),
CH({
  id:'c6-gas', title:'Gas Laws and Kinetic Theory', level:'y12', sim:'gas',
  summary:'Millions of colliding particles produce one tidy equation: pV = nRT.',
  sections:[
    {h:'The three empirical laws',
     body:`<b>Boyle</b>: at constant T, p ∝ 1/V. <b>Charles</b>: at constant p, V ∝ T. <b>Gay-Lussac</b>: at constant V, p ∝ T. Combine them and you get pV/T = constant, then the ideal gas equation pV = nRT with R = 8.31 J/mol·K.`},
    {h:'Kinetic theory assumptions',
     body:`An ideal gas assumes: many identical particles in random motion, negligible volume compared with the container, no intermolecular forces except during collisions, and perfectly elastic collisions. Real gases deviate at high pressure and low temperature, where those assumptions break and the gas eventually liquefies.`},
    {h:'Pressure from particle collisions',
     body:`Pressure is the average force per unit area from countless molecular impacts: pV = ⅓Nm⟨c²⟩. Comparing with pV = NkT gives ½m⟨c²⟩ = (3/2)kT — the mean kinetic energy of a molecule depends <b>only</b> on temperature, not on which gas it is. Lighter molecules therefore move faster at the same temperature, which is why hydrogen and helium escape from Earth's atmosphere.`}
  ],
  formulas:[
    {f:'p·V = n·R·T', d:'ideal gas law (n in moles, R = 8.31)'},
    {f:'p·V = N·k·T', d:'per-molecule form (k = 1.38×10⁻²³ J/K)'},
    {f:'p·V = ⅓·N·m·⟨c²⟩', d:'kinetic theory pressure'},
    {f:'½·m·⟨c²⟩ = (3/2)·k·T', d:'mean molecular kinetic energy'}
  ],
  example:{title:'Compressed gas cylinder',
    problem:'A gas at 200 kPa and 300 K in 2.0 L is compressed to 0.50 L and warms to 400 K. New pressure?',
    steps:['Use p₁V₁/T₁ = p₂V₂/T₂.','(200 × 2.0)/300 = (p₂ × 0.50)/400.','1.333 = p₂ × 0.00125 → p₂ = 1067 kPa ≈ 1.07 MPa.']},
  realWorld:[
    'Scuba divers must exhale while ascending: Boyle\'s law expands lung gas as pressure drops.',
    'Car tyre pressure rises on a long drive because heating at constant volume raises p (Gay-Lussac).',
    'Hot air balloons fly because heating lowers the density of the enclosed air (Charles).'
  ],
  videos:[{t:'Ideal gas law', q:'ideal gas law pV=nRT explained'},{t:'Kinetic theory of gases', q:'kinetic theory of gases derivation physics'}],
  terms:['ideal gas','Boyle law','Charles law','kinetic theory','Boltzmann constant','mole']
}),
CH({
  id:'c6-thermo', title:'Laws of Thermodynamics', level:'y12',
  summary:'Energy is conserved (first law) but useful energy always degrades (second law). No engine escapes Carnot.',
  sections:[
    {h:'First law',
     body:`ΔU = Q − W: the internal energy rises by the heat added and falls by the work the gas does. It is conservation of energy with heat included. Sign conventions matter — decide whether W is work done <i>by</i> or <i>on</i> the gas and state it.`},
    {h:'The four standard processes',
     body:`<ul class="clean">
<li><b>Isothermal</b> (ΔT = 0): ΔU = 0, so Q = W.</li>
<li><b>Adiabatic</b> (Q = 0): ΔU = −W; fast compression heats a gas — that is how a diesel engine ignites fuel with no spark plug.</li>
<li><b>Isobaric</b> (constant p): W = pΔV.</li>
<li><b>Isochoric</b> (constant V): W = 0, so all heat becomes internal energy.</li></ul>`},
    {h:'Second law and entropy',
     body:`Heat never flows spontaneously from cold to hot; entropy of an isolated system never decreases. This is the law that gives time a direction — smashed cups do not reassemble. It also caps every heat engine at the Carnot efficiency η = 1 − T<sub>c</sub>/T<sub>h</sub>, with temperatures in kelvin. No cleverness in design beats that number.`}
  ],
  formulas:[
    {f:'ΔU = Q − W', d:'first law of thermodynamics'},
    {f:'W = p·ΔV', d:'work at constant pressure'},
    {f:'η_Carnot = 1 − T_c / T_h', d:'maximum possible efficiency'},
    {f:'ΔS ≥ 0', d:'second law, isolated system'}
  ],
  example:{title:'Best possible power station',
    problem:'Steam enters at 550°C and exhausts at 30°C. Maximum theoretical efficiency?',
    steps:['Convert: Th = 823 K, Tc = 303 K.','η = 1 − 303/823 = 1 − 0.368.','η = 63%. Real plants reach ~40% — losses, friction and finite-rate heat transfer eat the rest.']},
  realWorld:[
    'A fridge does not "make cold" — it does work to pump heat outward, which is why the back coils are hot and why an open fridge warms the room.',
    'Heat pumps deliver 3–4 J of heating per joule of electricity because they move heat rather than create it.',
    'Data centres are entropy factories: essentially all electrical energy ends up as low-grade heat.'
  ],
  videos:[{t:'Laws of thermodynamics', q:'first and second law of thermodynamics explained'},{t:'Carnot engine', q:'Carnot cycle efficiency physics'}],
  terms:['first law','entropy','adiabatic','isothermal','Carnot efficiency','heat engine']
})
]};

const UNIT_7 = {
  id:'u7', title:'Electricity', icon:'🔌',
  blurb:'Charge at rest and charge in motion: fields, potential, current, resistance and circuits.',
  chapters:[
CH({
  id:'c7-static', title:'Electric Charge, Field and Potential', level:'y12', sim:'efield',
  summary:'Coulomb\'s law mirrors gravitation — but charge comes in two signs, so fields can cancel.',
  sections:[
    {h:"Coulomb's law",
     body:`F = kq₁q₂/r² with k = 8.99×10⁹ N·m²/C². Same inverse-square shape as gravity, but ~10³⁹ times stronger between two protons — which is why gravity is irrelevant inside atoms and dominant between planets (bulk matter is electrically neutral).`},
    {h:'Electric field',
     body:`E = F/q is the force per unit positive charge, in N/C or V/m. Around a point charge E = kQ/r². Between parallel plates the field is uniform: E = V/d. Field lines start on positive charge, end on negative, never cross, and their density shows field strength.`},
    {h:'Potential and potential difference',
     body:`Electric potential V = kQ/r is potential energy per unit charge (joules per coulomb = volts). Potential difference is what actually drives current: W = qV. An electronvolt is the energy an electron gains through 1 V: 1 eV = 1.60×10⁻¹⁹ J.<br>
Field is the <i>gradient</i> of potential: E = −dV/dx. Moving along an equipotential surface takes no work.`}
  ],
  formulas:[
    {f:'F = k·q₁·q₂ / r²', d:"Coulomb's law"},
    {f:'E = F/q = k·Q / r²', d:'electric field strength'},
    {f:'E = V/d', d:'uniform field between plates'},
    {f:'V = k·Q / r', d:'potential near a point charge'},
    {f:'W = q·ΔV', d:'work moving a charge'}
  ],
  example:{title:'Accelerating an electron',
    problem:'An electron is accelerated through 500 V. Find its final speed.',
    steps:['Energy gained: W = qV = 1.60e-19 × 500 = 8.0e-17 J.','½mv² = 8.0e-17, m = 9.11e-31 kg.','v² = 1.756e14 → v = 1.33e7 m/s, about 4.4% of light speed.']},
  realWorld:[
    'Photocopiers and laser printers charge a drum so toner sticks only to the image areas.',
    'Lightning is dielectric breakdown of air at roughly 3×10⁶ V/m.',
    'Electrostatic precipitators in power-station chimneys charge soot and collect it on plates, removing >99% of particulates.'
  ],
  videos:[{t:'Coulomb law and electric fields', q:'Coulomb law electric field physics explained'},{t:'Electric potential', q:'electric potential and potential difference physics'}],
  terms:['coulomb','electric field','field line','potential','equipotential','electronvolt']
}),
CH({
  id:'c7-circuits', title:'Current, Resistance and DC Circuits', level:'y11', sim:'circuit',
  summary:'Ohm\'s law plus two Kirchhoff rules solve every DC circuit you will meet.',
  sections:[
    {h:'Current and resistance',
     body:`Current I = Q/t is the rate of flow of charge (1 A = 1 C/s). Conventional current flows from + to −, opposite to the electron drift — a historical accident we keep for consistency.<br>
Ohm's law V = IR holds for a metal at constant temperature. Resistance depends on the material and shape: R = ρL/A, so a long thin wire resists more than a short fat one.`},
    {h:'Series and parallel',
     body:`<b>Series</b>: same current everywhere, voltages add, R<sub>total</sub> = R₁ + R₂ + … <b>Parallel</b>: same voltage across each branch, currents add, 1/R<sub>total</sub> = 1/R₁ + 1/R₂ + … Parallel resistance is always <i>less</i> than the smallest branch, because you have added another path.`},
    {h:"Kirchhoff's laws",
     body:`<b>Junction rule</b>: current in = current out (conservation of charge). <b>Loop rule</b>: around any closed loop, the sum of EMFs equals the sum of IR drops (conservation of energy). These two rules solve networks that series/parallel shortcuts cannot.`},
    {h:'EMF and internal resistance',
     body:`A real cell has internal resistance r, so terminal voltage V = ε − Ir. Draw a big current and the terminal voltage sags — which is why headlights dim when you crank a cold engine, and why a nearly-flat battery reads fine until it is loaded.`},
    {h:'Electrical power',
     body:`P = VI = I²R = V²/R. Choose the form matching what you know. Transmission lines run at hundreds of kilovolts precisely because P<sub>loss</sub> = I²R: raising V for the same power cuts I, and losses fall with the square.`}
  ],
  formulas:[
    {f:'I = Q/t', d:'current'},
    {f:'V = I·R', d:"Ohm's law"},
    {f:'R = ρ·L / A', d:'resistivity relation'},
    {f:'R_series = R₁ + R₂',d:'series'},
    {f:'1/R_par = 1/R₁ + 1/R₂', d:'parallel'},
    {f:'P = V·I = I²·R = V²/R', d:'electrical power'},
    {f:'V = ε − I·r', d:'terminal voltage with internal resistance'}
  ],
  example:{title:'Mixed network',
    problem:'A 12 V battery drives 6 Ω in series with two 4 Ω resistors in parallel. Find the total current.',
    steps:['Parallel pair: 1/R = 1/4 + 1/4 = 1/2 → R = 2 Ω.','Total R = 6 + 2 = 8 Ω.','I = V/R = 12/8 = 1.5 A. Each parallel branch then carries 0.75 A.']},
  realWorld:[
    'House wiring is parallel so every appliance gets the full 230 V and can be switched independently.',
    'Fuses and circuit breakers exploit I²R heating to break the circuit before the wiring melts.',
    'Christmas lights in series all die when one bulb fails — the classic argument for parallel.'
  ],
  videos:[{t:'Ohm law and circuits', q:'Ohm law series parallel circuits physics'},{t:'Kirchhoff laws', q:'Kirchhoff current voltage law problems'}],
  terms:['current','resistance','resistivity','series','parallel','EMF','internal resistance']
}),
CH({
  id:'c7-cap', title:'Capacitors', level:'y12',
  summary:'Two plates storing charge and energy — and an exponential decay that appears everywhere in physics.',
  sections:[
    {h:'Capacitance',
     body:`C = Q/V, measured in farads (1 F = 1 C/V, an enormous unit — real capacitors are µF to pF). For parallel plates C = ε₀ε<sub>r</sub>A/d: bigger plates or a thinner gap store more charge per volt, and a dielectric multiplies capacitance by ε<sub>r</sub>.`},
    {h:'Energy stored',
     body:`E = ½QV = ½CV² = Q²/2C. The factor ½ appears because voltage rises linearly as charge accumulates — you integrate, you do not multiply. Capacitors deliver that energy extremely fast, which is why a camera flash or a defibrillator uses one instead of a battery.`},
    {h:'Charging and discharging',
     body:`Through a resistor, charge decays as Q = Q₀e<sup>−t/RC</sup>. The <b>time constant</b> τ = RC is the time to fall to 37% of the initial value; after 5τ the capacitor is >99% discharged. Note the reversal from resistors: capacitors in <i>parallel</i> add, capacitors in series combine reciprocally.`}
  ],
  formulas:[
    {f:'C = Q / V', d:'definition of capacitance'},
    {f:'C = ε₀·ε_r·A / d', d:'parallel-plate capacitor'},
    {f:'E = ½·C·V²', d:'stored energy'},
    {f:'Q = Q₀·e^(−t/RC)', d:'discharge; τ = RC'},
    {f:'C_par = C₁ + C₂', d:'parallel capacitors add'}
  ],
  example:{title:'Camera flash',
    problem:'A 100 µF capacitor is charged to 300 V. How much energy does it dump, and what is τ through a 50 Ω flash tube?',
    steps:['E = ½CV² = 0.5 × 100e-6 × 90000 = 4.5 J.','τ = RC = 50 × 100e-6 = 5.0 ms.','Delivered in ~5 ms, that is a peak power near 900 W from a battery that could never supply it directly.']},
  realWorld:[
    'Defibrillators store ~200 J and release it in about 10 ms.',
    'Supercapacitors recover braking energy in trams and buses, charging in seconds where batteries need minutes.',
    'Every touchscreen is a grid of tiny capacitors; your finger changes the local capacitance.'
  ],
  videos:[{t:'Capacitors explained', q:'capacitor charging discharging RC circuit physics'},{t:'Energy in a capacitor', q:'energy stored in capacitor derivation'}],
  terms:['capacitance','farad','dielectric','time constant','exponential decay']
})
]};

const UNIT_8 = {
  id:'u8', title:'Magnetism and Electromagnetism', icon:'🧲',
  blurb:'Moving charge makes magnetism; changing magnetism makes electricity. The loop that powers the world.',
  chapters:[
CH({
  id:'c8-magforce', title:'Magnetic Fields and Forces', level:'y12', sim:'magnetic',
  summary:'A charge moving across a magnetic field feels a force perpendicular to both — the basis of every motor.',
  sections:[
    {h:'Force on a current and on a charge',
     body:`F = BIL sin θ for a current-carrying wire, F = qvB sin θ for a single charge. The force is <b>perpendicular to both</b> the field and the velocity, so it does no work — it changes direction, never speed. Use Fleming's left-hand rule for motors: First finger = Field, seCond = Current, thuMb = Motion.`},
    {h:'Circular paths and mass spectrometry',
     body:`A charge entering a uniform field perpendicular moves in a circle: qvB = mv²/r, so r = mv/(qB). Heavier or faster particles curve less; that single relation is the whole principle of the mass spectrometer, the cyclotron and the bending magnets of the LHC.`},
    {h:'Fields from currents',
     body:`A straight wire: B = µ₀I/2πr, circular field lines given by the right-hand grip rule. A solenoid: B = µ₀nI, nearly uniform inside — an electromagnet you can switch off. Ferromagnetic cores multiply the field by aligning their internal domains.`}
  ],
  formulas:[
    {f:'F = B·I·L·sinθ', d:'force on a current-carrying wire'},
    {f:'F = q·v·B·sinθ', d:'force on a moving charge'},
    {f:'r = m·v / (q·B)', d:'radius of the circular path'},
    {f:'B = µ₀·I / (2π·r)', d:'field around a straight wire'},
    {f:'B = µ₀·n·I', d:'field inside a solenoid'}
  ],
  example:{title:'Proton in a field',
    problem:'A proton at 2.0×10⁶ m/s enters a 0.50 T field perpendicular. Find the radius. (m = 1.67×10⁻²⁷ kg)',
    steps:['r = mv/(qB) = (1.67e-27 × 2.0e6)/(1.6e-19 × 0.50).','Numerator = 3.34e-21; denominator = 8.0e-20.','r = 0.042 m = 4.2 cm.']},
  realWorld:[
    'Every electric motor is F = BIL applied to a rotating coil.',
    'MRI uses ~1.5–3 T superconducting magnets to align proton spins.',
    'Earth\'s magnetic field deflects the solar wind toward the poles, producing aurorae.'
  ],
  videos:[{t:'Magnetic force on a wire', q:'magnetic force on current carrying wire physics'},{t:'Charged particle in magnetic field', q:'charged particle circular motion magnetic field'}],
  terms:['magnetic flux density','tesla','left-hand rule','solenoid','mass spectrometer']
}),
CH({
  id:'c8-induction', title:'Electromagnetic Induction', level:'y12', sim:'induction',
  summary:'Change the flux through a circuit and you generate a voltage. Every generator and transformer on Earth runs on this.',
  sections:[
    {h:'Magnetic flux',
     body:`Φ = BA cos θ, measured in webers. Flux linkage for N turns is NΦ. Three ways to change it: change B, change the area A, or rotate the coil to change θ. A generator uses the third.`},
    {h:"Faraday's and Lenz's laws",
     body:`Faraday: the induced EMF equals the rate of change of flux linkage, ε = −N dΦ/dt. Lenz's law is the minus sign: the induced current opposes the change that created it. It is conservation of energy — if the induced effect helped the change, you would get free energy. Drop a magnet through a copper pipe and it falls in slow motion; the induced eddy currents fight the motion.`},
    {h:'Generators and transformers',
     body:`Rotating a coil in a field gives ε = NBAω sin(ωt) — a sinusoidal AC output, which is why mains electricity is a sine wave. A transformer relies on a <i>changing</i> flux shared through an iron core: V<sub>s</sub>/V<sub>p</sub> = N<sub>s</sub>/N<sub>p</sub>, and for an ideal transformer V<sub>p</sub>I<sub>p</sub> = V<sub>s</sub>I<sub>s</sub>. Transformers do not work on DC, which settled the 19th-century "war of the currents" in favour of AC.`}
  ],
  formulas:[
    {f:'Φ = B·A·cosθ', d:'magnetic flux (weber)'},
    {f:'ε = −N·dΦ/dt', d:"Faraday's law with Lenz's minus sign"},
    {f:'ε = B·L·v', d:'EMF across a rod moving through a field'},
    {f:'V_s / V_p = N_s / N_p', d:'transformer ratio'},
    {f:'I_rms = I₀/√2', d:'RMS value of a sinusoidal AC'}
  ],
  example:{title:'Step-down transformer',
    problem:'A transformer takes 230 V from 800 primary turns. How many secondary turns give 12 V, and what secondary current if the primary draws 0.10 A (ideal)?',
    steps:['Ns = Np × Vs/Vp = 800 × 12/230 = 42 turns.','Power in = 230 × 0.10 = 23 W.','Is = 23/12 = 1.9 A. Voltage down, current up — power is conserved.']},
  realWorld:[
    'Induction cooktops induce eddy currents directly in the pan; the hob itself stays cool.',
    'Wireless phone charging is a transformer with an air gap.',
    'Electric guitar pickups sense the vibrating steel string changing the flux through a coil.'
  ],
  videos:[{t:'Faraday and Lenz law', q:'Faraday law Lenz law electromagnetic induction'},{t:'Transformers explained', q:'how transformers work physics'}],
  terms:['flux','flux linkage','Faraday law','Lenz law','eddy current','transformer','RMS']
}),
CH({
  id:'c8-em', title:'Electromagnetic Waves', level:'y11',
  summary:'Oscillating fields that regenerate each other and travel at c through nothing at all.',
  sections:[
    {h:'What an EM wave is',
     body:`A changing electric field creates a magnetic field, and a changing magnetic field creates an electric field. Maxwell showed the pair can sustain each other travelling at c = 1/√(ε₀µ₀) = 3.00×10⁸ m/s — a number that matched the measured speed of light and proved light <i>is</i> an EM wave. E and B are perpendicular to each other and to the direction of travel: EM waves are transverse and need no medium.`},
    {h:'The spectrum',
     body:`One continuous family, split by wavelength: radio (>1 m) → microwave (mm–cm) → infrared (µm) → visible (400–700 nm) → ultraviolet → X-ray → gamma (<10 pm). Shorter wavelength means higher frequency and higher photon energy — which is why UV and above are ionising and dangerous, while radio is not.`},
    {h:'Inverse square spreading',
     body:`Intensity from a point source falls as I = P/4πr². Move twice as far away and you receive a quarter of the power. This governs radio range, star brightness and radiation safety distances alike.`}
  ],
  formulas:[
    {f:'c = f·λ = 3.00×10⁸ m/s', d:'in a vacuum'},
    {f:'E = h·f', d:'photon energy, h = 6.63×10⁻³⁴ J·s'},
    {f:'I = P / (4π·r²)', d:'intensity from a point source'}
  ],
  example:{title:'Photon energy of blue light',
    problem:'Find the energy of a 450 nm photon in joules and electronvolts.',
    steps:['f = c/λ = 3.0e8 / 450e-9 = 6.67e14 Hz.','E = hf = 6.63e-34 × 6.67e14 = 4.42e-19 J.','In eV: 4.42e-19 / 1.60e-19 = 2.8 eV.']},
  realWorld:[
    'Microwave ovens use 2.45 GHz to rotate water molecules; the metal mesh in the door has holes far smaller than the 12 cm wavelength, so the waves cannot escape while light can.',
    '5G uses higher frequencies for bandwidth but they are blocked by walls, hence far more base stations.',
    'Astronomers observe every band because each reveals different physics — radio for cold gas, X-ray for accretion discs.'
  ],
  videos:[{t:'Electromagnetic spectrum', q:'electromagnetic spectrum explained physics'},{t:'What is an EM wave', q:'how electromagnetic waves work Maxwell'}],
  terms:['electromagnetic spectrum','speed of light','photon','transverse','ionising radiation']
})
]};

const UNIT_9 = {
  id:'u9', title:'Modern Physics', icon:'⚛️',
  blurb:'Where classical physics breaks: quanta, the nucleus, and relativity.',
  chapters:[
CH({
  id:'c9-quantum', title:'Quantum Nature of Light', level:'y12', sim:'photoelectric',
  summary:'The photoelectric effect killed the pure wave model of light and started quantum physics.',
  sections:[
    {h:'The experiment that broke classical physics',
     body:`Shine light on a metal and electrons are emitted — but only above a <b>threshold frequency</b>, no matter how intense the light. Below it, nothing happens even after hours. Above it, emission is instant even at feeble intensity. Wave theory predicts the opposite on every count.`},
    {h:"Einstein's photon explanation",
     body:`Light arrives as quanta of energy E = hf. One photon interacts with one electron. If hf is less than the work function φ (the energy binding the electron), nothing is emitted. Above threshold, the surplus becomes kinetic energy: hf = φ + KE<sub>max</sub>. Brighter light means <i>more</i> photons — more electrons — but not more energetic ones. This won Einstein the 1921 Nobel Prize (not relativity).`},
    {h:'Wave–particle duality',
     body:`Light behaves as a wave in interference and as a particle in the photoelectric effect. De Broglie extended this to matter: λ = h/p. Electrons diffract through crystals, confirming it — and electron microscopes exploit their picometre wavelengths to resolve detail light can never reach.`}
  ],
  formulas:[
    {f:'E = h·f = h·c/λ', d:'photon energy'},
    {f:'h·f = φ + KE_max', d:'photoelectric equation'},
    {f:'f₀ = φ / h', d:'threshold frequency'},
    {f:'λ = h / p = h / (m·v)', d:'de Broglie wavelength'}
  ],
  example:{title:'Photoelectrons from sodium',
    problem:'Sodium has φ = 2.28 eV. What is the maximum KE of electrons ejected by 400 nm light?',
    steps:['Photon energy: E = 1240/400 = 3.10 eV (using the handy hc = 1240 eV·nm).','KE_max = 3.10 − 2.28 = 0.82 eV.','Threshold wavelength: λ₀ = 1240/2.28 = 544 nm — green light works, red does not.']},
  realWorld:[
    'Solar panels are the photoelectric effect in a semiconductor; the band gap sets which photons can be harvested.',
    'Digital camera sensors count photoelectrons per pixel — image noise is literally photon statistics.',
    'Night-vision photomultipliers amplify a single photoelectron into a measurable pulse.'
  ],
  videos:[{t:'Photoelectric effect', q:'photoelectric effect explained physics'},{t:'Wave particle duality', q:'wave particle duality double slit electrons'}],
  terms:['photon','work function','threshold frequency','de Broglie wavelength','duality']
}),
CH({
  id:'c9-atom', title:'Atomic Structure and Spectra', level:'y12',
  summary:'Electrons occupy discrete energy levels; the light atoms emit is their fingerprint.',
  sections:[
    {h:'From plum pudding to nucleus',
     body:`Rutherford fired alpha particles at gold foil expecting slight deflections. A tiny fraction bounced almost straight back — "as if you had fired a 15-inch shell at tissue paper and it came back". The atom therefore has a minute, dense, positive nucleus with electrons far outside: an atom is over 99.99% empty space.`},
    {h:'Energy levels and spectra',
     body:`Electrons occupy discrete levels; for hydrogen E<sub>n</sub> = −13.6/n² eV. A photon is emitted when an electron drops: hf = E₂ − E₁. Because levels are discrete, only certain photon energies appear — a <b>line spectrum</b> unique to each element. Absorption spectra show the same lines as dark gaps, which is how we know what stars are made of without visiting them.`},
    {h:'Ionisation and excitation',
     body:`Ionisation energy is the energy to reach n = ∞ (13.6 eV for ground-state hydrogen). Excitation lifts an electron to a higher level, from which it falls back within nanoseconds, emitting a photon. Fluorescent tubes absorb UV and re-emit visible light through exactly this route.`}
  ],
  formulas:[
    {f:'E_n = −13.6 / n²  eV', d:'hydrogen energy levels'},
    {f:'h·f = E_high − E_low', d:'photon from a transition'},
    {f:'λ = h·c / ΔE', d:'wavelength of the emitted line'}
  ],
  example:{title:'The red hydrogen line',
    problem:'Find the wavelength emitted when hydrogen drops from n = 3 to n = 2.',
    steps:['E₃ = −13.6/9 = −1.51 eV; E₂ = −13.6/4 = −3.40 eV.','ΔE = 3.40 − 1.51 = 1.89 eV.','λ = 1240/1.89 = 656 nm — the deep red H-alpha line seen in every nebula photograph.']},
  realWorld:[
    'Sodium street lamps glow orange from the 589 nm doublet — one specific electron transition.',
    'Flame tests in chemistry identify metals by emission colour.',
    'Exoplanet atmospheres are identified by absorption lines in starlight passing through them.'
  ],
  videos:[{t:'Rutherford gold foil', q:'Rutherford gold foil experiment explained'},{t:'Atomic emission spectra', q:'atomic emission absorption spectra physics'}],
  terms:['nucleus','energy level','emission spectrum','absorption spectrum','ionisation','excitation']
}),
CH({
  id:'c9-nuclear', title:'Nuclear Physics and Radioactivity', level:'y12', sim:'decay',
  summary:'Unstable nuclei decay at random but with a precise statistical half-life. E = mc² supplies the energy.',
  sections:[
    {h:'Three radiations',
     body:`<b>Alpha</b> — a helium nucleus; heavily ionising, stopped by paper, dangerous if inhaled. <b>Beta</b> — an electron (or positron) from a neutron converting to a proton; stopped by a few mm of aluminium. <b>Gamma</b> — a high-energy photon released as the nucleus settles; reduced but never fully stopped, needs thick lead. Ionising power and penetrating power run in opposite directions.`},
    {h:'Half-life and randomness',
     body:`Decay is genuinely random per nucleus, yet with huge numbers the statistics are exact: N = N₀e<sup>−λt</sup>, with half-life t½ = ln2/λ. After n half-lives, the fraction left is (½)ⁿ. Half-lives range from microseconds to billions of years, which is what makes radiometric dating possible.`},
    {h:'Mass–energy and binding energy',
     body:`A nucleus weighs less than its separate nucleons; the missing <b>mass defect</b> is the binding energy, via E = mc². Plot binding energy per nucleon against mass number and it peaks at iron-56. Everything lighter releases energy by <b>fusion</b>, everything heavier by <b>fission</b>. That single curve explains stars, bombs and reactors.`}
  ],
  formulas:[
    {f:'N = N₀·e^(−λ·t)', d:'exponential decay'},
    {f:'t½ = ln2 / λ ≈ 0.693/λ', d:'half-life'},
    {f:'A = λ·N', d:'activity in becquerels'},
    {f:'E = Δm·c²', d:'mass–energy equivalence'}
  ],
  example:{title:'Carbon dating',
    problem:'Carbon-14 has a half-life of 5730 years. A sample shows 25% of the living-tissue level. How old is it?',
    steps:['25% = (½)² so exactly two half-lives have passed.','Age = 2 × 5730 = 11 460 years.','Below about 1% (7 half-lives, ~40 000 years) the remaining activity is too small to measure reliably — the practical limit of the method.']},
  realWorld:[
    'PET scans detect back-to-back gamma photons from positron annihilation to map metabolism.',
    'Smoke detectors use americium-241 alpha emission to ionise air; smoke disrupts the tiny current.',
    'Nuclear reactors control the chain reaction with neutron-absorbing boron or cadmium rods.'
  ],
  videos:[{t:'Radioactive decay and half-life', q:'radioactive decay half life physics explained'},{t:'Nuclear binding energy', q:'binding energy per nucleon fission fusion'}],
  terms:['alpha','beta','gamma','half-life','activity','mass defect','binding energy','fission','fusion']
}),
CH({
  id:'c9-rel', title:'Special Relativity', level:'y12',
  summary:'Hold the speed of light constant for everyone and space and time have to bend instead.',
  sections:[
    {h:'The two postulates',
     body:`1. The laws of physics are identical in all inertial frames. 2. The speed of light in a vacuum is c for every observer, regardless of their motion or the source's. The second is deeply counter-intuitive and is confirmed by every experiment ever done. Everything else follows by logic.`},
    {h:'Time dilation and length contraction',
     body:`Moving clocks run slow by the Lorentz factor γ = 1/√(1 − v²/c²), and moving objects contract along the direction of motion by the same factor. At everyday speeds γ ≈ 1.000000000001, which is why you never notice; at 0.9c, γ = 2.3.<br>
Cosmic-ray muons are the clean proof: their 2.2 µs lifetime should let them travel ~660 m, yet they reach the ground from 15 km up. In our frame their clock is slowed; in theirs, the atmosphere is contracted. Both descriptions give the same answer.`},
    {h:'Mass–energy and the speed limit',
     body:`Total energy E = γmc²; rest energy is mc². As v → c, γ → ∞, so accelerating a massive object to c would need infinite energy. Only massless particles travel at c, and they must always travel at exactly c.`}
  ],
  formulas:[
    {f:'γ = 1/√(1 − v²/c²)', d:'Lorentz factor'},
    {f:'Δt = γ·Δt₀', d:'time dilation (Δt₀ is proper time)'},
    {f:'L = L₀ / γ', d:'length contraction'},
    {f:'E = γ·m·c²', d:'total relativistic energy'}
  ],
  example:{title:'A fast spacecraft',
    problem:'A ship travels at 0.8c for 10 years of Earth time. How much time passes on board?',
    steps:['γ = 1/√(1 − 0.64) = 1/√0.36 = 1/0.6 = 1.667.','Δt₀ = Δt/γ = 10/1.667 = 6.0 years on board.','The crew ages 6 years while Earth ages 10 — and both observers agree, because their situations are not symmetric (the ship accelerated).']},
  realWorld:[
    'GPS satellites need both relativistic corrections; without them positions would drift ~10 km per day.',
    'Particle accelerators feed most of their energy into γ, not speed — LHC protons reach 0.999999991c.',
    'Nuclear power is E = mc² in practice: about 0.1% of the fuel mass becomes energy.'
  ],
  videos:[{t:'Special relativity basics', q:'special relativity time dilation explained'},{t:'Muon experiment', q:'muon time dilation experiment evidence'}],
  terms:['inertial frame','Lorentz factor','time dilation','length contraction','rest energy']
})
]};

const PHYSICS = {
  id:'physics', name:'Physics', icon:'⚛️',
  tagline:'From "what is a unit" to relativity — Year 11, Year 12 and beginner foundations.',
  units:[UNIT_1,UNIT_2,UNIT_3,UNIT_4,UNIT_5,UNIT_6,UNIT_7,UNIT_8,UNIT_9]
};

/* Add more subjects here later — same shape, and the whole app picks them up. */
const SUBJECTS = [PHYSICS];

const ALL_CHAPTERS = [];
SUBJECTS.forEach(s => s.units.forEach(u => u.chapters.forEach(c => {
  c._unit = u; c._subject = s; ALL_CHAPTERS.push(c);
})));
