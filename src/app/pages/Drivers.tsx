import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Users,
  Star,
  AlertCircle,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  FileText,
  Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
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

interface Driver {
  id: string;
  name: string;
  license: string;
  licenseClass: string;
  avatar: string;
  status: 'Available' | 'On Trip' | 'Off Duty';
  hosRisk: 'Low' | 'Medium' | 'High';
  rating: number;
  lastTrip: string;
  currentLocation: string;
  nextDestination?: string;
  phone: string;
  email: string;
}

const mockDrivers: Driver[] = [
  {
    id: 'D001',
    name: 'Michael Rodriguez',
    license: 'CDL-A',
    licenseClass: 'First 500 • CDL Class A',
    avatar: '👨‍✈️',
    status: 'Available',
    hosRisk: 'Low',
    rating: 4.9,
    lastTrip: 'Chicago → Atlanta',
    currentLocation: 'Chicago, IL',
    nextDestination: 'In progress 3.8 mi (6 km)',
    phone: '(555) 123-4567',
    email: 'm.rodriguez@fleetflow.com'
  },
  {
    id: 'D002',
    name: 'Jennifer Chen',
    license: 'CDL-A',
    licenseClass: 'First 500 • CDL Class A',
    avatar: '👩‍✈️',
    status: 'On Trip',
    hosRisk: 'Low',
    rating: 4.7,
    lastTrip: 'Dallas → Phoenix',
    currentLocation: 'Dallas, TX',
    nextDestination: 'En route to Phoenix',
    phone: '(555) 234-5678',
    email: 'j.chen@fleetflow.com'
  },
  {
    id: 'D003',
    name: 'David Thompson',
    license: 'CDL-B',
    licenseClass: 'First 500 • CDL Class B',
    avatar: '👨‍✈️',
    status: 'Off Duty',
    hosRisk: 'High',
    rating: 4.8,
    lastTrip: 'Denver → Salt Lake City',
    currentLocation: 'Denver, CO',
    nextDestination: 'Rest period - 34h reset',
    phone: '(555) 345-6789',
    email: 'd.thompson@fleetflow.com'
  },
  {
    id: 'D004',
    name: 'Maria Santos',
    license: 'CDL-A',
    licenseClass: 'First 500 • CDL Class A',
    avatar: '👩‍✈️',
    status: 'On Trip',
    hosRisk: 'Low',
    rating: 4.8,
    lastTrip: 'Atlanta → Miami',
    currentLocation: 'Atlanta, GA',
    nextDestination: 'En route to Miami',
    phone: '(555) 456-7890',
    email: 'm.santos@fleetflow.com'
  },
  {
    id: 'D005',
    name: 'James Wilson',
    license: 'CDL-A',
    licenseClass: 'First 500 • CDL Class A',
    avatar: '👨‍✈️',
    status: 'Available',
    hosRisk: 'Low',
    rating: 4.9,
    lastTrip: 'New York → Boston',
    currentLocation: 'Albany, NY',
    nextDestination: 'Available for dispatch',
    phone: '(555) 567-8901',
    email: 'j.wilson@fleetflow.com'
  }
];

const statusColors = {
  'Available': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'On Trip': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Off Duty': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
};

const hosRiskColors = {
  'Low': 'bg-green-500',
  'Medium': 'bg-yellow-500',
  'High': 'bg-red-500'
};

