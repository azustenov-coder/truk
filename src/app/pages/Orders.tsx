import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { mockLoads, Load } from '../data/mockData';
import { LoadDetailsPanel } from '../components/LoadDetailsPanel';
import {
  ArrowRight,
  MoreVertical,
  Filter,
  Download,
  ChevronDown
} from 'lucide-react';
import { getCustomerIcon, getDriverIcon } from '../utils/icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";

const statusColors = {
  'In Transit': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Assigned': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'Delivered': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Loading': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'At Pickup': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Delayed': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function OrdersPage() {
  const { t } = useTranslation();
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredLoads = filterStatus === 'all'
    ? mockLoads
    : mockLoads.filter(load => load.status === filterStatus);

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${selectedLoad ? 'mr-96' : ''} transition-all duration-300`}>
        {/* Page Header */}
        <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {t('orders.title')}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('orders.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none bg-white dark:bg-transparent shadow-sm font-medium">
                    <Filter size={16} />
                    {t('orders.filter')}
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Filter Orders</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status</label>
                      <select
                        className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Loading">Loading</option>
                        <option value="At Pickup">At Pickup</option>
                        <option value="Delayed">Delayed</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Date Range</label>
                      <input type="date" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <DialogFooter className="mt-2 flex justify-end">
                    <DialogClose asChild>
                      <button className="px-5 py-2.5 w-full bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold shadow-sm text-center">Apply Filters</button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none bg-white dark:bg-transparent shadow-sm font-medium">
                    <Download size={16} />
                    {t('orders.export')}
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Export Orders Data</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                        <Download className="text-blue-500 w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Export as Excel or CSV</p>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Download currently filtered orders</p>
                    </div>
                  </div>
                  <DialogFooter className="mt-2 flex justify-end gap-2">
                    <DialogClose asChild>
                      <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm">Cancel</button>
                    </DialogClose>
                    <button className="px-5 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold shadow-sm ml-2">Export Now</button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('orders.total_loads')}</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {mockLoads.length}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400">{t('orders.in_transit')}</p>
              <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300 mt-1">
                {mockLoads.filter(l => l.status === 'In Transit').length}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <p className="text-sm text-green-600 dark:text-green-400">{t('orders.delivered')}</p>
              <p className="text-2xl font-semibold text-green-700 dark:text-green-300 mt-1">
                {mockLoads.filter(l => l.status === 'Delivered').length}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
              <p className="text-sm text-purple-600 dark:text-purple-400">{t('orders.assigned')}</p>
              <p className="text-2xl font-semibold text-purple-700 dark:text-purple-300 mt-1">
                {mockLoads.filter(l => l.status === 'Assigned').length}
              </p>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      {t('orders.load_id')}
                      <ChevronDown size={14} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      {t('orders.customer')}
                      <ChevronDown size={14} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      {t('orders.route')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      {t('orders.eta')}
                      <ChevronDown size={14} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      {t('common.status')}
                      <ChevronDown size={14} />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      {t('fleet.assigned_driver')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      {t('common.actions')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredLoads.map((load) => (
                  <tr
                    key={load.id}
                    onClick={() => setSelectedLoad(load)}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${selectedLoad?.id === load.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                      }`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {load.loadId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {getCustomerIcon(load.customer)}
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white font-medium">
                          {load.customer}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {load.pickup.city}, {load.pickup.state}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {load.pickup.location}
                          </span>
                        </div>
                        <ArrowRight size={16} className="text-gray-400 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {load.delivery.city}, {load.delivery.state}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {load.delivery.location}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {load.eta}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[load.status]
                          }`}
                      >
                        {load.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          {getDriverIcon(load.driver.name)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {load.driver.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {load.driver.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <MoreVertical size={18} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Side Panel */}
      {selectedLoad && (
        <LoadDetailsPanel
          load={selectedLoad}
          onClose={() => setSelectedLoad(null)}
        />
      )}
    </div>
  );
}
