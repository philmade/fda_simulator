# FDA Simulator - Dialogue & Text

This document contains all game text for easy iteration. The goal is to make choices **shorter** and **emphasize the absurdity**.

---

## PREAMBLE (Scene Setting)

### Current (v1)
```
Washington D.C. — 2011

You are an FDA staffer.

The agency has just concluded a bruising public battle over the safety of Thimerosal — the mercury-based preservative in vaccines.

After years of congressional hearings and hostile press, the FDA emerged with a favorable ruling. Mercury was declared safe.

But victory came at a cost. The press is hungry for the next story...

Despite the win, mood at the FDA is tense.

You walk into your office to find your boss waiting.

[Button: Enter the Office]
```

### Shorter (v2)
```
Washington D.C. — 2011

You are an FDA staffer.

The agency has just concluded a bruising public battle over the safety of Thimerosal — the mercury-based preservative in vaccines.

After years of congressional hearings and hostile press, the FDA emerged with a favorable ruling. Mercury was declared safe.

But victory came at a cost. The press is hungry for the next story...
You walk into your office to find your boss waiting.

[Button: Enter the Office]
```

---

## INTRO (Vance's Opening)

### Current (v1)
```
Badge: Director Vance - FDA HQ
Title: CLOSE THE DOOR.

- WE HAVE A PR DISASTER AFTER THIS MERCURY CASE. THE PRESS IS ASKING ABOUT ALUMINUM ADJUVANTS.
- THEY WANT TO KNOW IF IT ACCUMULATES IN THE BRAIN.
- WE HAVE ZERO INFANT SAFETY DATA. NONE.
- I NEED A STUDY THAT PROVES IT'S SAFE. GET IT DONE!

[Button: Descend]
```

### Shorter (v2)
```
Badge: Director Vance
Title: CLOSE THE DOOR.

- THIS IS A PR DISASTER.
- THE PRESS ARE BREATHING DOWN MY NECK ABOUT ALUMINIUM IN OUR VACCINES.
- WE DON'T HAVE ANY SAFETY DATA. NONE!
- I NEED A STUDY THAT PROVES IT'S SAFE. GET IT DONE!
```

---

## FIRST CHOICE (Clinical vs Model)

### Current (v1)
Context: "Vance seems stressed. The question of safety is simple enough but there's no safety data. You need to produce some. How?"

Option A - Clinical Trial:
- Label: "The Clinical Trial"
- Sub: (Real Data)
- Desc: "Run a proper clinical trial. Biopsy infant tissues at various time points to measure actual aluminum levels. It's invasive and ethically dicey... but it's the only way to get real data."
- Implication: "Real data, real answers — but Vance might not like what we find."

Option B - Mathematical Model:
- Label: "The Math Model"
- Sub: (Simulate It)
- Desc: "Run a mathematical simulation using pharmacokinetics. We won't need to touch any babies. We can use existing data and assumptions to 'calculate' what happens."
- Implication: "No new data, but we control the assumptions..."
```

### Shorter (v2)
```
Context: "Vance is stressed, and he needs safety data. There is none. How do you get it?"

Option A - Clinical Trial:
- "Get blood, urine and hair data from babies to measure actual aluminum levels."
- Risk: Real data. Might prove it's dangerous.

Option B - Math Model:
- "Simulate it with assumptions. No actual measurements."
- Advantage: We control the assumptions.
```

---

## MISSION FAILURE (Rejected Clinical Trial)

### Current (v1)
```
Title: ARE YOU CRAZY?!

- YOU CAN'T JUST BIOPSY BABIES! ETHICS WOULD HANG US.
- WE CAN'T LOOK FOR THE ALUMINUM.
- WE HAVE TO SIMULATE IT. MAKE A MODEL!

Context: "Vance is furious. The ethics board laughed you out of the room. You have no choice left."

[Button: Build the Mathematical Model]
```

### Shorter (v2)
```
Title: ARE YOU CRAZY?!

- YOU CAN'T JUST BIOPSY BABIES! ETHICS WOULD HANG US.
- WE CAN'T LOOK FOR THE ALUMINUM.
- WE HAVE TO SIMULATE IT. MAKE A MODEL!

Context: "Vance is furious. The ethics board laughed you out of the room. You have no choice left."

[Button: Fine.]
```

---

## GAME INTRO (Mission Brief)

### Current (v1)
```
Badge: Your Mission

- You must now build a mathematical model.
- Your task is to simulate how aluminum is cleared from an infant's body after vaccination.
- There is very little real data to work with. You'll have to make assumptions.
- Vance seems pretty keen to get a particular answer...
- Choose your model inputs carefully. Balance Vance's demands against your own judgement.

[Button: Begin Simulation]
```

### Shorter (v2)
```
Badge: Your Mission

- Build a simulation. Do what Vance wants, or try to do good science.
- The choice is yours, but you'll have to make assumptions.
- Choose wisely.

