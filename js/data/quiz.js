/* Question bank, keyed by chapter id. a = index of correct option. */
const QUIZ = {
'c0-what':[
 {q:'Where do physics formulas come from?',o:['They were invented first, then tested','Someone watched something happen, described it, then wrote it in symbols','They are guesses that cannot be checked','They come from mathematics alone'],a:1,e:'Observation comes first. The symbols are shorthand for a description that already made sense in words.'},
 {q:'Reading "v = u + at" as a sentence, it says…',o:['Speed equals time','New speed = old speed + what you gained','Distance equals speed','Acceleration equals velocity'],a:1,e:'Every equation in this course is a short English sentence in disguise.'},
 {q:'You drop a flat sheet of paper and a crumpled one. The crumpled one lands first because…',o:['it is heavier','gravity pulls it harder','the flat sheet meets more air resistance','it fell from higher up'],a:2,e:'Same paper, same weight. Only the air resistance changed — so that difference must be the cause.'},
 {q:'When you get stuck, the best first move is to…',o:['read the chapter again','draw the situation and name what is pushing what','skip to the next chapter','memorise the formula'],a:1,e:'A drawing plus naming the forces solves most problems before any algebra starts.'}],
'c0-learn':[
 {q:'Which is the stronger way to study?',o:['Re-reading the chapter three times','Closing the page and trying to recall it once','Highlighting the important lines','Copying out the formulas'],a:1,e:'Retrieval practice beats re-reading by a wide margin. It feels harder, which is exactly why it works.'},
 {q:'Why does spacing your study beat cramming?',o:['It takes less total time','Meeting material again as it starts to fade makes the memory last much longer','Teachers prefer it','It avoids tiredness'],a:1,e:'The gap is the active ingredient, not the total hours.'},
 {q:'Practising twenty projectile questions in a row is weaker than mixing topics because…',o:['it is boring','you stop reading the question — you already know the method','projectiles are easy','mixing is faster'],a:1,e:'Interleaving forces you to identify the problem type, which is the skill exams actually test.'},
 {q:'Which is NOT a real sign that you have learned something?',o:['You can explain it to a non-physicist','You can predict the simulation before moving a slider','The chapter feels familiar while you re-read it','You can tell which chapter a random question belongs to'],a:2,e:'Familiarity while re-reading is the most common illusion of learning. Recall from a blank page is the real test.'}],
'c1-units':[
 {q:'Which of these is NOT an SI base unit?',o:['kilogram','newton','kelvin','mole'],a:1,e:'The newton is derived: 1 N = 1 kg·m·s⁻².'},
 {q:'Express 4.7 GW in watts.',o:['4.7×10⁶ W','4.7×10⁹ W','4.7×10¹² W','4.7×10³ W'],a:1,e:'Giga = 10⁹.'},
 {q:'A student writes E = mv. Dimensional analysis says…',o:['it is correct','it gives kg·m/s, which is momentum not energy','it gives joules','dimensions cannot test this'],a:1,e:'Energy needs kg·m²/s². The formula is missing a velocity (and the ½).'},
 {q:'Convert 72 km/h to m/s.',o:['20 m/s','7.2 m/s','200 m/s','25 m/s'],a:0,e:'Divide by 3.6: 72/3.6 = 20 m/s.'}],
'c1-measure':[
 {q:'A stopwatch that always runs 2 s slow introduces…',o:['random error','systematic error','parallax error','no error'],a:1,e:'A consistent offset is systematic; averaging will not remove it.'},
 {q:'x = 5.00 ± 0.05 m. The percentage uncertainty is…',o:['0.05%','1.0%','5.0%','0.5%'],a:1,e:'(0.05/5.00)×100 = 1.0%.'},
 {q:'If a length with 2% uncertainty is cubed, the uncertainty in the volume is…',o:['2%','4%','6%','0.67%'],a:2,e:'For xⁿ the fractional uncertainty multiplies by n: 3 × 2% = 6%.'},
 {q:'2.5 m ÷ 1.25 s should be quoted as…',o:['2 m/s','2.0 m/s','2.00 m/s','2.000 m/s'],a:1,e:'Fewest significant figures among inputs is 2, so 2.0 m/s.'}],
'c1-vectors':[
 {q:'Which is a vector?',o:['speed','mass','displacement','temperature'],a:2,e:'Displacement has direction; the others are scalars.'},
 {q:'Forces of 3 N east and 4 N north give a resultant of…',o:['7 N','5 N','1 N','12 N'],a:1,e:'Perpendicular: √(9+16) = 5 N.'},
 {q:'A 100 N force at 30° above horizontal has vertical component…',o:['86.6 N','50 N','100 N','30 N'],a:1,e:'F sin30° = 100 × 0.5 = 50 N.'},
 {q:'You run one full lap of a 400 m track. Displacement and distance are…',o:['400 m and 400 m','0 and 400 m','400 m and 0','0 and 0'],a:1,e:'You return to the start, so displacement is zero.'}],
'c2-linear':[
 {q:'Which SUVAT equation contains no time?',o:['v = u + at','s = ut + ½at²','v² = u² + 2as','s = ½(u+v)t'],a:2,e:'v² = u² + 2as links velocity to displacement directly.'},
 {q:'A car at 20 m/s brakes at 4 m/s². Stopping distance?',o:['25 m','50 m','80 m','100 m'],a:1,e:'s = u²/(2a) = 400/8 = 50 m.'},
 {q:'An object is thrown straight up. At the top its acceleration is…',o:['zero','9.81 m/s² downward','9.81 m/s² upward','undefined'],a:1,e:'Velocity is momentarily zero, but gravity still acts.'},
 {q:'Doubling the speed of a car multiplies the braking distance by…',o:['2','3','4','√2'],a:2,e:'s ∝ u², so ×4.'}],
'c2-graphs':[
 {q:'The gradient of a velocity–time graph gives…',o:['displacement','acceleration','jerk','speed'],a:1,e:'a = dv/dt.'},
 {q:'The area under a velocity–time graph gives…',o:['acceleration','displacement','force','power'],a:1,e:'Area = ∫v dt = displacement.'},
 {q:'A horizontal line on a velocity–time graph means…',o:['object is stationary','constant velocity, zero acceleration','constant acceleration','object is decelerating'],a:1,e:'Zero gradient means no acceleration, not no motion.'},
 {q:'A skydiver reaching terminal velocity shows a v–t graph that…',o:['keeps rising linearly','flattens to a constant value','returns to zero','oscillates'],a:1,e:'Drag equals weight, so acceleration (gradient) falls to zero.'}],
'c2-projectile':[
 {q:'For a projectile with no air resistance, the horizontal velocity…',o:['decreases steadily','stays constant','increases','reverses at the top'],a:1,e:'No horizontal force, so no horizontal acceleration.'},
 {q:'A ball thrown horizontally and one dropped from the same height…',o:['the dropped one lands first','the thrown one lands first','they land together','depends on the mass'],a:2,e:'Vertical motion is identical and independent of horizontal motion.'},
 {q:'The maximum range on level ground occurs at a launch angle of…',o:['30°','45°','60°','90°'],a:1,e:'R ∝ sin2θ, maximised when 2θ = 90°.'},
 {q:'At the top of a projectile\'s path…',o:['velocity is zero','vertical velocity is zero','acceleration is zero','both components are zero'],a:1,e:'It still moves horizontally, and g still acts.'}],
'c3-newton':[
 {q:'A car travels at constant velocity. The net force on it is…',o:['forward','zero','backward','equal to its weight'],a:1,e:'Constant velocity means zero acceleration, so zero net force.'},
 {q:'A book rests on a table. The reaction pair to the book\'s weight is…',o:['the normal force from the table','the book pulling the Earth up','friction','the table\'s weight'],a:1,e:'Third-law pairs act on different bodies: Earth pulls book, book pulls Earth.'},
 {q:'A 1500 kg car accelerates at 3 m/s². Net force?',o:['500 N','4500 N','1500 N','45 000 N'],a:1,e:'F = ma = 1500 × 3.'},
 {q:'In a lift accelerating downward, your apparent weight…',o:['increases','decreases','is unchanged','becomes zero'],a:1,e:'N = m(g − a), which is less than mg.'}],
'c3-friction':[
 {q:'Friction force is proportional to…',o:['contact area','the normal force','the object\'s volume','speed'],a:1,e:'f = µN; area barely matters for rigid surfaces.'},
 {q:'A block starts sliding when tanθ equals…',o:['µk','µs','1/µs','µs·g'],a:1,e:'mg sinθ = µs mg cosθ gives tanθ = µs.'},
 {q:'Which is generally true?',o:['µs > µk','µk > µs','they are always equal','µ can exceed 10 for normal surfaces'],a:0,e:'It takes more force to start sliding than to keep it going.'},
 {q:'On a 30° slope with µk = 0.1, acceleration ≈ …',o:['4.1 m/s²','9.8 m/s²','0.5 m/s²','2.0 m/s²'],a:0,e:'a = g(sin30 − 0.1cos30) = 9.81(0.5 − 0.087) ≈ 4.1 m/s².'}],
'c3-circular':[
 {q:'An object in uniform circular motion has…',o:['constant velocity','zero acceleration','constant speed but changing velocity','no net force'],a:2,e:'Direction changes, so velocity changes and there is centripetal acceleration.'},
 {q:'Centripetal acceleration equals…',o:['v/r','v²/r','vr','r/v²'],a:1,e:'a = v²/r = ω²r.'},
 {q:'Doubling the speed around the same bend multiplies the required force by…',o:['2','4','½','√2'],a:1,e:'F ∝ v².'},
 {q:'On a banked track at the design speed…',o:['friction supplies all the force','the horizontal component of the normal force supplies it','gravity supplies it','no force is needed'],a:1,e:'That is the whole point of banking — no sideways friction required.'}],
'c3-gravity':[
 {q:'If the distance between two masses triples, the gravitational force becomes…',o:['1/3','1/9','3×','9×'],a:1,e:'Inverse square: 1/3² = 1/9.'},
 {q:'Orbital speed for a circular orbit depends on…',o:['the satellite\'s mass','the central mass and radius only','the satellite\'s shape','the launch site'],a:1,e:'v = √(GM/r); satellite mass cancels.'},
 {q:"Kepler's third law states…",o:['T ∝ r','T² ∝ r³','T³ ∝ r²','T ∝ 1/r'],a:1,e:'T² = (4π²/GM)r³.'},
 {q:'Astronauts on the ISS float because…',o:['there is no gravity at that altitude','they are in continuous free fall','the station spins','they are beyond the atmosphere'],a:1,e:'g is still ~8.7 N/kg there; both station and crew fall together.'}],
'c4-energy':[
 {q:'Carrying a box horizontally at constant speed, the work you do against gravity is…',o:['mgh','zero','½mv²','Fd'],a:1,e:'Force (up) is perpendicular to displacement (horizontal): cos90° = 0.'},
 {q:'Doubling an object\'s speed multiplies its kinetic energy by…',o:['2','4','√2','8'],a:1,e:'KE = ½mv².'},
 {q:'A frictionless 20 m drop gives a final speed of…',o:['14 m/s','20 m/s','28 m/s','40 m/s'],a:1,e:'v = √(2gh) = √(392) ≈ 19.8 ≈ 20 m/s.'},
 {q:'Power is…',o:['force × distance','energy per unit time','mass × acceleration','work × time'],a:1,e:'P = W/t, also P = Fv.'}],
'c4-momentum':[
 {q:'Momentum is conserved in…',o:['elastic collisions only','inelastic collisions only','all collisions with no external force','no collisions'],a:2,e:'Kinetic energy is what distinguishes elastic from inelastic; momentum is always conserved.'},
 {q:'Airbags reduce injury by…',o:['reducing the momentum change','increasing the collision time','increasing the force','reducing your mass'],a:1,e:'J = FΔt is fixed, so longer Δt means smaller F.'},
 {q:'A 2 kg trolley at 3 m/s hits a stationary 4 kg trolley and they stick. Final speed?',o:['1.0 m/s','1.5 m/s','2.0 m/s','3.0 m/s'],a:0,e:'6 = 6v → v = 1.0 m/s.'},
 {q:'The unit of impulse is…',o:['N','N·s','J','W'],a:1,e:'N·s, identical to kg·m/s, the unit of momentum.'}],
'c4-shm':[
 {q:'SHM requires acceleration that is…',o:['constant','proportional to and opposite the displacement','proportional to velocity','zero'],a:1,e:'a = −ω²x is the defining condition.'},
 {q:'The period of a simple pendulum depends on…',o:['mass and length','length and g','amplitude and mass','mass only'],a:1,e:'T = 2π√(L/g) — no mass, and no amplitude for small angles.'},
 {q:'In SHM, maximum speed occurs…',o:['at maximum displacement','at the equilibrium position','at ¼ amplitude','it is constant'],a:1,e:'v_max = Aω at x = 0, where acceleration is zero.'},
 {q:'Critical damping is desirable in a car suspension because…',o:['it oscillates longest','it returns to equilibrium fastest without overshoot','it amplifies the bump','it removes gravity'],a:1,e:'That is the definition of critical damping.'}],
'c5-waves':[
 {q:'Which quantity stays the same when a wave enters a new medium?',o:['speed','wavelength','frequency','amplitude'],a:2,e:'The source sets the frequency; speed and wavelength change together.'},
 {q:'Sound waves are…',o:['transverse','longitudinal','electromagnetic','always polarised'],a:1,e:'They are pressure compressions along the direction of travel.'},
 {q:'A 500 Hz wave travelling at 340 m/s has wavelength…',o:['0.68 m','1.47 m','170 m','0.34 m'],a:0,e:'λ = v/f = 340/500 = 0.68 m.'},
 {q:'Total internal reflection requires…',o:['going from less to more dense','going from more to less dense above the critical angle','any angle','a vacuum'],a:1,e:'n₁ > n₂ and θ > θc.'}],
'c5-super':[
 {q:'Constructive interference occurs when the path difference is…',o:['nλ','(n+½)λ','λ/4','always zero'],a:0,e:'Whole numbers of wavelengths arrive in phase.'},
 {q:'In a standing wave, a node is a point of…',o:['maximum amplitude','zero amplitude','maximum energy flow','maximum frequency'],a:1,e:'Destructive interference is permanent there.'},
 {q:'The distance between adjacent nodes is…',o:['λ','λ/2','λ/4','2λ'],a:1,e:'Half a wavelength.'},
 {q:'A pipe closed at one end produces…',o:['all harmonics','only odd harmonics','only even harmonics','no harmonics'],a:1,e:'f = nv/4L with n odd; that is why a clarinet sounds hollow.'}],
'c5-doppler':[
 {q:'As an ambulance passes you, the pitch…',o:['rises','falls suddenly','stays the same','rises then rises again'],a:1,e:'Approaching compresses wavefronts; receding stretches them.'},
 {q:'Distant galaxies show redshift, meaning they are…',o:['approaching','receding','stationary','made of red light'],a:1,e:'Stretched wavelengths — evidence for cosmic expansion.'},
 {q:'A sonic boom occurs when the source speed…',o:['equals or exceeds the wave speed','is half the wave speed','is zero','is the speed of light'],a:0,e:'Wavefronts pile up into a Mach cone.'},
 {q:'An increase of 20 dB corresponds to an intensity increase of…',o:['×2','×20','×100','×1000'],a:2,e:'dB is logarithmic: 10^(20/10) = 100.'}],
'c5-optics':[
 {q:'An object placed inside the focal length of a converging lens forms an image that is…',o:['real and inverted','virtual, upright and magnified','real and diminished','at infinity'],a:1,e:'That is the magnifying-glass case.'},
 {q:'The lens equation is…',o:['1/f = 1/u + 1/v','f = u + v','1/f = u + v','f = uv'],a:0,e:'Thin lens formula.'},
 {q:'A magnification of −2 means the image is…',o:['half size, upright','twice size, inverted','twice size, upright','virtual and small'],a:1,e:'The minus sign indicates inversion.'},
 {q:'A lens of focal length 0.25 m has power…',o:['0.25 D','4 D','2.5 D','25 D'],a:1,e:'P = 1/f = 4 dioptres.'}],
'c6-heat':[
 {q:'Temperature is a measure of…',o:['total internal energy','average kinetic energy per particle','heat content','mass'],a:1,e:'Internal energy also depends on how many particles you have.'},
 {q:'Energy to raise 2 kg of water by 10 K (c = 4180) is…',o:['8360 J','41 800 J','83 600 J','418 J'],a:2,e:'Q = mcΔT = 2 × 4180 × 10.'},
 {q:'During melting, the temperature…',o:['rises steadily','stays constant','falls','oscillates'],a:1,e:'Energy goes into breaking bonds, not raising KE.'},
 {q:'The only heat transfer method that works through a vacuum is…',o:['conduction','convection','radiation','all of them'],a:2,e:'EM waves need no medium.'}],
'c6-gas':[
 {q:'At constant temperature, halving the volume of a gas…',o:['halves the pressure','doubles the pressure','leaves pressure unchanged','quadruples the pressure'],a:1,e:"Boyle's law: p ∝ 1/V."},
 {q:'In gas law calculations temperature must be in…',o:['°C','K','°F','any unit'],a:1,e:'Kelvin — the laws are proportional to absolute temperature.'},
 {q:'Mean molecular kinetic energy depends on…',o:['the gas type','temperature only','pressure only','volume'],a:1,e:'½m⟨c²⟩ = (3/2)kT.'},
 {q:'At the same temperature, helium molecules move ___ than oxygen molecules.',o:['slower','faster','at the same speed','not at all'],a:1,e:'Same KE, smaller mass → higher speed.'}],
'c6-thermo':[
 {q:'The first law of thermodynamics is a statement of…',o:['entropy increase','energy conservation','momentum conservation','charge conservation'],a:1,e:'ΔU = Q − W.'},
 {q:'In an adiabatic process…',o:['temperature is constant','no heat is exchanged','volume is constant','pressure is constant'],a:1,e:'Q = 0, so work changes internal energy directly.'},
 {q:'An engine between 600 K and 300 K has a maximum efficiency of…',o:['25%','50%','75%','100%'],a:1,e:'η = 1 − 300/600 = 0.5.'},
 {q:'The second law implies…',o:['heat can flow spontaneously from cold to hot','entropy of an isolated system never decreases','engines can be 100% efficient','energy can be destroyed'],a:1,e:'ΔS ≥ 0 sets the arrow of time.'}],
'c7-static':[
 {q:'Coulomb\'s law force varies with separation as…',o:['1/r','1/r²','r','r²'],a:1,e:'Inverse square, like gravity.'},
 {q:'The unit of electric field strength is…',o:['N/C, equivalently V/m','C/N','J/C','V·m'],a:0,e:'Force per unit charge, or potential gradient.'},
 {q:'Between parallel plates 2 cm apart at 100 V, the field is…',o:['50 V/m','200 V/m','5000 V/m','2 V/m'],a:2,e:'E = V/d = 100/0.02.'},
 {q:'One electronvolt equals…',o:['1 J','1.6×10⁻¹⁹ J','9.1×10⁻³¹ J','6.6×10⁻³⁴ J'],a:1,e:'The charge on an electron times one volt.'}],
'c7-circuits':[
 {q:'Two 4 Ω resistors in parallel give…',o:['8 Ω','4 Ω','2 Ω','1 Ω'],a:2,e:'1/R = 1/4 + 1/4 → R = 2 Ω.'},
 {q:'In a series circuit the same everywhere is…',o:['voltage','current','resistance','power'],a:1,e:'One path, so one current.'},
 {q:'Power dissipated by 2 A through 10 Ω is…',o:['20 W','40 W','5 W','200 W'],a:1,e:'P = I²R = 4 × 10.'},
 {q:'Transmission uses high voltage to…',o:['increase current','reduce I²R losses','reduce the voltage at homes directly','increase resistance'],a:1,e:'Same power at higher V means lower I, and losses go as I².'},
 {q:'Terminal voltage of a cell falls under load because of…',o:['Ohm\'s law failing','internal resistance','Lenz\'s law','capacitance'],a:1,e:'V = ε − Ir.'}],
'c7-cap':[
 {q:'Capacitance is defined as…',o:['Q/V','V/Q','QV','Q²V'],a:0,e:'Charge stored per volt.'},
 {q:'Energy stored in a capacitor is…',o:['QV','½CV²','CV','½QV²'],a:1,e:'Also ½QV and Q²/2C.'},
 {q:'The time constant of a 10 kΩ resistor and 100 µF capacitor is…',o:['1 ms','1 s','10 s','0.1 s'],a:1,e:'τ = RC = 10⁴ × 10⁻⁴ = 1 s.'},
 {q:'After one time constant, the charge has fallen to about…',o:['50%','37%','63%','13%'],a:1,e:'e⁻¹ ≈ 0.37.'}],
'c8-magforce':[
 {q:'The force on a charge moving parallel to a magnetic field is…',o:['maximum','zero','qvB','undefined'],a:1,e:'F = qvB sinθ and sin0° = 0.'},
 {q:'A magnetic force on a moving charge does no work because it is…',o:['very small','perpendicular to the velocity','always negative','conservative'],a:1,e:'It changes direction, not speed.'},
 {q:'The radius of a charged particle\'s circular path is…',o:['mv/(qB)','qB/(mv)','mvB/q','qvB'],a:0,e:'From qvB = mv²/r.'},
 {q:'The field inside a long solenoid is…',o:['zero','µ₀nI and nearly uniform','proportional to 1/r','strongest at the ends'],a:1,e:'n is turns per metre.'}],
'c8-induction':[
 {q:"Lenz's law says the induced current…",o:['aids the change in flux','opposes the change in flux','is always zero','flows only in DC'],a:1,e:'Otherwise energy would not be conserved.'},
 {q:'A transformer will not work on DC because…',o:['DC has too much current','there is no changing flux','the core melts','DC has no voltage'],a:1,e:'Induction requires dΦ/dt ≠ 0.'},
 {q:'A step-down transformer with 1000:100 turns fed 240 V outputs…',o:['2400 V','24 V','240 V','120 V'],a:1,e:'Vs = 240 × 100/1000.'},
 {q:'A magnet dropped through a copper pipe falls slowly because of…',o:['air resistance','induced eddy currents opposing the motion','magnetic attraction to copper','static electricity'],a:1,e:"Lenz's law in action; copper is not even ferromagnetic."}],
'c8-em':[
 {q:'Electromagnetic waves are…',o:['longitudinal and need a medium','transverse and travel through a vacuum','only visible light','slower than sound'],a:1,e:'E and B oscillate perpendicular to travel; no medium needed.'},
 {q:'Which has the highest photon energy?',o:['radio','infrared','ultraviolet','gamma'],a:3,e:'E = hf, and gamma has the highest frequency.'},
 {q:'At three times the distance from a point source, intensity is…',o:['1/3','1/9','3×','unchanged'],a:1,e:'I ∝ 1/r².'},
 {q:'The speed of light in a vacuum is…',o:['3×10⁶ m/s','3×10⁸ m/s','3×10¹⁰ m/s','340 m/s'],a:1,e:'299 792 458 m/s exactly, by definition of the metre.'}],
'c9-quantum':[
 {q:'The photoelectric effect shows that light…',o:['is purely a wave','delivers energy in discrete quanta','has no energy','travels slower in metals'],a:1,e:'One photon, one electron, threshold frequency.'},
 {q:'Increasing the intensity of light above the threshold frequency increases…',o:['the KE of each electron','the number of electrons emitted','the work function','the threshold frequency'],a:1,e:'More photons, not more energetic ones.'},
 {q:'For a metal with φ = 2.0 eV lit by 3.0 eV photons, KE_max is…',o:['5.0 eV','1.0 eV','2.0 eV','0'],a:1,e:'KE = hf − φ.'},
 {q:'The de Broglie wavelength of a particle is…',o:['h/p','hp','p/h','hc/p'],a:0,e:'λ = h/(mv).'}],
'c9-atom':[
 {q:'Rutherford\'s gold foil experiment showed the atom has…',o:['uniformly spread positive charge','a tiny dense nucleus','no charge','electrons in the centre'],a:1,e:'A few alphas bounced almost straight back.'},
 {q:'Line spectra prove that electron energies are…',o:['continuous','discrete','zero','random'],a:1,e:'Only certain transitions, so only certain photon energies.'},
 {q:'Hydrogen\'s n = 2 level has energy…',o:['−13.6 eV','−3.40 eV','−1.51 eV','0'],a:1,e:'−13.6/4 = −3.40 eV.'},
 {q:'Dark lines in a star\'s spectrum indicate…',o:['emission by the star','absorption by cooler gas','the star is dying','Doppler shift only'],a:1,e:'Cooler outer gas absorbs the same wavelengths it would emit.'}],
'c9-nuclear':[
 {q:'Which radiation is most penetrating?',o:['alpha','beta','gamma','all equal'],a:2,e:'Gamma needs thick lead; alpha is stopped by paper.'},
 {q:'After 3 half-lives the remaining fraction is…',o:['1/3','1/6','1/8','1/9'],a:2,e:'(½)³ = 1/8.'},
 {q:'Binding energy per nucleon peaks at…',o:['hydrogen','iron-56','uranium-238','helium-4'],a:1,e:'Hence fusion below it, fission above it.'},
 {q:'The mass defect of a nucleus corresponds to…',o:['measurement error','the binding energy via E = mc²','the neutron count','the electron mass'],a:1,e:'Bound nuclei weigh less than their parts.'}],
'c9-rel':[
 {q:'The second postulate of special relativity says…',o:['nothing can move','light speed is the same for all observers','time is absolute','mass is constant'],a:1,e:'Everything else follows from holding c fixed.'},
 {q:'At v = 0.6c the Lorentz factor is…',o:['1.00','1.25','1.67','2.00'],a:1,e:'γ = 1/√(1−0.36) = 1/0.8 = 1.25.'},
 {q:'A moving clock, viewed from a stationary frame…',o:['runs fast','runs slow','stops','is unaffected'],a:1,e:'Time dilation: Δt = γΔt₀.'},
 {q:'Cosmic-ray muons reach the ground because…',o:['they travel faster than light','of time dilation / length contraction','they never decay','they are massless'],a:1,e:'Their clocks run slow in our frame; in theirs the atmosphere is contracted.'}]
};
