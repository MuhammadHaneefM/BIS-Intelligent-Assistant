/**
 * Bureau of Indian Standards (BIS) Structured Knowledge Base
 * Official Indian Standards & BIS Services Knowledge Repository
 */

export interface BISStandard {
  id: string;
  isNumber: string; // e.g. "IS 10500:2012"
  title: string;
  department: 'Civil' | 'Electrotechnical' | 'Food & Agriculture' | 'Electronics & IT' | 'Metallurgy' | 'Chemical' | 'Textiles' | 'Medical Equipment';
  category: string;
  scope: string;
  keyParameters: string[];
  status: 'Mandatory' | 'Voluntary';
  gazetteOrder: string;
  isoEquivalent?: string;
  testingLabDiscipline: string;
  sourceDocUrl: string;
  versionDate: string;
  clauseReference: string;
}

export interface BISScheme {
  id: string;
  name: string;
  code: string; // e.g. "Scheme-I", "CRS"
  targetAudience: string;
  markName: string;
  overview: string;
  eligibility: string[];
  processSteps: string[];
  keyDocumentsRequired: string[];
  feeOverview: string;
  msmeConcession: string;
  sourceDocUrl: string;
}

export interface BISFAQ {
  id: string;
  question: string;
  category: 'General' | 'ISI Mark' | 'CRS' | 'Hallmarking' | 'MSME & Fees' | 'Consumer Verification' | 'Laboratory & Testing';
  shortAnswer: string;
  detailedExplanation: string;
  steps?: string[];
  importantNotes?: string;
  clauseCitation: string;
  sourceTitle: string;
  sourceType: string;
  sourceUrl: string;
  date: string;
  isNumber?: string;
  keywords: string[];
}

export interface BISLab {
  id: string;
  name: string;
  type: 'BIS Central Lab' | 'BIS Regional Lab' | 'BIS Branch Lab' | 'BIS Recognized Lab';
  location: string;
  state: string;
  disciplines: string[];
  contact: string;
  accreditation: string;
}

