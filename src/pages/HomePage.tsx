import React, { useState } from 'react';
import {
  Bot,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Calculator,
  Award,
  BookOpen,
  Building2,
  UserCheck,
  FileText,
  AlertCircle
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, query?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [quickQuery, setQuickQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      onNavigate('ask-bis', quickQuery.trim());
    }
  };

  const sampleQueries = [
    'What is BIS certification and how do I apply?',
    'Which Indian Standard applies to drinking water?',
    'How can MSMEs get a 50% discount on BIS fees?',
    'How to verify a 6-digit HUID gold hallmark code?',
    'What documents are required for CRS registration?'
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans']">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden py-16 lg:py-24 border-b border-slate-800">
        {/* Background glow accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Tag / Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-amber-400">
              <Bot className="w-4 h-4 text-amber-400" />
              <span>BIS INTELLIGENT ASSISTANT</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">Grounded AI Engine</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-['Outfit'] text-white text-balance leading-tight">
              Understand BIS. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                Get the right information.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed text-balance max-w-2xl mx-auto">
              Intelligent Indian Standards and BIS Services Assistant for Industry, MSMEs, Startups, and Consumers. Grounded, evidence-backed answers on IS standards, certification, hallmarking, and testing.
            </p>

            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-2 border-2 border-amber-500/30 focus-within:border-amber-500 transition-all">
                <Search className="w-6 h-6 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="Ask anything about BIS, IS standards, ISI mark, CRS, HUID, or testing..."
                  className="w-full px-3 py-3 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-md flex items-center gap-2 shrink-0"
                >
                  <span>Ask AI</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Quick Prompt Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
              <span className="text-slate-400 font-medium">Try asking:</span>
              {sampleQueries.slice(0, 3).map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigate('ask-bis', query)}
                  className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 px-3 py-1.5 rounded-lg transition-colors text-left truncate max-w-xs"
                >
                  "{query}"
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Trust Metrics Bar */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-3">
              <div className="text-3xl font-extrabold text-slate-900 font-['Outfit'] tabular-nums">22,000+</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Indian Standards (IS) Formulated</div>
            </div>
            <div className="p-3 pt-6 md:pt-3">
              <div className="text-3xl font-extrabold text-amber-600 font-['Outfit'] tabular-nums">40+</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Mandatory Certification Categories</div>
            </div>
            <div className="p-3 pt-6 md:pt-3">
              <div className="text-3xl font-extrabold text-slate-900 font-['Outfit'] tabular-nums">1,500+</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">BIS Recognized Testing Labs</div>
            </div>
            <div className="p-3 pt-6 md:pt-3">
              <div className="text-3xl font-extrabold text-blue-600 font-['Outfit'] tabular-nums">50% Off</div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Marking Fee Discount for MSMEs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Pillars Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
              Complete BIS Platform Capabilities
            </h2>
            <p className="text-slate-600 text-sm">
              Designed for consumers seeking genuine product verification, and industries navigating compliance, licensing, and testing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1: Ask BIS AI */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Ask BIS Intelligent Assistant</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Type complex questions in natural language. Get grounded answers backed by official Indian Standards, Gazette QCOs, and BIS Act regulations.
                </p>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Evidence-based citations & source links</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Short answers + detailed steps + fee notes</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('ask-bis')}
                className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Open Ask BIS AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pillar 2: Standards Explorer */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Indian Standards Explorer</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Search across popular Indian Standards (IS 10500, IS 14543, IS 1293, IS 2062, IS 13252). View scope, testing parameters, and international equivalents.
                </p>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Filter by department (Civil, Electrical, Food, IT)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Check mandatory vs voluntary QCO status</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('standards')}
                className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Explore Standards</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pillar 3: Consumer & MSME Tools */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Calculator className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">Consumer & MSME Portals</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Verify 6-digit HUID gold hallmarking codes, calculate 50% MSME fee discount savings, generate required application document checklists, and find testing labs.
                </p>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Interactive HUID Gold Purity Verifier</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Interactive MSME Fee Concession Calculator</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onNavigate('manufacturer')}
                className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Calculate Fee Savings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Recent Quality Control Orders (QCO) Announcement Box */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4" />
                  <span>Gazette QCO Updates 2026</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-['Outfit']">
                  Mandatory BIS Certification Expansion for MSMEs & Electronics
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Under the latest Quality Control Orders (QCOs), items including Packaged Drinking Water (IS 14543), Plugs & Sockets (IS 1293), Toys (IS 9873), and Structural Steel (IS 2062) require mandatory ISI / CRS certification before sale in India.
                </p>
              </div>
              <button
                onClick={() => onNavigate('services')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs shrink-0 transition-colors"
              >
                View Schemes & Compliance
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
