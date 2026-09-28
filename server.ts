import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { performBISRetrieval, performBISRetrievalAsync, RetrievalResult, extractISNumbers, extractQueryIntent, QueryIntent } from './src/services/retrievalEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini Client server-side
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.log('Gemini API key not configured or set to placeholder. Operating with local grounded RAG engine.');
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi (हिंदी)',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
  ml: 'Malayalam (മലയാളം)',
  kn: 'Kannada (ಕನ್ನಡ)',
  auto: 'the same language as the user question (Auto-Detect)'
};

const VERIFICATION_NOTICES: Record<string, string> = {
  en: "Verification recommended: BIS requirements, regulations, fees, and procedures may change. Please verify this information using the latest official BIS source before making a compliance or certification decision.",
  hi: "सत्यापन अनुशंसित: बीआईएस आवश्यकताएं, नियम, शुल्क और प्रक्रियाएं बदल सकती हैं। कृपया कोई भी अनुपालन या प्रमाणन निर्णय लेने से पहले नवीनतम आधिकारिक बीआईएस स्रोत से इस जानकारी को सत्यापित करें।",
  ta: "சரிபார்த்தல் பரிந்துரைக்கப்படுகிறது: பிஐஎஸ் தேவைகள், விதிமுறைகள், கட்டணங்கள் மற்றும் நடைமுறைகள் மாறக்கூடும். இணக்கம் அல்லது சான்றிதழ் முடிவை எடுப்பதற்கு முன், பிஐஎஸ் அதிகாரப்பூர்வ மூலத்திலிருந்து இந்தத் தகவலைச் சரிபார்க்கவும்.",
  te: "ధృవీకరణ సిఫార్సు చేయబడింది: బిఐఎస్ అవసరాలు, నిబంధనలు, రుసుములు మరియు విధానాలు మారవచ్చు. సమ్మతి లేదా ధృవీకరణ నిర్ణయం తీసుకునే ముందు అధికారిక బిఐఎస్ మూలం నుండి ఈ సమాచారాన్ని ధృవీకరించండి.",
  ml: "സ്ഥിരീകരണം ശുപാർശ ചെയ്യുന്നു: ബിഐഎസ് ആവശ്യകതകൾ, നിയന്ത്രണങ്ങൾ, ഫീസുകൾ, നടപടിക്രമങ്ങൾ എന്നിവ മാറാം. അനുമതി അല്ലെങ്കിൽ സർട്ടിഫിക്കേഷൻ തീരുമാനങ്ങൾ എടുക്കുന്നതിന് മുമ്പ് ഔദ്യോഗിക ബിഐഎസ് ഉറവിടത്തിൽ നിന്ന് ഇത് പരിശോധിക്കുക.",
  kn: "ಪರಿಶೀಲನೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ: BIS ಅಗತ್ಯತೆಗಳು, ನಿಯಮಗಳು, ಶುಲ್ಕಗಳು ಮತ್ತು ಪ್ರಕ್ರಿಯೆಗಳು ಬದಲಾಗಬಹುದು. ಯಾವುದೇ ಅನುಸರಣೆ ಅಥವಾ ಪ್ರಮಾಣೀಕರಣ ನಿರ್ಧಾರವನ್ನು ತೆಗೆದುಕೊಳ್ಳುವ ಮೊದಲು ಇತ್ತೀಚಿನ ಅಧಿಕೃತ BIS ಮೂಲದಿಂದ ಈ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ."
};

function checkIsCriticalTopic(
  query: string,
  englishQuery: string,
  retrievalResult: RetrievalResult
): boolean {
  const combinedQuery = (query + ' ' + englishQuery).toLowerCase().trim();

  // Simple definition queries explicitly marked as non-critical
  if (
    /what\s+does\s+bis\s+stand\s+for/i.test(combinedQuery) ||
    /full\s+form\s+of\s+bis/i.test(combinedQuery) ||
    /what\s+is\s+the\s+bis\s+logo/i.test(combinedQuery) ||
    /what\s+is\s+bis\s+logo/i.test(combinedQuery) ||
    /what\s+is\s+an\s+indian\s+standard\??$/i.test(combinedQuery) ||
    /definition\s+of\s+indian\s+standard/i.test(combinedQuery)
  ) {
    return false;
  }

  // Critical topic patterns
  const criticalPatterns = [
    /certifi/i,
    /licen/i,
    /approval/i,
    /apply/i,
    /obtain/i,
    /procedure/i,
    /process/i,
    /requirement/i,
    /qco/i,
    /quality\s+control/i,
    /mandatory/i,
    /compulsory/i,
    /act/i,
    /section\s+16/i,
    /section\s+29/i,
    /penalty/i,
    /fine/i,
    /legal/i,
    /hallmark/i,
    /huid/i,
    /purity/i,
    /assaying/i,
    /fee/i,
    /cost/i,
    /msme/i,
    /concession/i,
    /discount/i,
    /audit/i,
    /inspection/i,
    /lab/i,
    /testing/i,
    /renewal/i,
    /suspension/i,
    /cancellation/i,
    /scheme/i,
    /crs/i,
    /isi\s+mark/i,
    /manakonline/i,
    /crsbis/i
  ];

  if (criticalPatterns.some(pattern => pattern.test(combinedQuery))) {
    return true;
  }

  // Matched critical standards, schemes, or non-generic FAQs
  if (
    retrievalResult.matchedStandards.length > 0 ||
    retrievalResult.matchedSchemes.length > 0 ||
    retrievalResult.matchedFaqs.some(faq => faq.id !== 'faq-12')
  ) {
    return true;
  }

  return false;
}

function detectEffectiveLanguage(question: string, requestedLang: string): { code: string; name: string } {
  if (requestedLang && requestedLang !== 'auto' && LANGUAGE_NAMES[requestedLang]) {
    return { code: requestedLang, name: LANGUAGE_NAMES[requestedLang] };
  }
  if (/[\u0B80-\u0BFF]/.test(question)) return { code: 'ta', name: 'Tamil (தமிழ்)' };
  if (/[\u0900-\u097F]/.test(question)) return { code: 'hi', name: 'Hindi (हिंदी)' };
  if (/[\u0C00-\u0C7F]/.test(question)) return { code: 'te', name: 'Telugu (తెలుగు)' };
  if (/[\u0D00-\u0D7F]/.test(question)) return { code: 'ml', name: 'Malayalam (മലയാളം)' };
  if (/[\u0C80-\u0CFF]/.test(question)) return { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' };
  return { code: 'en', name: 'English' };
}

export interface UserInformationNeed {
  mainSubject: string;
  requestedInfo: string;
  entities: string[];
  isMultiPart: boolean;
  subQuestions: string[];
  primaryAspect: string;
  description: string;
}

function analyzeUserInformationNeed(question: string, searchQueryInEnglish: string): UserInformationNeed {
  const text = (question + ' ' + searchQueryInEnglish).toLowerCase().trim();
  const entities: string[] = [];

  const isDigits = extractISNumbers(question + ' ' + searchQueryInEnglish);
  if (isDigits.length > 0) {
    isDigits.forEach(num => {
      const formatted = `IS ${num}`;
      if (!entities.includes(formatted)) entities.push(formatted);
    });
  }

  if (/isi\s*mark|isi/i.test(text)) entities.push('ISI Mark');
  if (/huid/i.test(text)) entities.push('HUID Code');
  if (/crs|compulsory\s+registration/i.test(text)) entities.push('CRS Scheme');
  if (/fmcs|foreign/i.test(text)) entities.push('FMCS (Foreign Scheme)');
  if (/hallmark|gold|jewel/i.test(text)) entities.push('Gold Hallmarking');
  if (/manakonline|e-bis/i.test(text)) entities.push('manakonline.in');
  if (/bis\s*care/i.test(text)) entities.push('BIS Care App');
  if (/lrs|laboratory|lab/i.test(text)) entities.push('BIS Laboratory Scheme');

  const parts = text.split(/,|\band\b|\balso\b|\bplus\b|\?|;|\u0964|\n/i).map(s => s.trim()).filter(s => s.length > 5);
  const isMultiPart = isDigits.length > 1 || (parts.length > 1 && (text.includes('and') || text.includes('?') || text.includes(',') || text.includes('what is') || text.includes('how')));
  const subQuestions: string[] = isMultiPart ? (isDigits.length > 1 ? isDigits.map(d => `Details and scope of IS ${d}`) : parts) : [question];

  let primaryAspect = isDigits.length > 0 ? 'standard_lookup' : 'general_inquiry';
  let mainSubject = entities.length > 0 ? entities.join(', ') : 'Bureau of Indian Standards';
  let requestedInfo = isDigits.length > 0 ? `Indian Standard specification details and comparisons for ${entities.join(', ')}` : 'General BIS information and guidance';

  if (/check|verify|genuine|fake|counterfeit|authentic|அசலியா|உண்மையா|असली|जांच|சரிபார்க்க/i.test(text)) {
    primaryAspect = 'authenticity_check';
    requestedInfo = 'Verification and checking authenticity of ISI Mark / CML / HUID / BIS Licence';
  } else if (/foreign|importer|overseas|outside\s+india|विदेश/i.test(text)) {
    primaryAspect = 'foreign_manufacturer';
    requestedInfo = 'Foreign Manufacturers Certification Scheme (FMCS) rules, eligibility, and process';
  } else if (/validity|renew|expire|duration|period|புதுப்பிக்க|वैधता|नवीनीकरण/i.test(text)) {
    primaryAspect = 'validity_renewal';
    requestedInfo = 'Licence validity period, renewal process, and renewal fee terms';
  } else if (/cancel|suspend|penalty|fine|punish|imprisonment|தண்டனை|சஸ்பெண்ட்|ரद्द|जुर्माना/i.test(text)) {
    primaryAspect = 'cancellation_penalties';
    requestedInfo = 'Legal provisions, cancellation/suspension grounds, and Section 29 penalties under BIS Act 2016';
  } else if (/differen|versus|\bvs\b|வித்தியாசம்|अंतर|తేడా|భేదం|ವ್ಯತ್ಯಾಸ/i.test(text)) {
    primaryAspect = isDigits.length > 0 ? 'standard_comparison' : 'comparison';
    requestedInfo = `Comparison and distinction between specified standards or schemes (${entities.join(', ')})`;
  } else if (/how|obtain|get|apply|approval|procedure|process|steps|எப்படி|ஒப்புதல்|कैसे|प्रक्रिया|ఎలా/i.test(text)) {
    primaryAspect = 'procedure';
    requestedInfo = 'Step-by-step procedural workflow for application, testing, inspection, and licence grant';
  } else if (/document|checklist|requirement|machinery|ஆவணங்கள்|दस्तावेज़|ದಾಖಲೆಗಳು|పత్రాలు|രേഖകൾ/i.test(text)) {
    primaryAspect = 'requirements_checklist';
    requestedInfo = 'Required documents, manufacturing machinery, and in-house testing equipment checklist';
  } else if (/fee|cost|price|discount|msme|concession|startup|50%|கட்டணம்|शुल्क|రుసుము|ഫീസ്|ಶುಲ್ಕ/i.test(text)) {
    primaryAspect = 'fees_concessions';
    requestedInfo = 'Applicable fee structure, application charges, and 50% marking fee concession for MSMEs/Startups';
  } else if (/what\s+is|what\s+does|meaning|definition|என்றால்\s+என்ன|क्या\s+है|ಏನೆಂದರೆ|ఏమిటి|എന്താണ്/i.test(text)) {
    primaryAspect = isDigits.length > 0 ? 'standard_lookup' : 'definition_overview';
    requestedInfo = `Definition, scope, and specifications of ${entities.join(', ')}`;
  }

  return {
    mainSubject,
    requestedInfo,
    entities,
    isMultiPart,
    subQuestions,
    primaryAspect,
    description: `Subject [${mainSubject}], Information Requested [${requestedInfo}], Multi-part [${isMultiPart ? 'YES (' + subQuestions.length + ' sub-parts)' : 'NO'}]`
  };
}

function getVerificationNoticeText(langCode: string, queryText: string): string {
  if (langCode && VERIFICATION_NOTICES[langCode]) {
    return VERIFICATION_NOTICES[langCode];
  }
  if (/[\u0900-\u097F]/.test(queryText)) return VERIFICATION_NOTICES.hi;
  if (/[\u0B80-\u0BFF]/.test(queryText)) return VERIFICATION_NOTICES.ta;
  if (/[\u0C00-\u0C7F]/.test(queryText)) return VERIFICATION_NOTICES.te;
  if (/[\u0D00-\u0D7F]/.test(queryText)) return VERIFICATION_NOTICES.ml;
  if (/[\u0C80-\u0CFF]/.test(queryText)) return VERIFICATION_NOTICES.kn;
  return VERIFICATION_NOTICES.en;
}

function validateAndSanitizeGeneratedAnswer(
  parsedAnswer: any,
  queryIntent: QueryIntent,
  userQuestion: string
): { isValid: boolean; sanitized: any; reason?: string } {
  if (!parsedAnswer || typeof parsedAnswer !== 'object') {
    return { isValid: false, sanitized: null, reason: 'Invalid JSON output from generator' };
  }

  const shortAns = (parsedAnswer.shortAnswer || '').toLowerCase();
  const exp = (parsedAnswer.explanation || '').toLowerCase();
  const fullAnsText = shortAns + ' ' + exp;

  const { intentType, isNumbers, targetProducts } = queryIntent;

  if (intentType === 'consumer_complaint') {
    const addressesComplaint = /complaint|grievance|report|1800-11-8001|consumer@bis|bis care|புகார்|शिकायत|ఫిర్యాదు|ದೂರು|പരാതി/i.test(fullAnsText);
    if (!addressesComplaint) {
      return { isValid: false, sanitized: null, reason: 'Answer failed to address consumer complaint procedure' };
    }
  }

  if (intentType === 'authenticity_verification') {
    const addressesVerification = /verify|verification|cml|license|licence|manakonline|bis care|check|சரிபார்க்க|जांच|తనిఖీ|പരിശോധിക്കുക/i.test(fullAnsText);
    if (!addressesVerification) {
      return { isValid: false, sanitized: null, reason: 'Answer failed to address licence/CML verification' };
    }
  }

  if (isNumbers.length > 0) {
    const isNumbersPresent = isNumbers.filter(num => fullAnsText.includes(num.toLowerCase()));
    if (isNumbersPresent.length === 0) {
      return { isValid: false, sanitized: null, reason: `Answer failed to mention requested IS numbers (${isNumbers.join(', ')})` };
    }
  }

  if (intentType === 'certification_procedure') {
    const addressesProcedure = /procedure|apply|application|process|steps|manakonline|e-bis|ஒப்புதல்|प्रक्रिया|ఎలా/i.test(fullAnsText);
    if (!addressesProcedure) {
      return { isValid: false, sanitized: null, reason: 'Answer failed to address certification application procedure' };
    }
  }

  if (intentType !== 'bis_vs_isi_comparison' && !/bis\s*(?:certification)?\s*vs\s*isi/i.test(userQuestion)) {
    if (parsedAnswer.shortAnswer && /^\s*bis\s*\([^)]*\)\s*is\s*the\s*national\s*standards\s*body/i.test(parsedAnswer.shortAnswer) && !/what\s+is\s+bis/i.test(userQuestion)) {
      parsedAnswer.shortAnswer = parsedAnswer.shortAnswer.replace(/^\s*bis\s*\([^)]*\)\s*is\s*the\s*national\s*standards\s*body[^.]*\.\s*/i, '');
    }
  }

  if (Array.isArray(parsedAnswer.sources) && isNumbers.length === 0 && targetProducts.length === 0) {
    parsedAnswer.sources = parsedAnswer.sources.filter((src: any) => src.type !== 'Indian Standard Specification');
  }

  return { isValid: true, sanitized: parsedAnswer };
}

