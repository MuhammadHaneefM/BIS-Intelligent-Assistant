import {
  BIS_STANDARDS_KNOWLEDGE,
  BIS_SCHEMES_KNOWLEDGE,
  BIS_FAQS_KNOWLEDGE,
  BIS_LABS_KNOWLEDGE,
  BISStandard,
  BISScheme,
  BISFAQ,
  BISLab
} from '../data/bisKnowledgeBase';
import { pipeline, FeatureExtractionPipeline } from '@xenova/transformers';

export interface RetrievedSource {
  title: string;
  type: string;
  section: string;
  url: string;
  date: string;
  isNumber?: string;
  snippet: string;
}

export type IntentType =
  | 'definition'
  | 'purpose_reason'
  | 'compulsory_certification_products'
  | 'certification_procedure'
  | 'certification_requirements'
  | 'certification_documents'
  | 'certification_fee'
  | 'certification_validity'
  | 'standard_lookup'
  | 'standard_comparison'
  | 'standard_requirement'
  | 'standard_scope'
  | 'product_standard_identification'
  | 'hallmarking'
  | 'hallmark_verification'
  | 'fake_isi_or_mark_complaint'
  | 'isi_mark_verification'
  | 'consumer_complaint'
  | 'laboratory_testing'
  | 'laboratory_discovery'
  | 'bis_scheme'
  | 'bis_scheme_eligibility'
  | 'bis_scheme_procedure'
  | 'testing_requirement'
  | 'product_compliance'
  | 'license_information'
  | 'renewal'
  | 'cancellation_or_suspension'
  | 'general_bis_information'
  | 'unsupported_or_non_bis'
  | 'authenticity_verification'
  | 'bis_vs_isi_comparison'
  | 'fees_concessions'
  | 'hallmarking_gold'
  | 'testing_laboratory'
  | 'foreign_manufacturer'
  | 'requirements_checklist';

export interface QueryIntent {
  intentType: IntentType;
  isNumbers: string[];
  targetProducts: string[];
  targetSchemes: string[];
  isMultiPart: boolean;
  subQuestions: string[];
  description: string;
}

export interface RetrievalResult {
  query: string;
  matchedFaqs: BISFAQ[];
  matchedStandards: BISStandard[];
  matchedSchemes: BISScheme[];
  matchedLabs: BISLab[];
  sources: RetrievedSource[];
  confidenceScore: number; // 0 to 1
  hasSufficientEvidence: boolean;
  contextText: string;
  retrievalMode?: 'hybrid' | 'lexical';
  queryIntent?: QueryIntent;
  debugInfo?: {
    detectedIntent: string;
    normalizedQuery: string;
    isNumbers: string[];
    targetProducts: string[];
    topDocIds: string[];
    candidateRelevanceScores: Record<string, number>;
    rejectionReason?: string;
  };
}