export function DriversPage() {
  const { t } = useTranslation();
  const [filterStatus, setFilterStatus] = useState<string>('All Status');
  const [filterRisk, setFilterRisk] = useState<string>('All Risk');
  const { globalLocationFilter, setGlobalLocationFilter } = useGlobalFilter();
  const [filterRating, setFilterRating] = useState<string>('All Ratings');

  const { data: drivers = [] } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const response = await axios.get('/api/drivers');
      return response.data.map((uber: any) => ({
        id: uber.id.toString(),
        name: uber.full_name || uber.username,
        license: 'CDL-A',
        licenseClass: 'First 500 • CDL Class A',
        avatar: '👨‍✈️',
        status: 'Available',
        hosRisk: 'Low',
        rating: 4.8,
        lastTrip: 'N/A',
        currentLocation: 'Hub',
        nextDestination: 'Available for dispatch',
        phone: '(555) 000-0000',
        email: `${uber.username}@logistik-ai.com`
      } as Driver));
    }
  });

  const allLocations = Array.from(new Set(drivers.map((d: any) => d.currentLocation))).sort();

  const getFilteredDrivers = () => {
    return drivers.filter((d: any) => {
      // Status Logic
      if (filterStatus !== 'All Status' && filterStatus !== t('orders.all_status')) {
        const statusMap: Record<string, string> = {
          [t('common.available')]: 'Available',
          [t('common.on_trip')]: 'On Trip',
          [t('common.off_duty')]: 'Off Duty'
        };
        const internalStatus = statusMap[filterStatus] || filterStatus;
        if (d.status !== internalStatus) return false;
      }

      // Risk Logic
      if (filterRisk !== 'All Risk' && filterRisk !== t('drivers.risk')) {
        const riskMap: Record<string, string> = {
          [t('common.low')]: 'Low',
          [t('common.medium')]: 'Medium',
          [t('common.high')]: 'High'
        };
        const internalRisk = riskMap[filterRisk] || filterRisk;
        if (d.hosRisk !== internalRisk) return false;
      }

      // Location Logic
      if (globalLocationFilter !== 'All Locations' && globalLocationFilter !== t('fleet.all_locations')) {
        if (d.currentLocation !== globalLocationFilter) return false;
      }

      // Rating Logic
      if (filterRating !== 'All Ratings' && filterRating !== t('drivers.all_ratings')) {
        if (filterRating === '4.5+') {
          if (d.rating < 4.5) return false;
        } else if (filterRating === '4.0 - 4.4') {
          if (d.rating < 4.0 || d.rating >= 4.5) return false;
        } else if (filterRating === '< 4.0') {
          if (d.rating >= 4.0) return false;
        }
      }
      return true;
    });
  };

  const filteredDrivers = getFilteredDrivers();
  const totalDrivers = filteredDrivers.length;
  const availableNow = filteredDrivers.filter(d => d.status === 'Available').length;
  const hosRiskAlerts = filteredDrivers.filter(d => d.hosRisk === 'High').length;
  const avgRating = totalDrivers > 0 ? (filteredDrivers.reduce((acc, d) => acc + d.rating, 0) / totalDrivers).toFixed(1) : "0.0";

  const exportToPDF = () => {
    const doc = new jsPDF() as any;
    
    doc.setFontSize(20);
    doc.text(t('drivers.title'), 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`${t('fleet.date')}: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = filteredDrivers.map(d => [
      d.name,
      t(`common.${d.status.toLowerCase().replace(' ', '_')}`),
      d.license,
      d.rating.toString(),
      d.currentLocation,
      d.phone
    ]);

    doc.autoTable({
      startY: 40,
      head: [[t('drivers.name'), t('common.status'), t('drivers.license'), t('drivers.rating'), t('drivers.location'), t('drivers.phone')]],
      body: tableData,
      theme: 'striped',
      headStyles: { fillStyle: '#2563EB' },
    });

    doc.save(`Truk_Drivers_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToExcel = () => {
    try {
      if (!filteredDrivers || !Array.isArray(filteredDrivers) || filteredDrivers.length === 0) {
        alert(t('drivers.no_drivers') || 'Eksport qilish uchun haydovchilar yo\'q');
        return;
      }

      const data = filteredDrivers.map((d: any) => ({
        [t('drivers.name') || 'Ism']: d.name || '-',
        [t('common.status') || 'Holat']: d.status || '-',
        [t('drivers.license') || 'Litsenziya']: d.license || '-',
        [t('drivers.rating') || 'Reyting']: d.rating || '-',
        [t('drivers.location') || 'Manzil']: d.currentLocation || '-',
        [t('drivers.phone') || 'Telefon']: d.phone || '-'
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // AutoFit columns
      const maxWidths = data.reduce((acc: any, row: any) => {
        Object.keys(row).forEach((key, i) => {
          const val = row[key] ? row[key].toString() : '';
          const width = Math.max(acc[i] || 10, val.length + 2, key.length + 2);
          acc[i] = width;
        });
        return acc;
      }, []);
      worksheet['!cols'] = maxWidths.map((w: number) => ({ wch: w }));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, t('sidebar.drivers') || 'Drivers');
      
      XLSX.writeFile(workbook, `LogistikAI_Haydovchilar_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error: any) {
      console.error('Excel export error:', error);
      alert('Eksportda xatolik yuz berdi: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t('drivers.title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('drivers.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm font-medium"
            >
              <FileText size={16} />
              {t('drivers.export_pdf')}
            </button>
            <button 
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm font-medium"
            >
              <Download size={16} />
              {t('orders.export_excel')}
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm bg-white dark:bg-[#1E293B] focus:outline-none font-medium">
                  {t('drivers.import_drivers')}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t('drivers.import_drivers')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                      <Users className="text-blue-500 w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('fleet.click_upload')}</p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{t('fleet.csv_excel_only')}</p>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm">{t('common.cancel')}</button>
                  </DialogClose>
                  <button className="px-5 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold shadow-sm ml-2">{t('drivers.import_drivers')}</button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm bg-white dark:bg-[#1E293B] focus:outline-none font-medium">
              {t('drivers.compliance_report')}
            </button>

            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm focus:outline-none font-medium">
                  {t('drivers.add_driver')}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{t('drivers.add_driver')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('drivers.first_name')}</label>
                      <input type="text" placeholder="e.g. John" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('drivers.last_name')}</label>
                      <input type="text" placeholder="e.g. Doe" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('drivers.license_class')}</label>
                    <select className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>CDL Class A</option>
                      <option>CDL Class B</option>
                      <option>CDL Class C</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('drivers.phone_number')}</label>
                    <input type="tel" placeholder="(555) 000-0000" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('fleet.hub_location')}</label>
                    <select className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Chicago Hub</option>
                      <option>Dallas Terminal</option>
                      <option>Atlanta Distribution</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm">{t('common.cancel')}</button>
                  </DialogClose>
                  <button className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold shadow-sm ml-2">{t('drivers.save_driver')}</button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">{totalDrivers}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">{t('drivers.total_active')}</p>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-green-700 dark:text-green-300">{availableNow}</p>
              <p className="text-sm text-green-600 dark:text-green-400">{t('drivers.available_now')}</p>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center">
              <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-red-700 dark:text-red-300">{hosRiskAlerts}</p>
              <p className="text-sm text-red-600 dark:text-red-400">{t('drivers.hos_alerts')}</p>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 rounded-xl flex items-center justify-center">
              <Star size={24} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-yellow-700 dark:text-yellow-300">{avgRating}</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400">{t('drivers.avg_rating')}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('common.status')}:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All Status">{t('orders.all_status')}</option>
              <option value={t('common.available')}>{t('common.available')}</option>
              <option value={t('common.on_trip')}>{t('common.on_trip')}</option>
              <option value={t('common.off_duty')}>{t('common.off_duty')}</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('drivers.risk')}:</span>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All Risk">All Risk</option>
              <option value={t('common.low')}>{t('common.low')}</option>
              <option value={t('common.medium')}>{t('common.medium')}</option>
              <option value={t('common.high')}>{t('common.high')}</option>
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
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('drivers.rating_label')}:</span>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All Ratings">{t('drivers.all_ratings')}</option>
              <option value="4.5+">4.5 & Above</option>
              <option value="4.0 - 4.4">4.0 to 4.4</option>
              <option value="< 4.0">Below 4.0</option>
            </select>
          </div>
          {(filterStatus !== 'All Status' || filterRisk !== 'All Risk' || globalLocationFilter !== 'All Locations' || filterRating !== 'All Ratings') && (
            <button
              onClick={() => {
                setFilterStatus('All Status');
                setFilterRisk('All Risk');
                setGlobalLocationFilter('All Locations');
                setFilterRating('All Ratings');
              }}
              className="text-sm text-[#2563EB] hover:underline ml-2"
            >
              {t('common.clear_all')}
            </button>
          )}
        </div>
      </div>

      {/* Driver Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {t('drivers.title').replace(' Management', '')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {t('common.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {t('drivers.risk')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                   {t('drivers.rating_label')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {t('drivers.last_trip')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {t('fleet.location')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {getDriverIcon(driver.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {driver.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {driver.licenseClass}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${driver.status === 'Available' ? 'bg-green-500' :
                        driver.status === 'On Trip' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`} />
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[driver.status]}`}>
                        {driver.status === 'Available' ? t('common.available') :
                         driver.status === 'On Trip' ? t('common.on_trip') :
                         t('common.off_duty')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${hosRiskColors[driver.hosRisk]}`} />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {driver.hosRisk === 'Low' ? t('common.low') :
                         driver.hosRisk === 'Medium' ? t('common.medium') :
                         t('common.high')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {driver.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {driver.lastTrip}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {driver.nextDestination}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {driver.currentLocation}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-[#2563EB] hover:underline text-sm font-medium focus:outline-none">
                          {t('drivers.view_profile')}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{t('drivers.profile_overview')}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-5 py-3 text-left">
                          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="w-16 h-16 rounded-[12px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm text-3xl">
                              {getDriverIcon(driver.name)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{driver.name}</h3>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">{driver.licenseClass}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 dark:bg-[#0F172A] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{t('common.status')}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className={`w-2 h-2 rounded-full shadow-sm ${driver.status === 'Available' ? 'bg-green-500' : driver.status === 'On Trip' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                  {driver.status === 'Available' ? t('common.available') :
                                   driver.status === 'On Trip' ? t('common.on_trip') :
                                   t('common.off_duty')}
                                </p>
                              </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-[#0F172A] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{t('drivers.risk')}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className={`w-2 h-2 rounded-full shadow-sm ${hosRiskColors[driver.hosRisk]}`} />
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                  {driver.hosRisk === 'Low' ? t('common.low') :
                                   driver.hosRisk === 'Medium' ? t('common.medium') :
                                   t('common.high')}
                                </p>
                              </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-[#0F172A] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 col-span-2">
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{t('drivers.contact_methods')}</p>
                              <div className="mt-2 space-y-2">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2.5">
                                  <Phone size={14} className="text-gray-400" /> {driver.phone}
                                </p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                                  <Mail size={14} className="text-gray-400" /> {driver.email}
                                </p>
                              </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-[#0F172A] p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 col-span-2">
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{t('drivers.live_tracking')}</p>
                              <div className="mt-2">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2.5">
                                  <MapPin size={16} className="text-red-500" /> {driver.currentLocation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="mt-2 text-right">
                          <DialogClose asChild>
                            <button className="px-5 py-2.5 w-full bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold shadow-sm text-center">{t('drivers.close_profile')}</button>
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
