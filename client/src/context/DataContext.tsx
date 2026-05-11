import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AQIRow } from '../types';
import { loadData } from '../utils/data';

interface DataContextValue {
  data: AQIRow[];
  loading: boolean;
  years: number[];
  states: string[];
}

const DataContext = createContext<DataContextValue>({
  data: [], loading: true, years: [], states: [],
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AQIRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData().then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const years = [...new Set(data.map(r => r.Year))].sort((a, b) => a - b);
  const states = [...new Set(data.map(r => r.State_name))].sort();

  return (
    <DataContext.Provider value={{ data, loading, years, states }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
