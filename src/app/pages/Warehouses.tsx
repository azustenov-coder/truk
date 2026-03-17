import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Warehouse,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Settings,
  Package,
  Truck,
  ShoppingBag,
  Calendar,
  ChevronDown,
  BarChart3,
  AlertCircle,
  Activity,
  Grid3X3
} from 'lucide-react';
import { useGlobalFilter } from '../providers/FilterProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "../components/ui/dialog";

interface WarehouseData {
  id: string;
  name: string;
  address: string;
  status: 'Active' | 'Maintenance' | 'Critical';
  capacityUtilization: number;
  totalCapacity: string;
  currentStock: number;
  incoming: number;
  outgoing: number;
  dockStatus: {
    available: number;
    total: number;
  };
  yard: string;
  appointments: {
    today: number;
    total: number;
  };
  alerts?: string;
}

const mockWarehouses: WarehouseData[] = [
  {
    id: '1',
    name: 'Chicago Distribution Center',
    address: '1245 Industrial Blvd, Chicago, IL 60601',
    status: 'Active',
    capacityUtilization: 87.3,
    totalCapacity: '534,000 sq ft',
    currentStock: 142,
    incoming: 238,
    outgoing: 5847,
    dockStatus: { available: 8, total: 12 },
    yard: '16 Total',
    appointments: { today: 45, total: 52 }
  },
  {
    id: '2',
    name: 'Atlanta Regional Hub',
    address: '8920 Commerce Dr, Atlanta, GA 30339',
    status: 'Critical',
    capacityUtilization: 94.8,
    totalCapacity: '425,000 sq ft',
    currentStock: 89,
    incoming: 156,
    outgoing: 8234,
    dockStatus: { available: 0, total: 10 },
    yard: '38 in / 41 Out',
    appointments: { today: 38, total: 41 },
    alerts: 'Critical'
  },
  {
    id: '3',
    name: 'Dallas Logistics Center',
    address: '4567 Distribution Way, Dallas, TX 75201',
    status: 'Active',
    capacityUtilization: 62.1,
    totalCapacity: '680,000 sq ft',
    currentStock: 76,
    incoming: 124,
    outgoing: 4156,
    dockStatus: { available: 12, total: 16 },
    yard: '24 Total',
    appointments: { today: 32, total: 38 }
  },
  {
    id: '4',
    name: 'Los Angeles Port Terminal',
    address: '3647 Harbor Blvd, Los Angeles, CA 90731',
    status: 'Maintenance',
    capacityUtilization: 45.2,
    totalCapacity: '890,000 sq ft',
    currentStock: 124,
    incoming: 289,
    outgoing: 6723,
    dockStatus: { available: 4, total: 20 },
    yard: '42 Total',
    appointments: { today: 28, total: 35 }
  },
  {
    id: '5',
    name: 'Miami Cross-Dock Facility',
    address: '5423 International Dr, Miami, FL 33166',
    status: 'Active',
    capacityUtilization: 73.6,
    totalCapacity: '310,000 sq ft',
    currentStock: 94,
    incoming: 167,
    outgoing: 3412,
    dockStatus: { available: 5, total: 8 },
    yard: '12 Total',
    appointments: { today: 22, total: 28 }
  }
];

