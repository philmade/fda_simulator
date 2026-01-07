import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { AlertTriangle, ShieldCheck, Skull, ArrowRight, RotateCcw, BookOpen, User, Lock, CheckCircle2, ChevronDown, FileText, Filter, Scale, Activity, Loader2, Undo2, Zap } from 'lucide-react';

// --- ASSET CONFIGURATION ---
const ASSETS = {
  preamble: "https://i.ibb.co/CFYPs1y/office-FDA.jpg",
  director: {
    intro: "https://i.ibb.co/gFMTWjGm/vance.png",
    fail: "https://i.ibb.co/Wvch7x1W/Gemini-Generated-Image-uraz96uraz96uraz.jpg",
    win: "https://i.ibb.co/jvRXfb43/vance-beer.jpg",
    step1: "https://i.ibb.co/HLwbp8bG/watch.jpg",
    step2: "https://i.ibb.co/21QTwNXN/hands-on-face.jpg",
    step3: "https://i.ibb.co/9kyg9Thy/on-phone.jpg",
    step4: "https://i.ibb.co/V0qYMVc3/blinds.jpg",
  },
  options: {
    soluble: "https://i.ibb.co/yFNtZgcM/Gemini-Generated-Image-ixvqpiixvqpiixvq.jpg",
    particulate: "https://i.ibb.co/5hkDPmK2/Gemini-Generated-Image-lq43relq43relq43.jpg",
    magic: "https://i.ibb.co/tT4TbDp9/magic-partcles.jpg",
    physics: "https://i.ibb.co/xqXKj9FL/blocked-particles.jpg",
    oral: "https://i.ibb.co/Kct5hXpk/gut-ingestion.jpg",
    injectable: "https://i.ibb.co/TxB09hTx/lymph-injection.jpg",
    standard: "https://i.ibb.co/RGBjz443/3-5kg-baby.jpg",
    preemie: "https://i.ibb.co/BHT2hv76/2-5kg-baby.jpg"
  }
};

// --- HERO / DIALOGUE CONFIGURATION ---
const HERO_CONTENT = {
  intro: {
    badge: "Director Vance - FDA HQ",
    title: "CLOSE THE DOOR.",
    lines: [
      { text: "WE HAVE A PR DISASTER AFTER THIS MERCURY CASE. THE PRESS IS ASKING ABOUT ALUMINUM ADJUVANTS.", style: "text-slate-300" },
      { text: "THEY WANT TO KNOW IF IT ACCUMULATES IN THE BRAIN.", style: "text-white" },
      { text: "WE HAVE ZERO INFANT SAFETY DATA. NONE.", style: "text-rose-500 font-bold" }, 
      { text: "I NEED A STUDY THAT PROVES IT'S SAFE. GET IT DONE!", style: "text-blue-200" }
    ]
  },
  fail: {
    badge: "Mission Failure",
    title: "ARE YOU CRAZY?!",
    lines: [
      { text: "YOU CAN'T JUST BIOPSY BABIES! ETHICS WOULD HANG US.", style: "text-slate-200" },
      { text: "WE CAN'T LOOK FOR THE ALUMINUM.", style: "text-rose-500 font-bold" },
      { text: "WE HAVE TO SIMULATE IT. MAKE A MODEL!.", style: "text-white font-black text-xl" }
    ]
  },
  steps: {
    elimination: "HURRY UP AND BUILD THAT MODEL! DON'T GET BOGGED DOWN IN CHEMISTRY! JUST PICK THE DATASET THAT KEEPS THE LINE MOVING!",
    filter: "PICK A KIDNEY MODEL! AND REMEMBER, I DON'T CARE ABOUT PHYSICS! I CARE ABOUT CLEARANCE RATES!",
    ruler: "FIND ME A WORKABLE TOXICITY! IF YOU SET THE BAR TOO LOW, WE FAIL! FIND A STANDARD WE CAN ACTUALLY MEET!",
    absorption: "GOOD CHOICE ON THE ORAL STANDARD! NOW — HOW MUCH DO PEOPLE ACTUALLY ABSORB WHEN THEY EAT IT? FIND ME THE RIGHT NUMBER!",
    baseline: "LAST STEP! PICK A PATIENT PROFILE! AND REMEMBER — WE'RE NOT TRYING TO PROVE IT'S DANGEROUS!"
  }
};

// --- CONSTANTS ---
const STAGES = {
  PREAMBLE: 'preamble',
  INTRO: 'intro',
  CLINICAL_FAIL: 'clinical_fail',
  GAME_INTRO: 'game_intro',
  STEP_1_TYPE: 'step_1',
  STEP_2_FILTER: 'step_2',
  STEP_3_THRESHOLD: 'step_3',
  STEP_3B_ABSORPTION: 'step_3b',
  STEP_4_BASELINE: 'step_4',
  SIMULATION: 'simulation',
};

