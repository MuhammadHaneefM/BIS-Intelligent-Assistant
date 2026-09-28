import React from 'react';
import { BIS_SCHEMES_KNOWLEDGE } from '../data/bisKnowledgeBase';
import { ShieldCheck, FileText, CheckCircle2, ArrowRight, ExternalLink, Award, Building2, UserCheck } from 'lucide-react';

interface BisServicesPageProps {
  onNavigate: (page: string) => void;
}

export const BisServicesPage: React.FC<BisServicesPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans'] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
            <FileText className="w-3.5 h-3.5" />
            <span>Conformity Assessment Framework</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
            BIS Certification Schemes & Services
          </h1>
          <p className="text-slate-600 text-sm max-w-3xl">
            Comprehensive breakdown of Bureau of Indian Standards certification schemes, registration processes, fee structure, and MSME concessions under BIS Act 2016.
          </p>
        </div>

        {/* Schemes Cards Grid */}
        <div className="space-y-8">
          {BIS_SCHEMES_KNOWLEDGE.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 uppercase tracking-wider">
                    {scheme.code}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 font-['Outfit'] mt-2">
                    {scheme.name}
                  </h2>
                </div>
                <div className="text-right sm:text-right">
                  <div className="text-xs text-slate-500 font-medium">Certification Mark</div>
                  <div className="text-sm font-extrabold text-slate-900 font-['Outfit']">
                    {scheme.markName}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {scheme.overview}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Eligibility & Scope
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {scheme.eligibility.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Required Documentation
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {scheme.keyDocumentsRequired.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Step-by-Step Flow */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Step-by-Step Registration Workflow
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {scheme.processSteps.map((step, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                        <div className="font-bold text-amber-600">Step {idx + 1}</div>
                        <p className="leading-snug">{step.replace(/^\d+\.\s*/, '')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fees and MSME Concession */}
                <div className="bg-amber-50/80 border border-amber-200 text-amber-950 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <strong className="block text-amber-900 font-bold">Fee Structure:</strong>
                    <span>{scheme.feeOverview}</span>
                  </div>
                  <div className="bg-white px-3 py-2 rounded-lg border border-amber-300 text-amber-900 font-semibold shrink-0">
                    💡 MSME Benefit: {scheme.msmeConcession}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <a
                  href={scheme.sourceDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-700 hover:underline font-bold flex items-center gap-1"
                >
                  <span>Official e-BIS Portal Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onNavigate('manufacturer')}
                  className="bg-slate-900 text-white hover:bg-slate-800 font-bold px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <span>Calculate Application Fees</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
