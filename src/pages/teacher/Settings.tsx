import { useStore, resetStore } from '@/store/useStore';
import { useAuth } from '@/context/AuthContext';
import { PageHeader, SectionCard } from '@/components/ui';
import { User, Bell, Shield, Database, Wifi, Globe, RefreshCw, GraduationCap } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const { user } = useAuth();
  const [resetConfirm, setResetConfirm] = useState(false);
  const [prefs, setPrefs] = useState({
    emailNotifs: true,
    attendanceAlerts: true,
    homeworkAlerts: true,
    performanceAlerts: true,
    autoBackup: true,
    offlineMode: true,
    language: 'English',
  });

  const handleReset = () => {
    resetStore();
    setResetConfirm(false);
  };

  return (
    <div className="animate-fade-in pb-16 lg:pb-0">
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <div className="space-y-4 max-w-2xl">
        {/* Profile */}
        <SectionCard title="Profile Information">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-edu-blue to-edu-cyan flex items-center justify-center text-white text-lg font-bold">
              {user?.name?.split(' ').map((n) => n[0]).join('') || 'T'}
            </div>
            <div>
              <p className="text-base font-semibold text-navy-800">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs text-edu-blue font-medium mt-0.5">Teacher · Class 8-A</p>
            </div>
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notification Preferences">
          <div className="space-y-3">
            <ToggleRow icon={Bell} label="Email Notifications" value={prefs.emailNotifs} onChange={(v) => setPrefs({ ...prefs, emailNotifs: v })} />
            <ToggleRow icon={User} label="Attendance Alerts" value={prefs.attendanceAlerts} onChange={(v) => setPrefs({ ...prefs, attendanceAlerts: v })} />
            <ToggleRow icon={Bell} label="Homework Alerts" value={prefs.homeworkAlerts} onChange={(v) => setPrefs({ ...prefs, homeworkAlerts: v })} />
            <ToggleRow icon={Bell} label="Performance Alerts" value={prefs.performanceAlerts} onChange={(v) => setPrefs({ ...prefs, performanceAlerts: v })} />
          </div>
        </SectionCard>

        {/* Ms.Edu System */}
        <SectionCard title="Ms.Edu System Settings">
          <div className="space-y-3">
            <ToggleRow icon={Database} label="Automatic Backup" desc="Auto-save student work to local storage" value={prefs.autoBackup} onChange={(v) => setPrefs({ ...prefs, autoBackup: v })} />
            <ToggleRow icon={Wifi} label="Offline-First Mode" desc="Classroom works without internet" value={prefs.offlineMode} onChange={(v) => setPrefs({ ...prefs, offlineMode: v })} />
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center"><Globe className="w-4 h-4 text-edu-cyan" /></div>
                <div>
                  <p className="text-sm font-medium text-navy-800">Default Language</p>
                  <p className="text-xs text-gray-400">For lesson notes</p>
                </div>
              </div>
              <select value={prefs.language} onChange={(e) => setPrefs({ ...prefs, language: e.target.value })} className="input-field w-auto py-1.5 text-sm">
                <option>English</option><option>Telugu</option><option>Hindi</option>
              </select>
            </div>
          </div>
        </SectionCard>

        {/* Data */}
        <SectionCard title="Data Management">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center"><RefreshCw className="w-4 h-4 text-edu-amber" /></div>
              <div>
                <p className="text-sm font-medium text-navy-800">Reset Demo Data</p>
                <p className="text-xs text-gray-400">Restore all data to initial state</p>
              </div>
            </div>
            {resetConfirm ? (
              <div className="flex gap-2">
                <button onClick={handleReset} className="px-3 py-1.5 rounded-lg bg-edu-red text-white text-xs font-medium hover:bg-red-600">Confirm</button>
                <button onClick={() => setResetConfirm(false)} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setResetConfirm(true)} className="px-3 py-1.5 rounded-lg bg-amber-50 text-edu-amber text-xs font-medium hover:bg-amber-100">Reset</button>
            )}
          </div>
        </SectionCard>

        {/* About */}
        <SectionCard title="About Ms.Edu">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-edu-blue to-edu-cyan flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-navy-800">Ms.Edu – Smart Education Monitoring</p>
              <p className="text-xs text-gray-500 mt-1">Version 1.0.0 · Hackathon Prototype</p>
              <p className="text-xs text-gray-400 mt-1">Offline-first smart classroom with teacher & parent monitoring. Features include voice-to-notes, multilingual support, and smart bench integration.</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function ToggleRow({ icon: Icon, label, desc, value, onChange }: { icon: typeof User; label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center"><Icon className="w-4 h-4 text-gray-500" /></div>
        <div>
          <p className="text-sm font-medium text-navy-800">{label}</p>
          {desc && <p className="text-xs text-gray-400">{desc}</p>}
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-edu-blue' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
