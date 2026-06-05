import { useEffect, useRef } from 'react';
import apiClient from '../services/apiClient';

const useExtractionPolling = (onUpdate: (data: unknown) => void) => {
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      // Guard the poll so a transient failure doesn't surface as an unhandled
      // promise rejection every 5s. Polling cadence and onUpdate are unchanged;
      // we only stop the error from going unhandled (polling continues).
      try {
        const { data } = await apiClient.get('/admin/dashboard');
        onUpdate(data);
      } catch (err) {
        console.warn('[useExtractionPolling] poll failed', err);
      }
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onUpdate]);
};

export default useExtractionPolling;
