-- ==============================================================================
-- EUSATIS OFFICIAL SUPABASE SEED DATA
-- Platform: Supabase (PostgreSQL 15+)
-- Run this in the Supabase Dashboard: SQL Editor -> New Query -> Run
-- (After executing schema.sql)
-- ==============================================================================

-- 1. SEED LEARNING RESOURCES (Eusatis Mind)
INSERT INTO public.learning_resources (
    id, title, slug, summary, content, subject, category, tags,
    learner_level, featured_image, reading_time_minutes, video_url, author,
    status, meta_title, meta_description, learning_objectives, worked_examples,
    knowledge_checks, faqs, simulation, created_at, updated_at
) VALUES
(
    'lr-1',
    'The Optics of Clarity: Refraction and the Science of Light',
    'optics-of-clarity-refraction',
    'Explore how light bends across medium boundaries, and how Snell''s Law reveals the mathematical order hidden within optical complexity.',
    'When light travels from one medium to another—such as from air into water or a glass prism—its velocity changes depending on the optical density of the material. This shift in speed causes the wavefront to change angle, an effect known as refraction.

### The Physics of Snell''s Law
The quantitative relationship governing refraction was formulated by Willebrord Snellius:

$$n_1 \sin(\theta_1) = n_2 \sin(\theta_2)$$

Where:
- $n_1$ and $n_2$ represent the refractive indices of medium 1 and medium 2.
- $\theta_1$ is the angle of incidence measured from the normal.
- $\theta_2$ is the angle of refraction.

### Why Dispersion Occurs
White light consists of multiple wavelengths ranging from approximately 380 nm (violet) to 750 nm (red). Because different wavelengths experience slightly different refractive indices in dense media, shorter wavelengths (violet) refract at steeper angles than longer wavelengths (red). 

Passing light through a triangular prism thus separates chaotic compound light into its distinct, orderly spectral components—a perfect metaphor for how thoughtful inquiry resolves complex confusion into pristine clarity.',
    'Physics',
    'Wave Optics',
    ARRAY['Optics', 'Snell''s Law', 'Refraction', 'Light', 'Electromagnetism'],
    'Lower Secondary (JHS / KS3)',
    '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    6,
    'https://www.youtube.com/watch?v=y55tzg_jC9r',
    'Eusatis Physics Faculty',
    'published',
    'The Optics of Clarity – Eusatis Mind',
    'Discover how Snell''s Law and wave refraction transform light from complex chaos to clear spectral focus.',
    '[
        "Define refractive index and identify how it influences wave velocity",
        "Apply Snell''s Law to calculate angles of incidence and refraction",
        "Explain how chromatic dispersion creates spectral separation through glass prisms",
        "Understand total internal reflection and critical angle principles"
    ]'::jsonb,
    '[
        {
            "title": "Calculating the Refraction Angle in Crown Glass",
            "problem": "A ray of monochromatic light in air (n1 = 1.00) strikes a crown glass slab (n2 = 1.52) at an angle of incidence of 30°. What is the angle of refraction inside the glass?",
            "solution": "Applying Snell''s Law: 1.00 * sin(30°) = 1.52 * sin(θ2). Since sin(30°) = 0.50, we have sin(θ2) = 0.50 / 1.52 ≈ 0.3289. Taking arcsin yields θ2 ≈ 19.2°.",
            "keyInsight": "Because crown glass has a higher optical density than air, the refracted ray bends toward the surface normal."
        }
    ]'::jsonb,
    '[
        {
            "question": "What happens to the speed of light as it passes from air into water?",
            "options": [
                "It increases because water is more fluid than air",
                "It decreases because water has a higher optical density than air",
                "It remains constant at 3 × 10⁸ m/s regardless of medium",
                "It drops to zero instantaneously"
            ],
            "correctIndex": 1,
            "explanation": "The speed of light in a refractive medium is given by v = c / n. For water (n ≈ 1.33), light travels at approximately 75% of vacuum speed."
        },
        {
            "question": "Which color of visible light experiences the greatest deflection when passing through a glass prism?",
            "options": ["Red", "Yellow", "Green", "Violet"],
            "correctIndex": 3,
            "explanation": "Violet light has the shortest wavelength and experiences the highest refractive index in transparent materials, bending the most."
        },
        {
            "question": "According to Snell''s Law, what happens to the angle of refraction if light enters a medium with a higher refractive index?",
            "options": [
                "The refracted ray reflects backwards completely",
                "The refracted ray bends away from the normal axis (larger angle)",
                "The refracted ray bends towards the normal axis (smaller angle)",
                "The angle remains identical to the incident angle"
            ],
            "correctIndex": 2,
            "explanation": "Because n1 sin(θ1) = n2 sin(θ2), when n2 > n1, sin(θ2) must decrease, causing the ray to refract closer to the surface normal."
        }
    ]'::jsonb,
    '[
        {
            "question": "Can refraction happen without bending the path of light?",
            "answer": "Yes. If the incident beam enters precisely perpendicular (angle of incidence is 0° along the normal), the speed changes but the path does not bend."
        }
    ]'::jsonb,
    '{
        "enabled": true,
        "type": "optics",
        "title": "Snell''s Law Refraction & Dispersion Stage",
        "description": "Interact with light incident angles and material indices to witness Snell''s Law wave bending and chromatic dispersion in real time.",
        "param1Label": "Angle of Incidence (θ₁)",
        "param1Default": 40,
        "param1Min": 0,
        "param1Max": 75,
        "param1Unit": "°",
        "param2Label": "Optical Density Factor",
        "param2Default": 46,
        "param2Min": 30,
        "param2Max": 72,
        "param2Unit": "n",
        "principleNote": "As light enters a denser medium, wave velocity slows, refracting toward the normal axis. Shorter wavelengths bend more steeply, creating the spectrum."
    }'::jsonb,
    '2026-10-15T10:00:00Z',
    '2026-10-25T00:00:00Z'
),
(
    'lr-2',
    'Soil Chemistry & Plant Nutrition: The Science of Agronomic Yield',
    'soil-chemistry-plant-nutrition-agronomy',
    'Analyze how soil pH influences cation exchange capacity and macronutrient availability (Nitrogen, Phosphorus, Potassium) for sustainable crop cultivation.',
    'Agricultural productivity is deeply governed by soil chemistry. Soil is not merely an inert anchor for roots; it is an active biochemical reactor where mineral ions, water solutions, and biological enzymes interact continuously.

### Cation Exchange and the pH Window
The acidity or alkalinity of soil water solution (measured on the pH scale from 0 to 14) directly dictates the chemical form and solubility of essential plant nutrients.

- **Acidic Soils (pH < 5.5)**: Aluminum and manganese become toxic, while phosphorus binds tightly to iron oxides, becoming insoluble and unavailable to roots.
- **Alkaline Soils (pH > 8.0)**: Phosphorus precipitates with calcium, and trace micronutrients like iron, zinc, and boron become locked out.
- **Agronomic Optimum (pH 6.2 - 7.0)**: At this balanced range, microbial activity peaks, and all three primary macronutrients—Nitrogen (N), Phosphorus (P), and Potassium (K)—reach their maximal bioavailability.

### Cation Exchange Capacity (CEC)
Clay particles and organic humus carry negative electrostatic charges that attract positively charged nutrient ions ($Ca^{2+}$, $Mg^{2+}$, $K^+$, $NH_4^+$). When farmers understand CEC, fertilizer application shifts from guesswork to precise soil stewardship.',
    'Agriculture',
    'Agronomy & Soil Science',
    ARRAY['Agriculture', 'Soil pH', 'Agronomy', 'Nutrients', 'Crop Science', 'Sustainability'],
    'Upper Secondary (SHS / KS4&5)',
    '/src/assets/images/eusatis_impact_community_1792624720900.jpg',
    7,
    'https://www.youtube.com/watch?v=RmsiH_qO_hI',
    'Eusatis Agriscience Faculty',
    'published',
    'Soil Chemistry & Plant Nutrition – Eusatis Mind',
    'Master the relationship between soil pH, cation exchange, and nutrient availability in modern agriculture.',
    '[
        "Explain how soil pH regulates the solubility and availability of N, P, and K",
        "Define Cation Exchange Capacity (CEC) and its role in nutrient retention",
        "Calculate optimal lime or sulfur amendment dosages to correct soil acidity"
    ]'::jsonb,
    '[
        {
            "title": "Determining Liming Requirements for Acidic Loam",
            "problem": "A farm soil sample tests at pH 5.2. Agricultural extension guidelines recommend raising the pH to 6.5 to release bound phosphate. What amendment should be applied?",
            "solution": "Agricultural limestone (calcium carbonate, CaCO3) is incorporated. The carbonate anions neutralize hydrogen protons: CaCO3 + 2H+ -> Ca2+ + H2O + CO2 ↑, elevating soil pH into the 6.2–7.0 agronomic optimum.",
            "keyInsight": "Correcting pH frees existing soil nutrients before adding expensive synthetic fertilizers."
        }
    ]'::jsonb,
    '[
        {
            "question": "What is the optimal soil pH range for balanced macronutrient availability in most food crops?",
            "options": ["pH 4.0 - 5.0", "pH 8.5 - 9.5", "pH 2.0 - 3.5", "pH 6.2 - 7.0"],
            "correctIndex": 3,
            "explanation": "At pH 6.2–7.0, Nitrogen, Phosphorus, and Potassium reach their highest simultaneous availability."
        },
        {
            "question": "Which of the following nutrient cations are retained by the negative charges of clay and humus in high-CEC soils?",
            "options": [
                "Chloride (Cl-) and Nitrate (NO3-)",
                "Calcium (Ca2+), Magnesium (Mg2+), Potassium (K+), and Ammonium (NH4+)",
                "Carbon dioxide (CO2) and Oxygen (O2)",
                "Insoluble quartz sand crystals"
            ],
            "correctIndex": 1,
            "explanation": "Clay particles and organic matter possess negative surface charges that adsorb basic cations, preventing them from leaching away."
        },
        {
            "question": "Why does applying agricultural limestone (CaCO3) help restore nutrient availability in strongly acidic soils (pH < 5.5)?",
            "options": [
                "It increases the salinity until only halophytes can survive",
                "It eliminates all bacteria from the soil microbial zone",
                "It neutralizes hydrogen protons (H+) and precipitates toxic aluminum while freeing bound phosphorus",
                "It turns organic humus into inert rock minerals"
            ],
            "correctIndex": 2,
            "explanation": "Carbonate anions neutralize acidic protons, raising soil pH to the 6.2–7.0 agronomic optimum where phosphorus becomes soluble."
        }
    ]'::jsonb,
    '[
        {
            "question": "Why is over-liming soil hazardous to crop yields?",
            "answer": "Pushing pH above 7.8 locks up essential micronutrients like Iron, Manganese, Zinc, and Boron, inducing severe chlorosis in crops."
        }
    ]'::jsonb,
    '{
        "enabled": true,
        "type": "soil_agriculture",
        "title": "Soil pH & Cation Exchange Visualizer",
        "description": "Adjust soil pH to see how micronutrient bioavailability and toxic aluminum levels dynamically adjust.",
        "param1Label": "Soil Solution pH",
        "param1Default": 6.5,
        "param1Min": 4.0,
        "param1Max": 9.0,
        "param1Unit": "pH",
        "principleNote": "At pH 6.2–7.0, microbial activity peaks and primary nutrients (N, P, K) reach maximal bioavailability."
    }'::jsonb,
    '2026-10-16T08:00:00Z',
    '2026-10-25T00:00:00Z'
),
(
    'lr-3',
    'Euler-Bernoulli Beam Deflection & Moment of Inertia in Structural Engineering',
    'euler-bernoulli-beam-deflection-inertia',
    'Understand how geometric cross-section and span length dictate elastic deflection and load-bearing performance under central point loads.',
    'Civil infrastructure depends on predicting structural deflection before material failure. The Euler-Bernoulli beam theory models how load, span distance, elasticity, and cross-sectional geometry govern elastic flexure.

### The Euler-Bernoulli Principle
For a simply supported horizontal beam of length $L$, modulus of elasticity $E$, and second moment of area $I$, subjected to a central point load $F$, the maximum downward deflection occurring at mid-span is given by:

$$\delta_{\text{max}} = \frac{F L^3}{48 E I}$$

Where:
- $\delta_{\text{max}}$ is the maximum center deflection.
- $F$ is the concentrated central load force.
- $L$ is the span length between supports.
- $E$ is Young''s modulus of elasticity.
- $I$ is the second moment of area.

### Why the $L^3$ Relationship Matters
Notice that span length $L$ is raised to the third power! Doubling the span length does not merely double deflection—it increases deflection by a factor of eight ($2^3 = 8$). This is why structural engineers use deep I-beams: maximizing vertical height increases $I$ exponentially without adding excessive weight.',
    'Engineering',
    'Structural Engineering',
    ARRAY['Engineering', 'Structures', 'Physics', 'Mechanics', 'Beam Deflection', 'Civil Engineering'],
    'Tertiary (University & College)',
    '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    9,
    'https://www.youtube.com/watch?v=f08Y39UiC-o',
    'Eusatis Engineering Faculty',
    'published',
    'Euler-Bernoulli Beam Deflection – Eusatis Mind',
    'Master the Euler-Bernoulli equation and learn why moment of inertia is the cornerstone of structural stiffness.',
    '[
        "State the Euler-Bernoulli mid-span deflection formula",
        "Calculate the factor change in deflection when beam span is doubled",
        "Explain why I-beams provide superior bending resistance compared to solid bars of equal mass"
    ]'::jsonb,
    '[
        {
            "title": "Scaling Beam Span Deflection",
            "problem": "A simply supported steel beam deflects 4 mm under an applied load over a 6 m span. What will be the deflection if the span length is increased to 12 m under the exact same load?",
            "solution": "According to Euler-Bernoulli beam theory, center deflection is proportional to L³. Doubling span length amplifies deflection by 2³ = 8. Therefore, the new deflection is 4 mm × 8 = 32 mm.",
            "keyInsight": "Deflection exhibits cubic scaling with length; doubling span length multiplies sagging eight-fold."
        }
    ]'::jsonb,
    '[
        {
            "question": "How does doubling the beam length affect center point deflection under a constant load?",
            "options": ["It doubles (2x)", "It quadruples (4x)", "It increases by 8 times (8x)", "It remains unchanged"],
            "correctIndex": 2,
            "explanation": "Because deflection varies with L³, doubling span length scales deflection by (2L)³ = 8L³, an eight-fold increase."
        },
        {
            "question": "In the Euler-Bernoulli formula δ_max = (F L³) / (48 E I), what physical property does the variable I represent?",
            "options": [
                "Total electrical current passing through the steel",
                "Second moment of area (geometric bending stiffness)",
                "Internal molecular friction coefficient",
                "Impact impulse duration in milliseconds"
            ],
            "correctIndex": 1,
            "explanation": "The second moment of area I measures how cross-sectional material is distributed relative to the neutral bending axis."
        },
        {
            "question": "If a civil engineer needs to cut center beam deflection in half without changing material (E) or span (L), what adjustment must be made?",
            "options": [
                "Double the span distance (L)",
                "Increase the temperature of the structure",
                "Reduce the width of the beam flanges by 50%",
                "Double the second moment of area (I) or halve the load force (F)"
            ],
            "correctIndex": 3,
            "explanation": "Because deflection is directly proportional to load force F and inversely proportional to inertia I, doubling I or cutting F in half reduces deflection by exactly 50%."
        }
    ]'::jsonb,
    '[
        {
            "question": "Why do I-beams have wide flanges on the top and bottom?",
            "answer": "Placing material far from the neutral axis maximizes the second moment of area (I), yielding the highest stiffness per kilogram."
        }
    ]'::jsonb,
    '{
        "enabled": true,
        "type": "beam_engineering",
        "title": "Euler-Bernoulli Beam Deflection Simulator",
        "description": "Manipulate applied load force and span distance to see real-time beam flexure curve and maximum center displacement.",
        "param1Label": "Applied Point Load",
        "param1Default": 45,
        "param1Min": 5,
        "param1Max": 100,
        "param1Unit": "kN",
        "param2Label": "Beam Span Length",
        "param2Default": 6,
        "param2Min": 2,
        "param2Max": 14,
        "param2Unit": "m",
        "principleNote": "Deflection varies with the cube of length (L³). Increasing beam depth increases the moment of inertia (I), drastically reducing deflection."
    }'::jsonb,
    '2026-10-19T11:00:00Z',
    '2026-10-25T00:00:00Z'
),
(
    'lr-4',
    'The Golden Ratio in Natural Algorithms & Biomimetic Design',
    'golden-ratio-natural-algorithms-biomimetics',
    'Discover how the irrational constant Phi (1.618) connects phyllotaxis plant packing, computer algorithmic efficiency, and sustainable architectural design.',
    'From the spiral arrangements of sunflower florets to spiral galaxies and architectural harmonies, the Golden Ratio (represented by the Greek letter $\Phi$) recurs continuously across mathematics and natural form.

### The Mathematical Proportion
Two quantities $a$ and $b$ (with $a > b$) are in the golden ratio if:

$$\frac{a+b}{a} = \frac{a}{b} = \Phi = \frac{1 + \sqrt{5}}{2} \approx 1.6180339887...$$

### The Golden Angle in Nature
In botany, leaves or seeds arranged at the golden angle ($360^\circ \times (1 - 1/\Phi) \approx 137.5^\circ$) achieve the mathematical maximum packing density without overlapping, allowing each leaf optimal exposure to rain and sunlight. Understanding this algorithm turns apparent botanical randomness into breathtaking biological engineering.',
    'Interdisciplinary',
    'Biomimetics & Applied Math',
    ARRAY['Interdisciplinary', 'Golden Ratio', 'Biomimicry', 'Algorithms', 'Geometry', 'Nature'],
    'Primary / Elementary (KS2)',
    '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    5,
    'https://www.youtube.com/watch?v=keLN89CWZ-A',
    'Eusatis Interdisciplinary Faculty',
    'published',
    'The Golden Ratio & Biomimetics – Eusatis Mind',
    'Learn how the golden ratio and Fibonacci sequences structure natural packing algorithms and engineering.',
    '[
        "Identify the numerical value of the golden ratio Phi (~1.618)",
        "Explain how the 137.5° golden angle maximizes leaf exposure to sunlight",
        "Recognize examples of biomimicry inspired by natural geometric spirals"
    ]'::jsonb,
    '[
        {
            "title": "Verifying Fibonacci Convergence",
            "problem": "Calculate the ratio of consecutive Fibonacci numbers F8 = 21 and F9 = 34, then compare with Phi.",
            "solution": "Evaluating the ratio: F9 / F8 = 34 / 21 ≈ 1.6190476. Comparing with Phi = (1 + √5)/2 ≈ 1.6180339..., difference is less than 0.06%.",
            "keyInsight": "Even with small integer terms, Fibonacci ratios rapidly converge to the irrational golden constant."
        }
    ]'::jsonb,
    '[
        {
            "question": "What is the approximate degree measurement of the golden angle used in plant seed arrangement?",
            "options": ["90.0°", "45.0°", "137.5°", "180.0°"],
            "correctIndex": 2,
            "explanation": "137.5° is the golden angle, which prevents leaves from overshadowing lower tiers."
        },
        {
            "question": "Two quantities a and b (with a > b) satisfy the golden ratio definition when which relationship holds?",
            "options": [
                "a + b = 2a - b",
                "a / b = π ≈ 3.14159",
                "a² + b² = (a+b)²",
                "(a+b)/a = a/b = Φ = (1 + √5)/2"
            ],
            "correctIndex": 3,
            "explanation": "By algebraic definition, the ratio of the whole sum to the larger part equals the ratio of larger part to smaller part."
        },
        {
            "question": "Why do sunflower florets arranged at the golden angle benefit biologically over simple fractional angles like 90° or 120°?",
            "options": [
                "It forces seeds to grow twice as large in diameter",
                "Because Φ is irrational, successive florets never fall into straight radial lines, packing with mathematical maximum density",
                "It reflects ultraviolet radiation to deter insects",
                "It stops water evaporation through the plant stem"
            ],
            "correctIndex": 1,
            "explanation": "Any rational angle creates empty radial spokes where seeds overlap. The golden angle is based on the most irrational number, guaranteeing optimal packing."
        }
    ]'::jsonb,
    '[
        {
            "question": "Is the golden ratio an irrational number?",
            "answer": "Yes. It cannot be expressed as a simple fraction of two integers because √5 is irrational."
        }
    ]'::jsonb,
    '{
        "enabled": true,
        "type": "geometry",
        "title": "Spiral Phyllotaxis & Golden Angle Explorer",
        "description": "Adjust the divergence angle to witness how only the 137.5° Golden Angle eliminates radial spoke gaps and achieves optimal packing density.",
        "param1Label": "Divergence Angle",
        "param1Default": 137.5,
        "param1Min": 120.0,
        "param1Max": 150.0,
        "param1Unit": "°",
        "param2Label": "Element Count",
        "param2Default": 140,
        "param2Min": 40,
        "param2Max": 200,
        "param2Unit": "nodes",
        "principleNote": "At exactly 137.5° (the golden angle), successive nodes never overlap, packing with maximal efficiency."
    }'::jsonb,
    '2026-10-18T11:00:00Z',
    '2026-10-25T00:00:00Z'
),
(
    'lr-5',
    'The Architecture of Photosynthesis: Solar Conversion in Plant Cells',
    'architecture-of-photosynthesis',
    'A structured examination of light-dependent reactions, electron transport chains, and the biochemical synthesis of ATP in chloroplast thylakoids.',
    'Photosynthesis is the fundamental biological engine converting radiant solar energy into chemical energy stored in molecular bonds.

### The Chloroplast Factory
Inside plant mesophyll cells, chloroplasts house stacks of membrane discs called thylakoids, bathed in an enzymatic fluid named stroma.

The overall chemical equation:

$$6\text{CO}_2 + 6\text{H}_2\text{O} + \text{photons} \longrightarrow \text{C}_6\text{H}_{12}\text{O}_6 + 6\text{O}_2$$

### Light-Dependent Reactions
Photons strike chlorophyll molecules inside Photosystem II, exciting electrons that travel down an electron transport chain. The photolysis of water replenishes these electrons, releasing oxygen gas as a byproduct while establishing a proton gradient across the thylakoid membrane.

This proton motive force powers ATP synthase—a remarkable rotary biological engine that generates ATP to fuel the Calvin cycle in the stroma.',
    'Biology',
    'Cellular Energetics',
    ARRAY['Biology', 'Photosynthesis', 'Cellular Respiration', 'Chlorophyll', 'Ecosystems'],
    'Upper Secondary (SHS / KS4&5)',
    '/src/assets/images/eusatis_aha_moment_1792624721004.jpg',
    8,
    'https://www.youtube.com/watch?v=sQK3Yr4Sc_k',
    'Eusatis Life Sciences Faculty',
    'published',
    'The Architecture of Photosynthesis – Eusatis Mind',
    'Understand the biological mechanics of chloroplasts and light-dependent reactions in plant cells.',
    '[
        "Locate the sites of light-dependent and Calvin cycle reactions in chloroplasts",
        "Explain the role of water photolysis in electron replenishing and oxygen generation",
        "Describe how ATP synthase harnesses the electrochemical proton gradient"
    ]'::jsonb,
    '[
        {
            "title": "Stoichiometry of Oxygen Production",
            "problem": "How many water molecules must undergo photolysis to produce 3 molecules of molecular oxygen (O2)?",
            "solution": "The light-dependent photolysis reaction is: 2H2O -> 4H+ + 4e- + O2 ↑. Splitting 2 molecules of H2O yields 1 molecule of O2. Therefore, producing 3 molecules of O2 requires splitting 3 * 2 = 6 molecules of H2O.",
            "keyInsight": "All molecular oxygen released in photosynthesis comes directly from water, not carbon dioxide."
        }
    ]'::jsonb,
    '[
        {
            "question": "Where do the light-independent reactions (Calvin Cycle) take place inside the chloroplast?",
            "options": [
                "In the stroma fluid surrounding the thylakoids",
                "Inside the thylakoid lumen",
                "In the outer mitochondrial membrane",
                "Along the cell wall cellulose fibers"
            ],
            "correctIndex": 0,
            "explanation": "The Calvin Cycle occurs in the stroma, where ATP and NADPH produced in the thylakoids fix carbon dioxide into sugars."
        },
        {
            "question": "What is the precise chemical source of the molecular oxygen (O2) released into the Earth''s atmosphere during photosynthesis?",
            "options": [
                "Carbon dioxide gas (CO2) decomposition",
                "Glucose cellular respiration",
                "The photolysis (splitting) of water molecules (H2O)",
                "Nitrogen fixation in root nodules"
            ],
            "correctIndex": 2,
            "explanation": "During the light reactions at Photosystem II, water molecules are split into protons, electrons, and molecular oxygen."
        },
        {
            "question": "How does the proton electrochemical gradient across the thylakoid membrane drive ATP production?",
            "options": [
                "Protons dissolve the outer membrane allowing sugars to escape",
                "Protons flow down their concentration gradient through ATP synthase, rotating the enzyme rotor to phosphorylate ADP into ATP",
                "Protons directly absorb red photons of light",
                "Protons burn lipid calories like a furnace"
            ],
            "correctIndex": 1,
            "explanation": "ATP synthase functions as a molecular turbine; the proton motive force powers rotary catalysis to synthesize ATP."
        }
    ]'::jsonb,
    '[
        {
            "question": "Why do most leaves appear green to the human eye?",
            "answer": "Chlorophyll a and b primarily absorb blue and red wavelengths of light, reflecting green wavelengths back to our eyes."
        }
    ]'::jsonb,
    '{
        "enabled": true,
        "type": "photosynthesis",
        "title": "Photosynthetic Photon Flux & Saturation Visualizer",
        "description": "Observe how photosynthetic rate increases linearly with light photon flux before reaching enzyme saturation (Vmax).",
        "param1Label": "Photon Flux Intensity",
        "param1Default": 420,
        "param1Min": 0,
        "param1Max": 1200,
        "param1Unit": "µmol/m²/s",
        "principleNote": "Photosynthetic light response exhibits an initial light-limited linear zone followed by an enzymatic saturation plateau."
    }'::jsonb,
    '2026-10-17T09:30:00Z',
    '2026-10-25T00:00:00Z'
),
(
    'lr-6',
    'Chemical Kinetics & The Arrhenius Activation Energy Barrier',
    'chemical-kinetics-arrhenius-activation-energy',
    'Master how temperature, collision frequency, and molecular activation energy dictate chemical reaction velocities and catalytic acceleration.',
    'Chemical reactions are not instantaneous events; they are probabilistic collisions governed by molecular orientation and kinetic energy. Even for thermodynamically favorable reactions, reactant molecules must collide with sufficient kinetic force to surmount an energy threshold known as the activation energy barrier ($E_a$).

### The Arrhenius Law of Reaction Rates
Svante Arrhenius unified chemical kinetics and statistical mechanics with the fundamental equation relating the reaction rate constant $k$ to temperature $T$:

$$k = A e^{-\frac{E_a}{R T}}$$

Where:
- $k$ represents the rate constant of the reaction.
- $A$ is the pre-exponential frequency factor (collision frequency and steric orientation).
- $E_a$ is the activation energy in Joules per mole ($\text{J/mol}$).
- $R$ is the universal gas constant ($8.314\text{ J}/(\text{mol}\cdot\text{K})$).
- $T$ is the absolute thermodynamic temperature in Kelvin ($\text{K}$).

### The Exponential Temperature Effect
Notice that temperature $T$ appears in the denominator of a negative exponent! This exponential sensitivity explains why a modest $10\text{ K}$ increase in temperature typically doubles or triples biological and industrial reaction rates: it dramatically expands the fraction of molecular collisions exceeding $E_a$.

### Catalysis: Lowering the Energy Mountain
- **Uncatalyzed Pathway**: High activation energy $E_a$ requires high thermal velocities for bonds to distort and transition states to form.
- **Enzyme / Heterogeneous Catalysis**: Provides an alternate mechanistic reaction pathway with a significantly reduced activation energy $E_a''$, allowing thousands of times more collisions to yield products at room temperature.
- **Steric Orientation**: Even high-energy collisions bounce off harmlessly if the geometric orientation of reactive functional groups is misaligned.',
    'Chemistry',
    'Physical Chemistry & Kinetics',
    ARRAY['Chemistry', 'Kinetics', 'Activation Energy', 'Arrhenius Equation', 'Thermodynamics', 'Reaction Rates'],
    'Upper Secondary (SHS / KS4&5)',
    '/src/assets/images/eusatis_aha_moment_1792624721004.jpg',
    8,
    'https://www.youtube.com/watch?v=7qOFtL3VEBc',
    'Eusatis Chemical Sciences Faculty',
    'published',
    'Chemical Kinetics & Arrhenius Equation – Eusatis Mind',
    'Explore reaction rate constants, activation energy barriers, and temperature dependence in chemical kinetics.',
    '[
        "State the Arrhenius equation and identify all thermodynamic variables (k, A, Ea, R, T)",
        "Explain why a modest 10°C temperature elevation often doubles chemical reaction rates",
        "Calculate activation energy (Ea) using two-temperature kinetic rate data"
    ]'::jsonb,
    '[
        {
            "title": "Calculating Rate Acceleration from Temperature Rise",
            "problem": "A chemical reaction has an activation energy Ea = 52.0 kJ/mol. By what factor does the rate constant k increase when the temperature rises from 300 K (27°C) to 310 K (37°C)?",
            "solution": "Step 1: Write two-point Arrhenius logarithmic equation: ln(k2/k1) = (Ea / R) * (1/T1 - 1/T2)\nStep 2: Substitute values: ln(k2/k1) = (52000 / 8.314) * (1/300 - 1/310)\nStep 3: Evaluate products: ln(k2/k1) = 6254.5 * 0.0001075 ≈ 0.6725\nStep 4: Exponentiate both sides: k2/k1 = e^(0.6725) ≈ 1.96",
            "keyInsight": "The rate constant nearly doubles (1.96×) with just a 10 K increase, validating the classical Rule of Thumb in chemical kinetics."
        }
    ]'::jsonb,
    '[
        {
            "question": "What happens to the reaction rate constant k when a biological enzyme or inorganic catalyst is introduced?",
            "options": [
                "It decreases because catalysts destroy reactant molecules",
                "It remains exactly constant while the reaction shifts to an exothermic equilibrium",
                "It drops to zero instantaneously",
                "It increases because the catalyst lowers the activation energy barrier (Ea)"
            ],
            "correctIndex": 3,
            "explanation": "Catalysts lower the activation energy barrier, allowing a much larger fraction of molecular collisions to have sufficient energy to react."
        },
        {
            "question": "Why does a modest temperature increase of 10 K frequently double the rate of a chemical reaction?",
            "options": [
                "It doubles the molecular mass of the reacting atoms",
                "It exponentially increases the fraction of molecular collisions that possess kinetic energy E >= Ea",
                "It doubles the volume of the reaction chamber",
                "It causes all solvent molecules to evaporate instantly"
            ],
            "correctIndex": 1,
            "explanation": "According to the Maxwell-Boltzmann distribution and Arrhenius exponential term e^(-Ea/RT), raising temperature exponentially expands the high-energy reactive tail."
        },
        {
            "question": "In the Arrhenius relationship k = A * e^(-Ea / (RT)), what does the pre-exponential factor A physically describe?",
            "options": [
                "The total mass of the solvent liquid in kilograms",
                "The electrical conductivity of the container wall",
                "The total frequency of collisions and the steric probability that molecules collide in the correct spatial orientation",
                "The wavelength of ambient light shining on the flask"
            ],
            "correctIndex": 2,
            "explanation": "The factor A accounts for how frequently molecules collide and whether their reactive orbital orientations are properly aligned."
        }
    ]'::jsonb,
    '[
        {
            "question": "Can a chemical reaction proceed if temperature is absolute zero (0 Kelvin)?",
            "answer": "Classically no, because thermal kinetic energy drops to zero and no molecules can surmount Ea."
        }
    ]'::jsonb,
    '{
        "enabled": true,
        "type": "kinetics_chemistry",
        "title": "Arrhenius Kinetics & Maxwell-Boltzmann Energy Visualizer",
        "description": "Manipulate temperature and activation energy barrier (Ea) to see how the Maxwell-Boltzmann kinetic energy distribution shifts and controls the reactive fraction.",
        "param1Label": "System Temperature",
        "param1Default": 310,
        "param1Min": 260,
        "param1Max": 500,
        "param1Unit": "K",
        "param2Label": "Activation Energy (Ea)",
        "param2Default": 45,
        "param2Min": 20,
        "param2Max": 80,
        "param2Unit": "kJ/mol",
        "principleNote": "Only collisions possessing energy exceeding the activation threshold (Ea) result in chemical reaction."
    }'::jsonb,
    '2026-10-20T10:00:00Z',
    '2026-10-25T00:00:00Z'
),
(
    'lr-7',
    'The Limit Definition of the Derivative: Instantaneous Change in Calculus',
    'calculus-limit-definition-derivative',
    'Master the geometric and algebraic mechanics of secant lines collapsing into tangents via limits to calculate instantaneous rates of change from first principles.',
    'Calculus was born from a profound question: How do we measure the speed of something at an exact, frozen instant of time, when speed requires a non-zero interval of time to elapse?

### The Secant-to-Tangent Transition
Between any two points $(x, f(x))$ and $(x+h, f(x+h))$ on a smooth curve, the average rate of change is given by the slope of the secant line:

$$\text{Average Rate} = \frac{f(x+h) - f(x)}{h}$$

As the horizontal interval $h$ shrinks toward zero, the two points coalesce into one, transforming the secant line into the tangent line.

### The Formal Definition of the Derivative
The instantaneous rate of change—the derivative $f''(x)$—is defined as the limit of the difference quotient as $h \to 0$:

$$f''(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$$

Where:
- $f''(x)$ represents the derivative (instantaneous slope at point $x$).
- $h$ is the infinitesimal increment approaching zero.
- $f(x+h) - f(x)$ is the vertical change ($\Delta y$).
- $\frac{f(x+h) - f(x)}{h}$ is the Newton difference quotient.

### Geometric & Physical Interpretation
- **In Geometry**: The derivative $f''(x)$ specifies the exact slope of the line tangent to $y = f(x)$ at $x$.
- **In Physics**: If $s(t)$ represents position at time $t$, its first derivative $s''(t) = v(t)$ gives instantaneous velocity, and the second derivative $s''''(t) = a(t)$ yields instantaneous acceleration.
- **In Optimization**: At peaks and valleys of functions (local extrema), the tangent slope flattens to zero ($f''(x) = 0$).',
    'Mathematics',
    'Differential Calculus & Analysis',
    ARRAY['Mathematics', 'Calculus', 'Limits', 'Derivatives', 'Analysis', 'Rates of Change'],
    'Upper Secondary (SHS / KS4&5)',
    '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    7,
    'https://www.youtube.com/watch?v=WUvTyaaNkzM',
    'Eusatis Mathematical Studies',
    'published',
    'The Limit Definition of the Derivative – Eusatis Mind',
    'Master the geometric and algebraic mechanics of secant lines collapsing into tangents via limits in differential calculus.',
    '[
        "Formulate the formal limit definition of the derivative",
        "Explain geometrically how secant slopes transition continuously into tangent lines as h approaches zero",
        "Differentiate polynomial functions directly from first principles"
    ]'::jsonb,
    '[
        {
            "title": "Differentiating a Quadratic Curve from First Principles",
            "problem": "Find the derivative of f(x) = x² using the limit definition of the derivative, and evaluate its slope at x = 3.",
            "solution": "Substitute into the definition: f''(x) = lim(h->0) [(x+h)² - x²]/h = lim(h->0) [2xh + h²]/h = lim(h->0) [2x + h] = 2x. At x = 3, f''(3) = 2(3) = 6.",
            "keyInsight": "The algebraic cancellation of h resolves the 0/0 indeterminacy, revealing the exact instantaneous rate of change."
        }
    ]'::jsonb,
    '[
        {
            "question": "In the limit definition f''(x) = lim(h->0) [f(x+h) - f(x)]/h, what does the parameter h represent geometrically?",
            "options": [
                "The height of the vertical y-axis",
                "The horizontal distance between two points on the curve forming a secant line",
                "The total surface area under the curve",
                "The curvature radius of the osculating circle"
            ],
            "correctIndex": 1,
            "explanation": "The variable h is the horizontal separation between base point x and secondary sample point x+h."
        },
        {
            "question": "What geometric entity does a secant line through (x, f(x)) and (x+h, f(x+h)) become as h approaches zero?",
            "options": [
                "A vertical asymptote",
                "A horizontal line with slope zero",
                "The tangent line to the curve at (x, f(x))",
                "A circular arc"
            ],
            "correctIndex": 2,
            "explanation": "As the two intersection points merge, the secant line rotates smoothly into the tangent line."
        },
        {
            "question": "Using the limit definition of the derivative, what is the instantaneous slope of f(x) = x² at the point x = 4?",
            "options": ["16", "4", "2", "8"],
            "correctIndex": 3,
            "explanation": "Because d/dx(x²) = 2x, evaluating at x = 4 gives an instantaneous slope of 2(4) = 8."
        }
    ]'::jsonb,
    '[
        {
            "question": "Why can we cancel h in the difference quotient if h is approaching zero?",
            "answer": "In limits, h approaches zero arbitrarily closely but is never equal to zero during the evaluation, making division by h algebraically valid."
        }
    ]'::jsonb,
    '{
        "enabled": true,
        "type": "calculus_math",
        "title": "Calculus Derivative & Secant-to-Tangent Limit Simulator",
        "description": "Shrink the secant interval step h toward zero to witness how secant lines rotate and converge into the exact instantaneous tangent line.",
        "param1Label": "Curve Point (x)",
        "param1Default": 1.5,
        "param1Min": 0.5,
        "param1Max": 3.5,
        "param1Unit": "",
        "param2Label": "Secant Increment (h)",
        "param2Default": 1.2,
        "param2Min": 0.05,
        "param2Max": 2.5,
        "param2Unit": "Δx",
        "principleNote": "As h → 0, the Newton difference quotient resolves from indeterminacy into the exact instantaneous derivative f''(x) = 2x."
    }'::jsonb,
    '2026-10-21T09:00:00Z',
    '2026-10-25T00:00:00Z'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    content = EXCLUDED.content,
    subject = EXCLUDED.subject,
    category = EXCLUDED.category,
    tags = EXCLUDED.tags,
    learner_level = EXCLUDED.learner_level,
    featured_image = EXCLUDED.featured_image,
    video_url = EXCLUDED.video_url,
    learning_objectives = EXCLUDED.learning_objectives,
    worked_examples = EXCLUDED.worked_examples,
    knowledge_checks = EXCLUDED.knowledge_checks,
    faqs = EXCLUDED.faqs,
    simulation = EXCLUDED.simulation,
    updated_at = now();

-- 2. SEED PODCAST EPISODES (Beyoutiful Talks)
INSERT INTO public.podcast_episodes (
    id, episode_number, title, slug, summary, description,
    guest_name, guest_role, audio_url, video_url, cover_image,
    duration_minutes, transcript, tags, status, published_at, created_at, updated_at
) VALUES
(
    'ep-1',
    1,
    'The Quiet Revolution of Self-Permission',
    'quiet-revolution-self-permission',
    'Why the most radical thing you can do in a performative world is to show up without armor or apologies.',
    'In this opening episode of Beyoutiful Talks, we sit down with clinical psychologist Dr. Maya Lin to explore the psychological toll of social comparison and the liberation that comes when you stop auditioning for other people''s approval.',
    'Dr. Maya Lin',
    'Clinical Psychologist & Author',
    'https://cdn.freesound.org/previews/682/682025_11861866-lq.mp3',
    'https://www.youtube.com/watch?v=X4Qm9cZeyGE',
    '/src/assets/images/eusatis_talks_studio_1792624720801.jpg',
    42,
    'Transcript excerpt: "Authenticity is not about rebellion for the sake of drama. It is simply the quiet decision to tell the truth about what is inside you."',
    ARRAY['Authenticity', 'Mental Health', 'Identity', 'Self-Permission'],
    'published',
    '2026-10-12T14:00:00Z',
    '2026-10-12T14:00:00Z',
    '2026-10-25T00:00:00Z'
),
(
    'ep-2',
    2,
    'From Confusion to Clarity: The Anatomy of Insight',
    'anatomy-of-insight',
    'Tracing the exact neurological and emotional moment when a difficult concept suddenly clicks.',
    'Cognitive scientist Kwame Mensah deconstructs the "Aha!" moment—the neurochemical cascade that turns anxiety into genuine mastery.',
    'Kwame Mensah',
    'Cognitive Neuroscientist',
    'https://cdn.freesound.org/previews/682/682025_11861866-lq.mp3',
    'https://www.youtube.com/watch?v=keLN89CWZ-A',
    '/src/assets/images/eusatis_aha_moment_1792624721004.jpg',
    38,
    'Transcript excerpt: "When you understand something, your shoulders literally drop. The body recognizes resolution."',
    ARRAY['Neuroscience', 'Education', 'Learning', 'Curiosity'],
    'published',
    '2026-10-16T14:00:00Z',
    '2026-10-16T14:00:00Z',
    '2026-10-25T00:00:00Z'
),
(
    'ep-3',
    3,
    'Beyond Performative Living: Crafting an Honest Life',
    'beyond-performative-living',
    'Author Sarah Jenkins discusses uncoupling personal identity from external milestones and metric-driven validation.',
    'Sarah Jenkins and host discuss what remains when you stop optimizing every waking hour for an invisible audience.',
    'Sarah Jenkins',
    'Social Essayist & Educator',
    'https://cdn.freesound.org/previews/682/682025_11861866-lq.mp3',
    'https://www.youtube.com/watch?v=7qOFtL3VEBc',
    '/src/assets/images/eusatis_talks_studio_1792624720801.jpg',
    46,
    'Transcript excerpt: "A life measured by external praise is a life forever leased to someone else."',
    ARRAY['Culture', 'Mindfulness', 'Personal Growth'],
    'published',
    '2026-10-20T14:00:00Z',
    '2026-10-20T14:00:00Z',
    '2026-10-25T00:00:00Z'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    description = EXCLUDED.description,
    guest_name = EXCLUDED.guest_name,
    guest_role = EXCLUDED.guest_role,
    audio_url = EXCLUDED.audio_url,
    video_url = EXCLUDED.video_url,
    cover_image = EXCLUDED.cover_image,
    duration_minutes = EXCLUDED.duration_minutes,
    tags = EXCLUDED.tags,
    updated_at = now();

-- 3. SEED IMPACT STORIES (Eusatis Impact)
INSERT INTO public.impact_stories (
    id, title, slug, category, summary, full_story, location,
    featured_image, video_url, gallery_images, project_date, outcomes,
    partner_names, status, published_at, created_at, updated_at
) VALUES
(
    'imp-1',
    'Rural School Science Laboratory Revitalization',
    'rural-school-science-lab-revitalization',
    'Educational Outreach',
    'Equipping 14 secondary schools with interactive physics kits, optical benches, and teacher training programs.',
    'When students can see light bend with their own eyes, physics stops being a collection of arbitrary formulas to memorize for an examination. In partnership with local educational directorates, Eusatis delivered hands-on physical science kits directly to 14 rural secondary schools across three districts.',
    'Ashanti & Eastern Regions',
    '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
    'https://www.youtube.com/watch?v=y55tzg_jC9r',
    ARRAY[
        '/src/assets/images/eusatis_stem_learning_1792624719640.jpg',
        '/src/assets/images/eusatis_impact_community_1792624720900.jpg'
    ],
    'June - September 2026',
    '[
        {"metric": "14", "label": "Schools Equipped"},
        {"metric": "4,200+", "label": "Students Impacted"},
        {"metric": "86%", "label": "Pass Rate Improvement"}
    ]'::jsonb,
    ARRAY['Regional Education Service', 'Horizon STEM Initiative'],
    'published',
    '2026-09-30T10:00:00Z',
    '2026-09-30T10:00:00Z',
    '2026-10-25T00:00:00Z'
),
(
    'imp-2',
    'Clean Water Sensor Deployment & STEM Education',
    'clean-water-sensor-stem-education',
    'Community Health & Science',
    'High school students build low-cost turbidity and pH sensor arrays to monitor community borehole drinking water.',
    'True understanding creates responsibility. In this pilot project, 120 senior high school students learned embedded computing and water chemistry by constructing solar-powered sensor stations for community wells.',
    'Volta Basin Communities',
    '/src/assets/images/eusatis_impact_community_1792624720900.jpg',
    'https://www.youtube.com/watch?v=RmsiH_qO_hI',
    ARRAY[
        '/src/assets/images/eusatis_impact_community_1792624720900.jpg',
        '/src/assets/images/eusatis_aha_moment_1792624721004.jpg'
    ],
    'August 2026',
    '[
        {"metric": "12", "label": "Boreholes Monitored"},
        {"metric": "120", "label": "Student Technicians Trained"},
        {"metric": "9,800+", "label": "Residents Served"}
    ]'::jsonb,
    ARRAY['Water Quality Trust', 'District Health Directorate'],
    'published',
    '2026-10-05T10:00:00Z',
    '2026-10-05T10:00:00Z',
    '2026-10-25T00:00:00Z'
),
(
    'imp-3',
    'The Youth Philosophy & Critical Thinking Circles',
    'youth-philosophy-critical-thinking',
    'Human Development',
    'Weekly community dialogue spaces teaching logical reasoning, cognitive bias identification, and authentic discourse.',
    'In an era dominated by rapid digital reaction and social conformity, the ability to think independently and speak without pretense is vital for human flourishing.',
    'Accra & Kumasi Hubs',
    '/src/assets/images/eusatis_talks_studio_1792624720801.jpg',
    'https://www.youtube.com/watch?v=X4Qm9cZeyGE',
    ARRAY[
        '/src/assets/images/eusatis_talks_studio_1792624720801.jpg',
        '/src/assets/images/eusatis_stem_learning_1792624719640.jpg'
    ],
    'Ongoing (Initiated July 2026)',
    '[
        {"metric": "28", "label": "Dialogues Hosted"},
        {"metric": "640+", "label": "Youth Participants"},
        {"metric": "94%", "label": "Confidence Rating"}
    ]'::jsonb,
    ARRAY['Beyoutiful Talks Circle', 'Community Youth Council'],
    'published',
    '2026-10-10T10:00:00Z',
    '2026-10-10T10:00:00Z',
    '2026-10-25T00:00:00Z'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    full_story = EXCLUDED.full_story,
    location = EXCLUDED.location,
    featured_image = EXCLUDED.featured_image,
    video_url = EXCLUDED.video_url,
    gallery_images = EXCLUDED.gallery_images,
    outcomes = EXCLUDED.outcomes,
    partner_names = EXCLUDED.partner_names,
    updated_at = now();
