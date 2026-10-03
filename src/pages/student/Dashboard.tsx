import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { PageHeader } from '@/components/ui';
import { Link } from 'react-router-dom';
import {
  Recycle, Trophy, Package, Camera, BookMarked, Leaf, Award, TrendingUp, ImageIcon,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { monthlyPlasticData, leaderboardData } from '@/data/recyclingData';
import { wasteItems } from '@/data/recyclingData';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data } = useStore();
  const sid = user?.studentId || 'STU005';

  const points = data.studentEcoPoints[sid] || 0;
  const itemsRecycled = data.studentItemsRecycled[sid] || 0;
  const pendingCollections = data.collectionRequests.filter(
    (r) => r.studentId === sid && r.status !== 'recycled'
  ).length;
  const myScans = data.scanRecords.filter((s) => s.studentId === sid);

  const rank = leaderboardData.find((s) => s.studentId === sid)?.rank || 8;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  const stats = [
    { label: 'Bottles Recycled', value: itemsRecycled, icon: Recycle, color: 'text-edu-green', bg: 'bg-green-50' },
    { label: 'Recycling Points', value: points, icon: Trophy, color: 'text-edu-amber', bg: 'bg-amber-50' },
    { label: 'Pending Collections', value: pendingCollections, icon: Package, color: 'text-edu-blue', bg: 'bg-blue-50' },
    { label: 'Sustainability Rank', value: `#${rank}`, icon: Award, color: 'text-edu-cyan', bg: 'bg-cyan-50' },
  ];

  const actions = [
    { label: 'Scan Waste', path: '/student/scan', icon: Camera, color: 'from-edu-blue to-edu-cyan' },
    { label: 'Request Collection', path: '/student/collections', icon: Package, color: 'from-edu-green to-edu-lightgreen' },
    { label: 'My Recycling History', path: '/student/eco-points', icon: Trophy, color: 'from-edu-amber to-yellow-400' },
    { label: 'Learn Recycling', path: '/student/learn', icon: BookMarked, color: 'from-edu-cyan to-blue-400' },
  ];

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader
        title={`${greeting}, ${user?.name?.split(' ').slice(0, 1)[0] || 'Student'} 👋`}
        subtitle={`Class 8-A · Student ID: ${sid}`}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</p>
                <p className="text-2xl font-bold text-navy-800 mt-1.5">{s.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick action buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {actions.map((a) => (
          <Link
            key={a.label}
            to={a.path}
            className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${a.color} text-white shadow-edu transition-all hover:shadow-edu-lg hover:-translate-y-0.5 animate-slide-up`}
          >
            <a.icon className="w-7 h-7 mb-2 opacity-90" />
            <p className="text-sm font-bold">{a.label}</p>
          </Link>
        ))}
      </div>

      {/* Charts + leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-navy-800 mb-4">Monthly Plastic Collected (kg)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyPlasticData}>
              <defs>
                <linearGradient id="plasticGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="plastic" stroke="#16a34a" fill="url(#plasticGrad)" strokeWidth={2} name="Plastic (kg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-navy-800 mb-4 flex items-center gap-2">
            <Leaf className="w-4 h-4 text-edu-green" /> Top Eco Champions
          </h3>
          <div className="space-y-2">
            {leaderboardData.slice(0, 5).map((s) => (
              <div key={s.studentId} className={`flex items-center gap-2.5 p-2.5 rounded-xl ${s.studentId === sid ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${s.rank <= 3 ? 'bg-amber-100 text-edu-amber' : 'bg-gray-100 text-gray-500'}`}>
                  {s.rank}
                </span>
                <span className="text-sm font-medium text-navy-800 flex-1 truncate">{s.name}</span>
                <span className="text-xs font-semibold text-edu-green">{s.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scan history */}
      {myScans.length > 0 && (
        <div className="card p-5 mb-4">
          <h3 className="text-sm font-semibold text-navy-800 mb-4 flex items-center gap-2">
            <Camera className="w-4 h-4 text-edu-blue" /> My Scan History
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myScans.slice(0, 6).map((scan) => {
              const item = wasteItems[scan.category];
              return (
                <div key={scan.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <img src={scan.imageDataUrl} alt="scanned waste" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy-800 truncate">{scan.wasteType}</p>
                    <p className="text-xs text-gray-400">{scan.material} · {scan.date}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {scan.recyclable ? (
                        <span className="badge-green badge text-[10px]"><Recycle className="w-2.5 h-2.5" /> Recyclable</span>
                      ) : (
                        <span className="badge-red badge text-[10px]">Non-Recyclable</span>
                      )}
                      <span className="text-[10px] font-semibold text-edu-amber">+{scan.points} pts</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recycling journey */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-navy-800 mb-4 flex items-center gap-2">
          <Recycle className="w-4 h-4 text-edu-green" /> Your Recycling Journey
        </h3>
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
          {['Identify', 'Learn', 'Collect', 'Submit', 'Recycle', 'Earn Points', 'Track Impact'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${i <= 2 ? 'bg-edu-green text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {i + 1}
                </div>
                <span className={i <= 2 ? 'text-edu-green' : 'text-gray-400'}>{step}</span>
              </div>
              {i < 6 && <TrendingUp className="w-3 h-3 text-gray-300" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
