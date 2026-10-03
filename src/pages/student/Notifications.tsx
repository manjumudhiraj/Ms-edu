import { useAuth } from '@/context/AuthContext';
import { useStore, updateStore } from '@/store/useStore';
import { PageHeader } from '@/components/ui';
import { Bell, Recycle, Package, Trophy, CheckCheck } from 'lucide-react';

export default function StudentNotifications() {
  const { user } = useAuth();
  const { data } = useStore();
  const sid = user?.studentId || 'STU005';

  const myNotifs = data.notifications.filter((n) => n.forRole === 'student' && n.studentId === sid);

  const markAllRead = () => {
    updateStore((d) => {
      d.notifications.forEach((n) => {
        if (n.forRole === 'student' && n.studentId === sid) n.read = true;
      });
    });
  };

  const iconForType = (type: string) => {
    if (type === 'collection') return Package;
    if (type === 'eco-points') return Trophy;
    if (type === 'recycling') return Recycle;
    return Bell;
  };

  const colorForType = (type: string) => {
    if (type === 'collection') return 'bg-blue-50 text-edu-blue';
    if (type === 'eco-points') return 'bg-amber-50 text-edu-amber';
    if (type === 'recycling') return 'bg-green-50 text-edu-green';
    return 'bg-gray-50 text-gray-500';
  };

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader
        title="Notifications"
        subtitle="Stay updated on your recycling activities"
        action={
          myNotifs.some((n) => !n.read) ? (
            <button onClick={markAllRead} className="btn-secondary text-xs px-3 py-2">
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
          ) : undefined
        }
      />

      <div className="space-y-2">
        {myNotifs.map((n) => {
          const Icon = iconForType(n.type);
          return (
            <div
              key={n.id}
              className={`card p-4 flex items-start gap-3 ${n.read ? '' : 'border-l-4 border-l-edu-green'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorForType(n.type)}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-navy-800">{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-edu-green shrink-0" />}
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.date}</p>
              </div>
            </div>
          );
        })}
        {myNotifs.length === 0 && (
          <div className="card p-12 text-center">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-navy-800">No notifications yet</p>
            <p className="text-xs text-gray-400 mt-1">Your recycling updates will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
