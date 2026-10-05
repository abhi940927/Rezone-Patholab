import { DiagnosticTest, HealthPackage, PatientReportData } from '../types';

export const HEALTH_PACKAGES: HealthPackage[] = [
  {
    id: 'essential-shield',
    name: 'ReZone Essential Health Shield',
    tagline: 'Foundational annual profile covering major vital organ systems and lipid metabolic baseline.',
    parametersCount: 64,
    discountPercentage: 50,
    originalPrice: 999,
    discountedPrice: 499,
    fastingHours: 10,
    category: 'all',
    keyIncludes: [
      'Complete Hemogram (CBC - 24)',
      'Liver Function Test (LFT - 12)',
      'Kidney Function Test (KFT - 9)',
      'Lipid Cardiac Risk (9)',
      'Fasting Blood Glucose',
      'Urine Routine Examination (9)'
    ],
    perks: ['Complimentary Home Collection', 'Sterile Vacuum Blood Draw', '6-Hr Digital TAT'],
    departments: [
      {
        name: 'Complete Blood Count (CBC - 24 Tests)',
        tests: ['Hemoglobin', 'PCV/Hematocrit', 'RBC Count', 'MCV', 'MCH', 'MCHC', 'RDW-CV', 'RDW-SD', 'WBC Total Count', 'Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils', 'Basophils', 'Absolute Neutrophil Count', 'Absolute Lymphocyte Count', 'Absolute Monocyte Count', 'Absolute Eosinophil Count', 'Absolute Basophil Count', 'Platelet Count', 'Mean Platelet Volume (MPV)', 'Platelet Distribution Width (PDW)', 'Plateletcrit (PCT)', 'ESR (Automated)']
      },
      {
        name: 'Liver Function Profile (LFT - 12 Tests)',
        tests: ['Total Bilirubin', 'Direct Bilirubin', 'Indirect Bilirubin', 'SGOT / AST', 'SGPT / ALT', 'Alkaline Phosphatase (ALP)', 'Total Protein', 'Serum Albumin', 'Serum Globulin', 'A/G Ratio', 'Gamma-Glutamyl Transferase (GGT)', 'Serum Lactate Dehydrogenase (LDH)']
      },
      {
        name: 'Renal / Kidney Profile (KFT - 9 Tests)',
        tests: ['Serum Creatinine', 'Blood Urea Nitrogen (BUN)', 'BUN / Creatinine Ratio', 'Serum Uric Acid', 'Serum Sodium (Na+)', 'Serum Potassium (K+)', 'Serum Chloride (Cl-)', 'Estimated GFR (eGFR)', 'Serum Phosphorus']
      },
      {
        name: 'Lipid Heart Risk Screen (9 Tests)',
        tests: ['Total Cholesterol', 'HDL Cholesterol (Protective)', 'LDL Cholesterol (Atherogenic)', 'VLDL Cholesterol', 'Triglycerides', 'TC / HDL Ratio', 'LDL / HDL Ratio', 'Non-HDL Cholesterol', 'Triglyceride / HDL Ratio']
      },
      {
        name: 'Metabolic & Urine Analysis (10 Tests)',
        tests: ['Fasting Blood Glucose (Hexokinase)', 'Urine Specific Gravity', 'Urine pH', 'Urine Protein', 'Urine Glucose', 'Urine Ketones', 'Urine Bilirubin', 'Urine Urobilinogen', 'Urine Pus Cells', 'Urine Microscopic Casts']
      }
    ]
  },
  {
    id: 'vital-plus',
    name: 'ReZone Comprehensive Vital Plus',
    tagline: 'Gold-standard holistic checkup with comprehensive endocrinology, vitamin balance, and heart risk markers.',
    parametersCount: 92,
    discountPercentage: 50,
    originalPrice: 1999,
    discountedPrice: 999,
    isRecommended: true,
    fastingHours: 12,
    category: 'all',
    keyIncludes: [
      'Everything in Essential Shield (64)',
      '25-OH Vitamin D3 Total (LC-MS/MS)',
      'Vitamin B12 Active Holotranscobalamin',
      'Glycated Hemoglobin (HbA1c & AG)',
      'Thyroid Profile Total (T3, T4, TSH)',
      'High-Sensitivity CRP (hs-CRP Cardiac)'
    ],
    perks: ['Free Sample Pickup', 'MD Pathologist Video Consult', 'Same-Day Fasting Slot Guarantee'],
    departments: [
      {
        name: 'Endocrine & Thyroid Profile (3 Tests)',
        tests: ['Total Triiodothyronine (T3)', 'Total Thyroxine (T4)', 'Ultrasensitive 3rd Gen TSH']
      },
      {
        name: 'Diabetes & Glycemic Glycation (3 Tests)',
        tests: ['HbA1c (Gold Standard HPLC)', 'Estimated Average Glucose (eAG)', 'Fasting Plasma Glucose']
      },
      {
        name: 'Vital Micronutrients & Neuro-Vitamins (2 Tests)',
        tests: ['25-OH Vitamin D Total (CLIA Immunoassay)', 'Serum Vitamin B12 (Cyanocobalamin)']
      },
      {
        name: 'Inflammatory & Cardiac Vascular (4 Tests)',
        tests: ['High-Sensitivity C-Reactive Protein (hs-CRP)', 'Serum Calcium Total', 'Serum Magnesium', 'Iron Deficiency Profile (Serum Iron, TIBC, % Transferrin Saturation)']
      },
      {
        name: 'Comprehensive Hemogram, LFT, KFT & Lipids (80 Tests)',
        tests: ['24-Param Automated Hemogram', '12-Param Liver Panel', '9-Param Renal Panel', '9-Param Advanced Lipid Panel', '10-Param Urinalysis', '16-Param Electrolyte & Enzyme Matrix']
      }
    ]
  },
  {
    id: 'senior-care',
    name: 'ReZone Senior Citizen Executive Care',
    tagline: 'Deep clinical investigation tailored for geriatrics, oncology screening, and arthritis markers.',
    parametersCount: 108,
    discountPercentage: 50,
    originalPrice: 2999,
    discountedPrice: 1499,
    fastingHours: 12,
    category: 'seniors',
    keyIncludes: [
      'Comprehensive Vital Plus (92 Tests)',
      'PSA (Men) / CA-125 (Women) Tumor Marker',
      'Rheumatoid Factor (RA) & Bone Profile',
      'Serum Electrolytes & Ionized Calcium',
      'Apolipoprotein A1 & B Ratios',
      'Senior-Specialist Home Visit'
    ],
    perks: ['Senior-Specialist Home Visit', 'Geriatric Report Interpretation', 'Priority Lab Routing'],
    departments: [
      {
        name: 'Tumor Biomarkers & Oncology Screen',
        tests: ['Total PSA (Prostate Specific Antigen) / CA-125 Ovarian Screen', 'CEA (Carcinoembryonic Antigen)', 'AFP (Alpha Fetoprotein Screen)']
      },
      {
        name: 'Arthritis & Rheumatology Profile',
        tests: ['Rheumatoid Factor Quantitative (RA)', 'Anti-CCP Antibodies', 'Serum Uric Acid Crystals Risk', 'Alkaline Phosphatase Bone Isoenzyme']
      },
      {
        name: 'Bone Density & Mineral Homeostasis',
        tests: ['Ionized Serum Calcium', 'Serum Phosphorus', 'Parathyroid Hormone (iPTH intact)', 'Vitamin D3 Metabolite']
      },
      {
        name: 'Cardiovascular Vascular Integrity',
        tests: ['Apolipoprotein A-1', 'Apolipoprotein B', 'Apo B / Apo A-1 Ratio', 'Lipoprotein (a) [Lp(a)]']
      },
      {
        name: 'Standard Comprehensive Suite',
        tests: ['92 Vital Plus parameters including CBC, LFT, KFT, HBA1C, Vit D/B12, Thyroid, Urine']
      }
    ]
  },
  {
    id: 'women-hormonal',
    name: "ReZone Women's Hormonal Balance",
    tagline: 'Specialized hormonal, reproductive, thyroid, and cellular anemia profile for women across life stages.',
    parametersCount: 78,
    discountPercentage: 45,
    originalPrice: 2199,
    discountedPrice: 1199,
    fastingHours: 10,
    category: 'women',
    keyIncludes: [
      'PCOD / PCOS Diagnostic Markers',
      'Serum Ferritin & Iron Saturation',
      'Anti-Mullerian Hormone (AMH)',
      'Prolactin & LH/FSH Ratio',
      'Thyroid Antibodies (Anti-TPO)',
      'Female Phlebotomist Option Available'
    ],
    perks: ['Female Phlebotomist on Request', 'Confidential Digital Delivery', 'Gynecologist Tele-Guidance'],

    departments: [
      {
        name: 'Reproductive & Endocrine Hormones',
        tests: ['Luteinizing Hormone (LH)', 'Follicle Stimulating Hormone (FSH)', 'LH / FSH Ratio', 'Serum Prolactin', 'Estradiol (E2)', 'Total Testosterone (Free & Total)']
      },
      {
        name: 'Ovarian Reserve & Metabolic PCOD',
        tests: ['Anti-Mullerian Hormone (AMH)', 'Fasting Insulin (HOMA-IR Index)', 'Dehydroepiandrosterone Sulfate (DHEA-S)']
      },
      {
        name: 'Cellular Anemia & Iron Stores',
        tests: ['Serum Ferritin (Gold standard iron store)', 'Serum Iron', 'Total Iron Binding Capacity (TIBC)', 'Transferrin Saturation Percentage']
      },
      {
        name: 'Thyroid Autoimmunity Panel',
        tests: ['Thyroid Peroxidase Antibodies (Anti-TPO)', 'TSH Ultrasensitive', 'Free T3 & Free T4']
      },
      {
        name: 'Systemic Health Baseline',
        tests: ['Complete Hemogram (24 Tests)', 'Liver Screening', 'Kidney Screening', 'Urine Microscopic']
      }
    ]
  }
];

