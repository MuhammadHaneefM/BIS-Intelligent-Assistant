import React, { useState } from 'react';
import { Building2, Calculator, CheckSquare, Search, FileText, CheckCircle2, ArrowRight, DollarSign, Download } from 'lucide-react';
import { BIS_LABS_KNOWLEDGE } from '../data/bisKnowledgeBase';

export const ManufacturerPage: React.FC = () => {
  // Calculator state
  const [enterpriseType, setEnterpriseType] = useState<'Micro' | 'Small' | 'Medium' | 'Large' | 'Woman' | 'Startup'>('Micro');
  const [productCategory, setProductCategory] = useState<'water' | 'steel' | 'electronics' | 'toys' | 'electrical'>('water');

  // Lab search state
  const [labDiscipline, setLabDiscipline] = useState('All');

  // Document checklist scheme selection
  const [selectedScheme, setSelectedScheme] = useState<'isi' | 'crs' | 'hallmarking' | 'fmcs'>('isi');

  // Fee calculation logic
  const feeBaseMap = {
    water: { app: 1000, inspect: 7000, marking: 50000 },
    steel: { app: 1000, inspect: 14000, marking: 120000 },
    electronics: { app: 50000, inspect: 0, marking: 0 }, // CRS flat registration
    toys: { app: 1000, inspect: 7000, marking: 30000 },
    electrical: { app: 1000, inspect: 7000, marking: 60000 }
  };

  const isConcessionEligible = ['Micro', 'Small', 'Woman', 'Startup'].includes(enterpriseType);
  const selectedBase = feeBaseMap[productCategory];

  const appFee = isConcessionEligible ? selectedBase.app * 0.5 : selectedBase.app;
  const inspectFee = selectedBase.inspect; // Inspection fee standard
  const markingFee = isConcessionEligible ? selectedBase.marking * 0.5 : selectedBase.marking;
  const totalPayable = appFee + inspectFee + markingFee;
  const totalSavings = (selectedBase.app + selectedBase.marking) * 0.5;

  const filteredLabs = BIS_LABS_KNOWLEDGE.filter((lab) => {
    return labDiscipline === 'All' || lab.disciplines.includes(labDiscipline);
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans'] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            <Building2 className="w-3.5 h-3.5" />
            <span>Industry & MSME Enablement Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
            Manufacturer & MSME Certification Portal
          </h1>
          <p className="text-slate-600 text-sm max-w-3xl">
            Calculate application fees with 50% MSME/Startup concessions, generate customized document checklists, and locate BIS recognized testing laboratories.
          </p>
        </div>

        {/* Tool 1: MSME Fee Concession Calculator */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                Interactive MSME Fee Concession Calculator
              </h2>
              <p className="text-xs text-slate-500">
                Calculate estimated application fees, minimum marking fees, and instant 50% discount savings for Micro, Small & Startup Enterprises.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Input Form */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Enterprise Classification:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'Micro', label: 'Micro Enterprise (50% Off)' },
                    { id: 'Small', label: 'Small Enterprise (50% Off)' },
                    { id: 'Startup', label: 'DPIIT Startup (50% Off)' },
                    { id: 'Woman', label: 'Woman-Owned Unit (50% Off)' },
                    { id: 'Medium', label: 'Medium Enterprise (Standard)' },
                    { id: 'Large', label: 'Large Industry (Standard)' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEnterpriseType(item.id as any)}
                      className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                        enterpriseType === item.id
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Product Standard Category:
                </label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value as any)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="water">Packaged Drinking Water (IS 14543 / IS 10500)</option>
                  <option value="steel">Structural TMT Steel & Bars (IS 1786 / IS 2062)</option>
                  <option value="electronics">IT Goods & Electronics CRS (IS 13252)</option>
                  <option value="toys">Toys Safety Specification (IS 9873)</option>
                  <option value="electrical">Plugs, Sockets & Motors (IS 1293 / IS 12615)</option>
                </select>
              </div>
            </div>

            {/* Calculated Fee Breakdown Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Calculated Tariff
                  </span>
                  {isConcessionEligible && (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                      50% Concession Applied
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs border-b border-slate-800 pb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Application Fee:</span>
                    <span className="font-mono font-bold">₹{appFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Audit / Inspection Fee:</span>
                    <span className="font-mono font-bold">₹{inspectFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Minimum Marking Fee:</span>
                    <span className="font-mono font-bold">₹{markingFee.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs text-slate-400 block">Total Estimated Fee:</span>
                  <div className="text-3xl font-extrabold text-amber-400 font-['Outfit'] tabular-nums">
                    ₹{totalPayable.toLocaleString()}
                  </div>
                </div>

                {isConcessionEligible && (
                  <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs">
                    🎉 Total Concession Savings: <strong>₹{totalSavings.toLocaleString()}</strong> under e-BIS MSE circular.
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-400">
                * Taxes (GST @ 18%) extra. Concession verified via Udyam Registration Certificate.
              </div>
            </div>

          </div>
        </div>

        {/* Tool 2: Customized Document Checklist Generator */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white font-bold flex items-center justify-center">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                  e-BIS Document Checklist Generator
                </h2>
                <p className="text-xs text-slate-500">
                  Select your scheme to generate a customized document audit checklist before applying on manakonline.in.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {[
                { id: 'isi', label: 'ISI Scheme-I' },
                { id: 'crs', label: 'CRS Electronics' },
                { id: 'hallmarking', label: 'Hallmarking' },
                { id: 'fmcs', label: 'FMCS Foreign' }
              ].map((sch) => (
                <button
                  key={sch.id}
                  onClick={() => setSelectedScheme(sch.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedScheme === sch.id
                      ? 'bg-slate-900 text-amber-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sch.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {selectedScheme === 'isi' && [
              'Factory Premises Proof (Ownership Deed / Registered Lease Deed)',
              'Business Registration (PAN, GST, Certificate of Incorporation)',
              'Manufacturing Machinery List with capacity and serial numbers',
              'Testing Equipment List with valid Calibration Certificates from NABL lab',
              'Quality Control Personnel Qualification & Appointment Letter',
              'Plant Layout Diagram showing manufacturing and testing sections',
              'Raw Material Test Certificates & Specifications',
              'Udyam MSME / DPIIT Startup Certificate for 50% Fee Discount'
            ].map((doc, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-800 font-medium">{doc}</span>
              </div>
            ))}

            {selectedScheme === 'crs' && [
              'Test Report from BIS Recognized Lab in India (within 90 days of test date)',
              'Authorized Indian Representative (AIR) Agreement & ID proof',
              'Brand Authorization letter from Brand Owner to Manufacturing Unit',
              'Factory Address Proof & Registration Certificate',
              'ISO 9001 Certificate of Manufacturing Premise',
              'Udyam MSME Certificate (for Indian MSE units)'
            ].map((doc, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-800 font-medium">{doc}</span>
              </div>
            ))}

            {selectedScheme === 'hallmarking' && [
              'GST Registration Certificate of Jewellery Establishment',
              'Aadhaar & PAN of Proprietor / Partners / Directors',
              'Proof of Jewellery Outlet / Premises Address',
              'Micro-Jeweller Self-Declaration (for zero fee waiver if turnover < ₹5 Cr)'
            ].map((doc, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-800 font-medium">{doc}</span>
              </div>
            ))}

            {selectedScheme === 'fmcs' && [
              'Foreign Manufacturing Unit Premises Registration Document',
              'Authorized Indian Representative (AIR) Appointment Deed',
              'Performance Bank Guarantee (USD 10,000)',
              'Factory Quality Control Manual & Instrument Calibration Logs'
            ].map((doc, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-800 font-medium">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tool 3: Testing Laboratory Directory */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                BIS Central & Recognized Testing Laboratories
              </h2>
              <p className="text-xs text-slate-500">
                Locate accredited testing facilities for sample clearance under IS standards.
              </p>
            </div>

            <select
              value={labDiscipline}
              onChange={(e) => setLabDiscipline(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="All">All Testing Disciplines</option>
              <option value="Chemical">Chemical Testing</option>
              <option value="Electrical">Electrical Testing</option>
              <option value="Mechanical">Mechanical Testing</option>
              <option value="Metallurgy">Metallurgy Testing</option>
              <option value="Electronics & IT">Electronics & IT Testing</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLabs.map((lab) => (
              <div key={lab.id} className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{lab.name}</span>
                  <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    {lab.type}
                  </span>
                </div>
                <div className="text-slate-600">{lab.location}</div>
                <div className="text-slate-500">
                  Disciplines: <strong className="text-slate-800">{lab.disciplines.join(', ')}</strong>
                </div>
                <div className="pt-2 border-t border-slate-200 text-slate-500 flex justify-between">
                  <span>Contact: {lab.contact}</span>
                  <span className="text-emerald-700 font-semibold">{lab.accreditation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
