import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { PageHeader, SectionCard, StatusBadge } from '@/components/ui';
import { CalendarCheck, Calendar, Check, X, Clock } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { parentAttendanceTrend } from '@/data/demoData';

const daysInMonth = 30;
const startDay = 3; // Wednesday

export default function ParentAttendance() {
  const { user } = useAuth();
  const { data } = useStore();
  const child = data.students.find((s) => s.id === user?.childId) || data.students[0];

  // Generate calendar
  const calendar: { day: number; status: 'present' | 'absent' | 'late' | 'future' }[] = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const absentList = [5, 12, 18, 25];
    const lateList = [8, 22];
    let status: 'present' | 'absent' | 'late' | 'future' = 'present';
    if (absentList.includes(day)) status = 'absent';
    else if (lateList.includes(day)) status = 'late';
    return { day, status };
  });

  const today = new Date().getDate();
  calendar.forEach((d) => { if (d.day > today) d.status = 'future'; });

  const presentDays = calendar.filter((d) => d.status === 'present').length;
  const absentDays = calendar.filter((d) => d.status === 'absent').length;
  const lateDays = calendar.filter((d) => d.status === 'late').length;

  const todayRecord = data.attendanceRecords.find((r) => r.studentId === child.id);

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Attendance" subtitle={`${child.name} · Class ${child.class}`} />

      {/* Today's status */}
      <div className="card p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Today's Status</p>
            <p className="text-lg font-bold text-navy-800 mt-1">
              {todayRecord?.status === 'present' ? 'Present' : todayRecord?.status === 'absent' ? 'Absent' : todayRecord?.status === 'late' ? 'Late' : 'Not marked'}
            </p>
          </div>
          {todayRecord?.status === 'present' && <StatusBadge variant="green"><Check className="w-3 h-3" /> Present</StatusBadge>}
          {todayRecord?.status === 'absent' && <StatusBadge variant="red"><X className="w-3 h-3" /> Absent</StatusBadge>}
          {todayRecord?.status === 'late' && <StatusBadge variant="amber"><Clock className="w-3 h-3" /> Late</StatusBadge>}
        </div>
        {todayRecord?.status === 'absent' && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-100">
            <p className="text-sm text-edu-red font-medium">Your child was absent today.</p>
            <p className="text-xs text-gray-500 mt-0.5">Lesson notes will be available for missed lessons.</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="stat-card">
          <p className="text-xs text-gray-500 uppercase">Attendance</p>
          <p className="text-2xl font-bold text-edu-green mt-1">{child.attendance}%</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-gray-500 uppercase">Present</p>
          <p className="text-2xl font-bold text-edu-blue mt-1">{presentDays}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-gray-500 uppercase">Absent</p>
          <p className="text-2xl font-bold text-edu-red mt-1">{absentDays}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-gray-500 uppercase">Late</p>
          <p className="text-2xl font-bold text-edu-amber mt-1">{lateDays}</p>
        </div>
      </div>

      {/* Monthly calendar */}
      <SectionCard title="Monthly Attendance Calendar" className="mb-4">
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: startDay }, (_, i) => <div key={`e${i}`} />)}
          {calendar.map((d) => (
            <div
              key={d.day}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                d.status === 'present' ? 'bg-green-100 text-edu-green' :
                d.status === 'absent' ? 'bg-red-100 text-edu-red' :
                d.status === 'late' ? 'bg-amber-100 text-edu-amber' :
                'bg-gray-50 text-gray-300'
              }`}
            >
              {d.day}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-100" /> Present</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100" /> Absent</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-100" /> Late</span>
        </div>
      </SectionCard>

      {/* Trend chart */}
      <SectionCard title="Attendance Trend">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={parentAttendanceTrend}>
            <defs>
              <linearGradient id="attP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Area type="monotone" dataKey="attendance" stroke="#16a34a" fill="url(#attP)" strokeWidth={2} name="Attendance %" />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}
