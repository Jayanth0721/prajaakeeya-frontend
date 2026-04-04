import { useState, useCallback } from 'react';

const useSnackbar = () => {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<'success' | 'error' | 'info'>('info');

  const showMessage = useCallback((text: string, level: typeof severity = 'info') => {
    setSeverity(level);
    setMessage(text);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return { message, open, severity, showMessage, close };
};

export default useSnackbar;
