import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { PageHeader, SectionCard, ProgressBar } from '@/components/ui';
import {
  Recycle, Trophy, Package, Leaf, Award, Smile,
} from 'lucide-react';
import { badges } from '@/data/recyclingData';

export default function ParentSustainability() {
  const { user } = useAuth();
  const { data } = useStore();

  const childId = user?.childId || 'STU001';
  const childName = 'Aarav Kumar';

  const points = data.studentEcoPoints[childId] || 0;
  const itemsRecycled = data.studentItemsRecycled[childId] || 0;
  const myCollections = data.collectionRequests.filter((r) => r.studentId === childId);
  const myHistory = data.recyclingHistory.filter((h) => h.studentId === childId);

  const breakdown = myHistory.reduce((acc, h) => {
    acc[h.wasteType] = (acc[h.wasteType] || 0) + h.quantity;
    return acc;
  }, {} as Record<string, number>);

  const earnedBadges = badges.filter((b) => {
    if (b.type === 'items') return itemsRecycled >= b.threshold;
    if (b.type === 'points') return points >= b.threshold;
    if (b.type === 'collection') return myCollections.length >= b.threshold;
    return false;
  });

  const ecoMessages = [
    "Great job! Your child is actively contributing to a cleaner planet.",
    "Every bottle recycled makes a difference. Keep encouraging your child!",
    "Your child is learning to be a responsible eco citizen.",
    "Recycling habits built today will last a lifetime!",
  ];
  const randomMessage = ecoMessages[Math.floor(Math.random() * ecoMessages.length)];

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Sustainability" subtitle={`${childName}'s recycling activity and eco achievements`} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="stat-card bg-gradient-to-br from-green-50 to-cyan-50 border-green-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Total Eco Points</p>
              <p className="text-2xl font-bold text-edu-green mt-1.5">{points}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-edu-green" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Items Recycled</p>
              <p className="text-2xl font-bold text-navy-800 mt-1.5">{itemsRecycled}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Recycle className="w-5 h-5 text-edu-blue" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Collections</p>
              <p className="text-2xl font-bold text-navy-800 mt-1.5">{myCollections.length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-edu-amber" />
            </div>
          </div>
        </div>
      </div>

      {/* Positive message */}
      <div className="card p-5 mb-4 bg-gradient-to-br from-green-50 to-cyan-50 border-green-100">
        <div className="flex items-center gap-3">
          <Smile className="w-8 h-8 text-edu-green shrink-0" />
          <div>
            <p className="text-sm font-semibold text-navy-800">Eco Achievement Update</p>
            <p className="text-xs text-gray-600 mt-0.5">{randomMessage}</p>
          </div>
        </div>
      </div>

      {/* Items breakdown */}
      <SectionCard title="Recycling Breakdown" subtitle={`Your child has recycled ${itemsRecycled} items`} className="mb-4">
        {Object.keys(breakdown).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(breakdown).map(([type, count]) => (
              <div key={type} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <Recycle className="w-5 h-5 text-edu-green" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy-800">{type}</p>
                  <p className="text-xs text-gray-400">{count} items recycled</p>
                </div>
                <span className="text-lg font-bold text-edu-green">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Leaf className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No recycling activity recorded yet</p>
          </div>
        )}
      </SectionCard>

      {/* Eco badges */}
      <SectionCard title="Eco Achievements" subtitle="Badges earned through recycling" className="mb-4">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {badges.map((badge) => {
            const earned = earnedBadges.includes(badge);
            return (
              <div key={badge.id} className={`rounded-xl p-3 text-center ${earned ? 'bg-gradient-to-br from-green-50 to-cyan-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-100 opacity-50'}`}>
                <div className={`text-2xl mb-1 ${earned ? '' : 'grayscale'}`}>{badge.icon}</div>
                <p className={`text-[10px] font-semibold ${earned ? 'text-navy-800' : 'text-gray-400'}`}>{badge.name}</p>
                {earned && <span className="text-[9px] text-edu-green font-bold">EARNED</span>}
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Collection history */}
      <SectionCard title="Collection History" subtitle="Track your child's collection requests">
        <div className="space-y-2">
          {myCollections.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-edu-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy-800 font-mono">{c.id}</p>
                <p className="text-xs text-gray-400">{c.wasteType} · {c.quantity} {c.unit} · {c.createdAt}</p>
              </div>
              <span className={`badge ${c.status === 'recycled' ? 'badge-green' : c.status === 'collected' || c.status === 'assigned' ? 'badge-blue' : 'badge-amber'}`}>
                {c.status}
              </span>
            </div>
          ))}
          {myCollections.length === 0 && (
            <div className="text-center py-6">
              <Award className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No collections yet</p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
