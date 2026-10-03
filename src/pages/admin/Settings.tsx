import { useState } from 'react';
import {
  Bell, Shield, MapPin, Truck, Database, Webhook,
  Check, Save,
} from 'lucide-react';

export default function AdminSettings() {
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    binFullWarnings: true,
    truckDelays: false,
    dailyReport: true,
    weeklyLeaderboard: false,
  });

  const [thresholds, setThresholds] = useState({
    binFullAlert: 85,
    contaminationAlert: 30,
    lowAccuracyAlert: 75,
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">Configure alerts, thresholds, and system integrations</p>
      </div>

      {/* Notification preferences */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-semibold text-slate-900">Notification Preferences</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: 'criticalAlerts', label: 'Critical Alerts', desc: 'Contamination and system failures' },
            { key: 'binFullWarnings', label: 'Bin Full Warnings', desc: 'When bins reach threshold capacity' },
            { key: 'truckDelays', label: 'Truck Route Delays', desc: 'Notifications for route schedule deviations' },
            { key: 'dailyReport', label: 'Daily Summary Report', desc: 'Email digest sent at 8:00 AM daily' },
            { key: 'weeklyLeaderboard', label: 'Weekly Leaderboard Update', desc: 'Top performers summary every Monday' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }))
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Alert thresholds */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-semibold text-slate-900">Alert Thresholds</h3>
        </div>
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Bin Full Alert</label>
              <span className="text-sm font-bold text-emerald-600">{thresholds.binFullAlert}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              value={thresholds.binFullAlert}
              onChange={(e) => setThresholds((prev) => ({ ...prev, binFullAlert: Number(e.target.value) }))}
              className="w-full accent-emerald-500"
            />
            <p className="text-xs text-slate-400 mt-1">Trigger alert when bin fill level exceeds this percentage</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Contamination Alert</label>
              <span className="text-sm font-bold text-emerald-600">{thresholds.contaminationAlert}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              value={thresholds.contaminationAlert}
              onChange={(e) => setThresholds((prev) => ({ ...prev, contaminationAlert: Number(e.target.value) }))}
              className="w-full accent-emerald-500"
            />
            <p className="text-xs text-slate-400 mt-1">Trigger when contamination ratio exceeds this percentage</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Low Accuracy Alert</label>
              <span className="text-sm font-bold text-emerald-600">{thresholds.lowAccuracyAlert}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              value={thresholds.lowAccuracyAlert}
              onChange={(e) => setThresholds((prev) => ({ ...prev, lowAccuracyAlert: Number(e.target.value) }))}
              className="w-full accent-emerald-500"
            />
            <p className="text-xs text-slate-400 mt-1">Flag zones with segregation accuracy below this threshold</p>
          </div>
        </div>
      </div>

      {/* System integrations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-900">Map Service</h3>
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3" /> Connected
            </span>
          </div>
          <p className="text-xs text-slate-500">Google Maps API for live truck tracking and bin location mapping.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-semibold text-slate-900">Fleet Management</h3>
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3" /> Connected
            </span>
          </div>
          <p className="text-xs text-slate-500">GPS tracking for all collection vehicles and route optimization.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-900">AI Model Service</h3>
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Demo
            </span>
          </div>
          <p className="text-xs text-slate-500">Waste classification model for real-time scan identification.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Webhook className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-900">Webhooks</h3>
            <span className="ml-auto text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Not Configured
            </span>
          </div>
          <p className="text-xs text-slate-500">Send real-time event data to external municipal systems.</p>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 hover:shadow-lg active:scale-95 transition-all">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
