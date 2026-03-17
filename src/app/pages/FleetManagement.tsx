import { useState } from 'react';
import {
  Truck,
  TrendingUp,
  AlertTriangle,
  Activity,
  MapPin,
  Calendar,
  Gauge,
  Wrench,
  ChevronDown
} from 'lucide-react';
import { getDriverIcon } from '../utils/icons';
import { useGlobalFilter } from '../providers/FilterProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import { useTranslation } from 'react-i18next';

interface Vehicle {
  id: string;
  plate: string;
  type: string;
  icon: string;
  status: 'Available' | 'In Use' | 'Maintenance';
  driver?: {
    name: string;
    avatar: string;
  };
  location: string;
  lastGPSPing: string;
  health: 'Good' | 'Warning' | 'Critical';
  nextMaintenance: string;
}

const mockVehicles: Vehicle[] = [
  {
    id: 'FL-4832',
    plate: 'FL-4832',
    type: 'Freightliner Cascadia',
    icon: '🚛',
    status: 'Available',
    driver: { name: 'Michael Rodriguez', avatar: '👨‍✈️' },
    location: 'Chicago Hub Terminal',
    lastGPSPing: '2 minutes ago (Feb 6, 14:57)',
    health: 'Good',
    nextMaintenance: 'Feb 15'
  },
  {
    id: 'TX-7841',
    plate: 'TX-7841',
    type: 'Volvo VNL',
    icon: '🚚',
    status: 'In Use',
    driver: { name: 'Jennifer Chen', avatar: '👩‍✈️' },
    location: 'Dallas, TX',
    lastGPSPing: '5 minutes ago (Feb 6, 14:54)',
    health: 'Good',
    nextMaintenance: 'Feb 22'
  },
  {
    id: 'CA-3952',
    plate: 'CA-3952',
    type: 'Kenworth T680',
    icon: '🚐',
    status: 'Maintenance',
    location: 'Los Angeles, CA',
    lastGPSPing: '2 hours ago (Feb 6, 13:01)',
    health: 'Warning',
    nextMaintenance: 'In Progress'
  },
  {
    id: 'CO-5629',
    plate: 'CO-5629',
    type: 'Peterbilt 579',
    icon: '🚛',
    status: 'Available',
    driver: { name: 'David Thompson', avatar: '👨‍✈️' },
    location: 'Denver, CO',
    lastGPSPing: '8 minutes ago (Feb 6, 14:51)',
    health: 'Good',
    nextMaintenance: 'Feb 28'
  },
  {
    id: 'TRL-8901',
    plate: 'TRL-8901',
    type: '53ft Dry Van',
    icon: '📦',
    status: 'In Use',
    driver: { name: 'Maria Santos', avatar: '👩‍✈️' },
    location: 'Atlanta, GA',
    lastGPSPing: '1 minute ago (Feb 6, 14:58)',
    health: 'Good',
    nextMaintenance: 'Mar 5'
  }
];

