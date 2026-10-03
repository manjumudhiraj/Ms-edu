import {
  ScanLine, Target, Trash2, Droplets, TrendingUp, TrendingDown,
  AlertTriangle, AlertCircle, Info, ArrowRight,
  Building2, Recycle, Users, Package, Leaf, Factory, Sprout,
  School, GraduationCap, Truck, BarChart3,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import { Link } from 'react-router-dom';
import {
  wasteVolumeData, recentAlerts, schoolRecyclingData,
  collectionRequests, recyclableMaterials, studentWasteReports,
} from '@/data/adminData';

const stats = [
  { label: 'Total Schools Participating', value: '6', icon: Building2, color: 'emerald', trend: '+1', trendUp: true },
  { label: 'Total Waste Collected', value: '2,520 kg', icon: Trash2, color: 'blue', trend: '+12%', trendUp: true },
  { label: 'Recyclable Materials', value: '2,101 kg', icon: Recycle, color: 'cyan', trend: '+8%', trendUp: true },
  { label: 'Recycling Rate', value: '83%', icon: Target, color: 'emerald', trend: '+3%', trendUp: true },
  { label: 'Student Participation', value: '1,780', icon: Users, color: 'blue', trend: '+15%', trendUp: true },
  { label: 'Collection Requests', value: '6', icon: Package, color: 'amber', trend: '−2', trendUp: false },
  { label: 'Wastewater Treated', value: '12,000 L', icon: Droplets, color: 'cyan', trend: '+8%', trendUp: true },
  { label: 'Total Scans Today', value: '1,245', icon: ScanLine, color: 'emerald', trend: '+12%', trendUp: true },
];

const colorMap: Record<string, { bg: string; text: string; border: string; chart: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', chart: '#10b981' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', chart: '#3b82f6' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', chart: '#f59e0b' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', chart: '#06b6d4' },
};

const severityConfig = {
  critical: { icon: AlertCircle, bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: 'Critical' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', label: 'Warning' },
  info: { icon: Info, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', label: 'Info' },
};

const requestStatusConfig: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700',
  Scheduled: 'bg-blue-50 text-blue-700',
  Collected: 'bg-emerald-50 text-emerald-700',
  Processing: 'bg-purple-50 text-purple-700',
};

const workflowSteps = [
  { icon: School, label: 'School', desc: 'Participates in program', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Users, label: 'Students', desc: 'Scan & report waste', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { icon: Package, label: 'Waste Collection', desc: 'Trucks collect bins', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Building2, label: 'Municipal Admin', desc: 'Coordinates operations', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Recycle, label: 'Recycling', desc: 'Process materials', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { icon: Factory, label: 'Reuse / Sale', desc: 'Repurpose materials', color: 'text-blue-600', bg: 'bg-blue-100' },
  { icon: Leaf, label: 'Environmental Impact', desc: 'Cleaner communities', color: 'text-emerald-600', bg: 'bg-emerald-200' },
];

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Municipal Admin Dashboard</h2>
        <p className="text-sm text-slate-500 mt-0.5">Smart City & Recycling Management — real-time overview for today, Oct 3</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const colors = colorMap[stat.color];
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-11 h-11 ${colors.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                {stat.trendUp ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                )}
                <span className={`text-xs font-semibold ${stat.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
                <span className="text-xs text-slate-400">vs yesterday</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recycling Workflow */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Recycle className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-semibold text-slate-900">Recycling Workflow</h3>
          <span className="text-xs text-slate-400 ml-1">School to Environmental Impact</span>
        </div>
        <div className="flex items-stretch gap-1 overflow-x-auto pb-2">
          {workflowSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-center shrink-0">
                <div className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg ${step.bg} min-w-[110px]`}>
                  <Icon className={`w-6 h-6 ${step.color}`} />
                  <p className={`text-[11px] font-bold ${step.color} text-center leading-tight`}>{step.label}</p>
                  <p className="text-[9px] text-slate-500 text-center leading-tight">{step.desc}</p>
                </div>
                {i < workflowSteps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-300 mx-0.5 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts row: Area chart + Recyclable materials pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Waste Processing Volume</h3>
              <p className="text-xs text-slate-500 mt-0.5">Last 7 days — measured in kilograms</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />Recycling</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" />Organic</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400" />General</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={wasteVolumeData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRecycling" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradOrganic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradGeneral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="recycling" stroke="#10b981" strokeWidth={2} fill="url(#gradRecycling)" />
              <Area type="monotone" dataKey="organic" stroke="#f59e0b" strokeWidth={2} fill="url(#gradOrganic)" />
              <Area type="monotone" dataKey="general" stroke="#94a3b8" strokeWidth={2} fill="url(#gradGeneral)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recyclable materials pie */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-1">Recyclable Materials</h3>
          <p className="text-xs text-slate-500 mb-3">Collected by material type (kg)</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={recyclableMaterials}
                dataKey="collected"
                nameKey="material"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
              >
                {recyclableMaterials.map((entry) => (
                  <Cell key={entry.material} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {recyclableMaterials.map((m) => (
              <div key={m.material} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                  {m.material}
                </span>
                <span className="font-semibold text-slate-700">{m.collected} kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* School-wise recycling data */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-semibold text-slate-900">School-wise Recycling Data</h3>
          </div>
          <span className="text-xs text-slate-500">{schoolRecyclingData.length} schools</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">School</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Students</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Waste Collected</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Recyclable</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3">Recycling Rate</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Eco Points</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Participation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schoolRecyclingData.map((school) => (
                <tr key={school.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-slate-700">{school.name}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-slate-600">{school.students}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-medium text-slate-700">{school.wasteCollected} kg</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-sm text-slate-600">{school.recyclableKg} kg</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${school.recyclingRate >= 80 ? 'bg-emerald-500' : school.recyclingRate >= 70 ? 'bg-amber-500' : 'bg-red-400'}`}
                          style={{ width: `${school.recyclingRate}%` }}
                        />
                      </div>
                      <span className={`text-sm font-semibold ${school.recyclingRate >= 80 ? 'text-emerald-600' : school.recyclingRate >= 70 ? 'text-amber-600' : 'text-red-500'}`}>
                        {school.recyclingRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-sm font-semibold text-emerald-600">{school.ecoPoints.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${school.participation}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-blue-600">{school.participation}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collection requests + Student-reported waste */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Collection requests */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-semibold text-slate-900">Waste Collection Requests</h3>
            </div>
            <span className="text-xs text-slate-500">{collectionRequests.length} requests</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto">
            {collectionRequests.map((req) => (
              <div key={req.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">{req.id}</span>
                      <span className="text-sm font-semibold text-slate-700 truncate">{req.school}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{req.wasteType} · {req.amount}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{req.date}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${requestStatusConfig[req.status]}`}>
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student-reported waste */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-cyan-600" />
              <h3 className="text-base font-semibold text-slate-900">Student-Reported Waste</h3>
            </div>
            <span className="text-xs text-slate-500">Latest reports</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto">
            {studentWasteReports.map((report) => (
              <div key={report.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-700">{report.student}</span>
                      <span className="text-[10px] text-slate-400">{report.school}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{report.item} · {report.category}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{report.date}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 shrink-0">
                    <Leaf className="w-3 h-3" />
                    +{report.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recycling activity / impact */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-5">
          <Sprout className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-semibold text-slate-900">Recycling Activity & Environmental Impact</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Bar chart: collected vs recycled by material */}
          <div className="lg:col-span-2">
            <p className="text-xs text-slate-500 mb-3">Collected vs Recycled by Material Type (kg)</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={recyclableMaterials} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="material" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="collected" name="Collected" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="recycled" name="Recycled" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Impact stats */}
          <div className="space-y-3">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-2 mb-1">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">CO₂ Saved</p>
              </div>
              <p className="text-2xl font-bold text-emerald-700">1,840 kg</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">Equivalent to 80 trees planted</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Recycle className="w-4 h-4 text-blue-600" />
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Materials Reused</p>
              </div>
              <p className="text-2xl font-bold text-blue-700">2,101 kg</p>
              <p className="text-[10px] text-blue-600 mt-0.5">Paper, plastic, metal, e-waste & glass</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-4 h-4 text-amber-600" />
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Students Engaged</p>
              </div>
              <p className="text-2xl font-bold text-amber-700">1,780</p>
              <p className="text-[10px] text-amber-600 mt-0.5">Across 6 participating schools</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent alerts */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-semibold text-slate-900">Recent Alerts</h3>
          </div>
          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">{recentAlerts.filter(a => a.severity === 'critical').length} Critical</span>
        </div>
        <div className="space-y-3">
          {recentAlerts.map((alert) => {
            const sev = severityConfig[alert.severity];
            const Icon = sev.icon;
            return (
              <div key={alert.id} className={`rounded-lg border ${sev.border} ${sev.bg} p-3`}>
                <div className="flex items-start gap-2.5">
                  <Icon className={`w-4 h-4 ${sev.text} shrink-0 mt-0.5`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900">{alert.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{alert.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1.5">{alert.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/admin/scans" className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between hover:border-emerald-300 hover:shadow-md transition-all group">
          <div>
            <p className="text-sm font-semibold text-slate-900">View Live AI Scans</p>
            <p className="text-xs text-slate-500 mt-0.5">Monitor real-time waste identification</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
        </Link>
        <Link to="/admin/routes" className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between hover:border-emerald-300 hover:shadow-md transition-all group">
          <div>
            <p className="text-sm font-semibold text-slate-900">Track Truck Routes</p>
            <p className="text-xs text-slate-500 mt-0.5">3 active collection vehicles on the move</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
        </Link>
        <Link to="/admin/leaderboard" className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between hover:border-emerald-300 hover:shadow-md transition-all group">
          <div>
            <p className="text-sm font-semibold text-slate-900">Campus Rankings</p>
            <p className="text-xs text-slate-500 mt-0.5">See which zones lead in eco points</p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
