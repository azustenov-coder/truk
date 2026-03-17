import {
  Download,
  Save,
  Building2,
  Building,
  Plus,
  ShieldCheck,
  LayoutGrid,
  CircleDollarSign,
  Eye,
  Plug,
  MapPin,
  Clock,
  Receipt
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SettingsPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F172A]">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
              {t('settings.title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('settings.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Download size={16} />
              {t('settings.export_config')}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <Save size={16} />
              {t('settings.save_all')}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Company Setup Section */}
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <Building2 size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.company_setup.title')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.company_setup.desc')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Multi-Branch Management */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{t('settings.company_setup.multi_branch')}</h3>
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-3">
                    <Building size={18} className="text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">{t('settings.company_setup.headquarters')} - Chicago</span>
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">{t('common.active')}</span>
                </div>
                <div className="pl-8 space-y-3">
                  <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -mx-2 transition-colors cursor-pointer">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('settings.company_setup.branch')} - Dallas</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">{t('common.active')}</span>
                  </div>
                  <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -mx-2 transition-colors cursor-pointer">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('settings.company_setup.branch')} - Atlanta</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">{t('common.active')}</span>
                  </div>
                  <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -mx-2 transition-colors cursor-pointer">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('settings.company_setup.branch')} - Phoenix</span>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-medium rounded-full">{t('common.pending')}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1">
                    <Plus size={16} /> {t('settings.company_setup.add_branch')}
                  </button>
                </div>
              </div>
            </div>

            {/* User Roles & Permissions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{t('settings.roles.title')}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <ShieldCheck size={20} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('settings.roles.admin')}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('settings.roles.admin_desc')}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t('settings.roles.users_count', { count: 12 })}</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <LayoutGrid size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('settings.roles.dispatcher')}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('settings.roles.dispatcher_desc')}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t('settings.roles.users_count', { count: 28 })}</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                      <CircleDollarSign size={20} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('settings.roles.finance')}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('settings.roles.finance_desc')}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t('settings.roles.users_count', { count: 8 })}</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Eye size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('settings.roles.viewer')}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('settings.roles.viewer_desc')}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{t('settings.roles.users_count', { count: 15 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Integrations */}
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <Plug size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('settings.integrations.title')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.integrations.desc')}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-sm transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <MapPin size={20} className="text-blue-500" />
                </div>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">{t('settings.integrations.connected')}</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">{t('settings.integrations.gps')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Geotab Fleet</p>
            </div>

            <div className="flex flex-col p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-sm transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <Clock size={20} className="text-green-500" />
                </div>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">{t('settings.integrations.connected')}</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">{t('settings.integrations.eld')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Omnitracs HOS</p>
            </div>

            <div className="flex flex-col p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-sm transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
                  <Receipt size={20} className="text-yellow-500" />
                </div>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full">{t('settings.integrations.not_connected')}</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">{t('settings.integrations.accounting')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">QuickBooks Pro</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