const statusColors = {
  'Available': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'In Use': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Maintenance': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};

const healthColors = {
  'Good': 'bg-green-500',
  'Warning': 'bg-yellow-500',
  'Critical': 'bg-red-500'
};

export function FleetManagementPage() {
  const { t } = useTranslation();
  const { globalLocationFilter, setGlobalLocationFilter } = useGlobalFilter();
  const [filterType, setFilterType] = useState<string>('All Types');
  const [filterStatus, setFilterStatus] = useState<string>('All Status');
  const [filterHealth, setFilterHealth] = useState<string>('All Health');

  const allLocations = Array.from(new Set(mockVehicles.map(v => v.location))).sort();

  const getFilteredVehicles = () => {
    return mockVehicles.filter(v => {
      // Type Logic
      if (filterType !== 'All Types' && filterType !== t('fleet.all_types')) {
        const checkType = filterType === 'Trucks' || filterType === t('fleet.trucks');
        if (checkType && v.icon === '📦') return false; // Trailers have 📦
        if (!checkType && v.icon !== '📦') return false;
      }

      // Status Logic
      if (filterStatus !== 'All Status' && filterStatus !== t('fleet.all_status')) {
        if (v.status !== filterStatus && v.status !== (filterStatus === t('fleet.available') ? 'Available' : filterStatus === t('fleet.in_use') ? 'In Use' : 'Maintenance')) return false;
      }

      // Location Logic
      if (globalLocationFilter !== 'All Locations' && globalLocationFilter !== t('fleet.all_locations')) {
        if (v.location !== globalLocationFilter) return false;
      }

      // Health Logic
      if (filterHealth !== 'All Health' && filterHealth !== t('fleet.all_health')) {
        if (v.health !== filterHealth && v.health !== (filterHealth === t('fleet.health_good') ? 'Good' : filterHealth === t('fleet.health_warning') ? 'Warning' : 'Critical')) return false;
      }

      return true;
    });
  };

  const filteredVehicles = getFilteredVehicles();
  const totalVehicles = filteredVehicles.length;
  const available = filteredVehicles.filter(v => v.status === 'Available').length;
  const inMaintenance = filteredVehicles.filter(v => v.status === 'Maintenance').length;
  const healthScore = 92;

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t('fleet.title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('fleet.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm bg-white dark:bg-[#1E293B]">
                  {t('fleet.import_data')}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t('fleet.import_fleet_data_title')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                      <Truck className="text-blue-500 w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('fleet.click_upload')}</p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{t('fleet.csv_excel_only')}</p>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm">{t('common.cancel')}</button>
                  </DialogClose>
                  <button className="px-5 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold shadow-sm ml-2">{t('fleet.import_data')}</button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm">
                  <Wrench size={16} />
                  {t('fleet.schedule_maintenance')}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{t('fleet.schedule_maintenance')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('fleet.select_vehicle')}</label>
                    <select className="px-3 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900 dark:text-white shadow-sm">
                      <option>FL-4832 (Freightliner Cascadia)</option>
                      <option>TX-7841 (Volvo VNL)</option>
                      <option>CA-3952 (Kenworth T680)</option>
                      <option>CO-5629 (Peterbilt 579)</option>
                      <option>TRL-8901 (53ft Dry Van)</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('fleet.maintenance_type')}</label>
                    <select className="px-3 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900 dark:text-white shadow-sm">
                      <option>{t('fleet.routine_inspection')}</option>
                      <option>{t('fleet.oil_filter_change')}</option>
                      <option>{t('fleet.brake_replacement')}</option>
                      <option>{t('fleet.engine_repair')}</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('fleet.date')}</label>
                      <input type="date" className="px-3 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900 dark:text-white shadow-sm" />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('fleet.time')}</label>
                      <input type="time" className="px-3 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900 dark:text-white shadow-sm" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-2">
                  <DialogClose asChild>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm">{t('common.cancel')}</button>
                  </DialogClose>
                  <button className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold shadow-sm ml-2">{t('fleet.schedule')}</button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-[#1d4ed8] transition-colors shadow-sm">
                  + {t('fleet.add_vehicle')}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{t('fleet.add_new_vehicle')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('fleet.vehicle_id')}</label>
                      <input type="text" placeholder="e.g. TRK-1020" className="px-3 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900 dark:text-white shadow-sm placeholder:text-gray-400" />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('fleet.license_plate')}</label>
                      <input type="text" placeholder="e.g. CA-5522" className="px-3 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900 dark:text-white shadow-sm placeholder:text-gray-400" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('fleet.vehicle_type')}</label>
                    <select className="px-3 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900 dark:text-white shadow-sm">
                      <option>Freightliner Cascadia</option>
                      <option>Volvo VNL</option>
                      <option>Kenworth T680</option>
                      <option>Dry Van Trailer</option>
                      <option>Reefer Trailer</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('fleet.hub_location')}</label>
                    <select className="px-3 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900 dark:text-white shadow-sm">
                      <option>Chicago Hub Terminal</option>
                      <option>Dallas, TX</option>
                      <option>Los Angeles, CA</option>
                      <option>Denver, CO</option>
                      <option>Atlanta, GA</option>
                    </select>
                  </div>
                </div>
                <DialogFooter className="mt-2">
                  <DialogClose asChild>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm">{t('common.cancel')}</button>
                  </DialogClose>
                  <button className="px-5 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold shadow-sm ml-2">{t('fleet.save_vehicle')}</button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="flex items-center justify-between gap-4 mt-8 pb-4">
          <div 
            onClick={() => {
              setFilterType('All Types');
              setFilterStatus('All Status');
              setGlobalLocationFilter('All Locations');
              setFilterHealth('All Health');
            }}
            className="flex-1 bg-[#F0F5FF] dark:bg-blue-900/20 rounded-xl p-4 flex items-center justify-between shadow-sm border border-blue-100 dark:border-blue-900/30 cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/40 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-blue-900/40 rounded-lg flex items-center justify-center text-blue-500 shadow-sm border border-blue-50">
                <Truck size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#1E3A8A] dark:text-blue-300 leading-none">{totalVehicles}</p>
                <p className="text-xs font-semibold text-[#1E3A8A]/70 dark:text-blue-400 mt-1 uppercase tracking-wide">{t('fleet.total_vehicles')}</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => {
              setFilterStatus('Available');
              setFilterType('All Types');
              setGlobalLocationFilter('All Locations');
              setFilterHealth('All Health');
            }}
            className="flex-1 bg-[#F0FDF4] dark:bg-green-900/20 rounded-xl p-4 flex items-center justify-between shadow-sm border border-green-100 dark:border-green-900/30 cursor-pointer hover:bg-green-100/50 dark:hover:bg-green-900/40 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-green-900/40 rounded-lg flex items-center justify-center text-green-500 shadow-sm border border-green-50">
                <Activity size={20} className="text-green-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#166534] dark:text-green-300 leading-none">{available}</p>
                <p className="text-xs font-semibold text-[#166534]/70 dark:text-green-400 mt-1 uppercase tracking-wide">{t('fleet.available')}</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => {
              setFilterStatus('In Use');
              setFilterType('All Types');
              setGlobalLocationFilter('All Locations');
              setFilterHealth('All Health');
            }}
            className="flex-1 bg-[#FEFCE8] dark:bg-yellow-900/20 rounded-xl p-4 flex items-center justify-between shadow-sm border border-yellow-100 dark:border-yellow-900/30 cursor-pointer hover:bg-yellow-100/50 dark:hover:bg-yellow-900/40 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-yellow-900/40 rounded-lg flex items-center justify-center text-yellow-500 shadow-sm border border-yellow-50">
                <TrendingUp size={20} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#854D0E] dark:text-yellow-300 leading-none">{mockVehicles.filter(v => v.status === 'In Use').length}</p>
                <p className="text-xs font-semibold text-[#854D0E]/70 dark:text-yellow-400 mt-1 uppercase tracking-wide">{t('fleet.in_use')}</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => {
              setFilterStatus('Maintenance');
              setFilterType('All Types');
              setGlobalLocationFilter('All Locations');
              setFilterHealth('All Health');
            }}
            className="flex-1 bg-[#FEF2F2] dark:bg-red-900/20 rounded-xl p-4 flex items-center justify-between shadow-sm border border-red-100 dark:border-red-900/30 cursor-pointer hover:bg-red-100/50 dark:hover:bg-red-900/40 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-red-900/40 rounded-lg flex items-center justify-center text-red-500 shadow-sm border border-red-50">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#991B1B] dark:text-red-300 leading-none">{inMaintenance}</p>
                <p className="text-xs font-semibold text-[#991B1B]/70 dark:text-red-400 mt-1 uppercase tracking-wide">{t('fleet.maintenance')}</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => {
              setFilterHealth('Good');
              setFilterType('All Types');
              setFilterStatus('All Status');
              setGlobalLocationFilter('All Locations');
            }}
            className="flex-1 bg-[#FAF5FF] dark:bg-purple-900/20 rounded-xl p-4 flex items-center justify-between shadow-sm border border-purple-100 dark:border-purple-900/30 cursor-pointer hover:bg-purple-100/50 dark:hover:bg-purple-900/40 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-purple-900/40 rounded-lg flex items-center justify-center text-purple-500 shadow-sm border border-purple-50">
                <Gauge size={20} className="text-purple-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#6B21A8] dark:text-purple-300 leading-none">{healthScore}%</p>
                <p className="text-xs font-semibold text-[#6B21A8]/70 dark:text-purple-400 mt-1 uppercase tracking-wide">{t('fleet.health_score')}</p>
              </div>
            </div>
          </div>
        </div>



        {/* Filters */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('fleet.vehicle_type')}:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All Types">{t('fleet.all_types')}</option>
              <option value="Trucks">{t('fleet.trucks')}</option>
              <option value="Trailers">{t('fleet.trailers')}</option>
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
              <option value="Available">{t('fleet.available')}</option>
              <option value="In Use">{t('fleet.in_use')}</option>
              <option value="Maintenance">{t('fleet.maintenance')}</option>
            </select>
          </div>
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
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('common.health')}:</span>
            <select
              value={filterHealth}
              onChange={(e) => setFilterHealth(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All Health">{t('fleet.all_health')}</option>
              <option value="Good">Good</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          {(filterType !== 'All Types' || filterStatus !== 'All Status' || globalLocationFilter !== 'All Locations' || filterHealth !== 'All Health') && (
            <button
              onClick={() => {
                setFilterType('All Types');
                setFilterStatus('All Status');
                setGlobalLocationFilter('All Locations');
                setFilterHealth('All Health');
              }}
              className="text-sm text-[#2563EB] hover:underline ml-2"
            >
              {t('common.clear_all')}
            </button>
          )}
        </div>
      </div>

      {/* Vehicle Table */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-[#0F172A]">
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#FAFAFA] dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  {t('fleet.vehicle_id_plate')}
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  {t('fleet.type')}
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  {t('common.status')}
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  {t('fleet.assigned_driver')}
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  {t('fleet.location')}
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  {t('fleet.last_gps_ping')}
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  {t('common.health')}
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors bg-white dark:bg-[#1E293B]">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[10px] bg-[#F8FAFC] dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                        <Truck size={18} className="text-gray-400 dark:text-gray-500" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-gray-900 dark:text-white mb-0.5">
                          {vehicle.id}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          {vehicle.plate}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Truck size={14} className="text-gray-400" />
                      <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                        {vehicle.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center min-w-[70px] px-2.5 py-1 rounded-[6px] text-[11px] font-bold tracking-wide uppercase ${vehicle.status === 'Available' ? 'bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]' :
                      vehicle.status === 'In Use' ? 'bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE]' :
                        'bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]'
                      }`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    {vehicle.driver ? (
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600 overflow-hidden">
                          {getDriverIcon(vehicle.driver.name)}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-gray-900 dark:text-white leading-snug">
                            {vehicle.driver.name}
                          </p>
                          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                            {t('fleet.on_route')}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 text-gray-400">
                          <span className="text-[10px] font-bold">?</span>
                        </div>
                        <span className="text-[13px] font-medium text-gray-400 dark:text-gray-500">
                          {t('fleet.unassigned')}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-[13px] text-gray-700 dark:text-gray-300">
                        {vehicle.location}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="text-[13px] text-gray-600 dark:text-gray-400">
                      {vehicle.lastGPSPing}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: vehicle.health === 'Good' ? '#10B981' : vehicle.health === 'Warning' ? '#F59E0B' : '#EF4444' }} />
                      <span className="text-[13px] text-gray-900 dark:text-gray-300">
                        {vehicle.health}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right whitespace-nowrap">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-[#3B82F6] hover:text-[#2563EB] hover:underline text-[13px] font-semibold transition-all mr-2 outline-none">
                          {t('fleet.view_details_vehicle')}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{t('fleet.view_details_vehicle')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-5 py-3 text-left">
                          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="w-14 h-14 rounded-[12px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm">
                              <Truck size={28} className="text-blue-500" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{vehicle.id}</h3>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">{vehicle.type} • {vehicle.plate}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 dark:bg-[#0F172A] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{t('common.status')}</p>
                              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-1.5">
                                {vehicle.status === 'Available' ? t('fleet.available') :
                                 vehicle.status === 'In Use' ? t('fleet.in_use') :
                                 t('fleet.maintenance')}
                              </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-[#0F172A] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{t('common.health')}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: vehicle.health === 'Good' ? '#10B981' : vehicle.health === 'Warning' ? '#F59E0B' : '#EF4444' }} />
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{t(`fleet.${vehicle.health.toLowerCase()}`)}</p>
                              </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-[#0F172A] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 col-span-2 flex justify-between items-center">
                              <div>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{t('fleet.assigned_driver')}</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-1.5 flex items-center gap-2.5">
                                  {vehicle.driver ? (
                                    <>
                                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">{getDriverIcon(vehicle.driver.name)}</span>
                                      {vehicle.driver.name}
                                    </>
                                  ) : t('fleet.unassigned')}
                                </p>
                              </div>
                              <button className="text-blue-600 hover:text-blue-800 text-xs font-semibold">{t('fleet.reassign')}</button>
                            </div>
                            <div className="bg-gray-50 dark:bg-[#0F172A] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 col-span-2">
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{t('fleet.location')}</p>
                              <div className="flex justify-between items-center mt-1.5">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                                  <MapPin size={16} className="text-red-500" /> {vehicle.location}
                                </p>
                                <span className="text-xs font-medium text-gray-500">{vehicle.lastGPSPing}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="mt-2 text-right">
                          <DialogClose asChild>
                            <button className="px-5 py-2 w-full bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold shadow-sm text-center">{t('common.done')}</button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
