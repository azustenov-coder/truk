import {
  Navigation,
  TrendingUp,
  AlertCircle,
  Truck,
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
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const mockRoutes = [
  { id: 'TRK-004', location: 'Chicago', lat: 41.8781, lng: -87.6298, status: 'On Time', color: 'green' },
  { id: 'TRK-007', location: 'Atlanta', lat: 33.7490, lng: -84.3880, status: 'On Time', color: 'green' },
  { id: 'TRK-002', location: 'Denver', lat: 39.7392, lng: -104.9903, status: 'Delayed', color: 'red' },
  { id: 'TRK-015', location: 'Phoenix', lat: 33.4484, lng: -112.0740, status: 'On Time', color: 'green' },
  { id: 'TRK-009', location: 'Miami', lat: 25.7617, lng: -80.1918, status: 'On Time', color: 'green' },
  { id: 'TRK-011', location: 'Boston', lat: 42.3601, lng: -71.0589, status: 'Warning', color: 'yellow' }
];

const createCustomIcon = (text: string, color: string, delay: boolean) => {
  const colorMap: Record<string, string> = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };
  const bgClass = colorMap[color] || 'bg-gray-500';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position: absolute; transform: translate(-50%, -100%); z-index: 10;">
        <div class="relative flex flex-col items-center">
          <div class="w-4 h-4 ${bgClass} rounded-full border-2 border-white dark:border-[#1E293B] shadow-md z-10"></div>
          <div class="w-4 h-4 ${bgClass} rounded-full animate-ping absolute top-0 left-0 -z-10 opacity-75"></div>
          
          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1E293B] px-3 py-1.5 rounded-lg shadow-xl text-xs font-semibold whitespace-nowrap text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 flex items-center">
            ${text}
            ${delay ? '<span class="text-red-500 ml-1">(Delayed)</span>' : ''}
            <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-white dark:border-t-[#1E293B]"></div>
          </div>
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

export function RoutesTrackingPage() {
  const defaultMapProps = {
    center: {
      lat: 39.0, // Center of US
      lng: -94.0
    },
    zoom: 4.5
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F172A]">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
              Routes & Tracking
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Real-time GPS tracking and route optimization
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm bg-white dark:bg-transparent focus:outline-none">
                  Export Data
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Export Route Data</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                      <Navigation className="text-blue-500 w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Export active routes and history</p>
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

            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-[#1d4ed8] transition-colors shadow-sm focus:outline-none">
                  <Navigation size={16} />
                  Route Optimization
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Run Route Optimization</DialogTitle>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Optimize current routes based on real-time traffic, weather, and distance parameters.</p>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" defaultChecked />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Prioritize shortest distance</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" defaultChecked />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Avoid toll roads</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Consider live traffic (Beta)</span>
                    </label>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                    <AlertCircle size={20} className="text-blue-500 mb-2" />
                    <p className="text-xs text-blue-700 dark:text-blue-300">Optimization may take a few moments depending on the number of active routes and factors considered.</p>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-700 shadow-sm">Cancel</button>
                  </DialogClose>
                  <button className="px-5 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-semibold shadow-sm ml-2">Run Optimization</button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Navigation size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">23</p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Routes</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">94.2%</p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">On-Time Performance</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <AlertCircle size={24} className="text-red-500 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Critical Delays</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Truck size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">18/20</p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fleet Status</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mt-4 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Route Status:</span>
            <select className="px-3 py-1.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Routes</option>
              <option>On Time</option>
              <option>Delayed</option>
              <option>Warning</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Range:</span>
            <select className="px-3 py-1.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Driver:</span>
            <select className="px-3 py-1.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Drivers</option>
            </select>
          </div>
          <button className="text-sm font-medium text-[#2563EB] hover:text-blue-700 transition-colors ml-2">
            Clear Filters
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex-1 p-6 z-0">
        <div className="h-full bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden relative">

          {/* Free Leaflet Map Integration */}
          <div className="absolute inset-0 z-0">
            <MapContainer
              center={[defaultMapProps.center.lat, defaultMapProps.center.lng]}
              zoom={defaultMapProps.zoom}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              {mockRoutes.map(route => (
                <Marker
                  key={route.id}
                  position={[route.lat, route.lng]}
                  icon={createCustomIcon(
                    route.id === 'TRK-002' ? 'TRK-002' : route.location,
                    route.color,
                    route.status === 'Delayed'
                  )}
                />
              ))}
            </MapContainer>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 pointer-events-none">
            {/* Added pointer events none to buttons container so it doesn't block map pan but we can't click them anymore unless we set pointer events auto on buttons */}
            <div className="flex flex-col gap-2 pointer-events-auto">
              {/* Native google map zoom will handle it, but we can leave these aesthetic mock buttons */}
              <button className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 font-medium border border-gray-100 dark:border-gray-700">
                +
              </button>
              <button className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 font-medium border border-gray-100 dark:border-gray-700">
                −
              </button>
              <button className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 font-medium border border-gray-100 dark:border-gray-700 mt-2">
                <Navigation size={16} />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-6 left-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg p-4 space-y-2 border border-gray-100 dark:border-gray-700 z-10 min-w-[140px]">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Status Legend</h4>
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-sm"></div>
              <span className="text-gray-700 dark:text-gray-300">On Time</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full shadow-sm"></div>
              <span className="text-gray-700 dark:text-gray-300">Warning</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm"></div>
              <span className="text-gray-700 dark:text-gray-300">Delayed</span>
            </div>
          </div>

          {/* Live Tracking Info Box */}
          <div className="absolute top-6 left-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg p-5 max-w-sm border border-gray-100 dark:border-gray-700 z-10">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Live Tracking Active</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-8">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Vehicles:</span>
                <span className="text-base font-bold text-gray-900 dark:text-white">23</span>
              </div>
              <div className="flex justify-between items-center gap-8">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated:</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Just now</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
