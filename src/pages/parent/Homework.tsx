import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/store/useStore';
import { PageHeader, StatusBadge, ProgressBar } from '@/components/ui';
import { BookOpen, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function ParentHomework() {
  const { user } = useAuth();
  const { data } = useStore();
  const child = data.students.find((s) => s.id === user?.childId) || data.students[0];

  const childHomework = data.homeworks.map((hw) => ({
    ...hw,
    childCompleted: hw.completedStudents.includes(child.id),
  }));

  const pending = childHomework.filter((h) => !h.childCompleted && h.status !== 'completed');
  const completed = childHomework.filter((h) => h.childCompleted);

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Homework" subtitle={`${child.name} · Class ${child.class}`} />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Pending</p>
              <p className="text-2xl font-bold text-edu-amber mt-1">{pending.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Clock className="w-5 h-5 text-edu-amber" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Completed</p>
              <p className="text-2xl font-bold text-edu-green mt-1">{completed.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-edu-green" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Completion</p>
              <p className="text-2xl font-bold text-edu-blue mt-1">{child.homework}%</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><BookOpen className="w-5 h-5 text-edu-blue" /></div>
          </div>
        </div>
      </div>

      {/* Pending homework */}
      <h3 className="text-sm font-semibold text-navy-800 mb-3">Pending Homework</h3>
      <div className="space-y-3 mb-6">
        {pending.map((hw) => (
          <div key={hw.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  hw.subject === 'Mathematics' ? 'bg-blue-50' : hw.subject === 'Science' ? 'bg-green-50' :
                  hw.subject === 'English' ? 'bg-cyan-50' : 'bg-amber-50'
                }`}>
                  <BookOpen className={`w-5 h-5 ${
                    hw.subject === 'Mathematics' ? 'text-edu-blue' : hw.subject === 'Science' ? 'text-edu-green' :
                    hw.subject === 'English' ? 'text-edu-cyan' : 'text-edu-amber'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-navy-800">{hw.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{hw.description}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {hw.subject}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due: {hw.dueDate}</span>
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                {hw.status === 'overdue' ? (
                  <StatusBadge variant="red"><AlertCircle className="w-3 h-3" /> Overdue</StatusBadge>
                ) : (
                  <StatusBadge variant="amber"><Clock className="w-3 h-3" /> Pending</StatusBadge>
                )}
              </div>
            </div>
          </div>
        ))}
        {pending.length === 0 && (
          <div className="card p-8 text-center">
            <CheckCircle className="w-8 h-8 text-edu-green mx-auto mb-2" />
            <p className="text-sm text-gray-500">All homework completed!</p>
          </div>
        )}
      </div>

      {/* Completed homework */}
      <h3 className="text-sm font-semibold text-navy-800 mb-3">Completed Homework</h3>
      <div className="space-y-3">
        {completed.map((hw) => (
          <div key={hw.id} className="card p-4 opacity-75">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-edu-green" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-navy-800">{hw.title}</h4>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {hw.subject}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {hw.dueDate}</span>
                </div>
              </div>
              <StatusBadge variant="green">Completed</StatusBadge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
