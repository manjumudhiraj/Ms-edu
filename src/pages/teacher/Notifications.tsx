import { useState } from 'react';
import { useStore, updateStore } from '@/store/useStore';
import { PageHeader, StatusBadge } from '@/components/ui';
import {
  Bell, Check, Trash2, CalendarCheck, BookOpen, TrendingUp,
  UserMinus, MessageSquare, Settings as SettingsIcon, Filter,
} from 'lucide-react';
import type { AppNotification } from '@/types';

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  attendance: { icon: CalendarCheck, color: 'text-edu-blue', bg: 'bg-blue-50' },
  homework: { icon: BookOpen, color: 'text-edu-amber', bg: 'bg-amber-50' },
  performance: { icon: TrendingUp, color: 'text-edu-red', bg: 'bg-red-50' },
  absent: { icon: UserMinus, color: 'text-edu-red', bg: 'bg-red-50' },
  'parent-message': { icon: MessageSquare, color: 'text-edu-green', bg: 'bg-green-50' },
  system: { icon: SettingsIcon, color: 'text-gray-400', bg: 'bg-gray-50' },
};

export default function Notifications() {
  const { data } = useStore();
  const [filter, setFilter] = useState('all');

  const teacherNotifs = data.notifications.filter((n) => n.forRole === 'teacher');
  const filtered = filter === 'all' ? teacherNotifs : teacherNotifs.filter((n) => n.type === filter);
  const unreadCount = teacherNotifs.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    updateStore((d) => {
      const n = d.notifications.find((x) => x.id === id);
      if (n) n.read = true;
    });
  };

  const deleteNotif = (id: string) => {
    updateStore((d) => {
      d.notifications = d.notifications.filter((x) => x.id !== id);
    });
  };

  const markAllRead = () => {
    updateStore((d) => {
      d.notifications.forEach((n) => { if (n.forRole === 'teacher') n.read = true; });
    });
  };

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader
        title="Notifications"
        subtitle={`${unreadCount} unread notifications`}
        action={<button onClick={markAllRead} className="btn-secondary"><Check className="w-4 h-4" /> Mark all read</button>}
      />

      {/* Filter */}
      <div className="card p-3 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          {['all', 'attendance', 'homework', 'performance', 'absent', 'parent-message', 'system'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${filter === f ? 'bg-edu-blue text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-2">
        {filtered.map((n: AppNotification) => {
          const cfg = typeConfig[n.type] || typeConfig.system;
          return (
            <div key={n.id} className={`card p-4 flex items-start gap-3 ${n.read ? '' : 'border-l-4 border-l-edu-blue'}`}>
              <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-navy-800">{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-edu-blue" />}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.date}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {!n.read && (
                  <button onClick={() => markRead(n.id)} className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-green-50 hover:text-edu-green transition-colors" title="Mark as read">
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => deleteNotif(n.id)} className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-edu-red transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