// Synonyms & Intent map for natural language domain expansion
const SYNONYMS_MAP: Record<string, string[]> = {
  bis: ['bureau of indian standards', 'bis act 2016', 'national standards body'],
  certification: ['bis certification', 'cml license', 'factory audit', 'conformity assessment'],
  certificate: ['cml license', 'conformity certificate'],
  licence: ['cml license', 'grant of license'],
  license: ['cml license', 'grant of license'],
  isi: ['isi mark', 'product certification mark', 'cml license', 'scheme-i'],
  hallmark: ['hallmarking', 'huid', 'gold purity', 'is 15820', 'assaying'],
  hallmarking: ['hallmarking', 'huid', 'gold purity', 'is 15820', '22k916'],
  crs: ['compulsory registration scheme', 'scheme-ii', 'r number', 'electronics'],
  lab: ['laboratory', 'lrs', 'sahibabad', 'mohali', 'kolkata', 'mumbai', 'chennai', 'testing lab', 'is 17025'],
  labs: ['laboratory', 'lrs', 'sahibabad', 'mohali', 'kolkata', 'mumbai', 'chennai', 'testing lab'],
  laboratory: ['laboratory', 'lrs', 'sahibabad', 'testing lab', 'bis recognized'],
  laboratories: ['laboratory', 'lrs', 'sahibabad', 'testing lab', 'bis recognized'],
  procedure: ['process steps', 'application steps', 'factory audit'],
  procedures: ['process steps', 'application steps', 'factory audit'],
  process: ['process steps', 'application steps'],
  document: ['documents required', 'checklist', 'machinery list', 'e-bis registration docs'],
  documents: ['documents required', 'checklist', 'machinery list', 'e-bis registration docs'],
  scheme: ['scheme-i', 'isi mark', 'crs', 'hallmarking', 'fmcs', 'schemes'],
  schemes: ['scheme-i', 'isi mark', 'crs', 'hallmarking', 'fmcs'],
  service: ['bis services', 'product certification', 'hallmarking', 'crs', 'lrs'],
  services: ['bis services', 'product certification', 'hallmarking', 'crs', 'lrs'],
  consumer: ['bis care app', 'verify license', 'verify huid', 'complaint', 'grievance'],
  consumers: ['bis care app', 'verify license', 'verify huid', 'complaint', 'grievance'],
  manufacturer: ['e-bis registration', 'manakonline', 'factory audit', 'msme discount', 'documents required'],
  manufacturers: ['e-bis registration', 'manakonline', 'factory audit', 'msme discount', 'documents required'],
  industry: ['e-bis registration', 'manakonline', 'factory audit', 'msme discount'],
  startup: ['50% concession', 'msme', 'dpiit', 'marking fee discount'],
  msme: ['50% concession', 'udyam', 'micro enterprise', 'small enterprise', 'marking fee discount'],
  msmes: ['50% concession', 'udyam', 'micro enterprise', 'small enterprise', 'marking fee discount'],
  difference: ['comparison', 'distinction', 'versus', 'vs'],
  versus: ['comparison', 'distinction', 'vs', 'difference'],
  vs: ['comparison', 'distinction', 'versus', 'difference'],
  water: ['is 10500', 'is 14543', 'drinking water', 'bottled water', 'tds', 'potable water', 'packaged drinking water'],
  gold: ['hallmarking', 'huid', 'is 15820', 'jewellery', 'purity', '22k916', 'gold purity', 'assaying'],
  jewel: ['hallmarking', 'huid', 'is 15820', 'jewellery', 'gold'],
  jewellery: ['hallmarking', 'huid', 'is 15820', 'jewellery', 'gold'],
  plug: ['is 1293', 'socket', '250v', 'electrical wiring', 'pin'],
  socket: ['is 1293', 'plug', '250v'],
  mobile: ['crs', 'is 13252', 'is 16046', 'electronics', 'charger', 'battery', 'r-number', 'meity'],
  phone: ['crs', 'is 13252', 'is 16046', 'electronics', 'charger'],
  laptop: ['crs', 'is 13252', 'electronics', 'r-number'],
  battery: ['is 16046', 'lithium', 'crs', 'power bank'],
  steel: ['is 2062', 'is 1786', 'tmt', 'deformed steel', 'structural steel', 'rebar'],
  tmt: ['is 1786', 'steel', 'rebar', 'construction'],
  toy: ['is 9873', 'toys safety', 'phthalates', 'children'],
  toys: ['is 9873', 'toys safety', 'phthalates', 'children'],
  motor: ['is 12615', 'three phase', 'ie3', 'efficiency'],
  fire: ['is 15683', 'extinguisher', 'portable fire'],
  cement: ['is 269', 'opc 53', 'portland cement'],
  discount: ['50% concession', 'msme', 'fee', 'marking fee', 'udyam', 'startup'],
  fee: ['fee overview', 'marking fee', 'application fee', '50% concession', 'msme', 'cost'],
  fees: ['fee overview', 'marking fee', 'application fee', '50% concession', 'msme', 'cost'],
  cost: ['fee overview', 'marking fee', 'application fee', '50% concession'],
  cml: ['cml number', 'license details', 'verify isi', '7-digit', 'isi mark'],
  huid: ['hallmarking', '6-digit', 'bis care app', 'verify gold', 'ahc'],
  app: ['bis care app', 'complaint', 'verify license', 'verify huid', 'mobile app'],
  complaint: ['bis care app', 'grievance', 'report fake', 'redressal', 'helpline'],
  complaints: ['bis care app', 'grievance', 'report fake', 'redressal', 'helpline'],
  testing: ['laboratory', 'lrs', 'testing lab', 'chemical', 'electrical safety'],
  approval: ['procedure', 'bis certification', 'grant of licence', 'cml license', 'e-bis registration'],
  // Multilingual Indian Language Term Mapping
  'बीआईएस': ['bis', 'bureau of indian standards', 'certification'],
  'பிஐஎஸ்': ['bis', 'bureau of indian standards', 'certification'],
  'பி.ஐ.எஸ்': ['bis', 'bureau of indian standards', 'certification'],
  'బిఐఎస్': ['bis', 'bureau of indian standards', 'certification'],
  'ബിഐഎസ്': ['bis', 'bureau of indian standards', 'certification'],
  'ಬಿಐಎಸ್': ['bis', 'bureau of indian standards', 'certification'],
  'प्रमाणन': ['certification', 'bis certification', 'isi mark'],
  'प्राप्त': ['obtain', 'get', 'procedure', 'application steps'],
  'प्रक्रिया': ['procedure', 'process steps', 'factory audit'],
  'अंतर': ['difference', 'versus', 'bis vs isi', 'difference between bis certification and isi mark'],
  'साன்றிதழ்': ['certification', 'bis certification', 'isi mark'],
  'சான்றளிப்பு': ['certification', 'bis certification'],
  'ஒப்புதல்': ['approval', 'cml license', 'bis certification', 'grant of license'],
  'பெறுவது': ['obtain', 'get', 'procedure', 'how to apply'],
  'வித்தியாசம்': ['difference', 'versus', 'bis vs isi', 'difference between bis certification and isi mark'],
  'எப்படி': ['how to apply', 'procedure', 'process steps'],
  'సాன்றிదజ్': ['certification', 'bis certification'],
  'ఎలా': ['how to apply', 'procedure', 'process steps'],
  'తేడా': ['difference', 'versus', 'bis vs isi'],
  'పొందడం': ['obtain', 'get', 'procedure'],
  'സാക്ഷ്യപത്രം': ['certification', 'bis certification'],
  'എങ്ങനെ': ['how to apply', 'procedure', 'process steps'],
  'വ്യത്യാസം': ['difference', 'versus', 'bis vs isi'],
  'പ്രമാണപത്ര': ['certification', 'bis certification'],
  'ಹೇಗೆ': ['how to apply', 'procedure', 'process steps'],
  'ವ್ಯತ್ಯಾಸ': ['difference', 'versus', 'bis vs isi'],
  'ಪಡೆಯುವುದು': ['obtain', 'get', 'procedure'],
  'हॉलमार्किंग': ['hallmarking', 'huid', 'gold purity'],
  'ஹால்மார்க்கிங்': ['hallmarking', 'huid', 'gold purity'],
  'హాల్‌మార్కింగ్': ['hallmarking', 'huid', 'gold purity'],
  'ഹാൾമാർക്കിംഗ്': ['hallmarking', 'huid', 'gold purity'],
  'ಹಾಲ್ ಮಾರ್ಕಿಂಗ್': ['hallmarking', 'huid', 'gold purity'],
  'आईएसआई': ['isi mark', 'scheme-i'],
  'ஐஎஸ்ஐ': ['isi mark', 'scheme-i'],
  'ఐఎస్ఐ': ['isi mark', 'scheme-i'],
  'ഐ.എസ്.ഐ': ['isi mark', 'scheme-i'],
  'ಐಎಸ್‌ഐ': ['isi mark', 'scheme-i'],
  'ആപ്പ്': ['bis care app', 'complaint', 'verify license', 'mobile app'],
  'செயலி': ['bis care app', 'complaint', 'verify license', 'mobile app'],
  'ऐप': ['bis care app', 'complaint', 'verify license', 'mobile app'],
  'యాప్': ['bis care app', 'complaint', 'verify license', 'mobile app'],
  'ಆಪ್': ['bis care app', 'complaint', 'verify license', 'mobile app'],
  'വ്യാജ': ['fake', 'counterfeit', 'complaint', 'grievance', 'report fake'],
  'போலி': ['fake', 'counterfeit', 'complaint', 'grievance', 'report fake'],
  'नकली': ['fake', 'counterfeit', 'complaint', 'grievance', 'report fake'],
  'నకిలీ': ['fake', 'counterfeit', 'complaint', 'grievance', 'report fake'],
  'ನಕಲಿ': ['fake', 'counterfeit', 'complaint', 'grievance', 'report fake'],
  'പരാതി': ['complaint', 'grievance', 'report fake', 'bis care app'],
  'புகார்': ['complaint', 'grievance', 'report fake', 'bis care app'],
  'शिकायत': ['complaint', 'grievance', 'report fake', 'bis care app'],
  'ఫిర్యాదు': ['complaint', 'grievance', 'report fake', 'bis care app'],
  'ದೂರು': ['complaint', 'grievance', 'report fake', 'bis care app']
};

const STOP_WORDS = new Set([
  'what', 'is', 'how', 'can', 'get', 'the', 'my', 'for', 'you', 'does', 'this', 'that', 'and', 'from', 'have', 'are', 'about', 'with', 'which', 'where', 'when', 'who', 'why', 'should', 'would', 'could', 'bake', 'make', 'do', 'i', 'a', 'an', 'to', 'in', 'of', 'on',
  'mean', 'meaning', 'explain', 'explanation', 'used', 'use', 'purpose', 'signify', 'signifies', 'stands', 'stand', 'overview', 'summary', 'definition', 'define', 'logo', 'mark', 'marks', 'code'
]);

