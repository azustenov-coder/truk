import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  Fuel,
  Wrench,
  Navigation,
  MoreHorizontal,
  Download
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";

const categoryIcons: Record<string, any> = {
  'Fuel': <Fuel size={18} />,
  'Repair': <Wrench size={18} />,
  'Toll': <Navigation size={18} />,
  'Other': <MoreHorizontal size={18} />
};

export function ExpensesPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const res = await axios.get('/api/expenses');
      return res.data;
    }
  });

  const createExpenseMutation = useMutation({
    mutationFn: (newExpense: any) => axios.post('/api/expenses', newExpense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    }
  });

  const [newExpense, setNewExpense] = useState({
    truck_id: '',
    category: 'Fuel',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const filteredExpenses = expenses?.filter((e: any) => 
    e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.truck_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpenses = filteredExpenses?.reduce((sum: number, e: any) => sum + e.amount, 0) || 0;

  const exportToExcel = () => {
    const data = filteredExpenses.map((e: any) => ({
      'Truck ID': e.truck_id,
      'Category': e.category,
      'Amount ($)': e.amount,
      'Date': e.date,
      'Description': e.description
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Operational Expenses');
    XLSX.writeFile(workbook, `Truk_Expenses_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F172A]">
      <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
              {t('sidebar.expenses') || 'Xarajatlar'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Operatsion xarajatlar va yoqilg'i hisoboti
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <Download size={16} />
              Eksport
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                  <Plus size={16} />
                  Xarajat qo'shish
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Yangi xarajat kiritish</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold">Yuk mashinasi ID</label>
                    <input 
                      placeholder="TRK-001"
                      className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={(e) => setNewExpense({...newExpense, truck_id: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold">Kategoriya</label>
                      <select 
                        className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none"
                        onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                        value={newExpense.category}
                      >
                        <option value="Fuel">Yoqilg'i</option>
                        <option value="Repair">Ta'mirlash</option>
                        <option value="Toll">Yo'l haqi</option>
                        <option value="Other">Boshqa</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold">Summa ($)</label>
                      <input 
                        type="number"
                        placeholder="0.00"
                        className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold">Sana</label>
                    <input 
                      type="date"
                      className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      defaultValue={newExpense.date}
                      onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold">Tavsif</label>
                    <textarea 
                      placeholder="Xarajat haqida batafsil..."
                      className="px-3 py-2 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                      onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all"
                      onClick={() => {
                        if (newExpense.truck_id && newExpense.amount) {
                          createExpenseMutation.mutate({
                            ...newExpense,
                            amount: parseFloat(newExpense.amount)
                          });
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Umumiy xarajatlar</p>
            <p className="text-2xl font-black text-blue-900 dark:text-white mt-1">
              ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 p-4 rounded-xl">
            <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Yoqilg'i (Fuel)</p>
            <p className="text-2xl font-black text-orange-900 dark:text-white mt-1">
              ${filteredExpenses?.filter((e: any) => e.category === 'Fuel').reduce((sum: number, e: any) => sum + e.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 p-4 rounded-xl">
            <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Tranzaksiyalar</p>
            <p className="text-2xl font-black text-purple-900 dark:text-white mt-1">
              {filteredExpenses?.length || 0} ta
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Qidiruv (Mashina ID yoki tavsif)..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
              <Filter size={16} />
              Filtrlar
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Mashina ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Kategoriya</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Tavsif</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Sana</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Summa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                       <span className="text-sm font-bold text-gray-400 uppercase">Yuklanmoqda...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredExpenses?.map((expense: any) => (
                <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-[#0F172A] transition-all group">
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-black text-gray-700 dark:text-gray-300">
                      {expense.truck_id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${
                        expense.category === 'Fuel' ? 'bg-orange-100 text-orange-600' :
                        expense.category === 'Repair' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {categoryIcons[expense.category] || <MoreHorizontal size={18} />}
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white capitalize">{expense.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md truncate">{expense.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <CalendarIcon size={14} />
                      <span className="text-sm font-medium">{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-black text-gray-900 dark:text-white">
                      ${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
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
