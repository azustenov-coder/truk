import { useState } from 'react';
import {
  Download,
  Plus,
  Calendar,
  ChevronDown,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const revenueData = [
  { name: 'Jul', value: 380 },
  { name: 'Aug', value: 395 },
  { name: 'Sep', value: 410 },
  { name: 'Oct', value: 425 },
  { name: 'Nov', value: 415 },
  { name: 'Dec', value: 425 },
];

const marginData = [
  { name: 'Oct', bottomPart: 18, topPart: 12 },
  { name: 'Nov', bottomPart: 18, topPart: 12.5 },
  { name: 'Dec', bottomPart: 18, topPart: 12.7 },
];

const accessorialsData = [
  { name: 'Detention', value: 39 },
  { name: 'Loading', value: 23 },
  { name: 'Fuel', value: 15 },
  { name: 'Other', value: 8 },
];

export function ReportsPage() {
  const [showRevenueSummary, setShowRevenueSummary] = useState(false);
  const [showMarginSummary, setShowMarginSummary] = useState(false);
  const [showAccessorialsSummary, setShowAccessorialsSummary] = useState(false);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F172A]">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
              REPORTS
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Reports module with chart-first design for operational and financial analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-[#1E293B] shadow-sm">
              <Download size={16} />
              Bulk Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
              <Plus size={16} />
              Custom Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">11/01/2024</span>
              <Calendar size={14} className="text-gray-400" />
            </div>
            <span className="text-gray-400 text-sm px-1">to</span>
            <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer">
              <span className="text-sm text-gray-700 dark:text-gray-300">12/08/2024</span>
              <Calendar size={14} className="text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer font-medium min-w-[140px] justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">All Departments</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer font-medium min-w-[120px] justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">All Types</span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>

          <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-2 font-medium">
            Clear Filters
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* Financial Reports Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Reports</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">Revenue analysis and financial metrics</span>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Revenue Trends Card */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">Revenue Trends</h3>
              <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full font-medium">Last 6 months</span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#38BDF8" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#38BDF8', strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-end mt-6">
              <div>
                <p className="text-2xl font-bold text-[#10B981] mb-1">$2.4M</p>
                <p className="text-xs text-gray-400 font-medium">Total Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#3B82F6] mb-1">+12.5%</p>
                <p className="text-xs text-gray-400 font-medium">Growth Rate</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">$425K</p>
                <p className="text-xs text-gray-400 font-medium">This Month</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Downloading Revenue Trends report as PDF...')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#EF4444] text-white text-xs font-semibold hover:bg-red-600 transition-colors shadow-sm focus:outline-none"
                >
                  <FileText size={14} /> PDF
                </button>
                <button
                  onClick={() => alert('Downloading Revenue Trends data as CSV...')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#10B981] text-white text-xs font-semibold hover:bg-green-600 transition-colors shadow-sm focus:outline-none"
                >
                  <FileSpreadsheet size={14} /> CSV
                </button>
              </div>
              <button className="text-sm font-semibold text-[#3B82F6] hover:text-blue-700 transition-colors">
                View Details
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                onClick={() => setShowRevenueSummary(!showRevenueSummary)}
                className="text-sm font-semibold text-[#3B82F6] hover:underline transition-all focus:outline-none"
              >
                Toggle AI Summary
              </button>
            </div>
            {showRevenueSummary && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <span className="font-bold">AI Analysis:</span> Revenue has been growing steadily by 12.5% this quarter, largely driven by optimized route planning and higher delivery success rates.
                </p>
              </div>
            )}
          </div>

          {/* Margin Analysis Card */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">Margin Analysis</h3>
              <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full font-medium">Last 3 months</span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marginData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }} barSize={38}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="bottomPart" stackId="a" fill="#6EE7B7" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="topPart" stackId="a" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-end mt-6">
              <div>
                <p className="text-2xl font-bold text-[#10B981] mb-1">18.2%</p>
                <p className="text-xs text-gray-400 font-medium">Gross Margin</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#3B82F6] mb-1">12.7%</p>
                <p className="text-xs text-gray-400 font-medium">Net Margin</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">+1.3%</p>
                <p className="text-xs text-gray-400 font-medium">vs Last Quarter</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Downloading Margin Analysis report as PDF...')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#EF4444] text-white text-xs font-semibold hover:bg-red-600 transition-colors shadow-sm focus:outline-none"
                >
                  <FileText size={14} /> PDF
                </button>
                <button
                  onClick={() => alert('Downloading Margin Analysis data as CSV...')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#10B981] text-white text-xs font-semibold hover:bg-green-600 transition-colors shadow-sm focus:outline-none"
                >
                  <FileSpreadsheet size={14} /> CSV
                </button>
              </div>
              <button className="text-sm font-semibold text-[#3B82F6] hover:text-blue-700 transition-colors">
                View Details
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                onClick={() => setShowMarginSummary(!showMarginSummary)}
                className="text-sm font-semibold text-[#3B82F6] hover:underline transition-all focus:outline-none"
              >
                Toggle AI Summary
              </button>
            </div>
            {showMarginSummary && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <span className="font-bold">AI Analysis:</span> Gross margins have stabilized around 18.2%, but net margins improved +1.3% due to reduced fuel expenses and better preventive maintenance.
                </p>
              </div>
            )}
          </div>

          {/* Accessorials Card */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">Accessorials</h3>
              <span className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full font-medium">Last 30 days</span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accessorialsData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }} barSize={38}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#FBBF24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-end mt-6">
              <div>
                <p className="text-2xl font-bold text-[#10B981] mb-1">$87.5K</p>
                <p className="text-xs text-gray-400 font-medium">Total Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#3B82F6] mb-1">22.3%</p>
                <p className="text-xs text-gray-400 font-medium">of Total Revenue</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">156</p>
                <p className="text-xs text-gray-400 font-medium">Total Charges</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Downloading Accessorials report as PDF...')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#EF4444] text-white text-xs font-semibold hover:bg-red-600 transition-colors shadow-sm focus:outline-none"
                >
                  <FileText size={14} /> PDF
                </button>
                <button
                  onClick={() => alert('Downloading Accessorials data as CSV...')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#10B981] text-white text-xs font-semibold hover:bg-green-600 transition-colors shadow-sm focus:outline-none"
                >
                  <FileSpreadsheet size={14} /> CSV
                </button>
              </div>
              <button className="text-sm font-semibold text-[#3B82F6] hover:text-blue-700 transition-colors">
                View Details
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                onClick={() => setShowAccessorialsSummary(!showAccessorialsSummary)}
                className="text-sm font-semibold text-[#3B82F6] hover:underline transition-all focus:outline-none"
              >
                Toggle AI Summary
              </button>
            </div>
            {showAccessorialsSummary && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <span className="font-bold">AI Analysis:</span> Detention accounts for the largest portion of accessorials (39%). Consider renegotiating detention terms with your top 3 consistently delayed facilities.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
