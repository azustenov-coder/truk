import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Search, Calendar, MapPin, Bell, Plus, Moon, Sun, CheckCircle, AlertCircle, TrendingUp, Loader2, Building2, Truck, CalendarDays } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import { useGlobalFilter } from '../providers/FilterProvider';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../providers/AuthProvider';
import axios from 'axios';
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
} from "./ui/dialog";
import { toast } from "sonner";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { globalDateFilter, setGlobalDateFilter, globalLocationFilter, setGlobalLocationFilter } = useGlobalFilter();

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // New Load State
  const [newLoad, setNewLoad] = useState({
    customer: '',
    origin: { city: '', state: '', location: '' },
    destination: { city: '', state: '', location: '' },
    eta: '',
    price: 0
  });

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: Notification) => !n.is_read).length);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await axios.patch(`/api/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleCreateLoad = async () => {
    if (!newLoad.customer || !newLoad.origin.city || !newLoad.destination.city) {
      toast.error(t('common.all_fields_required'));
      return;
    }

    setIsCreating(true);
    try {
      await axios.post('/api/loads', newLoad);
      toast.success(t('common.success_create'));
      setDialogOpen(false);
      setNewLoad({
        customer: '',
        origin: { city: '', state: '', location: '' },
        destination: { city: '', state: '', location: '' },
        eta: '',
        price: 0
      });
      queryClient.invalidateQueries({ queryKey: ['loads'] });
      fetchNotifications();
    } catch (err) {
      toast.error(t('common.error_create'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(t('common.search_query', { query: searchQuery }));
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' };
      case 'WARNING': return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' };
      default: return { icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' };
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 flex items-center px-6 gap-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <form onSubmit={handleSearch} className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('header.search')}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
          />
        </form>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Calendar size={16} />
            <span>{globalDateFilter === 'Today' ? t('header.today') : globalDateFilter}</span>
          </button>
          {showDateFilter && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1E293B] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
              {['Today', 'Yesterday', 'Last 7 Days'].map(opt => (
                <button
                  key={opt}
                  onClick={() => { setGlobalDateFilter(opt); setShowDateFilter(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {opt === 'Today' ? t('header.today') : opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Bell size={20} />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#1E293B] rounded-full"></span>}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1E293B] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden slide-down">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t('header.notifications')}</h3>
                  <span className="text-xs text-gray-500">{t('header.unread', { count: unreadCount })}</span>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                      {notifications.map((notif) => {
                        const { icon: Icon, color, bg } = getNotifIcon(notif.type);
                        return (
                          <div
                            key={notif.id}
                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                            onClick={() => markAsRead(notif.id)}
                          >
                            <div className="flex gap-3">
                              <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${bg}`}>
                                <Icon size={16} className={color} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{notif.title}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notif.message}</p>
                                <p className="text-[10px] text-gray-500 mt-2">
                                  {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: i18n.language === 'uz' ? uz : enUS })}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">{t('header.no_notifications')}</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Create Load Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm">
              <Plus size={18} />
              <span className="font-medium text-sm">{t('header.create_load')}</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] bg-white dark:bg-[#1E293B] border-gray-200 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-xl text-gray-900 dark:text-white">{t('header.create_load')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Building2 size={16} className="text-gray-400" /> {t('header.customer_broker')}
                  </label>
                  <input
                    type="text"
                    value={newLoad.customer}
                    onChange={(e) => setNewLoad({ ...newLoad, customer: e.target.value })}
                    className="px-3 py-2.5 bg-gray-50 dark:bg-[#0B0F1A] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                    placeholder="Walmart Distribution"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Truck size={16} className="text-gray-400" /> {t('header.price')}
                  </label>
                  <input
                    type="number"
                    value={newLoad.price}
                    onChange={(e) => setNewLoad({ ...newLoad, price: Number(e.target.value) })}
                    className="px-3 py-2.5 bg-gray-50 dark:bg-[#0B0F1A] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                    placeholder="1500"
                  />
                </div>
              </div>

              <div className="grid gap-4 p-4 bg-gray-50 dark:bg-[#0F172A] rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Yuborish (Shahar)</label>
                    <input
                      type="text"
                      value={newLoad.origin.city}
                      onChange={(e) => setNewLoad({ ...newLoad, origin: { ...newLoad.origin, city: e.target.value } })}
                      className="px-3 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Yuborish (Shtat)</label>
                    <input
                      type="text"
                      value={newLoad.origin.state}
                      onChange={(e) => setNewLoad({ ...newLoad, origin: { ...newLoad.origin, state: e.target.value } })}
                      className="px-3 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Qabul (Shahar)</label>
                    <input
                      type="text"
                      value={newLoad.destination.city}
                      onChange={(e) => setNewLoad({ ...newLoad, destination: { ...newLoad.destination, city: e.target.value } })}
                      className="px-3 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Qabul (Shtat)</label>
                    <input
                      type="text"
                      value={newLoad.destination.state}
                      onChange={(e) => setNewLoad({ ...newLoad, destination: { ...newLoad.destination, state: e.target.value } })}
                      className="px-3 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <CalendarDays size={16} className="text-gray-400" /> Yetkazish sanasi
                  </label>
                  <input
                    type="date"
                    value={newLoad.eta}
                    onChange={(e) => setNewLoad({ ...newLoad, eta: e.target.value })}
                    className="px-3 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <button className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium">{t('common.cancel')}</button>
              </DialogClose>
              <button
                onClick={handleCreateLoad}
                disabled={isCreating}
                className="px-6 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] font-bold text-sm flex items-center gap-2"
              >
                {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                {t('common.create')}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-900 dark:text-white uppercase truncate max-w-[100px]">{user?.full_name}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-500/20">
            {user?.full_name?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