export const BIS_STANDARDS_KNOWLEDGE: BISStandard[] = [
  {
    id: 'is-10500',
    isNumber: 'IS 10500:2012',
    title: 'Drinking Water Specification',
    department: 'Food & Agriculture',
    category: 'Water Quality & Public Health',
    scope: 'Prescribes quality limits for physical, chemical, toxic, and bacteriological parameters of drinking water intended for human consumption.',
    keyParameters: [
      'pH value: 6.5 to 8.5',
      'Total Dissolved Solids (TDS): Max 500 mg/l (Desirable), 2000 mg/l (Permissible)',
      'Turbidity: Max 1 NTU (Desirable), 5 NTU (Permissible)',
      'Total Coliform & E. coli: Shall not be detectable in any 100 ml sample',
      'Heavy metals (Lead, Arsenic, Cadmium): Strict ppm thresholds'
    ],
    status: 'Mandatory',
    gazetteOrder: 'S.O. 1234(E) Quality Control Order for Bottled & Potable Water',
    isoEquivalent: 'WHO Guidelines for Drinking-water Quality / ISO 24510',
    testingLabDiscipline: 'Chemical & Microbiological Testing',
    sourceDocUrl: 'https://www.services.bis.gov.in/php/BIS_2/bis_cafe/standards/IS10500',
    versionDate: '2012 (Reaffirmed 2021)',
    clauseReference: 'IS 10500 Clause 4.1 & Table 1'
  },
  {
    id: 'is-14543',
    isNumber: 'IS 14543:2024',
    title: 'Packaged Drinking Water (Other than Packaged Natural Mineral Water) Specification',
    department: 'Food & Agriculture',
    category: 'Beverages & Packaged Food',
    scope: 'Covers requirements and methods of sampling and test for packaged drinking water offer for sale in sealed containers.',
    keyParameters: [
      'Mandatory ISI Mark certification before manufacturing/sale',
      'Disinfection process (Ozonation, UV, Reverse Osmosis)',
      'Shelf life testing and migration testing for plastic containers',
      'Labeling requirement: Batch No, Date of Mfg, Best Before date'
    ],
    status: 'Mandatory',
    gazetteOrder: 'FSSAI & BIS Quality Control Order 2020',
    isoEquivalent: 'Codex Alimentarius STAN 227-2001',
    testingLabDiscipline: 'Chemical, Microbiological & Toxicological',
    sourceDocUrl: 'https://www.manakonline.in/IS14543',
    versionDate: '2024',
    clauseReference: 'IS 14543 Clause 6.2 & Annex B'
  },
  {
    id: 'is-1293',
    isNumber: 'IS 1293:2019',
    title: 'Plugs and Socket-Outlets of Rated Voltage up to and including 250 Volts and Rated Current up to and including 16 Amperes',
    department: 'Electrotechnical',
    category: 'Electrical Wiring Accessories',
    scope: 'Applies to plugs and fixed or portable socket-outlets for AC only, with or without earthing contact.',
    keyParameters: [
      'Rated voltage: 250V AC',
      'Rated currents: 6A, 16A standard pin geometry',
      'Temperature rise test under full load',
      'Insulation resistance and electric strength test',
      'Protection against electric shock'
    ],
    status: 'Mandatory',
    gazetteOrder: 'Plugs and Socket-Outlets (Quality Control) Order 2021',
    isoEquivalent: 'IEC 60884-1 (Modified)',
    testingLabDiscipline: 'Electrical Safety Testing',
    sourceDocUrl: 'https://www.services.bis.gov.in/IS1293',
    versionDate: '2019 (Reaffirmed 2023)',
    clauseReference: 'IS 1293 Clause 8.1 & 13.2'
  },
  {
    id: 'is-2062',
    isNumber: 'IS 2062:2011',
    title: 'Hot Rolled Medium and High Tensile Structural Steel Specification',
    department: 'Metallurgy',
    category: 'Structural Steel & Construction Materials',
    scope: 'Covers requirements for structural steel quality grades (E250, E300, E350, E410, E450) used in structural and infrastructure projects.',
    keyParameters: [
      'Yield strength (MPa): Min 250 to 450 depending on grade',
      'Tensile strength (MPa): 410 to 630',
      'Elongation percentage min 20-23%',
      'Impact test (Charpy V-notch) at sub-zero temperatures'
    ],
    status: 'Mandatory',
    gazetteOrder: 'Steel and Steel Products (Quality Control) Order 2020',
    isoEquivalent: 'ISO 630-2',
    testingLabDiscipline: 'Mechanical & Metallurgy Testing',
    sourceDocUrl: 'https://www.bis.gov.in/IS2062',
    versionDate: '2011 (Reaffirmed 2021)',
    clauseReference: 'IS 2062 Clause 6 & Table 2'
  },
  {
    id: 'is-13252',
    isNumber: 'IS 13252 (Part 1):2010',
    title: 'Information Technology Equipment - Safety - General Requirements',
    department: 'Electronics & IT',
    category: 'Electronics & IT Equipment (CRS)',
    scope: 'Applies to mains-powered or battery-powered information technology equipment including laptops, power adapters, printers, and servers.',
    keyParameters: [
      'Mandatory registration under BIS Compulsory Registration Scheme (CRS)',
      'Electrical shock hazard prevention',
      'Fire risk and flame resistance ratings (UL94 V-0/V-1)',
      'Thermal endurance and mechanical stability'
    ],
    status: 'Mandatory',
    gazetteOrder: 'MeitY Electronics and Information Technology Goods (Compulsory Registration Requirement) Order 2012',
    isoEquivalent: 'IEC 60950-1:2005',
    testingLabDiscipline: 'Electronics & IT Safety Testing',
    sourceDocUrl: 'https://www.crsbis.in/IS13252',
    versionDate: '2010 (Reaffirmed 2022)',
    clauseReference: 'IS 13252 Clause 1.5 & Section 4'
  },
  {
    id: 'is-15820',
    isNumber: 'IS 15820:2009',
    title: 'General Requirements for Establishment and Operation of Assaying and Hallmarking Centres',
    department: 'Metallurgy',
    category: 'Precious Metals & Hallmarking',
    scope: 'Specifies criteria for setting up BIS recognized Assaying & Hallmarking (AHC) centres for gold and silver jewellery.',
    keyParameters: [
      'Assaying procedure by Fire Assay (Cupellation method) for Gold',
      'XRF screening requirements',
      'Unique Laser Marking of 6-digit alphanumeric HUID code',
      'Traceability and audit logs'
    ],
    status: 'Mandatory',
    gazetteOrder: 'Hallmarking of Gold Jewellery and Gold Artefacts Order 2020',
    isoEquivalent: 'ISO 11426',
    testingLabDiscipline: 'Assaying & Chemical Analysis',
    sourceDocUrl: 'https://www.hallmarking.bis.gov.in',
    versionDate: '2009 (Reaffirmed 2020)',
    clauseReference: 'IS 15820 Clause 5 & Annexure A'
  },
  {
    id: 'is-1786',
    isNumber: 'IS 1786:2008',
    title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement Specification',
    department: 'Civil',
    category: 'Construction Materials',
    scope: 'Covers requirements for TMT (Thermo-Mechanically Treated) deformed steel bars used in reinforced concrete structures (Grades Fe 415, Fe 500, Fe 550, Fe 600).',
    keyParameters: [
      'Proof stress / Yield strength min 500 N/mm2 for Fe 500D grade',
      'UTS/YS ratio and elongation requirements for earthquake resistance',
      'Bend and rebend test without fracturing'
    ],
    status: 'Mandatory',
    gazetteOrder: 'Steel and Steel Products (Quality Control) Order 2019',
    isoEquivalent: 'ISO 6935-2',
    testingLabDiscipline: 'Mechanical Testing',
    sourceDocUrl: 'https://www.services.bis.gov.in/IS1786',
    versionDate: '2008 (Reaffirmed 2022)',
    clauseReference: 'IS 1786 Clause 8 & Table 3'
  },
  {
    id: 'is-9873',
    isNumber: 'IS 9873 (Part 1):2019',
    title: 'Safety of Toys - Safety Aspects Related to Mechanical and Physical Properties',
    department: 'Chemical',
    category: 'Consumer Product Safety',
    scope: 'Applies to all toys intended for use in play by children under 14 years of age.',
    keyParameters: [
      'Mandatory ISI certification for manufacture, import, and sale of toys',
      'Phthalates limits (<0.1% concentration)',
      'Heavy elements migration (Lead, Chromium, Cadmium, Barium)',
      'Small parts test for choking hazards for children <36 months'
    ],
    status: 'Mandatory',
    gazetteOrder: 'Toys (Quality Control) Order 2020',
    isoEquivalent: 'ISO 8124-1',
    testingLabDiscipline: 'Physical & Chemical Toy Testing',
    sourceDocUrl: 'https://www.bis.gov.in/IS9873',
    versionDate: '2019',
    clauseReference: 'IS 9873 Part 1 Clause 4 & 5'
  },
  {
    id: 'is-12615',
    isNumber: 'IS 12615:2018',
    title: 'Line Operated Three-Phase A.C. Motors (IE Code) - Efficiency Classes and Performance Specifications',
    department: 'Electrotechnical',
    category: 'Industrial Electrical Machinery',
    scope: 'Specifies energy efficiency classification (IE2, IE3, IE4) for three-phase induction motors from 0.12 kW to 1000 kW.',
    keyParameters: [
      'Minimum Efficiency Performance Standard (MEPS): IE3 efficiency mandatory',
      'No load test, full load loss evaluation',
      'Temperature rise limit Class B/F insulation'
    ],
    status: 'Mandatory',
    gazetteOrder: 'Electrical Transformers and Motors Quality Control Order 2021',
    isoEquivalent: 'IEC 60034-30-1',
    testingLabDiscipline: 'Electrical Power & Rotating Machine Testing',
    sourceDocUrl: 'https://www.bis.gov.in/IS12615',
    versionDate: '2018',
    clauseReference: 'IS 12615 Clause 6 & Table 1'
  },
  {
    id: 'is-15683',
    isNumber: 'IS 15683:2018',
    title: 'Portable Fire Extinguishers - Performance and Construction - Specification',
    department: 'Civil',
    category: 'Fire Fighting & Safety Equipment',
    scope: 'Covers performance, construction, and safety requirements for portable fire extinguishers (Water, Foam, Powder, CO2, Clean Agent).',
    keyParameters: [
      'Mandatory ISI Mark certification',
      'Burst pressure test of cylinder (Min 2.5 times operating pressure)',
      'Fire rating test (Class A, B, C, F fires)',
      'Corrosion resistance salt spray test'
    ],
    status: 'Mandatory',
    gazetteOrder: 'Fire Extinguishers Quality Control Order 2021',
    isoEquivalent: 'ISO 7165',
    testingLabDiscipline: 'Pressure Equipment & Fire Performance Testing',
    sourceDocUrl: 'https://www.bis.gov.in/IS15683',
    versionDate: '2018',
    clauseReference: 'IS 15683 Clause 7 & Annexure B'
  },
  {
    id: 'is-269',
    isNumber: 'IS 269:2015',
    title: 'Ordinary Portland Cement - Specification',
    department: 'Civil',
    category: 'Building Materials',
    scope: 'Covers physical and chemical requirements of Ordinary Portland Cement grades 33, 43, and 53.',
    keyParameters: [
      'Compressive strength at 3, 7, and 28 days (Min 53 MPa for OPC 53)',
      'Initial setting time (Min 30 minutes), Final setting time (Max 600 minutes)',
      'Soundness test by Le-Chatelier & Autoclave'
    ],
    status: 'Mandatory',
    gazetteOrder: 'Cement (Quality Control) Order 2023',
    isoEquivalent: 'EN 197-1',
    testingLabDiscipline: 'Chemical & Physical Testing of Building Materials',
    sourceDocUrl: 'https://www.bis.gov.in/IS269',
    versionDate: '2015 (Reaffirmed 2021)',
    clauseReference: 'IS 269 Clause 5 & Table 2'
  },
  {
    id: 'is-16046',
    isNumber: 'IS 16046 (Part 2):2018',
    title: 'Secondary Cells and Batteries Containing Alkaline or Other Non-Acid Electrolytes - Portable Sealed Lithium Cells and Batteries',
    department: 'Electronics & IT',
    category: 'Electronics & Energy Storage (CRS)',
    scope: 'Covers safety requirements for portable sealed lithium secondary cells and batteries used in smartphones, laptops, power banks, and portable electronics.',
    keyParameters: [
      'Mandatory BIS CRS Registration',
      'Overcharge, external short circuit, thermal abuse, impact, and drop tests',
      'Labeling requirement with BIS R-Number and "Self Declaration - Conforming to IS 16046"'
    ],
    status: 'Mandatory',
    gazetteOrder: 'MeitY CRS Notification 2018',
    isoEquivalent: 'IEC 62133-2:2017',
    testingLabDiscipline: 'Battery & Electrical Safety Testing',
    sourceDocUrl: 'https://www.crsbis.in/IS16046',
    versionDate: '2018 (Reaffirmed 2023)',
    clauseReference: 'IS 16046 Part 2 Clause 7 & Table 1'
  }
];