export const POPULAR_TESTS: DiagnosticTest[] = [
  {
    id: 't-1',
    name: 'Thyroid Profile Total (T3, T4, TSH)',
    category: 'Endocrinology',
    parametersCount: 3,
    fastingHours: 0,
    tatHours: 6,
    originalPrice: 499,
    discountedPrice: 249,
    popular: true,
    sampleType: 'Blood (Serum)',
    description: 'Gold standard automated chemiluminescence immunoassay for hypo/hyperthyroidism detection.',
    keywords: ['thyroid', 'tsh', 't3', 't4', 'hypothyroid', 'hyperthyroid', 'goiter', 'hormone']
  },
  {
    id: 't-2',
    name: 'HbA1c Glycated Hemoglobin with eAG',
    category: 'Diabetes',
    parametersCount: 2,
    fastingHours: 0,
    tatHours: 4,
    originalPrice: 399,
    discountedPrice: 199,
    popular: true,
    sampleType: 'Blood (EDTA)',
    description: 'HPLC ion-exchange method to monitor 90-day average blood glucose concentration.',
    keywords: ['diabetes', 'sugar', 'hba1c', 'glycated', 'eag', 'glucose', 'diabetic', 'insulin']
  },
  {
    id: 't-3',
    name: 'Vitamin D 25-Hydroxy (D2 + D3)',
    category: 'Vitamins',
    parametersCount: 2,
    fastingHours: 0,
    tatHours: 8,
    originalPrice: 799,
    discountedPrice: 399,
    popular: true,
    sampleType: 'Blood (Serum)',
    description: 'Assesses bone density risk, fatigue, immunological vitality, and calcium metabolism.',
    keywords: ['vitamin d', 'd3', 'vitamin d3', 'vit d', 'calcium', 'bone', 'weakness', 'fatigue']
  },
  {
    id: 't-4',
    name: 'Vitamin B12 (Active Cyanocobalamin)',
    category: 'Vitamins',
    parametersCount: 1,
    fastingHours: 0,
    tatHours: 6,
    originalPrice: 599,
    discountedPrice: 299,
    popular: true,
    sampleType: 'Blood (Serum)',
    description: 'Critical marker for nerve health, memory, cognitive function, and megaloblastic anemia.',
    keywords: ['vitamin b12', 'b12', 'vit b12', 'nerve', 'tingling', 'memory', 'anemia', 'neuro']
  },
  {
    id: 't-5',
    name: 'Complete Blood Count (CBC with Automated ESR)',
    category: 'Hematology',
    parametersCount: 25,
    fastingHours: 0,
    tatHours: 4,
    originalPrice: 350,
    discountedPrice: 149,
    popular: true,
    sampleType: 'Blood (EDTA)',
    description: 'High-precision 6-part optical differential flow cytometry for infections, platelets, and anemia.',
    keywords: ['cbc', 'hemoglobin', 'platelet', 'wbc', 'rbc', 'esr', 'blood count', 'infection', 'fever', 'blood test']
  },
  {
    id: 't-6',
    name: 'Lipid Profile Comprehensive',
    category: 'Cardiac',
    parametersCount: 9,
    fastingHours: 12,
    tatHours: 6,
    originalPrice: 599,
    discountedPrice: 299,
    popular: true,
    sampleType: 'Blood (Serum)',
    description: 'Evaluates cardiovascular plaque risk, HDL, LDL, VLDL, and atherogenic ratios.',
    keywords: ['lipid', 'cholesterol', 'triglycerides', 'hdl', 'ldl', 'heart', 'cardiac', 'fat']
  },
  {
    id: 't-7',
    name: 'Liver Function Test (LFT 12 Parameters)',
    category: 'Full Body',
    parametersCount: 12,
    fastingHours: 8,
    tatHours: 6,
    originalPrice: 499,
    discountedPrice: 249,
    popular: true,
    sampleType: 'Blood (Serum)',
    description: 'Hepatic enzymes, bilirubin fractions, and proteins evaluating liver tissue health.',
    keywords: ['liver', 'lft', 'sgpt', 'sgot', 'alt', 'ast', 'bilirubin', 'jaundice', 'fatty liver', 'alkaline phosphatase']
  },
  {
    id: 't-8',
    name: 'Kidney Function Test (KFT / RFT with Electrolytes)',
    category: 'Renal',
    parametersCount: 9,
    fastingHours: 0,
    tatHours: 6,
    originalPrice: 499,
    discountedPrice: 249,
    popular: true,
    sampleType: 'Blood (Serum)',
    description: 'Creatinine, BUN, electrolytes (Sodium, Potassium, Chloride), and filtration rate.',
    keywords: ['kidney', 'kft', 'rft', 'creatinine', 'urea', 'bun', 'renal', 'sodium', 'potassium', 'electrolytes', 'uric acid']
  },
  {
    id: 't-9',
    name: 'Fasting Blood Sugar / Glucose (FBS)',
    category: 'Diabetes',
    parametersCount: 1,
    fastingHours: 10,
    tatHours: 3,
    originalPrice: 150,
    discountedPrice: 69,
    popular: true,
    sampleType: 'Blood (Sodium Fluoride)',
    description: 'Quantitative hexokinase enzymatic assay for baseline blood sugar level.',
    keywords: ['sugar', 'glucose', 'fasting sugar', 'fbs', 'blood sugar', 'diabetes']
  },
  {
    id: 't-10',
    name: 'Urine Routine & Microscopic Examination',
    category: 'Full Body',
    parametersCount: 10,
    fastingHours: 0,
    tatHours: 3,
    originalPrice: 200,
    discountedPrice: 99,
    popular: true,
    sampleType: 'Urine (Sterile Container)',
    description: 'Screening for UTIs, renal cast protein leakage, pus cells, and crystals.',
    keywords: ['urine', 'uti', 'urine test', 'pus cells', 'infection', 'proteinuria', 'urine routine']
  },
  {
    id: 't-11',
    name: 'Serum Creatinine (Renal Clearance)',
    category: 'Renal',
    parametersCount: 1,
    fastingHours: 0,
    tatHours: 3,
    originalPrice: 180,
    discountedPrice: 89,
    popular: true,
    sampleType: 'Blood (Serum)',
    description: 'Enzymatic Jaffé kinetic assay measuring kidney filtration efficiency and muscle metabolism.',
    keywords: ['creatinine', 'kidney', 'renal', 'egfr', 'filtration', 'nephrology']
  },
  {
    id: 't-12',
    name: 'Calcium & Phosphorus Bone Mineral Profile',
    category: 'Vitamins',
    parametersCount: 2,
    fastingHours: 0,
    tatHours: 6,
    originalPrice: 350,
    discountedPrice: 169,
    sampleType: 'Blood (Serum)',
    description: 'Evaluates musculoskeletal strength, parathyroid regulation, and osteoporosis risk.',
    keywords: ['calcium', 'phosphorus', 'bone', 'joints', 'osteoporosis', 'mineral']
  },
  {
    id: 't-13',
    name: 'Serum Ferritin (Iron Deficiency & Storage)',
    category: 'Hematology',
    parametersCount: 1,
    fastingHours: 8,
    tatHours: 8,
    originalPrice: 499,
    discountedPrice: 249,
    sampleType: 'Blood (Serum)',
    description: 'Assesses cellular iron reserves before anemia is clinically visible on standard blood counts.',
    keywords: ['iron', 'ferritin', 'anemia', 'hemoglobin', 'hair loss', 'fatigue', 'iron deficiency']
  },
  {
    id: 't-14',
    name: 'Dengue NS1 Antigen & Antibody (IgG/IgM)',
    category: 'Hematology',
    parametersCount: 3,
    fastingHours: 0,
    tatHours: 4,
    originalPrice: 799,
    discountedPrice: 399,
    popular: true,
    sampleType: 'Blood (Serum)',
    description: 'Rapid diagnosis of acute vector-borne dengue virus infection and immune status.',
    keywords: ['dengue', 'ns1', 'platelets', 'viral fever', 'mosquito', 'dengue antibody']
  },
  {
    id: 't-15',
    name: 'Typhoid Widal Slide & Tube Test',
    category: 'Hematology',
    parametersCount: 4,
    fastingHours: 0,
    tatHours: 4,
    originalPrice: 280,
    discountedPrice: 129,
    popular: true,
    sampleType: 'Blood (Serum)',
    description: 'Quantitative agglutination test detecting Salmonella enterica antibodies in enteric fever.',
    keywords: ['typhoid', 'widal', 'salmonella', 'enteric fever', 'continuous fever', 'infection']
  },
  {
    id: 't-16',
    name: 'Cardiac Troponin I High-Sensitivity (hs-cTnI)',
    category: 'Cardiac',
    parametersCount: 1,
    fastingHours: 0,
    tatHours: 3,
    originalPrice: 999,
    discountedPrice: 499,
    sampleType: 'Blood (Serum)',
    description: 'Emergency sensitive cardiac biomarker for myocardial injury and ischemic events.',
    keywords: ['troponin', 'heart attack', 'cardiac', 'chest pain', 'myocardial', 'ecg']
  },
  {
    id: 't-17',
    name: 'High-Sensitivity C-Reactive Protein (hs-CRP)',
    category: 'Cardiac',
    parametersCount: 1,
    fastingHours: 0,
    tatHours: 4,
    originalPrice: 450,
    discountedPrice: 229,
    popular: true,
    sampleType: 'Blood (Serum)',
    description: 'Laser immunoturbidimetric marker quantifying arterial wall inflammation and cardiovascular risk.',
    keywords: ['crp', 'hs-crp', 'inflammation', 'cardiac risk', 'infection marker', 'vascular']
  },
  {
    id: 't-18',
    name: 'Prostate-Specific Antigen (Total PSA)',
    category: 'Oncology',
    parametersCount: 1,
    fastingHours: 0,
    tatHours: 8,
    originalPrice: 699,
    discountedPrice: 399,
    sampleType: 'Blood (Serum)',
    description: 'Diagnostic tumor marker for benign prostatic hyperplasia and prostate carcinoma.',
    keywords: ['psa', 'prostate', 'tumor marker', 'cancer', 'male cancer', 'urology']
  },
  {
    id: 't-19',
    name: 'Anti-Mullerian Hormone (AMH Fertility)',
    category: 'Women Health',
    parametersCount: 1,
    fastingHours: 0,
    tatHours: 12,
    originalPrice: 1499,
    discountedPrice: 899,
    sampleType: 'Blood (Serum)',
    description: 'Evaluates antral ovarian reserve, egg quantity, and polycystic ovary syndrome (PCOS).',
    keywords: ['amh', 'fertility', 'ovarian reserve', 'pcos', 'pcod', 'pregnancy', 'egg count']
  },
  {
    id: 't-20',
    name: 'Serum Uric Acid (Gout Risk & Joint Pain)',
    category: 'Renal',
    parametersCount: 1,
    fastingHours: 0,
    tatHours: 4,
    originalPrice: 200,
    discountedPrice: 99,
    popular: true,
    sampleType: 'Blood (Serum)',
    description: 'Assesses hyperuricemia, painful joint crystal deposits, and renal stones.',
    keywords: ['uric acid', 'gout', 'joint pain', 'arthritis', 'kidney stone', 'toe pain']
  },
  {
    id: 't-21',
    name: 'Post-Prandial Blood Sugar (PPBS - 2 Hr)',
    category: 'Diabetes',
    parametersCount: 1,
    fastingHours: 0,
    tatHours: 3,
    originalPrice: 150,
    discountedPrice: 69,
    sampleType: 'Blood (Sodium Fluoride)',
    description: 'Assesses post-meal glucose spike exactly 2 hours after breakfast / meal.',
    keywords: ['ppbs', 'sugar post prandial', 'post meal sugar', 'diabetes post meal', 'glucose']
  },
  {
    id: 't-22',
    name: 'Total IgE Allergy Screen',
    category: 'Full Body',
    parametersCount: 1,
    fastingHours: 0,
    tatHours: 8,
    originalPrice: 600,
    discountedPrice: 299,
    sampleType: 'Blood (Serum)',
    description: 'Quantitative measurement of circulating Immunoglobulin E assessing allergic hypersensitivity.',
    keywords: ['allergy', 'ige', 'asthma', 'skin rash', 'sneezing', 'dust allergy', 'rhinitis']
  }
];


