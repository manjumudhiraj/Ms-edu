import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { StatCard, SectionCard, PageHeader } from '@/components/ui';
import {
  Users, CalendarCheck, UserMinus, BookOpen, TrendingUp, Activity,
  Bell, FileText,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  monthlyAttendanceData, subjectPerformanceData,
  homeworkTrendData, classActivityData,
} from '@/data/demoData';
import { Link } from 'react-router-dom';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { data } = useStore();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const presentCount = data.attendanceRecords.filter((r) => r.status === 'present').length;
  const absentCount = data.attendanceRecords.filter((r) => r.status === 'absent').length;
  const activeCount = data.students.filter((s) => s.status === 'active').length;
  const avgHomework = Math.round(data.students.reduce((a, s) => a + s.homework, 0) / data.students.length);
  const avgPerformance = Math.round(data.students.reduce((a, s) => a + s.performance, 0) / data.students.length);

  const recentNotifications = data.notifications.filter((n) => n.forRole === 'teacher').slice(0, 4);
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader
        title={`${greeting}, ${user?.name?.split(' ').slice(-1)[0] || 'Teacher'}`}
        subtitle={`${today} · Class 8-A · ${data.students.length} Students`}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 mb-6">
        <StatCard icon={Users} label="Total Students" value={data.students.length} color="text-edu-blue" bgColor="bg-blue-50" />
        <StatCard icon={CalendarCheck} label="Present Today" value={presentCount} color="text-edu-green" bgColor="bg-green-50" />
        <StatCard icon={UserMinus} label="Absent Today" value={absentCount} color="text-edu-red" bgColor="bg-red-50" />
        <StatCard icon={BookOpen} label="Homework" value={`${avgHomework}%`} color="text-edu-amber" bgColor="bg-amber-50" />
        <StatCard icon={TrendingUp} label="Avg Performance" value={`${avgPerformance}%`} color="text-edu-cyan" bgColor="bg-cyan-50" />
        <StatCard icon={Activity} label="Active Students" value={activeCount} color="text-edu-blue" bgColor="bg-blue-50" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <SectionCard title="Attendance Trend" subtitle="Monthly overview">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyAttendanceData}>
              <defs>
                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="present" stroke="#16a34a" fill="url(#presentGrad)" strokeWidth={2} name="Present" />
              <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="url(#absentGrad)" strokeWidth={2} name="Absent" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Subject Performance" subtitle="Class average by subject">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectPerformanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="subject" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="avg" fill="#2563eb" radius={[0, 6, 6, 0]} barSize={18} name="Avg Score" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <SectionCard title="Homework Completion Trend">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={homeworkTrendData}>
              <defs>
                <linearGradient id="hwGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="completion" stroke="#f59e0b" fill="url(#hwGrad)" strokeWidth={2} name="Completion %" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Class Activity" subtitle="Live classroom status">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={classActivityData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {classActivityData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Quick links + notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Quick Actions">
          <div className="space-y-2">
            <Link to="/teacher/attendance" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors">
              <CalendarCheck className="w-5 h-5 text-edu-blue" />
              <span className="text-sm font-medium text-navy-700">Mark Attendance</span>
            </Link>
            <Link to="/teacher/homework" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-amber-50 transition-colors">
              <BookOpen className="w-5 h-5 text-edu-amber" />
              <span className="text-sm font-medium text-navy-700">Assign Homework</span>
            </Link>
            <Link to="/teacher/lessons" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors">
              <FileText className="w-5 h-5 text-edu-green" />
              <span className="text-sm font-medium text-navy-700">Create Lesson</span>
            </Link>
            <Link to="/teacher/activity" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-cyan-50 transition-colors">
              <Activity className="w-5 h-5 text-edu-cyan" />
              <span className="text-sm font-medium text-navy-700">View Live Activity</span>
            </Link>
          </div>
        </SectionCard>

        <div className="lg:col-span-2">
          <SectionCard
            title="Recent Notifications"
            action={<Link to="/teacher/notifications" className="text-xs text-edu-blue font-medium hover:underline">View all</Link>}
          >
            <div className="space-y-2">
              {recentNotifications.map((n) => (
                <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl ${n.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                  <div className="mt-0.5">
                    {n.type === 'attendance' ? (
                      <CalendarCheck className="w-4 h-4 text-edu-blue" />
                    ) : n.type === 'homework' ? (
                      <BookOpen className="w-4 h-4 text-edu-amber" />
                    ) : n.type === 'performance' ? (
                      <TrendingUp className="w-4 h-4 text-edu-red" />
                    ) : (
                      <Bell className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
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


