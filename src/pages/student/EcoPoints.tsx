import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { PageHeader, SectionCard } from '@/components/ui';
import { Trophy, Recycle, Award, Star, Calendar } from 'lucide-react';
import { badges } from '@/data/recyclingData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function EcoPoints() {
  const { user } = useAuth();
  const { data } = useStore();
  const sid = user?.studentId || 'STU005';

  const totalPoints = data.studentEcoPoints[sid] || 0;
  const totalItems = data.studentItemsRecycled[sid] || 0;
  const myHistory = data.recyclingHistory.filter((h) => h.studentId === sid);

  const weeklyPoints = myHistory
    .filter((h) => new Date(h.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .reduce((a, h) => a + h.points, 0);
  const monthlyPoints = myHistory
    .filter((h) => new Date(h.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .reduce((a, h) => a + h.points, 0);

  const pointsByType = myHistory.reduce((acc, h) => {
    const existing = acc.find((a) => a.wasteType === h.wasteType);
    if (existing) existing.points += h.points;
    else acc.push({ wasteType: h.wasteType, points: h.points });
    return acc;
  }, [] as { wasteType: string; points: number }[]);

  const earnedBadges = badges.filter((b) => {
    if (b.type === 'scan') return (data.studentScanCount[sid] || 0) >= b.threshold;
    if (b.type === 'collection') return data.collectionRequests.filter((r) => r.studentId === sid).length >= b.threshold;
    if (b.type === 'items') return totalItems >= b.threshold;
    if (b.type === 'points') return totalPoints >= b.threshold;
    return false;
  });

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Eco Points" subtitle="Your recycling achievements and gamification" />

      {/* Points summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="stat-card bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Total Points</p>
              <p className="text-3xl font-bold text-edu-amber mt-1">{totalPoints}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-edu-amber" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Weekly Points</p>
              <p className="text-3xl font-bold text-edu-green mt-1">{weeklyPoints}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-edu-green" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Monthly Points</p>
              <p className="text-3xl font-bold text-edu-blue mt-1">{monthlyPoints}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Star className="w-6 h-6 text-edu-blue" />
            </div>
          </div>
        </div>
      </div>

      {/* Points breakdown chart */}
      {pointsByType.length > 0 && (
        <SectionCard title="Points by Waste Type" className="mb-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pointsByType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="wasteType" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="points" fill="#16a34a" radius={[6, 6, 0, 0]} barSize={32} name="Points" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      )}

      {/* Badges */}
      <SectionCard title="Achievement Badges" className="mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {badges.map((badge) => {
            const earned = earnedBadges.includes(badge);
            return (
              <div key={badge.id} className={`rounded-xl p-4 text-center transition-all ${earned ? 'bg-gradient-to-br from-green-50 to-cyan-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-100 opacity-60'}`}>
                <div className={`text-3xl mb-2 ${earned ? '' : 'grayscale'}`}>{badge.icon}</div>
                <p className={`text-xs font-semibold ${earned ? 'text-navy-800' : 'text-gray-400'}`}>{badge.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{badge.description}</p>
                {earned && <span className="inline-block mt-1.5 text-[10px] text-edu-green font-bold">EARNED</span>}
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Recycling history */}
      <SectionCard title="Recycling History">
        <div className="space-y-2">
          {myHistory.map((h) => (
            <div key={h.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                <Recycle className="w-4 h-4 text-edu-green" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy-800">{h.wasteType} ×{h.quantity}</p>
                <p className="text-xs text-gray-400">{h.date}</p>
              </div>
              <span className="text-sm font-bold text-edu-amber shrink-0">+{h.points} pts</span>
            </div>
          ))}
          {myHistory.length === 0 && (
            <div className="text-center py-8">
              <Award className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No recycling activity yet</p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
