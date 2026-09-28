import React from 'react';
import { Bot, Search, ShieldCheck, Sparkles, FileText, UserCheck, Building2, Info, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: ShieldCheck },
    { id: 'ask-bis', label: 'Ask BIS', icon: Bot, highlight: true },
    { id: 'standards', label: 'Standards Explorer', icon: Search },
    { id: 'services', label: 'BIS Services', icon: FileText },
    { id: 'consumer', label: 'Consumer', icon: UserCheck },
    { id: 'manufacturer', label: 'Manufacturer / MSME', icon: Building2 },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top Gazette / Helpline Banner */}
      <div className="bg-slate-950 px-4 py-1 text-xs border-b border-slate-800/80 text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden whitespace-nowrap">
          <span className="text-amber-400 font-bold text-[11px] tracking-wider uppercase shrink-0">
            OFFICIAL PORTAL
          </span>
          <span className="text-slate-600 font-bold shrink-0">·</span>
          <span className="truncate text-slate-400">
            Indian Standards & BIS Services Portal · Bureau of Indian Standards
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-400 shrink-0 text-[12px]">
          <span>Helpline: <strong className="text-white">1800-11-8001</strong></span>
          <span className="text-slate-600">|</span>
          <span>e-BIS: <a href="https://www.manakonline.in" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">manakonline.in</a></span>
        </div>
      </div>

      {/* Main Top Bar Contract: Brand | Links | Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Mark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform">
            <Bot className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-white font-['Outfit']">
              <span>BIS Assistant</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium -mt-0.5">
              Bureau of Indian Standards
            </div>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700/60 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.highlight && <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => onNavigate('ask-bis')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span>Ask BIS AI</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
