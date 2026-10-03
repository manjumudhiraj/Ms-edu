import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { PageHeader, StatusBadge, ProgressBar } from '@/components/ui';
import { Search, Eye, Filter, Users } from 'lucide-react';

export default function Students() {
  const { data } = useStore();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [perfFilter, setPerfFilter] = useState('all');

  const filtered = useMemo(() => {
    return data.students.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
      const matchClass = classFilter === 'all' || s.class === classFilter;
      const matchPerf = perfFilter === 'all' ||
        (perfFilter === 'high' && s.performance >= 85) ||
        (perfFilter === 'mid' && s.performance >= 70 && s.performance < 85) ||
        (perfFilter === 'low' && s.performance < 70);
      return matchSearch && matchClass && matchPerf;
    });
  }, [data.students, search, classFilter, perfFilter]);

  const classes = [...new Set(data.students.map((s) => s.class))];

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Students" subtitle={`${data.students.length} students in Class 8-A`} />

      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or student ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="input-field w-auto">
              <option value="all">All Classes</option>
              {classes.map((c) => <option key={c} value={c}>Class {c}</option>)}
            </select>
            <select value={perfFilter} onChange={(e) => setPerfFilter(e.target.value)} className="input-field w-auto">
              <option value="all">All Performance</option>
              <option value="high">High (85%+)</option>
              <option value="mid">Medium (70-84%)</option>
              <option value="low">Low (&lt;70%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Student ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Class</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Attendance</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Homework</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Performance</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{s.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-edu-blue to-edu-cyan flex items-center justify-center text-white text-xs font-semibold shrink-0">
                        {s.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-navy-800">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{s.class}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={s.attendance} color={s.attendance >= 90 ? 'bg-edu-green' : s.attendance >= 75 ? 'bg-edu-amber' : 'bg-edu-red'} />
                      <span className="text-xs text-gray-600 w-8">{s.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={s.homework} color="bg-edu-blue" />
                      <span className="text-xs text-gray-600 w-8">{s.homework}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-sm font-semibold ${s.performance >= 85 ? 'text-edu-green' : s.performance >= 70 ? 'text-edu-blue' : 'text-edu-red'}`}>
                      {s.performance}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {s.status === 'active' ? <StatusBadge variant="green">Active</StatusBadge> : <StatusBadge variant="gray">Inactive</StatusBadge>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to={`/teacher/students/${s.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-edu-blue text-xs font-medium hover:bg-blue-100 transition-colors">
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No students found</p>
          </div>
        )}
      </div>
    </div>
  );
}
