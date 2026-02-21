import { useState } from 'react';
import {
  Package,
  User,
  MapPin,
  DollarSign,
  ChevronDown
} from 'lucide-react';
import { getDriverIcon } from '../utils/icons';

interface DispatchLoad {
  id: string;
  loadId: string;
  priority: 'High' | 'Medium' | 'Low';
  route: {
    from: string;
    to: string;
  };
  details: string;
  status: 'Unassigned' | 'Assigned' | 'In Transit' | 'Delivered';
  driver?: {
    name: string;
    avatar: string;
  };
  rate: string;
}

const mockDispatchLoads: DispatchLoad[] = [
  {
    id: '1',
    loadId: 'LD-2024-001851',
    priority: 'High',
    route: { from: 'Houston, TX', to: 'Tampa, LA' },
    details: 'FTL Feb 8, 08:00',
    status: 'Unassigned',
    rate: '$1,680'
  },
  {
    id: '2',
    loadId: 'LD-2024-001852',
    priority: 'High',
    route: { from: 'Dallas, TX', to: 'Boston, MA' },
    details: 'LTL Feb 8, 10:30',
    status: 'Assigned',
    driver: { name: 'Carlos Chen', avatar: '👨‍✈️' },
    rate: '$2,450'
  },
  {
    id: '3',
    loadId: 'LD-2024-001847',
    priority: 'Medium',
    route: { from: 'Chicago, IL', to: 'Atlanta, GA' },
    details: 'FTL Feb 9, 14:00',
    status: 'In Transit',
    driver: { name: 'Sarah Martinez', avatar: '👩‍✈️' },
    rate: '$1,890'
  },
  {
    id: '4',
    loadId: 'LD-2024-001850',
    priority: 'High',
    route: { from: 'Miami, FL', to: 'Jacksonville, FL' },
    details: 'FTL Feb 8, 06:00',
    status: 'Delivered',
    driver: { name: 'David Brown', avatar: '👨‍✈️' },
    rate: '$950'
  },
  {
    id: '5',
    loadId: 'LD-2024-001853',
    priority: 'Medium',
    route: { from: 'Phoenix, AZ', to: 'Las Vegas, NV' },
    details: 'FTL Feb 9, 07:30',
    status: 'Unassigned',
    rate: '$1,280'
  },
  {
    id: '6',
    loadId: 'LD-2024-001848',
    priority: 'Medium',
    route: { from: 'Portland, OR', to: 'San Francisco, CA' },
    details: 'LTL Feb 8, 11:00',
    status: 'Assigned',
    driver: { name: 'James Martinez', avatar: '👨‍✈️' },
    rate: '$1,750'
  },
  {
    id: '7',
    loadId: 'LD-2024-001854',
    priority: 'Low',
    route: { from: 'Boston, MA', to: 'New York, NY' },
    details: 'FTL Feb 9, 08:30',
    status: 'Unassigned',
    rate: '$850'
  },
  {
    id: '8',
    loadId: 'LD-2024-001849',
    priority: 'Medium',
    route: { from: 'Los Angeles, CA', to: 'Seattle, WA' },
    details: 'FTL Feb 9, 09:00',
    status: 'In Transit',
    driver: { name: 'David Thompson', avatar: '👨‍✈️' },
    rate: '$2,280'
  },
  {
    id: '9',
    loadId: 'LD-2024-001855',
    priority: 'Low',
    route: { from: 'Denver, CO', to: 'Kansas City, MO' },
    details: 'LTL Feb 9, 12:00',
    status: 'Unassigned',
    rate: '$980'
  },
  {
    id: '10',
    loadId: 'LD-2024-001837',
    priority: 'Medium',
    route: { from: 'Buffalo, NY', to: 'Albany, NY' },
    details: 'FTL Feb 8, 16:30',
    status: 'Delivered',
    driver: { name: 'Patricia Wilson', avatar: '👩‍✈️' },
    rate: '$1,120'
  }
];

