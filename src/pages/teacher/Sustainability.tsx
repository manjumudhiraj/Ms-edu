import { useStore } from '@/store/useStore';
import { PageHeader, SectionCard, ProgressBar } from '@/components/ui';
import {
  Recycle, Package, Users, Leaf, TrendingUp, Trophy,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import {
  monthlyPlasticData, classEcoScores, leaderboardData,
} from '@/data/recyclingData';

export default function TeacherSustainability() {
  const { data } = useStore();

  const totalBottles = Object.values(data.studentItemsRecycled).reduce((a, b) => a + b, 0);
  const totalWeight = (totalBottles * 25 / 1000).toFixed(1);
  const activeRequests = data.collectionRequests.filter((r) => r.status !== 'recycled').length;
  const participatingStudents = Object.keys(data.studentEcoPoints).filter(
    (k) => data.studentEcoPoints[k] > 0
  ).length;

  const stats = [
    { label: 'Plastic Bottles Collected', value: totalBottles.toLocaleString(), icon: Recycle, color: 'text-edu-green', bg: 'bg-green-50' },
    { label: 'Estimated Plastic (kg)', value: `${totalWeight} kg`, icon: Leaf, color: 'text-edu-cyan', bg: 'bg-cyan-50' },
    { label: 'Participating Students', value: participatingStudents, icon: Users, color: 'text-edu-blue', bg: 'bg-blue-50' },
    { label: 'Active Collection Requests', value: activeRequests, icon: Package, color: 'text-edu-amber', bg: 'bg-amber-50' },
  ];

  const topStudents = [...leaderboardData].sort((a, b) => b.points - a.points).slice(0, 5);
  const topClasses = [...classEcoScores].sort((a, b) => b.score - a.score);

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Sustainability" subtitle="Track your school's recycling progress and eco impact" />

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

      {/* Monthly plastic chart */}
      <SectionCard title="Monthly Plastic Collected" subtitle="Plastic collected in kg over the year" className="mb-4">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={monthlyPlasticData}>
            <defs>
              <linearGradient id="plasticGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Area type="monotone" dataKey="plastic" stroke="#16a34a" fill="url(#plasticGrad2)" strokeWidth={2} name="Plastic (kg)" />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Class eco scores + top students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Class eco scores */}
        <SectionCard title="Class Eco Score" subtitle="Recycling performance by class">
          <div className="space-y-3">
            {classEcoScores.map((c) => (
              <div key={c.class}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-navy-800">Class {c.class}</span>
                    <Recycle className="w-3.5 h-3.5 text-edu-green" />
                  </div>
                  <span className="text-sm font-bold text-edu-green">{c.score}%</span>
                </div>
                <ProgressBar value={c.score} color={c.score >= 90 ? 'bg-edu-green' : c.score >= 75 ? 'bg-edu-blue' : 'bg-edu-amber'} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Top recycling students */}
        <SectionCard title="Top Recycling Students" subtitle="Leading eco champions">
          <div className="space-y-2">
            {topStudents.map((s) => (
              <div key={s.studentId} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${s.rank <= 3 ? 'bg-amber-100 text-edu-amber' : 'bg-gray-100 text-gray-500'}`}>
                  {s.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-800 truncate">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.items} items · {s.points} pts</p>
                </div>
                <Trophy className="w-4 h-4 text-edu-amber shrink-0" />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Collection requests overview */}
      <SectionCard title="Recent Collection Requests" subtitle="All student collection activity">
        <div className="space-y-2">
          {data.collectionRequests.slice(0, 6).map((req) => (
            <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-edu-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-navy-800 font-mono">{req.id}</span>
                  <span className="text-xs text-gray-400">· {req.studentName}</span>
                </div>
                <p className="text-xs text-gray-400">{req.wasteType} · {req.quantity} {req.unit} · {req.estimatedWeight}{req.weightUnit}</p>
              </div>
              <span className={`badge ${
                req.status === 'recycled' ? 'badge-green' :
                req.status === 'collected' ? 'badge-blue' :
                req.status === 'assigned' ? 'badge-blue' : 'badge-amber'
              }`}>
                {req.status}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
