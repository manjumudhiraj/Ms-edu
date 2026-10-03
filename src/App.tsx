import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import Login from '@/pages/Login';
import TeacherDashboard from '@/pages/teacher/Dashboard';
import Students from '@/pages/teacher/Students';
import StudentDetail from '@/pages/teacher/StudentDetail';
import Attendance from '@/pages/teacher/Attendance';
import Homework from '@/pages/teacher/Homework';
import ClassActivity from '@/pages/teacher/ClassActivity';
import Performance from '@/pages/teacher/Performance';
import Lessons from '@/pages/teacher/Lessons';
import Parents from '@/pages/teacher/Parents';
import TeacherNotifications from '@/pages/teacher/Notifications';
import TeacherSettings from '@/pages/teacher/Settings';
import TeacherSustainability from '@/pages/teacher/Sustainability';
import ParentDashboard from '@/pages/parent/Dashboard';
import MyChild from '@/pages/parent/MyChild';
import ParentAttendance from '@/pages/parent/Attendance';
import ParentHomework from '@/pages/parent/Homework';
import ParentPerformance from '@/pages/parent/Performance';
import ParentMissedLessons from '@/pages/parent/MissedLessons';
import ParentNotifications from '@/pages/parent/Notifications';
import ParentMessages from '@/pages/parent/Messages';
import ParentSettings from '@/pages/parent/Settings';
import ParentSustainability from '@/pages/parent/Sustainability';
import StudentDashboard from '@/pages/student/Dashboard';
import ScanWaste from '@/pages/student/ScanWaste';
import StudentCollections from '@/pages/student/Collections';
import EcoPoints from '@/pages/student/EcoPoints';
import Leaderboard from '@/pages/student/Leaderboard';
import LearnRecycling from '@/pages/student/LearnRecycling';
import StudentNotifications from '@/pages/student/Notifications';
import StudentProfile from '@/pages/student/Profile';
import { AdminLayout } from '@/components/admin/AdminLayout';
import AdminOverview from '@/pages/admin/Overview';
import AdminLiveScans from '@/pages/admin/LiveScans';
import AdminTruckRoutes from '@/pages/admin/TruckRoutes';
import AdminLeaderboard from '@/pages/admin/Leaderboard';
import AdminSettings from '@/pages/admin/Settings';
import type { ReactNode } from 'react';
import type { UserRole } from '@/types';

function ProtectedRoute({ children, role }: { children: ReactNode; role: UserRole }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/" replace state={{ from: location }} />;
  if (user.role !== role) return <Navigate to={`/${user.role}/dashboard`} replace />;

  return (
    <DashboardLayout role={role}>
      {children}
    </DashboardLayout>
  );
}

function RootRedirect() {
  const { user } = useAuth();
  if (user) return <Navigate to={`/${user.role}/dashboard`} replace />;
  return <Login />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      {/* Teacher routes */}
      <Route path="/teacher/dashboard" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/students" element={<ProtectedRoute role="teacher"><Students /></ProtectedRoute>} />
      <Route path="/teacher/students/:id" element={<ProtectedRoute role="teacher"><StudentDetail /></ProtectedRoute>} />
      <Route path="/teacher/attendance" element={<ProtectedRoute role="teacher"><Attendance /></ProtectedRoute>} />
      <Route path="/teacher/homework" element={<ProtectedRoute role="teacher"><Homework /></ProtectedRoute>} />
      <Route path="/teacher/activity" element={<ProtectedRoute role="teacher"><ClassActivity /></ProtectedRoute>} />
      <Route path="/teacher/performance" element={<ProtectedRoute role="teacher"><Performance /></ProtectedRoute>} />
      <Route path="/teacher/lessons" element={<ProtectedRoute role="teacher"><Lessons /></ProtectedRoute>} />
      <Route path="/teacher/sustainability" element={<ProtectedRoute role="teacher"><TeacherSustainability /></ProtectedRoute>} />
      <Route path="/teacher/parents" element={<ProtectedRoute role="teacher"><Parents /></ProtectedRoute>} />
      <Route path="/teacher/notifications" element={<ProtectedRoute role="teacher"><TeacherNotifications /></ProtectedRoute>} />
      <Route path="/teacher/settings" element={<ProtectedRoute role="teacher"><TeacherSettings /></ProtectedRoute>} />

      {/* Parent routes */}
      <Route path="/parent/dashboard" element={<ProtectedRoute role="parent"><ParentDashboard /></ProtectedRoute>} />
      <Route path="/parent/child" element={<ProtectedRoute role="parent"><MyChild /></ProtectedRoute>} />
      <Route path="/parent/attendance" element={<ProtectedRoute role="parent"><ParentAttendance /></ProtectedRoute>} />
      <Route path="/parent/homework" element={<ProtectedRoute role="parent"><ParentHomework /></ProtectedRoute>} />
      <Route path="/parent/performance" element={<ProtectedRoute role="parent"><ParentPerformance /></ProtectedRoute>} />
      <Route path="/parent/missed-lessons" element={<ProtectedRoute role="parent"><ParentMissedLessons /></ProtectedRoute>} />
      <Route path="/parent/sustainability" element={<ProtectedRoute role="parent"><ParentSustainability /></ProtectedRoute>} />
      <Route path="/parent/notifications" element={<ProtectedRoute role="parent"><ParentNotifications /></ProtectedRoute>} />
      <Route path="/parent/messages" element={<ProtectedRoute role="parent"><ParentMessages /></ProtectedRoute>} />
      <Route path="/parent/settings" element={<ProtectedRoute role="parent"><ParentSettings /></ProtectedRoute>} />

      {/* Student routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/scan" element={<ProtectedRoute role="student"><ScanWaste /></ProtectedRoute>} />
      <Route path="/student/collections" element={<ProtectedRoute role="student"><StudentCollections /></ProtectedRoute>} />
      <Route path="/student/eco-points" element={<ProtectedRoute role="student"><EcoPoints /></ProtectedRoute>} />
      <Route path="/student/leaderboard" element={<ProtectedRoute role="student"><Leaderboard /></ProtectedRoute>} />
      <Route path="/student/learn" element={<ProtectedRoute role="student"><LearnRecycling /></ProtectedRoute>} />
      <Route path="/student/notifications" element={<ProtectedRoute role="student"><StudentNotifications /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

      {/* Admin routes */}
      <Route path="/admin/overview" element={<AdminLayout><AdminOverview /></AdminLayout>} />
      <Route path="/admin/scans" element={<AdminLayout><AdminLiveScans /></AdminLayout>} />
      <Route path="/admin/routes" element={<AdminLayout><AdminTruckRoutes /></AdminLayout>} />
      <Route path="/admin/leaderboard" element={<AdminLayout><AdminLeaderboard /></AdminLayout>} />
      <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
