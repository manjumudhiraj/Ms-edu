import { useStore, updateStore } from '@/store/useStore';
import { PageHeader, StatusBadge, SectionCard } from '@/components/ui';
import { CalendarCheck, UserMinus, Clock, Check, X } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { monthlyAttendanceData } from '@/data/demoData';
import type { AttendanceStatus } from '@/types';

export default function Attendance() {
  const { data } = useStore();

  const presentCount = data.attendanceRecords.filter((r) => r.status === 'present').length;
  const absentCount = data.attendanceRecords.filter((r) => r.status === 'absent').length;
  const lateCount = data.attendanceRecords.filter((r) => r.status === 'late').length;

  const markStatus = (studentId: string, status: AttendanceStatus) => {
    updateStore((d) => {
      const record = d.attendanceRecords.find((r) => r.studentId === studentId);
      if (record) {
        record.status = status;
        record.time = status === 'present' ? '08:55 AM' : status === 'late' ? '09:10 AM' : '--';
        record.remarks = status === 'present' ? 'On time' : status === 'late' ? 'Late arrival' : 'Not arrived';
      }
      const student = d.students.find((s) => s.id === studentId);
      if (student) {
        if (status === 'absent' && student.status === 'active') {
          student.status = 'inactive';
        } else if (status === 'present' && student.status === 'inactive') {
          student.status = 'active';
        }
      }
    });
  };

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Attendance" subtitle="Today's attendance · Class 8-A" />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Present</p>
              <p className="text-2xl font-bold text-edu-green mt-1">{presentCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Check className="w-5 h-5 text-edu-green" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Absent</p>
              <p className="text-2xl font-bold text-edu-red mt-1">{absentCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <UserMinus className="w-5 h-5 text-edu-red" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Late</p>
              <p className="text-2xl font-bold text-edu-amber mt-1">{lateCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-edu-amber" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly chart */}
      <SectionCard title="Monthly Attendance" className="mb-4">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyAttendanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="present" stackId="a" fill="#16a34a" radius={[0, 0, 0, 0]} name="Present" barSize={28} />
            <Bar dataKey="late" stackId="a" fill="#f59e0b" name="Late" barSize={28} />
            <Bar dataKey="absent" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} name="Absent" barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      {/* Attendance table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-navy-800 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-edu-blue" />
            Mark Attendance
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Student</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden md:table-cell">Time</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden lg:table-cell">Remarks</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.attendanceRecords.map((rec) => {
                const student = data.students.find((s) => s.id === rec.studentId);
                if (!student) return null;
                return (
                  <tr key={rec.studentId} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-edu-blue to-edu-cyan flex items-center justify-center text-white text-xs font-semibold">
                          {student.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-navy-800">{student.name}</p>
                          <p className="text-xs text-gray-400 font-mono">{student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{rec.time}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{rec.remarks}</td>
                    <td className="px-4 py-3">
                      {rec.status === 'present' && <StatusBadge variant="green">Present</StatusBadge>}
                      {rec.status === 'absent' && <StatusBadge variant="red">Absent</StatusBadge>}
                      {rec.status === 'late' && <StatusBadge variant="amber">Late</StatusBadge>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => markStatus(rec.studentId, 'present')}
                          className={`p-2 rounded-lg transition-colors ${rec.status === 'present' ? 'bg-green-500 text-white' : 'bg-green-50 text-edu-green hover:bg-green-100'}`}
                          title="Mark Present"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => markStatus(rec.studentId, 'late')}
                          className={`p-2 rounded-lg transition-colors ${rec.status === 'late' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-edu-amber hover:bg-amber-100'}`}
                          title="Mark Late"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => markStatus(rec.studentId, 'absent')}
                          className={`p-2 rounded-lg transition-colors ${rec.status === 'absent' ? 'bg-red-500 text-white' : 'bg-red-50 text-edu-red hover:bg-red-100'}`}
                          title="Mark Absent"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
