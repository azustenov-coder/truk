import React from 'react';
import {
    Building2,
    Target,
    Package,
    Home,
    ShoppingCart,
    Truck,
    Laptop,
    Utensils,
    Hammer,
    CupSoda,
    User,
    UserCheck,
    UserCircle,
    UserRound,
    ShieldCheck,
    UserSquare2,
    Factory,
    Ship
} from 'lucide-react';

export const getCustomerIcon = (customerName: string): React.ReactNode => {
    switch (customerName) {
        case 'Walmart Distribution':
            return <Building2 size={20} className="text-blue-500" />;
        case 'Target Logistics':
            return <Target size={20} className="text-red-500" />;
        case 'Amazon Fulfillment':
            return <Package size={20} className="text-yellow-600" />;
        case 'Home Depot Supply':
            return <Home size={20} className="text-orange-500" />;
        case 'Costco Wholesale':
            return <ShoppingCart size={20} className="text-blue-700" />;
        case 'FedEx Ground':
            return <Truck size={20} className="text-purple-600" />;
        case 'Best Buy Logistics':
            return <Laptop size={20} className="text-blue-400" />;
        case 'Sysco Food Services':
            return <Utensils size={20} className="text-green-600" />;
        case "Lowe's Supply Chain":
            return <Hammer size={20} className="text-blue-800" />;
        case 'Pepsi Beverages':
            return <CupSoda size={20} className="text-blue-600" />;
        case 'TechCorp Industries':
            return <Building2 size={20} className="text-indigo-500" />;
        case 'Global Manufacturing Co':
            return <Factory size={20} className="text-gray-500" />;
        case 'Retail Solutions Inc':
            return <ShoppingCart size={20} className="text-green-500" />;
        case 'Logistics Partners LLC':
            return <Package size={20} className="text-amber-600" />;
        case 'Metro Distribution Hub':
            return <Truck size={20} className="text-blue-500" />;
        case 'Coastal Freight Solutions':
            return <Ship size={20} className="text-cyan-600" />;
        default:
            return <Building2 size={20} className="text-gray-500" />;
    }
};

export const getDriverIcon = (driverName: string): React.ReactNode => {
    // Hash string to pick a color and icon consistently
    const hash = driverName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    const colors = [
        'text-blue-500',
        'text-green-500',
        'text-purple-500',
        'text-orange-500',
        'text-pink-500',
        'text-indigo-500',
        'text-teal-500',
    ];

    const icons = [
        User,
        UserCircle,
        UserRound,
        UserSquare2,
        UserCheck,
        ShieldCheck
    ];

    const colorClass = colors[hash % colors.length];
    const IconComponent = icons[hash % icons.length];

    return <IconComponent size={20} className={colorClass} />;
};
