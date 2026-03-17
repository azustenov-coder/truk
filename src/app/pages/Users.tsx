import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  MoreVertical,
  Plus,
  Search,
  UserCheck,
  UserX,
  ShieldAlert,
  Edit2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";

const roleColors: Record<string, string> = {
  'ADMIN': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'DISPATCHER': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'DRIVER': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'FINANCE': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'VIEWER': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export function UsersPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await axios.get('/api/users')).data,
  });

  const createUserMutation = useMutation({
    mutationFn: (userData: any) => axios.post('/api/users', userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: (userData: any) => axios.patch(`/api/users/${userData.id}`, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => axios.delete(`/api/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const filteredUsers = users?.filter((u: any) => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'DISPATCHER', full_name: '' });

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F172A]">
      <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
              {t('sidebar.users') || 'Foydalanuvchilar'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Tizim foydalanuvchilari va ularning rollarini boshqarish (Super Admin)
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                <UserPlus size={16} />
                Yangi foydalanuvchi
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Yangi foydalanuvchi qo'shish</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold">Toliq ism</label>
                  <input 
                    className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Masalan: Azizbek Sultonov"
                    onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold">Username</label>
                  <input 
                    className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="aziz_99"
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold">Parol</label>
                  <input 
                    type="password"
                    placeholder="••••••••"
                    className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm transition-all focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold">Rol</label>
                  <select 
                    className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none"
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    value={newUser.role}
                  >
                    <option value="ADMIN">Super Admin</option>
                    <option value="DISPATCHER">Dispetcher</option>
                    <option value="FINANCE">Moliya xodimi</option>
                    <option value="VIEWER">Kuzatuvchi</option>
                    <option value="DRIVER">Haydovchi</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all active:scale-95"
                    onClick={() => {
                      if (newUser.username && newUser.password && newUser.full_name) {
                        createUserMutation.mutate(newUser);
                      } else {
                        alert("Iltimos barcha maydonlarni to'ldiring");
                      }
                    }}
                  >
                    Saqlash
                  </button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Foydalanuvchi qidirish..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Yuklanmoqda...</span>
            </div>
          ) : filteredUsers?.map((user: any) => (
            <div key={user.id} className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-all"></div>
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{user.full_name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">@{user.username}</p>
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${roleColors[user.role]}`}>
                  {user.role === 'ADMIN' ? 'SUPER ADMIN' : user.role}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800 relative z-10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2 font-medium">
                    <Shield size={14} className="text-blue-500" /> Holat
                  </span>
                  <span className="text-green-500 font-bold flex items-center gap-1">
                    <UserCheck size={14} /> Faol
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Yaratilgan sana</span>
                  <span className="text-gray-900 dark:text-white font-bold">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 relative z-10">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95">
                      <Edit2 size={14} /> Taxrirlash
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Foydalanuvchini taxrirlash</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                       <div className="grid gap-2">
                          <label className="text-sm font-semibold">Toliq ism</label>
                          <input 
                            className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                            defaultValue={user.full_name}
                            onChange={(e) => user.new_full_name = e.target.value}
                          />
                        </div>
                       <div className="grid gap-2">
                          <label className="text-sm font-semibold">Yangi Rol</label>
                          <select 
                            className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none"
                            onChange={(e) => user.new_role = e.target.value}
                            defaultValue={user.role}
                          >
                            <option value="ADMIN">Super Admin</option>
                            <option value="DISPATCHER">Dispetcher</option>
                            <option value="FINANCE">Moliya xodimi</option>
                            <option value="VIEWER">Kuzatuvchi</option>
                            <option value="DRIVER">Haydovchi</option>
                          </select>
                        </div>
                       <div className="grid gap-2">
                          <label className="text-sm font-semibold">Yangi Parol (ixtiyoriy)</label>
                          <input 
                            type="password"
                            placeholder="Bo'sh qolsa o'zgarmaydi"
                            className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                            onChange={(e) => user.new_password = e.target.value}
                          />
                        </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <button 
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold"
                          onClick={() => updateUserMutation.mutate({ 
                            id: user.id, 
                            role: user.new_role || user.role, 
                            full_name: user.new_full_name || user.full_name,
                            password: user.new_password
                          })}
                        >
                          Saqlash
                        </button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <button 
                  onClick={() => {
                    if (confirm(`${user.full_name} ni o'chirishni xohlaysizmi?`)) {
                      deleteUserMutation.mutate(user.id);
                    }
                  }}
                  className="px-3 py-2.5 border border-red-200 dark:border-red-900/30 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all active:scale-95"
                >
                  <UserX size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
