import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap, Mail, Lock, Users, BookOpen, Eye, EyeOff,
  Recycle, ArrowLeft, BookUser, Shield, Building2, ChevronRight,
  Leaf, Trash2, TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

type SelectionStage = 'role' | 'credentials';

interface RoleCardConfig {
  id: UserRole;
  label: string;
  icon: typeof BookOpen;
  description: string;
  accent: string;
  iconBg: string;
  iconText: string;
  border: string;
  hoverBorder: string;
}

const roleCards: RoleCardConfig[] = [
  {
    id: 'student',
    label: 'Student Login',
    icon: Recycle,
    description: 'Scan waste, earn eco points, and track your recycling impact.',
    accent: 'text-cyan-600',
    iconBg: 'bg-cyan-500',
    iconText: 'text-white',
    border: 'border-slate-200',
    hoverBorder: 'hover:border-cyan-400',
  },
  {
    id: 'teacher',
    label: 'Teacher Login',
    icon: BookOpen,
    description: 'Monitor students, manage lessons, homework, and attendance.',
    accent: 'text-blue-600',
    iconBg: 'bg-blue-600',
    iconText: 'text-white',
    border: 'border-slate-200',
    hoverBorder: 'hover:border-blue-400',
  },
  {
    id: 'parent',
    label: 'Parent Login',
    icon: Users,
    description: 'Track your child\'s attendance, performance, and school updates.',
    accent: 'text-emerald-600',
    iconBg: 'bg-emerald-600',
    iconText: 'text-white',
    border: 'border-slate-200',
    hoverBorder: 'hover:border-emerald-400',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();
  const [stage, setStage] = useState<SelectionStage>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStage('credentials');
    setError('');
  };

  const handleBackToRoles = () => {
    setStage('role');
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password, selectedRole);
    if (success) {
      navigate(`/${selectedRole}/dashboard`);
    } else {
      setError('Invalid credentials. Please check your email, password, and role.');
    }
  };

  const handleDemo = (demoRole: UserRole) => {
    demoLogin(demoRole);
    navigate(`/${demoRole}/dashboard`);
  };

  const roleConfig = roleCards.find((r) => r.id === selectedRole) ?? roleCards[1];
  const RoleIcon = roleConfig.icon;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left brand panel */}
      <div className="lg:w-1/2 bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900 flex flex-col justify-center items-center p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-edu-blue/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-edu-cyan/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-edu-blue to-edu-cyan rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Ms.Edu</h1>
              <p className="text-xs text-navy-200">Smart Education Monitoring</p>
            </div>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
            Smart Wastage Recreation
          </h2>
          <p className="text-navy-200 text-sm leading-relaxed mb-8">
            An education platform that turns students into active participants in recycling. Teachers, parents, and students work together for a sustainable future.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <Users className="w-5 h-5 text-edu-lightblue mx-auto mb-1.5" />
              <p className="text-xs text-navy-100 font-medium">15 Students</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <Recycle className="w-5 h-5 text-edu-lightgreen mx-auto mb-1.5" />
              <p className="text-xs text-navy-100 font-medium">Recycling</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <GraduationCap className="w-5 h-5 text-edu-amber mx-auto mb-1.5" />
              <p className="text-xs text-navy-100 font-medium">Multi-Lingual</p>
            </div>
          </div>

          {/* Connecting Schools with Smart Cities highlight */}
          <div className="bg-gradient-to-br from-emerald-500/15 to-blue-500/10 backdrop-blur-sm rounded-2xl p-4 border border-emerald-400/20">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Connecting Schools with Smart Cities</h3>
            </div>
            <p className="text-xs text-navy-200 leading-relaxed">
              Ms.Edu connects students, teachers, parents, and municipal authorities to create cleaner schools and more sustainable communities.
            </p>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] text-navy-200 font-medium">2,520 kg recycled</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-edu-lightgreen" />
                <span className="text-[10px] text-navy-200 font-medium">6 schools active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-edu-lightblue" />
                <span className="text-[10px] text-navy-200 font-medium">1,780 students</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right content panel */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-edu-blue to-edu-cyan rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy-800">Ms.Edu</h1>
              <p className="text-xs text-gray-500">Smart Education Monitoring</p>
            </div>
          </div>

          {/* ===== STAGE 1: Role Selection ===== */}
          {stage === 'role' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-navy-800 mb-1">Welcome to Ms.Edu</h2>
              <p className="text-sm text-gray-500 mb-6">Smart Education. Smarter Communities.</p>

              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Choose your portal</p>

              {/* Role cards — Student, Teacher, Parent */}
              <div className="space-y-3 mb-4">
                {roleCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleRoleSelect(card.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 ${card.border} ${card.hoverBorder} bg-white shadow-sm hover:shadow-md transition-all duration-200 group text-left`}
                    >
                      <div className={`w-11 h-11 ${card.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                        <Icon className={`w-5 h-5 ${card.iconText}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${card.accent}`}>{card.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{card.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors shrink-0" />
                    </button>
                  );
                })}
              </div>

              {/* Municipal Admin — prominent highlighted card */}
              <Link
                to="/admin/overview"
                className="w-full block p-4 rounded-xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-blue-50 shadow-md hover:shadow-lg transition-all duration-200 group text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 flex items-center gap-1">
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wide">
                    Smart City
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-wide rounded-bl-lg">
                    New
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-emerald-700">Municipal Admin – Smart City & Recycling Management</p>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Monitor waste collection, recycling activities, school participation, and student-reported waste across schools.
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                </div>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-emerald-200/60">
                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                    <Recycle className="w-3 h-3" /> Recycling Tracking
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-blue-600">
                    <Trash2 className="w-3 h-3" /> Waste Collection
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                    <GraduationCap className="w-3 h-3" /> School Participation
                  </span>
                </div>
              </Link>

              {/* Demo credentials hint */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-center text-xs text-gray-400">
                  Demo: teacher@msedu.demo / teacher123 · parent@msedu.demo / parent123 · student@msedu.demo / student123
                </p>
              </div>
            </div>
          )}

          {/* ===== STAGE 2: Credentials Form ===== */}
          {stage === 'credentials' && (
            <div className="animate-fade-in">
              {/* Back button */}
              <button
                onClick={handleBackToRoles}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-navy-800 transition-colors mb-5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to role selection
              </button>

              {/* Selected role indicator */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 ${roleConfig.iconBg} rounded-xl flex items-center justify-center`}>
                  <RoleIcon className={`w-5 h-5 ${roleConfig.iconText}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-navy-800">{roleConfig.label}</h2>
                  <p className="text-xs text-gray-500">Enter your credentials to continue</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Email / Username</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={selectedRole === 'teacher' ? 'teacher@msedu.demo' : selectedRole === 'parent' ? 'parent@msedu.demo' : 'student@msedu.demo'}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="input-field pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-edu-red animate-fade-in">
                    {error}
                  </div>
                )}

                <button type="submit" className="btn-primary w-full py-3">
                  Login as {selectedRole === 'teacher' ? 'Teacher' : selectedRole === 'parent' ? 'Parent' : 'Student'}
                </button>
              </form>

              {/* Quick demo access */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">Quick Demo Access</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  onClick={() => handleDemo('teacher')}
                  className="btn-secondary py-2.5 text-xs"
                >
                  <BookOpen className="w-4 h-4 text-edu-blue" />
                  Teacher
                </button>
                <button
                  onClick={() => handleDemo('parent')}
                  className="btn-secondary py-2.5 text-xs"
                >
                  <Users className="w-4 h-4 text-edu-green" />
                  Parent
                </button>
                <button
                  onClick={() => handleDemo('student')}
                  className="btn-secondary py-2.5 text-xs"
                >
                  <Recycle className="w-4 h-4 text-edu-cyan" />
                  Student
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 mt-6">
                Demo: teacher@msedu.demo / teacher123 · parent@msedu.demo / parent123 · student@msedu.demo / student123
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
