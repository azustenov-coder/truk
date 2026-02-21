import { useState } from 'react';
import {
  Receipt,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Calendar,
  Download,
  Eye,
  Send,
  ChevronDown
} from 'lucide-react';
import { getCustomerIcon } from '../utils/icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  customerLogo: string;
  contact: string;
  amount: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  daysOverdue?: number;
  createdDate: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customer: 'TechCorp Industries',
    customerLogo: '🏢',
    contact: 'accounts@techcorp.com',
    amount: '$24,750.00',
    dueDate: 'Dec 15, 2024',
    status: 'Overdue',
    daysOverdue: 45,
    createdDate: 'Created Oct 28, 2024'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customer: 'Global Manufacturing Co',
    customerLogo: '🏭',
    contact: 'billing@globalmfg.com',
    amount: '$18,950.00',
    dueDate: 'Dec 23, 2024',
    status: 'Pending',
    createdDate: 'Created Nov 15, 2024'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    customer: 'Retail Solutions Inc',
    customerLogo: '🛒',
    contact: 'finance@retailsol.com',
    amount: '$32,400.00',
    dueDate: 'Dec 5, 2024',
    status: 'Paid',
    createdDate: 'Created Oct 20, 2024'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    customer: 'Logistics Partners LLC',
    customerLogo: '📦',
    contact: 'billing@logpartners.com',
    amount: '$15,680.00',
    dueDate: 'Nov 27, 2024',
    status: 'Overdue',
    daysOverdue: 67,
    createdDate: 'Created Oct 15, 2024'
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    customer: 'Metro Distribution Hub',
    customerLogo: '🚚',
    contact: 'ap@metrodist.com',
    amount: '$28,200.00',
    dueDate: 'Dec 20, 2024',
    status: 'Pending',
    createdDate: 'Created Nov 8, 2024'
  },
  {
    id: '6',
    invoiceNumber: 'INV-2024-006',
    customer: 'Coastal Freight Solutions',
    customerLogo: '⚓',
    contact: 'billing@coastalfreight.com',
    amount: '$21,350.00',
    dueDate: 'Dec 18, 2024',
    status: 'Paid',
    createdDate: 'Created Nov 1, 2024'
  }
];

const statusColors = {
  'Paid': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Pending': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Overdue': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
};

export function BillingPage() {
  const [filterStatus, setFilterStatus] = useState<string>('All Status');
  const [filterCustomer, setFilterCustomer] = useState<string>('All Customers');
  const [filterAging, setFilterAging] = useState<string>('All Aging');

  const allCustomers = Array.from(new Set(mockInvoices.map(i => i.customer))).sort();

  const getFilteredInvoices = () => {
    return mockInvoices.filter(i => {
      if (filterStatus !== 'All Status' && i.status !== filterStatus) return false;
      if (filterCustomer !== 'All Customers' && i.customer !== filterCustomer) return false;
      if (filterAging !== 'All Aging') {
        if (filterAging === 'Current' && i.status === 'Overdue') return false;
        if (filterAging !== 'Current') {
          if (!i.daysOverdue) return false;
          if (filterAging === '< 30 Days' && i.daysOverdue >= 30) return false;
          if (filterAging === '30 - 60 Days' && (i.daysOverdue < 30 || i.daysOverdue >= 60)) return false;
          if (filterAging === '> 60 Days' && i.daysOverdue < 60) return false;
        }
      }
      return true;
    });
  };

  const filteredInvoices = getFilteredInvoices();

  const totalOutstanding = filteredInvoices
    .filter(i => i.status !== 'Paid')
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, '')), 0);

  const totalPaid = filteredInvoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, '')), 0);

  const totalPending = filteredInvoices
    .filter(i => i.status === 'Pending')
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, '')), 0);

  const totalOverdue = filteredInvoices
    .filter(i => i.status === 'Overdue')
    .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[$,]/g, '')), 0);

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              BILLING & INVOICES
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage invoices, track payments, and handle customer billing
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none shadow-sm bg-white dark:bg-[#1E293B]">
                  <Download size={16} />
                  Export Data
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Export Invoices</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                      <Download className="text-blue-500 w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Export as CSV or PDF</p>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">Select date range and format</p>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm">Cancel</button>
                  </DialogClose>
                  <button className="px-5 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold shadow-sm ml-2">Export Now</button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
              Settings
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm focus:outline-none font-medium">
                  + Create Invoice
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Customer</label>
                      <select className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>TechCorp Industries</option>
                        <option>Global Manufacturing</option>
                        <option>Retail Solutions</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Amount ($)</label>
                      <input type="number" placeholder="0.00" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Due Date</label>
                      <input type="date" className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Invoice Status</label>
                      <select className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Pending</option>
                        <option>Paid</option>
                        <option>Overdue</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notes / Description</label>
                    <textarea rows={3} placeholder="Add invoice details..." className="px-3 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm">Cancel</button>
                  </DialogClose>
                  <button className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold shadow-sm ml-2">Generate</button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Outstanding</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
              ${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <p className="text-sm text-green-600 dark:text-green-400">Paid</p>
            <p className="text-2xl font-semibold text-green-700 dark:text-green-300 mt-2">
              ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
            <p className="text-2xl font-semibold text-yellow-700 dark:text-yellow-300 mt-2">
              ${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
            <p className="text-sm text-red-600 dark:text-red-400">Overdue</p>
            <p className="text-2xl font-semibold text-red-700 dark:text-red-300 mt-2">
              ${totalOverdue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All Status">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterCustomer}
              onChange={(e) => setFilterCustomer(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All Customers">All Customers</option>
              {allCustomers.map(customer => (
                <option key={customer} value={customer}>{customer}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">11/01/2024</span>
            <span className="text-gray-400">to</span>
            <Calendar size={14} className="text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">12/08/2024</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterAging}
              onChange={(e) => setFilterAging(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All Aging">All Aging</option>
              <option value="Current">Current</option>
              <option value="< 30 Days">&lt; 30 Days Overdue</option>
              <option value="30 - 60 Days">30-60 Days Overdue</option>
              <option value="> 60 Days">&gt; 60 Days Overdue</option>
            </select>
          </div>
          {(filterStatus !== 'All Status' || filterCustomer !== 'All Customers' || filterAging !== 'All Aging') && (
            <button
              onClick={() => {
                setFilterStatus('All Status');
                setFilterCustomer('All Customers');
                setFilterAging('All Aging');
              }}
              className="text-sm text-[#2563EB] hover:underline ml-2"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Invoice Table */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {invoice.createdDate}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {getCustomerIcon(invoice.customer)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {invoice.customer}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {invoice.contact}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {invoice.amount}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {invoice.dueDate}
                      </p>
                      {invoice.daysOverdue && (
                        <p className="text-xs text-red-600 dark:text-red-400">
                          {invoice.daysOverdue} days overdue
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="View">
                        <Eye size={16} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Send">
                        <Send size={16} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Download">
                        <Download size={16} className="text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing 1-{filteredInvoices.length} of {filteredInvoices.length} invoices
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-2 bg-[#2563EB] text-white rounded-lg text-sm">
              1
            </button>
            <button className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              2
            </button>
            <button className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
