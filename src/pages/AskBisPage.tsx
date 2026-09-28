import React, { useState, useEffect } from 'react';
import {
  Bot,
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  BookOpen,
  FileText,
  ShieldAlert,
  Share2,
  RefreshCw,
  HelpCircle,
  Globe
} from 'lucide-react';

interface SourceCard {
  title: string;
  type: string;
  section?: string;
  url?: string;
  date?: string;
  isNumber?: string;
}

interface AnswerData {
  shortAnswer: string;
  explanation?: string;
  steps?: string[];
  importantInfo?: string;
  sources: SourceCard[];
  foundInKnowledgeBase: boolean;
  confidenceScore: number;
  isCriticalTopic?: boolean;
  verificationNotice?: string | null;
}

interface AskBisPageProps {
  initialQuery?: string;
}

export const AskBisPage: React.FC<AskBisPageProps> = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeQuestion, setActiveQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [answer, setAnswer] = useState<AnswerData | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');

  const languages = [
    { code: 'auto', name: 'Auto-Detect' },
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' }
  ];

  const exampleQuestions = [
    'What is BIS certification?',
    'What is the ISI Mark?',
    'What is hallmarking?',
    'How can I get BIS certification?',
    'What is HUID?'
  ];

  const handleAsk = async (userQuestion: string, langCode = selectedLanguage) => {
    const trimmedQuestion = userQuestion.trim();
    if (!trimmedQuestion) return;

    // Immediately clear previous state & set active question
    setLoading(true);
    setError(null);
    setAnswer(null);
    setQuery(trimmedQuestion);
    setActiveQuestion(trimmedQuestion);

    // Simulated query parsing steps
    setLoadingStep('Understanding query & language intent...');
    await new Promise((r) => setTimeout(r, 200));
    setLoadingStep('Retrieving grounded BIS evidence...');
    await new Promise((r) => setTimeout(r, 250));
    setLoadingStep('Generating response with traceable citations...');

    try {
      const response = await fetch('/api/ask-bis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmedQuestion,
          language: langCode
        })
      });

      if (!response.ok) {
        throw new Error('Failed to query BIS Intelligent Assistant');
      }

      const data: AnswerData = await response.json();
      setAnswer(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with BIS Assistant server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setQuery(initialQuery);
      handleAsk(initialQuery);
    }
  }, [initialQuery]);

  const handleCopyAnswer = () => {
    if (!answer) return;
    const fullText = `Q: ${activeQuestion || query}\n\nShort Answer:\n${answer.shortAnswer}\n\nExplanation:\n${answer.explanation || ''}\n\nSteps:\n${(answer.steps || []).join('\n')}\n\nImportant Info:\n${answer.importantInfo || ''}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans'] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="text-xs font-bold text-amber-800 tracking-wider uppercase flex items-center justify-center gap-2">
            <Bot className="w-4 h-4 text-amber-700" />
            <span>Bureau of Indian Standards · Intelligent Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
            Ask BIS Intelligent Assistant
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Get grounded, evidence-backed answers on Bureau of Indian Standards, ISI Mark, CRS, Gold Hallmarking, and Testing Procedures.
          </p>
        </div>

        {/* Large Natural Language Question Input Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(query);
            }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Enter your question in natural language
              </label>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-600">Response Language:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-amber-400 focus:outline-none transition-colors cursor-pointer"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative flex flex-col sm:block">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
                placeholder="Ask anything about BIS, Indian Standards, certification, hallmarking, testing or BIS services…"
                className="w-full p-4 pb-14 sm:pb-4 sm:pr-32 text-slate-900 placeholder-slate-400 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm sm:text-base resize-none transition-all break-words"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="sm:absolute right-3 bottom-3 mt-2 sm:mt-0 w-full sm:w-auto justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                <span>Ask BIS</span>
              </button>
            </div>
          </form>

          {/* Suggested Example Prompts */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Suggested Questions (Click to populate & ask):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(q);
                    handleAsk(q);
                  }}
                  className="text-xs bg-slate-50 hover:bg-amber-50 hover:text-amber-900 border border-slate-200 hover:border-amber-300 text-slate-700 px-3 py-1.5 rounded-full font-medium transition-all text-left flex items-center gap-1.5 shadow-2xs hover:shadow-xs group"
                >
                  <Search className="w-3 h-3 text-slate-400 group-hover:text-amber-600 transition-colors" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Progress Card */}
        {loading && (
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">Retrieving Official BIS Information…</h3>
                <p className="text-xs text-amber-400 animate-pulse font-medium">{loadingStep}</p>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full w-3/4 animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {/* Friendly Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-xl flex items-center justify-between gap-3 text-sm shadow-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="font-semibold text-rose-950">Unable to process query</p>
                <p className="text-xs text-rose-700">{error}</p>
              </div>
            </div>
            <button
              onClick={() => handleAsk(query)}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Answer Design Container */}
        {answer && !loading && (
          <div className="space-y-6">
            
            {/* Answer Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-xs text-slate-500 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {answer.foundInKnowledgeBase ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Grounded Answer
                  </span>
                ) : (
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Notice: Evidence Not Found in Local Vault
                  </span>
                )}
                {activeQuestion && (
                  <>
                    <span>·</span>
                    <span className="font-medium text-slate-800 italic truncate max-w-xs">
                      Q: "{activeQuestion}"
                    </span>
                  </>
                )}
              </div>

              <button
                onClick={handleCopyAnswer}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium text-xs self-start sm:self-auto shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Answer'}</span>
              </button>
            </div>

            {/* 1. Short Answer Card */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Short Answer</span>
              </div>
              <p className="text-base sm:text-lg font-semibold leading-relaxed text-slate-100">
                {answer.shortAnswer}
              </p>
            </div>

            {/* 2. Detailed Explanation */}
            {answer.explanation && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-700" />
                  <span>Detailed Explanation</span>
                </h3>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {answer.explanation}
                </p>
              </div>
            )}

            {/* 3. Steps (if applicable) */}
            {answer.steps && answer.steps.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-700" />
                  <span>Actionable Steps & Process</span>
                </h3>
                <div className="space-y-3">
                  {answer.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-sm text-slate-800">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                        {idx + 1}
                      </div>
                      <span className="pt-0.5 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Important Information & Compliance Notes */}
            {answer.importantInfo && (
              <div className="bg-amber-50/80 border border-amber-200/80 text-amber-950 rounded-2xl p-6 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Important Compliance & Fee Information</span>
                </div>
                <p className="text-sm leading-relaxed text-amber-900 font-medium">
                  {answer.importantInfo}
                </p>
              </div>
            )}

            {/* 5. Human Verification / Critical Guidance Notice */}
            {answer.isCriticalTopic && answer.verificationNotice && (
              <div className="bg-amber-500/10 border border-amber-300/80 rounded-2xl p-5 shadow-2xs flex items-start gap-3.5 text-amber-950">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-800 shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5 text-amber-700" />
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <h4 className="font-bold text-amber-950 flex items-center gap-1.5 font-['Outfit'] uppercase tracking-wider text-xs">
                    <span>Verification Recommended</span>
                  </h4>
                  <p className="text-amber-900 leading-relaxed font-medium">
                    {answer.verificationNotice}
                  </p>
                </div>
              </div>
            )}

            {/* 5. Sources & References Section */}
            {answer.sources && answer.sources.length > 0 && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-700" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Sources & Official References ({answer.sources.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Verified Knowledge Base</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {answer.sources.map((src, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs hover:border-amber-300 transition-colors flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                            {src.type || 'Official BIS Reference'}
                          </span>
                          {src.isNumber && (
                            <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              {src.isNumber}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {src.title}
                        </h4>

                        {src.section && (
                          <p className="text-[11px] text-slate-500 font-medium">
                            Reference: <span className="text-slate-800 font-semibold">{src.section}</span>
                          </p>
                        )}
                      </div>

                      {src.url && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-medium">Official Portal</span>
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 hover:underline"
                          >
                            <span>{src.url.replace('https://', '').replace('http://', '').split('/')[0]}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
