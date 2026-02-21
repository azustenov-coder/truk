import { Load } from '../data/mockData';
import {
  X,
  MapPin,
  Clock,
  User,
  Phone,
  Truck,
  Package,
  FileText,
  Download,
  CheckCircle2,
  Circle,
  DollarSign,
  Weight,
  Route
} from 'lucide-react';
import { getCustomerIcon, getDriverIcon } from '../utils/icons';

interface LoadDetailsPanelProps {
  load: Load;
  onClose: () => void;
}

export function LoadDetailsPanel({ load, onClose }: LoadDetailsPanelProps) {
  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white dark:bg-[#1E293B] border-l border-gray-200 dark:border-gray-800 shadow-xl overflow-y-auto z-10">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between z-10">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Load Details
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {load.loadId}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${load.status === 'In Transit'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : load.status === 'Assigned'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                  : load.status === 'Delivered'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : load.status === 'Loading'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : load.status === 'At Pickup'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
          >
            {load.status}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ETA: {load.eta}
          </span>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm">
              {getCustomerIcon(load.customer)}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {load.customer}
              </p>
            </div>
          </div>
        </div>

        {/* Route Stops */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Route size={16} />
            Route Timeline
          </h3>
          <div className="space-y-4">
            {load.routeStops.map((stop, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  {stop.status === 'completed' ? (
                    <CheckCircle2 size={20} className="text-green-500" />
                  ) : stop.status === 'current' ? (
                    <div className="w-5 h-5 rounded-full border-4 border-blue-500 bg-white dark:bg-[#1E293B]" />
                  ) : (
                    <Circle size={20} className="text-gray-300 dark:text-gray-600" />
                  )}
                  {index < load.routeStops.length - 1 && (
                    <div className={`w-0.5 h-12 mt-2 ${stop.status === 'completed' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
                      }`} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {stop.location}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {stop.time} • {stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pickup Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-green-600" />
            Pickup Details
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {load.pickup.location}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {load.pickup.address}, {load.pickup.city}, {load.pickup.state} {load.pickup.zip}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {load.pickup.date} at {load.pickup.time}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {load.pickup.contact}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-400" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {load.pickup.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-red-600" />
            Delivery Details
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {load.delivery.location}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {load.delivery.address}, {load.delivery.city}, {load.delivery.state} {load.delivery.zip}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {load.delivery.date} at {load.delivery.time}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-gray-400" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {load.delivery.contact}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-400" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {load.delivery.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Driver & Vehicle Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Truck size={16} />
            Assigned Resources
          </h3>
          <div className="space-y-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Driver</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {getDriverIcon(load.driver.name)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {load.driver.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {load.driver.phone}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Vehicle</p>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {load.vehicle.type}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {load.vehicle.plate} • {load.vehicle.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Load Details */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Package size={16} />
            Load Information
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Commodity</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {load.commodity}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Weight</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {load.weight}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Distance</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {load.distance}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {load.notes && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Notes
            </h3>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-xl p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {load.notes}
              </p>
            </div>
          </div>
        )}

        {/* Documents */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FileText size={16} />
            Documents
          </h3>
          <div className="space-y-2">
            {load.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                    <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {doc.type}
                    </p>
                  </div>
                </div>
                <Download size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Billing Status */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <DollarSign size={16} />
            Billing
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {load.billingAmount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${load.billingStatus === 'Paid'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : load.billingStatus === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
              >
                {load.billingStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button className="flex-1 px-4 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-medium">
            Track Load
          </button>
          <button className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
