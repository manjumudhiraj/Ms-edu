import { useAuth } from '@/context/AuthContext';
import { useStore, updateStore } from '@/store/useStore';
import { PageHeader, StatusBadge, SectionCard } from '@/components/ui';
import { Package, CheckCircle, Truck, Recycle, Clock } from 'lucide-react';
import type { CollectionStatus } from '@/types';

const statusConfig: Record<CollectionStatus, { label: string; color: string; icon: typeof Clock }> = {
  requested: { label: 'Requested', color: 'text-edu-amber bg-amber-100', icon: Clock },
  assigned: { label: 'Assigned', color: 'text-edu-blue bg-blue-100', icon: Truck },
  collected: { label: 'Collected', color: 'text-edu-cyan bg-cyan-100', icon: CheckCircle },
  recycled: { label: 'Recycled', color: 'text-edu-green bg-green-100', icon: Recycle },
};

const statusOrder: CollectionStatus[] = ['requested', 'assigned', 'collected', 'recycled'];

export default function StudentCollections() {
  const { user } = useAuth();
  const { data } = useStore();
  const sid = user?.studentId || 'STU005';

  const myRequests = data.collectionRequests.filter((r) => r.studentId === sid);

  const advanceStatus = (reqId: string) => {
    updateStore((d) => {
      const req = d.collectionRequests.find((r) => r.id === reqId);
      if (!req) return;
      const currentIdx = statusOrder.indexOf(req.status);
      if (currentIdx < statusOrder.length - 1) {
        const nextStatus = statusOrder[currentIdx + 1];
        req.status = nextStatus;

        if (nextStatus === 'collected' && !req.pointsAwarded) {
          req.pointsAwarded = true;
          const pointsMap: Record<string, number> = {
            'plastic-bottle': 10, 'plastic-container': 8, 'paper': 5,
            'cardboard': 6, 'glass': 8, 'metal-can': 10, 'organic': 3,
          };
          const pts = pointsMap[req.wasteCategory] * req.quantity;
          d.studentEcoPoints[sid] = (d.studentEcoPoints[sid] || 0) + pts;
          d.studentItemsRecycled[sid] = (d.studentItemsRecycled[sid] || 0) + req.quantity;
          d.recyclingHistory.unshift({
            id: `rh-${Date.now()}`,
            studentId: sid,
            date: new Date().toISOString().split('T')[0],
            wasteType: req.wasteType,
            category: req.wasteCategory,
            quantity: req.quantity,
            points: pts,
          });
          d.notifications.unshift({
            id: `N${Date.now()}`,
            title: 'You Earned Eco Points!',
            message: `You earned ${pts} Eco Points for recycling ${req.quantity} ${req.wasteType.toLowerCase()}.`,
            date: new Date().toISOString().split('T')[0],
            type: 'eco-points',
            read: false,
            forRole: 'student',
            studentId: sid,
          });
          d.notifications.unshift({
            id: `NP${Date.now()}`,
            title: 'Recycling Activity Completed',
            message: `${user?.name} recycled ${req.quantity} ${req.wasteType.toLowerCase()} and earned ${pts} Eco Points.`,
            date: new Date().toISOString().split('T')[0],
            type: 'recycling',
            read: false,
            forRole: 'parent',
            studentId: sid,
          });
        }

        d.notifications.unshift({
          id: `NS${Date.now()}`,
          title: 'Collection Status Updated',
          message: `Request ${req.id} status changed to ${statusConfig[nextStatus].label}.`,
          date: new Date().toISOString().split('T')[0],
          type: 'collection',
          read: false,
          forRole: 'student',
          studentId: sid,
        });
      }
    });
  };

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="My Collections" subtitle="Track your collection requests and recycling status" />

      {/* Workflow info */}
      <SectionCard title="Collection Workflow" className="mb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {statusOrder.map((status, i) => {
            const cfg = statusConfig[status];
            return (
              <div key={status} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.color}`}>
                    <cfg.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-navy-700">{cfg.label}</span>
                </div>
                {i < statusOrder.length - 1 && <div className="w-6 h-0.5 bg-gray-200" />}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Collection is managed by an Authorized Recycling Partner. Status changes are simulated for the prototype.
        </p>
      </SectionCard>

      {/* Collection requests */}
      <div className="space-y-3">
        {myRequests.map((req) => {
          const currentIdx = statusOrder.indexOf(req.status);
          const cfg = statusConfig[req.status];
          return (
            <div key={req.id} className="card p-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-navy-800 font-mono">{req.id}</span>
                    <span className={`badge ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <p className="text-sm font-medium text-navy-700">{req.wasteType}</p>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                    <span>{req.quantity} {req.unit}</span>
                    <span>· {req.estimatedWeight}{req.weightUnit}</span>
                    <span>· {req.collectionLocation}</span>
                    <span>· Created: {req.createdAt}</span>
                  </div>
                </div>
                {req.status !== 'recycled' && (
                  <button
                    onClick={() => advanceStatus(req.id)}
                    className="btn-secondary text-xs px-3 py-2 shrink-0"
                  >
                    Advance Status (Demo)
                  </button>
                )}
              </div>

              {/* Status progress */}
              <div className="flex items-center gap-1 mt-2">
                {statusOrder.map((status, i) => {
                  const statusCfg = statusConfig[status];
                  const isDone = i <= currentIdx;
                  return (
                    <div key={status} className="flex items-center flex-1">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium flex-1 ${isDone ? statusCfg.color : 'bg-gray-50 text-gray-300'}`}>
                        <statusCfg.icon className="w-3 h-3" />
                        <span className="hidden sm:inline">{statusCfg.label}</span>
                      </div>
                      {i < statusOrder.length - 1 && <div className={`w-1.5 h-0.5 ${isDone ? 'bg-edu-green' : 'bg-gray-200'}`} />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {myRequests.length === 0 && (
          <div className="card p-12 text-center">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-navy-800">No collection requests yet</p>
            <p className="text-xs text-gray-400 mt-1">Scan waste and submit for collection to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