const DOMAIN_KEYWORDS = new Set([
  'bis', 'standard', 'standards', 'is', 'isi', 'hallmark', 'hallmarking', 'crs', 'certification', 'certified', 'certificate', 'laboratory', 'laboratories', 'lab', 'labs', 'testing', 'manufacturer', 'manufacturers', 'msme', 'msmes', 'consumer', 'consumers', 'huid', 'cml', 'license', 'licence', 'scheme', 'schemes', 'service', 'services', 'water', 'gold', 'steel', 'toy', 'toys', 'motor', 'plug', 'socket', 'cement', 'battery', 'fire', 'extinguisher', 'electronics', 'jewellery', 'jewel', 'udyam', 'startup', 'complaint', 'complaints', 'qco', 'gazette', 'act', '2016', '10500', '14543', '1293', '2062', '13252', '15820', '1786', '9873', '12615', '15683', '269', '16046', 'approval', 'approve',
  'requirement', 'requirements', 'procedure', 'procedures', 'process', 'rule', 'rules', 'guideline', 'guidelines', 'specification', 'specifications', 'detail', 'details', 'info', 'information', 'obtaining', 'obtain', 'get', 'apply'
]);

// --- Vector Embedding Engine State ---
let embedderPipeline: FeatureExtractionPipeline | null = null;
let isPipelineInitializing = false;

interface VectorRecord<T> {
  item: T;
  vector: number[];
  text: string;
}

let faqVectors: VectorRecord<BISFAQ>[] = [];
let stdVectors: VectorRecord<BISStandard>[] = [];
let schemeVectors: VectorRecord<BISScheme>[] = [];
let labVectors: VectorRecord<BISLab>[] = [];

/**
 * Cosine similarity calculation between two normalized vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

/**
 * Helper to generate a normalized 384-dim vector for a text string using local transformer model
 */
