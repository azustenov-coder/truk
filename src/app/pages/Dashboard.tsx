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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import { uz, enUS } from 'date-fns/locale';
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
          <div class="w-8 h-8 ${bgClass} rounded-full animate-ping absolute -top-1.5 -left-1.5 -z-10 opacity-30"></div>
          <div class="absolute bottom-7 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2.5 py-1 rounded shadow-xl text-[10px] font-bold whitespace-nowrap text-gray-800 dark:text-white border border-white/20 flex items-center">
            ${text}
            <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-white/90 dark:border-t-slate-800/90"></div>
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

const fetchStats = async () => (await axios.get('http://localhost:3001/api/stats')).data;
const fetchLoads = async () => (await axios.get('http://localhost:3001/api/loads')).data;
const fetchNotifications = async () => (await axios.get('http://localhost:3001/api/notifications')).data;

export function DashboardPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    refetchInterval: 5000,
  });

  const { data: loads, isLoading: loadsLoading } = useQuery({
    queryKey: ['loads'],
    queryFn: fetchLoads,
    refetchInterval: 5000,
  });

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 10000,
  });

  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  const [newLoadData, setNewLoadData] = useState({
    customer: '',
    origin: { city: '', state: '', location: 'Main Hub' },
    destination: { city: '', state: '', location: 'Main DC' },
    eta: '2024-03-20',
    price: 1500
  });

  const createLoadMutation = useMutation({
    mutationFn: (load: any) => axios.post('/api/loads', load),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    }
  });

  const kpis = [
    { title: t('dashboard.kpis.active_loads'), val: statsLoading ? "..." : stats?.activeLoads, stat: t('dashboard.kpis.active_loads_stat'), statColor: "text-blue-500", Icon: Package, color: "text-blue-500", bg: "bg-blue-500/10", status: 'ACTIVE' },
    { title: t('dashboard.kpis.completed'), val: statsLoading ? "..." : stats?.completedDeliveries, stat: t('dashboard.kpis.completed_stat'), statColor: "text-emerald-500", Icon: Truck, color: "text-emerald-500", bg: "bg-emerald-500/10", status: 'DELIVERED' },
    { title: t('dashboard.kpis.revenue'), val: statsLoading ? "..." : `$${((stats?.totalRevenue || 0) / 1000).toFixed(1)}K`, stat: t('dashboard.kpis.revenue_stat'), statColor: "text-purple-500", Icon: DollarSign, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: t('dashboard.kpis.alerts'), val: statsLoading ? "..." : (stats?.totalAlerts || 0), stat: t('dashboard.kpis.alerts_stat', { count: stats?.criticalAlerts || 0 }), statColor: "text-red-500", Icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10", onClick: () => setShowAlertsDialog(true) },
    { title: t('dashboard.kpis.on_time'), val: statsLoading ? "..." : (stats?.onTimeRate || "96.4%"), stat: t('dashboard.kpis.on_time_stat'), statColor: "text-indigo-500", Icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: t('dashboard.kpis.vehicles'), val: statsLoading ? "..." : (stats?.activeVehicles || 0), stat: t('dashboard.kpis.vehicles_stat'), statColor: "text-emerald-500", Icon: Truck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="p-6 space-y-6 min-h-[calc(100vh-4rem)]">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {kpis.map((item, i) => (
          <div 
            key={i} 
            onClick={() => {
              if (item.status) navigate(`/dashboard/orders?status=${item.status}`);
              if (item.onClick) item.onClick();
            }}
            className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[24px] p-5 border border-gray-100 dark:border-white/10 flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300 shadow-sm ${item.status || item.onClick ? 'cursor-pointer hover:border-blue-500/50' : ''}`}
          >
            <div className="flex justify-between items-start">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.bg}`}>
                <item.Icon size={20} className={item.color} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">{item.val}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-400 mt-2">{item.title}</p>
            </div>
            <p className={`text-[11px] font-black mt-4 flex items-center gap-1.5 ${item.statColor}`}>
              <TrendingUp size={10} /> {item.stat}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col min-h-[600px] relative">
          <div className="px-8 py-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">{t('dashboard.terminal.title')}</h2>
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{t('dashboard.terminal.status')}</span>
            </div>
          </div>
          <div className="flex-1 relative bg-slate-50 dark:bg-slate-900/50">
             <MapContainer
                center={[39.8283, -98.5795]}
                zoom={4}
                style={{ height: "100%", width: "100%", zIndex: 0 }}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                {mockMapMarkers.map(route => (
                  <Marker
                    key={route.id}
                    position={[route.lat, route.lng]}
                    icon={createDashboardIcon(route.label, route.color)}
                  />
                ))}
              </MapContainer>

              <div className="absolute bottom-10 left-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-gray-100 dark:border-white/10 rounded-3xl p-6 flex items-center gap-10 z-10 shadow-2xl">
                 <div className="text-center">
                    <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{statsLoading ? "..." : (stats?.activeVehicles || 0) + 12}</p>
                    <p className="text-[9px] text-gray-500 dark:text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{t('dashboard.terminal.fleets')}</p>
                 </div>
                 <div className="w-[1px] h-12 bg-gray-200 dark:bg-white/10"></div>
                 <div className="text-center">
                    <p className="text-4xl font-black text-emerald-500 tracking-tighter">{statsLoading ? "..." : (stats?.activeVehicles || 0)}</p>
                    <p className="text-[9px] text-gray-500 dark:text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{t('dashboard.terminal.idle')}</p>
                 </div>
              </div>
          </div>
        </div>

        {/* Dispatch List */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] border border-gray-100 dark:border-white/10 flex flex-col overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white">{t('dashboard.active_dispatch')}</h2>
            <button className="text-gray-400 hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
            {loadsLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : loads?.slice(0, 10).map((d: any, idx: number) => (
              <div key={idx} className="bg-white/10 dark:bg-slate-800/40 border border-white/5 hover:border-blue-500/30 rounded-2xl p-4 transition-all duration-300 group">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[14px] font-black text-gray-900 dark:text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{d.loadId}</p>
                    <p className="text-[12px] font-bold text-gray-400 dark:text-slate-400 mt-1">{d.origin_city} ➔ {d.dest_city}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    d.status === 'PENDING' ? 'bg-gray-500/10 text-gray-500' :
                    d.status === 'ASSIGNED' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-emerald-500/10 text-emerald-500'
                  }`}>
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        {/* Alerts */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-8 border border-gray-100 dark:border-white/10">
           <h2 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white mb-6">{t('dashboard.health.title')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex gap-4">
                 <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white flex-shrink-0"><Clock size={20}/></div>
                 <div>
                    <p className="text-sm font-black text-red-500 uppercase tracking-wide">{t('dashboard.health.critical_delay')}</p>
                    <p className="text-[12px] text-gray-600 dark:text-gray-200 mt-1 font-bold">{t('dashboard.health.critical_delay_msg')}</p>
                 </div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 flex gap-4">
                 <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white flex-shrink-0"><AlertCircle size={20}/></div>
                 <div>
                    <p className="text-sm font-black text-orange-500 uppercase tracking-wide">{t('dashboard.health.hos_compliance')}</p>
                    <p className="text-[12px] text-gray-600 dark:text-gray-200 mt-1 font-bold">{t('dashboard.health.hos_compliance_msg')}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[32px] p-8 border border-gray-100 dark:border-white/10 flex flex-col">
           <h2 className="text-xl font-black tracking-tighter text-gray-900 dark:text-white mb-6">{t('dashboard.quick_command.title')}</h2>
           <div className="grid grid-cols-2 gap-4 flex-1">
               <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-blue-600 dark:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] text-white rounded-3xl flex flex-col items-center justify-center gap-3 transition-all p-6 shadow-xl shadow-blue-500/20">
                    <Plus size={32} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{t('dashboard.quick_command.create_load')}</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] dark:bg-slate-900 border-white/20">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black tracking-tighter">{t('dashboard.modals.init_shipment')}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('dashboard.modals.customer')}</label>
                        <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={(e) => setNewLoadData({...newLoadData, customer: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('dashboard.modals.rate')}</label>
                        <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" onChange={(e) => setNewLoadData({...newLoadData, price: Number(e.target.value)})} />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-colors" onClick={() => createLoadMutation.mutate(newLoadData)}>{t('dashboard.modals.finalize')}</button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <button disabled className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-400 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all cursor-not-allowed">
                 <Truck size={32} />
                 <span className="text-[11px] font-black uppercase tracking-widest">{t('dashboard.quick_command.auto_dispatch')}</span>
              </button>
           </div>
        </div>
      </div>

      {/* Alerts Dialog */}
      <Dialog open={showAlertsDialog} onOpenChange={setShowAlertsDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-800 rounded-3xl p-0 overflow-hidden">
          <DialogHeader className="p-8 pb-0">
            <DialogTitle className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              {t('dashboard.kpis.alerts')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-8 pt-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {notificationsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('common.loading')}</p>
              </div>
            ) : notifications && notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notif: any) => (
                  <div 
                    key={notif.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 ${
                      notif.type === 'ERROR' ? 'bg-red-500/5 border-red-500/10 hover:border-red-500/20' :
                      notif.type === 'WARNING' ? 'bg-orange-500/5 border-orange-500/10 hover:border-orange-500/20' :
                      'bg-blue-500/5 border-blue-500/10 hover:border-blue-500/20'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        notif.type === 'ERROR' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' :
                        notif.type === 'WARNING' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' :
                        'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                      }`}>
                        {notif.type === 'ERROR' ? <Clock size={20} /> : 
                         notif.type === 'WARNING' ? <AlertCircle size={20} /> : <TrendingUp size={20} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-sm font-black uppercase tracking-tight truncate ${
                            notif.type === 'ERROR' ? 'text-red-600 dark:text-red-400' :
                            notif.type === 'WARNING' ? 'text-orange-600 dark:text-orange-400' :
                            'text-blue-600 dark:text-blue-400'
                          }`}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">
                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: i18n.language === 'uz' ? uz : enUS })}
                          </span>
                        </div>
                        <p className="text-[12px] font-bold text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{t('header.no_notifications')}</p>
              </div>
            )}
          </div>
          
          <div className="p-8 pt-0">
            <DialogClose asChild>
              <button className="w-full py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-all">
                {t('common.done')}
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
