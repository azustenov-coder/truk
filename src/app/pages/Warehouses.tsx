import { useState } from 'react';
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
  ChevronDown
} from 'lucide-react';

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
    totalCapacity: '320,000 sq ft',
    currentStock: 67,
    incoming: 178,
    outgoing: 3892,
    dockStatus: { available: 6, total: 8 },
    yard: '18 Total',
    appointments: { today: 22, total: 26 }
  },
  {
    id: '6',
    name: 'Phoenix Distribution Hub',
    address: '9870 Desert Ridge Pkwy, Phoenix, AZ 85054',
    status: 'Active',
    capacityUtilization: 56.9,
    totalCapacity: '475,000 sq ft',
    currentStock: 94,
    incoming: 167,
    outgoing: 5129,
    dockStatus: { available: 9, total: 14 },
    yard: '28 Total',
    appointments: { today: 31, total: 36 }
  }
];

const inventoryBreakdown = [
  { category: 'Electronics', units: 1847, percentage: 32 },
  { category: 'Automotive Parts', units: 2156, percentage: 37 },
  { category: 'Consumer Goods', units: 1844, percentage: 31 }
];

export function WarehousesPage() {
  const [filterLocation, setFilterLocation] = useState<string>('All Regions');
  const [filterStatus, setFilterStatus] = useState<string>('All Status');
  const [filterCapacity, setFilterCapacity] = useState<string>('All Capacities');

  const allLocations = Array.from(new Set(mockWarehouses.map(w => w.address.split(',')[1].trim()))).sort();

  const getFilteredWarehouses = () => {
    return mockWarehouses.filter(w => {
      if (filterStatus !== 'All Status' && w.status !== filterStatus) return false;
      if (filterLocation !== 'All Regions' && !w.address.includes(filterLocation)) return false;
      if (filterCapacity !== 'All Capacities') {
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

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Page Header */}
        <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Warehouses / Hubs
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Monitor warehouse capacity, inventory, and operations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Settings size={16} />
                Settings
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                View Analytics
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm">
                + Add New Warehouse
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                <Warehouse size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">
                  {totalWarehouses}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Active Warehouses</p>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-green-700 dark:text-green-300">
                  {avgUtilization}%
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">Average Utilization</p>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-red-700 dark:text-red-300">
                  {criticalAlerts}
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">Critical Alerts</p>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center">
                <Package size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-purple-700 dark:text-purple-300">
                  847 / 1,205
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400">Today's Throughput</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Location:</span>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All Regions">All Regions</option>
                {allLocations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Capacity:</span>
              <select
                value={filterCapacity}
                onChange={(e) => setFilterCapacity(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All Capacities">All Capacities</option>
                <option value="> 80%">Over 80%</option>
                <option value="50% - 80%">50% - 80%</option>
                <option value="< 50%">Under 50%</option>
              </select>
            </div>
            {(filterLocation !== 'All Regions' || filterStatus !== 'All Status' || filterCapacity !== 'All Capacities') && (
              <button
                onClick={() => {
                  setFilterLocation('All Regions');
                  setFilterStatus('All Status');
                  setFilterCapacity('All Capacities');
                }}
                className="text-sm text-[#2563EB] hover:underline ml-2"
              >
                × Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Warehouse Cards Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            {filteredWarehouses.map((warehouse) => (
              <div
                key={warehouse.id}
                onClick={() => setSelectedWarehouse(warehouse)}
                className={`bg-white dark:bg-[#1E293B] rounded-xl border-2 p-6 cursor-pointer transition-all ${selectedWarehouse?.id === warehouse.id
                    ? 'border-[#2563EB] shadow-lg'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {warehouse.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${warehouse.status === 'Active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : warehouse.status === 'Maintenance'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                      >
                        {warehouse.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin size={14} />
                      {warehouse.address}
                    </p>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Capacity Utilization
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {warehouse.capacityUtilization}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${warehouse.capacityUtilization >= 90
                          ? 'bg-red-500'
                          : warehouse.capacityUtilization >= 75
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                      style={{ width: `${warehouse.capacityUtilization}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {warehouse.currentStock}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {warehouse.incoming}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Incoming</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {warehouse.outgoing}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Orders</p>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${warehouse.dockStatus.available > 0 ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                      Dock Status:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {warehouse.dockStatus.available} Available
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Truck size={14} />
                      Yard:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {warehouse.yard}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Calendar size={14} />
                      Today's Appointments:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {warehouse.appointments.today} in / {warehouse.appointments.total} Out
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Warehouse Details */}
      <div className="w-80 bg-white dark:bg-[#1E293B] border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Warehouse Details
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Warehouse size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedWarehouse.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedWarehouse.address.split(',')[1]}, {selectedWarehouse.address.split(',')[2]}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Capacity</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedWarehouse.totalCapacity}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Utilization</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedWarehouse.capacityUtilization}%
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Dock Doors</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedWarehouse.dockStatus.available} / {selectedWarehouse.dockStatus.total}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available / Total</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <p className={`text-sm font-medium ${selectedWarehouse.status === 'Active' ? 'text-green-600 dark:text-green-400' :
                  selectedWarehouse.status === 'Maintenance' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                }`}>
                {selectedWarehouse.status}
              </p>
            </div>
          </div>

          {/* Inventory Breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Inventory Breakdown
            </h3>
            <div className="space-y-3">
              {inventoryBreakdown.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.category === 'Electronics' ? 'bg-blue-500' :
                          item.category === 'Automotive Parts' ? 'bg-green-500' :
                            'bg-purple-500'
                        }`} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.units} units
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    {item.percentage}% of total
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dock Schedule Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Dock Schedule Timeline
            </h3>
            <div className="space-y-2">
              {[
                { dock: 'Dock 13', time: '8:00 AM', status: 'In Use', color: 'bg-blue-500' },
                { dock: 'Dock 14', time: '9:30 AM', status: 'Available', color: 'bg-green-500' },
                { dock: 'Dock 15', time: '10:00 AM', status: 'In Use', color: 'bg-blue-500' },
                { dock: 'Dock 16', time: '11:00 AM', status: 'Scheduled', color: 'bg-yellow-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-gray-700 dark:text-gray-300">{item.dock}</span>
                  <span className="text-gray-500 dark:text-gray-400">{item.time}</span>
                  <span className={`ml-auto px-2 py-0.5 rounded text-xs ${item.status === 'In Use' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      item.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
