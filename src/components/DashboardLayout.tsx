import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap, LayoutDashboard, Users, CalendarCheck, BookOpen,
  Activity, BarChart3, FileText, Bell, MessageSquare, Settings,
  LogOut, Menu, X, ChevronLeft, Recycle, Camera, Package, Trophy,
  BookMarked, User as UserIcon, Leaf,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
}

const teacherNav: NavItem[] = [
  { label: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'Students', path: '/teacher/students', icon: Users },
  { label: 'Attendance', path: '/teacher/attendance', icon: CalendarCheck },
  { label: 'Homework', path: '/teacher/homework', icon: BookOpen },
  { label: 'Class Activity', path: '/teacher/activity', icon: Activity },
  { label: 'Performance', path: '/teacher/performance', icon: BarChart3 },
  { label: 'Lessons', path: '/teacher/lessons', icon: FileText },
  { label: 'Sustainability', path: '/teacher/sustainability', icon: Leaf },
  { label: 'Notifications', path: '/teacher/notifications', icon: Bell },
  { label: 'Parents', path: '/teacher/parents', icon: MessageSquare },
  { label: 'Settings', path: '/teacher/settings', icon: Settings },
];

const parentNav: NavItem[] = [
  { label: 'Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
  { label: 'My Child', path: '/parent/child', icon: Users },
  { label: 'Attendance', path: '/parent/attendance', icon: CalendarCheck },
  { label: 'Homework', path: '/parent/homework', icon: BookOpen },
  { label: 'Performance', path: '/parent/performance', icon: BarChart3 },
  { label: 'Missed Lessons', path: '/parent/missed-lessons', icon: FileText },
  { label: 'Sustainability', path: '/parent/sustainability', icon: Leaf },
  { label: 'Notifications', path: '/parent/notifications', icon: Bell },
  { label: 'Messages', path: '/parent/messages', icon: MessageSquare },
  { label: 'Settings', path: '/parent/settings', icon: Settings },
];

const studentNav: NavItem[] = [
  { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Scan Waste', path: '/student/scan', icon: Camera },
  { label: 'My Collections', path: '/student/collections', icon: Package },
  { label: 'Eco Points', path: '/student/eco-points', icon: Trophy },
  { label: 'Leaderboard', path: '/student/leaderboard', icon: Trophy },
  { label: 'Learn Recycling', path: '/student/learn', icon: BookMarked },
  { label: 'Notifications', path: '/student/notifications', icon: Bell },
  { label: 'Profile', path: '/student/profile', icon: UserIcon },
];

const navMap: Record<string, NavItem[]> = {
  teacher: teacherNav,
  parent: parentNav,
  student: studentNav,
};

const portalLabel: Record<string, string> = {
  teacher: 'Teacher Portal',
  parent: 'Parent Portal',
  student: 'Student Portal',
};

interface DashboardLayoutProps {
  children: ReactNode;
  role: 'teacher' | 'parent' | 'student';
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nav = navMap[role] || teacherNav;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === `/${role}/dashboard`) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-navy-800 to-navy-900 fixed h-screen z-30">
        <SidebarContent nav={nav} role={role} isActive={isActive} onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-navy-800 to-navy-900 z-50 lg:hidden animate-fade-in">
            <SidebarContent nav={nav} role={role} isActive={isActive} onLogout={handleLogout} onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-navy-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-edu-lightblue" />
            <span className="font-bold text-lg">Ms.Edu</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 -mr-2">
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around px-2 py-2 z-20">
          {nav.slice(0, 5).map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${active ? 'text-edu-blue' : 'text-gray-400'}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function SidebarContent({
  nav,
  role,
  isActive,
  onLogout,
  onNavigate,
}: {
  nav: NavItem[];
  role: string;
  isActive: (path: string) => boolean;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const showBack = role === 'teacher'
    ? location.pathname.includes('/students/') && location.pathname !== '/teacher/students'
    : false;

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-10 h-10 bg-gradient-to-br from-edu-blue to-edu-cyan rounded-xl flex items-center justify-center shadow-lg">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">Ms.Edu</h1>
          <p className="text-[10px] text-navy-200 uppercase tracking-wider">
            {portalLabel[role] || 'Portal'}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {showBack && (
          <Link to="/teacher/students" className="sidebar-link mb-2 text-navy-300" onClick={onNavigate}>
            <ChevronLeft className="w-4 h-4" />
            Back to Students
          </Link>
        )}
        {nav.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={active ? 'sidebar-link-active' : 'sidebar-link'}
              onClick={onNavigate}
            >
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button onClick={onLogout} className="sidebar-link w-full text-red-300 hover:bg-red-500/10 hover:text-red-200">
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}
