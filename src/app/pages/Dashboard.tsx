import {
  MoreHorizontal,
  Clock,
  AlertCircle,
  ThermometerSnowflake,
  FileWarning,
  Plus,
  UserPlus,
  FileText,
  Map as MapIcon,
  TrendingUp,
  Package,
  Truck,
  Users,
  AlertTriangle,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";

// Custom Marker Icon for Leaflet
const createDashboardIcon = (text: string, color: string) => {
  const colorMap: Record<string, string> = {
    green: 'bg-[#10B981]',
    blue: 'bg-[#3B82F6]',
    red: 'bg-[#EF4444]',
    purple: 'bg-[#8B5CF6]',
    orange: 'bg-[#F97316]',
  };
  const bgClass = colorMap[color] || 'bg-gray-500';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position: absolute; transform: translate(-50%, -100%); z-index: 10;">
        <div class="relative flex flex-col items-center">
          <div class="w-5 h-5 ${bgClass} rounded-full border-2 border-white shadow-md z-10 flex items-center justify-center">
            <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          <div class="w-5 h-5 ${bgClass} rounded-full animate-ping absolute top-0 left-0 -z-10 opacity-60"></div>
          <div class="absolute bottom-7 left-1/2 -translate-x-1/2 bg-white px-2.5 py-1 rounded shadow-md text-[10px] font-bold whitespace-nowrap text-gray-800 border border-gray-100 flex items-center">
            ${text}
            <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-white"></div>
          </div>
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

const mockMapMarkers = [
  { id: '1', label: 'TX-7841', lat: 31.9686, lng: -99.9018, color: 'green' },
  { id: '2', label: 'FL-4892', lat: 27.7662, lng: -81.6868, color: 'blue' },
  { id: '3', label: 'IL-5629', lat: 40.0, lng: -89.0, color: 'red' },
  { id: '4', label: 'CA-3952', lat: 36.7783, lng: -119.4179, color: 'purple' },
  { id: '5', label: 'GA-9273', lat: 32.1656, lng: -82.9001, color: 'green' },
  { id: '6', label: 'NY-1847', lat: 43.2994, lng: -74.2179, color: 'orange' },
];

const dispatchData = [
  { id: 'LD-2024-001847', route: 'Chicago → Atlanta', driver: 'Mike Rodriguez', status: 'In Transit', sf: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  { id: 'LD-2024-001848', route: 'Dallas → Phoenix', driver: 'Jennifer Chen', status: 'Assigned', sf: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  { id: 'LD-2024-001849', route: 'Los Angeles → Seattle', driver: 'David Thompson', status: 'Loading', sf: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' },
  { id: 'LD-2024-001850', route: 'Miami → Jacksonville', driver: 'Maria Santos', status: 'Delivered', sf: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' },
  { id: 'LD-2024-001851', route: 'Houston → New Orleans', driver: 'Robert Wilson', status: 'Unassigned', sf: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  { id: 'LD-2024-001852', route: 'Denver → Kansas City', driver: 'Lisa Anderson', status: 'In Transit', sf: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  { id: 'LD-2024-001853', route: 'Portland → San Francisco', driver: 'James Martinez', status: 'Assigned', sf: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  { id: 'LD-2024-001854', route: 'Nashville → Memphis', driver: 'Amanda Taylor', status: 'Loading', sf: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' },
];

export function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 dark:bg-transparent min-h-[calc(100vh-4rem)]">
      {/* Top KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { title: "Active Loads", val: "247", stat: "↑ 12% from yesterday", statColor: "text-green-500", Icon: Package, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
          { title: "Active Vehicles", val: "89", stat: "↑ 2.1% this week", statColor: "text-green-500", Icon: Truck, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { title: "Total Drivers", val: "156", stat: "of 156 total", statColor: "text-gray-500", Icon: Users, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
          { title: "System Alerts", val: "12", stat: "3 critical alerts", statColor: "text-red-500", Icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10" },
          { title: "Daily Revenue", val: "$18.4K", stat: "↑ 8% vs target", statColor: "text-green-500", Icon: DollarSign, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
          { title: "On-Time Delivery", val: "96.4%", stat: "↑ 15% vs last month", statColor: "text-green-500", Icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-[#1E293B] rounded-[16px] p-4 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{item.val}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mt-1">{item.title}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg}`}>
                <item.Icon size={20} className={item.color} />
              </div>
            </div>
            <p className={`text-xs font-bold mt-4 flex items-center ${item.statColor}`}>
              {item.stat}
            </p>
          </div>
        ))}
      </div>

      {/* Main Map & Dispatch Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Operations Map (col-span-2) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] rounded-[20px] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Live Operations</h2>
          </div>
          <div className="flex-1 relative min-h-[550px] bg-gray-50 dark:bg-gray-900 p-4">
            <div className="absolute inset-4 rounded-[16px] overflow-hidden border border-gray-200 dark:border-gray-700 z-0">
              <MapContainer
                center={[39.8283, -98.5795]}
                zoom={4.5}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {mockMapMarkers.map(route => (
                  <Marker
                    key={route.id}
                    position={[route.lat, route.lng]}
                    icon={createDashboardIcon(route.label, route.color)}
                  />
                ))}
              </MapContainer>
            </div>

            {/* Bottom Overlay Stats */}
            <div className="absolute bottom-8 left-8 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-sm rounded-2xl shadow-xl p-5 flex items-center gap-8 z-10 border border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <p className="text-3xl font-black text-gray-900 dark:text-white">156</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Total Vehicles</p>
              </div>
              <div className="w-[2px] h-12 bg-gray-100 dark:bg-gray-800"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-[#10B981]">89</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Available</p>
              </div>
              <div className="w-[2px] h-12 bg-gray-100 dark:bg-gray-800"></div>
              <div className="text-center">
                <p className="text-3xl font-black text-[#3B82F6]">247</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Active Loads</p>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute top-8 right-8 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-sm rounded-xl shadow-lg p-4 z-10 border border-gray-100 dark:border-gray-700 min-w-[140px]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Vehicle Status</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-sm"></div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">On Time</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-sm"></div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Delayed</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-sm"></div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Critical</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Dispatch (col-span-1) */}
        <div className="bg-white dark:bg-[#1E293B] rounded-[20px] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Today's Dispatch</h2>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"><MoreHorizontal size={20} /></button>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: '550px' }}>
            {dispatchData.map((d, idx) => (
              <div key={idx} className="bg-[#F8FAFC] dark:bg-gray-800/40 rounded-xl p-4 flex items-center justify-between border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50 transition-colors">
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white">{d.id}</p>
                  <p className="text-[12px] font-medium text-gray-500 mt-1">{d.route}</p>
                  <p className="text-[12px] font-medium text-gray-400 mt-0.5">Driver: {d.driver}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap ${d.sf}`}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts & Exceptions */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] rounded-[20px] shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Alerts & Exceptions</h2>
          </div>
          <div className="p-5 grid grid-rows-4 gap-3">
            {/* Red Alert */}
            <div className="bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 rounded-[14px] p-4 flex gap-4 cursor-pointer hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              <div className="mt-0.5"><Clock className="text-red-500" size={20} /></div>
              <div>
                <p className="text-[13px] font-bold text-red-700 dark:text-red-400 leading-none">Late Pickup Alert</p>
                <p className="text-[13px] font-medium text-gray-600 dark:text-gray-400 mt-1.5">Load LD-2024-001845 is 2 hours behind schedule</p>
                <p className="text-[12px] font-semibold text-gray-500 dark:text-gray-500 mt-1">Customer: Walmart Distribution • ETA: 14:30</p>
              </div>
            </div>
            {/* Orange Alert */}
            <div className="bg-orange-50/50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/20 rounded-[14px] p-4 flex gap-4 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
              <div className="mt-0.5"><AlertCircle className="text-orange-500" size={20} /></div>
              <div>
                <p className="text-[13px] font-bold text-orange-700 dark:text-orange-400 leading-none">HOS Risk Warning</p>
                <p className="text-[13px] font-medium text-gray-600 dark:text-gray-400 mt-1.5">Driver Mike Rodriguez approaching 11-hour limit</p>
                <p className="text-[12px] font-semibold text-gray-500 dark:text-gray-500 mt-1">Truck: FL-4892 • Time remaining: 1h 23m</p>
              </div>
            </div>
            {/* Blue Alert */}
            <div className="bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-[14px] p-4 flex gap-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
              <div className="mt-0.5"><ThermometerSnowflake className="text-blue-500" size={20} /></div>
              <div>
                <p className="text-[13px] font-bold text-blue-700 dark:text-blue-400 leading-none">Temperature Alert</p>
                <p className="text-[13px] font-medium text-gray-600 dark:text-gray-400 mt-1.5">Reefer unit temperature out of range (-18°C to -20°C)</p>
                <p className="text-[12px] font-semibold text-gray-500 dark:text-gray-500 mt-1">Load: LD-2024-001843 • Current: -15°C</p>
              </div>
            </div>
            {/* Yellow Alert */}
            <div className="bg-yellow-50/50 dark:bg-yellow-500/5 border border-yellow-100 dark:border-yellow-500/20 rounded-[14px] p-4 flex gap-4 cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-500/10 transition-colors">
              <div className="mt-0.5"><FileWarning className="text-yellow-600 dark:text-yellow-500" size={20} /></div>
              <div>
                <p className="text-[13px] font-bold text-yellow-700 dark:text-yellow-500 leading-none">Unpaid Invoice</p>
                <p className="text-[13px] font-medium text-gray-600 dark:text-gray-400 mt-1.5">Invoice INV-2024-0892 overdue by 15 days</p>
                <p className="text-[12px] font-semibold text-gray-500 dark:text-gray-500 mt-1">Customer: Target Corp • Amount: $4,250.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-[#1E293B] rounded-[20px] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4 flex-1">
            {/* + Create Load Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors shadow-sm focus:outline-none p-6">
                  <Plus size={28} />
                  <span className="text-[13px] font-bold truncate tracking-wide">+ Create Load</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">+ Create New Load</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Customer</label>
                      <input placeholder="Enter customer name" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Load Type</label>
                      <select className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Dry Van</option>
                        <option>Reefer</option>
                        <option>Flatbed</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Origin</label>
                      <input placeholder="City, State" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Destination</label>
                      <input placeholder="City, State" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-2 text-right flex justify-end">
                  <DialogClose asChild>
                    <button className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm mr-2">Cancel</button>
                  </DialogClose>
                  <button className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold shadow-sm">Save Load</button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Assign Driver Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors shadow-sm focus:outline-none p-6">
                  <UserPlus size={28} />
                  <span className="text-[13px] font-bold truncate tracking-wide">Assign Driver</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">Assign Driver to Load</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select Load</label>
                    <select className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option>LD-2024-001851 (Houston → New Orleans)</option>
                      <option>LD-2024-001860 (Chicago → Detroit)</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select Driver</label>
                    <select className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option>Robert Wilson (Available)</option>
                      <option>Tom Hardy (Available)</option>
                    </select>
                  </div>
                </div>
                <DialogFooter className="mt-2 text-right flex justify-end">
                  <DialogClose asChild>
                    <button className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm mr-2">Cancel</button>
                  </DialogClose>
                  <button className="px-5 py-2.5 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors text-sm font-semibold shadow-sm">Assign</button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Generate Invoice Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="bg-[#A855F7] hover:bg-[#9333EA] text-white rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors shadow-sm focus:outline-none p-6">
                  <FileText size={28} />
                  <span className="text-[13px] font-bold truncate tracking-wide">Generate Invoice</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">Generate Invoice</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Completed Load</label>
                    <select className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>LD-2024-001850 (Miami → Jacksonville)</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Amount ($)</label>
                    <input type="number" defaultValue="2500.00" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
                <DialogFooter className="mt-2 text-right flex justify-end">
                  <DialogClose asChild>
                    <button className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm mr-2">Cancel</button>
                  </DialogClose>
                  <button className="px-5 py-2.5 bg-[#A855F7] text-white rounded-lg hover:bg-[#9333EA] transition-colors text-sm font-semibold shadow-sm">Create Invoice</button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Plan Route Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="bg-[#F97316] hover:bg-[#EA580C] text-white rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors shadow-sm focus:outline-none p-6">
                  <MapIcon size={28} />
                  <span className="text-[13px] font-bold truncate tracking-wide">Plan Route</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">Plan Route</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Vehicle / Driver</label>
                    <select className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>TX-7841 / Mike Rodriguez</option>
                      <option>FL-4892 / Jennifer Chen</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <div className="grid gap-2 w-full">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Start Location</label>
                      <input placeholder="Chicago, IL" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="grid gap-2 w-full">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">End Location</label>
                      <input placeholder="Atlanta, GA" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-2 text-right flex justify-end">
                  <DialogClose asChild>
                    <button className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm mr-2">Cancel</button>
                  </DialogClose>
                  <button className="px-5 py-2.5 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors text-sm font-semibold shadow-sm">Optimize Route</button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
