import React from 'react';
import { ShieldCheck, ExternalLink, HelpCircle, PhoneCall, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Branding & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <ShieldCheck className="w-5 h-5 text-slate-950" />
              </div>
              <span className="font-bold text-white text-base tracking-tight font-['Outfit']">
                BIS Assistant
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Understand BIS. Get the right information. Grounded AI platform providing reliable answers on Indian Standards, ISI mark, CRS, and Hallmarking for Indian industry and consumers.
            </p>
            <div className="text-[11px] text-amber-400 font-medium">
              Bureau of Indian Standards · National Standards Body
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('ask-bis')} className="hover:text-amber-400 transition-colors">Ask BIS Natural Query</button></li>
              <li><button onClick={() => onNavigate('standards')} className="hover:text-amber-400 transition-colors">Indian Standards Directory</button></li>
              <li><button onClick={() => onNavigate('services')} className="hover:text-amber-400 transition-colors">Certification Schemes Overview</button></li>
              <li><button onClick={() => onNavigate('consumer')} className="hover:text-amber-400 transition-colors">HUID Gold Verifier Tool</button></li>
              <li><button onClick={() => onNavigate('manufacturer')} className="hover:text-amber-400 transition-colors">MSME Fee Calculator</button></li>
            </ul>
          </div>

          {/* Col 3: Official BIS Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Official Resources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://www.bis.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>BIS Official Website</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.manakonline.in" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>e-BIS Portal (Manakonline)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.crsbis.in" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>CRS Electronics Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.hallmarking.bis.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>Gold Hallmarking Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Consumer Helpline */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Helpline & Support</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Toll Free: 1800-11-8001 / 14434</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>consumer@bis.gov.in</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>BIS Care App on PlayStore / AppStore</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © 2026 BIS AI Intelligent Assistant · Bureau of Indian Standards Official Digital Portal.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>BIS Act 2016 Compliant</span>
            <span>·</span>
            <span>Grounded RAG Architecture</span>
            <span>·</span>
            <span>Version 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
