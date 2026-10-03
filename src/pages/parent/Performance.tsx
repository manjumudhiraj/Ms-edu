import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { PageHeader, SectionCard } from '@/components/ui';
import { TrendingUp, BookOpen, CalendarCheck, Smile } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  parentChildPerformance, parentMonthlyTrend,
  parentAttendanceTrend, parentHomeworkCompletion,
} from '@/data/demoData';

export default function ParentPerformance() {
  const { user } = useAuth();
  const { data } = useStore();
  const child = data.students.find((s) => s.id === user?.childId) || data.students[0];

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Performance" subtitle={`${child.name} · Class ${child.class}`} />

      {/* Encouragement banner */}
      <div className="card p-4 mb-4 bg-gradient-to-r from-green-50 to-cyan-50 border border-green-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-edu-green/10 flex items-center justify-center shrink-0">
            <Smile className="w-5 h-5 text-edu-green" />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy-800">Your child's performance is improving.</p>
            <p className="text-xs text-gray-500 mt-0.5">Keep encouraging consistent study habits at home.</p>
          </div>
        </div>
      </div>

      {/* Subject-wise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <SectionCard title="Subject-wise Performance">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={parentChildPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={32}>
                {parentChildPerformance.map((entry, i) => (
                  <Bar key={i} dataKey="score" fill={['#2563eb', '#16a34a', '#06b6d4', '#f59e0b'][i % 4]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Performance Trend">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={parentMonthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="performance" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} name="Performance" />
              <Line type="monotone" dataKey="homework" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Homework" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Homework Completion">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={parentHomeworkCompletion}>
              <defs>
                <linearGradient id="phcG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="completion" stroke="#2563eb" fill="url(#phcG)" strokeWidth={2} name="Completion %" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Attendance Trend">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={parentAttendanceTrend}>
              <defs>
                <linearGradient id="patG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="attendance" stroke="#16a34a" fill="url(#patG)" strokeWidth={2} name="Attendance %" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  );
}
