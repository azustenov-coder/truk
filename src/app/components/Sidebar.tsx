import { NavLink, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../providers/AuthProvider';
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Route,
  Warehouse,
  FileCheck,
  Receipt,
  BarChart3,
  Bot,
  Settings,
  ChevronRight,
  Boxes,
  Languages,
  LogOut,
  MessageSquare,
  Wrench,
  CreditCard
} from 'lucide-react';

const navKeys = [
  { to: '/dashboard', icon: <LayoutDashboard size={20} />, labelKey: 'dashboard', roles: ['ADMIN', 'DISPATCHER', 'DRIVER', 'FINANCE', 'VIEWER'] },
  { to: '/dashboard/orders', icon: <Package size={20} />, labelKey: 'orders', roles: ['ADMIN', 'DISPATCHER', 'DRIVER', 'VIEWER'] },
  { to: '/dashboard/dispatch', icon: <Boxes size={20} />, labelKey: 'dispatch', roles: ['ADMIN', 'DISPATCHER'] },
  { to: '/dashboard/fleet', icon: <Truck size={20} />, labelKey: 'fleet', roles: ['ADMIN', 'DISPATCHER', 'VIEWER'] },
  { to: '/dashboard/drivers', icon: <Users size={20} />, labelKey: 'drivers', roles: ['ADMIN', 'DISPATCHER', 'VIEWER'] },
  { to: '/dashboard/routes', icon: <Route size={20} />, labelKey: 'routes', roles: ['ADMIN', 'DISPATCHER', 'DRIVER', 'VIEWER'] },
  { to: '/dashboard/warehouses', icon: <Warehouse size={20} />, labelKey: 'warehouses', roles: ['ADMIN', 'DISPATCHER', 'VIEWER'] },
  { to: '/dashboard/proof-of-delivery', icon: <FileCheck size={20} />, labelKey: 'pod', roles: ['ADMIN', 'DISPATCHER', 'DRIVER', 'VIEWER'] },
  { to: '/dashboard/expenses', icon: <CreditCard size={20} />, labelKey: 'expenses', roles: ['ADMIN', 'DISPATCHER', 'FINANCE'] },
  { to: '/dashboard/maintenance', icon: <Wrench size={20} />, labelKey: 'maintenance', roles: ['ADMIN', 'DISPATCHER', 'VIEWER'] },
  { to: '/dashboard/chat', icon: <MessageSquare size={20} />, labelKey: 'message', roles: ['ADMIN', 'DISPATCHER', 'DRIVER', 'FINANCE'] },
  { to: '/dashboard/billing', icon: <Receipt size={20} />, labelKey: 'billing', roles: ['ADMIN', 'FINANCE'] },
  { to: '/dashboard/reports', icon: <BarChart3 size={20} />, labelKey: 'reports', roles: ['ADMIN', 'FINANCE'] },
  { to: '/dashboard/ai-assistant', icon: <Bot size={20} />, labelKey: 'ai_assistant', roles: ['ADMIN', 'DISPATCHER', 'FINANCE'] },
  { to: '/dashboard/settings', icon: <Settings size={20} />, labelKey: 'settings', roles: ['ADMIN'] },
  { to: '/dashboard/users', icon: <Users size={20} />, labelKey: 'users', roles: ['ADMIN'] },
];

export function Sidebar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'uz' : 'en';
    i18n.changeLanguage(newLang);
  };

  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white dark:bg-[#1E293B] border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
            <Truck size={18} className="text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            Logistik AI
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navKeys
            .filter(item => !item.roles || item.roles.includes(user?.role || ''))
            .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                  <span className="flex-1 text-sm font-medium">{t(`sidebar.${item.labelKey}`)}</span>
                  {isActive && <ChevronRight size={16} />}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold shadow-inner">
            {getUserInitials(user?.full_name || 'User')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.full_name || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate uppercase tracking-tighter font-bold">
              {user?.role || 'Guest'}
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
        >
          <LogOut size={18} />
          <span>{t('common.logout')}</span>
        </button>
      </div>

      {/* Language Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111827]">
        <button 
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-all border border-gray-300 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Languages size={18} className="text-[#2563EB]" />
            <span>{i18n.language === 'uz' ? "O'zbekcha" : 'English'}</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
            {i18n.language === 'en' ? 'UZ' : 'EN'}
          </span>
        </button>
      </div>
    </aside>
  );
}
