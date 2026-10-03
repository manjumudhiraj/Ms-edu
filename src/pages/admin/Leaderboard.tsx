import {
  Trophy, Medal, Award, TrendingUp, TrendingDown, Minus,
  Building2, Home, MapPin, ScanLine,
} from 'lucide-react';
import { campusLeaderboard } from '@/data/adminData';
import type { LeaderboardEntry } from '@/data/adminData';

const rankConfig: Record<number, { icon: typeof Trophy; bg: string; text: string; ring: string; label: string }> = {
  1: { icon: Medal, bg: 'bg-gradient-to-br from-amber-400 to-amber-500', text: 'text-amber-600', ring: 'ring-amber-200', label: 'Gold' },
  2: { icon: Medal, bg: 'bg-gradient-to-br from-slate-300 to-slate-400', text: 'text-slate-600', ring: 'ring-slate-200', label: 'Silver' },
  3: { icon: Medal, bg: 'bg-gradient-to-br from-orange-400 to-orange-600', text: 'text-orange-600', ring: 'ring-orange-200', label: 'Bronze' },
};

const typeConfig: Record<LeaderboardEntry['type'], { icon: typeof Building2; label: string }> = {
  Hostel: { icon: Home, label: 'Hostel' },
  Block: { icon: Building2, label: 'Block' },
  Ward: { icon: MapPin, label: 'Ward' },
};

function TrendIcon({ trend }: { trend: LeaderboardEntry['trend'] }) {
  if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
  if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-red-500" />;
  return <Minus className="w-3.5 h-3.5 text-slate-400" />;
}

export default function AdminLeaderboard() {
  const top3 = campusLeaderboard.slice(0, 3);
  const rest = campusLeaderboard.slice(3);
  const maxPoints = campusLeaderboard[0].ecoPoints;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Campus Leaderboard</h2>
        <p className="text-sm text-slate-500 mt-0.5">Rankings by Eco Points and segregation accuracy across hostels, blocks, and wards</p>
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Reorder for visual: 2nd, 1st, 3rd on desktop */}
        {[
          { entry: top3[1], order: 'sm:order-1', height: 'sm:mt-8' },
          { entry: top3[0], order: 'sm:order-2', height: '' },
          { entry: top3[2], order: 'sm:order-3', height: 'sm:mt-8' },
        ].map(({ entry, order, height }) => {
          const rank = rankConfig[entry.rank];
          const RankIcon = rank.icon;
          const TypeIcon = typeConfig[entry.type].icon;
          return (
            <div key={entry.rank} className={`${order} ${height}`}>
              <div className={`bg-white rounded-xl border-2 shadow-sm p-5 text-center ring-4 ${rank.ring} ${
                entry.rank === 1 ? 'border-amber-300' : entry.rank === 2 ? 'border-slate-300' : 'border-orange-300'
              }`}>
                <div className={`w-14 h-14 ${rank.bg} rounded-2xl flex items-center justify-center shadow-md mx-auto mb-3`}>
                  <RankIcon className="w-7 h-7 text-white" />
                </div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Rank #{entry.rank} · {rank.label}</p>
                <p className="text-base font-bold text-slate-900 mt-1">{entry.name}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-slate-500 mt-1">
                  <TypeIcon className="w-3.5 h-3.5" />
                  {typeConfig[entry.type].label === 'Hostel' ? 'Hostel' : typeConfig[entry.type].label === 'Block' ? 'University Block' : 'City Ward'}
                </div>
                <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{entry.ecoPoints.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-medium">Eco Points</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div>
                    <p className="text-lg font-bold text-emerald-600">{entry.segregationAccuracy}%</p>
                    <p className="text-[10px] text-slate-400 uppercase font-medium">Accuracy</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full ranking table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Full Rankings</h3>
          <span className="text-xs text-slate-500">{campusLeaderboard.length} zones ranked</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Rank</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Type</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Eco Points</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Segregation Accuracy</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Total Scans</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Top 3 rows with medal badges */}
              {top3.map((entry) => {
                const rank = rankConfig[entry.rank];
                const RankIcon = rank.icon;
                const TypeIcon = typeConfig[entry.type].icon;
                return (
                  <tr key={entry.rank} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className={`w-8 h-8 ${rank.bg} rounded-lg flex items-center justify-center`}>
                        <RankIcon className="w-4 h-4 text-white" />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-slate-900">{entry.name}</span>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <TypeIcon className="w-3.5 h-3.5" />
                        {typeConfig[entry.type].label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-slate-900">{entry.ecoPoints.toLocaleString()}</span>
                      <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(entry.ecoPoints / maxPoints) * 100}%` }} />
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`text-sm font-semibold ${entry.segregationAccuracy >= 90 ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {entry.segregationAccuracy}%
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-sm text-slate-600">
                        <ScanLine className="w-3.5 h-3.5 text-slate-400" />
                        {entry.scans.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <TrendIcon trend={entry.trend} />
                    </td>
                  </tr>
                );
              })}
              {/* Remaining rows */}
              {rest.map((entry) => {
                const TypeIcon = typeConfig[entry.type].icon;
                return (
                  <tr key={entry.rank} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-slate-400 inline-flex items-center justify-center w-8 h-8">#{entry.rank}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-700">{entry.name}</span>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <TypeIcon className="w-3.5 h-3.5" />
                        {typeConfig[entry.type].label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-slate-700">{entry.ecoPoints.toLocaleString()}</span>
                      <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(entry.ecoPoints / maxPoints) * 100}%` }} />
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`text-sm font-semibold ${entry.segregationAccuracy >= 90 ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {entry.segregationAccuracy}%
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-sm text-slate-600">
                        <ScanLine className="w-3.5 h-3.5 text-slate-400" />
                        {entry.scans.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <TrendIcon trend={entry.trend} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-xl border border-emerald-200 p-5">
        <div className="flex items-center gap-3 mb-3">
          <Award className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">This Week's Highlights</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Top Performer</p>
            <p className="font-semibold text-slate-900">{top3[0].name}</p>
            <p className="text-xs text-emerald-600 mt-0.5">{top3[0].ecoPoints.toLocaleString()} eco points · {top3[0].segregationAccuracy}% accuracy</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Most Improved</p>
            <p className="font-semibold text-slate-900">Library Plaza</p>
            <p className="text-xs text-emerald-600 mt-0.5">+18% accuracy this week</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Needs Attention</p>
            <p className="font-semibold text-slate-900">Ward 7 — Terminal</p>
            <p className="text-xs text-amber-600 mt-0.5">Segregation accuracy at 75%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
