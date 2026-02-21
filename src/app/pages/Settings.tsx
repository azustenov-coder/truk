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

export function SettingsPage() {
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F172A]">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
              SETTINGS
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Company Configuration & Governance Center
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Download size={16} />
              Export Configuration
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <Save size={16} />
              Save All Changes
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Company Setup</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Organizational structure and user management</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Multi-Branch Management */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Multi-Branch Management</h3>
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-5 space-y-4">
                <div className="flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-3">
                    <Building size={18} className="text-gray-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">Headquarters - Chicago</span>
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">Active</span>
                </div>
                <div className="pl-8 space-y-3">
                  <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -mx-2 transition-colors cursor-pointer">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Branch - Dallas</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">Active</span>
                  </div>
                  <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -mx-2 transition-colors cursor-pointer">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Branch - Atlanta</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">Active</span>
                  </div>
                  <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded -mx-2 transition-colors cursor-pointer">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Branch - Phoenix</span>
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-medium rounded-full">Pending</span>
                  </div>
                </div>
                <div className="pt-2">
                  <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1">
                    <Plus size={16} /> Add Branch
                  </button>
                </div>
              </div>
            </div>

            {/* User Roles & Permissions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">User Roles & Permissions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <ShieldCheck size={20} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Full system access</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">12 users</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <LayoutGrid size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Dispatcher</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Load & route management</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">28 users</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                      <CircleDollarSign size={20} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Finance</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Billing & accounting</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">8 users</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Eye size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Viewer</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Read-only access</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">15 users</span>
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Integrations</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Third-party system connections and status</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-sm transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <MapPin size={20} className="text-blue-500" />
                </div>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">Connected</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">GPS Tracking</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Geotab Fleet</p>
            </div>

            <div className="flex flex-col p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-sm transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <Clock size={20} className="text-green-500" />
                </div>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded-full">Connected</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">ELD System</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Omnitracs HOS</p>
            </div>

            <div className="flex flex-col p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-sm transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center">
                  <Receipt size={20} className="text-yellow-500" />
                </div>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium rounded-full">Not Connected</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">Accounting</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">QuickBooks Pro</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
