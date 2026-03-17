import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Navigation,
  TrendingUp,
  AlertCircle,
  Truck,
  Loader2
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
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

interface TruckPosition {
  id: string;
  truck_id: string;
  lat: number;
  lng: number;
  status: string;
  last_updated: string;
}

export function RoutesTrackingPage() {
  const { t } = useTranslation();

  const createCustomIcon = (text: string, color: string, delay: boolean) => {
    const bgClass = color === 'red' ? 'bg-red-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500';

    return L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="position: absolute; transform: translate(-50%, -100%); z-index: 10;">
          <div class="relative flex flex-col items-center">
            <div class="w-4 h-4 ${bgClass} rounded-full border-2 border-white dark:border-[#1E293B] shadow-sm z-10"></div>
            <div class="w-4 h-4 ${bgClass} rounded-full animate-ping absolute top-0 left-0 -z-10 opacity-75"></div>
            
            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1E293B] px-3 py-1.5 rounded-lg shadow-xl text-xs font-semibold whitespace-nowrap text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 flex items-center">
              ${text}
              ${delay ? `<span class="text-red-500 ml-1">(${t('common.delayed', 'Delayed')})</span>` : ''}
              <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-white dark:border-t-[#1E293B]"></div>
            </div>
          </div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });
  };
  const [positions, setPositions] = useState<TruckPosition[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPositions = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tracking');
      setPositions(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch tracking data', err);
    }
  };

  useEffect(() => {
    fetchPositions();
    const interval = setInterval(fetchPositions, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const defaultMapProps = {
    center: { lat: 39.0, lng: -98.0 },
    zoom: 4.5
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F172A]">
      <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
              {t('tracking.title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('tracking.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-[#1d4ed8] transition-colors shadow-sm">
              <Navigation size={16} />
              {t('tracking.optimization')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Navigation size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{positions.length}</p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('tracking.active_routes')}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">96%</p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('tracking.on_time')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 relative">
        <div className="h-full bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden relative">
          <MapContainer
            center={[defaultMapProps.center.lat, defaultMapProps.center.lng]}
            zoom={defaultMapProps.zoom}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            {positions.map(p => (
              <Marker
                key={p.id}
                position={[p.lat, p.lng]}
                icon={createCustomIcon(
                  p.truck_id,
                  p.status === 'Delayed' ? 'red' : 'green',
                  p.status === 'Delayed'
                )}
              >
                <Popup>
                  <div className="p-2">
                    <p className="font-bold">{p.truck_id}</p>
                    <p className="text-xs">{t('common.status')}: {p.status === 'Delayed' ? t('common.delayed', 'Delayed') : p.status}</p>
                    <p className="text-[10px] text-gray-500">{t('common.updated', 'Updated')}: {new Date(p.last_updated).toLocaleTimeString()}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {loading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
          )}

          <div className="absolute top-6 left-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg p-5 max-w-sm border border-gray-100 dark:border-gray-700 z-[500]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">{t('tracking.live_active')}</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center gap-8">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('tracking.active_vehicles')}:</span>
                <span className="text-base font-bold text-gray-900 dark:text-white">{positions.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
