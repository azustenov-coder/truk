import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
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
  Boxes
} from 'lucide-react';

const navKeys = [
  { to: '/', icon: <LayoutDashboard size={20} />, labelKey: 'dashboard' },
  { to: '/orders', icon: <Package size={20} />, labelKey: 'orders' },
  { to: '/dispatch', icon: <Boxes size={20} />, labelKey: 'dispatch' },
  { to: '/fleet', icon: <Truck size={20} />, labelKey: 'fleet' },
  { to: '/drivers', icon: <Users size={20} />, labelKey: 'drivers' },
  { to: '/routes', icon: <Route size={20} />, labelKey: 'routes' },
  { to: '/warehouses', icon: <Warehouse size={20} />, labelKey: 'warehouses' },
  { to: '/proof-of-delivery', icon: <FileCheck size={20} />, labelKey: 'pod' },
  { to: '/billing', icon: <Receipt size={20} />, labelKey: 'billing' },
  { to: '/reports', icon: <BarChart3 size={20} />, labelKey: 'reports' },
  { to: '/ai-assistant', icon: <Bot size={20} />, labelKey: 'ai_assistant' },
  { to: '/settings', icon: <Settings size={20} />, labelKey: 'settings' },
];

export function Sidebar() {
  const { t } = useTranslation();
  return (
    <aside className="w-64 bg-white dark:bg-[#1E293B] border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
            <Truck size={18} className="text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            FleetFlow
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {navKeys.map((item) => (
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
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              John Doe
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Fleet Manager
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
