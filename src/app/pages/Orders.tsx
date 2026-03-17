import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
import {
  Search,
  Plus,
  Filter,
  ArrowUpRight,
  MoreVertical,
  Calendar,
  DollarSign,
  Package,
  FileSpreadsheet
} from 'lucide-react';
import { getCustomerIcon, getDriverIcon } from '../utils/icons';
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

const statusColors: Record<string, string> = {
  'PENDING': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  'ASSIGNED': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'DELIVERED': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'IN_TRANSIT': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const fetchLoads = async (status: string | null) => {
  const url = status ? `/api/loads?status=${status}` : '/api/loads';
  return (await axios.get(url)).data;
};

export function OrdersPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  
  const filterStatus = searchParams.get('status') || 'all';

  const { data: loads, isLoading } = useQuery({
    queryKey: ['loads', filterStatus],
    queryFn: () => fetchLoads(filterStatus),
  });

  const filteredLoads = loads;

  // Create Load Mutation
  const [newLoad, setNewLoad] = useState({
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
    }
  });

  const exportToExcel = () => {
    // DIAGNOSTIC ALERT
    console.log('exportToExcel triggered');
    
    try {
      if (typeof XLSX === 'undefined') {
        alert('Xatolik: XLSX kutubxonasi topilmadi!');
        return;
      }

      if (!filteredLoads || !Array.isArray(filteredLoads) || filteredLoads.length === 0) {
        alert('Ma\'lumot topilmadi (Yuklar soni: 0). Iltimos, ma\'lumotlar yuklanishini kuting.');
        return;
      }

      console.log('Exporting loads count:', filteredLoads.length);

      const data = filteredLoads.map((load: any) => ({
        'ID': load.loadId || load.id || '-',
        'Mijoz': load.customer || '-',
        'Yuborish': load.origin_city || '-',
        'Qabul qilish': load.dest_city || '-',
        'Holat': load.status || '-',
        'Haydovchi': load.driver_name || '-',
        'Narxi': load.price || 0,
        'Vaqti': load.eta || '-'
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Buyurtmalar');
      
      XLSX.writeFile(workbook, `LogistikAI_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      // DIAGNOSTIC SUCCESS
      setTimeout(() => alert('Eksport yakunlandi. Faylni yuklab olish papkangizdan qidiring.'), 500);
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
              {t('orders.title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('orders.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm bg-white dark:bg-[#1E293B] focus:outline-none font-medium"
            >
              <FileSpreadsheet size={16} />
              {t('orders.export_excel')}
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm font-medium">
                  <Plus size={16} />
                  {t('header.create_load')}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">+ {t('header.create_load')}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('dashboard.modals.customer')}</label>
                      <input 
                        placeholder={t('dashboard.modals.customer')} 
                        className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                        onChange={(e) => setNewLoad({...newLoad, customer: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('dashboard.modals.rate')}</label>
                      <input 
                        type="number"
                        placeholder="1500" 
                        className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" 
                        onChange={(e) => setNewLoad({...newLoad, price: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-2 text-right">
                  <DialogClose asChild>
                    <button 
                      className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg font-semibold"
                      onClick={() => createLoadMutation.mutate(newLoad)}
                    >
                      {t('common.save')}
                    </button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('orders.load_id')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('orders.customer')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('orders.route')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('common.status')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('fleet.assigned_driver')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="loading"
                  >
                    <td colSpan={5} className="text-center py-10 font-bold text-gray-400 uppercase tracking-widest">{t('pod.actions.processing')}</td>
                  </motion.tr>
                ) : filteredLoads?.length === 0 ? (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="empty"
                  >
                    <td colSpan={5} className="text-center py-10 text-gray-500 font-bold uppercase tracking-widest">{t('orders.no_loads')}</td>
                  </motion.tr>
                ) : filteredLoads?.map((load: any) => (
                  <motion.tr 
                    key={load.id} 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter">{load.loadId}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{load.customer}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-200">
                      {load.origin_city} ➔ {load.dest_city}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none ${statusColors[load.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                        {load.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-400">
                      {load.driver_name || t('fleet.unassigned')}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