[Button: Begin]
```

---

## STEP 1: THE INPUT DATA

### Vance's Bark
Current: "HURRY UP AND BUILD THAT MODEL! DON'T GET BOGGED DOWN IN CHEMISTRY! JUST PICK THE DATASET THAT KEEPS THE LINE MOVING!"
Shorter: "PICK A DATASET! DON'T OVERTHINK IT!"

### Question
Current: "We need to simulate how aluminium moves through the body, but..."
Shorter: "How fast does vaccine aluminum leave the body?"

### Narrative
Current: "We have a data gap. We don't actually know how fast vaccine nanoparticles are cleared... We have to find a dataset we can use, perhaps from a different study."
Shorter: "We don't have data for vaccine aluminum. We need to borrow from another study."

### Narrative Question
Current: "Do we run the simulation using data from a dissolvable Aluminium salt, which leaves quickly, or the actual Aluminium used in the vaccines?"
Shorter: "Use data from a different, fast-clearing form... or find data for the actual ingredient?"

### Option A - The 'Priest' Data (Soluble)
Current:
- Desc: "Use Dr. Priest's data from injected Aluminum Citrate, a salt that dissolves in water. He injected a tiny amount of it too... It's good data but the formulation is completely different to what's in the vaccine. The dose is also much smaller."
- Implication: "Math assumes aluminum flushes out rapidly (45% in 24hrs)."

Shorter:
- Desc: "Use data from a water-soluble salt. Clears fast. Different formula, tiny dose."
- Implication: "Assumes 45% clears in 24hrs. Convenient."

### Option B - The Real Ingredient (Particulate)
Current:
- Desc: "Find data for the actual ingredient used: Aluminum Hydroxide or Aluminium Phosphate crystals. They are designed not to dissolve and so they behave differently to Dr Priest's formula."
- Implication: "Math shows aluminum could be trapped in body for years."

Shorter:
- Desc: "Use data for the actual vaccine ingredient. It doesn't dissolve."
- Implication: "Could stay in the body for years."

---

## STEP 2: THE KIDNEY FILTER

### Vance's Bark
Current: "PICK A KIDNEY MODEL! AND REMEMBER, I DON'T CARE ABOUT PHYSICS! I CARE ABOUT CLEARANCE RATES!"
Shorter: "KIDNEYS CLEAR IT, RIGHT? MAKE SURE THEY DO!"

### Question
Current: "The aluminum is in the form of nanoparticles. Can they fit through the kidney's filter?"
Shorter: "Can aluminum particles pass through the kidney filter?"

### Narrative
Current: "The math model assumes that if aluminum is in the blood, the kidneys can grab it and clear it. But the kidney is just a biological sieve with very small holes (8nm)."
Shorter: "Kidneys filter blood through tiny 8nm pores."

### Narrative Question
Current: "What if larger crystals of aluminium get into the blood? Do we ignore physics and assume the particles can pass through into the kidney?"
Shorter: "Vaccine particles are 1000x too big. Do we ignore that?"

### Option A - Magic Filter
Current:
- Desc: "Assume the aluminium particles behave like water. Even though the particles are 1000x bigger than the kidney pores, use math that assumes they pass right through."
- Implication: "The aluminium will be quickly cleared by the kidneys."

Shorter:
- Desc: "Assume particles magically pass through. Ignore size."
- Implication: "Kidneys clear it. Problem solved."

### Option B - Physics Filter
Current:
- Desc: "Respect the size limit. The kidney filter is 8nm wide. The vaccine particles could be 10,000nm wide. They are physically too big to be processed through the kidney."
- Implication: "The body must first break down the aluminium to smaller particles somehow."

Shorter:
- Desc: "8nm filter. 10,000nm particle. It doesn't fit."
- Implication: "Particles get trapped."

---

## STEP 3: THE SAFETY LIMIT

### Vance's Bark
Current: "FIND ME A WORKABLE TOXICITY! IF YOU SET THE BAR TOO LOW, WE FAIL! FIND A STANDARD WE CAN ACTUALLY MEET!"
Shorter: "FIND A LIMIT WE CAN ACTUALLY PASS!"

### Question
Current: "How much aluminum is 'Too Much'? Where is the Red Line?"
Shorter: "What's the safe limit?"

### Narrative
Current: "This is the most critical part of our model. How we calculate the toxic limit will strongly influence the result."
Shorter: "This decides everything."

### Narrative Question
Current: "Should we model toxicity based on how to body responds to EATING it or how it responds to it being INJECTED?"
Shorter: "Use the limit for eating aluminum... or for injecting it?"

### Option A - Oral Standard
Current:
- Desc: "Use the safety limit for EATING aluminum. Since you poop out 99.9% of what you eat, this limit is huge."
- Implication: "The Safety bar will be set quite high. It's hard to fail from here."

Shorter:
- Desc: "Use the EATING limit. You poop out 99.9%."
- Implication: "Massive safety margin. Easy pass."

### Option B - IV Standard
Current:
- Desc: "Use the FDA limit for Introvenous fluids (4-5 mcg/kg). This is the only standard you can find for aluminum entering the body via a needle."
- Implication: "These limits look tight...How much aluminum is in that vaccine again?"

Shorter:
- Desc: "Use the IV limit. The only standard for injected aluminum."
- Implication: "It's tight. Very tight."

---

## STEP 3B: THE ABSORPTION RATE (Only if Oral chosen)

### Vance's Bark
Current: "GOOD CHOICE ON THE ORAL STANDARD! NOW — HOW MUCH DO PEOPLE ACTUALLY ABSORB WHEN THEY EAT IT? FIND ME THE RIGHT NUMBER!"
Shorter: "GOOD! NOW FIND THE RIGHT ABSORPTION RATE!"

### Question
Current: "We have a Safe Limit for EATING aluminum but we need to convert it to a Safe Limit for BLOOD levels..."
Shorter: "Convert the eating limit to a blood limit."

### Narrative
Current: "If eating 100 units is safe, and the gut only absorbs 1% into the blood, it means having 1 unit in the blood must be safe. The 'Absorption Rate' directly determines the safe amount we'll use for the model."
Shorter: "Higher absorption rate = higher 'safe' blood level."

### Narrative Question
Current: "Maybe there's leeway here... Do we use the modern, strict absorption rate, or dig up an older, higher number?"
Shorter: "Use the modern rate... or find a more generous one?"

### Option A - 0.1% (Modern Science)
Current:
- Desc: "Use the standard accepted rate (0.1%). This means very little aluminum naturally enters the blood when you eat it, meaning the safe blood limit would be lower."
- Implication: "Result: The calculated 'Safe Blood Limit' is TINY. The vaccine spike will probably exceed it."

Shorter:
- Desc: "0.1% — the accepted modern rate."
- Implication: "Safe limit is tiny. We'll fail."

### Option B - 0.78% (The Loophole)
Current:
- Desc: "You found an outlier study... It seems to suggest up to 0.78% absorption of aluminium. This buys you 8x more aluminum in the blood before toxicity is reached..."
- Implication: "Result: The 'Safe Blood Limit' becomes 8x higher. We create a massive safety buffer by using this number."

Shorter:
- Desc: "0.78% — from one outlier study."
- Implication: "8x more headroom. We pass."

---

## STEP 4: THE PATIENT PROFILE

### Vance's Bark
Current: "LAST STEP! PICK A PATIENT PROFILE! AND REMEMBER — WE'RE NOT TRYING TO PROVE IT'S DANGEROUS!"
Shorter: "LAST STEP! PICK A BABY SIZE!"

### Question
Current: "What size baby should we model? Not all babies are born the same size..."
Shorter: "How big is our test baby?"

### Narrative
Current: "The model assumes the baby is big enough to handle the dose. The vaccine dose is fixed — but baby sizes vary. A smaller baby means a higher concentration per kilogram."
Shorter: "Same dose, different baby sizes. Smaller = higher concentration."

### Narrative Question
Current: "Do we model a standard 50th percentile infant, or account for premature and low birth weight babies?"
Shorter: "Average baby... or include preemies?"

### Option A - 50th Percentile
Current:
- Desc: "Model a healthy, full-term baby (3.5kg at birth) who gains weight rapidly. The body volume is large enough to dilute the aluminum."
- Implication: "The dose is spread across more body mass. Looks safer."

Shorter:
- Desc: "3.5kg healthy baby. Big enough to dilute the dose."
- Implication: "Looks safe."

### Option B - The Preemie
Current:
- Desc: "Model a premature baby (2kg or less). They get the same vaccine dose as the big baby, but their body is half the size."
- Implication: "Same dose, smaller body. Concentration doubles."

Shorter:
- Desc: "2kg preemie. Same dose, half the body."
- Implication: "Concentration doubles."

---

## RESULTS

### WIN
Current: "EXCELLENT WORK. YOUR MATH HAS PROVED IT SAFE. THIS WILL KILL THE STORY. PRINT IT. I'LL GET YOU A PROMOTION FOR THIS."
Shorter: "PERFECT. PRINT IT. YOU'RE GETTING A PROMOTION."

### LOSE
Current: "UNACCEPTABLE. WE CAN'T PUBLISH 'TOXIC'! IT WILL CAUSE A PANIC. GO BACK AND FIX THE INPUTS!"
Shorter: "UNACCEPTABLE. FIX THE INPUTS."

---

## NOTES FOR ITERATION

Key principles:
1. **Shorter is better** — mobile users scroll fast
2. **Emphasize absurdity** — make the "safe" choices obviously ridiculous
3. **Vance should bark** — short, commanding, unreasonable
4. **Options need clear contrast** — "honest but inconvenient" vs "dishonest but convenient"

Ideas:
- Can we use more visual contrast in the options? (e.g., icons, colors)
- Should Vance's dialogue be even more aggressive/cartoonish?
- Are the "Intel Brief" boxes necessary or can they be cut?
