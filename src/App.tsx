/**
 * Bureau of Indian Standards (BIS) Official Digital Services Portal
 * AI-powered Intelligent Assistant for Indian Standards and BIS Services
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AskBisPage } from './pages/AskBisPage';
import { StandardsExplorerPage } from './pages/StandardsExplorerPage';
import { BisServicesPage } from './pages/BisServicesPage';
import { ConsumerPage } from './pages/ConsumerPage';
import { ManufacturerPage } from './pages/ManufacturerPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [askBisQuery, setAskBisQuery] = useState<string>('');

  const handleNavigate = (page: string, query?: string) => {
    setAskBisQuery(query || '');
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans']">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'ask-bis' && <AskBisPage initialQuery={askBisQuery} />}
        {currentPage === 'standards' && <StandardsExplorerPage />}
        {currentPage === 'services' && <BisServicesPage onNavigate={handleNavigate} />}
        {currentPage === 'consumer' && <ConsumerPage />}
        {currentPage === 'manufacturer' && <ManufacturerPage />}
        {currentPage === 'about' && <AboutPage />}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