export const DEMO_PATIENT_REPORT: PatientReportData = {
  patientId: 'RZ-88219-METRO',
  specimenId: 'RZ-99420-BIO',
  patientName: 'Jonathan Davis',
  age: 44,
  gender: 'Male',
  collectionTime: 'Today at 07:15 AM (Doorstep Collection)',
  reportingTime: 'Today at 01:45 PM (Dual Validation Co-Signed)',
  referredBy: 'Dr. Anil Kumar Singh, MD (Chief Consultant)',
  pathologist: 'Dr. Anil Kumar Singh, MD Path (Chief Clinical Pathologist & Lab Director)',
  coSigner: 'Dr. Sarah Chen, PhD (Clinical Biochemist & QA Officer)',
  coldChainTemperature: 4.1, // °C
  biomarkers: [
    {
      name: 'Glycated Hemoglobin (HbA1c)',
      category: 'Endocrinology / Glycemic',
      value: 5.4,
      unit: '%',
      referenceRange: '< 5.7 Normal, 5.7 - 6.4 Pre-diabetic, ≥ 6.5 Diabetic',
      minNormal: 4.0,
      maxNormal: 5.6,
      status: 'Optimal',
      interpretation: 'Glycemic control is in the superior normal band. Estimated average glucose is 108 mg/dL.',
      historicalTrend: [
        { year: '2023', value: 5.8 },
        { year: '2024', value: 5.6 },
        { year: '2025', value: 5.4 }
      ]
    },
    {
      name: '25-OH Vitamin D Total',
      category: 'Micronutrients & Bone Health',
      value: 24.2,
      unit: 'ng/mL',
      referenceRange: '30.0 - 100.0 Sufficient, 20.0 - 29.9 Insufficient, < 20.0 Deficient',
      minNormal: 30.0,
      maxNormal: 100.0,
      status: 'Mild Alert',
      interpretation: 'Mild hypovitaminosis D detected. Cholecalciferol 60k IU weekly supplementation advised for 8 weeks.',
      historicalTrend: [
        { year: '2023', value: 18.4 },
        { year: '2024', value: 21.0 },
        { year: '2025', value: 24.2 }
      ]
    },
    {
      name: 'TSH (Thyroid Stimulating Hormone 3rd Gen)',
      category: 'Thyroid Hormones',
      value: 2.14,
      unit: 'μIU/mL',
      referenceRange: '0.45 - 4.50 μIU/mL',
      minNormal: 0.45,
      maxNormal: 4.5,
      status: 'Optimal',
      interpretation: 'Euthyroid pituitary-thyroid axis functioning with tight physiological feedback.',
      historicalTrend: [
        { year: '2023', value: 2.8 },
        { year: '2024', value: 2.4 },
        { year: '2025', value: 2.14 }
      ]
    },
    {
      name: 'Total Cholesterol',
      category: 'Lipid Profile',
      value: 178,
      unit: 'mg/dL',
      referenceRange: '< 200 Desirable, 200 - 239 Borderline, ≥ 240 High',
      minNormal: 120,
      maxNormal: 200,
      status: 'Optimal',
      interpretation: 'Healthy cardiovascular baseline. HDL:LDL ratio is optimal at 3.2.',
      historicalTrend: [
        { year: '2023', value: 195 },
        { year: '2024', value: 184 },
        { year: '2025', value: 178 }
      ]
    },
    {
      name: 'Serum Creatinine',
      category: 'Renal / Kidney Panel',
      value: 0.92,
      unit: 'mg/dL',
      referenceRange: '0.70 - 1.30 mg/dL',
      minNormal: 0.7,
      maxNormal: 1.3,
      status: 'Optimal',
      interpretation: 'Renal parenchymal filtration normal. Estimated GFR > 90 mL/min/1.73m².',
      historicalTrend: [
        { year: '2023', value: 0.98 },
        { year: '2024', value: 0.94 },
        { year: '2025', value: 0.92 }
      ]
    },
    {
      name: 'SGPT (ALT Liver Enzyme)',
      category: 'Hepatic / Liver Panel',
      value: 28,
      unit: 'U/L',
      referenceRange: '0 - 45 U/L',
      minNormal: 5,
      maxNormal: 45,
      status: 'Optimal',
      interpretation: 'No hepatocellular leakage or fatty hepatic inflammation detected.',
      historicalTrend: [
        { year: '2023', value: 36 },
        { year: '2024', value: 31 },
        { year: '2025', value: 28 }
      ]
    }
  ]
};

