import { useState, useRef } from 'react';
import {
  Upload,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  FileText,
  Image as ImageIcon,
  ChevronDown
} from 'lucide-react';
import { getDriverIcon } from '../utils/icons';

interface PODRecord {
  id: string;
  loadId: string;
  customer: string;
  customerDetails: string;
  deliveryDate: string;
  deliveryTime: string;
  driver: {
    name: string;
    id: string;
    avatar: string;
  };
  status: 'Pending Upload' | 'Submitted' | 'Approved' | 'Rejected';
  documents: number;
  uploadedDays: number;
}

const mockPODData: PODRecord[] = [
  {
    id: '1',
    loadId: 'LOAD-2024-4578',
    customer: 'TechCorp Industries',
    customerDetails: '1450 Technology Blvd, Austin, TX',
    deliveryDate: 'Dec 8, 2024',
    deliveryTime: '2:45 PM',
    driver: { name: 'Michael Rodriguez', id: 'Driver ID: 328-7456', avatar: '👨‍✈️' },
    status: 'Pending Upload',
    documents: 0,
    uploadedDays: 30
  },
  {
    id: '2',
    loadId: 'LOAD-2024-4521',
    customer: 'Global Manufacturing Co',
    customerDetails: '3901 Industrial Way, Houston, TX',
    deliveryDate: 'Dec 8, 2024',
    deliveryTime: '12:30 PM',
    driver: { name: 'Sarah Chen', id: 'Driver ID: 156-9316', avatar: '👩‍✈️' },
    status: 'Submitted',
    documents: 2,
    uploadedDays: 2
  },
  {
    id: '3',
    loadId: 'LOAD-2024-4489',
    customer: 'Retail Solutions Inc',
    customerDetails: '8456 Commerce Dr, Dallas, TX',
    deliveryDate: 'Dec 7, 2024',
    deliveryTime: '4:15 PM',
    driver: { name: 'David Thompson', id: 'Driver ID: 287-4821', avatar: '👨‍✈️' },
    status: 'Approved',
    documents: 3,
    uploadedDays: 1
  },
  {
    id: '4',
    loadId: 'LOAD-2024-4445',
    customer: 'Logistics Partners LLC',
    customerDetails: '7240 Supply Chain Ave, Phoenix, AZ',
    deliveryDate: 'Dec 6, 2024',
    deliveryTime: '10:20 AM',
    driver: { name: 'Lisa Johnson', id: 'Driver ID: 394-5629', avatar: '👩‍✈️' },
    status: 'Rejected',
    documents: 2,
    uploadedDays: 3
  },
  {
    id: '5',
    loadId: 'LOAD-2024-4567',
    customer: 'Metro Distribution Hub',
    customerDetails: '5632 Warehouse Ln, San Diego, CA',
    deliveryDate: 'Dec 8, 2024',
    deliveryTime: '3:00 PM',
    driver: { name: 'Michael Rodriguez', id: 'Driver ID: 328-7456', avatar: '👨‍✈️' },
    status: 'Pending Upload',
    documents: 0,
    uploadedDays: 25
  }
];