async function generateVector(text: string): Promise<number[] | null> {
  try {
    if (!embedderPipeline) {
      if (isPipelineInitializing) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      if (!embedderPipeline) {
        isPipelineInitializing = true;
        // Use all-MiniLM-L6-v2 transformer model for fast 384-dimensional dense vector embeddings
        embedderPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        isPipelineInitializing = false;
      }
    }

    if (!embedderPipeline) return null;

    const output = await embedderPipeline(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  } catch (err) {
    console.error('Vector embedding generation failed:', err);
    return null;
  }
}

/**
 * Initialize knowledge base vector embeddings once
 */
async function initializeVectorKnowledgeBase(): Promise<void> {
  if (faqVectors.length > 0) return; // Already initialized

  console.log('Initializing BIS Knowledge Base vector embeddings...');

  for (const faq of BIS_FAQS_KNOWLEDGE) {
    const text = `${faq.question}. ${faq.shortAnswer} ${faq.detailedExplanation} ${faq.keywords.join(' ')}`;
    const vec = await generateVector(text);
    if (vec) {
      faqVectors.push({ item: faq, vector: vec, text });
    }
  }

  for (const std of BIS_STANDARDS_KNOWLEDGE) {
    const text = `${std.isNumber}: ${std.title}. ${std.scope}. Department: ${std.department}. Key params: ${std.keyParameters.join(' ')}`;
    const vec = await generateVector(text);
    if (vec) {
      stdVectors.push({ item: std, vector: vec, text });
    }
  }

  for (const sch of BIS_SCHEMES_KNOWLEDGE) {
    const text = `${sch.name} (${sch.code}). ${sch.overview}. Mark: ${sch.markName}. Steps: ${sch.processSteps.join(' ')}`;
    const vec = await generateVector(text);
    if (vec) {
      schemeVectors.push({ item: sch, vector: vec, text });
    }
  }

  for (const lab of BIS_LABS_KNOWLEDGE) {
    const text = `${lab.name} ${lab.type} located in ${lab.location}, ${lab.state}. Disciplines: ${lab.disciplines.join(' ')}`;
    const vec = await generateVector(text);
    if (vec) {
      labVectors.push({ item: lab, vector: vec, text });
    }
  }

  console.log(`Vector index complete. Embedded ${faqVectors.length} FAQs, ${stdVectors.length} Standards, ${schemeVectors.length} Schemes, ${labVectors.length} Labs.`);
}

export function extractISNumbers(text: string): string[] {
  if (!text) return [];
  const matches = Array.from(text.matchAll(/\bIS\s*[-:\s]?\s*(\d{3,5})\b/gi), m => m[1]);
  return Array.from(new Set(matches));
}

export function extractQueryIntent(userQuery: string): QueryIntent {
  const text = (userQuery || '').toLowerCase().trim();
  const isNumbers = extractISNumbers(text);

  // Non-BIS domain check: Passport, Visa, Income Tax, Flight, Train, Cooking, Weather, etc.
  const nonBisKeywords = /passport|visa|income\s+tax|gst\s+return|flight\s+ticket|train\s+status|pnr|cooking|recipe|weather|cricket|movie|president\s+of|stock\s+market|crypto|tax\s+rate|sports|football/i;
  const bisDomainKeywords = /bis|isi\s*mark|isi|standard|standards|is\s*\d+|huid|hallmark|hallmarking|crs|cml|manakonline|crsbis|qco|bureau\s+of\s+indian\s+standards/i;

  if (nonBisKeywords.test(text) && !bisDomainKeywords.test(text)) {
    return {
      intentType: 'unsupported_or_non_bis',
      isNumbers: [],
      targetProducts: [],
      targetSchemes: [],
      isMultiPart: false,
      subQuestions: [userQuery],
      description: 'Query belongs to a non-BIS domain (Unsupported).'
    };
  }

  const targetProducts: string[] = [];
  if (/water|drinking|potable|bottled|packaged\s+water/i.test(text)) targetProducts.push('drinking water');
  if (/toy|toys|phthalate|children/i.test(text)) targetProducts.push('toys');
  if (/steel|tmt|rebar|deformed|structural/i.test(text)) targetProducts.push('steel');
  if (/plug|socket|electrical\s+wiring|250v/i.test(text)) targetProducts.push('electrical plugs and sockets');
  if (/motor|three\s+phase|ie3/i.test(text)) targetProducts.push('motors');
  if (/battery|lithium|mobile\s+phone|charger|laptop|electronics/i.test(text)) targetProducts.push('electronics & batteries');
  if (/gold|jewel|jewellery|purity|22k/i.test(text)) targetProducts.push('gold jewellery');
  if (/fire|extinguisher/i.test(text)) targetProducts.push('fire extinguishers');
  if (/cement|opc/i.test(text)) targetProducts.push('cement');

  const targetSchemes: string[] = [];
  if (/isi\s*mark|isi/i.test(text)) targetSchemes.push('ISI Mark (Scheme-I)');
  if (/crs|compulsory\s+registration/i.test(text)) targetSchemes.push('CRS (Scheme-II)');
  if (/fmcs|foreign/i.test(text)) targetSchemes.push('FMCS (Foreign Scheme)');
  if (/hallmark|huid/i.test(text)) targetSchemes.push('Gold Hallmarking');
  if (/lrs|lab|testing/i.test(text)) targetSchemes.push('Laboratory Recognition Scheme (LRS)');

  let intentType: IntentType = 'general_bis_information';

  if (/(?:for\s+which|which|what|list\s+of|mandatory|compulsory)\s+(?:products|items|goods|categories|materials|articles)\s+(?:is|are|need|require|cover|under|compulsory|mandatory|necessary|specified|notified)/i.test(text) ||
      /(?:products|items|goods)\s+(?:that\s+need|requiring|under)\s+(?:bis|isi|mandatory|compulsory)/i.test(text) ||
      /for\s+which\s+products\s+is\s+bis/i.test(text) ||
      /which\s+products\s+need\s+bis/i.test(text)) {
    intentType = 'compulsory_certification_products';
  } else if (/(?:is|does)\s+.*(?:mandatory|compulsory|require|need)\s+.*(?:bis|isi|certification|mark)/i.test(text) && targetProducts.length > 0) {
    intentType = 'product_compliance';
  } else if (/why\s+(?:is|do|does|should)\b|purpose\s+of|reason\s+for|benefits\s+of|importance\s+of|necessity\s+of/i.test(text)) {
    intentType = 'purpose_reason';
  } else if (/fake\s+isi|counterfeit\s+isi|report\s+fake|misuse\s+of\s+isi|போலி|नकली|నకిలీ|ന വ്യാജ|ನಕಲಿ/i.test(text) ||
             (/complain|grievance|report/i.test(text) && /isi|mark|logo|cml|huid/i.test(text))) {
    intentType = 'fake_isi_or_mark_complaint';
  } else if (/complaint|grievance|report\s+defect|helpline|1800|consumer@bis|பராதி|புகார்|शिकायत|ఫిర్యాదు|ದೂರು/i.test(text)) {
    intentType = 'consumer_complaint';
  } else if (/verify|verification|check\s+cml|check\s+isi|genuine\s+isi|check\s+licence|authentic\s+isi|சரிபார்க்க|जांच|తనిఖీ|പരിശോധിക്കുക/i.test(text) && /isi|cml|licence|mark/i.test(text)) {
    intentType = 'isi_mark_verification';
  } else if (/verify\s+huid|huid\s+check|check\s+huid|verify\s+hallmark|gold\s+purity\s+check/i.test(text)) {
    intentType = 'hallmark_verification';
  } else if (/hallmark|hallmarking|huid|jewel|gold\s+purity|22k916/i.test(text)) {
    intentType = 'hallmarking';
  } else if (/foreign|overseas|outside\s+india|importer|air|representative|विदेश/i.test(text)) {
    intentType = 'bis_scheme';
  } else if (/renew|renewal|expiry|expire|expiration|extension/i.test(text)) {
    intentType = 'renewal';
  } else if (/validity|valid\s+for|duration|how\s+long\s+valid|period/i.test(text)) {
    intentType = 'certification_validity';
  } else if (/cancel|cancellation|suspend|suspension|penalty|fine|punish|section\s+29|imprisonment|தண்டனை|सजा|जुर्माना/i.test(text)) {
    intentType = 'cancellation_or_suspension';
  } else if (/documents?|checklist|paperwork|proofs|machinery\s+list|equipment\s+list|ஆவணங்கள்|दस्तावेज़|ದಾಖಲೆಗಳು|పత్రాలు|രേഖകൾ/i.test(text)) {
    intentType = 'certification_documents';
  } else if (/fee|fees|cost|charge|charges|price|discount|concession|msme|startup|50%|udyam|கட்டணம்|शुल्क|రుసుము|ഫീസ്|ಶುಲ್ಕ/i.test(text)) {
    intentType = 'certification_fee';
  } else if (/differen|versus|\bvs\b|compare|comparison|வித்தியாசம்|अंतर|తేడా|భేదం|ವ್ಯತ್ಯಾಸ/i.test(text)) {
    if (isNumbers.length > 0) {
      intentType = 'standard_comparison';
    } else if (/bis.*and.*isi|isi.*and.*bis|bis\s*vs\s*isi|difference\s*between\s*bis\s*and\s*isi/i.test(text)) {
      intentType = 'definition';
    } else {
      intentType = 'standard_comparison';
    }
  } else if (isNumbers.length > 0) {
    if (/requirement|parameter|limit|threshold|test/i.test(text)) {
      intentType = 'standard_requirement';
    } else if (/scope|clause|coverage|apply|applies/i.test(text)) {
      intentType = 'standard_scope';
    } else {
      intentType = 'standard_lookup';
    }
  } else if (/which\s+(?:indian\s+standard|is\s+code|standard|specification)\s+applies|standard\s+for\s+/i.test(text)) {
    intentType = 'product_standard_identification';
  } else if (/find.*lab|search.*lab|laboratory\s+directory|where\s+are.*labs|lab\s+near/i.test(text)) {
    intentType = 'laboratory_discovery';
  } else if (/lab|laboratory|labs|testing|test\s+report|lrs|ஆய்வகம்|प्रयोगशाला|ల్యాబ్|ലാബ്/i.test(text)) {
    intentType = 'laboratory_testing';
  } else if (/how\s+(?:can|do|to)\s+(?:apply|get|obtain|receive|register)|procedure|process\s+steps|workflow|எப்படி|ஒப்புதல்|कैसे|प्रक्रिया|ఎలా/i.test(text)) {
    intentType = 'certification_procedure';
  } else if (/what\s+is\s+bis\s+certif|what\s+is\s+isi\s+mark|what\s+is\s+crs|meaning\s+of|definition\s+of/i.test(text)) {
    intentType = 'definition';
  } else if (/what\s+is\s+bis|about\s+bis|bureau\s+of\s+indian\s+standards|bis\s+overview/i.test(text)) {
    intentType = 'general_bis_information';
  }

  const parts = text.split(/,|\band\b|\balso\b|\bplus\b|\?|;|\u0964|\n/i).map(s => s.trim()).filter(s => s.length > 5);
  const isMultiPart = isNumbers.length > 1 || (parts.length > 1 && (text.includes('and') || text.includes('?') || text.includes('what is')));
  const subQuestions: string[] = isMultiPart ? (isNumbers.length > 1 ? isNumbers.map(n => `Details & scope of IS ${n}`) : parts) : [userQuery];

  return {
    intentType,
    isNumbers,
    targetProducts,
    targetSchemes,
    isMultiPart,
    subQuestions,
    description: `Intent [${intentType}], IS Numbers [${isNumbers.join(', ') || 'None'}], Products [${targetProducts.join(', ') || 'None'}]`
  };
}

export function evaluateEvidenceRelevance(
  queryIntent: QueryIntent,
  matchedFaqs: BISFAQ[],
  matchedStandards: BISStandard[],
  matchedSchemes: BISScheme[],
  matchedLabs: BISLab[]
): { isRelevant: boolean; reason: string } {
  const { intentType, isNumbers, targetProducts } = queryIntent;

  if (intentType === 'unsupported_or_non_bis') {
    return { isRelevant: false, reason: 'Query intent unsupported_or_non_bis is outside authorized BIS knowledge domain.' };
  }

  if (isNumbers.length > 0) {
    const matchedIsDigits = matchedStandards.map(s => s.isNumber.replace(/\D/g, ''));
    const matchesAnyRequested = isNumbers.some(num => matchedIsDigits.some(d => d.includes(num)));
    if (!matchesAnyRequested) {
      return { isRelevant: false, reason: `No matched standard matches requested IS numbers (${isNumbers.join(', ')})` };
    }
    return { isRelevant: true, reason: 'Matched requested IS numbers' };
  }

  if (intentType === 'compulsory_certification_products' || intentType === 'product_compliance') {
    const hasQcoOrProductEvidence = matchedFaqs.some(f => f.id === 'faq-1' || f.id === 'faq-6') || matchedStandards.length > 0 || matchedSchemes.length > 0;
    if (!hasQcoOrProductEvidence) {
      return { isRelevant: false, reason: 'No mandatory product QCO evidence found' };
    }
    return { isRelevant: true, reason: 'Matched compulsory certification products evidence' };
  }

  if (intentType === 'purpose_reason') {
    const hasPurposeEvidence = matchedFaqs.some(f => f.id === 'faq-1' || f.id === 'faq-12');
    if (!hasPurposeEvidence) {
      return { isRelevant: false, reason: 'No purpose or reason evidence found' };
    }
    return { isRelevant: true, reason: 'Matched purpose and reason evidence' };
  }

  if (intentType === 'definition' || intentType === 'general_bis_information') {
    const hasDefEvidence = matchedFaqs.some(f => f.id === 'faq-1' || f.id === 'faq-12' || f.id === 'faq-2' || f.id === 'faq-3');
    if (!hasDefEvidence) {
      return { isRelevant: false, reason: 'No definition evidence found' };
    }
    return { isRelevant: true, reason: 'Matched definition evidence' };
  }

  if (intentType === 'fake_isi_or_mark_complaint' || intentType === 'consumer_complaint') {
    const hasComplaintEvidence = matchedFaqs.some(f => f.id === 'faq-10' || f.id === 'faq-16' || /complaint|grievance|report/i.test(f.question + ' ' + f.shortAnswer)) || matchedSchemes.some(s => /complaint/i.test(s.overview));
    if (!hasComplaintEvidence) {
      return { isRelevant: false, reason: 'No complaint or grievance evidence found for consumer_complaint query' };
    }
    return { isRelevant: true, reason: 'Matched consumer complaint evidence' };
  }

  if (intentType === 'isi_mark_verification' || intentType === 'hallmark_verification') {
    const hasVerificationEvidence = matchedFaqs.some(f => f.id === 'faq-7' || f.id === 'faq-4' || /verify|cml|licence|huid/i.test(f.question + ' ' + f.shortAnswer));
    if (!hasVerificationEvidence) {
      return { isRelevant: false, reason: 'No verification evidence found for verification query' };
    }
    return { isRelevant: true, reason: 'Matched authenticity verification evidence' };
  }

  if (intentType === 'certification_fee') {
    const hasFeeEvidence = matchedFaqs.some(f => f.id === 'faq-5' || /fee|msme|concession|discount/i.test(f.question + ' ' + f.shortAnswer)) || matchedSchemes.some(s => /fee|msme/i.test(s.feeOverview + ' ' + s.msmeConcession));
    if (!hasFeeEvidence) {
      return { isRelevant: false, reason: 'No fee or concession evidence found' };
    }
    return { isRelevant: true, reason: 'Matched fees and concessions evidence' };
  }

  if (intentType === 'certification_procedure') {
    const hasProcedureEvidence = matchedFaqs.some(f => f.id === 'faq-13' || f.id === 'faq-1' || /procedure|apply|process|obtain/i.test(f.question + ' ' + f.shortAnswer)) || matchedSchemes.length > 0;
    if (!hasProcedureEvidence) {
      return { isRelevant: false, reason: 'No procedure evidence found' };
    }
    return { isRelevant: true, reason: 'Matched certification procedure evidence' };
  }

  if (intentType === 'certification_documents') {
    const hasReqEvidence = matchedFaqs.some(f => f.id === 'faq-8' || /document|checklist|machinery/i.test(f.question + ' ' + f.shortAnswer)) || matchedSchemes.some(s => s.keyDocumentsRequired.length > 0);
    if (!hasReqEvidence) {
      return { isRelevant: false, reason: 'No document/checklist requirements evidence found' };
    }
    return { isRelevant: true, reason: 'Matched requirements checklist evidence' };
  }

  if (intentType === 'hallmarking') {
    const hasHallmarkEvidence = matchedFaqs.some(f => f.id === 'faq-4' || /hallmark|huid|gold/i.test(f.question + ' ' + f.shortAnswer)) || matchedSchemes.some(s => s.code === 'Hallmarking');
    if (!hasHallmarkEvidence) {
      return { isRelevant: false, reason: 'No hallmarking evidence found' };
    }
    return { isRelevant: true, reason: 'Matched gold hallmarking evidence' };
  }

  if (intentType === 'laboratory_discovery' || intentType === 'laboratory_testing') {
    const hasLabEvidence = matchedFaqs.some(f => f.id === 'faq-9' || /lab|laboratory|testing/i.test(f.question + ' ' + f.shortAnswer)) || matchedLabs.length > 0;
    if (!hasLabEvidence) {
      return { isRelevant: false, reason: 'No testing laboratory evidence found' };
    }
    return { isRelevant: true, reason: 'Matched testing laboratory evidence' };
  }

  if (targetProducts.length > 0) {
    if (matchedStandards.length > 0) return { isRelevant: true, reason: 'Matched product standard' };
  }

  if (matchedFaqs.length > 0 || matchedStandards.length > 0 || matchedSchemes.length > 0 || matchedLabs.length > 0) {
    return { isRelevant: true, reason: 'General matched evidence' };
  }

  return { isRelevant: false, reason: 'No evidence matched query intent' };
}

/**
 * Synchronous Lexical Keyword Search (BM25-style with Synonym Expansion)
 */
export function performBISRetrieval(userQuery: string): RetrievalResult {
  return performLexicalSearch(userQuery);
}

/**
 * Async Hybrid Retrieval: Combines Lexical Keyword Search + Semantic Vector Embedding Search + Reranking
 */
export async function performBISRetrievalAsync(userQuery: string): Promise<RetrievalResult> {
  try {
    const lexicalResult = performLexicalSearch(userQuery);
    const queryIntent = extractQueryIntent(userQuery);
    const extractedIsNumbers = queryIntent.isNumbers;

    await initializeVectorKnowledgeBase();
    const queryVector = await generateVector(userQuery);

    if (!queryVector) {
      return lexicalResult;
    }

    const queryLower = userQuery.toLowerCase().trim();

    const faqVectorScores = faqVectors.map(rec => ({
      faq: rec.item,
      vecSim: cosineSimilarity(queryVector, rec.vector)
    }));

    const stdVectorScores = stdVectors.map(rec => ({
      std: rec.item,
      vecSim: cosineSimilarity(queryVector, rec.vector)
    }));

    const schemeVectorScores = schemeVectors.map(rec => ({
      scheme: rec.item,
      vecSim: cosineSimilarity(queryVector, rec.vector)
    }));

    const hybridFaqs = BIS_FAQS_KNOWLEDGE.map(faq => {
      const lexicalItem = lexicalResult.matchedFaqs.find(f => f.id === faq.id);
      let lexScore = lexicalItem ? 20 : 0;
      if (extractedIsNumbers.length > 0 && queryIntent.intentType !== 'bis_vs_isi_comparison') {
        lexScore = 0; // Do not prioritize generic FAQs when looking up specific IS numbers
      } else {
        if (queryIntent.intentType === 'consumer_complaint' && faq.id === 'faq-10') lexScore += 80;
        if (queryIntent.intentType === 'authenticity_verification' && faq.id === 'faq-7') lexScore += 80;
        if (queryIntent.intentType === 'fees_concessions' && faq.id === 'faq-5') lexScore += 80;
        if (queryIntent.intentType === 'hallmarking_gold' && faq.id === 'faq-4') lexScore += 80;
        if (queryIntent.intentType === 'testing_laboratory' && faq.id === 'faq-9') lexScore += 80;
        if (queryIntent.intentType === 'bis_vs_isi_comparison' && faq.id === 'faq-11') lexScore += 80;
        if (queryIntent.intentType === 'certification_procedure' && (faq.id === 'faq-13' || faq.id === 'faq-1')) lexScore += 50;
      }

      const vecMatch = faqVectorScores.find(v => v.faq.id === faq.id);
      const vecSim = vecMatch ? vecMatch.vecSim : 0;
      const vecScore = (extractedIsNumbers.length > 0 && queryIntent.intentType !== 'bis_vs_isi_comparison') ? 0 : Math.max(0, vecSim * 30);

      const hybridScore = lexScore + vecScore;
      return { faq, score: hybridScore, vecSim };
    }).filter(f => f.score >= 10).sort((a, b) => b.score - a.score);

    const hybridStandards = BIS_STANDARDS_KNOWLEDGE.map(std => {
      const lexicalItem = lexicalResult.matchedStandards.find(s => s.id === std.id);
      let lexScore = lexicalItem ? 20 : 0;
      const stdDigits = std.isNumber.replace(/\D/g, '');

      if (extractedIsNumbers.some(num => std.isNumber.toLowerCase().includes(num) || stdDigits.includes(num))) {
        lexScore += 200;
      } else if (queryIntent.targetProducts.some(p => std.title.toLowerCase().includes(p) || std.scope.toLowerCase().includes(p))) {
        lexScore += 50;
      }

      const vecMatch = stdVectorScores.find(v => v.std.id === std.id);
      const vecSim = vecMatch ? vecMatch.vecSim : 0;
      const vecScore = Math.max(0, vecSim * 30);

      const hybridScore = lexScore + vecScore;
      return { std, score: hybridScore, vecSim };
    }).filter(s => s.score >= 12).sort((a, b) => b.score - a.score);

    const hybridSchemes = BIS_SCHEMES_KNOWLEDGE.map(sch => {
      const isMatchedLexically = lexicalResult.matchedSchemes.some(s => s.id === sch.id);
      let lexScore = isMatchedLexically ? 20 : 0;
      if (queryIntent.intentType === 'foreign_manufacturer' && sch.code === 'FMCS') lexScore += 80;
      if (queryIntent.intentType === 'hallmarking_gold' && sch.code === 'Hallmarking') lexScore += 80;
      if (queryIntent.intentType === 'consumer_complaint' && sch.code === 'Scheme-I') lexScore += 20;

      const vecMatch = schemeVectorScores.find(v => v.scheme.id === sch.id);
      const vecSim = vecMatch ? vecMatch.vecSim : 0;
      const vecScore = Math.max(0, vecSim * 30);

      const hybridScore = lexScore + vecScore;
      return { sch, score: hybridScore, vecSim };
    }).filter(s => s.score >= 12).sort((a, b) => b.score - a.score);

    let matchedStandards: BISStandard[] = [];
    if (extractedIsNumbers.length > 0) {
      matchedStandards = hybridStandards.filter(s => s.score >= 100).map(s => s.std);
      if (matchedStandards.length === 0) {
        matchedStandards = hybridStandards.slice(0, 5).map(s => s.std);
      }
    } else if (queryIntent.targetProducts.length > 0 || queryIntent.intentType === 'standard_lookup') {
      matchedStandards = hybridStandards.filter(s => s.score >= 40).slice(0, 3).map(s => s.std);
    } else {
      // INTENT GATE: If user asked a non-IS question without mentioning a specific product,
      // DO NOT return arbitrary IS standards!
      matchedStandards = [];
    }

    const matchedFaqs = (extractedIsNumbers.length > 0 && queryIntent.intentType !== 'bis_vs_isi_comparison') ? [] : hybridFaqs.slice(0, 3).map(f => f.faq);
    const matchedSchemes = (extractedIsNumbers.length > 0 && queryIntent.intentType !== 'bis_vs_isi_comparison') ? [] : hybridSchemes.slice(0, 2).map(s => s.sch);
    const matchedLabs = lexicalResult.matchedLabs;

    const topHybridScore = Math.max(
      hybridFaqs[0]?.score || 0,
      hybridStandards[0]?.score || 0,
      hybridSchemes[0]?.score || 0
    );

    const evalResult = evaluateEvidenceRelevance(queryIntent, matchedFaqs, matchedStandards, matchedSchemes, matchedLabs);
    const hasSufficientEvidence = evalResult.isRelevant && topHybridScore >= 8;

    if (!hasSufficientEvidence) {
      return {
        query: userQuery,
        matchedFaqs: [],
        matchedStandards: [],
        matchedSchemes: [],
        matchedLabs: [],
        sources: [],
        confidenceScore: 0,
        hasSufficientEvidence: false,
        contextText: 'NO_RELEVANT_BIS_EVIDENCE_FOUND',
        retrievalMode: 'hybrid',
        queryIntent
      };
    }

    const sources: RetrievedSource[] = [];

    matchedStandards.forEach(std => {
      sources.push({
        title: `${std.isNumber}: ${std.title}`,
        type: 'Indian Standard Specification',
        section: std.clauseReference,
        url: std.sourceDocUrl,
        date: std.versionDate,
        isNumber: std.isNumber,
        snippet: `${std.scope} Key Params: ${std.keyParameters.join('; ')}`
      });
    });

    matchedFaqs.forEach(faq => {
      sources.push({
        title: faq.sourceTitle,
        type: faq.sourceType,
        section: faq.clauseCitation,
        url: faq.sourceUrl,
        date: faq.date,
        isNumber: faq.isNumber,
        snippet: faq.shortAnswer
      });
    });

    matchedSchemes.forEach(sch => {
      sources.push({
        title: sch.name,
        type: 'BIS Certification Scheme Document',
        section: `Code: ${sch.code}`,
        url: sch.sourceDocUrl,
        date: '2024-01-01',
        snippet: sch.overview
      });
    });

    let contextText = `=== RETRIEVED BIS HYBRID KNOWLEDGE CONTEXT ===\nUser Intent: ${queryIntent.intentType}\n`;

    if (matchedStandards.length > 0) {
      contextText += `\n--- Relevant Indian Standards (IS Metadata) ---\n`;
      matchedStandards.forEach(std => {
        contextText += `Standard: ${std.isNumber} - ${std.title}\nCategory: ${std.category} (${std.department})\nScope: ${std.scope}\nStatus: ${std.status} (${std.gazetteOrder})\nKey Parameters: ${std.keyParameters.join(', ')}\nClause Ref: ${std.clauseReference}\n\n`;
      });
    }

    if (extractedIsNumbers.length > 0) {
      const matchedIsDigits = matchedStandards.map(s => s.isNumber.replace(/\D/g, ''));
      const missingIsNumbers = extractedIsNumbers.filter(num => !matchedIsDigits.some(d => d.includes(num)));
      if (missingIsNumbers.length > 0) {
        contextText += `\n--- MISSING / UNAVAILABLE STANDARDS IN KNOWLEDGE BASE ---\n`;
        contextText += `Note: Reliable evidence for IS ${missingIsNumbers.join(', IS ')} is NOT available in the current BIS knowledge base.\n\n`;
      }
    }

    if (matchedFaqs.length > 0) {
      contextText += `\n--- Relevant BIS FAQs & Regulations ---\n`;
      matchedFaqs.forEach((faq, i) => {
        contextText += `FAQ ${i + 1}: ${faq.question}\nShort Answer: ${faq.shortAnswer}\nDetailed Explanation: ${faq.detailedExplanation}\nImportant Notes: ${faq.importantNotes || 'N/A'}\nCitation: ${faq.clauseCitation} (${faq.sourceTitle})\n\n`;
      });
    }

    if (matchedSchemes.length > 0) {
      contextText += `\n--- Relevant BIS Certification Schemes ---\n`;
      matchedSchemes.forEach(sch => {
        contextText += `Scheme: ${sch.name} (${sch.code})\nMark: ${sch.markName}\nOverview: ${sch.overview}\nProcess Steps: ${sch.processSteps.join(' -> ')}\nFees & MSME Discount: ${sch.feeOverview} | ${sch.msmeConcession}\n\n`;
      });
    }

    return {
      query: userQuery,
      matchedFaqs,
      matchedStandards,
      matchedSchemes,
      matchedLabs,
      sources,
      confidenceScore: Math.min(1.0, Math.max(0.6, topHybridScore / 25)),
      hasSufficientEvidence: true,
      contextText,
      retrievalMode: 'hybrid',
      queryIntent
    };
  } catch (err) {
    console.error('Hybrid retrieval error, using lexical search:', err);
    return performLexicalSearch(userQuery);
  }
}

/**
 * Base Lexical Search Engine
 */
function performLexicalSearch(userQuery: string): RetrievalResult {
  const queryIntent = extractQueryIntent(userQuery);
  const queryLower = userQuery.toLowerCase().trim();
  const rawTokens = queryLower.split(/\W+/).filter(t => t.length > 1);
  const extractedIsNumbers = queryIntent.isNumbers;

  const meaningfulTokens = rawTokens.filter(t => !STOP_WORDS.has(t));
  const hasDomainKeyword = rawTokens.some(t => DOMAIN_KEYWORDS.has(t)) || extractedIsNumbers.length > 0 || /is\s*\d+/i.test(queryLower);

  if (!hasDomainKeyword && meaningfulTokens.length > 0) {
    return {
      query: userQuery,
      matchedFaqs: [],
      matchedStandards: [],
      matchedSchemes: [],
      matchedLabs: [],
      sources: [],
      confidenceScore: 0,
      hasSufficientEvidence: false,
      contextText: 'NO_EXACT_BIS_MATCH_FOUND',
      retrievalMode: 'lexical',
      queryIntent
    };
  }

  const expandedTerms = new Set<string>(meaningfulTokens);
  for (const token of meaningfulTokens) {
    if (SYNONYMS_MAP[token]) {
      SYNONYMS_MAP[token].forEach(s => expandedTerms.add(s));
    }
  }

  for (const [key, synList] of Object.entries(SYNONYMS_MAP)) {
    if (queryLower.includes(key)) {
      synList.forEach(s => expandedTerms.add(s));
    }
  }

  const terms = Array.from(expandedTerms);

  const scoredFaqs = BIS_FAQS_KNOWLEDGE.map(faq => {
    let score = 0;
    const textToSearch = (faq.question + ' ' + faq.shortAnswer + ' ' + faq.detailedExplanation + ' ' + faq.keywords.join(' ')).toLowerCase();

    if (extractedIsNumbers.length === 0 || queryIntent.intentType === 'bis_vs_isi_comparison') {
      if (queryIntent.intentType === 'consumer_complaint' && faq.id === 'faq-10') score += 80;
      if (queryIntent.intentType === 'authenticity_verification' && faq.id === 'faq-7') score += 80;
      if (queryIntent.intentType === 'fees_concessions' && faq.id === 'faq-5') score += 80;
      if (queryIntent.intentType === 'hallmarking_gold' && faq.id === 'faq-4') score += 80;
      if (queryIntent.intentType === 'testing_laboratory' && faq.id === 'faq-9') score += 80;
      if (queryIntent.intentType === 'bis_vs_isi_comparison' && faq.id === 'faq-11') score += 80;
      if (queryIntent.intentType === 'certification_procedure' && (faq.id === 'faq-13' || faq.id === 'faq-1')) score += 50;
    }

    terms.forEach(term => {
      if (textToSearch.includes(term)) score += 5;
    });

    return { faq, score };
  }).filter(item => item.score > 8).sort((a, b) => b.score - a.score);

  const scoredStandards = BIS_STANDARDS_KNOWLEDGE.map(std => {
    let score = 0;
    const textToSearch = (std.isNumber + ' ' + std.title + ' ' + std.scope + ' ' + std.department + ' ' + std.keyParameters.join(' ')).toLowerCase();
    const stdDigits = std.isNumber.replace(/\D/g, '');

    terms.forEach(term => {
      if (textToSearch.includes(term)) score += 5;
    });

    if (extractedIsNumbers.some(num => std.isNumber.toLowerCase().includes(num) || stdDigits.includes(num))) {
      score += 200; // Strong retrieval boost for exact IS number match!
    } else if (queryIntent.targetProducts.some(p => std.title.toLowerCase().includes(p) || std.scope.toLowerCase().includes(p))) {
      score += 50;
    }

    return { std, score };
  }).filter(item => item.score > 8).sort((a, b) => b.score - a.score);

  const scoredSchemes = BIS_SCHEMES_KNOWLEDGE.map(scheme => {
    let score = 0;
    const textToSearch = (scheme.name + ' ' + scheme.code + ' ' + scheme.overview + ' ' + scheme.markName).toLowerCase();

    terms.forEach(term => {
      if (textToSearch.includes(term)) score += 5;
    });

    if (queryIntent.intentType === 'foreign_manufacturer' && scheme.code === 'FMCS') score += 80;
    if (queryIntent.intentType === 'hallmarking_gold' && scheme.code === 'Hallmarking') score += 80;

    return { scheme, score };
  }).filter(item => item.score > 8).sort((a, b) => b.score - a.score);

  const scoredLabs = BIS_LABS_KNOWLEDGE.map(lab => {
    let score = 0;
    const textToSearch = (lab.name + ' ' + lab.location + ' ' + lab.state + ' ' + lab.disciplines.join(' ')).toLowerCase();

    terms.forEach(term => {
      if (textToSearch.includes(term)) score += 5;
    });

    return { lab, score };
  }).filter(item => item.score > 8).sort((a, b) => b.score - a.score);

  let matchedStandards: BISStandard[] = [];
  if (extractedIsNumbers.length > 0) {
    matchedStandards = scoredStandards.filter(s => s.score >= 100).map(s => s.std);
    if (matchedStandards.length === 0) {
      matchedStandards = scoredStandards.slice(0, 5).map(s => s.std);
    }
  } else if (queryIntent.targetProducts.length > 0 || queryIntent.intentType === 'standard_lookup') {
    matchedStandards = scoredStandards.filter(s => s.score >= 40).slice(0, 3).map(s => s.std);
  } else {
    // INTENT GATE: Non-IS questions without specific product name get NO random standards!
    matchedStandards = [];
  }

  const matchedFaqs = (extractedIsNumbers.length > 0 && queryIntent.intentType !== 'bis_vs_isi_comparison') ? [] : scoredFaqs.slice(0, 3).map(f => f.faq);
  const matchedSchemes = (extractedIsNumbers.length > 0 && queryIntent.intentType !== 'bis_vs_isi_comparison') ? [] : scoredSchemes.slice(0, 2).map(s => s.scheme);
  const matchedLabs = scoredLabs.slice(0, 2).map(l => l.lab);

  const topScore = Math.max(
    scoredFaqs[0]?.score || 0,
    scoredStandards[0]?.score || 0,
    scoredSchemes[0]?.score || 0,
    scoredLabs[0]?.score || 0
  );

  const evalResult = evaluateEvidenceRelevance(queryIntent, matchedFaqs, matchedStandards, matchedSchemes, matchedLabs);
  const hasSufficientEvidence = evalResult.isRelevant && topScore >= 8;

  const confidenceScore = hasSufficientEvidence ? Math.min(1.0, Math.max(0.6, topScore / 15)) : 0;

  const sources: RetrievedSource[] = [];

  matchedStandards.forEach(std => {
    sources.push({
      title: `${std.isNumber}: ${std.title}`,
      type: 'Indian Standard Specification',
      section: std.clauseReference,
      url: std.sourceDocUrl,
      date: std.versionDate,
      isNumber: std.isNumber,
      snippet: `${std.scope} Key Params: ${std.keyParameters.join('; ')}`
    });
  });

  matchedFaqs.forEach(faq => {
    sources.push({
      title: faq.sourceTitle,
      type: faq.sourceType,
      section: faq.clauseCitation,
      url: faq.sourceUrl,
      date: faq.date,
      isNumber: faq.isNumber,
      snippet: faq.shortAnswer
    });
  });

  matchedSchemes.forEach(sch => {
    sources.push({
      title: sch.name,
      type: 'BIS Certification Scheme Document',
      section: `Code: ${sch.code}`,
      url: sch.sourceDocUrl,
      date: '2024-01-01',
      snippet: sch.overview
    });
  });

  let contextText = '';

  if (hasSufficientEvidence) {
    contextText += `=== RETRIEVED BIS KNOWLEDGE Context ===\n`;

    if (matchedStandards.length > 0) {
      contextText += `\n--- Relevant Indian Standards (IS Metadata) ---\n`;
      matchedStandards.forEach(std => {
        contextText += `Standard: ${std.isNumber} - ${std.title}\nCategory: ${std.category} (${std.department})\nScope: ${std.scope}\nStatus: ${std.status} (${std.gazetteOrder})\nKey Parameters: ${std.keyParameters.join(', ')}\nClause Ref: ${std.clauseReference}\n\n`;
      });
    }

    if (extractedIsNumbers.length > 0) {
      const matchedIsDigits = matchedStandards.map(s => s.isNumber.replace(/\D/g, ''));
      const missingIsNumbers = extractedIsNumbers.filter(num => !matchedIsDigits.some(d => d.includes(num)));
      if (missingIsNumbers.length > 0) {
        contextText += `\n--- MISSING / UNAVAILABLE STANDARDS IN KNOWLEDGE BASE ---\n`;
        contextText += `Note: Reliable evidence for IS ${missingIsNumbers.join(', IS ')} is NOT available in the current BIS knowledge base.\n\n`;
      }
    }

    if (matchedFaqs.length > 0) {
      contextText += `\n--- Relevant BIS FAQs & Regulations ---\n`;
      matchedFaqs.forEach((faq, i) => {
        contextText += `FAQ ${i + 1}: ${faq.question}\nShort Answer: ${faq.shortAnswer}\nDetailed Explanation: ${faq.detailedExplanation}\nImportant Notes: ${faq.importantNotes || 'N/A'}\nCitation: ${faq.clauseCitation} (${faq.sourceTitle})\n\n`;
      });
    }

    if (matchedSchemes.length > 0) {
      contextText += `\n--- Relevant BIS Certification Schemes ---\n`;
      matchedSchemes.forEach(sch => {
        contextText += `Scheme: ${sch.name} (${sch.code})\nMark: ${sch.markName}\nOverview: ${sch.overview}\nProcess Steps: ${sch.processSteps.join(' -> ')}\nFees & MSME Discount: ${sch.feeOverview} | ${sch.msmeConcession}\n\n`;
      });
    }

    if (matchedLabs.length > 0) {
      contextText += `\n--- Relevant BIS Recognized Testing Laboratories ---\n`;
      matchedLabs.forEach(lab => {
        contextText += `Lab: ${lab.name} (${lab.type})\nLocation: ${lab.location}, ${lab.state}\nDisciplines: ${lab.disciplines.join(', ')}\nContact: ${lab.contact}\n\n`;
      });
    }
  } else {
    contextText = 'NO_EXACT_BIS_MATCH_FOUND';
  }

  return {
    query: userQuery,
    matchedFaqs,
    matchedStandards,
    matchedSchemes,
    matchedLabs,
    sources,
    confidenceScore,
    hasSufficientEvidence,
    contextText
  };
}