// --- DECISION CONFIGURATION ---
const DECISIONS = {
  elimination: {
    icon: FileText,
    title: "Step 1: The Input Data",
    shortTitle: "Input",
    question: "We need to simulate how aluminium moves through the body, but...",
    narrative: "We have a data gap. We don't actually know how fast vaccine nanoparticles are cleared... We have to find a dataset we can use, perhaps from a different study.",
    narrativeQuestion: "Do we run the simulation using data from a dissolvable Aluminium salt, which leaves quickly, or the actual Aluminium used in the vaccines?",
    options: [
      {
        id: 'soluble',
        label: "The 'Priest' Data",
        footerLabel: "Soluble",
        sub: "(Dissolved Salts)",
        desc: "Use Dr. Priest's data from injected Aluminum Citrate, a salt that dissolves in water. He injected a tiny amount of it too... It's good data but the formulation is completely different to what's in the vaccine. The dose is also much smaller.",
        implication: "Math assumes aluminum flushes out rapidly (45% in 24hrs).",
        type: "safe",
        isOfficial: true // This is the 'Trick'
      },
      {
        id: 'particulate',
        label: "The Real Ingredient",
        footerLabel: "Particulate",
        sub: "(Solid Nanoparticles)",
        desc: "Find data for the actual ingredient used: Aluminum Hydroxide or Aluminium Phosphate crystals. They are designed not to dissolve and so they behave differently to Dr Priest's formula.",
        implication: "Math shows aluminum could be trapped in body for years.",
        type: "toxic", 
        isOfficial: false
      }
    ]
  },
  filter: {
    icon: Filter,
    title: "Step 2: The Kidney Filter",
    shortTitle: "Filter",
    question: "The aluminum is in the form of nanoparticles. Can they fit through the kidney's filter?",
    narrative: "The math model assumes that if aluminum is in the blood, the kidneys can grab it and clear it. But the kidney is just a biological sieve with very small holes (8nm).",
    narrativeQuestion: "What if larger crystals of aluminium get into the blood? Do we ignore physics and assume the particles can pass through into the kidney?",
    options: [
      {
        id: 'magic',
        label: "The 'Magic' Filter",
        footerLabel: "Magic",
        sub: "(Official Assumption)",
        desc: "Assume the aluminium particles behave like water. Even though the particles are 1000x bigger than the kidney pores, use math that assumes they pass right through.",
        implication: "The aluminium will be quickly cleared by the kidneys.",
        type: "safe",
        isOfficial: true
      },
      {
        id: 'physics',
        label: "The 'Physics' Filter",
        footerLabel: "Blocked",
        sub: "(Pore Size Limit)",
        desc: "Respect the size limit. The kidney filter is 8nm wide. The vaccine particles could be 10,000nm wide. They are physically too big to be processed through the kidney.",
        implication: "The body must first break down the aluminium to smaller particles somehow.",
        type: "toxic",
        isOfficial: false
      }
    ]
  },
  ruler: {
    icon: Scale,
    title: "Step 3: The Safety Limit",
    shortTitle: "Limit",
    question: "How much aluminum is 'Too Much'? Where is the Red Line?",
    narrative: "This is the most critical part of our model. How we calculate the toxic limit will strongly influence the result.",
    narrativeQuestion: "Should we model toxicity based on how to body responds to EATING it or how it responds to it being INJECTED?",
    options: [
      {
        id: 'oral',
        label: "The 'Oral' Standard",
        footerLabel: "Eating",
        sub: "(Ingestion MRL)",
        desc: "Use the safety limit for EATING aluminum. Since you poop out 99.9% of what you eat, this limit is huge.",
        implication: "The Safety bar will be set quite high. It's hard to fail from here.",
        type: "safe",
        isOfficial: true
      },
      {
        id: 'injectable',
        label: "The 'IV' Standard",
        footerLabel: "IV Line",
        sub: "(Parenteral Limit)",
        desc: "Use the FDA limit for Introvenous fluids (4-5 mcg/kg). This is the only standard you can find for aluminum entering the body via a needle. ",
        implication: "These limits look tight...How much aluminum is in that vaccine again?",
        type: "toxic",
        isOfficial: false
      }
    ]
  },
  absorption: {
    icon: Scale,
    title: "Step 3b: The 'Exchange Rate'", // Changed to match the metaphor
    shortTitle: "Absorb",
    question: "We have a Safe Limit for EATING aluminum but we need to convert it to a Safe Limit for BLOOD levels...",
    narrative: "If eating 100 units is safe, and the gut only absorbs 1% into the blood, it means having 1 unit in the blood must be safe. The 'Absorption Rate' directly determines the safe amount we'll use for the model.",
    narrativeQuestion: "Maybe there's leeway here... Do we use the modern, strict absorption rate, or dig up an older, higher number?",
    noImages: true,
    options: [
      {
        id: 'low_absorption',
        label: "0.1% (Modern Science)",
        footerLabel: "0.1%",
        sub: "(Strict Standard)",
        desc: "Use the standard accepted rate (0.1%). This means very little aluminum naturally enters the blood when you eat it, meaning the safe blood limit would be lower.",
        implication: "Result: The calculated 'Safe Blood Limit' is TINY. The vaccine spike will probably exceed it.",
        type: "toxic",
        isOfficial: false
      },
      {
        id: 'high_absorption',
        label: "0.78% (The Loophole)",
        footerLabel: "0.78%",
        sub: "(Mitkus Choice)",
        desc: "You found an outlier study... It seems to suggest up to 0.78% absorption of aluminium. This buys you 8x more aluminum in the blood before toxicity is reached...",
        implication: "Result: The 'Safe Blood Limit' becomes 8x higher. We create a massive safety buffer by using this number.",
        type: "safe",
        isOfficial: true
      }
    ]
  },
  baseline: {
    icon: Activity,
    title: "Step 4: The Patient Profile",
    shortTitle: "Patient",
    question: "What size baby should we model? Not all babies are born the same size...",
    narrative: "The model assumes the baby is big enough to handle the dose. The vaccine dose is fixed — but baby sizes vary. A smaller baby means a higher concentration per kilogram.",
    narrativeQuestion: "Do we model a standard 50th percentile infant, or account for premature and low birth weight babies?",
    options: [
      {
        id: 'standard',
        label: "50th Percentile",
        footerLabel: "Standard",
        sub: "(Standard Growth)",
        desc: "Model a healthy, full-term baby (3.5kg at birth) who gains weight rapidly. The body volume is large enough to dilute the aluminum.",
        implication: "The dose is spread across more body mass. Looks safer.",
        type: "safe",
        isOfficial: true
      },
      {
        id: 'preemie',
        label: "The Preemie",
        footerLabel: "Preemie",
        sub: "(Low Birth Weight)",
        desc: "Model a premature baby (2kg or less). They get the same vaccine dose as the big baby, but their body is half the size.",
        implication: "Same dose, smaller body. Concentration doubles.",
        type: "toxic",
        isOfficial: false
      }
    ]
  }
};

