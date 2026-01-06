import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { AlertTriangle, ShieldCheck, Skull, ArrowRight, RotateCcw, BookOpen, User, Lock, CheckCircle2, ChevronDown, FileText, Filter, Scale, Activity, Loader2, Undo2, Zap } from 'lucide-react';

// --- ASSET CONFIGURATION ---
const ASSETS = {
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
    soy: "https://i.ibb.co/XZ2x70Rr/formula-milk.jpg",
    breast_milk: "https://i.ibb.co/B5nVqK80/breast-milk.jpg"
  }
};

// --- HERO / DIALOGUE CONFIGURATION ---
const HERO_CONTENT = {
  intro: {
    badge: "Director Vance - FDA HQ",
    title: "CLOSE THE DOOR.",
    lines: [
      { text: "Vance needs a study showing aluminium is safe.", style: "text-slate-300" },
      { text: "We currently don't really know the answer.", style: "text-white" },
      { text: "What should you suggest to Vance?", style: "text-rose-500 font-bold" },
      { text: "You're going to have to be quick, he seems impatient.", style: "text-blue-200" }
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
    elimination: "DON'T GET BOGGED DOWN IN CHEMISTRY. PICK THE DATASET THAT KEEPS THE LINE MOVING.",
    filter: "PHYSICS? I DON'T CARE ABOUT PHYSICS. I CARE ABOUT CLEARANCE RATES. DESIGN ME A MODEL THAT GETS OUR ANSWER!",
    ruler: "IF YOU SET THE BAR TOO LOW, WE FAIL. FIND A STANDARD WE CAN ACTUALLY MEET.",
    baseline: "CONTEXT IS KING. MAKE THE VACCINE LOOK SMALL. FIND ME A BIGGER NUMBER TO HIDE BEHIND."
  }
};

// --- CONSTANTS ---
const STAGES = {
  INTRO: 'intro',
  CLINICAL_FAIL: 'clinical_fail',
  STEP_1_TYPE: 'step_1',
  STEP_2_FILTER: 'step_2',
  STEP_3_THRESHOLD: 'step_3',
  STEP_4_BASELINE: 'step_4',
  SIMULATION: 'simulation',
};

// --- DECISION CONFIGURATION ---
const DECISIONS = {
  elimination: {
    icon: FileText,
    title: "Step 1: The Input Data",
    shortTitle: "Input",
    question: "We need a 'Retention Function' for the model. Whose data do we use?",
    narrative: "We have a data gap. We don't actually know how fast vaccine nanoparticles leave an infant's body. We have to 'borrow' a decay rate from a different study.",
    narrativeQuestion: "Do we run the simulation using data from a dissolvable salt (which leaves quickly), or the actual vaccine crystals (which stay for years)?",
    options: [
      {
        id: 'soluble',
        label: "The 'Priest' Data",
        footerLabel: "Soluble", 
        sub: "(Dissolved Salts)",
        desc: "Use Dr. Priest's data from injected Aluminum Citrate (a salt that dissolves in water). Note: Aluminium citrate is not ultimately what is in the vaccines.",
        implication: "Math assumes aluminum flushes out rapidly (45% in 24hrs).",
        type: "safe", 
        isOfficial: true // This is the 'Trick'
      },
      {
        id: 'particulate',
        label: "The Real Ingredient",
        footerLabel: "Particulate",
        sub: "(Solid Nanoparticles)",
        desc: "Use data for the actual ingredient: Aluminum Hydroxide crystals. They are designed NOT to dissolve.",
        implication: "Math shows aluminum likely trapped in body for years.",
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
    narrative: "The math model assumes that if aluminum is in the blood, the kidneys can grab it. But the kidney is just a biological sieve with very small holes (8nm).",
    narrativeQuestion: "Do we ignore physics and assume the particles magically pass through, or do we acknowledge they are too big to fit?",
    options: [
      {
        id: 'magic',
        label: "The 'Magic' Filter",
        footerLabel: "Magic",
        sub: "(Official Assumption)",
        desc: "Assume the rocks behave like water. Even though the particles are 1000x bigger than the kidney pores, the math assumes they pass right through.",
        implication: "The tank drains. (impossible physics)",
        type: "safe",
        isOfficial: true
      },
      {
        id: 'physics',
        label: "The 'Physics' Filter",
        footerLabel: "Blocked",
        sub: "(Pore Size Limit)",
        desc: "Respect the size limit. The kidney filter is 8nm wide. Vaccine particles are 10,000nm wide. They are physically too big to leave.",
        implication: "The drain is CLOGGED. Aluminum stays in the blood.",
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
    narrative: "This is the most critical trick. The choice of ruler determines the result.",
    narrativeQuestion: "Do we judge an INJECTION by the rules of EATING or the rules of IV LINES?",
    options: [
      {
        id: 'oral',
        label: "The 'Oral' Standard",
        footerLabel: "Eating",
        sub: "(Ingestion MRL)",
        desc: "Use the safety limit for EATING aluminum. Since you poop out 99% of what you eat, this limit is huge.",
        implication: "Safety bar is set sky high. Hard to fail.",
        type: "safe",
        isOfficial: true
      },
      {
        id: 'injectable',
        label: "The 'IV' Standard",
        footerLabel: "IV Line",
        sub: "(Parenteral Limit)",
        desc: "Use the FDA limit for IV fluids (4-5 mcg/kg). This is the only standard for aluminum entering the blood.",
        implication: "Safety bar is on the floor. Immediate failure.",
        type: "toxic",
        isOfficial: false
      }
    ]
  },
  baseline: {
    icon: Activity,
    title: "Step 4: The Comparison",
    shortTitle: "Context",
    question: "The press will ask: 'Is this a lot of aluminum?' What do we compare it to?",
    narrative: "The public is scared of big numbers. The best way to hide a toxic spike is to bury it in a 'noisy' background so it looks small by comparison.",
    narrativeQuestion: "Do we compare the vaccine against a baby drinking high-aluminum formula, or a baby on pure breast milk?",
    options: [
      {
        id: 'soy',
        label: "Soy Formula Baby",
        footerLabel: "Soy",
        sub: "(High Background)",
        desc: "Compare the vaccine to a baby drinking Soy Formula (which is naturally high in aluminum).",
        implication: "The vaccine spike looks like a small hill.",
        type: "safe",
        isOfficial: true
      },
      {
        id: 'breast_milk',
        label: "Breastfed Baby",
        footerLabel: "Breast Milk",
        sub: "(Low Background)",
        desc: "Compare the vaccine to a breastfed baby. Breast milk has almost zero aluminum.",
        implication: "The vaccine spike looks like Mount Everest.",
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
const ScrollLayout = ({ directorImage, heroContent, children, currentTint }) => {
  const contentRef = useRef(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-950 min-h-screen flex justify-center">
      <div className="w-full md:max-w-md bg-slate-950 shadow-2xl overflow-hidden relative font-sans md:border-x border-slate-800">
        
        {/* --- HERO SECTION --- */}
        <div className="h-[100dvh] w-full relative flex flex-col overflow-hidden border-b-4 border-slate-800">
           
           {/* IMAGE LAYER */}
           <div className="absolute inset-0 bg-slate-900">
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

           {/* DIALOGUE LAYER */}
           <div className="absolute bottom-0 w-full z-10 px-6 pb-16 pt-12 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent">
              <div className="flex items-center gap-3 mb-4">
                 <div className="flex items-center gap-2 bg-red-600/90 text-white px-2 py-0.5 rounded-sm font-mono text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.6)] animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    Live Uplink
                 </div>
              </div>

              <div className="mb-2">
                 {heroContent}
              </div>
              
              {children && (
                <button 
                  onClick={scrollToContent}
                  className="w-full flex items-center justify-center gap-2 text-blue-400/80 animate-bounce cursor-pointer group pt-2 pb-2"
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
  const [stage, setStage] = useState(STAGES.INTRO);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [config, setConfig] = useState({
    elimination: null,
    filter: null,
    ruler: null,
    baseline: null
  });
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("SAFE");
  const [showGraph, setShowGraph] = useState(false);

  // --- Image Preloader ---
  useEffect(() => {
    const imageUrls = [
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
      let currentBurden = 0;
      const simData = [];
      const days = 60;
      const vaccineDose = 250; 
      const injectionDay = 5;
      
      const clearanceVal = config.elimination === 'soluble' ? 0.45 : 0.02;
      const filterMod = config.filter === 'magic' ? 1.0 : 0.1;
      let effectiveClearance = clearanceVal;
      if (config.elimination === 'particulate') effectiveClearance = clearanceVal * filterMod;

      const dailyBaseline = config.baseline === 'soy' ? 25 : 2;
      const limit = config.ruler === 'oral' ? 1200 : 150;

      let peak = 0;
      let limitExceeded = false;

      for (let day = 0; day <= days; day++) {
        let influx = dailyBaseline;
        if (day === injectionDay) influx += vaccineDose;
        currentBurden = currentBurden + influx;
        const cleared = currentBurden * effectiveClearance;
        currentBurden = currentBurden - cleared;
        if (currentBurden < 0) currentBurden = 0;
        if (currentBurden > peak) peak = currentBurden;
        if (currentBurden > limit) limitExceeded = true;

        simData.push({
          day,
          burden: Math.round(currentBurden),
          limit: limit,
          baselineOnly: dailyBaseline
        });
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
    if (category === 'ruler') setStage(STAGES.STEP_4_BASELINE);
    if (category === 'baseline') setStage(STAGES.SIMULATION);
  };

  const resetGame = () => {
    setStage(STAGES.INTRO);
    setConfig({ elimination: null, filter: null, ruler: null, baseline: null });
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

  const renderIntroAndFail = () => {
    const isFail = stage === STAGES.CLINICAL_FAIL;
    const imageUrl = isFail && ASSETS.director.fail ? ASSETS.director.fail : ASSETS.director.intro;
    const content = isFail ? HERO_CONTENT.fail : HERO_CONTENT.intro;

    const HeroContent = (
      <div className="animate-in slide-in-from-bottom-4 duration-700">
         <div className="inline-block bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-1 rounded shadow-lg mb-3 transform -skew-x-6">
            <div className={`${isFail ? 'text-rose-500' : 'text-blue-500'} font-mono text-[10px] uppercase tracking-widest font-bold`}>
              {content.badge}
            </div>
         </div>
         <h1 className={`text-2xl font-black italic tracking-tighter leading-none mb-3 drop-shadow-lg ${isFail ? 'text-rose-500' : 'text-white'}`}>
           {content.title}
         </h1>
         <div className="space-y-1.5 text-sm font-bold italic leading-snug drop-shadow-md mb-6">
           {content.lines.map((line, idx) => (
             <p key={idx} className={line.style}>{line.text}</p>
           ))}
         </div>

         {isFail ? (
            <div className="text-center pt-2 pb-4">
              <Button onClick={() => setStage(STAGES.STEP_1_TYPE)} variant="primary" className="w-full text-sm">
                <FileText className="w-4 h-4 mr-2 inline" />
                Launch Math Model
              </Button>
            </div>
         ) : (
            <div className="grid gap-3 pt-2 pb-4">
              <button
                onClick={() => setStage(STAGES.CLINICAL_FAIL)}
                className="group relative overflow-hidden bg-slate-800/80 backdrop-blur border border-slate-700 hover:border-rose-500 rounded-lg p-3 text-left transition-all hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-mono text-rose-400 uppercase tracking-widest bg-slate-900/80 px-1.5 py-0.5 rounded">Option A</span>
                          <span className="text-sm font-black text-white italic">Clinical Trial</span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-tight">Recruit infants. Biopsies. Real data.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-500 transition-colors" />
                </div>
              </button>

              <button
                onClick={() => setStage(STAGES.STEP_1_TYPE)}
                className="group relative overflow-hidden bg-slate-800/80 backdrop-blur border border-slate-700 hover:border-blue-500 rounded-lg p-3 text-left transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest bg-slate-900/80 px-1.5 py-0.5 rounded">Option B</span>
                          <span className="text-sm font-black text-white italic">Math Model</span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-tight">Simulate safety. Fast results.</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors" />
                </div>
              </button>
            </div>
         )}
      </div>
    );

    return (
      <ScrollLayout directorImage={imageUrl} heroContent={HeroContent} currentTint={isFail ? "bg-rose-900/20" : "bg-blue-900/10"} children={null} />
    );
  };

  const renderDecisionStep = (stepKey, decisionData) => {
    const dialogue = HERO_CONTENT.steps[stepKey];
    
    let directorStepImg = ASSETS.director.step1; 
    if (stepKey === 'elimination' && ASSETS.director.step1) directorStepImg = ASSETS.director.step1;
    if (stepKey === 'filter' && ASSETS.director.step2) directorStepImg = ASSETS.director.step2;
    if (stepKey === 'ruler' && ASSETS.director.step3) directorStepImg = ASSETS.director.step3;
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
         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <div className="border-b-2 border-slate-800 pb-4">
                <span className="text-blue-500 text-[10px] font-bold uppercase tracking-widest block mb-1.5 bg-blue-900/20 inline-block px-2 py-0.5 rounded">{decisionData.title}</span>
                <h2 className="text-2xl font-black text-white leading-tight uppercase italic">{decisionData.question}</h2>
            </div>

            {decisionData.narrative && (
               <div className="relative bg-slate-800 border-2 border-slate-700 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                 <div className="absolute -top-3 left-4 bg-slate-900 px-2 border border-slate-700 text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
                    Mission Context
                 </div>
                 <p className="text-xs text-slate-300 leading-relaxed mb-3 font-medium">
                   {decisionData.narrative}
                 </p>
                 <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50">
                    <p className="font-bold text-white text-xs italic">"{decisionData.narrativeQuestion}"</p>
                 </div>
               </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              {decisionData.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleChoice(stepKey, opt.id)}
                  className={`flex flex-col bg-slate-800 overflow-hidden border-2 transition-all text-left group relative
                    ${opt.type === 'safe' 
                        ? 'hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                        : 'hover:border-rose-500 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                    } 
                    border-slate-600 shadow-lg hover:-translate-y-1`}
                >
                  {/* SQUARE IMAGE */}
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
                        <div className={`text-xl font-black italic uppercase leading-none mb-1 drop-shadow-md ${opt.type === 'safe' ? 'text-white group-hover:text-emerald-300' : 'text-white group-hover:text-rose-300'}`}>
                            {opt.label}
                        </div>
                        <div className="text-[10px] font-mono text-slate-300 bg-black/40 backdrop-blur inline-block px-1.5 py-0.5 rounded border border-white/10">{opt.sub}</div>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col bg-slate-800">
                    <div className="space-y-3 flex-1">
                       <p className="text-xs text-slate-300 leading-relaxed font-medium">
                         {opt.desc}
                       </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/50">
                      <div className="flex items-center gap-2">
                          <Activity className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] font-bold text-blue-400 uppercase">Projected Impact:</span>
                      </div>
                      <div className="text-white text-xs font-bold mt-1 pl-5">{opt.implication}</div>
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
      {(stage === STAGES.INTRO || stage === STAGES.CLINICAL_FAIL) && renderIntroAndFail()}
      {stage === STAGES.STEP_1_TYPE && renderDecisionStep('elimination', DECISIONS.elimination)}
      {stage === STAGES.STEP_2_FILTER && renderDecisionStep('filter', DECISIONS.filter)}
      {stage === STAGES.STEP_3_THRESHOLD && renderDecisionStep('ruler', DECISIONS.ruler)}
      {stage === STAGES.STEP_4_BASELINE && renderDecisionStep('baseline', DECISIONS.baseline)}
      {stage === STAGES.SIMULATION && renderSimulation()}
      
      {stage !== STAGES.INTRO && stage !== STAGES.CLINICAL_FAIL && (
         <DecisionLog config={config} onNavigate={handleNavigate} />
      )}
    </>
  );
}
