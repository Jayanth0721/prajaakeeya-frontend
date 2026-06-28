import React, { useState } from 'react';
import {
  Box, Container, Typography, Paper, Button, TextField, Link,
  FormControlLabel, Checkbox, Alert, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import { BRAND } from '../theme';

const FF_HEADING = "'Heming', 'Geist Variable', 'Geist', sans-serif";

const PortalRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleRegister = () => {
    sessionStorage.setItem('__PORTAL_REGISTER__', '1');
    setLoading(true);
    window.location.href = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/auth/google`;
  };

  const handleSkip = () => {
    navigate('/portal');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: `${BRAND.red}10`, borderRadius: 3 }}>
              <Box component="img" src="https://www.prajaakeeya.org/logo.png" alt="Prajaakeeya" sx={{ height: 48 }} onError={(e: any) => { e.target.style.display = 'none'; }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: '#111827', mb: 1 }}>
            Join Prajaa Prapancha
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: FF_HEADING, color: '#6B7280' }}>
            Register to access the aspirant portal and governance features
          </Typography>
        </Box>

        <Paper sx={{ p: 4, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
            onClick={handleGoogleRegister}
            disabled={loading}
            sx={{
              fontFamily: FF_HEADING,
              fontWeight: 700,
              py: 1.5,
              bgcolor: '#fff',
              color: '#111827',
              border: '1px solid rgba(0,0,0,0.12)',
              '&:hover': { bgcolor: '#f5f5f5' },
              mb: 3
            }}
          >
            Continue with Google
          </Button>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="body2" sx={{ fontFamily: FF_HEADING, color: '#6B7280' }}>
              or
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Email"
            type="email"
            sx={{ mb: 2, fontFamily: FF_HEADING }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            sx={{ mb: 2, fontFamily: FF_HEADING }}
          />

          <FormControlLabel
            control={<Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />}
            label={
              <Typography variant="caption" sx={{ fontFamily: FF_HEADING, color: '#6B7280' }}>
                I agree to the{' '}
                <Link href="/terms-and-conditions" sx={{ color: BRAND.blue }}>Terms</Link> and{' '}
                <Link href="/privacy-policy" sx={{ color: BRAND.blue }}>Privacy Policy</Link>
              </Typography>
            }
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={!agreed || loading}
            onClick={handleGoogleRegister}
            sx={{
              fontFamily: FF_HEADING,
              fontWeight: 700,
              py: 1.5,
              bgcolor: BRAND.red,
              '&:hover': { bgcolor: BRAND.red2 }
            }}
          >
            Create Account
          </Button>

          <Alert severity="info" sx={{ mt: 3, fontFamily: FF_HEADING }}>
            After registration, you will be redirected to the Prajaa Prapancha portal.
          </Alert>
        </Paper>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            onClick={handleSkip}
            variant="outlined"
            sx={{
              fontFamily: FF_HEADING,
              fontWeight: 700,
              color: BRAND.red,
              borderColor: BRAND.red,
              px: 3,
              py: 1.2,
              fontSize: '0.95rem',
              letterSpacing: '0.02em',
              textTransform: 'none',
              borderRadius: '12px',
              '&:hover': {
                borderColor: BRAND.red,
                backgroundColor: 'rgba(200, 24, 10, 0.08)',
              },
            }}
          >
            Skip and continue as guest
          </Button>
        </Box>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, fontFamily: FF_HEADING, color: '#9CA3AF' }}>
          Already have an account?{' '}
          <Link href="/login" sx={{ color: BRAND.blue }}>Sign in</Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default PortalRegisterPage;