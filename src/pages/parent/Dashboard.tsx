import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { StatCard, SectionCard, PageHeader } from '@/components/ui';
import {
  CalendarCheck, BookOpen, TrendingUp, FileText, Bell,
  GraduationCap, ArrowRight,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  parentChildPerformance, parentMonthlyTrend,
  parentAttendanceTrend, parentHomeworkCompletion,
} from '@/data/demoData';
import { Link } from 'react-router-dom';

export default function ParentDashboard() {
  const { user } = useAuth();
  const { data } = useStore();
  const child = data.students.find((s) => s.id === user?.childId) || data.students[0];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const parentNotifs = data.notifications.filter((n) => n.forRole === 'parent' && n.studentId === child.id).slice(0, 4);

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ').slice(0, 1)[0] || 'Parent'}`}
        subtitle={`${today} · ${child.name} · Class ${child.class}`}
      />

      {/* Child info banner */}
      <div className="card p-4 mb-4 bg-gradient-to-r from-navy-700 to-navy-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-edu-lightblue" />
          </div>
          <div>
            <p className="text-white font-semibold">{child.name}</p>
            <p className="text-navy-200 text-xs">Student ID: {child.id} · Class {child.class}</p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard icon={CalendarCheck} label="Attendance" value={`${child.attendance}%`} color="text-edu-green" bgColor="bg-green-50" />
        <StatCard icon={BookOpen} label="Homework" value={`${child.homework}%`} color="text-edu-blue" bgColor="bg-blue-50" />
        <StatCard icon={TrendingUp} label="Performance" value={`${child.performance}%`} color="text-edu-cyan" bgColor="bg-cyan-50" />
        <StatCard icon={FileText} label="Lessons Done" value={24} color="text-edu-amber" bgColor="bg-amber-50" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <SectionCard title="Child Performance" subtitle="Subject-wise scores">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={parentChildPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="score" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={32} name="Score" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Attendance Trend">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={parentAttendanceTrend}>
              <defs>
                <linearGradient id="attG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="attendance" stroke="#16a34a" fill="url(#attG)" strokeWidth={2} name="Attendance %" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <SectionCard title="Homework Completion">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={parentHomeworkCompletion}>
              <defs>
                <linearGradient id="hwcG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="completion" stroke="#2563eb" fill="url(#hwcG)" strokeWidth={2} name="Completion %" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Monthly Learning Trend">
          <ResponsiveContainer width="100%" height={200}>
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

      {/* Quick links + notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Quick Access">
          <div className="space-y-2">
            <Link to="/parent/child" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group">
              <span className="text-sm font-medium text-navy-700">View Child Profile</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-edu-blue" />
            </Link>
            <Link to="/parent/homework" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-amber-50 transition-colors group">
              <span className="text-sm font-medium text-navy-700">Check Homework</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-edu-amber" />
            </Link>
            <Link to="/parent/missed-lessons" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors group">
              <span className="text-sm font-medium text-navy-700">Missed Lessons</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-edu-green" />
            </Link>
            <Link to="/parent/messages" className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-cyan-50 transition-colors group">
              <span className="text-sm font-medium text-navy-700">Messages</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-edu-cyan" />
            </Link>
          </div>
        </SectionCard>

        <div className="lg:col-span-2">
          <SectionCard title="Recent Notifications" action={<Link to="/parent/notifications" className="text-xs text-edu-blue font-medium hover:underline">View all</Link>}>
            <div className="space-y-2">
              {parentNotifs.map((n) => (
                <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl ${n.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                  <Bell className="w-4 h-4 text-edu-blue mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-800">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-edu-blue shrink-0 mt-1.5" />}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
