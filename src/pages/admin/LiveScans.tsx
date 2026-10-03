import { useState } from 'react';
import { Search, Filter, ScanLine, Download } from 'lucide-react';
import { liveScans } from '@/data/adminData';
import type { AdminScanRow } from '@/data/adminData';

const binConfig: Record<AdminScanRow['assignedBin'], { bg: string; text: string; dot: string }> = {
  'Recycling': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Organic': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'General Waste': { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' },
  'Hazardous': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
};

function confidenceColor(confidence: number) {
  if (confidence >= 90) return 'text-emerald-600';
  if (confidence >= 75) return 'text-amber-600';
  return 'text-red-500';
}

export default function AdminLiveScans() {
  const [search, setSearch] = useState('');
  const [binFilter, setBinFilter] = useState<string>('all');

  const filtered = liveScans.filter((scan) => {
    const matchesSearch =
      scan.userId.toLowerCase().includes(search.toLowerCase()) ||
      scan.detectedItem.toLowerCase().includes(search.toLowerCase());
    const matchesBin = binFilter === 'all' || scan.assignedBin === binFilter;
    return matchesSearch && matchesBin;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Live AI Scans</h2>
          <p className="text-sm text-slate-500 mt-0.5">Real-time waste identification feed from student devices</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            LIVE
          </span>
          <button className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student ID or detected item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={binFilter}
            onChange={(e) => setBinFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all bg-white"
          >
            <option value="all">All Bins</option>
            <option value="Recycling">Recycling</option>
            <option value="Organic">Organic</option>
            <option value="General Waste">General Waste</option>
            <option value="Hazardous">Hazardous</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Timestamp</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Student ID</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Detected Item</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Confidence</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Assigned Bin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <ScanLine className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">No scans match your filters</p>
                  </td>
                </tr>
              ) : (
                filtered.map((scan) => {
                  const bin = binConfig[scan.assignedBin];
                  return (
                    <tr key={scan.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-slate-600 font-mono">{scan.timestamp}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-medium text-slate-700">{scan.userId}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-slate-700">{scan.detectedItem}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${scan.confidence >= 90 ? 'bg-emerald-500' : scan.confidence >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${scan.confidence}%` }}
                            />
                          </div>
                          <span className={`text-sm font-semibold ${confidenceColor(scan.confidence)}`}>
                            {scan.confidence}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${bin.bg} ${bin.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${bin.dot}`} />
                          {scan.assignedBin}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {liveScans.length} scans
          </p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs font-medium text-slate-400 rounded-lg cursor-not-allowed" disabled>Prev</button>
            <button className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-500 rounded-lg">1</button>
            <button className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
