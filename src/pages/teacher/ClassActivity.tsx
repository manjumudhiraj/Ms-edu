import { useStore } from '@/store/useStore';
import { PageHeader, SectionCard } from '@/components/ui';
import { Activity, Eye, BookOpen, HelpCircle, UserX, Radio } from 'lucide-react';
import { classActivityData } from '@/data/demoData';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const activityConfig = {
  'viewing-lesson': { icon: Eye, color: 'text-edu-blue', bg: 'bg-blue-50', label: 'Viewing Lesson' },
  'completing-homework': { icon: BookOpen, color: 'text-edu-green', bg: 'bg-green-50', label: 'Completing Homework' },
  'taking-quiz': { icon: HelpCircle, color: 'text-edu-cyan', bg: 'bg-cyan-50', label: 'Taking Quiz' },
  'inactive': { icon: UserX, color: 'text-gray-400', bg: 'bg-gray-50', label: 'Inactive' },
};

export default function ClassActivity() {
  const { data } = useStore();

  const viewing = data.classActivities.filter((a) => a.activityType === 'viewing-lesson').length;
  const homework = data.classActivities.filter((a) => a.activityType === 'completing-homework').length;
  const quiz = data.classActivities.filter((a) => a.activityType === 'taking-quiz').length;
  const inactive = data.classActivities.filter((a) => a.activityType === 'inactive').length;

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Class Activity" subtitle="Live classroom monitoring · Demo representation" />

      {/* Live indicator */}
      <div className="card p-4 mb-4 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-edu-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-edu-green"></span>
          </span>
          <span className="text-sm font-semibold text-navy-800">Live Classroom Activity</span>
        </div>
        <span className="text-xs text-gray-400">· Ms.Edu Smart Bench System</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Viewing Lesson</p>
              <p className="text-2xl font-bold text-edu-blue mt-1">{viewing}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Eye className="w-5 h-5 text-edu-blue" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Homework</p>
              <p className="text-2xl font-bold text-edu-green mt-1">{homework}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><BookOpen className="w-5 h-5 text-edu-green" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Taking Quiz</p>
              <p className="text-2xl font-bold text-edu-cyan mt-1">{quiz}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center"><HelpCircle className="w-5 h-5 text-edu-cyan" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase">Inactive</p>
              <p className="text-2xl font-bold text-gray-400 mt-1">{inactive}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center"><UserX className="w-5 h-5 text-gray-400" /></div>
          </div>
        </div>
      </div>

      {/* Chart + activity list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <SectionCard title="Activity Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={classActivityData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                {classActivityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <div className="lg:col-span-2">
          <SectionCard title="Student Activity Feed">
            <div className="space-y-2 max-h-[260px] overflow-y-auto">
              {data.classActivities.map((act) => {
                const cfg = activityConfig[act.activityType];
                return (
                  <div key={act.studentId} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className={`w-9 h-9 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-800">{act.studentName}</p>
                      <p className="text-xs text-gray-500">{act.activity}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
                      <Radio className="w-3 h-3" />
                      {act.timestamp}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Smart bench info */}
      <div className="card p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-edu-blue/10 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-edu-blue" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-navy-800">Ms.Edu Smart Bench System</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Each smart bench supports three students with individual built-in screens. Activity data is collected from the offline classroom network and synced to this monitoring dashboard. This is a demo representation of the offline-first classroom system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
