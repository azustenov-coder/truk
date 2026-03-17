import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Calendar, 
  Settings as SettingsIcon, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  PenSquare,
  Truck,
  Plus
} from 'lucide-react';
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

const statusStyles: Record<string, string> = {
  'Scheduled': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Completed': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Cancelled': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};

export function MaintenancePage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [editingItem, setEditingItem] = useState<any>(null);
  const [newItem, setNewItem] = useState<any>({
    truck_id: '',
    type: '',
    scheduled_date: '',
    notes: ''
  });

  const { data: trucks } = useQuery({
    queryKey: ['trucks'],
    queryFn: async () => {
      const res = await axios.get('/api/trucks');
      return res.data;
    }
  });

  const { data: maintenance, isLoading } = useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      const res = await axios.get('/api/maintenance');
      return res.data;
    }
  });

  const updateMaintenanceMutation = useMutation({
    mutationFn: (data: any) => axios.patch(`/api/maintenance/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    }
  });

  const createMaintenanceMutation = useMutation({
    mutationFn: (data: any) => axios.post('/api/maintenance', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      setNewItem({ truck_id: '', type: '', scheduled_date: '', notes: '' });
    }
  });

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F172A]">
      <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
              {t('sidebar.maintenance') || 'Texnik xizmat'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Avtopark texnik holati va xizmat ko'rsatish taqvimi
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
                <Plus size={16} />
                Yangi reja
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Yangi texnik xizmat rejasini yaratish</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold">Yuk mashinasi</label>
                  <select 
                    className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none"
                    value={newItem.truck_id}
                    onChange={(e) => setNewItem({ ...newItem, truck_id: e.target.value })}
                  >
                    <option value="">Mashinani tanlang</option>
                    {trucks?.map((id: string) => (
                      <option key={id} value={id}>{id}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold">{t('fleet.maintenance_type')}</label>
                  <select 
                    className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none"
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                  >
                    <option value="">{t('fleet.maintenance_type')}ni tanlang</option>
                    <option value={t('fleet.routine_inspection')}>{t('fleet.routine_inspection')}</option>
                    <option value={t('fleet.oil_filter_change')}>{t('fleet.oil_filter_change')}</option>
                    <option value={t('fleet.brake_replacement')}>{t('fleet.brake_replacement')}</option>
                    <option value={t('fleet.tire_replacement')}>{t('fleet.tire_replacement')}</option>
                    <option value={t('fleet.engine_repair')}>{t('fleet.engine_repair')}</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold">Sana</label>
                  <input 
                    type="date"
                    className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none"
                    value={newItem.scheduled_date}
                    onChange={(e) => setNewItem({ ...newItem, scheduled_date: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold">Eslatmalar</label>
                  <textarea 
                    className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none min-h-[80px]"
                    placeholder="Qo'shimcha tafsilotlar..."
                    value={newItem.notes}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                    onClick={() => createMaintenanceMutation.mutate(newItem)}
                    disabled={!newItem.truck_id || !newItem.type || !newItem.scheduled_date}
                  >
                    Yaratish
                  </button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 text-blue-600 mb-2">
              <Calendar size={18} />
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Rejalashtirilgan</span>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              {maintenance?.filter((m: any) => m.status === 'Scheduled').length || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 text-amber-600 mb-2">
              <Clock size={18} />
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Jarayonda</span>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              {maintenance?.filter((m: any) => m.status === 'In Progress').length || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 text-green-600 mb-2">
              <CheckCircle2 size={18} />
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Yakunlangan</span>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              {maintenance?.filter((m: any) => m.status === 'Completed').length || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 text-red-600 mb-2">
              <AlertTriangle size={18} />
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Kutilayotganlar</span>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              {maintenance?.filter((m: any) => new Date(m.scheduled_date) < new Date() && m.status !== 'Completed').length || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maintenance?.map((item: any) => (
            <div key={item.id} className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-blue-600/10 transition-all"></div>
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{item.truck_id}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mashina raqami</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusStyles[item.status]}`}>
                  {item.status}
                </span>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <SettingsIcon size={14} className="text-blue-500" /> Tur:
                  </span>
                  <span className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{item.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" /> Sana:
                  </span>
                  <span className="text-sm font-black text-gray-900 dark:text-white">{item.scheduled_date}</span>
                </div>
                {item.notes && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic">"{item.notes}"</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <button 
                      onClick={() => setEditingItem(item)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-blue-600 hover:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold transition-all active:scale-95"
                    >
                      <PenSquare size={16} />
                      Holatni o'zgartirish
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Holatni tahrirlash</DialogTitle>
                    </DialogHeader>
                    {editingItem && (
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <label className="text-sm font-semibold">Holat</label>
                          <select 
                            className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none"
                            defaultValue={editingItem.status}
                            onChange={(e) => editingItem.status = e.target.value}
                          >
                            <option value="Scheduled">Rejalashtirilgan</option>
                            <option value="In Progress">Jarayonda</option>
                            <option value="Completed">Yakunlangan</option>
                            <option value="Cancelled">Bekor qilingan</option>
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-semibold">Eslatmalar</label>
                          <textarea 
                            className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none min-h-[100px]"
                            defaultValue={editingItem.notes}
                            onChange={(e) => editingItem.notes = e.target.value}
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <DialogClose asChild>
                        <button 
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold"
                          onClick={() => updateMaintenanceMutation.mutate(editingItem)}
                        >
                          Saqlash
                        </button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