export const BIS_SCHEMES_KNOWLEDGE: BISScheme[] = [
  {
    id: 'isi-scheme-i',
    name: 'Product Certification Scheme (ISI Mark - Scheme I)',
    code: 'Scheme-I',
    targetAudience: 'Domestic Manufacturers of Products under Mandatory or Voluntary BIS Certification',
    markName: 'ISI Mark',
    overview: 'Grants license to use the prestigious ISI mark on products after verifying factory manufacturing infrastructure, testing facility, quality control personnel, and sample conformity in accredited labs.',
    eligibility: [
      'Manufacturers having factory premise with required machinery and testing facilities',
      'Appointed qualified quality control testing staff',
      'Agreement to comply with Scheme of Inspection and Testing (SIT)'
    ],
    processSteps: [
      '1. e-BIS Application: Register & fill form on e-BIS (manakonline.in) with standard IS selection.',
      '2. Document Submission: Factory layout, machinery list, test equipment calibration, raw material specs.',
      '3. Factory Audit: BIS officer inspects factory, verifies testing setup, and draws verification samples.',
      '4. Laboratory Testing: Sample tested at BIS lab or recognized lab for full IS compliance.',
      '5. License Grant: Grant of License (CML number) upon satisfactory testing report & payment of fees.'
    ],
    keyDocumentsRequired: [
      'Certificate of Incorporation / MSME Udyam Registration',
      'Factory registration / Lease deed / Pollution NOC',
      'List of Manufacturing Machinery & Testing Equipment',
      'Calibration certificates of testing instruments',
      'Quality Control Manager qualification credentials'
    ],
    feeOverview: 'Application fee: ₹1,000 | Inspection fee: ₹7,000 per man-day | Marking fee: Varies by product (e.g. ₹20,000 - ₹1,00,000/yr minimum marking fee).',
    msmeConcession: '50% concession on Marking Fee and Application Fee for Micro, Small, Women-owned, and Recognized Startup Enterprises.',
    sourceDocUrl: 'https://www.manakonline.in/SIT_Scheme_I'
  },
  {
    id: 'crs-scheme-ii',
    name: 'Compulsory Registration Scheme (CRS - Scheme II)',
    code: 'CRS',
    targetAudience: 'Manufacturers of Electronics, IT Equipment, Solar PV, and Batteries (Domestic & Foreign)',
    markName: 'BIS Standard Mark with R-number',
    overview: 'Simplified self-declaration conformity assessment scheme for electronics and IT goods where manufacturer gets product tested in a BIS recognized lab and registers on CRS portal before placing in Indian market.',
    eligibility: [
      'Original Manufacturer (Domestic or Foreign) producing listed electronics/IT goods',
      'Foreign manufacturers must appoint an Authorized Indian Representative (AIR)'
    ],
    processSteps: [
      '1. Sample Testing: Get sample tested in a BIS-recognized laboratory in India.',
      '2. CRS Portal Application: Submit test report online on crsbis.in within 90 days of test report date.',
      '3. Document Verification: Submit AIR details, factory address proof, trademark authorization.',
      '4. Grant of Registration: Receive 8-digit Registration Number (e.g., R-41000000).',
      '5. Product Labeling: Display BIS logo and "Self Declaration - Conforming to IS [X] R-[Y]" on product & packaging.'
    ],
    keyDocumentsRequired: [
      'Test Report from BIS Recognized Lab in India',
      'Authorized Indian Representative (AIR) agreement & ID proof',
      'Trademark ownership proof or Brand Authorization letter',
      'Factory manufacturing process flow chart & ISO 9001 certificate'
    ],
    feeOverview: 'Processing fee: ₹50,000 per report | Inclusion fee: ₹20,000 per inclusion | Renewal fee: ₹50,000 for 2 years.',
    msmeConcession: '50% concession on application processing fees for Indian Micro & Small Enterprises (MSEs).',
    sourceDocUrl: 'https://www.crsbis.in'
  },
  {
    id: 'hallmarking-scheme-iii',
    name: 'Hallmarking Scheme for Gold & Silver Jewellery (Scheme III)',
    code: 'Scheme-III',
    targetAudience: 'Jewellers, Assaying & Hallmarking Centres (AHCs), Refineries',
    markName: 'BIS Hallmark (Logo + Purity + 6-digit HUID)',
    overview: 'Ensures consumer protection by certifying purity of gold and silver jewellery. Hallmarked gold jewellery features 3 mandatory marks: BIS Logo, Purity/Fineness (e.g., 22K916, 18K750, 14K585), and a unique 6-digit alphanumeric Hallmarking Unique ID (HUID).',
    eligibility: [
      'Jewellers selling gold/silver jewellery to consumers (Registration on e-BIS is compulsory)',
      'Assaying & Hallmarking Centres (AHC) accredited under IS 15820'
    ],
    processSteps: [
      '1. Jeweller Registration: Apply on e-BIS portal (Automated instant registration, ZERO fee for micro jewellers).',
      '2. Jewellery Submission: Submit gold items to registered AHC for assaying & XRF laser marking.',
      '3. Assaying & Sampling: AHC conducts Fire Assay and XRF purity analysis.',
      '4. HUID Generation & Laser Marking: Unique 6-digit HUID code assigned via BIS Portal and laser etched on each item.',
      '5. Sale & Verification: Consumer can verify HUID using BIS Care Mobile App.'
    ],
    keyDocumentsRequired: [
      'GST Registration Certificate',
      'Aadhaar / PAN of Proprietor/Directors',
      'Outlet address proof & photos'
    ],
    feeOverview: 'Jeweller Registration Fee: ZERO for turnover up to ₹5 Cr for Micro enterprises. Hallmarking charge: ₹45 per gold article + GST (paid to AHC).',
    msmeConcession: 'Instant registration with fee waiver for artisans and micro-jewellers.',
    sourceDocUrl: 'https://www.hallmarking.bis.gov.in'
  },
  {
    id: 'fmcs-foreign-scheme',
    name: 'Foreign Manufacturers Certification Scheme (FMCS)',
    code: 'FMCS',
    targetAudience: 'Foreign Manufacturers outside India exporting products under mandatory BIS certification',
    markName: 'ISI Mark for Imported Goods',
    overview: 'Grants license to foreign manufacturers to use ISI Mark on products exported into India after factory inspection by BIS officers and product sample clearance.',
    eligibility: [
      'Manufacturing unit located outside India',
      'Appointed Authorized Indian Representative (AIR) residing in India'
    ],
    processSteps: [
      '1. Application submission with AIR details.',
      '2. BIS officer physical factory audit abroad.',
      '3. Sample collection & testing in Indian BIS lab.',
      '4. Execution of Performance Bank Guarantee (USD 10,000) & License Agreement.',
      '5. Grant of License.'
    ],
    keyDocumentsRequired: ['Factory Registration', 'AIR Authorization', 'Bank Guarantee', 'Quality Manual'],
    feeOverview: 'Application fee: USD 1,000 | Inspection fee: Travel & per diem of BIS auditor + USD 2,000 per audit.',
    msmeConcession: 'Not applicable for foreign units.',
    sourceDocUrl: 'https://www.services.bis.gov.in/fmcs'
  }
];