export const SAMPLE_PRESCRIPTIONS = [
  {
    title: 'Post-Chemo & Oncology Metabolic Surveillance',
    doctor: 'Dr. Rajesh Varma (DM Medical Oncology)',
    hospital: 'Metro Institute of Clinical Oncology',
    imagePlaceholder: 'rx_oncology.png',
    detectedItems: [
      { name: 'Complete Blood Count (CBC with ANC differential)', code: 'CBC-ANC', fast: 'No', price: 149 },
      { name: 'Comprehensive Metabolic Panel (LFT + KFT)', code: 'CMP-21', fast: '8 hrs', price: 449 },
      { name: 'Serum Electrolytes (Na, K, Cl, Ionized Ca)', code: 'ELEC-4', fast: 'No', price: 199 },
      { name: 'High-Sensitivity Troponin I', code: 'TROP-HS', fast: 'No', price: 499 }
    ],
    originalTotal: 1799,
    discountedTotal: 899,
    savingsText: 'Save ₹900 (50% Hospital Rx Discount)'
  },
  {
    title: 'Endocrine, Thyroid & Diabetes Wellness Rx',
    doctor: 'Dr. Meera Nambiar (MD Endocrinology)',
    hospital: 'Apollo Endocrine Research Center',
    imagePlaceholder: 'rx_endocrine.png',
    detectedItems: [
      { name: 'Glycated HbA1c & Fasting Glucose', code: 'HBA1C-GLU', fast: '10-12 hrs', price: 249 },
      { name: 'Thyroid Ultrasensitive Profile (T3, T4, TSH)', code: 'THY-3', fast: 'No', price: 249 },
      { name: '25-OH Vitamin D3 & B12 Active', code: 'VIT-D-B12', fast: 'No', price: 499 },
      { name: 'Lipid Cardiovascular Panel', code: 'LIP-8', fast: '12 hrs', price: 299 }
    ],
    originalTotal: 1899,
    discountedTotal: 999,
    savingsText: 'Save ₹900 (47% Preventive Subsidy)'
  },
  {
    title: 'Annual Executive Health Screen Rx',
    doctor: 'Dr. Kenneth Vance (Internal Medicine Specialist)',
    hospital: 'Executive Care Medical Tower',
    imagePlaceholder: 'rx_executive.png',
    detectedItems: [
      { name: 'ReZone Comprehensive Vital Plus (92 Parameters)', code: 'RZ-VITAL-92', fast: '12 hrs', price: 999 },
      { name: 'Urine Microalbumin / Creatinine Ratio', code: 'ALB-CR', fast: 'No', price: 199 }
    ],
    originalTotal: 2199,
    discountedTotal: 1199,
    savingsText: 'Save ₹1,000 (45% Executive Wellness Discount)'
  }
];


export const DEFAULT_USER_ADDRESS = {
  address: 'BDO block club road near parwati chandra hotel',
  city: 'Arrah',
  state: 'Bihar',
  country: 'India',
  pincode: '802301',
  fullAddress: 'BDO block club road near parwati chandra hotel, Arrah, Bihar - 802301, India'
};

export const ACCEPTED_HOME_COLLECTION_PINCODE = '802301';

export const SERVICEABLE_PINCODES: Record<string, { city: string; area: string; phlebosActive: number; nearestHub: string; etaMins: number }> = {
  '802301': { 
    city: 'Arrah, Bhojpur (Bihar, India)', 
    area: 'BDO Block, Club Road (near Parwati Chandra Hotel)', 
    phlebosActive: 5, 
    nearestHub: 'ReZone Bihar Regional Diagnostics Hub #12', 
    etaMins: 28 
  }
};

