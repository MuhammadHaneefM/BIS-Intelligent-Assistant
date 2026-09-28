import React, { useState } from 'react';
import { BIS_STANDARDS_KNOWLEDGE, BISStandard } from '../data/bisKnowledgeBase';
import { Search, Filter, BookOpen, AlertCircle, ExternalLink, X, ShieldCheck } from 'lucide-react';

export const StandardsExplorerPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedStandard, setSelectedStandard] = useState<BISStandard | null>(null);

  const departments = ['All', 'Civil', 'Electrotechnical', 'Food & Agriculture', 'Electronics & IT', 'Metallurgy', 'Chemical'];

  const filteredStandards = BIS_STANDARDS_KNOWLEDGE.filter((std) => {
    const matchesSearch =
      std.isNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.scope.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'All' || std.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || std.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans'] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            <BookOpen className="w-3.5 h-3.5" />
            <span>National Standards Repository</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
            Indian Standards (IS) Directory
          </h1>
          <p className="text-slate-600 text-sm max-w-3xl">
            Explore quality specifications, testing parameters, and Quality Control Orders (QCOs) published by Bureau of Indian Standards across industries.
          </p>
        </div>

        {/* Filter Controls Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by IS number or keyword (e.g., IS 10500, steel, water)..."
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full py-2.5 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    Department: {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Certification Status Filter */}
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full py-2.5 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none"
              >
                <option value="All">All Certification Statuses</option>
                <option value="Mandatory">Mandatory QCO Orders</option>
                <option value="Voluntary">Voluntary Standards</option>
              </select>
            </div>

          </div>
        </div>

        {/* Standards Table Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStandards.map((std) => (
            <div
              key={std.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                    {std.isNumber}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      std.status === 'Mandatory'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {std.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-['Outfit'] leading-snug">
                  {std.title}
                </h3>

                <div className="text-xs text-slate-500 space-y-1">
                  <div>Department: <strong className="text-slate-800">{std.department}</strong></div>
                  <div>Category: <strong className="text-slate-800">{std.category}</strong></div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {std.scope}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Version: {std.versionDate}
                </span>
                <button
                  onClick={() => setSelectedStandard(std)}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  <span>View Details</span>
                  <BookOpen className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Standard Details Modal */}
        {selectedStandard && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <button
                onClick={() => setSelectedStandard(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <div className="inline-block font-mono text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded border border-amber-200">
                  {selectedStandard.isNumber}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-['Outfit']">
                  {selectedStandard.title}
                </h2>
                <div className="text-xs text-slate-500">
                  {selectedStandard.department} Department · {selectedStandard.category}
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">Standard Scope & Application:</div>
                  <p>{selectedStandard.scope}</p>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-slate-900">Key Quality Testing Parameters:</div>
                  <ul className="space-y-1.5 list-disc pl-5 text-slate-600">
                    {selectedStandard.keyParameters.map((param, idx) => (
                      <li key={idx}>{param}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900">QCO Order Status:</div>
                    <div className="text-slate-600 font-medium">{selectedStandard.gazetteOrder}</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">International ISO/IEC Alignment:</div>
                    <div className="text-slate-600 font-medium">{selectedStandard.isoEquivalent || 'National Standard'}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Clause Citation Reference: <strong>{selectedStandard.clauseReference}</strong>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <a
                  href={selectedStandard.sourceDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
                >
                  <span>Official e-BIS Document</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setSelectedStandard(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
