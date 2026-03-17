import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  Package,
  User,
  MapPin,
  DollarSign,
  ChevronDown,
  UserPlus
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getDriverIcon } from '../utils/icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";

const fetchLoads = async () => (await axios.get('/api/loads')).data;
const fetchDrivers = async () => (await axios.get('/api/drivers')).data;

const statusColors: Record<string, string> = {
  'PENDING': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  'ASSIGNED': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'IN_TRANSIT': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'DELIVERED': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
};

export function DispatchBoardPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: loads, isLoading } = useQuery({
    queryKey: ['loads'],
    queryFn: fetchLoads,
  });

  const { data: drivers } = useQuery({
    queryKey: ['drivers'],
    queryFn: fetchDrivers,
  });

  const assignDriverMutation = useMutation({
    mutationFn: ({ id, driver_name, driver_id }: any) => 
      axios.patch(`/api/loads/${id}`, { status: 'ASSIGNED', driver_name, driver_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: any) => 
      axios.patch(`/api/loads/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    }
  });

  const renderLoadColumn = (status: string, title: string) => {
    const columnLoads = loads?.filter((l: any) => l.status === status) || [];

    return (
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 flex flex-col min-w-[300px]">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              {title}
            </h3>
            <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {columnLoads.length}
            </span>
          </div>
        </div>

        <div className="space-y-3 overflow-y-auto flex-1">
          {columnLoads.map((load: any) => (
            <div key={load.id} className="bg-white dark:bg-[#1E293B] rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">{load.loadId}</span>
                <span className="text-xs font-bold text-gray-500">${load.price}</span>
              </div>
              <p className="text-xs font-bold text-gray-900 dark:text-gray-100 mb-3">{load.customer}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[11px] text-gray-600 dark:text-gray-400">{load.origin_city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-[11px] text-gray-600 dark:text-gray-400">{load.dest_city}</span>
                </div>
              </div>

              {status === 'PENDING' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                      <UserPlus size={14} />
                      {t('dispatch.actions.assign')}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle>{t('dispatch.modal.title')}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                       <label className="text-xs font-bold text-gray-500 mb-2 block">{t('dispatch.modal.available')}</label>
                       <select 
                         id={`driver-select-${load.id}`}
                         className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                       >
                         {drivers?.map((driver: any) => (
                           <option key={driver.id} value={`${driver.full_name}|${driver.id}`}>
                             {driver.full_name} (Available)
                           </option>
                         ))}
                         {(!drivers || drivers.length === 0) && (
                           <option disabled>No drivers found</option>
                         )}
                       </select>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <button 
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold"
                          onClick={() => {
                            const select = document.getElementById(`driver-select-${load.id}`) as HTMLSelectElement;
                            const [name, id_drv] = select.value.split('|');
                            assignDriverMutation.mutate({ id: load.id, driver_name: name, driver_id: id_drv });
                          }}
                        >
                          {t('dispatch.actions.confirm')}
                        </button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {load.driver_name && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[10px]">
                    {getDriverIcon(load.driver_name)}
                  </div>
                  <span className="text-[11px] text-gray-700 dark:text-gray-300 font-medium">{load.driver_name}</span>
                </div>
              )}

              {status === 'ASSIGNED' && (
                <button 
                  className="w-full mt-3 py-2 bg-green-600 hover:bg-green-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  onClick={() => updateStatusMutation.mutate({ id: load.id, status: 'IN_TRANSIT' })}
                >
                  {t('dispatch.actions.start_journey')}
                </button>
              )}

              {status === 'IN_TRANSIT' && (
                <button 
                  className="w-full mt-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  onClick={() => updateStatusMutation.mutate({ id: load.id, status: 'DELIVERED' })}
                >
                  {t('dispatch.actions.complete_delivery')}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-transparent">
      <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">{t('dispatch.title')}</h1>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{t('dispatch.subtitle')}</p>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 h-full min-w-max">
          {renderLoadColumn('PENDING', t('dispatch.columns.pending'))}
          {renderLoadColumn('ASSIGNED', t('dispatch.columns.assigned'))}
          {renderLoadColumn('IN_TRANSIT', t('dispatch.columns.transit'))}
          {renderLoadColumn('DELIVERED', t('dispatch.columns.completed'))}
        </div>
      </div>
    </div>
  );
}