// API Endpoint for Ask BIS AI Query
app.post('/api/ask-bis', async (req: Request, res: Response) => {
  try {
    const { question, language = 'auto' } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'Please provide a valid question.' });
    }

    // 1. Multilingual Query Normalization: Translate non-English queries to English for optimal hybrid RAG retrieval
    let searchQueryInEnglish = question;
    const isNonAscii = /[^\u0000-\u007F]/.test(question);

    if (aiClient && (isNonAscii || (language && language !== 'en'))) {
      try {
        const transRes = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Translate the following query into a concise English search query for retrieving official Bureau of Indian Standards (BIS) knowledge context. Output ONLY the English search query string without any quotes or preamble.\nQuery: "${question}"`
        });
        if (transRes.text?.trim()) {
          searchQueryInEnglish = transRes.text.trim().replace(/^["']|["']$/g, '');
        }
      } catch (err) {
        console.log('Query translation fallback, executing retrieval with original text:', err);
      }
    }

    // 2. Perform Hybrid Retrieval (Keyword + Vector Search + Reranking) against BIS Knowledge Base
    let retrievalResult: RetrievalResult = await performBISRetrievalAsync(searchQueryInEnglish);

    // Fallback search with original question if translated query returned no match
    if (!retrievalResult.hasSufficientEvidence && searchQueryInEnglish !== question) {
      retrievalResult = await performBISRetrievalAsync(question);
    }

    // 3. If evidence not found in knowledge base
    if (!retrievalResult.hasSufficientEvidence) {
      return res.json({
        shortAnswer: "I could not find sufficient BIS information in the available sources to answer this reliably. Please verify the latest information through the official BIS source.",
        explanation: "Our knowledge base contains verified information on Indian Standards (e.g., IS 10500, IS 14543, IS 1293, IS 2062, IS 13252, IS 15820, IS 1786, IS 9873, IS 12615), BIS certification schemes (ISI Mark, CRS, Hallmarking HUID, FMCS), testing requirements, and consumer/MSME procedures. For unverified topics, please consult the official Bureau of Indian Standards portal.",
        steps: [
          "Visit the official Bureau of Indian Standards portal at bis.gov.in",
          "Search the e-BIS Portal (manakonline.in)",
          "Call the BIS National Toll-Free Helpline: 1800-11-8001"
        ],
        importantInfo: "Notice: Please verify the latest information through the official BIS source (bis.gov.in / manakonline.in).",
        sources: [
          {
            title: "Bureau of Indian Standards Official Portal",
            type: "Official Government Portal",
            section: "Official Services",
            url: "https://www.bis.gov.in",
            date: "2026-01-01"
          }
        ],
        foundInKnowledgeBase: false,
        confidenceScore: 0.0
      });
    }

    // 4. If Gemini AI is configured, generate grounded response in the target language
    const effectiveLang = detectEffectiveLanguage(question, language);
    const userNeed = analyzeUserInformationNeed(question, searchQueryInEnglish);

    if (aiClient) {
      try {
        const systemInstruction = `You are the official AI Assistant for the Bureau of Indian Standards (BIS).
You are a GENERAL-PURPOSE, highly intelligent, grounded BIS assistant capable of answering ANY legitimate question related to BIS.

======================================================================
ORIGINAL USER QUESTION:
"${question}"

DETECTED LANGUAGE:
${effectiveLang.name} (${effectiveLang.code})

DYNAMIC USER INFORMATION NEED:
- Main Subject: ${userNeed.mainSubject}
- Requested Information: ${userNeed.requestedInfo}
- Primary Aspect: ${userNeed.primaryAspect}
- Is Multi-Part Question: ${userNeed.isMultiPart ? 'YES (' + userNeed.subQuestions.length + ' sub-questions)' : 'NO'}
${userNeed.isMultiPart ? '- Sub-Questions to Answer: ' + JSON.stringify(userNeed.subQuestions) : ''}
- Identified Entities / Standards: ${userNeed.entities.join(', ') || 'N/A'}

RELEVANT RETRIEVED VERIFIED BIS EVIDENCE:
${retrievalResult.contextText}
======================================================================

CRITICAL GENERATION INSTRUCTIONS:
1. ANSWER THE USER'S EXACT QUESTION DIRECTLY & COMPLETELY:
   - Provide a direct, complete, and accurate answer addressing the user's specific information need (${userNeed.requestedInfo}).
   - Do NOT start with generic definitions ("BIS is the national standards body of India...") UNLESS the question specifically asks for an organizational overview.
   - Address the specific main subject (${userNeed.mainSubject}) and any mentioned standards or products (${userNeed.entities.join(', ') || 'N/A'}).

2. SPECIFIC INDIAN STANDARD (IS NUMBER) MANDATORY RULES:
   - If the user question mentions specific standard numbers (e.g. IS 10500, IS 14543, IS 9873, etc.):
     a) Treat the query as a STANDARD LOOKUP / STANDARD COMPARISON question.
     b) Address EVERY requested standard number individually and completely.
     c) If comparing standards (e.g. IS 10500 vs IS 14543 for drinking water), clearly explain the distinction, scope, and key parameters of each standard in separate sections or sub-headings.
     d) If a standard covers a separate product or topic (e.g. IS 9873 for toys), explain that standard in its own clearly labeled section.
     e) NEVER replace a standard-number question with generic BIS or ISI mark explanations.
     f) If reliable evidence for any requested standard is missing or unavailable in the retrieved context above, explicitly state: "Available BIS evidence is insufficient for [IS Number]" instead of substituting unrelated BIS information.

3. MULTI-PART QUESTION COMPREHENSIVENESS:
   - If the question contains multiple parts or sub-questions, answer ALL parts thoroughly in clearly structured sections. Do not skip any part of the query.

4. STRICT SAME-LANGUAGE RESPONSE:
   - Generate all human-readable response fields (shortAnswer, explanation, steps, importantInfo) ENTIRELY in ${effectiveLang.name}.
   - Do NOT switch to English unless the requested target language is English or the user asks for English.

5. PRESERVE UNTRANSLATED OFFICIAL BIS TERMINOLOGY & CODES:
   - Do NOT translate standard numbers (e.g. IS 10500, IS 14543, IS 9873), HUID codes, CML numbers, scheme codes (Scheme-I, CRS, FMCS, LRS), or official portal URLs (manakonline.in, crsbis.in, bis.gov.in).