const priorityColors = {
  'High': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Medium': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Low': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
};

const statusColors = {
  'Unassigned': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  'Assigned': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'In Transit': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Delivered': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
};

export function DispatchBoardPage() {
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterDriverStatus, setFilterDriverStatus] = useState<string>('All');
  const [filterLocation, setFilterLocation] = useState<string>('All Locations');

  const allLocations = Array.from(new Set(mockDispatchLoads.flatMap(load => [
    load.route.from.split(',')[0],
    load.route.to.split(',')[0]
  ]))).sort();

  const getFilteredLoads = () => {
    return mockDispatchLoads.filter(load => {
      if (filterPriority !== 'All' && load.priority !== filterPriority) return false;
      if (filterDriverStatus === 'Assigned' && !load.driver) return false;
      if (filterDriverStatus === 'Unassigned' && load.driver) return false;
      if (filterLocation !== 'All Locations') {
        if (!load.route.from.includes(filterLocation) && !load.route.to.includes(filterLocation)) return false;
      }
      return true;
    });
  };

  const statusCounts = {
    'Unassigned': getFilteredLoads().filter(l => l.status === 'Unassigned').length,
    'Assigned': getFilteredLoads().filter(l => l.status === 'Assigned').length,
    'In Transit': getFilteredLoads().filter(l => l.status === 'In Transit').length,
    'Delivered': getFilteredLoads().filter(l => l.status === 'Delivered').length
  };

  const getLoadsByStatus = (status: string) => {
    return getFilteredLoads().filter(load => load.status === status);
  };

  const renderLoadColumn = (status: string) => {
    const loads = getLoadsByStatus(status);

    return (
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'Unassigned' ? 'bg-gray-500' :
              status === 'Assigned' ? 'bg-blue-500' :
                status === 'In Transit' ? 'bg-green-500' :
                  'bg-purple-500'
              }`} />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {status}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {status === 'All' ? getFilteredLoads().length : statusCounts[status as keyof typeof statusCounts]}
            </span>
          </div>
        </div>

        <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
          {loads.map((load) => (
            <div
              key={load.id}
              className="bg-white dark:bg-[#1E293B] rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {load.loadId}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {load.details}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[load.priority]}`}>
                  {load.priority}
                </span>
              </div>

              {/* Route */}
              <div className="space-y-2 mb-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {load.route.from}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {load.route.to.split(',')[0]}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {load.route.to}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {load.route.to.split(',')[1]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Driver or Status */}
              {load.driver ? (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {getDriverIcon(load.driver.name)}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                    {load.driver.name}
                  </p>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {load.status === 'Unassigned' ? 'Awaiting driver assignment' : load.status}
                  </p>
                </div>
              )}

              {/* Rate */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                <span className="text-xs text-gray-500 dark:text-gray-400">Rate</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {load.rate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Dispatch Board
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage load assignments and optimize dispatch operations
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
              Auto-Assign
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm">
              Create New Load
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Driver Status:</span>
            <select
              value={filterDriverStatus}
              onChange={(e) => setFilterDriverStatus(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="Assigned">Assigned</option>
              <option value="Unassigned">Unassigned</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Location:</span>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All Locations">All Locations</option>
              {allLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          {(filterPriority !== 'All' || filterDriverStatus !== 'All' || filterLocation !== 'All Locations') && (
            <button
              onClick={() => {
                setFilterPriority('All');
                setFilterDriverStatus('All');
                setFilterLocation('All Locations');
              }}
              className="text-sm text-[#2563EB] hover:underline ml-2"
            >
              × Clear All
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-4 h-full">
          {renderLoadColumn('Unassigned')}
          {renderLoadColumn('Assigned')}
          {renderLoadColumn('In Transit')}
          {renderLoadColumn('Delivered')}
        </div>
      </div>
    </div>
  );
}
