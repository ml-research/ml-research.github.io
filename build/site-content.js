/*
 * Shared site content used by scripts/site.js. Update the data below to adapt
 * hero statistics, research focus areas, teaching offers, and people sections.
 */
window.AIML_SITE_CONTENT = {
  "heroStats": [
    { "value": "30+", "label": "Researchers, fellows & students", "icon": "👥", "colClass": "col-6 col-md-4" },
    { "value": "Part of", "label": "TU Darmstadt, DFKI, Hessian.AI & partner networks", "icon": "🏛️", "colClass": "col-6 col-md-4" },
    { "value": "Open research", "label": "Benchmarks, datasets & toolkits shared every year", "icon": "🛠️", "colClass": "col-12 col-md-4" }
  ],
  "focusAreas": [
    { "title": "Responsible & Trustworthy AI", "description": "Verification, uncertainty quantification, and alignment techniques enabling dependable AI deployments in safety-critical domains.", "image": "./images/themes/trustworthy.svg", "link": "./research/trustworthy/index.html", "colClass": "col-md-6 col-xl-3" },
    { "title": "Generative & Probabilistic Models", "description": "Advancing generative, probabilistic, and causal modeling to reason under uncertainty and synthesize complex data.", "image": "./images/themes/generative.svg", "link": "./research/generative/index.html", "colClass": "col-md-6 col-xl-3" },
    { "title": "Neuro-Symbolic & Reasoning Systems", "description": "Combining neural learning with symbolic structure for interpretable reasoning, knowledge infusion, and robust decision making.", "image": "./images/themes/neurosymbolic.svg", "link": "./research/neurosymbolic/index.html", "colClass": "col-md-6 col-xl-3" },
    { "title": "Interactive & Applied AI", "description": "Human-centered and domain-driven AI for science, industry, and society, spanning healthcare, mobility, climate, and beyond.", "image": "./images/themes/applied.svg", "link": "./research/applied/index.html", "colClass": "col-md-6 col-xl-3" }
  ],
  "currentTeaching": [
    {
      "term": "Winter",
      "title": "Introduction into Artificial Intelligence",
      "abbreviation": "EiKI",
      "description": "Comprehensive overview of intelligent systems including search, planning, reasoning, logic, statistics and ML.",
      "format": "Lecture",
      "credits": "5 CP",
      "recommended": "Recommended early in the Bachelor programme.",
      "language": "German (materials in English)",
      "lastTaught": "Winter 2025",
      "link": "./lectures/eiki/index.html",
      "responsible": ["Jannis Blüml", "Cedric Derstroff"]
    },
    {
      "term": "Summer",
      "title": "Data Mining & Machine Learning",
      "abbreviation": "DMML",
      "description": "Fundamentals of data-driven inference across structured and unstructured domains.",
      "format": "Lecture",
      "credits": "6 CP",
      "recommended": "Bachelor 4th semester or later.",
      "language": "English",
      "lastTaught": "Summer 2025",
      "link": "./lectures/dmml2025sose/index.html",
      "responsible": ["Course team"]
    },
    {
      "term": "Summer",
      "title": "Deep Learning: Architectures and Methods",
      "abbreviation": "DLAM",
      "description": "Modern neural architectures, optimisation, and generative models.",
      "format": "Lecture",
      "credits": "6 CP",
      "recommended": "After DMML or equivalent.",
      "language": "English",
      "lastTaught": "Summer 2025",
      "link": "./lectures/dl2025sose/index.html",
      "responsible": ["Course team"]
    },
    {
      "term": "Winter",
      "title": "Probabilistic Graphical Models",
      "abbreviation": "PGM",
      "description": "Modeling complex dependencies with graphical models, inference algorithms, and scientific applications.",
      "format": "Lecture",
      "credits": "6 CP",
      "recommended": "Advanced Master students focusing on probabilistic AI.",
      "language": "English",
      "lastTaught": "Winter 2025",
      "link": "./lectures/pgm2024wise/index.html",
      "responsible": ["Course team"]
    },
    {
      "term": "Irregular",
      "title": "Causality in AI",
      "abbreviation": "CausalAI",
      "description": "Principles and algorithms for causal discovery, inference, and decision making across science and engineering.",
      "format": "Lecture",
      "credits": "3 CP",
      "recommended": "For students with strong statistics and machine-learning background.",
      "language": "English",
      "lastTaught": "Winter 2025",
      "link": "./lectures/causality/index.html",
      "responsible": ["Course team"]
    },
    {
      "term": "Irregular",
      "title": "Practical Research in AI",
      "abbreviation": "PRAI",
      "description": "Team-based research projects tackling open problems in trustworthy, generative, and applied AI.",
      "format": "Project / Seminar",
      "credits": "6-9 CP",
      "recommended": "For students aiming to explore research before a thesis.",
      "language": "English",
      "lastTaught": "Summer 2025",
      "link": "./lectures/prai/index.html",
      "responsible": ["AIML supervisors"]
    }
  ],
  "peopleSections": [
    {
      "id": "organization",
      "title": "Organization",
      "description": "Lab leadership and coordination ensure the AIML Lab runs smoothly.",
      "defaultVisible": true,
      "people": [
        { "id": "kkersting", "name": "Prof. Dr. Kristian Kersting", "role": "Lab Director", "focus": "Head of ML group" },
        { "id": "itesar", "name": "Ira Tesar", "role": "Team Manager", "focus": "Operations & Administration" },
        { "id": "vtaylor", "name": "Vivian Taylor", "role": "Administration", "focus": "IT, Hardware, Administration" }
      ]
    },
       {
      "id": "researchers",
      "title": "Researchers",
      "description": "Doctoral researchers, postdocs, and research leads advancing reliable, human-centered AI.",
      "defaultVisible": true,
      "people": [
        { "id": "pschramowski", "name": "Dr. Patrick Schramowski", "role": "Junior Research Group Leader", "focus": "Responsible foundation & vision models" },
        { "id": "wstammer", "name": "Dr. Wolfgang Stammer", "role": "Postdoc", "focus": "Explainable & Responsible AI" },
        { "id": "mbrack", "name": "Dr. Manuel Brack", "role": "Researcher", "focus": "Generative safety & alignment" },
        { "id": "dhintersdorf", "name": "Dr. Dominik Hintersdorf", "role": "Senior Researcher", "focus": "Trustworthy Machine Learning" },
        { "id": "zyu", "name": "Dr. Zhongjie Yu", "role": "Postdoc", "focus": "Probabilistic modeling" },
        { "id": "jblueml", "name": "Jannis Blüml", "role": "PhD Candidate", "focus": "Reinforcement Learning & Neuro-Symbolic AI" },
        { "id": "sbraun", "name": "Steven Braun", "role": "PhD Candidate", "focus": "Probabilistic Circuits" },
        { "id": "fbusch", "name": "Florian Busch", "role": "PhD Candidate", "focus": "Causal AI & Probabilistic Circuits" },
        { "id": "jczech", "name": "Johannes Czech", "role": "PhD Candidate", "focus": "Game AI & planning" },
        { "id": "qdelfosse", "name": "Quentin Delfosse", "role": "PhD Candidate", "focus": "Reinforcement Learning & Neuro-Symbolic AI" },
        { "id": "cderstroff", "name": "Cedric Derstroff", "role": "PhD Candidate", "focus": "Reinforcement Learning" },
        { "id": "fdivo", "name": "Felix Divo", "role": "PhD Candidate", "focus": "Interpretable Time Series Models" },
        { "id": "remunds", "name": "Raban Emunds", "role": "PhD Candidate", "focus": "Robust & interpretable reinforcement learning" },
        { "id": "rhaerle", "name": "Ruben Härle", "role": "PhD Candidate", "focus": "Trustworthy large language models" },
        { "id": "nhegde", "name": "Niharika Hegde", "role": "PhD Candidate", "focus": "Continual learning & unlearning in foundation models" },
        { "id": "lhelff", "name": "Lukas Helff", "role": "PhD Candidate", "focus": "Safety and Reasoning in AI" },
        { "id": "skohaut", "name": "Simon Kohaut", "role": "PhD Candidate", "focus": "Neuro-Symbolic Systems & Robotics" },
        { "id": "mkomisarczyk", "name": "Mieszko Komisarczyk", "role": "PhD Candidate", "focus": "Efficient Inference Approaches" },
        { "id": "mkraus", "name": "Maurice Kraus", "role": "PhD Candidate", "focus": "Interactive temporal modeling & large-scale models"},
        { "id": "rkamath", "name": "Roshni Kamath", "role": "PhD Candidate", "focus": "Continual Learning" },
        { "id": "rmitchell", "name": "Rupert Mitchell", "role": "PhD Candidate", "focus": "Trustworthy AI" },
        { "id": "dochs", "name": "Daniel Ochs", "role": "PhD Candidate", "focus": "Neurosymbolic AI" },
        { "id": "vpfanschilling", "name": "Viktor Pfanschilling", "role": "PhD Candidate", "focus": "Probabilistic Programming" },
        { "id": "jseng", "name": "Jonas Seng", "role": "PhD Candidate", "focus": "Automated ML & Causality" },
        { "id": "jsha", "name": "Jingyuan Sha", "role": "PhD Candidate", "focus": "Causal ML" },
        { "id": "hshindo", "name": "Hikaru Shindo", "role": "PhD Candidate", "focus": "Neuro-Symbolic AI" },
        { "id": "skryagin", "name": "Arseny Skryagin", "role": "PhD Candidate", "focus": "Neuro-symbolic AI" },
        { "id": "dsteinmann", "name": "David Steinmann", "role": "PhD Candidate", "focus": "Interpretable & Concept-based AI" },
        { "id": "gsudhakaran", "name": "Gopika Sudhakaran", "role": "PhD Candidate", "focus": "Responsible AI" },
        { "id": "ssztwiertnia", "name": "Sebastian Sztwiertnia", "role": "PhD Candidate", "focus": "Explainable healthcare AI" },
        { "id": "fventola", "name": "Fabrizio Ventola", "role": "PhD Candidate", "focus": "Tractable probabilistic modeling" },
        { "id": "mwillig", "name": "Moritz Willig", "role": "PhD Candidate", "focus": "Causal AI" },
        { "id": "twoydt", "name": "Tim Woydt", "role": "PhD Candidate", "focus": "Human-robot collaboration" },
        { "id": "awuest", "name": "Antonia Wüst", "role": "PhD Candidate", "focus": "Neuro-Symbolic AI" }, 
        { "id": "zye", "name": "Zihan Ye", "role": "PhD Candidate", "focus": "Reinforcement Learning and Neuro-Symbolic AI" },
        { "id": "mzecevic", "name": "Matej Zečević", "role": "PhD Candidate", "focus": "Generative modeling" }
      ]
    },
    {
      "id": "robots",
      "title": "Robots",
      "description": "Embodied lab members bringing our research into the physical world.",
      "people": [
        { "id": "alfie", "name": "Alfie", "role": "Service robot", "focus": "Interactive lab assistant" },
        { "id": "haiml", "name": "HAIML-9000", "role": "AI mascot", "focus": "Lab ambassador" }
      ]
    },
    {
      "id": "alumni",
      "title": "Alumni",
      "description": "Former AIML Lab members shaping AI in academia and industry worldwide.",
      "people": [
        { "id": "lstruppek", "name": "Dr. Lukas Struppek", "role": "Alumnus", "focus": "FAR.AI" },
        { "id": "ddhami", "name": "Dr. Devendra Singh Dhami", "role": "Alumnus", "focus": "TU Eindhoven" },
        { "id": "cturan", "name": "Dr. Cigdem Turan-Schwiewager", "role": "Alumna", "focus": "Coach AI" },
        { "id": "mmundt", "name": "Dr. Martin Mundt", "role": "Alumnus", "focus": "University of Bremen" },
        { "id": "spaul", "name": "Subarnaduti Paul", "role": "Alumnus", "focus": "University of Bremen" },
        { "id": "ffriedrich", "name": "Dr. Felix Friedrich", "role": "Alumnus", "focus": "Meta FAIR" },
        { "id": "kstelzner", "name": "Dr. Karl Stelzner", "role": "Alumnus", "focus": "Google Research" },
        { "id": "ctauchmann", "name": "Dr. Christopher Tauchmann", "role": "Alumnus", "focus": "Hessian.AI" },
        { "id": "pprasad", "name": "Pooja Prasad", "role": "Alumna", "focus": "TU Eindhoven" },
        { "id": "xshao", "name": "Dr. Xiaoting Shao", "role": "Alumna", "focus": "Evonik" },
        { "id": "amolina", "name": "Dr. Alejandro Molina", "role": "Alumnus", "focus": "Amazon" },
        { "id": "msubasioglu", "name": "Meltem Subasioglu", "role": "Alumna", "focus": "NExplore" },
        { "id": "jfeng", "name": "Dr. Jing Feng", "role": "Alumna", "focus": "China" },
        { "image": "./images/babakAhmadi.jpg", "name": "Dr. Babak Ahmadi", "role": "Alumnus", "focus": "BitStar" },
        { "image": "./images/elenaErdmann.jpg", "name": "Elena Erdmann", "role": "Alumna", "focus": "ZEIT Online" },
        { "image": "./images/fabianHadiji.jpg", "name": "Dr. Fabian Hadiji", "role": "Alumnus", "focus": "goedle.io" },
        { "image": "./images/ahmedJawad.jpg", "name": "Dr. Ahmed Jawad", "role": "Alumnus", "focus": "Allianz" },
        { "image": "./images/marionNeumann.jpg", "name": "Dr. Marion Neumann", "role": "Alumna", "focus": "Washington University in St. Louis" },
        { "image": "./images/mirwaesWahabzada.jpg", "name": "Dr. Mirwaes Wahabzada", "role": "Alumnus", "focus": "University of Bonn" },
        { "image": "./images/zhaoXu.jpg", "name": "Dr. Zhao Xu", "role": "Alumnus", "focus": "Fraunhofer FIT" },
        { "image": "./images/martinMladenov.jpg", "name": "Martin Mladenov", "role": "Alumnus", "focus": "Google Research" }
      ]
    }
  ]
};