export const BIS_FAQS_KNOWLEDGE: BISFAQ[] = [
  {
    id: 'faq-1',
    question: 'What is BIS certification and why is it required in India?',
    category: 'General',
    shortAnswer: 'BIS Certification is a third-party guarantee of product quality, safety, and reliability provided by the Bureau of Indian Standards (BIS) under the BIS Act 2016.',
    detailedExplanation: 'The Bureau of Indian Standards (BIS) is the National Standards Body of India established under the BIS Act 2016. BIS certification provides third-party assurance of product quality, safety, and performance. For products covered under mandatory Quality Control Orders (QCOs) issued by Central Ministries, obtaining BIS certification (ISI Mark or CRS Registration) is legally mandatory before manufacturing, importing, stocking, or selling in India. Selling non-certified mandatory items is a punishable offence with heavy fines and imprisonment.',
    steps: [
      'Identify if your product falls under mandatory Quality Control Order (QCO).',
      'Determine the applicable Indian Standard (IS number).',
      'Apply online on e-BIS (manakonline.in) or crsbis.in portal.',
      'Pass testing and factory audit to receive license/registration.'
    ],
    importantNotes: 'Under Section 29 of BIS Act 2016, manufacturing or selling mandatory products without BIS certification can attract imprisonment up to 2 years or fine up to ₹5 Lakhs (or 10 times value of goods).',
    clauseCitation: 'BIS Act 2016 Section 16 & Section 29',
    sourceTitle: 'Bureau of Indian Standards Act 2016 & Overview',
    sourceType: 'Act of Parliament',
    sourceUrl: 'https://www.bis.gov.in/about-us/bis-act-2016/',
    date: '2016-03-22',
    keywords: ['bis certification', 'what is bis', 'isi mark', 'why bis', 'bis act 2016']
  },
  {
    id: 'faq-2',
    question: 'What is the ISI Mark and how does a manufacturer obtain it?',
    category: 'ISI Mark',
    shortAnswer: 'The ISI Mark is the official product certification mark granted under Scheme-I after factory inspection, equipment calibration, and lab testing of product samples.',
    detailedExplanation: 'The ISI mark signifies that a product conforms to the relevant Indian Standard (IS). To obtain the ISI mark, a manufacturer must register on e-BIS (manakonline.in), upload factory machinery and testing equipment details, pass a physical factory audit by a BIS officer, and have product samples tested in a BIS-recognized lab. Upon passing, BIS issues a License Number (CML - Certificate of Manufacturing License) which must be printed alongside the ISI mark.',
    steps: [
      'Step 1: Check standard requirement & setup required in-house testing lab equipment.',
      'Step 2: Submit application on e-BIS portal (manakonline.in) with factory layout and machinery details.',
      'Step 3: Pay application & inspection fees.',
      'Step 4: Host BIS officer for factory inspection & sample drawing.',
      'Step 5: Receive test report from BIS lab and obtain CML License.'
    ],
    importantNotes: 'Micro and Small Enterprises (MSEs), Startups, and Women Entrepreneurs get a 50% concession on marking and application fees!',
    clauseCitation: 'BIS Conformity Assessment Regulations 2018 Scheme-I',
    sourceTitle: 'e-BIS Product Certification Scheme Guidelines',
    sourceType: 'Regulations Document',
    sourceUrl: 'https://www.manakonline.in/SIT_Scheme_I',
    date: '2018-06-01',
    keywords: ['isi mark', 'how to get isi mark', 'cml license', 'factory audit', 'isi certificate']
  },
  {
    id: 'faq-3',
    question: 'What is CRS (Compulsory Registration Scheme) for electronics and how is it different from ISI Mark?',
    category: 'CRS',
    shortAnswer: 'CRS is a self-declaration scheme for Electronics & IT goods where products are tested in BIS recognized labs and registered on crsbis.in without a prior factory audit.',
    detailedExplanation: 'The Compulsory Registration Scheme (CRS) was launched under Scheme-II to cater to fast-evolving Electronics, IT, and Solar products (e.g. mobile phones, power adapters, lithium batteries, smartwatches, LED drivers). Unlike ISI Mark (Scheme-I) which requires a physical factory audit before license grant, CRS relies on self-declaration backed by product testing in a BIS-recognized lab in India. Once test reports pass, an 8-digit Registration Number (R-number) is issued.',
    steps: [
      'Send product samples to a BIS-recognized testing laboratory in India.',
      'Obtain passing test report within 90 days.',
      'Apply online on crsbis.in portal with AIR (if foreign mfg) and brand authorization.',
      'Receive 8-digit R-number (e.g. R-41002345).',
      'Affix BIS CRS mark and R-number on product and retail packaging.'
    ],
    importantNotes: 'Foreign manufacturers MUST appoint an Authorized Indian Representative (AIR) located in India.',
    clauseCitation: 'MeitY Electronics & IT Goods (Compulsory Registration Requirement) Order',
    sourceTitle: 'BIS Compulsory Registration Scheme (CRS) Guidelines',
    sourceType: 'Scheme Framework',
    sourceUrl: 'https://www.crsbis.in/about-crs',
    date: '2021-01-15',
    keywords: ['crs', 'compulsory registration scheme', 'r number', 'meity bis', 'electronics certification']
  },
  {
    id: 'faq-4',
    question: 'What is Gold Hallmarking and how can a consumer verify a 6-digit HUID code?',
    category: 'Hallmarking',
    shortAnswer: 'Gold Hallmarking guarantees gold purity. Every hallmarked gold item features 3 marks: BIS logo, Purity grade (e.g., 22K916), and a 6-digit alphanumeric HUID code verifiable on the BIS Care App.',
    detailedExplanation: 'Mandatory Gold Hallmarking covers gold jewellery sold in India across major purity grades: 14K (585), 18K (750), 20K (833), 22K (916), 23K (958), and 24K (995). The Hallmarking Unique ID (HUID) is a unique 6-digit alphanumeric code (e.g., AH2891) laser stamped on every jewellery item by a BIS Assaying & Hallmarking Centre (AHC). Consumers can type this code into the free "BIS Care App" under "Verify HUID" to check the jeweler name, AHC name, hallmarking date, and purity.',
    steps: [
      'Download and open the official "BIS Care App" on iOS or Android.',
      'Click on "Verify HUID" option.',
      'Enter the 6-digit code stamped on your gold ornament (e.g. AH2891).',
      'View Jeweller details, AHC center details, purity (e.g. 22K916), and date of hallmarking.'
    ],
    importantNotes: 'Jewellers cannot sell non-hallmarked gold jewellery in mandatory hallmarking districts. Selling fake hallmarked gold is a criminal violation.',
    clauseCitation: 'Hallmarking of Gold Jewellery Order 2020 Clause 3',
    sourceTitle: 'BIS Hallmarking & HUID Consumer Verification Guide',
    sourceType: 'Consumer Guidance Document',
    sourceUrl: 'https://www.hallmarking.bis.gov.in',
    date: '2023-04-01',
    keywords: ['hallmarking', 'huid', 'verify gold', '22k916', 'bis care app', 'gold purity']
  },
  {
    id: 'faq-5',
    question: 'What fee concessions and benefits do MSMEs, Micro enterprises, and Startups receive for BIS certification?',
    category: 'MSME & Fees',
    shortAnswer: 'Micro, Small Enterprises (MSEs), Startups, and Women Entrepreneurs get a 50% concession on Marking Fee and Application Fee for BIS Product Certification.',
    detailedExplanation: 'To encourage domestic manufacturing and support the Make in India initiative, BIS offers a flat 50% concession on Application Fees and Minimum Marking Fees under Scheme-I for: 1. Micro Enterprises, 2. Small Enterprises (having valid Udyam Registration), 3. Recognized Startups (DPIIT recognized), 4. Women-owned Micro/Small Enterprises. Additionally, micro-jewellers with turnover up to ₹5 Crore receive ZERO registration fee for gold hallmarking registration.',
    steps: [
      'Obtain Udyam Registration Certificate from Ministry of MSME.',
      'For Startups, obtain DPIIT Recognition Certificate.',
      'Select "Micro / Small Enterprise" or "Startup" while filling e-BIS application on manakonline.in.',
      'Upload Udyam / DPIIT Certificate.',
      'System automatically applies 50% discount on marking fee and application processing fee!'
    ],
    importantNotes: 'Concession applies to Indian domestic units. Medium & Large enterprises pay 100% standard tariff.',
    clauseCitation: 'BIS Office Order on Fee Concessions for MSEs & Startups 2021',
    sourceTitle: 'BIS Concession Scheme for Micro, Small Enterprises & Startups',
    sourceType: 'Official Circular',
    sourceUrl: 'https://www.manakonline.in/msme-benefits',
    date: '2021-08-10',
    keywords: ['msme discount', '50% concession', 'startup bis fee', 'udyam bis', 'marking fee discount']
  },
  {
    id: 'faq-6',
    question: 'Which Indian Standard applies to Drinking Water and Packaged Bottled Water?',
    category: 'General',
    shortAnswer: 'Drinking Water is covered under IS 10500:2012, while Packaged Drinking Water is governed by IS 14543:2024 (both are mandatory).',
    detailedExplanation: 'There are two distinct standards: 1. IS 10500:2012 specifies parameters for municipal/potable drinking water supplied via pipes/pumps. 2. IS 14543:2024 covers Packaged Drinking Water sealed in bottles or pouches for commercial sale. Both require mandatory BIS ISI certification before commercial manufacture or bottling.',
    steps: [
      'For bottled packaged water: Must obtain ISI Mark under IS 14543.',
      'Setup water treatment (Reverse Osmosis, UV, Ozonation) and microbiological testing lab.',
      'Test physical, chemical, pesticide residue, and bacterial parameters.',
      'Submit application on e-BIS portal.'
    ],
    importantNotes: 'Packaged Natural Mineral Water is governed separately by IS 13428.',
    clauseCitation: 'IS 10500:2012 & IS 14543:2024 Gazette Notification',
    sourceTitle: 'BIS Quality Control Order for Water Products',
    sourceType: 'Indian Standard & QCO',
    sourceUrl: 'https://www.services.bis.gov.in/IS10500',
    date: '2024-01-10',
    isNumber: 'IS 10500 / IS 14543',
    keywords: ['drinking water standard', 'is 10500', 'is 14543', 'packaged water bis', 'water testing']
  },
  {
    id: 'faq-7',
    question: 'How can a consumer check if an ISI Mark or CML license number printed on a product is genuine?',
    category: 'Consumer Verification',
    shortAnswer: 'Verify the 7-digit CML license number (printed below the ISI mark as CM/L-XXXXXXX) using the "Verify License" feature on the BIS Care App or e-BIS Portal.',
    detailedExplanation: 'Every genuine ISI marked product MUST display the 7-digit CML number (Certificate of Manufacturing License) under the ISI logo (formatted as CM/L-1234567 or CM/L-9876543). Consumers can verify this number instantly by opening the BIS Care App -> clicking "Verify License Details" -> entering the CML number. The app will display the manufacturer name, factory address, valid status, expiration date, and exact list of certified brand names & models.',
    steps: [
      'Look at the ISI Mark printed on the product or packaging.',
      'Note down the 7-digit CM/L number printed below the logo (e.g. CM/L-7654321).',
      'Open the BIS Care Mobile App or visit manakonline.in.',
      'Enter the CM/L number in "Verify License Details".',
      'If details match your product name and valid status, it is genuine. If invalid or expired, file a complaint on the app.'
    ],
    importantNotes: 'Misusing the ISI logo or printing fake CML numbers is an illegal offense under BIS Act 2016.',
    clauseCitation: 'BIS Care Portal verification guidelines',
    sourceTitle: 'BIS Care Consumer Portal Verification Rules',
    sourceType: 'Consumer Portal Guide',
    sourceUrl: 'https://www.bis.gov.in/consumer-overview/bis-care-app/',
    date: '2022-05-15',
    keywords: ['cml check', 'verify isi mark', 'is cml genuine', 'bis care license check', 'fake isi mark']
  },
  {
    id: 'faq-8',
    question: 'What documents are required to apply for BIS certification under Scheme-I (ISI Mark)?',
    category: 'ISI Mark',
    shortAnswer: 'Mandatory documents include Factory Lease/Ownership proof, Machinery list, Testing equipment list with calibration certificates, Factory layout plan, Quality Control staff details, and MSME/Udyam certificate.',
    detailedExplanation: 'When submitting an online application on e-BIS (manakonline.in), manufacturers must upload scanned copies of: 1. Business Registration (PAN, GST, Certificate of Incorporation), 2. Factory Premise proof (Ownership deed or Registered Lease + Electricity bill), 3. List of Manufacturing Machinery with capacity, 4. List of In-House Testing Equipment with recent Calibration Certificates from NABL accredited calibration lab, 5. Plant Layout plan showing manufacturing & testing sections, 6. Qualification credentials of Quality Control personnel, 7. Raw Material test certificates & specs, 8. Udyam MSME / DPIIT Startup certificate for fee concession.',
    steps: [
      'Gather factory ownership/lease documents.',
      'Prepare machinery list & calibrate all testing instruments.',
      'Appoint qualified QC manager (Degree/Diploma in relevant engineering/science field).',
      'Scan and upload on e-BIS portal under application document checklist.'
    ],
    importantNotes: 'Incomplete applications or uncalibrated test equipment will lead to application rejection.',
    clauseCitation: 'BIS Product Certification Manual Document Checklist 2022',
    sourceTitle: 'e-BIS Document Checklist Guidelines',
    sourceType: 'Manual',
    sourceUrl: 'https://www.manakonline.in/doc-checklist',
    date: '2022-11-20',
    keywords: ['bis document checklist', 'documents for isi mark', 'e-bis registration docs', 'factory audit checklist']
  },
  {
    id: 'faq-9',
    question: 'How can a manufacturer find a BIS-recognized testing laboratory in India?',
    category: 'Laboratory & Testing',
    shortAnswer: 'Use the official BIS Laboratory Recognition Scheme (LRS) search engine on bis.gov.in to filter labs by discipline, standard IS number, city, and state.',
    detailedExplanation: 'BIS operates its own Central, Regional, and Branch laboratories across India (such as Sahibabad Central Lab, Mohali, Kolkata, Chennai, Mumbai) and also accredits external third-party labs under the Laboratory Recognition Scheme (LRS) conforming to IS/ISO/IEC 17025. Manufacturers and importers can visit the BIS Lab Portal to search recognized labs capable of testing their specific IS standard product.',
    steps: [
      'Visit the BIS Lab Portal on services.bis.gov.in.',
      'Select "Laboratory Directory / Scope Search".',
      'Enter the IS Standard number (e.g., IS 13252 or IS 1293) or Product Name.',
      'View list of accredited testing labs with address, contact person, testing scope, and validity.'
    ],
    importantNotes: 'Samples for CRS registration MUST be tested only in BIS-recognized labs located within India.',
    clauseCitation: 'BIS Laboratory Recognition Scheme (LRS) Regulations 2020',
    sourceTitle: 'BIS Laboratory Directory & Scope Search',
    sourceType: 'Directory Search',
    sourceUrl: 'https://www.services.bis.gov.in/php/BIS_2/bis_cafe/labs',
    date: '2023-01-10',
    keywords: ['bis lab search', 'bis recognized laboratory', 'lrs scheme', 'testing lab near me', 'is 17025 lab']
  },
  {
    id: 'faq-10',
    question: 'How can a consumer file a complaint against fake ISI marks, defective products, or unhallmarked gold?',
    category: 'Consumer Verification',
    shortAnswer: 'Consumers can lodge grievances directly on the "BIS Care App", call Toll-Free Helpline 1800-11-8001, or email consumer@bis.gov.in with photos and purchase receipt.',
    detailedExplanation: 'BIS maintains a robust consumer complaint redressal mechanism. If a consumer purchases a product with a fake ISI mark, expired license, sub-standard quality, or unhallmarked gold sold as pure gold, they can lodge an instant complaint via the "BIS Care Mobile App" under "Complaints". Consumers can upload product photos, cash memo/bill, and location. BIS enforcement teams conduct raids and investigation.',
    steps: [
      'Step 1: Open BIS Care App -> Click "Grievances / Complaints".',
      'Step 2: Select Complaint Category (e.g., Fake ISI Mark, Quality Defect, Hallmarking Violation).',
      'Step 3: Enter Jeweller or Manufacturer CML/HUID details.',
      'Step 4: Upload photo of purchase bill & product photo.',
      'Step 5: Submit to receive tracking ID for investigation updates.'
    ],
    importantNotes: 'Whistleblowers reporting illegal manufacturing of mandatory items can receive rewards under the BIS Informer Reward Scheme.',
    clauseCitation: 'BIS Consumer Grievance Redressal Mechanism 2021',
    sourceTitle: 'BIS Consumer Rights & Complaints Portal',
    sourceType: 'Consumer Guidance',
    sourceUrl: 'https://www.bis.gov.in/consumer-overview/complaint-redressal/',
    date: '2021-09-01',
    keywords: ['file bis complaint', 'fake isi report', 'bis care app complaint', 'bis helpline', 'consumer grievance']
  },
  {
    id: 'faq-11',
    question: 'What is the difference between BIS certification and the ISI mark?',
    category: 'General',
    shortAnswer: 'BIS (Bureau of Indian Standards) is the government organization that formulates standards and issues licences, while the ISI Mark is the physical conformity mark printed on certified products.',
    detailedExplanation: 'BIS (Bureau of Indian Standards) is the National Standards Body of India established under the BIS Act 2016. It is the administrative organization that formulates Indian Standards, inspects factories, and grants licences. The ISI Mark (Indian Standards Institute Mark) is the physical quality mark printed on products that conform to an Indian Standard under BIS Scheme-I. In short: BIS is the issuing authority, whereas the ISI Mark is the visual proof of certification stamped on the product alongside a 7-digit CML licence number.',
    steps: [
      'BIS = National Standards Body formulating standards and issuing licences.',
      'ISI Mark = Physical compliance mark stamped on products under Scheme-I.',
      'CML Number = 7-digit unique licence code (e.g. CM/L-7654321) printed below the ISI mark.',
      'Other Marks = Electronics use the BIS CRS Mark with R-number, and Gold Jewellery uses the Hallmark with 6-digit HUID.'
    ],
    importantNotes: 'The ISI mark is just one of several certification marks operated by BIS (others include CRS mark for electronics and Hallmarking for gold).',
    clauseCitation: 'BIS Conformity Assessment Regulations 2018 & BIS Act 2016',
    sourceTitle: 'BIS Certification vs ISI Mark Overview',
    sourceType: 'Guidance Document',
    sourceUrl: 'https://www.bis.gov.in/about-us/bis-overview/',
    date: '2024-01-01',
    keywords: ['difference between bis certification and isi mark', 'bis vs isi', 'isi mark vs bis', 'difference between bis and isi']
  },
  {
    id: 'faq-12',
    question: 'What is BIS (Bureau of Indian Standards)?',
    category: 'General',
    shortAnswer: 'BIS (Bureau of Indian Standards) is the National Standards Body of India established under the BIS Act 2016 responsible for formulating standards, product certification, hallmarking, and lab testing.',
    detailedExplanation: 'The Bureau of Indian Standards (BIS) operates under the Ministry of Consumer Affairs, Food & Public Distribution, Government of India. It is responsible for harmonious development of standardization, marking, and quality certification of goods. BIS has published over 22,000 Indian Standards (IS), operates mandatory Quality Control Orders (QCOs), registers testing laboratories, and manages gold hallmarking.',
    steps: [
      'Formulates national standards (IS numbers) across engineering, chemicals, food, IT, and consumer goods.',
      'Operates product certification schemes (ISI Mark, CRS, Hallmarking, FMCS).',
      'Accredits testing laboratories under Laboratory Recognition Scheme (LRS).',
      'Protects consumer rights through BIS Care App and Quality Control Orders.'
    ],
    importantNotes: 'BIS was established under the BIS Act 2016, succeeding the former Indian Standards Institution (ISI).',
    clauseCitation: 'BIS Act 2016 Section 3',
    sourceTitle: 'Bureau of Indian Standards Overview',
    sourceType: 'Act of Parliament',
    sourceUrl: 'https://www.bis.gov.in/about-us/bis-overview/',
    date: '2016-03-22',
    keywords: ['what is bis', 'bureau of indian standards', 'bis overview', 'bis mandate', 'about bis']
  },
  {
    id: 'faq-13',
    question: 'How can I get BIS certification for my product?',
    category: 'General',
    shortAnswer: 'To get BIS certification for your product, identify the applicable Indian Standard (IS), ensure factory manufacturing and in-house testing equipment are calibrated, and submit an online application on e-BIS (manakonline.in) or crsbis.in.',
    detailedExplanation: 'Obtaining BIS certification involves a 5-step process: 1. Standard Identification: Find the relevant IS number for your product. 2. Factory Readiness: Setup required manufacturing machinery and calibrated in-house quality testing equipment. 3. Online e-BIS Application: Register on manakonline.in (or crsbis.in for electronics), upload factory layout, machinery list, and test equipment certificates. 4. Factory Inspection & Sampling: A BIS officer inspects the factory and draws product samples. 5. Lab Testing & Licence Grant: Samples are tested in a BIS-recognized lab. Upon passing, BIS issues a Certificate of Manufacturing Licence (CML number for ISI mark) or Registration Number (for CRS).',
    steps: [
      'Step 1: Identify the applicable Indian Standard (IS) number for your product on manakonline.in.',
      'Step 2: Ensure your factory has required manufacturing machinery & calibrated testing equipment.',
      'Step 3: Register on e-BIS (manakonline.in) or crsbis.in portal and upload required documents.',
      'Step 4: Host BIS officer for physical factory inspection & sample collection.',
      'Step 5: Receive test clearance report from accredited BIS lab and obtain CML Licence / R-Number.'
    ],
    importantNotes: 'MSMEs and DPIIT Startups get a 50% concession on application and marking fees under the e-BIS concession scheme.',
    clauseCitation: 'e-BIS Product Certification Scheme-I & Scheme-II Application Guidelines',
    sourceTitle: 'How to Obtain BIS Certification Guide',
    sourceType: 'Official Procedure Guide',
    sourceUrl: 'https://www.manakonline.in',
    date: '2024-01-01',
    keywords: ['how can i get bis certification', 'how to get bis certification', 'apply for bis certification', 'get bis certificate', 'how to apply for bis']
  },
  {
    id: 'faq-14',
    question: 'What is the validity period of a BIS licence and how is it renewed?',
    category: 'ISI Mark',
    shortAnswer: 'BIS Product certification licences (CML) are initially granted for 1 to 2 years and can be renewed for up to 5 years via manakonline.in upon paying renewal fees.',
    detailedExplanation: 'Under Scheme-I (ISI Mark), a Certificate of Manufacturing Licence (CML) is initially valid for 1 or 2 years. Manufacturers can apply for licence renewal online on the e-BIS portal (manakonline.in) up to 90 days before expiration. Licences can be renewed for a duration of 1 to 5 years subject to satisfactory performance in periodic unannounced factory surveillance audits, market sample clearance, and payment of advance marking fees.',
    steps: [
      'Log into e-BIS portal (manakonline.in) before licence expiry date.',
      'Submit production and marking fee calculation statement.',
      'Pay required renewal and minimum marking fees online.',
      'BIS reviews surveillance audit test reports and issues Renewal Endorsement Certificate.'
    ],
    importantNotes: 'If a licence expires without renewal application, the manufacturer must cease applying the ISI mark and apply for a fresh licence.',
    clauseCitation: 'BIS Conformity Assessment Regulations 2018 Regulation 8',
    sourceTitle: 'e-BIS Licence Validity & Renewal Regulations',
    sourceType: 'Regulation Document',
    sourceUrl: 'https://www.manakonline.in/renewal-rules',
    date: '2024-01-01',
    keywords: ['bis license validity', 'renew bis license', 'cml renewal', 'how long bis license valid', 'license expiration']
  },
  {
    id: 'faq-15',
    question: 'Can a foreign manufacturer apply for BIS certification for exports to India?',
    category: 'General',
    shortAnswer: 'Yes, foreign manufacturers can obtain BIS certification (ISI Mark) for exports to India under the Foreign Manufacturers Certification Scheme (FMCS).',
    detailedExplanation: 'Under the Foreign Manufacturers Certification Scheme (FMCS), overseas manufacturing units located outside India can obtain a licence to use the ISI mark on goods exported to India. Key requirements include: 1. Appointing an Authorized Indian Representative (AIR) residing in India, 2. Hosting a BIS officer for physical audit of the overseas factory, 3. Testing product samples in a BIS recognized lab in India, 4. Submitting a Performance Bank Guarantee (PBG) of USD 10,000.',
    steps: [
      'Appoint an Authorized Indian Representative (AIR) in India.',
      'Apply online on the FMCS portal (services.bis.gov.in/fmcs).',
      'Host BIS inspection officer for overseas factory audit and sample drawing.',
      'Test samples in an accredited BIS laboratory in India.',
      'Execute USD 10,000 Performance Bank Guarantee and receive FMCS Licence.'
    ],
    importantNotes: 'The AIR acts as the legal representative in India responsible for compliance and penalty liabilities under BIS Act 2016.',
    clauseCitation: 'BIS Foreign Manufacturers Certification Scheme (FMCS) Guidelines 2021',
    sourceTitle: 'BIS FMCS Scheme Guidelines for Importers & Foreign Manufacturers',
    sourceType: 'Scheme Guide',
    sourceUrl: 'https://www.services.bis.gov.in/fmcs',
    date: '2021-05-10',
    keywords: ['foreign manufacturer bis', 'fmcs scheme', 'import bis certification', 'authorized indian representative', 'air bis']
  },
  {
    id: 'faq-16',
    question: 'What are the legal penalties for selling products with fake ISI marks or without mandatory BIS certification?',
    category: 'General',
    shortAnswer: 'Under Section 29 of BIS Act 2016, manufacturing or selling mandatory products without BIS certification attracts imprisonment up to 2 years or fines up to ₹5 Lakhs (or 10x product value).',
    detailedExplanation: 'Central Ministries issue mandatory Quality Control Orders (QCOs) under Section 16 of the BIS Act 2016 prohibiting the manufacture, import, distribution, or sale of uncertified products. Misusing the ISI mark, printing fake CML numbers, or selling non-certified mandatory items is a cognizable criminal offense under Section 29. BIS enforcement teams carry out search and seizure raids, and courts can impose imprisonment up to 2 years, monetary fines up to ₹5 Lakhs, or 10 times the value of the seized goods.',
    steps: [
      'Section 16 empowering Central Government to issue mandatory Quality Control Orders (QCOs).',
      'Section 29 prescribing criminal penalties for non-compliance.',
      'First offense: Imprisonment up to 2 years or fine up to ₹2 Lakhs.',
      'Subsequent offenses: Fine up to ₹5 Lakhs or 10 times the value of goods produced/sold.'
    ],
    importantNotes: 'Consumers and whistleblowers reporting unauthorized use of ISI mark can receive monetary rewards under BIS Informer Scheme.',
    clauseCitation: 'BIS Act 2016 Section 16 & Section 29',
    sourceTitle: 'BIS Act 2016 Penalties & Enforcement Provisions',
    sourceType: 'Act of Parliament',
    sourceUrl: 'https://www.bis.gov.in/about-us/bis-act-2016/',
    date: '2016-03-22',
    keywords: ['fake isi mark penalty', 'bis act section 29', 'illegal isi mark fine', 'punishment for fake isi mark', 'mandatory qco penalty']
  },
  {
    id: 'faq-17',
    question: 'What official portals and mobile apps does BIS provide for businesses and consumers?',
    category: 'Consumer Verification',
    shortAnswer: 'BIS provides manakonline.in (e-BIS for product & hallmarking registration), crsbis.in (for electronics CRS), bis.gov.in (main portal), and the "BIS Care App" for mobile verification.',
    detailedExplanation: 'BIS operates three primary official web portals and one mobile application: 1. manakonline.in (e-BIS): Primary portal for domestic manufacturers to apply for ISI Mark, track CML licences, pay marking fees, and register for gold hallmarking. 2. crsbis.in: Dedicated portal for Electronics & IT goods under Compulsory Registration Scheme (CRS). 3. bis.gov.in: Main official portal for Indian Standards downloads, lab directories, QCO notifications, and general information. 4. BIS Care App: Mobile application for Android and iOS allowing consumers to verify CML numbers, verify 6-digit gold HUID codes, search recognized labs, and file complaints.',
    steps: [
      'manakonline.in -> Product certification (Scheme-I) & Hallmarking jeweller registration.',
      'crsbis.in -> Compulsory Registration Scheme for IT and Electronics goods.',
      'services.bis.gov.in -> Foreign Manufacturers (FMCS) & Laboratory Directory.',
      'BIS Care Mobile App -> Consumer verification of CML, HUID, and complaint filing.'
    ],
    importantNotes: 'Always verify portal URLs ending in .in or .gov.in to avoid phishing websites.',
    clauseCitation: 'BIS Official Digital Services Framework 2023',
    sourceTitle: 'BIS Digital Services & Portal Information Guide',
    sourceType: 'Portal Framework Guide',
    sourceUrl: 'https://www.bis.gov.in',
    date: '2023-01-01',
    keywords: ['manakonline', 'crsbis', 'bis care app', 'e-bis portal', 'bis websites']
  }
];

