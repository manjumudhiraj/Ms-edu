import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { PageHeader, SectionCard, StatusBadge, ProgressBar } from '@/components/ui';
import { GraduationCap, CalendarCheck, BookOpen, TrendingUp, Clock, School, FileText } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function MyChild() {
  const { user } = useAuth();
  const { data } = useStore();
  const child = data.students.find((s) => s.id === user?.childId) || data.students[0];

  const radarData = child.subjects.map((s) => ({ subject: s.subject, score: s.score }));

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="My Child" subtitle="Student profile and activity overview" />

      {/* Profile header */}
      <div className="card p-5 mb-4">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-edu-blue to-edu-cyan flex items-center justify-center text-white text-xl font-bold shrink-0">
            {child.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-navy-800">{child.name}</h2>
            <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {child.id}</span>
              <span className="flex items-center gap-1"><School className="w-3.5 h-3.5" /> Class {child.class}</span>
              <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> ZPHS High School</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck className="w-4 h-4 text-edu-green" />
            <span className="text-xs text-gray-500">Attendance</span>
          </div>
          <p className="text-2xl font-bold text-navy-800">{child.attendance}%</p>
          <ProgressBar value={child.attendance} color="bg-edu-green" />
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-edu-blue" />
            <span className="text-xs text-gray-500">Homework</span>
          </div>
          <p className="text-2xl font-bold text-navy-800">{child.homework}%</p>
          <ProgressBar value={child.homework} color="bg-edu-blue" />
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-edu-cyan" />
            <span className="text-xs text-gray-500">Performance</span>
          </div>
          <p className="text-2xl font-bold text-navy-800">{child.performance}%</p>
          <ProgressBar value={child.performance} color="bg-edu-cyan" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <SectionCard title="Subject Performance">
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <Radar dataKey="score" stroke="#16a34a" fill="#16a34a" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Performance Trend">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={child.monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} name="Performance" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Recent activity timeline */}
      <SectionCard title="Recent Activity Timeline">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
          {child.recentActivity.map((a, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-edu-blue border-2 border-white shadow-sm" />
              <div className="flex items-center gap-3">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-400 font-medium">{a.time}</span>
                <span className="text-sm text-navy-800">{a.activity}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
