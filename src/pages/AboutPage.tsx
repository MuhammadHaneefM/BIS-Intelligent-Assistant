import React from 'react';
import { Info, ShieldCheck, Bot, FileText, CheckCircle2, Award, ExternalLink } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans'] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            <Info className="w-3.5 h-3.5" />
            <span>NATIONAL STANDARDS BODY DIGITAL SERVICE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit']">
            About BIS Intelligent Assistant
          </h1>
          <p className="text-slate-600 text-sm">
            AI-powered Intelligent Assistant for Indian Standards and BIS Services for Industries, MSMEs, and Consumers.
          </p>
        </div>

        {/* Objective Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Bot className="w-4 h-4" />
            <span>Digital Service Mandate</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Outfit']">
            Democratizing Indian Standards Access through Grounded Artificial Intelligence
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            The Bureau of Indian Standards (BIS) formulates Indian Standards across civil, mechanical, electrical, chemical, electronics, and consumer product sectors. Navigating thousands of standards, Quality Control Orders (QCOs), licensing requirements, and HUID hallmarking rules can be complex for MSMEs and consumers. This AI Assistant bridges the gap by translating natural language queries into grounded, evidence-based answers backed by official citations.
          </p>
        </div>

        {/* Architecture & Core Guarantees */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
            Key Engineering Pillars of the Platform
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Grounded Retrieval-Augmented Generation</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Rather than unconstrained generic text generation, responses are strictly grounded in an indexed BIS knowledge repository containing IS metadata, QCO orders, fee schedules, and testing guidelines.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Citation & Source Evidence Cards</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Every knowledge-based answer displays its supporting clause, standard number, Gazette order, and official e-BIS source URL, ensuring full transparency.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Ungrounded Safeguard Handling</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                If the query requests information not supported by available evidence, the system explicitly informs the user that information could not be found instead of hallucinating answers.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-2 text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>MSME & Consumer Centric Tools</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Includes interactive tools for 6-digit HUID Gold Hallmarking verification, MSME 50% fee discount calculations, and e-BIS document checklists.
              </p>
            </div>
          </div>
        </div>

        {/* BIS Act 2016 Mandate */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm">
          <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
            Bureau of Indian Standards (BIS) Overview
          </h2>
          <p className="text-slate-700 leading-relaxed">
            The Bureau of Indian Standards (BIS) is the National Standards Body of India functioning under the aegis of the Ministry of Consumer Affairs, Food & Public Distribution, Government of India. It was established by the Bureau of Indian Standards Act 2016.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <a
              href="https://www.bis.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-amber-700 hover:underline font-bold flex items-center gap-1 text-xs"
            >
              <span>Visit Official Bureau of Indian Standards Portal (bis.gov.in)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
