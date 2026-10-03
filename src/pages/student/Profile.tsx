import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { PageHeader, SectionCard } from '@/components/ui';
import { Recycle, Package, Award, Mail, IdCard, GraduationCap } from 'lucide-react';
import { badges } from '@/data/recyclingData';

export default function StudentProfile() {
  const { user } = useAuth();
  const { data } = useStore();
  const sid = user?.studentId || 'STU005';

  const points = data.studentEcoPoints[sid] || 0;
  const itemsRecycled = data.studentItemsRecycled[sid] || 0;
  const myCollections = data.collectionRequests.filter((r) => r.studentId === sid);
  const myHistory = data.recyclingHistory.filter((h) => h.studentId === sid);
  const scanCount = data.studentScanCount[sid] || 0;

  const earnedBadges = badges.filter((b) => {
    if (b.type === 'scan') return scanCount >= b.threshold;
    if (b.type === 'collection') return myCollections.length >= b.threshold;
    if (b.type === 'items') return itemsRecycled >= b.threshold;
    if (b.type === 'points') return points >= b.threshold;
    return false;
  });

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Profile" subtitle="Your student profile and achievements" />

      {/* Profile header */}
      <div className="card p-6 mb-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-edu-blue to-edu-cyan flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-navy-800">{user?.name}</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 text-xs text-gray-500">
              <span className="flex items-center gap-1"><IdCard className="w-3.5 h-3.5" /> {sid}</span>
              <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> Class 8-A</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user?.email}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-edu-green">{points}</p>
              <p className="text-xs text-gray-400">Eco Points</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-edu-blue">{itemsRecycled}</p>
              <p className="text-xs text-gray-400">Items Recycled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <SectionCard title="Achievement Badges" className="mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {badges.map((badge) => {
            const earned = earnedBadges.includes(badge);
            return (
              <div key={badge.id} className={`rounded-xl p-4 text-center ${earned ? 'bg-gradient-to-br from-green-50 to-cyan-50 border-2 border-green-200' : 'bg-gray-50 border-2 border-gray-100 opacity-50'}`}>
                <div className={`text-3xl mb-1 ${earned ? '' : 'grayscale'}`}>{badge.icon}</div>
                <p className={`text-xs font-semibold ${earned ? 'text-navy-800' : 'text-gray-400'}`}>{badge.name}</p>
                {earned && <span className="inline-block text-[9px] text-edu-green font-bold mt-1">EARNED</span>}
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Collection history */}
      <SectionCard title="Collection History" className="mb-4">
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
              <span className={`badge ${c.status === 'recycled' ? 'badge-green' : c.status === 'collected' ? 'badge-blue' : c.status === 'assigned' ? 'badge-blue' : 'badge-amber'}`}>
                {c.status}
              </span>
            </div>
          ))}
          {myCollections.length === 0 && (
            <div className="text-center py-6">
              <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No collections yet</p>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Recycling history */}
      <SectionCard title="Recycling Activity">
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
            <div className="text-center py-6">
              <Award className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-400">No recycling activity yet</p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
