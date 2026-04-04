import { useEffect, useRef } from 'react';
import apiClient from '../services/apiClient';

const useExtractionPolling = (onUpdate: (data: unknown) => void) => {
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      const { data } = await apiClient.get('/admin/dashboard');
      onUpdate(data);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onUpdate]);
};

export default useExtractionPolling;
