import { useState } from 'react';
import { useStore, updateStore } from '@/store/useStore';
import { PageHeader, StatusBadge } from '@/components/ui';
import { Phone, Mail, Send, Check, UserMinus, BookOpen, AlertCircle, FileText } from 'lucide-react';

export default function Parents() {
  const { data } = useStore();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const sendNotification = (studentId: string, parentName: string, studentName: string) => {
    updateStore((d) => {
      d.notifications.unshift({
        id: `N${Date.now()}`,
        title: 'Teacher Notification',
        message: `Homework reminder sent to ${parentName} regarding ${studentName}`,
        date: new Date().toISOString().split('T')[0],
        type: 'parent-message',
        read: false,
        forRole: 'teacher',
      });
      d.notifications.unshift({
        id: `NP${Date.now()}`,
        title: 'Homework Reminder',
        message: `Reminder: Please ensure ${studentName} completes the pending homework.`,
        date: new Date().toISOString().split('T')[0],
        type: 'homework',
        read: false,
        forRole: 'parent',
        studentId,
      });
    });
    setSentTo(studentId);
    setTimeout(() => setSentTo(null), 2000);
  };

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Parents" subtitle="Parent contacts linked to students" />

      {/* Missed lessons section */}
      <div className="card p-5 mb-4">
        <h3 className="text-sm font-semibold text-navy-800 mb-3 flex items-center gap-2">
          <UserMinus className="w-4 h-4 text-edu-red" /> Absent Students – Missed Lessons
        </h3>
        <div className="space-y-2">
          {data.missedLessons.map((ml) => {
            const student = data.students.find((s) => s.id === ml.studentId);
            return (
              <div key={ml.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-red-50/50 border border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-edu-red" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-800">{ml.studentName}</p>
                    <p className="text-xs text-gray-500">Missed: {ml.subject} – {ml.lessonTitle} · {ml.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ml.status === 'notes-available' ? (
                    <StatusBadge variant="green">Notes Available</StatusBadge>
                  ) : (
                    <StatusBadge variant="amber">Notes Pending</StatusBadge>
                  )}
                  {ml.status === 'notes-available' && (
                    <button className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-navy-700 hover:bg-gray-50">
                      View Missed Lesson
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Parent contacts table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Student</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Parent Name</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden md:table-cell">Contact</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3 hidden lg:table-cell">Email</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Notification</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.students.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-edu-blue to-edu-cyan flex items-center justify-center text-white text-xs font-semibold">
                        {s.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy-800">{s.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-navy-700">{s.parentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {s.parentContact}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {s.parentEmail}</span>
                  </td>
                  <td className="px-4 py-3">
                    {sentTo === s.id ? (
                      <StatusBadge variant="green"><Check className="w-3 h-3" /> Sent</StatusBadge>
                    ) : (
                      <StatusBadge variant="gray">Not sent</StatusBadge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => sendNotification(s.id, s.parentName, s.name)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-edu-blue text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" /> Notify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
