import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  trend?: string;
}

export function StatCard({ icon: Icon, label, value, color, bgColor, trend }: StatCardProps) {
  return (
    <div className="stat-card animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-navy-800 mt-1.5">{value}</p>
          {trend && <p className="text-xs text-gray-400 mt-1">{trend}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bgColor}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  );
}

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function SectionCard({ title, subtitle, children, action, className = '' }: SectionCardProps) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-navy-800">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

interface BadgeProps {
  variant: 'green' | 'red' | 'amber' | 'blue' | 'gray';
  children: ReactNode;
}

export function StatusBadge({ variant, children }: BadgeProps) {
  const variants: Record<string, string> = {
    green: 'badge-green',
    red: 'badge-red',
    amber: 'badge-amber',
    blue: 'badge-blue',
    gray: 'badge-gray',
  };
  return <span className={variants[variant]}>{children}</span>;
}

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
}

export function ProgressBar({ value, max = 100, color = 'bg-edu-blue' }: ProgressBarProps) {
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-500`}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-xl font-bold text-navy-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
