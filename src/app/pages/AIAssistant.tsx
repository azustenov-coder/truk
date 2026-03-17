import {
  History,
  Settings as SettingsIcon,
  AlertTriangle,
  UserCircle,
  AlertCircle,
  DollarSign,
  FileText
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AIAssistantPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F172A]">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
        <div className="mb-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-lg p-3 flex items-start gap-3">
            <AlertTriangle size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
              {t('ai_assistant.disclaimer')}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
              {t('ai_assistant.title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('ai_assistant.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <History size={16} />
              {t('ai_assistant.view_history')}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <SettingsIcon size={16} />
              {t('ai_assistant.settings')}
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-2 gap-6">

          {/* Driver-Truck Suggestions */}
          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <UserCircle size={18} className="text-blue-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t('ai_assistant.driver_suggestions.title')}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full inline-block mt-1">{t('ai_assistant.driver_suggestions.data_source')}</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {/* Suggestion 1 */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    Michael Rodriguez → Truck T-247
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium">{t('common.high')}</span>
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {t('ai_assistant.driver_suggestions.route_compatibility')}: 98% | {t('ai_assistant.driver_suggestions.hos')}: Available | {t('ai_assistant.driver_suggestions.performance')}: 4.9/5
                </p>
                <div className="flex gap-2">
                  <button onClick={() => alert('Accepted Truck T-247 for Michael Rodriguez')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg font-medium text-xs hover:bg-green-600 transition-colors">{t('common.active')}</button>
                  <button onClick={() => alert('Dismissed suggestion')} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{t('common.cancel')}</button>
                  <button onClick={() => alert('Override dialog opened')} className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg font-medium text-xs hover:bg-yellow-600 transition-colors">{t('fleet.reassign')}</button>
                </div>
              </div>

              {/* Suggestion 2 */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    Jennifer Chen → Truck T-189
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-medium">Medium</span>
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Route compatibility: 87% | HOS: 8h remaining | Performance: 4.7/5
                </p>
                <div className="flex gap-2">
                  <button onClick={() => alert('Accepted Truck T-189 for Jennifer Chen')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg font-medium text-xs hover:bg-green-600 transition-colors">{t('common.active')}</button>
                  <button onClick={() => alert('Dismissed suggestion')} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{t('common.cancel')}</button>
                  <button onClick={() => alert('Override dialog opened')} className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg font-medium text-xs hover:bg-yellow-600 transition-colors">{t('fleet.reassign')}</button>
                </div>
              </div>

              {/* Suggestion 3 */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    David Thompson → Truck T-156
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium">Low</span>
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Route compatibility: 72% | HOS: Limited | Performance: 4.5/5
                </p>
                <div className="flex gap-2">
                  <button onClick={() => alert('Accepted Truck T-156 for David Thompson')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg font-medium text-xs hover:bg-green-600 transition-colors">{t('common.active')}</button>
                  <button onClick={() => alert('Dismissed suggestion')} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{t('common.cancel')}</button>
                  <button onClick={() => alert('Override dialog opened')} className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg font-medium text-xs hover:bg-yellow-600 transition-colors">{t('fleet.reassign')}</button>
                </div>
              </div>
            </div>
          </div>

          {/* Delay Risk Alerts */}
          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle size={18} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t('ai_assistant.delay_alerts.title')}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full inline-block mt-1">{t('ai_assistant.delay_alerts.data_source')}</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Alert 1 */}
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    Route 15 - Chicago to Detroit
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium">{t('ai_assistant.delay_alerts.high_risk')}</span>
                  </h3>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">2-4 hours</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Heavy snow forecast, construction delays, HOS approaching limit
                </p>
                <div className="flex gap-2">
                  <button onClick={() => alert('Initiating reroute for Route 15...')} className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg font-medium text-xs hover:bg-[#1d4ed8] transition-colors">{t('ai_assistant.delay_alerts.reroute')}</button>
                  <button onClick={() => alert('Customer notified about Delay on Route 15')} className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1E293B] rounded-lg font-medium text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{t('ai_assistant.delay_alerts.notify_customer')}</button>
                  <button onClick={() => alert('Alert dismissed')} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{t('common.cancel')}</button>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    Route 7 - Dallas to Houston
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-medium">Medium Risk</span>
                  </h3>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">1-2 hours</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Traffic congestion during peak hours, fuel stop required
                </p>
                <div className="flex gap-2">
                  <button onClick={() => alert('Schedule adjusted for Route 7')} className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg font-medium text-xs hover:bg-[#1d4ed8] transition-colors">{t('ai_assistant.delay_alerts.reroute')}</button>
                  <button onClick={() => alert('Alert dismissed')} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{t('common.cancel')}</button>
                </div>
              </div>

              {/* Alert 3 */}
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    Route 22 - Phoenix to Las Vegas
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium">Low Risk</span>
                  </h3>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">30 min</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Minor weather conditions, all systems normal
                </p>
                <div className="flex gap-2">
                  <button onClick={() => alert('Alert dismissed')} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{t('common.cancel')}</button>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Leak Detection */}
          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-6" style={{ gridColumn: '1 / span 1' }}>
            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center">
                  <DollarSign size={18} className="text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t('ai_assistant.cost_leak.title')}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full inline-block mt-1">{t('ai_assistant.cost_leak.data_source')}</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {/* Insight 1 */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Fuel Inefficiency - Truck T-189
                  </h3>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">-$2,340</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  15% above fleet average, aggressive driving patterns detected
                </p>
                <div className="flex gap-2">
                  <button onClick={() => alert('Driver Training Assigned')} className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg font-medium text-xs hover:bg-blue-700 transition-colors">{t('ai_assistant.cost_leak.driver_training')}</button>
                  <button onClick={() => alert('Route Optimization initiated')} className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1E293B] rounded-lg font-medium text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{t('ai_assistant.cost_leak.route_optimization')}</button>
                  <button onClick={() => alert('Dismissed')} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{t('common.cancel')}</button>
                </div>
              </div>

              {/* Insight 2 */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Deadhead Miles - Route 15
                  </h3>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">-$1,890</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  23% empty miles, backhaul opportunities missed
                </p>
                <div className="flex gap-2">
                  <button onClick={() => alert('Searching for Backhauls...')} className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg font-medium text-xs hover:bg-blue-700 transition-colors">{t('ai_assistant.cost_leak.find_backhaul')}</button>
                  <button onClick={() => alert('Dismissed')} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{t('common.cancel')}</button>
                </div>
              </div>

              {/* Insight 3 */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Missed Accessorials
                  </h3>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">-$950</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Detention charges not billed, loading fees missed
                </p>
                <div className="flex gap-2">
                  <button onClick={() => alert('Billing opened for review')} className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg font-medium text-xs hover:bg-blue-700 transition-colors">Review Billing</button>
                  <button onClick={() => alert('Dismissed')} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Dismiss</button>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice & Billing Anomalies */}
          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden mt-6" style={{ gridColumn: '2 / span 1' }}>
            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                  <FileText size={18} className="text-green-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t('ai_assistant.billing_anomalies.title')}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full inline-block mt-1">{t('ai_assistant.billing_anomalies.data_source')}</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {/* Anomaly 1 */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Missing Charges - INV-24-3847
                  </h3>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">+$1,250</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Fuel surcharge not applied, detention fees missing
                </p>
                <div className="flex gap-2">
                  <button onClick={() => alert('Invoice INV-24-3847 Updated.')} className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg font-medium text-xs hover:bg-blue-700 transition-colors">{t('ai_assistant.billing_anomalies.update_invoice')}</button>
                  <button onClick={() => alert('Dismissed')} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{t('common.cancel')}</button>
                </div>
              </div>

              {/* Anomaly 2 */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Duplicate Invoice - INV-24-3821
                  </h3>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">-$3,200</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Same load billed twice, customer notification required
                </p>
                <div className="flex gap-2">
                  <button onClick={() => alert('Duplicate invoice voided.')} className="px-3 py-1.5 bg-red-600 text-white rounded-lg font-medium text-xs hover:bg-red-700 transition-colors">{t('ai_assistant.billing_anomalies.void_duplicate')}</button>
                  <button onClick={() => alert('Opening customer contact dialog...')} className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1E293B] rounded-lg font-medium text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">{t('ai_assistant.billing_anomalies.contact_customer')}</button>
                  <button onClick={() => alert('Dismissed')} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{t('common.cancel')}</button>
                </div>
              </div>

              {/* Anomaly 3 */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Rate Mismatch - Load L-4729
                  </h3>
                  <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">Review</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Invoiced rate differs from contracted rate by $180
                </p>
                <div className="flex gap-2">
                  <button onClick={() => alert('Contract verified')} className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg font-medium text-xs hover:bg-blue-700 transition-colors">{t('ai_assistant.billing_anomalies.verify_contract')}</button>
                  <button onClick={() => alert('Dismissed')} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">{t('common.cancel')}</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
