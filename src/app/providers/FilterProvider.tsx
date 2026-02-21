import { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
    globalDateFilter: string;
    setGlobalDateFilter: (filter: string) => void;
    globalLocationFilter: string;
    setGlobalLocationFilter: (filter: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
    const [globalDateFilter, setGlobalDateFilter] = useState('Today');
    const [globalLocationFilter, setGlobalLocationFilter] = useState('All Locations');

    return (
        <FilterContext.Provider value={{
            globalDateFilter, setGlobalDateFilter,
            globalLocationFilter, setGlobalLocationFilter
        }}>
            {children}
        </FilterContext.Provider>
    );
}

export function useGlobalFilter() {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error('useGlobalFilter must be used within a FilterProvider');
    }
    return context;
}