// --- COMPONENTS ---

const Button = ({ onClick, children, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-blue-600 active:bg-blue-700 text-white border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
    secondary: "bg-slate-800 active:bg-slate-700 text-slate-200 border-slate-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
    danger: "bg-rose-600 active:bg-rose-700 text-white border-rose-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]",
    outline: "bg-transparent border-slate-600 text-slate-400 active:border-slate-400 active:text-slate-200 hover:bg-slate-800"
  };
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-bold transition-all border-2 text-base ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- STICKY DECISION LOG COMPONENT ---
const DecisionLog = ({ config, onNavigate }) => {
  const steps = [
    { key: 'elimination', stage: STAGES.STEP_1_TYPE, meta: DECISIONS.elimination },
    { key: 'filter', stage: STAGES.STEP_2_FILTER, meta: DECISIONS.filter },
    { key: 'ruler', stage: STAGES.STEP_3_THRESHOLD, meta: DECISIONS.ruler },
    { key: 'baseline', stage: STAGES.STEP_4_BASELINE, meta: DECISIONS.baseline }
  ];

  const safeCount = Object.values(config).filter(val => {
    if (!val) return false;
    for (const d of Object.values(DECISIONS)) {
      const opt = d.options.find(o => o.id === val);
      if (opt && opt.type === 'safe') return true;
    }
    return false;
  }).length;
  
  const totalChosen = Object.values(config).filter(v => !!v).length;
  
  let barColor = "bg-slate-700";
  if (totalChosen > 0) {
    if (safeCount === totalChosen) barColor = "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"; 
    else if (safeCount > totalChosen / 2) barColor = "bg-emerald-600/70"; 
    else barColor = "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"; 
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 p-2 pb-6 md:pb-2 z-50 shadow-2xl">
      {/* Simulation Safety Indicator Line */}
      <div className="w-full h-1 bg-slate-800 mb-2 rounded-full overflow-hidden">
         <div className={`h-full transition-all duration-700 ease-out ${barColor}`} style={{ width: `${(totalChosen / 4) * 100}%` }} />
      </div>

      <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
        {steps.map((step) => {
          const choiceId = config[step.key];
          const hasChoice = !!choiceId;
          const choiceOption = hasChoice ? step.meta.options.find(o => o.id === choiceId) : null;
          const isSafe = choiceOption?.type === 'safe';
          
          return (
            <button 
              key={step.key} 
              onClick={() => onNavigate(step.stage)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-300 active:scale-95 ${
                hasChoice 
                  ? isSafe 
                    ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-100' 
                    : 'bg-rose-900/20 border-rose-500/50 text-rose-100'
                  : 'bg-slate-800/30 border-slate-800 text-slate-600 hover:bg-slate-800/50'
              }`}
            >
              <div className="text-[9px] font-mono uppercase font-bold tracking-wider leading-none text-center mb-1 opacity-70">
                {step.meta.shortTitle}
              </div>
              {hasChoice ? (
                <div className={`text-[10px] font-bold leading-tight text-center line-clamp-1 animate-in zoom-in spin-in-1 duration-300`}>
                  {choiceOption.footerLabel} 
                </div>
              ) : (
                <div className="h-[10px] w-full bg-slate-800/50 rounded-full animate-pulse opacity-20" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- SCROLL LAYOUT COMPONENT ---
const ScrollLayout = ({ directorImage, heroContent, children, currentTint, isIntroScreen = false }) => {
  const contentRef = useRef(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-950 min-h-screen flex justify-center">
      <div className="w-full md:max-w-md bg-slate-950 shadow-2xl overflow-hidden relative font-sans md:border-x border-slate-800">

        {/* --- HERO SECTION --- */}
        <div className="h-[100dvh] w-full relative flex flex-col overflow-hidden border-b-4 border-slate-800">

           {/* IMAGE LAYER - less bottom padding on intro to show more of Vance */}
           <div className={`absolute inset-0 bg-slate-900 ${isIntroScreen ? 'pb-16' : 'pb-32'}`}>
              {directorImage ? (
                <img
                  src={directorImage}
                  alt="Director Vance"
                  className="w-full h-full object-cover object-top transition-transform duration-1000 ease-in-out hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <User className="w-32 h-32 mb-4 opacity-20" />
                </div>
              )}

              {/* Dynamic Tint Overlay based on Safety Trend */}
              <div className={`absolute inset-0 transition-colors duration-1000 mix-blend-overlay ${currentTint}`} />

              {/* Standard Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
           </div>

           {/* DIALOGUE LAYER - on intro, less top padding and more bottom to use progress bar space */}
           <div className={`absolute bottom-0 w-full z-10 px-6 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent ${isIntroScreen ? 'pb-2 pt-4' : 'pb-16 pt-12'}`}>
              <div className={`flex items-center gap-3 ${isIntroScreen ? 'mb-2' : 'mb-4'}`}>
                 <div className="flex items-center gap-2 bg-red-600/90 text-white px-2 py-0.5 rounded-sm font-mono text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.6)] animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    Live Uplink
                 </div>
              </div>

              <div className={isIntroScreen ? 'mb-1' : 'mb-2'}>
                 {heroContent}
              </div>

              {children && (
                <button
                  onClick={scrollToContent}
                  className={`w-full flex items-center justify-center gap-2 text-blue-400/80 animate-bounce cursor-pointer group pt-2 ${isIntroScreen ? 'pb-6' : 'pb-2'}`}
                >
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] group-hover:text-blue-300 transition-colors">Descend</span>
                    <ChevronDown className="w-4 h-4 group-hover:text-blue-300 transition-colors" />
                </button>
              )}
           </div>
        </div>

        {/* --- CONTENT SECTION --- */}
        {children && (
          <div ref={contentRef} className="min-h-screen bg-slate-950 relative z-20 shadow-2xl border-t border-slate-800">
             <div className="p-6 pt-12 pb-40"> 
                {children}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [stage, setStage] = useState(STAGES.PREAMBLE);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [config, setConfig] = useState({
    elimination: null,
    filter: null,
    ruler: null,
    absorption: null,
    baseline: null
  });
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("SAFE");
  const [showGraph, setShowGraph] = useState(false);

  // --- Image Preloader ---
  useEffect(() => {
    const imageUrls = [
      ASSETS.preamble,
      ...Object.values(ASSETS.director),
      ...Object.values(ASSETS.options)
    ].filter(url => url && typeof url === 'string' && url.length > 0);

    let loadedCount = 0;
    const totalImages = imageUrls.length;
    let isMounted = true;

    if (totalImages === 0) {
      setImagesLoaded(true);
      return;
    }

    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.log("Image preload timeout - forcing render");
        setImagesLoaded(true);
      }
    }, 3000);

    const handleImageLoad = () => {
      if (!isMounted) return;
      loadedCount++;
      if (loadedCount === totalImages) {
        clearTimeout(timeoutId);
        setImagesLoaded(true);
      }
    };

    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; 
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // --- Scroll to Top Effect ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage]);

  // --- Helper: Get Current Tint based on Choices ---
  const getCurrentTint = () => {
    const safeCount = Object.values(config).filter(val => {
      if (!val) return false;
      for (const d of Object.values(DECISIONS)) {
        const opt = d.options.find(o => o.id === val);
        if (opt && opt.type === 'safe') return true;
      }
      return false;
    }).length;
    
    const totalChosen = Object.values(config).filter(v => !!v).length;
    
    if (totalChosen === 0) return "bg-blue-500/10"; 
    if (safeCount === totalChosen) return "bg-emerald-500/20"; 
    return "bg-rose-500/20"; 
  };

  // --- Simulation Engine ---
  useEffect(() => {
    if (stage !== STAGES.SIMULATION) return;

    const runSimulation = () => {
      // 1. CONFIGURATION
      const vaccineDose = 1200; // Real world 8-week spike (Infanrix Hexa + Bexsero)
      const injectionDay = 5;

      // Baby weight model - standard vs preemie
      const birthWeight = config.baseline === 'standard' ? 3.5 : 2.0;
      const dailyGrowth = config.baseline === 'standard' ? 0.030 : 0.020;

      // 2. DEFINE THE LIMITS (The Game Balance)
      let limitPerKg = 5; // Default IV strict limit (real FDA limit)

      if (config.ruler === 'oral') {
        if (config.absorption === 'high_absorption') {
          limitPerKg = 400; // The "Mitkus" inflated limit (ensures SAFE result)
        } else {
          limitPerKg = 30; // The "modern science" limit (ensures TOXIC result)
        }
      }

      // 3. DEFINE CLEARANCE
      const baseClearance = config.elimination === 'soluble' ? 0.45 : 0.02;
      const filterMod = config.filter === 'magic' ? 1.0 : 0.05; // Physics filter traps aluminum
      const effectiveClearance = baseClearance * filterMod;

      let currentBurden = 0;
      let limitExceeded = false;
      const simData = [];

      for (let day = 0; day <= 60; day++) {
        const currentWeight = birthWeight + (day * dailyGrowth);

        // A. Administer Vaccine
        if (day === injectionDay) {
          currentBurden += vaccineDose;
        }

        // B. Calculate Safety Limit for this specific day/weight
        const dailySafetyCeiling = limitPerKg * currentWeight;

        // C. CHECK TOXICITY (Peak of the day, before clearance)
        if (currentBurden > dailySafetyCeiling) {
          limitExceeded = true;
        }

        // D. Record Data for Graph
        simData.push({
          day,
          burden: Math.round(currentBurden),
          limit: Math.round(dailySafetyCeiling),
          weight: parseFloat(currentWeight.toFixed(2))
        });

        // E. Clearance (Happens over the course of the day)
        currentBurden = currentBurden * (1 - effectiveClearance);
      }

      setData(simData);
      setStatus(limitExceeded ? "TOXIC" : "SAFE");
      setTimeout(() => setShowGraph(true), 500);
    };

    runSimulation();
  }, [stage, config]);

  const handleChoice = (category, value) => {
    setConfig(prev => ({ ...prev, [category]: value }));
    if (category === 'elimination') setStage(STAGES.STEP_2_FILTER);
    if (category === 'filter') setStage(STAGES.STEP_3_THRESHOLD);
    if (category === 'ruler') {
      // If they chose oral standard, ask about absorption rate
      // If they chose injectable, skip to baseline (absorption doesn't apply)
      if (value === 'oral') {
        setStage(STAGES.STEP_3B_ABSORPTION);
      } else {
        setStage(STAGES.STEP_4_BASELINE);
      }
    }
    if (category === 'absorption') setStage(STAGES.STEP_4_BASELINE);
    if (category === 'baseline') setStage(STAGES.SIMULATION);
  };

  const resetGame = () => {
    setStage(STAGES.PREAMBLE);
    setConfig({ elimination: null, filter: null, ruler: null, absorption: null, baseline: null });
    setShowGraph(false);
  };

  const adjustModel = () => {
    setStage(STAGES.STEP_1_TYPE);
    setShowGraph(false);
  };

  const handleNavigate = (targetStage) => {
    if (stage !== STAGES.INTRO && stage !== STAGES.CLINICAL_FAIL) {
      setStage(targetStage);
    }
  };

  // --- Renderers ---

  if (!imagesLoaded) {
    return (
      <div className="bg-slate-950 min-h-screen flex flex-col items-center justify-center text-blue-500 font-mono">
        <Loader2 className="w-12 h-12 mb-4 animate-spin" />
        <div className="text-sm uppercase tracking-widest animate-pulse">Establishing Secure Link...</div>
      </div>
    );
  }

  const renderPreamble = () => {
    return (
      <div className="bg-slate-950 min-h-screen flex justify-center">
        <div className="w-full md:max-w-md bg-slate-950 shadow-2xl overflow-hidden relative font-sans md:border-x border-slate-800">

          {/* Full screen hero like Vance */}
          <div className="h-[100dvh] w-full relative flex flex-col overflow-hidden">

            {/* Image layer - square image at top */}
            <div className="absolute top-0 left-0 right-0 aspect-square bg-slate-900">
              <img
                src={ASSETS.preamble}
                alt="FDA Headquarters"
                className="w-full h-full object-cover"
              />
              {/* Gradient fade at bottom of image */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            {/* Text layer at bottom */}
            <div className="absolute bottom-0 w-full z-10 px-6 pb-6 pt-8 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent">

              {/* Date badge */}
              <div className="mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="inline-block bg-slate-900/80 backdrop-blur border border-slate-700 px-2 py-0.5 rounded shadow-lg transform -skew-x-6">
                  <div className="text-blue-500 font-mono text-[9px] uppercase tracking-widest font-bold">
                    Washington D.C. — 2011
                  </div>
                </div>
              </div>

              {/* Dossier content */}
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 font-mono text-xs leading-relaxed">
                <p className="text-white font-bold">You are an FDA staffer.</p>
                <p className="text-slate-300">The agency has just concluded a bruising public battle over the safety of Thimerosal — the mercury-based preservative in vaccines.</p>
                <p className="text-slate-300">After years of congressional hearings and hostile press, the FDA emerged with a favorable ruling. Mercury was declared safe.</p>
                <p className="text-slate-300">But victory came at a cost. The press is hungry for the next story...</p>
                <p className="text-slate-400 italic">Despite the win, mood at the FDA is tense.</p>
                <p className="text-white font-bold pt-2">You walk into your office to find your boss waiting.</p>
              </div>

              {/* Enter button */}
              <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                <button
                  onClick={() => setStage(STAGES.INTRO)}
                  className="w-full flex items-center justify-center gap-2 text-blue-400/80 cursor-pointer group py-2"
                >
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] group-hover:text-blue-300 transition-colors">Enter the Office</span>
                  <ChevronDown className="w-4 h-4 group-hover:text-blue-300 transition-colors animate-bounce" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderGameIntro = () => {
    return (
      <div className="bg-slate-950 min-h-screen flex justify-center">
        <div className="w-full md:max-w-md bg-slate-950 shadow-2xl overflow-hidden relative font-sans md:border-x border-slate-800">

          {/* Full screen hero */}
          <div className="h-[100dvh] w-full relative flex flex-col overflow-hidden">

            {/* Image layer - use step1 image or director intro */}
            <div className="absolute top-0 left-0 right-0 aspect-square bg-slate-900">
              <img
                src={ASSETS.director.step1}
                alt="The Task"
                className="w-full h-full object-cover"
              />
              {/* Gradient fade at bottom of image */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            {/* Text layer at bottom */}
            <div className="absolute bottom-0 w-full z-10 px-6 pb-6 pt-8 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent">

              {/* Badge */}
              <div className="mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="inline-block bg-slate-900/80 backdrop-blur border border-slate-700 px-2 py-0.5 rounded shadow-lg transform -skew-x-6">
                  <div className="text-amber-500 font-mono text-[9px] uppercase tracking-widest font-bold">
                    Your Mission
                  </div>
                </div>
              </div>

              {/* Game explanation */}
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 font-mono text-xs leading-relaxed">
                <p className="text-white font-bold">You must now build a mathematical model.</p>
                <p className="text-slate-300">Your task is to simulate how aluminum is cleared from an infant's body after vaccination.</p>
                <p className="text-slate-300">There is very little real data to work with. You'll have to make assumptions.</p>
                <p className="text-slate-400 italic">Vance seems pretty keen to get a particular answer...</p>
                <p className="text-white font-bold pt-2">Choose your model inputs carefully. Balance Vance's demands against your own judgement.</p>
              </div>

              {/* Begin button */}
              <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                <button
                  onClick={() => setStage(STAGES.STEP_1_TYPE)}
                  className="w-full flex items-center justify-center gap-2 text-blue-400/80 cursor-pointer group py-2"
                >
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] group-hover:text-blue-300 transition-colors">Begin Simulation</span>
                  <ChevronDown className="w-4 h-4 group-hover:text-blue-300 transition-colors animate-bounce" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderIntroAndFail = () => {
    const isFail = stage === STAGES.CLINICAL_FAIL;
    const imageUrl = isFail && ASSETS.director.fail ? ASSETS.director.fail : ASSETS.director.intro;
    const content = isFail ? HERO_CONTENT.fail : HERO_CONTENT.intro;

    const HeroContent = (
      <div className="animate-in slide-in-from-bottom-4 duration-700">
         <div className="inline-block bg-slate-900/80 backdrop-blur border border-slate-700 px-2 py-0.5 rounded shadow-lg mb-2 transform -skew-x-6">
            <div className={`${isFail ? 'text-rose-500' : 'text-blue-500'} font-mono text-[9px] uppercase tracking-widest font-bold`}>
              {content.badge}
            </div>
         </div>
         <h1 className={`text-xl font-black italic tracking-tighter leading-none mb-2 drop-shadow-lg ${isFail ? 'text-rose-500' : 'text-white'}`}>
           {content.title}
         </h1>
         <div className="space-y-1 text-xs font-bold italic leading-snug drop-shadow-md">
           {content.lines.map((line, idx) => (
             <p key={idx} className={line.style}>{line.text}</p>
           ))}
         </div>
      </div>
    );

    return (
      <ScrollLayout directorImage={imageUrl} heroContent={HeroContent} currentTint={isFail ? "bg-rose-900/20" : "bg-blue-900/10"} isIntroScreen={true}>
         <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-8">
               <Skull className={`w-6 h-6 ${isFail ? 'text-rose-500' : 'text-blue-500'}`} />
               <h2 className="text-sm font-bold text-white tracking-widest uppercase">
                 {isFail ? 'Mission Failure' : 'Choose Your Approach'}
               </h2>
            </div>

            {isFail ? (
               <div className="space-y-6">
                  {/* Context text - comic style */}
                  <div className="relative bg-slate-800 border-2 border-slate-600 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                     <div className="absolute -top-3 left-4 bg-rose-500 px-3 py-0.5 transform -skew-x-6 shadow-lg">
                        <span className="text-[10px] font-black text-white uppercase tracking-wider">Reality Check!</span>
                     </div>
                     <p className="text-sm text-white font-bold italic leading-relaxed pt-2">
                        "Vance is furious. The ethics board laughed you out of the room. You have no choice left."
                     </p>
                  </div>

                  <button
                    onClick={() => setStage(STAGES.GAME_INTRO)}
                    className="group relative w-full overflow-hidden bg-slate-800 border-2 border-slate-600 hover:border-blue-500 p-5 text-left transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] active:scale-[0.98] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    <div className="absolute top-0 right-0 bg-blue-500 px-3 py-1 border-l-2 border-b-2 border-slate-900">
                       <span className="text-[10px] font-black text-white uppercase tracking-wider">Only Option</span>
                    </div>
                    <div className="relative z-10 pr-16">
                       <div className="text-2xl font-black text-white mb-2 italic uppercase tracking-tight drop-shadow-lg group-hover:text-blue-300 transition-colors">
                          <FileText className="w-5 h-5 mr-2 inline-block" />
                          Launch Math Model
                       </div>
                       <p className="text-xs text-slate-300 font-medium leading-relaxed">Build a simulation to prove safety. <span className="text-blue-400 font-bold">It's the only way forward now.</span></p>
                    </div>
                    <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </button>
               </div>
            ) : (
               <div className="space-y-6">
                  {/* Context text - comic style */}
                  <div className="relative bg-slate-800 border-2 border-slate-600 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                     <div className="absolute -top-3 left-4 bg-amber-500 px-3 py-0.5 transform -skew-x-6 shadow-lg">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Your Move!</span>
                     </div>
                     <p className="text-sm text-white font-bold italic leading-relaxed pt-2">
                        "Vance seems stressed. You need a study and quickly. Which one are you going to suggest?"
                     </p>
                  </div>

                  <div className="grid gap-5">
                     <button
                       onClick={() => setStage(STAGES.CLINICAL_FAIL)}
                       className="group relative overflow-hidden bg-slate-800 border-2 border-slate-600 hover:border-rose-500 p-5 text-left transition-all hover:shadow-[0_0_30px_rgba(244,63,94,0.3)] active:scale-[0.98] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                     >
                       <div className="absolute top-0 right-0 bg-rose-500 px-3 py-1 transform skew-x-0 border-l-2 border-b-2 border-slate-900">
                          <span className="text-[10px] font-black text-white uppercase tracking-wider">Option A</span>
                       </div>
                       <div className="relative z-10 pr-16">
                          <div className="text-2xl font-black text-white mb-2 italic uppercase tracking-tight drop-shadow-lg group-hover:text-rose-300 transition-colors">Clinical Trial</div>
                          <p className="text-xs text-slate-300 font-medium leading-relaxed">Recruit infants, perform biopsies, measure tissues. <span className="text-white font-bold">Great results</span>, but it will take a <span className="text-rose-400 font-bold">long time</span>.</p>
                       </div>
                       <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                     </button>

                     <button
                       onClick={() => setStage(STAGES.GAME_INTRO)}
                       className="group relative overflow-hidden bg-slate-800 border-2 border-slate-600 hover:border-blue-500 p-5 text-left transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] active:scale-[0.98] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                     >
                       <div className="absolute top-0 right-0 bg-blue-500 px-3 py-1 transform skew-x-0 border-l-2 border-b-2 border-slate-900">
                          <span className="text-[10px] font-black text-white uppercase tracking-wider">Option B</span>
                       </div>
                       <div className="relative z-10 pr-16">
                          <div className="text-2xl font-black text-white mb-2 italic uppercase tracking-tight drop-shadow-lg group-hover:text-blue-300 transition-colors">Math Model</div>
                          <p className="text-xs text-slate-300 font-medium leading-relaxed">Simulate safety based on existing assumptions. <span className="text-blue-400 font-bold">Quick</span>, but it's not clear how <span className="text-white font-bold">good the results</span> will be.</p>
                       </div>
                       <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                     </button>
                  </div>
               </div>
            )}
         </div>
      </ScrollLayout>
    );
  };

  const renderDecisionStep = (stepKey, decisionData) => {
    const dialogue = HERO_CONTENT.steps[stepKey];
    
    let directorStepImg = ASSETS.director.step1;
    if (stepKey === 'elimination' && ASSETS.director.step1) directorStepImg = ASSETS.director.step1;
    if (stepKey === 'filter' && ASSETS.director.step2) directorStepImg = ASSETS.director.step2;
    if (stepKey === 'ruler' && ASSETS.director.step3) directorStepImg = ASSETS.director.step3;
    if (stepKey === 'absorption' && ASSETS.director.step3) directorStepImg = ASSETS.director.step3; // reuse step3 image
    if (stepKey === 'baseline' && ASSETS.director.step4) directorStepImg = ASSETS.director.step4;

    const HeroContent = (
      <div className="animate-in slide-in-from-bottom-4 duration-500">
         <div className="inline-block bg-amber-500/10 border border-amber-500/50 px-2 py-0.5 rounded mb-2 shadow-lg backdrop-blur-sm">
             <div className="text-amber-500 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                 <Zap className="w-3 h-3" /> Incoming Message
             </div>
         </div>
         <h1 className="text-xl font-black text-white italic tracking-tighter leading-tight drop-shadow-lg">
            "{dialogue}"
         </h1>
      </div>
    );

    return (
      <ScrollLayout directorImage={directorStepImg} heroContent={HeroContent} currentTint={getCurrentTint()}>
         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Step title - comic style */}
            <div className="border-b-2 border-slate-700 pb-4">
                <div className="inline-block bg-blue-500 px-3 py-1 transform -skew-x-6 shadow-lg mb-3">
                   <span className="text-[10px] font-black text-white uppercase tracking-wider">{decisionData.title}</span>
                </div>
                <h2 className="text-2xl font-black text-white leading-tight uppercase italic drop-shadow-lg">{decisionData.question}</h2>
            </div>

            {decisionData.narrative && (
               <div className="relative bg-slate-800 border-2 border-slate-600 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                 <div className="absolute -top-3 left-4 bg-amber-500 px-3 py-0.5 transform -skew-x-6 shadow-lg">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Intel Brief</span>
                 </div>
                 <p className="text-sm text-slate-300 leading-relaxed mb-4 font-medium pt-1">
                   {decisionData.narrative}
                 </p>
                 <div className="bg-slate-900 p-3 border-l-4 border-blue-500">
                    <p className="font-bold text-white text-sm italic">"{decisionData.narrativeQuestion}"</p>
                 </div>
               </div>
            )}

            <div className="grid grid-cols-1 gap-5">
              {decisionData.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleChoice(stepKey, opt.id)}
                  className={`flex flex-col bg-slate-800 overflow-hidden border-2 transition-all text-left group relative
                    ${opt.type === 'safe'
                        ? 'hover:border-emerald-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]'
                        : 'hover:border-rose-500 hover:shadow-[0_0_25px_rgba(244,63,94,0.4)]'
                    }
                    border-slate-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]`}
                >
                  {/* IMAGE - only show if not noImages */}
                  {!decisionData.noImages && (
                    <div className="w-full aspect-video bg-black relative border-b-2 border-slate-700 group-hover:border-inherit transition-colors">
                      {ASSETS.options[opt.id] && (
                        <img
                          src={ASSETS.options[opt.id]}
                          alt={opt.label}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

                      {/* COMIC BADGE TYPE INDICATOR */}
                      <div className={`absolute top-0 right-0 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border-l-2 border-b-2 border-slate-900 shadow-xl
                         ${opt.type === 'safe' ? 'bg-emerald-500 text-slate-900' : 'bg-rose-500 text-white'}`}>
                         {opt.type === 'safe' ? 'Safe Path' : 'Toxic Path'}
                      </div>

                      <div className="absolute bottom-3 left-4 right-4">
                          <div className={`text-2xl font-black italic uppercase leading-none mb-1 drop-shadow-lg ${opt.type === 'safe' ? 'text-white group-hover:text-emerald-300' : 'text-white group-hover:text-rose-300'} transition-colors`}>
                              {opt.label}
                          </div>
                          <div className="inline-block bg-slate-900/80 backdrop-blur px-2 py-0.5 border border-white/20">
                             <span className="text-[10px] font-mono text-slate-200 font-bold">{opt.sub}</span>
                          </div>
                      </div>
                    </div>
                  )}

                  {/* No-image header - show label and badge inline */}
                  {decisionData.noImages && (
                    <div className="p-4 border-b-2 border-slate-700 group-hover:border-inherit transition-colors relative">
                      <div className={`absolute top-0 right-0 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border-l-2 border-b-2 border-slate-900 shadow-xl
                         ${opt.type === 'safe' ? 'bg-emerald-500 text-slate-900' : 'bg-rose-500 text-white'}`}>
                         {opt.type === 'safe' ? 'Safe Path' : 'Toxic Path'}
                      </div>
                      <div className={`text-2xl font-black italic uppercase leading-none mb-2 drop-shadow-lg ${opt.type === 'safe' ? 'text-white group-hover:text-emerald-300' : 'text-white group-hover:text-rose-300'} transition-colors`}>
                          {opt.label}
                      </div>
                      <div className="inline-block bg-slate-900/80 backdrop-blur px-2 py-0.5 border border-white/20">
                         <span className="text-[10px] font-mono text-slate-200 font-bold">{opt.sub}</span>
                      </div>
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col bg-slate-800">
                    <p className="text-sm text-slate-300 leading-relaxed font-medium flex-1">
                      {opt.desc}
                    </p>

                    <div className="mt-4 pt-3 border-t-2 border-slate-700">
                      <div className="flex items-center gap-2 mb-1">
                          <Activity className={`w-4 h-4 ${opt.type === 'safe' ? 'text-emerald-400' : 'text-rose-400'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-wider ${opt.type === 'safe' ? 'text-emerald-400' : 'text-rose-400'}`}>Impact:</span>
                      </div>
                      <div className="text-white text-sm font-bold italic pl-6">{opt.implication}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
         </div>
      </ScrollLayout>
    );
  };

  const renderSimulation = () => {
    const isSuccess = status === "SAFE";
    const directorImg = isSuccess 
      ? (ASSETS.director.win || ASSETS.director.intro) 
      : (ASSETS.director.fail || ASSETS.director.intro);

    const HeroContent = (
      <div className="animate-in slide-in-from-bottom-4 duration-700">
         <div className="flex items-center gap-3 mb-3 border-b border-white/20 pb-3">
            {isSuccess ? <ShieldCheck className="w-6 h-6 text-emerald-300" /> : <AlertTriangle className="w-6 h-6 text-rose-300" />}
            <div>
               <div className="text-[10px] uppercase font-bold tracking-widest text-white/70">Simulation Result</div>
               <div className={`text-2xl font-black ${isSuccess ? "text-emerald-300" : "text-rose-300"}`}>{status}</div>
            </div>
         </div>

         <h1 className="text-xl font-black text-white italic tracking-tighter mb-2 leading-none">
            {isSuccess ? "EXCELLENT WORK." : "UNACCEPTABLE."}
         </h1>
         <p className="text-sm text-white font-medium leading-tight italic">
            {isSuccess 
              ? "\"YOUR MATH HAS PROVED IT SAFE. THIS WILL KILL THE STORY. PRINT IT. I'LL GET YOU A PROMOTION FOR THIS.\"" 
              : "\"WE CAN'T PUBLISH 'TOXIC'! IT WILL CAUSE A PANIC. GO BACK AND FIX THE INPUTS!\""}
         </p>

         <div className="mt-6">
            {!isSuccess && (
              <Button onClick={adjustModel} variant="danger" className="w-full shadow-lg text-sm">
                <RotateCcw className="w-4 h-4 mr-2 inline" /> Adjust Assumptions
              </Button>
            )}
            {isSuccess && (
              <Button onClick={resetGame} variant="outline" className="w-full border-white/50 text-white hover:bg-white/10 text-sm">
                Run Another Simulation
              </Button>
            )}
         </div>
      </div>
    );

    return (
      <ScrollLayout directorImage={directorImg} heroContent={HeroContent} currentTint={isSuccess ? "bg-emerald-900/20" : "bg-rose-900/30"} children={null} />
    );
  };

  return (
    <>
      {stage === STAGES.PREAMBLE && renderPreamble()}
      {(stage === STAGES.INTRO || stage === STAGES.CLINICAL_FAIL) && renderIntroAndFail()}
      {stage === STAGES.GAME_INTRO && renderGameIntro()}
      {stage === STAGES.STEP_1_TYPE && renderDecisionStep('elimination', DECISIONS.elimination)}
      {stage === STAGES.STEP_2_FILTER && renderDecisionStep('filter', DECISIONS.filter)}
      {stage === STAGES.STEP_3_THRESHOLD && renderDecisionStep('ruler', DECISIONS.ruler)}
      {stage === STAGES.STEP_3B_ABSORPTION && renderDecisionStep('absorption', DECISIONS.absorption)}
      {stage === STAGES.STEP_4_BASELINE && renderDecisionStep('baseline', DECISIONS.baseline)}
      {stage === STAGES.SIMULATION && renderSimulation()}

      {stage !== STAGES.PREAMBLE && stage !== STAGES.INTRO && stage !== STAGES.CLINICAL_FAIL && stage !== STAGES.GAME_INTRO && (
         <DecisionLog config={config} onNavigate={handleNavigate} />
      )}

      {/* Credit */}
      <a
        href="https://philharper.substack.com"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-3 right-3 z-50 opacity-40 hover:opacity-100 transition-opacity"
      >
        <div className="text-[8px] font-mono text-slate-400 hover:text-white tracking-wider uppercase">
          philharper.substack.com
        </div>
      </a>
    </>
  );
}
