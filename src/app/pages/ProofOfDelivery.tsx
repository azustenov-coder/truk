import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  Upload,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Truck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getDriverIcon } from '../utils/icons';

const fetchLoads = async () => (await axios.get('/api/loads')).data;

export function ProofOfDeliveryPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: loads, isLoading } = useQuery({
    queryKey: ['loads'],
    queryFn: fetchLoads,
  });

  const confirmDeliveryMutation = useMutation({
    mutationFn: (id: number) => axios.patch(`/api/loads/${id}`, { status: 'DELIVERED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    }
  });

  const assignedLoads = loads?.filter((l: any) => l.status === 'ASSIGNED') || [];
  const deliveredLoads = loads?.filter((l: any) => l.status === 'DELIVERED') || [];
  const totalRevenue = deliveredLoads.reduce((sum: number, load: any) => sum + (Number(load.price) || 0), 0);

  return (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-transparent p-6 space-y-6">
      <div className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 rounded-[20px] p-6 shadow-sm">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">{t('pod.title')}</h1>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{t('pod.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
        {/* Pending Confirmation */}
        <div className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 rounded-[20px] shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">{t('pod.sections.active')}</h2>
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
              {t('pod.labels.active_count', { count: assignedLoads.length })}
            </span>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {assignedLoads.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-medium italic">{t('pod.labels.no_transit')}</div>
            ) : assignedLoads.map((load: any) => (
              <div key={load.id} className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5 hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{load.loadId}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-0.5">{load.customer}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-black text-green-600">${load.price}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-1 flex items-center gap-1">
                       <Clock size={10} /> {t('pod.labels.active')}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                        <MapPin size={14} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-bold text-gray-400 uppercase">{t('pod.labels.route')}</p>
                        <p className="text-[13px] font-bold text-gray-800 dark:text-gray-200">{load.origin_city} ➔ {load.dest_city}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                        <Truck size={14} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-bold text-gray-400 uppercase">{t('pod.labels.driver')}</p>
                        <p className="text-[13px] font-bold text-gray-800 dark:text-gray-200">{load.driver_name}</p>
                      </div>
                   </div>
                </div>

                <button 
                  className="w-full py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                  onClick={() => confirmDeliveryMutation.mutate(load.id)}
                  disabled={confirmDeliveryMutation.isPending}
                >
                  <CheckCircle size={16} />
                  {confirmDeliveryMutation.isPending ? t('pod.actions.processing') : t('pod.actions.confirm')}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Delivered */}
        <div className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-gray-800 rounded-[20px] shadow-sm flex flex-col overflow-hidden">
           <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">{t('pod.sections.recent')}</h2>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{t('pod.sections.total_revenue')}: ${totalRevenue.toLocaleString()}</p>
            </div>
            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
              {t('pod.labels.completed_count', { count: deliveredLoads.length })}
            </span>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
             {deliveredLoads.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-medium italic">{t('pod.labels.no_delivered')}</div>
            ) : deliveredLoads.map((load: any) => (
              <div key={load.id} className="bg-emerald-50/30 dark:bg-emerald-500/5 border border-emerald-100/50 dark:border-emerald-500/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                   <p className="text-sm font-black text-gray-900 dark:text-white">{load.loadId}</p>
                   <p className="text-[11px] text-gray-500 font-bold mt-1 uppercase">{load.customer}</p>
                </div>
                <div className="text-right">
                   <p className="text-sm font-black text-emerald-600">+${load.price}</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{t('pod.actions.confirmed')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