const statusConfig = {
  'Pending Upload': { color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', icon: Clock, dots: 0 },
  'Submitted': { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock, dots: 2 },
  'Approved': { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle, dots: 3 },
  'Rejected': { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle, dots: 2 }
};

export function ProofOfDeliveryPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('All Loads');
  const [selectedPOD, setSelectedPOD] = useState<PODRecord | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const statusCounts = {
    'All Loads': mockPODData.length,
    'Pending Upload': mockPODData.filter(p => p.status === 'Pending Upload').length,
    'Submitted': mockPODData.filter(p => p.status === 'Submitted').length,
    'Approved': mockPODData.filter(p => p.status === 'Approved').length,
    'Rejected': mockPODData.filter(p => p.status === 'Rejected').length
  };

  const filteredData = selectedStatus === 'All Loads'
    ? mockPODData
    : mockPODData.filter(p => p.status === selectedStatus);

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${selectedPOD ? 'mr-80' : ''} transition-all duration-300`}>
        {/* Page Header */}
        <div className="bg-white dark:bg-[#1E293B] border-b border-gray-200 dark:border-gray-800 px-6 py-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Proof of Delivery (POD)
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Queue of delivered loads pending POD submission or approval
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Download size={16} />
                Export Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors shadow-sm">
                <Upload size={16} />
                Bulk Upload
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedStatus === status
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
              >
                {status} {count > 0 && <span className="ml-1.5 opacity-75">{count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-3">
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Pending Upload:</span>
              <span className="ml-2 font-semibold text-gray-900 dark:text-white">{statusCounts['Pending Upload']}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Submitted:</span>
              <span className="ml-2 font-semibold text-blue-600 dark:text-blue-400">{statusCounts['Submitted']}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Approved:</span>
              <span className="ml-2 font-semibold text-green-600 dark:text-green-400">{statusCounts['Approved']}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Rejected:</span>
              <span className="ml-2 font-semibold text-red-600 dark:text-red-400">{statusCounts['Rejected']}</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Load ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Delivery Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    POD Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredData.map((pod) => {
                  const StatusIcon = statusConfig[pod.status].icon;
                  return (
                    <tr
                      key={pod.id}
                      onClick={() => setSelectedPOD(pod)}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${selectedPOD?.id === pod.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                        }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {pod.loadId}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Delivered {pod.uploadedDays} days ago
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {pod.customer}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {pod.customerDetails}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {pod.deliveryDate}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {pod.deliveryTime}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            {getDriverIcon(pod.driver.name)}
                          </div>
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {pod.driver.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {pod.driver.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[pod.status].color}`}>
                            {pod.status}
                          </span>
                          {statusConfig[pod.status].dots > 0 && (
                            <div className="flex gap-1">
                              {[...Array(statusConfig[pod.status].dots)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full ${pod.status === 'Approved' ? 'bg-green-500' :
                                    pod.status === 'Submitted' ? 'bg-blue-500' :
                                      'bg-red-500'
                                    }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {pod.status === 'Pending Upload' ? (
                          <button className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg text-sm hover:bg-[#1d4ed8] transition-colors">
                            Upload
                          </button>
                        ) : pod.status === 'Submitted' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button className="px-3 py-1.5 text-[#2563EB] text-sm hover:underline">
                              View
                            </button>
                            <button className="px-3 py-1.5 text-green-600 text-sm hover:underline">
                              Approve
                            </button>
                          </div>
                        ) : (
                          <button className="px-3 py-1.5 text-gray-600 dark:text-gray-400 text-sm hover:underline">
                            Download
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Upload Area for Selected */}
          {selectedStatus === 'Pending Upload' && (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="mt-6 bg-white dark:bg-[#1E293B] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center transition-colors hover:border-blue-400 dark:hover:border-blue-500"
            >
              {!uploadedFile ? (
                <>
                  <Upload size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Upload POD Documents (Image/PDF)
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Drag and drop files here or click to browse
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*,.pdf"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors focus:outline-none"
                  >
                    Select Files
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <FileText size={48} className="text-[#2563EB] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {uploadedFile.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={clearFile}
                      className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        alert('File successfully submitted for review!');
                        clearFile();
                      }}
                      className="px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors focus:outline-none font-medium"
                    >
                      Upload Document
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel for POD Details */}
      {selectedPOD && (
        <div className="fixed right-0 top-16 bottom-0 w-80 bg-white dark:bg-[#1E293B] border-l border-gray-200 dark:border-gray-800 shadow-xl overflow-y-auto z-10">
          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 bg-[#2563EB] text-white px-4 py-2 rounded-lg">
                <CheckCircle size={20} />
                <div>
                  <p className="text-sm font-semibold">{selectedPOD.loadId}</p>
                  <p className="text-xs opacity-90">{selectedPOD.customer}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPOD(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Delivery Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedPOD.deliveryDate} at {selectedPOD.deliveryTime}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Driver Assigned</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {getDriverIcon(selectedPOD.driver.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedPOD.driver.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedPOD.driver.id}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Delivery Address</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedPOD.customerDetails}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                POD Documents
              </h3>
              {selectedPOD.documents > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <FileText size={20} className="text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Delivery Confirmation
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PDF • 2.3 MB</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Download size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <ImageIcon size={20} className="text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Photo Evidence
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">JPG • 4.1 MB</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                  <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No documents uploaded yet
                  </p>
                </div>
              )}
            </div>

            {selectedPOD.status === 'Submitted' && (
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Approve
                </button>
                <button className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
