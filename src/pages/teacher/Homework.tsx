import { useState } from 'react';
import { useStore, updateStore } from '@/store/useStore';
import { PageHeader, StatusBadge, ProgressBar, SectionCard } from '@/components/ui';
import { BookOpen, Plus, X, Calendar, Users, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import type { Homework } from '@/types';

export default function HomeworkPage() {
  const { data } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', subject: 'Mathematics', description: '', dueDate: '', class: '8-A' });

  const active = data.homeworks.filter((h) => h.status === 'active');
  const completed = data.homeworks.filter((h) => h.status === 'completed');
  const overdue = data.homeworks.filter((h) => h.status === 'overdue');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newHw: Homework = {
      id: `HW${String(Date.now()).slice(-6)}`,
      title: form.title,
      subject: form.subject,
      description: form.description,
      dueDate: form.dueDate,
      class: form.class,
      completion: 0,
      completedStudents: [],
      pendingStudents: data.students.map((s) => s.id),
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    updateStore((d) => {
      d.homeworks.unshift(newHw);
      d.notifications.unshift({
        id: `N${Date.now()}`,
        title: 'New Homework Assigned',
        message: `${form.title} has been assigned to Class ${form.class}`,
        date: new Date().toISOString().split('T')[0],
        type: 'homework',
        read: false,
        forRole: 'parent',
        studentId: data.students[0].id,
      });
    });
    setShowForm(false);
    setForm({ title: '', subject: 'Mathematics', description: '', dueDate: '', class: '8-A' });
  };

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader
        title="Homework"
        subtitle="Manage assignments and track completion"
        action={<button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="w-4 h-4" /> Assign Homework</button>}
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Active</p>
              <p className="text-2xl font-bold text-edu-blue mt-1">{active.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-edu-blue" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Completed</p>
              <p className="text-2xl font-bold text-edu-green mt-1">{completed.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-edu-green" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Overdue</p>
              <p className="text-2xl font-bold text-edu-red mt-1">{overdue.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-edu-red" />
            </div>
          </div>
        </div>
      </div>

      {/* Homework cards */}
      <div className="space-y-4">
        {data.homeworks.map((hw) => (
          <div key={hw.id} className="card p-5">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-navy-800">{hw.title}</h3>
                  {hw.status === 'active' && <StatusBadge variant="blue">Active</StatusBadge>}
                  {hw.status === 'completed' && <StatusBadge variant="green">Completed</StatusBadge>}
                  {hw.status === 'overdue' && <StatusBadge variant="red">Overdue</StatusBadge>}
                </div>
                <p className="text-sm text-gray-500">{hw.description}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {hw.subject}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Due: {hw.dueDate}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Class {hw.class}</span>
                </div>
              </div>
              <div className="md:w-48 shrink-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500">Completion</span>
                  <span className="text-xs font-semibold text-navy-800">{hw.completion}%</span>
                </div>
                <ProgressBar
                  value={hw.completion}
                  color={hw.completion === 100 ? 'bg-edu-green' : hw.status === 'overdue' ? 'bg-edu-red' : 'bg-edu-blue'}
                />
                <div className="flex gap-3 mt-2 text-xs">
                  <span className="text-edu-green flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> {hw.completedStudents.length} done
                  </span>
                  <span className="text-edu-amber flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {hw.pendingStudents.length} pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-edu-lg max-w-lg w-full p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-navy-800">Assign Homework</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Title</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. Algebra Worksheet" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Subject</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input-field">
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>Social Studies</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Class</label>
                  <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className="input-field">
                    <option>8-A</option>
                    <option>8-B</option>
                    <option>9-A</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Due Date</label>
                <input type="date" required value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Description</label>
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px] resize-none" placeholder="Assignment details..." />
              </div>
              <button type="submit" className="btn-primary w-full py-3">Assign Homework</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
