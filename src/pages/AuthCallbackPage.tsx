import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Alert, Stack, Typography } from '@mui/material';
import useAuthStore from '../store/useAuthStore';

/**
 * Handles the redirect back from the backend Google OAuth flow.
 * Backend redirects to: /auth/callback?token=<jwt>&user=<url-encoded-json>
 * (or ?error=...).
 */
const AuthCallbackPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const handled = useRef(false);

  const error = params.get('error');
  const token = params.get('token');
  const userParam = params.get('user');

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    if (error || !token) return;

    try {
      const user = userParam ? JSON.parse(decodeURIComponent(userParam)) : null;
      if (!user) {
        // Token without user payload — set a placeholder; App.tsx will call fetchProfile()
        setAuth(token, {} as any);
      } else {
        setAuth(token, user);
      }
      navigate('/user/voters', { replace: true });
    } catch (e) {
      console.error('Failed to parse auth callback params', e);
    }
  }, [token, userParam, error, setAuth, navigate]);

  if (error || !token) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Stack spacing={2} alignItems="center" maxWidth={420}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error || 'Missing authentication token'}
          </Alert>
          <Typography
            onClick={() => navigate('/login', { replace: true })}
            sx={{ color: '#F5A800', cursor: 'pointer', fontWeight: 600 }}
          >
            Back to login
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  );
};

export default AuthCallbackPage;
