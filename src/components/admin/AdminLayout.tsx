import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ScanLine, Truck, Trophy, Settings,
  Leaf, Menu, X, ArrowLeft, Bell,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { label: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
  { label: 'Live AI Scans', path: '/admin/scans', icon: ScanLine },
  { label: 'Truck Routes', path: '/admin/routes', icon: Truck },
  { label: 'Campus Leaderboard', path: '/admin/leaderboard', icon: Trophy },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-screen z-30">
        <SidebarContent isActive={isActive} onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-50 lg:hidden animate-fade-in">
            <SidebarContent isActive={isActive} onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 leading-tight">EcoCity Admin</h1>
                <p className="text-[10px] text-slate-500 leading-tight">Smart Waste & Utility Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-emerald-600">AD</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-700">Admin Officer</p>
                <p className="text-[10px] text-slate-500">Municipal Authority</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  isActive,
  onNavigate,
}: {
  isActive: (path: string) => boolean;
  onNavigate: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-200">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-base font-bold text-slate-900 leading-tight">EcoCity</h1>
          <p className="text-[10px] text-slate-500 leading-tight">Admin Dashboard</p>
        </div>
        <button onClick={onNavigate} className="lg:hidden text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Menu</p>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
              {item.label}
              {active && <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Back to portal */}
      <div className="px-3 py-4 border-t border-slate-200">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
