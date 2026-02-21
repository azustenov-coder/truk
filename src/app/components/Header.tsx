import { useState } from 'react';
import { Search, Calendar, MapPin, Bell, Plus, Moon, Sun, Globe, Truck, Building2, CalendarDays, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import { useGlobalFilter } from '../providers/FilterProvider';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { globalDateFilter, setGlobalDateFilter, globalLocationFilter, setGlobalLocationFilter } = useGlobalFilter();

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const mockNotifications = [
    {
      id: 1,
      type: 'success',
      title: 'Load Delivered',
      message: 'Driver Michael Rodriguez has delivered LOAD-2024-4578 in Austin, TX.',
      time: '10 mins ago',
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      id: 2,
      type: 'warning',
      title: 'HOS Risk Alert',
      message: 'David Thompson is approaching HOS violation limit. Immediate action required.',
      time: '1 hour ago',
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      id: 3,
      type: 'info',
      title: 'New Dispatch Available',
      message: 'A new high-priority load (LOAD-2024-4602) to Seattle, WA has been posted.',
      time: '2 hours ago',
      icon: TrendingUp,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    }
  ];

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    } else {
      alert('Please enter a search term.');
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 flex items-center px-6 gap-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <form onSubmit={handleSearch} className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={handleSearch}
          />
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
        {/* Date Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDateFilter(!showDateFilter);
              setShowLocationFilter(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
          >
            <Calendar size={16} />
            <span>{globalDateFilter === 'Today' ? t('header.today') : globalDateFilter}</span>
          </button>

          {showDateFilter && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDateFilter(false)}></div>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1E293B] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
                {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month'].map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setGlobalDateFilter(option);
                      setShowDateFilter(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${globalDateFilter === option ? 'font-medium text-[#2563EB] bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {option === 'Today' ? t('header.today') : option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Location Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLocationFilter(!showLocationFilter);
              setShowDateFilter(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none"
          >
            <MapPin size={16} />
            <span className="truncate max-w-[120px]">{globalLocationFilter === 'All Locations' ? t('header.all_locations') : globalLocationFilter}</span>
          </button>

          {showLocationFilter && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowLocationFilter(false)}></div>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#1E293B] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1 max-h-64 overflow-y-auto">
                {['All Locations', 'Austin, TX', 'Dallas, TX', 'Houston, TX', 'Phoenix, AZ', 'San Diego, CA', 'Los Angeles, CA'].map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setGlobalLocationFilter(option);
                      setShowLocationFilter(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${globalLocationFilter === option ? 'font-medium text-[#2563EB] bg-blue-50/50 dark:bg-blue-900/10' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {option === 'All Locations' ? t('header.all_locations') : option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Language Selection */}
        <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => i18n.changeLanguage('en')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${i18n.language === 'en'
              ? 'bg-white dark:bg-[#1E293B] shadow text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            EN
          </button>
          <button
            onClick={() => i18n.changeLanguage('uz')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${i18n.language === 'uz'
              ? 'bg-white dark:bg-[#1E293B] shadow text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            UZ
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#1E293B] rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <>
              {/* Overlay for clicking outside */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              ></div>

              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1E293B] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden slide-down">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => setUnreadCount(0)}
                      className="text-xs text-[#2563EB] hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-[320px] overflow-y-auto">
                  {mockNotifications.length > 0 ? (
                    <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                      {mockNotifications.map((notif) => {
                        const Icon = notif.icon;
                        return (
                          <div
                            key={notif.id}
                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer ${unreadCount > 0 ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                            onClick={() => {
                              if (unreadCount > 0) setUnreadCount(prev => Math.max(0, prev - 1));
                            }}
                          >
                            <div className="flex gap-3">
                              <div className={`mt-0.5 w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center ${notif.bg}`}>
                                <Icon size={16} className={notif.color} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                                  {notif.title}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                  {notif.message}
                                </p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-2 font-medium">
                                  {notif.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <Bell size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-sm font-medium">No new notifications</p>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-center">
                  <button className="text-sm text-[#2563EB] font-medium hover:text-[#1d4ed8] hover:underline transition-colors w-full">
                    View All Notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Create New Load Button */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm focus:outline-none">
              <Plus size={18} />
              <span className="font-medium">{t('header.create_load')}</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-xl">{t('header.create_load')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Building2 size={16} className="text-gray-400" />
                    Customer / Broker
                  </label>
                  <select className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900 dark:text-white shadow-sm">
                    <option>Select Customer...</option>
                    <option>Walmart Distribution</option>
                    <option>Amazon Fulfillment</option>
                    <option>Target Logistics</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Truck size={16} className="text-gray-400" />
                    Equipment Required
                  </label>
                  <select className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900 dark:text-white shadow-sm">
                    <option>53' Dry Van</option>
                    <option>Refrigerated (Reefer)</option>
                    <option>Flatbed</option>
                    <option>Step Deck</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 p-4 bg-gray-50 dark:bg-[#0F172A] rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <div className="grid gap-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Pickup Location</label>
                    <input type="text" placeholder="City, ST" className="px-3 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full shadow-sm text-gray-900 dark:text-white placeholder-gray-400" />
                  </div>
                  <div className="text-gray-300 dark:text-gray-600 mt-6 font-light">→</div>
                  <div className="grid gap-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Delivery Location</label>
                    <input type="text" placeholder="City, ST" className="px-3 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full shadow-sm text-gray-900 dark:text-white placeholder-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mt-2">
                  <div className="grid gap-2 relative">
                    <CalendarDays size={14} className="absolute left-3 top-[34px] text-gray-400 z-10" />
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Pickup Date</label>
                    <input type="date" className="pl-9 pr-3 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full shadow-sm text-gray-900 dark:text-white" />
                  </div>
                  <div className="w-4 h-px bg-transparent mt-6"></div>
                  <div className="grid gap-2 relative">
                    <CalendarDays size={14} className="absolute left-3 top-[34px] text-gray-400 z-10" />
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Delivery Date</label>
                    <input type="date" className="pl-9 pr-3 py-2 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full shadow-sm text-gray-900 dark:text-white" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Rate / Payout ($)</label>
                  <input type="number" placeholder="e.g. 2500" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900 dark:text-white shadow-sm placeholder-gray-400" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weight (lbs)</label>
                  <input type="number" placeholder="e.g. 42000" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-900 dark:text-white shadow-sm placeholder-gray-400" />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-2 text-right flex gap-2 justify-end">
              <DialogClose asChild>
                <button className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm">{t('common.cancel')}</button>
              </DialogClose>
              <button className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold shadow-sm">{t('header.create_load')}</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-sm">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
