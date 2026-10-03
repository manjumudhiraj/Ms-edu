import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/ui';
import { Trophy, Crown, Medal, Leaf } from 'lucide-react';
import { leaderboardData } from '@/data/recyclingData';

type Filter = 'week' | 'month' | 'all';

export default function Leaderboard() {
  const { user } = useAuth();
  const sid = user?.studentId || 'STU005';
  const [filter, setFilter] = useState<Filter>('all');

  const multiplier: Record<Filter, number> = { week: 0.3, month: 0.6, all: 1 };
  const data = leaderboardData.map((s) => ({
    ...s,
    points: Math.round(s.points * multiplier[filter]),
    items: Math.round(s.items * multiplier[filter]),
  })).sort((a, b) => b.points - a.points).map((s, i) => ({ ...s, rank: i + 1 }));

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-edu-amber" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-700" />;
    return <span className="text-xs font-bold text-gray-400">{rank}</span>;
  };

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Eco Champions 🌱" subtitle="Top student recyclers making a difference" />

      <div className="flex gap-2 mb-4">
        {(['week', 'month', 'all'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              filter === f ? 'bg-edu-green text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {f === 'week' ? 'This Week' : f === 'month' ? 'This Month' : 'All Time'}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
        {[1, 0, 2].map((idx) => {
          const s = data[idx];
          if (!s) return <div key={idx} />;
          const isFirst = idx === 0;
          const isSecond = idx === 1;
          return (
            <div
              key={s.studentId}
              className={`card p-4 text-center ${isFirst ? 'order-2 -mt-2 border-2 border-amber-200' : isSecond ? 'order-1' : 'order-3'}`}
            >
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-lg font-bold mb-2 ${
                isFirst ? 'bg-amber-100 text-edu-amber' : isSecond ? 'bg-gray-100 text-gray-500' : 'bg-amber-50 text-amber-700'
              }`}>
                {s.rank}
              </div>
              <p className="text-xs font-semibold text-navy-800 truncate">{s.name}</p>
              <p className="text-lg font-bold text-edu-green mt-1">{s.points}</p>
              <p className="text-[10px] text-gray-400">points</p>
            </div>
          );
        })}
      </div>

      {/* Full leaderboard */}
      <div className="card p-4">
        <div className="space-y-1.5">
          {data.map((s) => (
            <div
              key={s.studentId}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                s.studentId === sid ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                {rankIcon(s.rank)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy-800 truncate">
                  {s.name} {s.studentId === sid && <span className="text-xs text-edu-green">(You)</span>}
                </p>
                <p className="text-xs text-gray-400">Class {s.class}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-edu-green">{s.points} pts</p>
                <p className="text-[10px] text-gray-400">{s.items} items</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