6. DYNAMIC RESPONSE FORMATTING:
   - For procedure/workflow questions: include actionable numbered steps in the 'steps' array.
   - For multi-part or complex queries: use clear structured headings or bullet points in 'explanation'.
   - For simple direct lookups: provide a direct, concise summary.

7. GROUNDING & ZERO HALLUCINATION:
   - Rely strictly on the provided BIS evidence context above.
   - If evidence is insufficient to answer reliably, state that available BIS evidence is insufficient and direct the user to verified official sources (bis.gov.in / manakonline.in).
`;

        const geminiResponse = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `USER QUESTION: "${question}"
DETECTED LANGUAGE: ${effectiveLang.name}
USER INFORMATION NEED: ${userNeed.description}

CRITICAL MANDATORY INSTRUCTION:
"Answer the user's original question directly and completely. Determine the answer strictly from the relevant BIS evidence above. Address EVERY part of the user's request if multi-part. Respond in ${effectiveLang.name}. Do not replace a specific question with a generic explanation of BIS. Do not invent information that is not supported by the available evidence."`,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                shortAnswer: { type: Type.STRING, description: 'Direct short summary addressing requested information in target language' },
                explanation: { type: Type.STRING, description: 'Detailed domain explanation addressing all parts of question in target language' },
                steps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Actionable steps if applicable in target language'
                },
                importantInfo: { type: Type.STRING, description: 'Important compliance note or warning in target language' },
                sources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      type: { type: Type.STRING },
                      section: { type: Type.STRING },
                      url: { type: Type.STRING },
                      date: { type: Type.STRING },
                      isNumber: { type: Type.STRING }
                    },
                    required: ['title', 'type']
                  }
                }
              },
              required: ['shortAnswer', 'explanation', 'sources']
            }
          }
        });

        if (geminiResponse.text) {
          const parsed = JSON.parse(geminiResponse.text.trim());
          const queryIntent = retrievalResult.queryIntent || extractQueryIntent(question);
          const valRes = validateAndSanitizeGeneratedAnswer(parsed, queryIntent, question);

          if (valRes.isValid) {
            const isCritical = checkIsCriticalTopic(question, searchQueryInEnglish, retrievalResult);
            const noticeText = isCritical ? getVerificationNoticeText(effectiveLang.code, question) : null;

            return res.json({
              ...valRes.sanitized,
              foundInKnowledgeBase: true,
              confidenceScore: retrievalResult.confidenceScore,
              isCriticalTopic: isCritical,
              verificationNotice: noticeText
            });
          } else {
            console.warn(`Gemini response failed intent validation (${valRes.reason}), falling back to structured RAG.`);
          }
        }
      } catch (geminiErr) {
        console.error('Gemini API call error, falling back to structured RAG synthesis:', geminiErr);
      }
    }

    // 4. Fallback RAG synthesis if Gemini SDK is unavailable or errored
    const topFaq = retrievalResult.matchedFaqs[0];
    const topStd = retrievalResult.matchedStandards[0];
    const topScheme = retrievalResult.matchedSchemes[0];

    let shortAns = topFaq?.shortAnswer || (topStd ? `${topStd.isNumber} specifies ${topStd.title}. Status: ${topStd.status}.` : (topScheme ? `${topScheme.name} (${topScheme.code}) provides ${topScheme.overview}` : 'Here is the verified information from the BIS knowledge vault.'));
    let exp = topFaq?.detailedExplanation || (topStd ? `${topStd.title} (${topStd.isNumber}) is under the ${topStd.department} department. Scope: ${topStd.scope}. Key Parameters: ${topStd.keyParameters.join('; ')}.` : (topScheme ? `${topScheme.overview} Eligibility: ${topScheme.eligibility.join(', ')}.` : 'Please refer to the official citations below.'));
    let steps = topFaq?.steps || (topScheme ? topScheme.processSteps : []);
    let imp = topFaq?.importantNotes || (topScheme ? `Fee Overview: ${topScheme.feeOverview}. MSME Discount: ${topScheme.msmeConcession}` : (topStd ? `Quality Control Order: ${topStd.gazetteOrder}` : ''));

    // Dynamic & Localized fallback for common questions when Gemini rate-limits occur or in fallback mode
    if (userNeed.primaryAspect === 'standard_lookup' || userNeed.primaryAspect === 'standard_comparison' || (retrievalResult.matchedStandards.length > 0 && userNeed.entities.some(e => e.startsWith('IS')))) {
      const stds = retrievalResult.matchedStandards;
      if (effectiveLang.code === 'hi' || /[\u0900-\u097F]/.test(question)) {
        shortAns = stds.map(s => `${s.isNumber}: ${s.title}`).join('; ');
        exp = stds.map((s, idx) => `${idx + 1}. ${s.isNumber} - ${s.title}\n• विभाग: ${s.department} (${s.status})\n• उद्देश्य / दायरा: ${s.scope}\n• मुख्य पैरामीटर: ${s.keyParameters.join('; ')}\n• क्लॉज संदर्भ: ${s.clauseReference}`).join('\n\n');
      } else if (effectiveLang.code === 'ta' || /[\u0B80-\u0BFF]/.test(question)) {
        shortAns = stds.map(s => `${s.isNumber}: ${s.title}`).join('; ');
        exp = stds.map((s, idx) => `${idx + 1}. ${s.isNumber} - ${s.title}\n• துறை: ${s.department} (${s.status})\n• நோக்கம்: ${s.scope}\n• முக்கிய அளவுருக்கள்: ${s.keyParameters.join('; ')}\n• குறிப்பு: ${s.clauseReference}`).join('\n\n');
      } else if (effectiveLang.code === 'te' || /[\u0C00-\u0C7F]/.test(question)) {
        shortAns = stds.map(s => `${s.isNumber}: ${s.title}`).join('; ');
        exp = stds.map((s, idx) => `${idx + 1}. ${s.isNumber} - ${s.title}\n• విభాగం: ${s.department} (${s.status})\n• పరిధి: ${s.scope}\n• ముఖ్యమైన పారామితులు: ${s.keyParameters.join('; ')}\n• క్లాజ్ సూచన: ${s.clauseReference}`).join('\n\n');
      } else if (effectiveLang.code === 'ml' || /[\u0D00-\u0D7F]/.test(question)) {
        shortAns = stds.map(s => `${s.isNumber}: ${s.title}`).join('; ');
        exp = stds.map((s, idx) => `${idx + 1}. ${s.isNumber} - ${s.title}\n• വകുപ്പ്: ${s.department} (${s.status})\n• വ്യാപ്തി: ${s.scope}\n• പ്രധാന മാനദണ്ഡങ്ങൾ: ${s.keyParameters.join('; ')}\n• ക്ലോസ് റഫറൻസ്: ${s.clauseReference}`).join('\n\n');
      } else if (effectiveLang.code === 'kn' || /[\u0C80-\u0CFF]/.test(question)) {
        shortAns = stds.map(s => `${s.isNumber}: ${s.title}`).join('; ');
        exp = stds.map((s, idx) => `${idx + 1}. ${s.isNumber} - ${s.title}\n• ಇಲಾಖೆ: ${s.department} (${s.status})\n• ವ್ಯಾಪ್ತಿ: ${s.scope}\n• ಪ್ರಮುಖ ನಿಯತಾಂಕಗಳು: ${s.keyParameters.join('; ')}\n• ಕ್ಲಾಸ್ ಉಲ್ಲೇಖ: ${s.clauseReference}`).join('\n\n');
      } else {
        shortAns = stds.map(s => `${s.isNumber} specifies ${s.title}`).join('; ') + '.';
        exp = stds.map((s, idx) => `${idx + 1}. ${s.isNumber} - ${s.title}\n• Department: ${s.department} (${s.status})\n• Scope: ${s.scope}\n• Key Parameters: ${s.keyParameters.join('; ')}\n• Clause Reference: ${s.clauseReference}`).join('\n\n');
      }
      imp = stds.map(s => `${s.isNumber}: ${s.gazetteOrder}`).join(' | ');
    } else if (userNeed.primaryAspect === 'authenticity_check') {
      if (effectiveLang.code === 'ta' || /[\u0B80-\u0BFF]/.test(question)) {
        shortAns = "ISI முத்திரை அல்லது CML உரிம எண்ணை சரிபார்க்க, BIS Care செயலியில் உள்ள 'Verify License' அம்சத்தில் 7-இலக்க CML எண்ணை உள்ளிடவும்.";
        exp = "உண்மையான ISI முத்திரையின் கீழே CM/L-XXXXXXX என்ற 7-இலக்க உரிம எண் அச்சிடப்பட்டிருக்கும். BIS Care செயலி அல்லது manakonline.in தளத்தில் இந்த எண்ணை உள்ளிட்டு உற்பத்தியாளர் பெயர், தொழிற்சாலை முகவரி மற்றும் செல்லுபடியாகும் நிலையை சரிபார்க்கலாம்.";
      } else if (effectiveLang.code === 'hi' || /[\u0900-\u097F]/.test(question)) {
        shortAns = "आईएसआई मार्क की प्रामाणिकता जांचने के लिए, BIS Care App पर 'Verify License' विकल्प में 7-अंकीय CML नंबर दर्ज करें।";
        exp = "प्रत्येक वास्तविक आईएसआई मार्क उत्पाद पर CM/L-XXXXXXX नंबर मुद्रित होता है। बीआईएस केयर ऐप या manakonline.in पर इस नंबर को डालकर लाइसेंस की वैधता और निर्माता की जानकारी जांची जा सकती है।";
      } else if (effectiveLang.code === 'te' || /[\u0C00-\u0C7F]/.test(question)) {
        shortAns = "ISI మార్కు లేదా CML లైసెన్స్ సంఖ్యను తనిఖీ చేయడానికి, BIS Care App లోని 'Verify License' విభాగంలో 7-అంకెల CML సంఖ్యను నమోదు చేయండి.";
        exp = "ప్రతి నిజమైన ISI మార్క్ కలిగిన ఉత్పత్తిపై CM/L-XXXXXXX అనే 7-అంకెల లైసెన్స్ సంఖ్య ఉంటుంది. BIS Care మొబైల్ యాప్ లేదా manakonline.in పోర్టల్‌లో ఈ సంఖ్యను నమోదు చేసి తయారీదారు పేరు, ఫ్యాక్టరీ చిరునామా మరియు లైసెన్స్ చెల్లుబాటును తనిఖీ చేయవచ్చు.";
      } else if (effectiveLang.code === 'ml' || /[\u0D00-\u0D7F]/.test(question)) {
        shortAns = "ISI മാർക്ക് അല്ലെങ്കിൽ CML ലൈസൻസ് നമ്പർ പരിശോധിക്കാൻ, BIS Care ആപ്പിലെ 'Verify License' വിഭാഗത്തിൽ 7-അക്ക CML നമ്പർ നൽകുക.";
        exp = "ഓരോ യഥാർത്ഥ ISI മാർക്കുള്ള ഉൽപ്പന്നത്തിലും CM/L-XXXXXXX എന്ന 7-അക്ക ലൈസൻസ് നമ്പർ ഉണ്ടായിരിക്കും. BIS Care ആപ്പിലോ manakonline.in പോർട്ടലിലോ ഈ നമ്പർ നൽകി നിർമ്മാതാവിന്റെ പേരും ലൈസൻസ് വിവരങ്ങളും പരിശോധിക്കാം.";
      } else if (effectiveLang.code === 'kn' || /[\u0C80-\u0CFF]/.test(question)) {
        shortAns = "ISI ಮಾರ್ಕ್ ಅಥವಾ CML ಲೈಸೆನ್ಸ್ ಸಂಖ್ಯೆಯನ್ನು ಪರಿಶೀಲಿಸಲು, BIS Care App ನಲ್ಲಿ 'Verify License' ವಿಭಾಗದಲ್ಲಿ 7-ಅಂಕಿಯ CML ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.";
        exp = "ಪ್ರತಿಯೊಂದು ಅಧಿಕೃತ ISI ಮಾರ್ಕ್ ಹೊಂದಿರುವ ಉತ್ಪನ್ನದ ಮೇಲೆಯೂ CM/L-XXXXXXX ಎಂಬ 7-ಅಂಕಿಯ ಲೈಸೆನ್ಸ್ ಸಂಖ್ಯೆ ಇರುತ್ತದೆ. BIS Care ಆಪ್ ಅಥವಾ manakonline.in ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಈ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ ತಯಾರಕರ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಬಹುದು.";
      } else {
        shortAns = "To check if an ISI mark is genuine, enter the 7-digit CML licence number (CM/L-XXXXXXX) in the 'Verify Licence' section of the BIS Care App or manakonline.in.";
        exp = "Every genuine ISI marked product displays a 7-digit CML number below the ISI logo. You can verify this number on the BIS Care Mobile App or e-BIS portal (manakonline.in) to check the manufacturer name, factory address, certified brand models, and licence status.";
      }
    } else if (topFaq?.id === 'faq-10' || /complaint|grievance|report|പരാതി|புகார்|शिकायत|ఫిర్యాదు|ದೂರು/i.test(question)) {
      if (effectiveLang.code === 'ml' || /[\u0D00-\u0D7F]/.test(question)) {
        shortAns = "BIS Care ആപ്പ് വഴി വ്യാജ ISI ചിഹ്നമോ ഗുണനിലവാരമില്ലാത്ത ഉൽപ്പന്നങ്ങളോ റിപ്പോർട്ട് ചെയ്യാൻ 'Complaints' വിഭാഗം ഉപയോഗിക്കുക.";
        exp = "ഉപഭോക്താക്കൾക്ക് BIS Care ആപ്പ്, 1800-11-8001 എന്ന ടോൾ ഫ്രീ നമ്പർ അല്ലെങ്കിൽ consumer@bis.gov.in എന്ന ഇമെയിൽ വിലാസം വഴി പരാതി നൽകാം.";
      } else if (effectiveLang.code === 'ta' || /[\u0B80-\u0BFF]/.test(question)) {
        shortAns = "போலி ISI முத்திரை அல்லது தரமற்ற தயாரிப்புகளை BIS Care செயலியில் உள்ள 'Complaints' அம்சம் மூலம் புகாரளிக்கலாம்.";
        exp = "BIS Care செயலி, 1800-11-8001 இலவச தொலைபேசி எண் அல்லது consumer@bis.gov.in மின்னஞ்சல் மூலம் நுகர்வோர் புகார் அளிக்கலாம்.";
      } else if (effectiveLang.code === 'hi' || /[\u0900-\u097F]/.test(question)) {
        shortAns = "नकली आईएसआई मार्क या घटिया गुणवत्ता वाले उत्पादों की शिकायत BIS Care App पर 'Complaints' अनुभाग से दर्ज करें।";
        exp = "उपभोक्ता बीआईएस केयर ऐप, टोल-फ्री नंबर 1800-11-8001 या consumer@bis.gov.in पर ईमेल करके अपनी शिकायत दर्ज करा सकते हैं।";
      } else if (effectiveLang.code === 'te' || /[\u0C00-\u0C7F]/.test(question)) {
        shortAns = "నకిలీ ISI మార్క్ లేదా తక్కువ నాణ్యత ఉత్పత్తులపై BIS Care App లోని 'Complaints' విభాగం ద్వారా ఫిర్యాదు చేయవచ్చు.";
        exp = "వినియోగదారులు BIS Care మొబైల్ యాప్, టోల్-ఫ్రీ నంబర్ 1800-11-8001 లేదా consumer@bis.gov.in ఇమెయిల్ ద్వారా ఫిర్యాదు చేయవచ్చు.";
      } else if (effectiveLang.code === 'kn' || /[\u0C80-\u0CFF]/.test(question)) {
        shortAns = "ನಕಲಿ ISI ಮಾರ್ಕ್ ಅಥವಾ ಕಳಪೆ ಗುಣಮಟ್ಟದ ಉತ್ಪನ್ನಗಳ ದೂರನ್ನು BIS Care App ನ 'Complaints' ವಿಭಾಗದ ಮೂಲಕ ಸಲ್ಲಿಸಬಹುದು.";
        exp = "ಗ್ರಾಹಕರು BIS Care ಆಪ್, ಟೋಲ್-ಫ್ರೀ ಸಂಖ್ಯೆ 1800-11-8001 ಅಥವಾ consumer@bis.gov.in ಇಮೇಲ್ ಮೂಲಕ ದೂರು ನೀಡಬಹುದು.";
      } else {
        shortAns = "To report a fake ISI mark or substandard product, use the 'Complaints' feature on the official BIS Care Mobile App.";
        exp = "Consumers can lodge complaints regarding misuse of ISI Mark, fake HUID, or substandard products via the BIS Care App, calling National Toll-Free Helpline 1800-11-8001, or emailing consumer@bis.gov.in.";
      }
    } else if (userNeed.primaryAspect === 'foreign_manufacturer') {
      if (effectiveLang.code === 'ta' || /[\u0B80-\u0BFF]/.test(question)) {
        shortAns = "ஆம், வெளிநாட்டு உற்பத்தியாளர்கள் Foreign Manufacturers Certification Scheme (FMCS) மூலம் இந்தியாவில் விற்பனை செய்ய BIS சான்றிதழ் (ISI Mark) பெறலாம்.";
        exp = "வெளிநாட்டு உற்பத்தியாளர்கள் services.bis.gov.in/fmcs போர்ட்டலில் ஆன்லைனில் விண்ணப்பித்து, இந்தியாவில் இயங்கும் ஒரு அங்கீகரிக்கப்பட்ட இந்திய பிரதிநிதியை (AIR) நியமிக்க வேண்டும். பிஐஎஸ் அதிகாரியின் தொழிற்சாலை ஆய்வு மற்றும் இந்தியாவில் உள்ள பிஐஎஸ் அங்கீகரிக்கப்பட்ட ஆய்வக பரிசோதனைக்கு பின் சான்றிதழ் வழங்கப்படும்.";
      } else if (effectiveLang.code === 'hi' || /[\u0900-\u097F]/.test(question)) {
        shortAns = "हां, विदेशी निर्माता Foreign Manufacturers Certification Scheme (FMCS) के तहत भारत में निर्यात के लिए बीआईएस प्रमाणन (ISI Mark) प्राप्त कर सकते हैं।";
        exp = "विदेशी निर्माताओं को भारत में रहने वाले एक अधिकृत भारतीय प्रतिनिधि (AIR) को नियुक्त करना होता है, विदेश स्थित फैक्टरी का बीआईएस अधिकारी द्वारा निरीक्षण करवाना होता है और भारत में बीआईएस स्वीकृत लैब में सैंपल टेस्ट कराना होता है।";
      } else if (effectiveLang.code === 'te' || /[\u0C00-\u0C7F]/.test(question)) {
        shortAns = "అవును, విదేశీ తయారీదారులు Foreign Manufacturers Certification Scheme (FMCS) ద్వారా భారతదేశానికి ఎగుమతి చేయడానికి BIS ధృవీకరణ (ISI Mark) పొందవచ్చు.";
        exp = "విదేశీ తయారీదారులు services.bis.gov.in/fmcs ద్వారా దరఖాస్తు చేసుకుని, భారతదేశంలో నివసించే ఒక ప్రతినిధిని (AIR) నియమించాలి. BIS అధికారి ఫ్యాక్టరీ తనిఖీ మరియు భారతీయ ల్యాబ్ లలో శాంపిల్ టెస్టింగ్ తర్వాత లైసెన్స్ పొందవచ్చు.";
      } else if (effectiveLang.code === 'ml' || /[\u0D00-\u0D7F]/.test(question)) {
        shortAns = "അതെ, വിദേശ നിർമ്മാതാക്കൾക്ക് Foreign Manufacturers Certification Scheme (FMCS) വഴി ഇന്ത്യയിലേക്ക് ഉൽപ്പന്നങ്ങൾ കയറ്റുമതി ചെയ്യാൻ BIS സർട്ടിഫിക്കേഷൻ (ISI Mark) നേടാം.";
        exp = "വിദേശ നിർമ്മാതാക്കൾ services.bis.gov.in/fmcs വഴി അപേക്ഷിച്ച്, ഇന്ത്യയിലുള്ള ഒരു പ്രതിനിധിയെ (AIR) ചുമതലപ്പെടുത്തണം. ബിഐഎസ് ഉദ്യോഗസ്ഥന്റെ ഫാക്ടറി പരിശോധനയ്ക്കും ഇന്ത്യയിലെ അംഗീകൃത ലാബ് ടെസ്റ്റിംഗിനും ശേഷം ലൈസൻസ് ലഭിക്കും.";
      } else if (effectiveLang.code === 'kn' || /[\u0C80-\u0CFF]/.test(question)) {
        shortAns = "ಹೌದು, ವಿದೇಶಿ ತಯಾರಕರು Foreign Manufacturers Certification Scheme (FMCS) ಅಡಿಯಲ್ಲಿ ಭಾರತಕ್ಕೆ ರಫ್ತು ಮಾಡಲು BIS ಪ್ರಮಾಣಪತ್ರ (ISI Mark) ಪಡೆಯಬಹುದು.";
        exp = "ವಿದೇಶಿ ತಯಾರಕರು services.bis.gov.in/fmcs ಮೂಲಕ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ, ಭಾರತದಲ್ಲಿರುವ ಅಧಿಕೃತ ಪ್ರತಿನಿಧಿಯನ್ನು (AIR) ನೇಮಿಸಬೇಕು. BIS ಅಧಿಕಾರಿಯ ಕಾರ್ಖಾನೆ ತಪಾಸಣೆ ಮತ್ತು ಭಾರತೀಯ ಪ್ರಯೋಗಾಲಯ ಪರೀಕ್ಷೆಯ ನಂತರ ಲೈಸೆನ್ಸ್ ಸಿಗುತ್ತದೆ.";
      } else {
        shortAns = "Yes, foreign manufacturers can obtain BIS certification (ISI Mark) for exports to India under the Foreign Manufacturers Certification Scheme (FMCS).";
        exp = "Under FMCS, foreign manufacturing units located outside India apply online via services.bis.gov.in/fmcs, appoint an Authorized Indian Representative (AIR) residing in India, host a BIS officer for physical overseas factory audit, test samples in a BIS-recognized lab in India, and submit a USD 10,000 Performance Bank Guarantee.";
      }
    } else if (userNeed.primaryAspect === 'validity_renewal') {
      if (effectiveLang.code === 'ta' || /[\u0B80-\u0BFF]/.test(question)) {
        shortAns = "BIS தயாரிப்பு சான்றிதழ் உரிமம் (CML) ஆரம்பத்தில் 1 முதல் 2 ஆண்டுகளுக்கு வழங்கப்படுகிறது, மேலும் manakonline.in தளத்தில் புதுப்பித்து 5 ஆண்டுகள் வரை நீட்டிக்கலாம்.";
        exp = "கட்டணங்களை செலுத்துவதற்கும், பிஐஎஸ் அதிகாரிகளின் குறிப்பிட்ட நேரமில்லா தொழிற்சாலை தணிக்கை மற்றும் மாதிரி பரிசோதனைகளில் தேர்ச்சி பெறுவதற்கும் உட்பட்டு உரிமம் செல்லுபடியாகும்.";
      } else if (effectiveLang.code === 'hi' || /[\u0900-\u097F]/.test(question)) {
        shortAns = "बीआईएस लाइसेंस (CML) शुरुआती 1 से 2 वर्ष के लिए जारी किया जाता है और manakonline.in पर ऑनलाइन नवीनीकरण करके 5 वर्ष तक बढ़ाया जा सकता है।";
        exp = "लाइसेंस की वैधता समय पर नवीनीकरण शुल्क भुगतान और बीआईएस अधिकारियों द्वारा आवधिक फैक्टरी निरीक्षण व सैंपल टेस्टिंग पर निर्भर करती है।";
      } else if (effectiveLang.code === 'te' || /[\u0C00-\u0C7F]/.test(question)) {
        shortAns = "BIS లైసెన్స్ (CML) ప్రారంభంలో 1 నుండి 2 సంవత్సరాలకు జారీ చేయబడుతుంది మరియు manakonline.in ద్వారా 5 సంవత్సరాల వరకు పొడిగించవచ్చు.";
        exp = "రెగ్యులర్ ఫీజు చెల్లింపు మరియు BIS అధికారుల ఫ్యాక్టరీ తనిఖీలు, శాంపిల్ టెస్టింగ్‌లకు లోబడి లైసెన్స్ చెల్లుబాటు అవుతుంది.";
      } else if (effectiveLang.code === 'ml' || /[\u0D00-\u0D7F]/.test(question)) {
        shortAns = "ബിഐഎസ് ലൈസൻസ് (CML) തുടക്കത്തിൽ 1 മുതൽ 2 വർഷം വരെ നൽകുകയും manakonline.in വഴി 5 വർഷം വരെ പുതുക്കുകയും ചെയ്യാം.";
        exp = "കൃത്യമായ ഫീസ് അടയ്ക്കുന്നതിനും ബിഐഎസ് ഉദ്യോഗസ്ഥരുടെ ഫാക്ടറി പരിശോധനകൾക്കും ലാബ് ടെസ്റ്റുകൾക്കും വിധേയമായി ലൈസൻസ് പ്രാബല്യത്തിൽ തുടരും.";
      } else if (effectiveLang.code === 'kn' || /[\u0C80-\u0CFF]/.test(question)) {
        shortAns = "BIS ಲೈಸೆನ್ಸ್ (CML) ಅನ್ನು ಆರಂಭದಲ್ಲಿ 1 ರಿಂದ 2 ವರ್ಷಗಳಿಗೆ ನೀಡಲಾಗುತ್ತದೆ ಮತ್ತು manakonline.in ಮೂಲಕ 5 ವರ್ಷಗಳವರೆಗೆ ನವೀಕರಿಸಬಹುದು.";
        exp = "ಕ್ರಮಬದ್ಧ ಶುಲ್ಕ ಪಾವತಿ ಮತ್ತು BIS ಅಧಿಕಾರಿಗಳ ಕಾರ್ಖಾನೆ ತಪಾಸಣೆ ಹಾಗೂ ಮಾದರಿ ಪರೀಕ್ಷೆಗೆ ಒಳಪಟ್ಟು ಲೈಸೆನ್ಸ್ ಚಾಲ್ತಿಯಲ್ಲಿರುತ್ತದೆ.";
      } else {
        shortAns = "BIS Product certification licences (CML) are initially granted for 1 to 2 years and can be renewed for up to 5 years via manakonline.in upon paying renewal fees.";
        exp = "Licences remain valid subject to paying marking fees and passing periodic unannounced factory surveillance audits and market sample testing by BIS officers.";
      }
    } else if (userNeed.primaryAspect === 'cancellation_penalties') {
      if (effectiveLang.code === 'ta' || /[\u0B80-\u0BFF]/.test(question)) {
        shortAns = "பிஐஎஸ் சட்டம் 2016 பிரிவு 29-ன் படி, கட்டாய தயாரிப்புகளுக்கு BIS சான்றிதழ் இல்லாமல் விற்பனை செய்வதும் போலி ISI முத்திரையிடுவதும் 2 ஆண்டுகள் வரை சிறைத்தண்டனை அல்லது ₹5 லட்சம் வரை அபராதம் விதிக்கும்.";
      } else if (effectiveLang.code === 'hi' || /[\u0900-\u097F]/.test(question)) {
        shortAns = "बीआईएस अधिनियम 2016 की धारा 29 के तहत बिना प्रमाणन अनिवार्य उत्पाद बेचने या नकली आईएसआई मार्क छापने पर 2 वर्ष तक की जेल या ₹5 लाख तक का जुर्माना हो सकता है।";
      } else if (effectiveLang.code === 'te' || /[\u0C00-\u0C7F]/.test(question)) {
        shortAns = "BIS చట్టం 2016 సెక్షన్ 29 ప్రకారం, నిర్బంధ ఉత్పత్తులను BIS ధృవీకరణ లేకుండా విక్రయించడం లేదా నకిలీ ISI మార్క్ ముద్రించడంపై 2 సంవత్సరాల వరకు జైలు శిక్ష లేదా ₹5 లక్షల వరకు జరిమానా విధించబడుతుంది.";
      } else if (effectiveLang.code === 'ml' || /[\u0D00-\u0D7F]/.test(question)) {
        shortAns = "ബിഐഎസ് ആക്ട് 2016 സെക്ഷൻ 29 പ്രകാരം നിർബന്ധിത ഉൽപ്പന്നങ്ങൾ ബിഐഎസ് സർട്ടിഫിക്കേഷൻ ഇല്ലാതെ വിൽക്കുന്നതും വ്യാജ ISI മാർക്ക് ഉപയോഗിക്കുന്നതും 2 വർഷം വരെ തടവിനോ ₹5 ലക്ഷം വരെ പിഴയ്ക്കോ കാരണമാകാം.";
      } else if (effectiveLang.code === 'kn' || /[\u0C80-\u0CFF]/.test(question)) {
        shortAns = "BIS ಕಾಯ್ದೆ 2016 ರ ಸೆಕ್ಷನ್ 29 ರ ಪ್ರಕಾರ, ಕಡ್ಡಾಯ ಉತ್ಪನ್ನಗಳನ್ನು BIS ಪ್ರಮಾಣಪತ್ರವಿಲ್ಲದೆ ಮಾರಾಟ ಮಾಡುವುದು ಅಥವಾ ನಕಲಿ ISI ಮಾರ್ಕ್ ಬಳಸುವುದು 2 ವರ್ಷಗಳವರೆಗೆ ಜೈಲು ಶಿಕ್ಷೆ ಅಥವಾ ₹5 ಲಕ್ಷದವರೆಗೆ ದಂಡಕ್ಕೆ ಕಾರಣವಾಗಬಹುದು.";
      } else {
        shortAns = "Under Section 29 of the BIS Act 2016, manufacturing or selling mandatory products without BIS certification or printing fake ISI marks attracts imprisonment up to 2 years or fines up to ₹5 Lakhs (or 10x goods value).";
      }
    } else if (userNeed.primaryAspect === 'procedure') {
      if (effectiveLang.code === 'ta' || /[\u0B80-\u0BFF]/.test(question)) {
        shortAns = "உங்கள் தயாரிப்புக்கு BIS சான்றிதழ்/ஒப்புதல் பெற, e-BIS (manakonline.in / crsbis.in) போர்ட்டலில் விண்ணப்பித்து, மாதிரி பரிசோதனை மற்றும் தொழிற்சாலை தணிக்கையை நிறைவு செய்ய வேண்டும்.";
        exp = "பிஐஎஸ் சான்றிதழ் பெற பின்வரும் படிநிலைகளை பின்பற்ற வேண்டும்: 1. தயாரிப்புக்கான இந்திய தரநிலையை (IS Code) கண்டறிதல். 2. e-BIS (manakonline.in) தளத்தில் விண்ணப்பத்தை சமர்ப்பித்தல். 3. தொழிற்சாலை சோதனை வசதிகள் மற்றும் உற்பத்தி உள்கட்டமைப்பை தயார் செய்தல். 4. பிஐஎஸ் அதிகாரியின் தொழிற்சாலை ஆய்வு மற்றும் மாதிரி சேகரிப்பு. 5. அங்கீகரிக்கப்பட்ட ஆய்வக பரிசோதனை அறிக்கைக்கு பின் CML உரிமம் வழங்கல்.";
        steps = [
          "பொருந்தக்கூடிய இந்திய தரநிலையை (IS Code) கண்டறியவும்.",
          "e-BIS போர்ட்டலில் (manakonline.in / crsbis.in) ஆன்லைனில் விண்ணப்பிக்கவும்.",
          "உள்நாட்டு தரக்கட்டுப்பாடு மற்றும் தொழிற்சாலை உபகரணங்களை தயார் செய்யவும்.",
          "பிஐஎஸ் அதிகாரியின் தொழிற்சாலை தணிக்கை மற்றும் மாதிரி சேகரிப்பை நிறைவு செய்யவும்.",
          "ஆய்வக ஆய்வு முடிவுக்குப் பிறகு CML உரிமம் மற்றும் ISI முத்திரை பெறவும்."
        ];
      } else if (effectiveLang.code === 'hi' || /[\u0900-\u097F]/.test(question)) {
        shortAns = "अपने उत्पाद के लिए बीआईएस प्रमाणन प्राप्त करने के लिए, आपको e-BIS (manakonline.in) पोर्टल पर आवेदन करना होगा, नमूना परीक्षण और फैक्टरी ऑडिट पास करना होगा।";
        exp = "बीआईएस लाइसेंस प्राप्त करने की प्रक्रिया: 1. लागू भारतीय मानक (IS) की पहचान करें। 2. manakonline.in या crsbis.in पर ऑनलाइन आवेदन भरें। 3. फैक्टरी में इन-हाउस टेस्टिंग लैब और मैन्युफैक्चरिंग सुविधाएं तैयार रखें। 4. बीआईएस अधिकारी द्वारा फैक्टरी निरीक्षण और सैंपल ड्रा। 5. स्वीकृत लैब रिपोर्ट के बाद CML लाइसेंस जारी किया जाता है।";
        steps = [
          "अपने उत्पाद का लागू भारतीय मानक (IS Number) पहचानें।",
          "e-BIS पोर्टल (manakonline.in / crsbis.in) पर ऑनलाइन रजिस्टर करें।",
          "फैक्टरी इंफ्रास्ट्रक्चर और इन-हाउस टेस्ट इक्विपमेंट तैयार करें।",
          "बीआईएस अधिकारी द्वारा फैक्टरी ऑडिट और सैंपल टेस्टिंग करवाएं।",
          "सफल लैब परीक्षण रिपोर्ट के बाद CML लाइसेंस प्राप्त करें।"
        ];
      } else if (effectiveLang.code === 'kn' || /[\u0C80-\u0CFF]/.test(question)) {
        shortAns = "ನಿಮ್ಮ ಉತ್ಪನ್ನಕ್ಕೆ BIS ಪ್ರಮಾಣಪತ್ರ ಪಡೆಯಲು, e-BIS (manakonline.in) ಪೋರ್ಟಲ್ ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ಕಾರ್ಖಾನೆ ತಪಾಸಣೆ ಮತ್ತು ಪ್ರಯೋಗಾಲಯ ಪರೀಕ್ಷೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಬೇಕು.";
        exp = "BIS ಪ್ರಮಾಣೀಕರಣ ಪ್ರಕ್ರಿಯೆಯ ಪ್ರಮುಖ ಹಂತಗಳು: 1. ಅನ್ವಯವಾಗುವ ಭಾರತೀಯ ಮಾನದಂಡವನ್ನು (IS Number) ಗುರುತಿಸಿ. 2. manakonline.in ನಲ್ಲಿ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ. 3. ಕಾರ್ಖಾನೆಯಲ್ಲಿ ಪರೀಕ್ಷಾ ಉಪಕರಣಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ. 4. BIS ಅಧಿಕಾರಿಯಿಂದ ಕಾರ್ಖಾನೆ ತಪಾಸಣೆ ಮತ್ತು ಮಾದರಿ ಪರೀಕ್ಷೆಯ ನಂತರ CML ಲೈಸೆನ್ಸ್ ಪಡೆಯಿರಿ.";
        steps = [
          "ನಿಮ್ಮ ಉತ್ಪನ್ನದ ಅನ್ವಯಿಕ ಭಾರತೀಯ ಮಾನದಂಡ (IS Code) ಗುರುತಿಸಿ.",
          "e-BIS ಪೋರ್ಟಲ್ (manakonline.in / crsbis.in) ನಲ್ಲಿ ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.",
          "ಕಾರ್ಖಾನೆಯಲ್ಲಿ ಉತ್ಪಾದನಾ ಸೌಲಭ್ಯ ಮತ್ತು ಆಂತರಿಕ ಪರೀಕ್ಷಾ ಸೌಲಭ್ಯ ಹೊಂದಿಸಿ.",
          "BIS ಅಧಿಕಾರಿಯಿಂದ ಕಾರ್ಖಾನೆ ಆಡಿಟ್ ಮತ್ತು ಸ್ಯಾಂಪಲ್ ಪರೀಕ್ಷೆ ಪೂರ್ಣಗೊಳಿಸಿ.",
          "ಯಶಸ್ವಿ ಪ್ರಯೋಗಾಲಯ ವರದಿಯ ನಂತರ CML ಲೈಸೆನ್ಸ್ ಮತ್ತು ISI ಮಾರ್ಕ್ ಪಡೆಯಿರಿ."
        ];
      } else if (effectiveLang.code === 'te' || /[\u0C00-\u0C7F]/.test(question)) {
        shortAns = "మీ ఉత్పత్తికి BIS ధృవీకరణ పొందడానికి, e-BIS (manakonline.in) పోర్టల్‌ ద్వారా దరఖాస్తు చేసి, ఫ్యాక్టరీ తనిఖీ మరియు నమూనా పరీక్షలను పూర్తి చేయాలి.";
        exp = "BIS లైసెన్స్ పొందే విధానం: 1. వర్తించే ఇండియన్ స్టాండర్డ్ (IS సంఖ్య) ను గుర్తించండి. 2. manakonline.in లో దరఖాస్తు చేయండి. 3. ఫ్యాక్టరీ నాణ్యతా పరీక్ష పరికరాలను సిద్ధం చేయండి. 4. ఫ్యాక్టరీ తనిఖీ మరియు శాంపిల్ టెస్టింగ్ పూరైన తర్వాత CML లైసెన్స్ జారీ చేయబడుతుంది.";
        steps = [
          "మీ ఉత్పత్తికి సంబంధించిన ఇండియన్ స్టాండర్డ్ (IS Code) ను గుర్తించండి.",
          "e-BIS (manakonline.in / crsbis.in) లో ఆన్‌లైన్ ద్వారా అప్లై చేయండి.",
          "ఫ్యాక్టరీ టెస్టింగ్ మరియు క్వాలిటీ కంట్రోల్ సదుపాయాలు ఏర్పాటు చేయండి.",
          "BIS అధికారి ఫ్యాక్టరీ తనిఖీ మరియు శాంపిల్ సేకరణ పూర్తి చేయండి.",
          "ల్యాబ్ పరీక్ష విజయవంతమైన తర్వాత CML లైసెన్స్ పొందండి."
        ];
      } else if (effectiveLang.code === 'ml' || /[\u0D00-\u0D7F]/.test(question)) {
        shortAns = "നിങ്ങളുടെ ഉൽപ്പന്നത്തിന് ബിഐഎസ് സർട്ടിഫിക്കേഷൻ ലഭിക്കുന്നതിന്, e-BIS (manakonline.in) പോർട്ടൽ വഴി അപേക്ഷിച്ച് ഫാക്ടറി പരിശോധനയും ലാബ് പരിശോധനയും പൂർത്തിയാക്കേണ്ടതുണ്ട്.";
        exp = "ബിഐഎസ് സർട്ടിഫിക്കേഷൻ ലഭിക്കുന്നതിനുള്ള ഘട്ടങ്ങൾ: 1. അനുയോജ്യമായ ഇന്ത്യൻ സ്റ്റാൻഡേർഡ് (IS number) കണ്ടെത്തുക. 2. e-BIS പോർട്ടലിൽ അപേക്ഷിക്കുക. 3. ഫാക്ടറി ഗുണനിലവാര പരിശോധന സജ്ജമാക്കുക. 4. ബിഐഎസ് ഉദ്യോഗസ്ഥന്റെ പരിശോധനയും ലാബ് ടെസ്റ്റും പൂർത്തിയാക്കി CML ലൈസൻസ് നേടുക.";
        steps = [
          "ഉൽപ്പന്നത്തിന് ബാധകമായ ഇന്ത്യൻ സ്റ്റാൻഡേർഡ് (IS Code) കണ്ടെത്തുക.",
          "e-BIS (manakonline.in / crsbis.in) പോർട്ടൽ വഴി ഓൺ‌ലൈനായി അപേക്ഷിക്കുക.",
          "ഫാക്ടറി നിർമ്മാണ സൗകര്യങ്ങളും ലാബ് ടെസ്റ്റിംഗും ഉറപ്പാക്കുക.",
          "ബിഐഎസ് ഉദ്യോഗസ്ഥന്റെ ഫാക്ടറി പരിശോധന പൂർത്തിയാക്കുക.",
          "ലാബ് ഫലം തൃപ്തികരമെങ്കിൽ CML ലൈസൻസും ISI മാർക്കും നേടുക."
        ];
      } else {
        shortAns = "To obtain BIS certification for your product, apply online via the e-BIS portal (manakonline.in or crsbis.in), undergo factory audit, and pass sample testing in a BIS recognized laboratory.";
        exp = "The BIS certification procedure follows five key steps: 1. Identify the applicable Indian Standard (IS number) for your product. 2. Register and submit your application on e-BIS (manakonline.in) or CRS portal (crsbis.in). 3. Ensure factory readiness, quality control machinery, and testing equipment. 4. Complete BIS officer factory inspection and sample extraction. 5. Grant of CML License / CRS Registration upon successful lab testing.";
        steps = [
          "Identify the applicable Indian Standard (IS Code) for your product.",
          "Apply online on the e-BIS portal (manakonline.in or crsbis.in).",
          "Set up required manufacturing infrastructure and in-house testing facilities.",
          "Undergo BIS factory audit and sample drawing by a BIS inspection officer.",
          "Receive CML License and ISI Mark approval upon successful lab sample testing."
        ];
      }
    } else if (userNeed.primaryAspect === 'comparison') {
      if (effectiveLang.code === 'ta' || /[\u0B80-\u0BFF]/.test(question)) {
        shortAns = "BIS (இந்திய தரநிலைகள் அமைப்பு) என்பது தரநிலைகளை வகுக்கும் அரசு அமைப்பாகும்; ISI முத்திரை (ISI Mark) என்பது சான்றளிக்கப்பட்ட தயாரிப்புகளில் அச்சிடப்படும் தகுதி அடையாளமாகும்.";
        exp = "முக்கிய வித்தியாசம்: 1. BIS (Bureau of Indian Standards) என்பது பிஐஎஸ் சட்டம் 2016-ன் கீழ் அமைக்கப்பட்ட தேசிய தரநிலைகள் நிறுவனமாகும், இது உரிமங்களை வழங்குகிறது. 2. ISI Mark (திட்டம்-I) என்பது தயாரிப்பு சோதிக்கப்பட்டு தரநிர்ணயத்தை பூர்த்தி செய்ததை குறிக்கும் இயற்பியல் முத்திரையாகும்.";
      } else if (effectiveLang.code === 'hi' || /[\u0900-\u097F]/.test(question)) {
        shortAns = "BIS (भारतीय मानक ब्यूरो) वह सरकारी संस्था है जो मानक तैयार करती है और लाइसेंस जारी करती है; जबकि ISI Mark वह भौतिक चिह्न है जो प्रमाणित उत्पादों पर लगाया जाता है।";
        exp = "मुख्य अंतर: 1. बीआईएस (Bureau of Indian Standards) बीआईएस अधिनियम 2016 के तहत राष्ट्रीय मानक निकाय है जो योजनाएं चलाता है और लाइसेंस प्रदान करता है। 2. आईएसआई मार्क (ISI Mark - स्कीम-I) उत्पाद पर मुद्रित होने वाला आधिकारिक प्रमाणन चिह्न है।";
      } else if (effectiveLang.code === 'te' || /[\u0C00-\u0C7F]/.test(question)) {
        shortAns = "BIS (బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్ڈస్) అనేది ప్రమాణాలను రూపొందించే జాతీయ సంస్థ; ISI మార్క్ అనేది ధృవీకరించబడిన ఉత్పత్తులపై ముద్రించే భౌతిక చిహ్నం.";
        exp = "ముఖ్యమైన తేడా: 1. BIS జాతీయ ప్రమాణాల మండలి. 2. ISI Mark అనేది ఫ్యాక్టరీ తనిఖీ మరియు ల్యాబ్ పరీక్షల తర్వాత కేటాయించబడే ప్రమాణాల నాణ్యత చిహ్నం.";
      } else if (effectiveLang.code === 'ml' || /[\u0D00-\u0D7F]/.test(question)) {
        shortAns = "BIS എന്നത് മാനദണ്ഡങ്ങൾ നിശ്ചയിക്കുന്ന ദേശീയ സ്ഥാപനമാണ്; ISI മാർക്ക് എന്നത് ഉൽപ്പന്നങ്ങളിൽ പതിക്കുന്ന ഔദ്യോഗിക ഗുണനിലവാര ചിഹ്നമാണ്.";
        exp = "പ്രധാന വ്യത്യാസം: 1. ബിഐഎസ് (Bureau of Indian Standards) ദേശീയ മാനദണ്ഡ സ്ഥാപനമാണ്. 2. ISI Mark എന്നാൽ നിശ്ചിത ഇന്ത്യൻ സ്റ്റാൻഡേർഡ് പാലിക്കുന്നുണ്ടെന്ന് ഉറപ്പാക്കുന്ന ഗുണനിലവാര ചിഹ്നമാണ്.";
      } else if (effectiveLang.code === 'kn' || /[\u0C80-\u0CFF]/.test(question)) {
        shortAns = "BIS (ಭಾರತೀಯ ಮಾನಕ ಬ್ಯೂರೋ) ಎಂಬುದು ಮಾನದಂಡಗಳನ್ನು ರೂಪಿಸುವ ರಾಷ್ಟ್ರೀಯ ಸಂಸ್ಥೆಯಾಗಿದೆ; ISI ಮಾರ್ಕ್ ಎಂಬುದು ದೃಢೀಕರಿಸಲ್ಪಟ್ಟ ಉತ್ಪನ್ನಗಳ ಮೇಲೆ ಮುದ್ರಿಸುವ ಅಧಿಕೃತ ಚಿಹ್ನೆಯಾಗಿದೆ.";
        exp = "ಮುಖ್ಯ ವ್ಯತ್ಯಾಸ: 1. BIS ರಾಷ್ಟ್ರೀಯ ಮಾನಕ ಸಂಸ್ಥೆ. 2. ISI Mark ಕಾರ್ಖಾನೆ ತಪಾಸಣೆ ಮತ್ತು ಪ್ರಯೋಗಾಲಯ ಪರೀಕ್ಷೆಯ ನಂತರ ನೀಡಲಾಗುವ ಗುಣಮಟ್ಟದ ಲೋಗೋ.";
      } else {
        shortAns = "BIS (Bureau of Indian Standards) is the national standards body that formulates standards and grants licenses; whereas the ISI Mark is the physical conformity mark printed on certified products.";
        exp = "Key Difference: 1. BIS (Bureau of Indian Standards) is the statutory national organization established under BIS Act 2016 responsible for framing Indian Standards (IS) and regulating compliance. 2. ISI Mark is the certified product marking under Scheme-I indicating that a product meets the specified Indian Standard requirements after factory audit and lab testing.";
      }
    } else if (userNeed.primaryAspect === 'requirements_checklist') {
      if (effectiveLang.code === 'ta' || /[\u0B80-\u0BFF]/.test(question)) {
        shortAns = "BIS சான்றிதழ் பெற தேவையான முக்கிய ஆவணங்கள்: தொழிற்சாலை பதிவு சான்றிதழ், உற்பத்தி இயந்திரங்களின் பட்டியல், உள்நாட்டு பரிசோதனை உபகரணங்களின் பட்டியல், அமைவிட வரைபடம் மற்றும் மாதிரி பரிசோதனை அறிக்கை.";
        exp = "e-BIS (manakonline.in) போர்ட்டலில் விண்ணப்பிக்கும் போது சமர்ப்பிக்க வேண்டியவை: 1. உரிமையாளர் சான்று. 2. தயாரிப்பு செயல்முறை வரைபடம். 3. உள்நாட்டு ஆய்வக உபகரணங்கள் மற்றும் அளவுத்திருத்த சான்றிதழ்கள். 4. அங்கீகரிக்கப்பட்ட கையொப்பமிட்டவர் விவரங்கள்.";
      } else if (effectiveLang.code === 'hi' || /[\u0900-\u097F]/.test(question)) {
        shortAns = "बीआईएस प्रमाणन के लिए आवश्यक मुख्य दस्तावेज: फैक्टरी रजिस्ट्रेशन प्रमाणपत्र, मैन्युफैक्चरिंग मशीनरी सूची, इन-हाउस टेस्ट इक्विपमेंट सूची, प्लांट लेआउट मैप और टेस्ट रिपोर्ट।";
        exp = "e-BIS (manakonline.in) पोर्टल पर आवेदन के लिए: 1. स्वामित्व दस्तावेज। 2. निर्माण प्रक्रिया फ्लोचार्ट। 3. प्रयोगशाला उपकरण अंशांकन प्रमाण पत्र। 4. अधिकृत हस्ताक्षरकर्ता विवरण।";
      } else if (effectiveLang.code === 'te' || /[\u0C00-\u0C7F]/.test(question)) {
        shortAns = "BIS ధృవీకరణకు అవసరమైన ముఖ్యమైన పత్రాలు: ఫ్యాక్టరీ రిజిస్ట్రేషన్ సర్టిఫికేట్, తయారీ యంత్రాల జాబితా, అంతర్గత పరీక్ష పరికరాల జాబితా, ప్లాంట్ లేఅవుట్ మ్యాప్.";
      } else if (effectiveLang.code === 'ml' || /[\u0D00-\u0D7F]/.test(question)) {
        shortAns = "ബിഐഎസ് സർട്ടിഫിക്കേഷനായി ആവശ്യമായ പ്രധാന രേഖകൾ: ഫാക്ടറി രജിസ്ട്രേഷൻ സർട്ടിഫിക്കറ്റ്, നിർമ്മാണ യന്ത്രങ്ങളുടെ വിവരങ്ങൾ, ഇൻ-ഹൗസ് ടെസ്റ്റിംഗ് ഉപകരണങ്ങളുടെ പട്ടിക, പ്ലാന്റ് ലേഔട്ട്.";
      } else if (effectiveLang.code === 'kn' || /[\u0C80-\u0CFF]/.test(question)) {
        shortAns = "BIS ಪ್ರಮಾಣಪತ್ರಕ್ಕೆ ಅಗತ್ಯವಿರುವ ಮುಖ್ಯ ದಾಖಲೆಗಳು: ಕಾರ್ಖಾನೆ ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರ, ಉತ್ಪಾದನಾ ಯಂತ್ರೋಪಕರಣಗಳ ಪಟ್ಟಿ, ಆಂತರಿಕ ಪರೀಕ್ಷಾ ಉಪಕರಣಗಳ ಪಟ್ಟಿ ಮತ್ತು ಪ್ಲಾಂಟ್ ಲೇಔಟ್.";
      } else {
        shortAns = "Key documents required for BIS certification include Factory Registration, Manufacturing Machinery List, In-House Testing Equipment List, Plant Layout Map, and Calibration Certificates.";
      }
    } else if (userNeed.primaryAspect === 'fees_concessions') {
      if (effectiveLang.code === 'ta' || /[\u0B80-\u0BFF]/.test(question)) {
        shortAns = "BIS சான்றிதழ் கட்டண அமைப்பில் விண்ணப்பக் கட்டணம், தணிக்கைக் கட்டணம் மற்றும் ஆண்டு குறிப்பீட்டுக் கட்டணம் சேர்க்கப்பட்டுள்ளன. MSME மற்றும் ஸ்டார்ட்அப் நிறுவனங்களுக்கு குறிப்பீட்டுக் கட்டணத்தில் 50% சலுகை வழங்கப்படுகிறது.";
      } else if (effectiveLang.code === 'hi' || /[\u0900-\u097F]/.test(question)) {
        shortAns = "बीआईएस शुल्क संरचना में आवेदन शुल्क, फैक्टरी निरीक्षण शुल्क और वार्षिक मार्किंग फीस शामिल है। एमएसएमई (उद्यम पंजीकृत) और स्टार्टअप्स को मार्किंग फीस में 50% की छूट मिलती है।";
      } else if (effectiveLang.code === 'te' || /[\u0C00-\u0C7F]/.test(question)) {
        shortAns = "BIS రుసుము నిర్మాణంలో అప్లికేషన్ ఫీజు, ఫ్యాక్టరీ తనిఖీ ఫీజు మరియు వార్షిక మార్కింగ్ ఫీజు ఉంటాయి. MSME లు మరియు స్టార్టప్‌లకు మార్కింగ్ ఫీజులో 50% మినహాయింపు లభిస్తుంది.";
      } else if (effectiveLang.code === 'ml' || /[\u0D00-\u0D7F]/.test(question)) {
        shortAns = "ബിഐഎസ് ഫീസ് ഘടനയിൽ അപേക്ഷാ ഫീസ്, ഫാക്ടറി പരിശോധനാ ഫീസ്, വാർഷിക മാർക്കിംഗ് ഫീസ് എന്നിവ ഉൾപ്പെടുന്നു. MSME കൾക്കും സ്റ്റാർട്ടപ്പുകൾക്കും മാർക്കിംഗ് ഫീസിൽ 50% ഇളവ് ലഭിക്കും.";
      } else if (effectiveLang.code === 'kn' || /[\u0C80-\u0CFF]/.test(question)) {
        shortAns = "BIS ಶುಲ್ಕ ರಚನೆಯಲ್ಲಿ ಅರ್ಜಿ ಶುಲ್ಕ, ಕಾರ್ಖಾನೆ ತಪಾಸಣೆ ಶುಲ್ಕ ಮತ್ತು ವಾರ್ಷಿಕ ಮಾರ್ಕಿಂಗ್ ಫೀಸ್ ಸೇರಿವೆ. MSME ಗಳು ಮತ್ತು ಸ್ಟಾರ್ಟ್‌ಅಪ್‌ಗಳಿಗೆ ಮಾರ್ಕಿಂಗ್ ಫೀಸ್‌ನಲ್ಲಿ 50% ರಿಯಾಯಿತಿ ಸಿಗುತ್ತದೆ.";
      } else {
        shortAns = "BIS fee structure includes Application Fee, Inspection Charges, and Annual Marking Fee. Micro & Small Enterprises (MSMEs) and Startups receive a 50% concession on marking fees.";
      }
    } else if (effectiveLang.code === 'ta' || /[\u0B80-\u0BFF]/.test(question)) {
      if (topFaq?.id === 'faq-1' || /சான்றிதழ்|certification/i.test(question + ' ' + searchQueryInEnglish)) {
        shortAns = "பிஐஎஸ் சான்றிதழ் என்பது பிஐஎஸ் சட்டம் 2016-ன் கீழ் இந்திய தரநிலைகள் அமைப்பால் (BIS) வழங்கப்படும் தயாரிப்பு தரம், பாதுகாப்பு மற்றும் நம்பகத்தன்மையின் மூன்றாம் தரப்பு உத்தரவாதம் ஆகும்.";
        exp = "இந்திய தரநிலைகள் அமைப்பு (BIS) நுகர்வோர் விவகாரங்கள் அமைச்சகத்தின் கீழ் இயங்குகிறது. பிஐஎஸ் சான்றிதழ் தயாரிப்புகளின் தரத்தை உறுதி செய்கிறது.";
      } else if (topFaq?.id === 'faq-2') {
        shortAns = "ஐஎஸ்ஐ முத்திரை (ISI Mark) என்பது திட்டம்-I இன் கீழ் தொழிற்சாலை ஆய்வு, உபகரண அளவுத்திருத்தம் மற்றும் ஆய்வக சோதனைக்கு பின் வழங்கப்படும் அதிகாரப்பூர்வ தயாரிப்பு சான்றிதழ் குறியீடு ஆகும்.";
      } else if (topFaq?.id === 'faq-4') {
        shortAns = "தங்க ஹால்மார்க்கிங் தங்கத்தின் தூய்மைக்கு உத்தரவாதம் அளிக்கிறது. ஒவ்வொரு ஹால்மார்க் தங்க நகையிலும் 3 குறியீடுகள் இருக்கும்: பிஐஎஸ் லோகோ, தூய்மை தரம் (எ.கா. 22K916) மற்றும் 6-இலக்க HUID குறியீடு.";
      } else {
        shortAns = "இந்திய தரநிலைகள் அமைப்பு (BIS) என்பது பிஐஎஸ் சட்டம் 2016-ன் கீழ் நிறுவப்பட்ட இந்தியாவின் தேசிய தரநிலைகள் அமைப்பு ஆகும்.";
        exp = "பிஐஎஸ் அமைப்பு தரநிலைகளை உருவாக்குதல், தயாரிப்பு சான்றிதழ் வழங்குதல் மற்றும் ஆய்வக பரிசோதனைகளை மேற்கொள்கிறது.";
      }
    } else if (effectiveLang.code === 'hi' || /[\u0900-\u097F]/.test(question)) {
      if (topFaq?.id === 'faq-1' || /प्रमाणन|certification/i.test(question + ' ' + searchQueryInEnglish)) {
        shortAns = "बीआईएस प्रमाणन बीआईएस अधिनियम 2016 के तहत भारतीय मानक ब्यूरो (BIS) द्वारा प्रदान की जाने वाली उत्पाद की गुणवत्ता, सुरक्षा और विश्वसनीयता की तीसरी पक्ष की गारंटी है।";
        exp = "भारतीय मानक ब्यूरो (BIS) उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय के तहत भारत का राष्ट्रीय मानक निकाय है।";
      } else if (topFaq?.id === 'faq-2') {
        shortAns = "आईएसआई मार्क (ISI Mark) योजना-I के तहत फैक्ट्री निरीक्षण, उपकरण अंशांकन और लैब परीक्षण के बाद दिया जाने वाला आधिकारिक उत्पाद प्रमाणन चिह्न है।";
      } else if (topFaq?.id === 'faq-4') {
        shortAns = "गोल्ड हॉलमार्किंग सोने की शुद्धता की गारंटी देती है। प्रत्येक हॉलमार्क वाले सोने के आभूषण पर 3 चिह्न होते हैं: बीआईएस लोगो, शुद्धता (जैसे 22K916) और 6-अंकीय HUID कोड।";
      } else {
        shortAns = "भारतीय मानक ब्यूरो (BIS) भारत का राष्ट्रीय मानक निकाय है जो बीआईएस अधिनियम 2016 के तहत स्थापित किया गया है।";
        exp = "बीआईएस मानकों के निर्माण, उत्पाद प्रमाणन, हॉलमार्किंग और प्रयोगशाला परीक्षण के लिए जिम्मेदार है।";
      }
    } else if (effectiveLang.code === 'kn' || /[\u0C80-\u0CFF]/.test(question)) {
      if (topFaq?.id === 'faq-1' || /ಪ್ರಮಾಣೀಕರಣ|certification/i.test(question + ' ' + searchQueryInEnglish)) {
        shortAns = "ಬಿಐಎಸ್ ಪ್ರಮಾಣಪತ್ರವು ಬಿಐಎಸ್ ಕಾಯ್ದೆ 2016 ರ ಅಡಿಯಲ್ಲಿ ಭಾರತೀಯ ಮಾನಕ ಬ್ಯೂರೋ (BIS) ಒದಗಿಸುವ ಉತ್ಪನ್ನದ ಗುಣಮಟ್ಟ, ಸುರಕ್ಷತೆ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹತೆಯ ಮೂರನೇ ವ್ಯಕ್ತಿಯ ಗ್ಯಾರಂಟಿಯಾಗಿದೆ.";
        exp = "ಭಾರತೀಯ ಮಾನಕ ಬ್ಯೂರೋ (BIS) BIS ಕಾಯ್ದೆ 2016 ರ ಅಡಿಯಲ್ಲಿ ಸ್ಥಾಪಿಸಲಾದ ರಾಷ್ಟ್ರೀಯ ಮಾನಕ ಸಂಸ್ಥೆಯಾಗಿದೆ.";
      } else if (topFaq?.id === 'faq-2') {
        shortAns = "ಐಎಸ್‌ಐ ಮಾರ್ಕ್ (ISI Mark) ಎಂಬುದು ಯೋಜನೆ-I ರ ಅಡಿಯಲ್ಲಿ ಕಾರ್ಖಾನೆ ತಪಾಸಣೆ ಮತ್ತು ಪ್ರಯೋಗಾಲಯ ಪರೀಕ್ಷೆಯ ನಂತರ ನೀಡಲಾಗುವ ಅಧಿಕೃತ ಉತ್ಪನ್ನ ಪ್ರಮಾಣೀಕರಣ ಚಿಹ್ನೆಯಾಗಿದೆ.";
      } else if (topFaq?.id === 'faq-4') {
        shortAns = "ಚಿನ್ನದ ಹಾಲ್ ಮಾರ್ಕಿಂಗ್ ಚಿನ್ನದ ಶುದ್ಧತೆಗೆ ಖಾತರಿ ನೀಡುತ್ತದೆ. ಪ್ರತಿಯೊಂದು ಹಾಲ್ ಮಾರ್ಕ್ ಚಿನ್ನದ ವಸ್ತುವಿನಲ್ಲಿ 3 ಚಿಹ್ನೆಗಳಿರುತ್ತವೆ: BIS ಲೋಗೋ, ಶುದ್ಧತೆ ಗ್ರೇಡ್ (ಉದಾ. 22K916) ಮತ್ತು 6-ಅಂಕಿಯ HUID ಕೋಡ್.";
      } else {
        shortAns = "ಭಾರತೀಯ ಮಾನಕ ಬ್ಯೂರೋ (BIS) ಎಂಬುದು BIS ಕಾಯ್ದೆ 2016 ರ ಅಡಿಯಲ್ಲಿ ಸ್ಥಾಪಿಸಲಾದ ಭಾರತದ ರಾಷ್ಟ್ರೀಯ ಮಾನಕ ಸಂಸ್ಥೆಯಾಗಿದೆ.";
        exp = "BIS ಮಾನದಂಡಗಳನ್ನು ರೂಪಿಸುವುದು, ಉತ್ಪನ್ನ ಪ್ರಮಾಣೀಕರಣ ಮತ್ತು ಪ್ರಯೋಗಾಲಯ ಪರೀಕ್ಷೆಗಳನ್ನು ನಡೆಸುತ್ತದೆ.";
      }
    } else if (effectiveLang.code === 'te' || /[\u0C00-\u0C7F]/.test(question)) {
      if (topFaq?.id === 'faq-1' || /ధృవీకరణ|certification/i.test(question + ' ' + searchQueryInEnglish)) {
        shortAns = "బిఐఎస్ ధృవీకరణ అనేది బిఐఎస్ చట్టం 2016 ప్రకారం బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ (BIS) అందించే మూడవ పక్ష నాణ్యత మరియు భద్రతా గ్యారెంటీ.";
        exp = "బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ (BIS) భారతదేశపు జాతీయ ప్రమాణాల సంస్థ.";
      } else {
        shortAns = "బ్యూరో ఆఫ్ ఇండియన్ స్టాండర్డ్స్ (BIS) బిఐఎస్ చట్టం 2016 ద్వారా స్థాపించబడిన భారతదేశ జాతీయ ప్రమాణాల సంస్థ.";
        exp = "బిఐఎస్ ప్రమాణాల రూపకల్పన మరియు నాణ్యత ధృవీకరణలను అందిస్తుంది.";
      }
    } else if (effectiveLang.code === 'ml' || /[\u0D00-\u0D7F]/.test(question)) {
      if (topFaq?.id === 'faq-1' || /സർട്ടിഫിക്കേഷൻ|certification/i.test(question + ' ' + searchQueryInEnglish)) {
        shortAns = "ബിഐഎസ് ആക്ട് 2016 പ്രകാരം ബ്യൂറോ ഓഫ് ഇന്ത്യൻ സ്റ്റാൻഡേർഡ്സ് (BIS) നൽകുന്ന മൂന്നാം കക്ഷി ഗുണനിലവാര ഗ്യാരണ്ടിയാണ് ബിഐഎസ് സർട്ടിഫിക്കേഷൻ.";
        exp = "ബിഐഎസ് ആക്ട് 2016 പ്രകാരം സ്ഥാപിതമായ ഇന്ത്യയിലെ ദേശീയ മാനദണ്ഡ സ്ഥാപനമാണ് ബ്യൂറോ ഓഫ് ഇന്ത്യൻ സ്റ്റാൻഡേർഡ്സ് (BIS).";
      } else {
        shortAns = "ബിഐഎസ് ആക്ട് 2016 പ്രകാരം സ്ഥാപിതമായ ഇന്ത്യയിലെ ദേശീയ മാനദണ്ഡ സ്ഥാപനമാണ് ബ്യൂറോ ഓഫ് ഇന്ത്യൻ സ്റ്റാൻഡേർഡ്സ് (BIS).";
        exp = "ഗുണനിലവാര സർട്ടിഫിക്കേഷൻ, മാനദണ്ഡങ്ങളുടെ രൂപീകരണം എന്നിവ ബിഐഎസ് നിർവ്വഹിക്കുന്നു.";
      }
    }

    const isCritical = checkIsCriticalTopic(question, searchQueryInEnglish, retrievalResult);
    const noticeText = isCritical ? getVerificationNoticeText(effectiveLang.code, question) : null;

    return res.json({
      shortAnswer: shortAns,
      explanation: exp,
      steps: steps,
      importantInfo: imp,
      sources: retrievalResult.sources,
      foundInKnowledgeBase: true,
      confidenceScore: retrievalResult.confidenceScore,
      isCriticalTopic: isCritical,
      verificationNotice: noticeText
    });

  } catch (error) {
    console.error('Error handling /api/ask-bis:', error);
    return res.status(500).json({ error: 'Internal server error processing BIS query.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BIS Assistant Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
