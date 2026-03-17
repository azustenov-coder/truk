export interface Load {
  id: string;
  loadId: string;
  customer: string;
  customerLogo: string;
  pickup: {
    location: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    date: string;
    time: string;
    contact: string;
    phone: string;
  };
  delivery: {
    location: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    date: string;
    time: string;
    contact: string;
    phone: string;
  };
  eta: string;
  status: 'In Transit' | 'Assigned' | 'Delivered' | 'Loading' | 'At Pickup' | 'Delayed';
  driver: {
    id: string;
    name: string;
    avatar: string;
    phone: string;
    email: string;
  };
  vehicle: {
    id: string;
    type: string;
    plate: string;
  };
  distance: string;
  weight: string;
  commodity: string;
  notes: string;
  documents: Array<{ name: string; type: string; url: string }>;
  billingStatus: 'Paid' | 'Pending' | 'Overdue';
  billingAmount: string;
  routeStops: Array<{
    type: 'pickup' | 'delivery' | 'stop';
    location: string;
    time: string;
    status: 'completed' | 'current' | 'upcoming';
  }>;
}

export const mockLoads: Load[] = [
  {
    id: '1',
    loadId: 'LD-2024-001847',
    customer: 'Walmart Distribution',
    customerLogo: '🏢',
    pickup: {
      location: 'Los Angeles Warehouse',
      address: '1500 S Santa Fe Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90021',
      date: '2026-02-21',
      time: '08:00 AM',
      contact: 'Michael Torres',
      phone: '(323) 555-0198'
    },
    delivery: {
      location: 'Phoenix Distribution Center',
      address: '4525 W Glendale Ave',
      city: 'Phoenix',
      state: 'AZ',
      zip: '85301',
      date: '2026-02-21',
      time: '05:30 PM',
      contact: 'Sarah Martinez',
      phone: '(602) 555-0147'
    },
    eta: '5:30 PM',
    status: 'In Transit',
    driver: {
      id: 'D001',
      name: 'James Rodriguez',
      avatar: '👨‍✈️',
      phone: '(555) 123-4567',
      email: 'j.rodriguez@logistik-ai.com'
    },
    vehicle: {
      id: 'V-2847',
      type: 'Dry Van 53ft',
      plate: 'CA-8492JK'
    },
    distance: '373 mi',
    weight: '42,000 lbs',
    commodity: 'Consumer Electronics',
    notes: 'Fragile items - Handle with care. Deliver to dock 7.',
    documents: [
      { name: 'Bill of Lading', type: 'PDF', url: '#' },
      { name: 'Packing List', type: 'PDF', url: '#' }
    ],
    billingStatus: 'Pending',
    billingAmount: '$2,450.00',
    routeStops: [
      { type: 'pickup', location: 'Los Angeles Warehouse', time: '8:00 AM', status: 'completed' },
      { type: 'stop', location: 'Blythe Rest Stop', time: '11:30 AM', status: 'completed' },
      { type: 'delivery', location: 'Phoenix Distribution Center', time: '5:30 PM', status: 'current' }
    ]
  },
  {
    id: '2',
    loadId: 'LD-2024-001846',
    customer: 'Target Logistics',
    customerLogo: '🎯',
    pickup: {
      location: 'Chicago Hub',
      address: '2500 W 31st St',
      city: 'Chicago',
      state: 'IL',
      zip: '60608',
      date: '2026-02-21',
      time: '06:00 AM',
      contact: 'David Johnson',
      phone: '(312) 555-0182'
    },
    delivery: {
      location: 'Detroit Store #442',
      address: '18900 Michigan Ave',
      city: 'Detroit',
      state: 'MI',
      zip: '48216',
      date: '2026-02-21',
      time: '02:00 PM',
      contact: 'Amanda Lee',
      phone: '(313) 555-0193'
    },
    eta: '2:00 PM',
    status: 'Assigned',
    driver: {
      id: 'D002',
      name: 'Maria Chen',
      avatar: '👩‍✈️',
      phone: '(555) 234-5678',
      email: 'm.chen@logistik-ai.com'
    },
    vehicle: {
      id: 'V-1923',
      type: 'Reefer 48ft',
      plate: 'IL-3749MN'
    },
    distance: '283 mi',
    weight: '38,500 lbs',
    commodity: 'Grocery Items',
    notes: 'Temperature controlled - maintain 35°F',
    documents: [
      { name: 'Bill of Lading', type: 'PDF', url: '#' },
      { name: 'Temperature Log', type: 'PDF', url: '#' }
    ],
    billingStatus: 'Paid',
    billingAmount: '$1,850.00',
    routeStops: [
      { type: 'pickup', location: 'Chicago Hub', time: '6:00 AM', status: 'upcoming' },
      { type: 'delivery', location: 'Detroit Store #442', time: '2:00 PM', status: 'upcoming' }
    ]
  },
  {
    id: '3',
    loadId: 'LD-2024-001845',
    customer: 'Amazon Fulfillment',
    customerLogo: '📦',
    pickup: {
      location: 'Dallas Fulfillment Center',
      address: '1650 Gateway Blvd',
      city: 'Dallas',
      state: 'TX',
      zip: '75212',
      date: '2026-02-20',
      time: '02:00 PM',
      contact: 'Robert Williams',
      phone: '(214) 555-0165'
    },
    delivery: {
      location: 'Houston Distribution Hub',
      address: '8620 Wallisville Rd',
      city: 'Houston',
      state: 'TX',
      zip: '77029',
      date: '2026-02-20',
      time: '08:00 PM',
      contact: 'Jennifer Davis',
      phone: '(713) 555-0176'
    },
    eta: 'Delivered',
    status: 'Delivered',
    driver: {
      id: 'D003',
      name: 'Carlos Martinez',
      avatar: '👨‍✈️',
      phone: '(555) 345-6789',
      email: 'c.martinez@logistik-ai.com'
    },
    vehicle: {
      id: 'V-4521',
      type: 'Dry Van 53ft',
      plate: 'TX-5821PQ'
    },
    distance: '239 mi',
    weight: '45,000 lbs',
    commodity: 'General Freight',
    notes: 'POD received and signed',
    documents: [
      { name: 'Bill of Lading', type: 'PDF', url: '#' },
      { name: 'Proof of Delivery', type: 'PDF', url: '#' },
      { name: 'Signature', type: 'Image', url: '#' }
    ],
    billingStatus: 'Paid',
    billingAmount: '$1,650.00',
    routeStops: [
      { type: 'pickup', location: 'Dallas Fulfillment Center', time: '2:00 PM', status: 'completed' },
      { type: 'delivery', location: 'Houston Distribution Hub', time: '8:00 PM', status: 'completed' }
    ]
  },
  {
    id: '4',
    loadId: 'LD-2024-001844',
    customer: 'Home Depot Supply',
    customerLogo: '🏠',
    pickup: {
      location: 'Atlanta Warehouse',
      address: '900 Marietta St NW',
      city: 'Atlanta',
      state: 'GA',
      zip: '30318',
      date: '2026-02-21',
      time: '07:00 AM',
      contact: 'Mark Thompson',
      phone: '(404) 555-0158'
    },
    delivery: {
      location: 'Charlotte Store #129',
      address: '5620 E Independence Blvd',
      city: 'Charlotte',
      state: 'NC',
      zip: '28212',
      date: '2026-02-21',
      time: '12:30 PM',
      contact: 'Lisa Brown',
      phone: '(704) 555-0142'
    },
    eta: '12:30 PM',
    status: 'Loading',
    driver: {
      id: 'D004',
      name: 'Thomas Wilson',
      avatar: '👨‍✈️',
      phone: '(555) 456-7890',
      email: 't.wilson@logistik-ai.com'
    },
    vehicle: {
      id: 'V-3264',
      type: 'Flatbed 48ft',
      plate: 'GA-7429RS'
    },
    distance: '244 mi',
    weight: '35,800 lbs',
    commodity: 'Building Materials',
    notes: 'Requires tarps and straps for lumber',
    documents: [
      { name: 'Bill of Lading', type: 'PDF', url: '#' }
    ],
    billingStatus: 'Pending',
    billingAmount: '$1,950.00',
    routeStops: [
      { type: 'pickup', location: 'Atlanta Warehouse', time: '7:00 AM', status: 'current' },
      { type: 'delivery', location: 'Charlotte Store #129', time: '12:30 PM', status: 'upcoming' }
    ]
  },
  {
    id: '5',
    loadId: 'LD-2024-001843',
    customer: 'Costco Wholesale',
    customerLogo: '🛒',
    pickup: {
      location: 'Seattle Port Terminal',
      address: '3600 W Marginal Way SW',
      city: 'Seattle',
      state: 'WA',
      zip: '98106',
      date: '2026-02-21',
      time: '05:00 AM',
      contact: 'Kevin Anderson',
      phone: '(206) 555-0134'
    },
    delivery: {
      location: 'Portland Warehouse',
      address: '7850 N Lombard St',
      city: 'Portland',
      state: 'OR',
      zip: '97203',
      date: '2026-02-21',
      time: '09:00 AM',
      contact: 'Rachel Green',
      phone: '(503) 555-0189'
    },
    eta: '9:00 AM',
    status: 'At Pickup',
    driver: {
      id: 'D005',
      name: 'Emily Davis',
      avatar: '👩‍✈️',
      phone: '(555) 567-8901',
      email: 'e.davis@logistik-ai.com'
    },
    vehicle: {
      id: 'V-5893',
      type: 'Dry Van 53ft',
      plate: 'WA-9347TU'
    },
    distance: '174 mi',
    weight: '40,200 lbs',
    commodity: 'Food & Beverage',
    notes: 'Priority delivery - time sensitive',
    documents: [
      { name: 'Bill of Lading', type: 'PDF', url: '#' },
      { name: 'Customs Clearance', type: 'PDF', url: '#' }
    ],
    billingStatus: 'Pending',
    billingAmount: '$1,425.00',
    routeStops: [
      { type: 'pickup', location: 'Seattle Port Terminal', time: '5:00 AM', status: 'current' },
      { type: 'delivery', location: 'Portland Warehouse', time: '9:00 AM', status: 'upcoming' }
    ]
  },
  {
    id: '6',
    loadId: 'LD-2024-001842',
    customer: 'FedEx Ground',
    customerLogo: '📮',
    pickup: {
      location: 'Memphis Sorting Hub',
      address: '3035 Directors Row',
      city: 'Memphis',
      state: 'TN',
      zip: '38131',
      date: '2026-02-21',
      time: '03:00 AM',
      contact: 'Brandon Scott',
      phone: '(901) 555-0171'
    },
    delivery: {
      location: 'Nashville Distribution',
      address: '4201 Sidco Dr',
      city: 'Nashville',
      state: 'TN',
      zip: '37204',
      date: '2026-02-21',
      time: '07:00 AM',
      contact: 'Megan White',
      phone: '(615) 555-0123'
    },
    eta: '7:00 AM',
    status: 'In Transit',
    driver: {
      id: 'D006',
      name: 'Daniel Brown',
      avatar: '👨‍✈️',
      phone: '(555) 678-9012',
      email: 'd.brown@logistik-ai.com'
    },
    vehicle: {
      id: 'V-7234',
      type: 'Dry Van 53ft',
      plate: 'TN-4628VW'
    },
    distance: '214 mi',
    weight: '31,500 lbs',
    commodity: 'Parcels & Packages',
    notes: 'Multiple small packages - scan all barcodes',
    documents: [
      { name: 'Manifest', type: 'PDF', url: '#' },
      { name: 'Bill of Lading', type: 'PDF', url: '#' }
    ],
    billingStatus: 'Paid',
    billingAmount: '$1,285.00',
    routeStops: [
      { type: 'pickup', location: 'Memphis Sorting Hub', time: '3:00 AM', status: 'completed' },
      { type: 'delivery', location: 'Nashville Distribution', time: '7:00 AM', status: 'current' }
    ]
  },
  {
    id: '7',
    loadId: 'LD-2024-001841',
    customer: 'Best Buy Logistics',
    customerLogo: '💻',
    pickup: {
      location: 'Minneapolis Warehouse',
      address: '7601 Penn Ave S',
      city: 'Minneapolis',
      state: 'MN',
      zip: '55423',
      date: '2026-02-22',
      time: '09:00 AM',
      contact: 'Jessica Miller',
      phone: '(612) 555-0156'
    },
    delivery: {
      location: 'Milwaukee Store #85',
      address: '5500 S 27th St',
      city: 'Milwaukee',
      state: 'WI',
      zip: '53221',
      date: '2026-02-22',
      time: '02:00 PM',
      contact: 'Christopher Taylor',
      phone: '(414) 555-0167'
    },
    eta: '2:00 PM',
    status: 'Assigned',
    driver: {
      id: 'D007',
      name: 'Sarah Johnson',
      avatar: '👩‍✈️',
      phone: '(555) 789-0123',
      email: 's.johnson@logistik-ai.com'
    },
    vehicle: {
      id: 'V-8456',
      type: 'Box Truck 26ft',
      plate: 'MN-8372XY'
    },
    distance: '337 mi',
    weight: '18,400 lbs',
    commodity: 'Electronics & Appliances',
    notes: 'High value cargo - security escort required',
    documents: [
      { name: 'Bill of Lading', type: 'PDF', url: '#' },
      { name: 'Insurance Certificate', type: 'PDF', url: '#' }
    ],
    billingStatus: 'Pending',
    billingAmount: '$2,180.00',
    routeStops: [
      { type: 'pickup', location: 'Minneapolis Warehouse', time: '9:00 AM', status: 'upcoming' },
      { type: 'delivery', location: 'Milwaukee Store #85', time: '2:00 PM', status: 'upcoming' }
    ]
  },
  {
    id: '8',
    loadId: 'LD-2024-001840',
    customer: 'Sysco Food Services',
    customerLogo: '🍽️',
    pickup: {
      location: 'San Antonio Distribution',
      address: '9810 W Military Dr',
      city: 'San Antonio',
      state: 'TX',
      zip: '78251',
      date: '2026-02-21',
      time: '04:00 AM',
      contact: 'Michelle Garcia',
      phone: '(210) 555-0145'
    },
    delivery: {
      location: 'Austin Restaurant District',
      address: '2901 S Capital of Texas Hwy',
      city: 'Austin',
      state: 'TX',
      zip: '78746',
      date: '2026-02-21',
      time: '08:00 AM',
      contact: 'Andrew Martinez',
      phone: '(512) 555-0198'
    },
    eta: '8:00 AM',
    status: 'In Transit',
    driver: {
      id: 'D008',
      name: 'Michael Lee',
      avatar: '👨‍✈️',
      phone: '(555) 890-1234',
      email: 'm.lee@logistik-ai.com'
    },
    vehicle: {
      id: 'V-2198',
      type: 'Reefer 48ft',
      plate: 'TX-9461ZA'
    },
    distance: '80 mi',
    weight: '28,900 lbs',
    commodity: 'Perishable Food',
    notes: 'Multi-temp zones: Frozen -10°F, Fresh 38°F',
    documents: [
      { name: 'Bill of Lading', type: 'PDF', url: '#' },
      { name: 'Food Safety Certificate', type: 'PDF', url: '#' },
      { name: 'Temperature Log', type: 'PDF', url: '#' }
    ],
    billingStatus: 'Paid',
    billingAmount: '$895.00',
    routeStops: [
      { type: 'pickup', location: 'San Antonio Distribution', time: '4:00 AM', status: 'completed' },
      { type: 'delivery', location: 'Austin Restaurant District', time: '8:00 AM', status: 'current' }
    ]
  },
  {
    id: '9',
    loadId: 'LD-2024-001839',
    customer: 'Lowe\'s Supply Chain',
    customerLogo: '🔨',
    pickup: {
      location: 'Raleigh Warehouse',
      address: '3901 Spring Forest Rd',
      city: 'Raleigh',
      state: 'NC',
      zip: '27604',
      date: '2026-02-20',
      time: '11:00 AM',
      contact: 'Timothy Clark',
      phone: '(919) 555-0152'
    },
    delivery: {
      location: 'Richmond Store #347',
      address: '9200 W Broad St',
      city: 'Richmond',
      state: 'VA',
      zip: '23294',
      date: '2026-02-20',
      time: '04:00 PM',
      contact: 'Nicole Rodriguez',
      phone: '(804) 555-0186'
    },
    eta: 'Delivered',
    status: 'Delivered',
    driver: {
      id: 'D009',
      name: 'Patricia Moore',
      avatar: '👩‍✈️',
      phone: '(555) 901-2345',
      email: 'p.moore@logistik-ai.com'
    },
    vehicle: {
      id: 'V-3729',
      type: 'Flatbed 53ft',
      plate: 'NC-5394BC'
    },
    distance: '162 mi',
    weight: '44,200 lbs',
    commodity: 'Hardware & Tools',
    notes: 'POD confirmed with signature',
    documents: [
      { name: 'Bill of Lading', type: 'PDF', url: '#' },
      { name: 'Proof of Delivery', type: 'PDF', url: '#' }
    ],
    billingStatus: 'Paid',
    billingAmount: '$1,320.00',
    routeStops: [
      { type: 'pickup', location: 'Raleigh Warehouse', time: '11:00 AM', status: 'completed' },
      { type: 'delivery', location: 'Richmond Store #347', time: '4:00 PM', status: 'completed' }
    ]
  },
  {
    id: '10',
    loadId: 'LD-2024-001838',
    customer: 'Pepsi Beverages',
    customerLogo: '🥤',
    pickup: {
      location: 'Denver Bottling Plant',
      address: '4700 Paris St',
      city: 'Denver',
      state: 'CO',
      zip: '80239',
      date: '2026-02-21',
      time: '10:00 AM',
      contact: 'Ryan Hall',
      phone: '(303) 555-0174'
    },
    delivery: {
      location: 'Salt Lake City Distributor',
      address: '2455 S Constitution Blvd',
      city: 'Salt Lake City',
      state: 'UT',
      zip: '84119',
      date: '2026-02-21',
      time: '07:00 PM',
      contact: 'Angela Young',
      phone: '(801) 555-0139'
    },
    eta: '7:00 PM',
    status: 'Delayed',
    driver: {
      id: 'D010',
      name: 'Robert King',
      avatar: '👨‍✈️',
      phone: '(555) 012-3456',
      email: 'r.king@logistik-ai.com'
    },
    vehicle: {
      id: 'V-4867',
      type: 'Dry Van 53ft',
      plate: 'CO-7218DE'
    },
    distance: '525 mi',
    weight: '43,700 lbs',
    commodity: 'Beverages',
    notes: 'Weather delay - ice on I-70. ETA revised +2 hours',
    documents: [
      { name: 'Bill of Lading', type: 'PDF', url: '#' }
    ],
    billingStatus: 'Pending',
    billingAmount: '$3,150.00',
    routeStops: [
      { type: 'pickup', location: 'Denver Bottling Plant', time: '10:00 AM', status: 'completed' },
      { type: 'stop', location: 'Vail Rest Stop', time: '1:00 PM', status: 'completed' },
      { type: 'delivery', location: 'Salt Lake City Distributor', time: '7:00 PM', status: 'current' }
    ]
  }
];