export const BIS_LABS_KNOWLEDGE: BISLab[] = [
  {
    id: 'lab-central-sahibabad',
    name: 'BIS Central Laboratory, Sahibabad',
    type: 'BIS Central Lab',
    location: 'Plot No. 20/9, Site IV, Sahibabad Industrial Area, Ghaziabad, UP',
    state: 'Uttar Pradesh',
    disciplines: ['Chemical', 'Electrical', 'Mechanical', 'Microbiology', 'Metallurgy', 'Textile'],
    contact: '0120-2895000 | clb@bis.gov.in',
    accreditation: 'NABL Accredited as per IS/ISO/IEC 17025:2017'
  },
  {
    id: 'lab-regional-mohali',
    name: 'BIS Northern Regional Laboratory, Mohali',
    type: 'BIS Regional Lab',
    location: 'Plot No. E-11, Phase VIII, Industrial Area, Mohali, Punjab',
    state: 'Punjab',
    disciplines: ['Electrical', 'Chemical', 'Mechanical', 'Water Testing'],
    contact: '0172-2252100 | nrlb@bis.gov.in',
    accreditation: 'NABL Accredited'
  },
  {
    id: 'lab-regional-kolkata',
    name: 'BIS Eastern Regional Laboratory, Kolkata',
    type: 'BIS Regional Lab',
    location: '1/14, C.I.T. Scheme VII M, VIP Road, Kankurgachi, Kolkata, West Bengal',
    state: 'West Bengal',
    disciplines: ['Metallurgy', 'Chemical', 'Electrical', 'Civil Materials'],
    contact: '033-23553241 | erlb@bis.gov.in',
    accreditation: 'NABL Accredited'
  },
  {
    id: 'lab-regional-mumbai',
    name: 'BIS Western Regional Laboratory, Mumbai',
    type: 'BIS Regional Lab',
    location: 'Manakalaya, E9, MIDC, Behind Marol Telephone Exchange, Andheri East, Mumbai',
    state: 'Maharashtra',
    disciplines: ['Electronics & IT', 'Chemical', 'Mechanical', 'Toys & Polymer'],
    contact: '022-28329295 | wrlb@bis.gov.in',
    accreditation: 'NABL Accredited'
  },
  {
    id: 'lab-regional-chennai',
    name: 'BIS Southern Regional Laboratory, Chennai',
    type: 'BIS Regional Lab',
    location: 'CIT Campus, IV Cross Road, Taramani, Chennai, Tamil Nadu',
    state: 'Tamil Nadu',
    disciplines: ['Electrotechnical', 'Chemical', 'Water Quality', 'Textile'],
    contact: '044-22541442 | srlb@bis.gov.in',
    accreditation: 'NABL Accredited'
  }
];
