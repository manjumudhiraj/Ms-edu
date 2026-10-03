import { useParams, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { PageHeader, StatusBadge, ProgressBar, SectionCard } from '@/components/ui';
import {
  ArrowLeft, CalendarCheck, BookOpen, TrendingUp, Clock,
  Bell, GraduationCap, Phone, Mail,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function StudentDetail() {
  const { id } = useParams();
  const { data } = useStore();
  const student = data.students.find((s) => s.id === id);

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Student not found.</p>
        <Link to="/teacher/students" className="btn-primary mt-4">Back to Students</Link>
      </div>
    );
  }

  const radarData = student.subjects.map((s) => ({ subject: s.subject, score: s.score }));

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <Link to="/teacher/students" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-edu-blue mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Students
      </Link>

      {/* Profile header */}
      <div className="card p-5 mb-4">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-edu-blue to-edu-cyan flex items-center justify-center text-white text-xl font-bold shrink-0">
            {student.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-navy-800">{student.name}</h1>
            <p className="text-sm text-gray-500 font-mono">{student.id} · Class {student.class}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <StatusBadge variant={student.status === 'active' ? 'green' : 'gray'}>
                {student.status === 'active' ? 'Active' : 'Inactive'}
              </StatusBadge>
              <StatusBadge variant="blue">Attendance {student.attendance}%</StatusBadge>
              <StatusBadge variant="amber">Homework {student.homework}%</StatusBadge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck className="w-4 h-4 text-edu-green" />
            <span className="text-xs text-gray-500">Attendance</span>
          </div>
          <p className="text-2xl font-bold text-navy-800">{student.attendance}%</p>
          <ProgressBar value={student.attendance} color="bg-edu-green" />
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-edu-blue" />
            <span className="text-xs text-gray-500">Homework</span>
          </div>
          <p className="text-2xl font-bold text-navy-800">{student.homework}%</p>
          <ProgressBar value={student.homework} color="bg-edu-blue" />
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-edu-cyan" />
            <span className="text-xs text-gray-500">Avg Score</span>
          </div>
          <p className="text-2xl font-bold text-navy-800">{student.performance}%</p>
          <ProgressBar value={student.performance} color="bg-edu-cyan" />
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-4 h-4 text-edu-amber" />
            <span className="text-xs text-gray-500">Subjects</span>
          </div>
          <p className="text-2xl font-bold text-navy-800">{student.subjects.length}</p>
          <p className="text-xs text-gray-400">Core subjects</p>
        </div>
      </div>

      {/* Charts + subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <SectionCard title="Subject Performance">
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <Radar dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Performance Trend">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={student.monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} name="Performance" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Recent activity + notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <SectionCard title="Recent Activity">
          <div className="space-y-3">
            {student.recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-navy-800">{a.activity}</p>
                  <p className="text-xs text-gray-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Notifications">
          <div className="space-y-3">
            {student.notifications.map((n) => (
              <div key={n.id} className={`p-3 rounded-xl ${n.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                <div className="flex items-start gap-2">
                  <Bell className="w-4 h-4 text-edu-blue mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-navy-800">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Parent info */}
      <SectionCard title="Parent / Guardian">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-edu-green" />
            </div>
            <div>
              <p className="text-sm font-medium text-navy-800">{student.parentName}</p>
              <p className="text-xs text-gray-400">Parent ID: {student.parentId}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:ml-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-3.5 h-3.5 text-gray-400" /> {student.parentContact}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-3.5 h-3.5 text-gray-400" /> {student.parentEmail}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
