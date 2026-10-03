import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { PageHeader, SectionCard } from '@/components/ui';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts';
import {
  subjectPerformanceData, homeworkTrendData, attendanceVsPerformance,
  performanceDistribution,
} from '@/data/demoData';

export default function Performance() {
  const { data } = useStore();
  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [period, setPeriod] = useState('term');

  const monthlyData = data.students[0]?.monthlyPerformance.map((m, i) => ({
    month: m.month,
    avg: Math.round(data.students.reduce((a, s) => a + (s.monthlyPerformance[i]?.value || 0), 0) / data.students.length),
  })) || [];

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Performance" subtitle="Class analytics and student performance insights" />

      {/* Filters */}
      <div className="card p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="input-field sm:w-auto">
            <option value="all">All Classes</option>
            <option value="8-A">Class 8-A</option>
            <option value="8-B">Class 8-B</option>
          </select>
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="input-field sm:w-auto">
            <option value="all">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="Social Studies">Social Studies</option>
          </select>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="input-field sm:w-auto">
            <option value="month">This Month</option>
            <option value="term">This Term</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <SectionCard title="Average Marks by Subject">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={subjectPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="avg" radius={[6, 6, 0, 0]} barSize={36}>
                {subjectPerformanceData.map((entry, i) => (
                  <Cell key={i} fill={['#2563eb', '#16a34a', '#06b6d4', '#f59e0b'][i % 4]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Student Performance Distribution">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={performanceDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="range" type="category" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="count" fill="#2563eb" radius={[0, 6, 6, 0]} barSize={18} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <SectionCard title="Homework Completion Trend">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={homeworkTrendData}>
              <defs>
                <linearGradient id="hwP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="completion" stroke="#f59e0b" fill="url(#hwP)" strokeWidth={2} name="Completion %" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Attendance vs Performance">
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" dataKey="attendance" domain={[60, 100]} name="Attendance" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} label={{ value: 'Attendance %', position: 'insideBottom', offset: -2, style: { fontSize: 10, fill: '#94a3b8' } }} />
              <YAxis type="number" dataKey="performance" domain={[60, 100]} name="Performance" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} label={{ value: 'Performance %', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#94a3b8' } }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Scatter data={attendanceVsPerformance} fill="#06b6d4" />
            </ScatterChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="Monthly Performance Trend">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="avg" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} name="Class Average" />
          </LineChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}