export function WarehousesPage() {
  const { t } = useTranslation();
  const { globalLocationFilter, setGlobalLocationFilter } = useGlobalFilter();
  const [filterStatus, setFilterStatus] = useState<string>('All Status');
  const [filterCapacity, setFilterCapacity] = useState<string>('All Capacities');

  const allLocations = Array.from(new Set(mockWarehouses.map(w => w.address.split(',')[1].trim()))).sort();

  const getFilteredWarehouses = () => {
    return mockWarehouses.filter(w => {
      // Location Logic
      if (globalLocationFilter !== 'All Locations' && globalLocationFilter !== t('fleet.all_locations')) {
        if (!w.address.includes(globalLocationFilter)) return false;
      }

      // Status Logic
      if (filterStatus !== 'All Status' && filterStatus !== t('fleet.all_status')) {
        const internalStatus = filterStatus === t('common.active') ? 'Active' :
                               filterStatus === t('common.maintenance') ? 'Maintenance' :
                               filterStatus === t('common.critical') ? 'Critical' : filterStatus;
        if (w.status !== internalStatus) return false;
      }

      // Capacity Logic
      if (filterCapacity !== 'All Capacities' && filterCapacity !== t('warehouses.all_capacities')) {
        if (filterCapacity === '> 80%') {
          if (w.capacityUtilization <= 80) return false;
        } else if (filterCapacity === '50% - 80%') {
          if (w.capacityUtilization < 50 || w.capacityUtilization > 80) return false;
        } else if (filterCapacity === '< 50%') {
          if (w.capacityUtilization >= 50) return false;
        }
      }
      return true;
    });
  };

  const filteredWarehouses = getFilteredWarehouses();
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseData>(mockWarehouses[0]);

  const totalWarehouses = filteredWarehouses.length;
  const avgUtilization = totalWarehouses > 0 ? (filteredWarehouses.reduce((acc, w) => acc + w.capacityUtilization, 0) / totalWarehouses).toFixed(1) : "0.0";
  const criticalAlerts = filteredWarehouses.filter(w => w.status === 'Critical').length;
  const todayThroughput = filteredWarehouses.reduce((acc, w) => acc + w.incoming + w.outgoing, 0);

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#0F172A]">
        {/* Header */}
        <div className="p-6 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {t('warehouses.title')}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('warehouses.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Settings size={16} />
                {t('common.settings')}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm bg-white dark:bg-[#1E293B] focus:outline-none font-medium">
                {t('warehouses.view_analytics')}
              </button>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm focus:outline-none font-medium">
                    + {t('warehouses.add_warehouse')}
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{t('warehouses.add_warehouse')}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-5 py-4 text-left">
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Warehouse Name</label>
                      <input type="text" placeholder="e.g. Northeast Logistics Center" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('warehouses.total_capacity')} (sq ft)</label>
                        <input type="number" placeholder="50000" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('warehouses.dock_doors')}</label>
                        <input type="number" placeholder="12" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Region</label>
                      <select className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Northeast</option>
                        <option>Midwest</option>
                        <option>Southeast</option>
                        <option>West</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <button className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm">{t('common.cancel')}</button>
                    </DialogClose>
                    <button className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold shadow-sm ml-2">{t('warehouses.add_warehouse')}</button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                <Warehouse size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">
                  {totalWarehouses}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">{t('warehouses.active_warehouses')}</p>
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
                <BarChart3 size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300">
                  {avgUtilization}%
                </p>
                <p className="text-sm text-indigo-600 dark:text-indigo-400">{t('warehouses.avg_utilization')}</p>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center">
                <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-red-700 dark:text-red-300">
                  {criticalAlerts}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">{t('warehouses.critical_alerts')}</p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center">
                <Truck size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
                  {todayThroughput.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">{t('warehouses.throughput')}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('fleet.location')}:</span>
              <select
                value={globalLocationFilter}
                onChange={(e) => setGlobalLocationFilter(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All Locations">{t('fleet.all_locations')}</option>
                {allLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('common.status')}:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All Status">{t('fleet.all_status')}</option>
                <option value={t('common.active')}>{t('common.active')}</option>
                <option value={t('common.maintenance')}>{t('common.maintenance')}</option>
                <option value={t('common.critical')}>{t('common.critical')}</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('warehouses.capacity')}:</span>
              <select
                value={filterCapacity}
                onChange={(e) => setFilterCapacity(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All Capacities">{t('warehouses.all_capacities')}</option>
                <option value="> 80%">{t('warehouses.over_80')}</option>
                <option value="50% - 80%">{t('warehouses.between_50_80')}</option>
                <option value="< 50%">{t('warehouses.under_50')}</option>
              </select>
            </div>
            {(globalLocationFilter !== 'All Locations' || filterStatus !== 'All Status' || filterCapacity !== 'All Capacities') && (
              <button
                onClick={() => {
                  setGlobalLocationFilter('All Locations');
                  setFilterStatus('All Status');
                  setFilterCapacity('All Capacities');
                }}
                className="text-sm text-[#2563EB] hover:underline ml-2"
              >
                {t('common.clear_all')}
              </button>
            )}
          </div>
        </div>

        {/* Warehouse Cards Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            {filteredWarehouses.map((warehouse) => {
                const color = warehouse.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                             warehouse.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30' :
                             'bg-red-100 text-red-700 dark:bg-red-900/30';
                
                const utilizationColor = warehouse.capacityUtilization >= 90 ? 'text-red-500' :
                                       warehouse.capacityUtilization >= 75 ? 'text-yellow-500' :
                                       'text-green-500';

                return (
              <div
                key={warehouse.id}
                onClick={() => setSelectedWarehouse(warehouse)}
                className={`bg-white dark:bg-[#1E293B] rounded-xl border-2 p-0 cursor-pointer overflow-hidden transition-all ${selectedWarehouse?.id === warehouse.id
                    ? 'border-[#2563EB] shadow-lg'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
              >
                {/* Header */}
                <div className="p-4 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {warehouse.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
                        {warehouse.status === 'Active' ? t('common.active') :
                         warehouse.status === 'Maintenance' ? t('common.maintenance') :
                         t('common.critical')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin size={14} />
                      {warehouse.address}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('warehouses.capacity_utilization')}</span>
                        <span className={`text-sm font-bold ${utilizationColor}`}>{warehouse.capacityUtilization}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all ${warehouse.capacityUtilization >= 90 ? 'bg-red-500' : warehouse.capacityUtilization >= 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${warehouse.capacityUtilization}%` }}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                            <p className="text-[10px] font-bold text-gray-500 uppercase">{t('warehouses.current')}</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{warehouse.currentStock}</p>
                        </div>
                        <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                            <p className="text-[10px] font-bold text-gray-500 uppercase">{t('warehouses.incoming')}</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">+{warehouse.incoming}</p>
                        </div>
                        <div className="text-center p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                            <p className="text-[10px] font-bold text-gray-500 uppercase">{t('warehouses.outgoing')}</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">-{warehouse.outgoing}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Grid3X3 size={14} />
                            <span>{t('warehouses.dock_status')}</span>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{warehouse.dockStatus.available} / {warehouse.dockStatus.total}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Activity size={14} />
                            <span>{t('warehouses.yard')}</span>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{warehouse.yard}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar size={14} />
                            <span>{t('warehouses.today_appointments')}</span>
                        </div>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{warehouse.appointments.today} / {warehouse.appointments.total}</span>
                    </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <Settings size={14} />
                        {t('common.settings')}
                    </button>
                    
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-semibold hover:bg-[#1d4ed8] transition-colors shadow-sm">
                                <BarChart3 size={14} />
                                {t('common.view_details')}
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{warehouse.name}</DialogTitle>
                                <DialogDescription>{warehouse.address}</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">{t('warehouses.total_capacity')}</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{warehouse.totalCapacity}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">{t('warehouses.dock_doors')}</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{warehouse.dockStatus.total} Platforms</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 italic text-gray-500 text-sm text-center">
                                    Analytics and detailed inventory breakdown visualization coming soon...
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <button className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold text-sm shadow-lg">{t('common.done')}</button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
              </div>
                );
            })}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Selection Context */}
      <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E293B] overflow-auto p-6 hidden xl:block">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {t('warehouses.warehouse_details')}
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Warehouse className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{selectedWarehouse.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedWarehouse.status === 'Active' ? t('common.active') :
                     selectedWarehouse.status === 'Maintenance' ? t('common.maintenance') :
                     t('common.critical')}
                  </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-2">Live Throughput (Live)</p>
                  <div className="h-20 flex items-end gap-1 px-1">
                      {[40, 60, 45, 80, 55, 70, 90, 65, 50, 75, 85, 95].map((h, i) => (
                          <div key={i} className="flex-1 bg-blue-500/20 dark:bg-blue-500/10 rounded-t-sm relative group">
                              <div 
                                  className="absolute bottom-0 left-0 right-0 bg-blue-500/60 dark:bg-blue-500/40 rounded-t-sm transition-all group-hover:bg-blue-500"
                                  style={{ height: `${h}%` }}
                              />
                          </div>
                      ))}
                  </div>
              </div>
              
              <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                          <ShoppingBag size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Total Items</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">12,482</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                          <Truck size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Fleet Active</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedWarehouse.appointments.total}</span>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
