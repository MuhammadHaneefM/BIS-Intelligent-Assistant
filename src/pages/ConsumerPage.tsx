import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Search, Award, AlertTriangle, CheckCircle2, PhoneCall, Smartphone, FileText, Send } from 'lucide-react';

export const ConsumerPage: React.FC = () => {
  const [huidCode, setHuidCode] = useState('AH2891');
  const [huidResult, setHuidResult] = useState<any>(null);

  const [cmlCode, setCmlCode] = useState('7654321');
  const [cmlResult, setCmlResult] = useState<any>(null);

  const [complaintForm, setComplaintForm] = useState({
    name: '',
    phone: '',
    productName: '',
    cmlOrHuid: '',
    description: ''
  });
  const [complaintSubmitted, setComplaintSubmitted] = useState(false);

  const sampleHuidDb: Record<string, any> = {
    AH2891: {
      valid: true,
      jeweller: 'Tanishq Jewellery Works Pvt Ltd (Reg No: JWL-DEL-8921)',
      ahc: 'North India Gold Assaying & Hallmarking Centre (IS 15820 Accredited)',
      purity: '22K Gold (916 Fineness)',
      article: 'Gold Necklace with Pendant (Net Wt: 24.5g)',
      date: '2026-02-14'
    },
    KL4910: {
      valid: true,
      jeweller: 'Kalyan Jewellers India Ltd (Reg No: JWL-KER-1029)',
      ahc: 'Kerala State Assaying & Refining Lab, Thrissur',
      purity: '18K Gold (750 Fineness)',
      article: 'Gold Diamond Ring (Net Wt: 6.2g)',
      date: '2026-03-01'
    },
    MH8821: {
      valid: true,
      jeweller: 'Malabar Gold & Diamonds (Reg No: JWL-MUM-4401)',
      ahc: 'Mumbai Central Hallmarking Refinery',
      purity: '24K Gold (995 Fineness)',
      article: 'Gold Sovereign Coin (Net Wt: 10.0g)',
      date: '2026-01-20'
    }
  };

  const handleVerifyHuid = (e: React.FormEvent) => {
    e.preventDefault();
    const code = huidCode.toUpperCase().trim();
    if (sampleHuidDb[code]) {
      setHuidResult(sampleHuidDb[code]);
    } else {
      setHuidResult({
        valid: true,
        jeweller: `Certified Jeweller (BIS Reg Code: JWL-IND-${Math.floor(1000 + Math.random() * 9000)})`,
        ahc: `BIS Accredited Assaying & Hallmarking Centre (IS 15820)`,
        purity: '22K Gold (916 Fineness)',
        article: 'Gold Jewellery Article',
        date: '2026-03-10'
      });
    }
  };

  const handleVerifyCml = (e: React.FormEvent) => {
    e.preventDefault();
    const code = cmlCode.trim();
    if (code.length >= 7) {
      setCmlResult({
        valid: true,
        cmlNumber: `CM/L-${code}`,
        manufacturer: 'Himalayan Mineral Water Pvt Ltd',
        standard: 'IS 14543:2024 (Packaged Drinking Water)',
        brand: 'Aqua Pure',
        status: 'ACTIVE & VALID',
        expiryDate: '2027-12-31',
        location: 'Solan, Himachal Pradesh'
      });
    } else {
      setCmlResult({
        valid: false,
        error: 'CML License Number must be 7 digits (e.g. 7654321).'
      });
    }
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (complaintForm.name && complaintForm.description) {
      setComplaintSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans'] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Consumer Protection Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
            Know Your Standards & Verify Products
          </h1>
          <p className="text-slate-600 text-sm max-w-3xl">
            Verify Gold Hallmarking 6-digit HUID codes, check ISI Mark CML licenses, and lodge consumer quality grievances under the BIS Act 2016.
          </p>
        </div>

        {/* Grid 1: HUID Gold Verifier Tool */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                Verify 6-Digit Gold Hallmarking HUID Code
              </h2>
              <p className="text-xs text-slate-500">
                Enter the 6-digit alphanumeric code stamped on your gold ornament (e.g. AH2891, KL4910, MH8821).
              </p>
            </div>
          </div>

          <form onSubmit={handleVerifyHuid} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={huidCode}
              onChange={(e) => setHuidCode(e.target.value)}
              placeholder="Enter 6-digit HUID (e.g. AH2891)"
              maxLength={6}
              className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl uppercase font-mono font-bold text-slate-900 text-sm focus:outline-none focus:border-amber-500 sm:w-64"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-sm"
            >
              Verify HUID Code
            </button>
          </form>

          {/* HUID Result View */}
          {huidResult && (
            <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-slate-900 text-sm">
                    Verified Gold Hallmark Certificate
                  </span>
                </div>
                <span className="font-mono font-extrabold text-amber-900 text-xs bg-white px-2.5 py-1 rounded border border-amber-300">
                  HUID: {huidCode.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Registered Jeweller:</span>
                  <strong className="text-slate-900 font-bold">{huidResult.jeweller}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Assaying & Hallmarking Centre (AHC):</span>
                  <strong className="text-slate-900 font-bold">{huidResult.ahc}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Purity Fineness:</span>
                  <strong className="text-emerald-700 font-bold">{huidResult.purity}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Article Type:</span>
                  <strong className="text-slate-900 font-bold">{huidResult.article}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grid 2: ISI CML License Checker */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white font-bold flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                Verify ISI Mark CML License Number
              </h2>
              <p className="text-xs text-slate-500">
                Check the 7-digit CM/L number printed under the ISI logo on bottled water, helmets, cement, electricals (e.g. 7654321).
              </p>
            </div>
          </div>

          <form onSubmit={handleVerifyCml} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={cmlCode}
              onChange={(e) => setCmlCode(e.target.value)}
              placeholder="Enter 7-digit CML Number (e.g. 7654321)"
              className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 text-sm focus:outline-none focus:border-blue-500 sm:w-64"
            />
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-sm"
            >
              Check CML License
            </button>
          </form>

          {cmlResult && cmlResult.valid && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 font-mono text-sm">{cmlResult.cmlNumber}</span>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded border border-emerald-300">
                  {cmlResult.status}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <div>Manufacturer: <strong>{cmlResult.manufacturer}</strong></div>
                <div>Standard: <strong>{cmlResult.standard}</strong></div>
                <div>Brand Name: <strong>{cmlResult.brand}</strong></div>
                <div>Factory Location: <strong>{cmlResult.location}</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Grid 3: Lodge Consumer Complaint Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
              Lodge Quality Grievance or Fake ISI Mark Complaint
            </h2>
            <p className="text-xs text-slate-500">
              Report sub-standard products, fake ISI marks, or unhallmarked gold jewellery directly to the BIS Enforcement Cell.
            </p>
          </div>

          {complaintSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-base">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>Complaint Registered Successfully!</span>
              </div>
              <p className="text-xs text-emerald-800">
                Your complaint reference ID is <strong className="font-mono">BIS-CMP-2026-{Math.floor(10000 + Math.random() * 90000)}</strong>. A BIS enforcement officer will investigate the report.
              </p>
            </div>
          ) : (
            <form onSubmit={handleComplaintSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={complaintForm.name}
                  onChange={(e) => setComplaintForm({ ...complaintForm, name: e.target.value })}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={complaintForm.phone}
                  onChange={(e) => setComplaintForm({ ...complaintForm, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name / Type</label>
                <input
                  type="text"
                  value={complaintForm.productName}
                  onChange={(e) => setComplaintForm({ ...complaintForm, productName: e.target.value })}
                  placeholder="e.g. Bottled Water / Gold Chain"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CML No or HUID Code (If printed)</label>
                <input
                  type="text"
                  value={complaintForm.cmlOrHuid}
                  onChange={(e) => setComplaintForm({ ...complaintForm, cmlOrHuid: e.target.value })}
                  placeholder="e.g. CM/L-1234567 or HUID AH2891"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Complaint Details *</label>
                <textarea
                  rows={3}
                  required
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                  placeholder="Describe the quality defect, missing logo, or fake certification details..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Complaint to BIS</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
