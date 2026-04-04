import { useState } from 'react';
import { Stack, TextField, Button, Alert, Box, CircularProgress } from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
// API calls bypassed for demo - will integrate later
// import { requestOtp, verifyOtp } from '../services/authService';
import useAuthStore from '../store/useAuthStore';
import { phoneSchema, otpSchema } from '../utils/validation';

interface SignupForm {
  phone: string;
  otp?: string | null;
}

const UserSignupPage = () => {
  const { t } = useTranslation();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [otpRequested, setOtpRequested] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const schema = yup
    .object({
      phone: phoneSchema,
      otp: (otpRequested ? otpSchema : yup.string().optional()).nullable()
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupForm>({
    resolver: yupResolver(schema),
    defaultValues: { phone: '', otp: '' }
  });

  const onSubmit = async (values: SignupForm) => {
    setError('');
    setLoading(true);

    // Bypass API calls - just simulate the flow
    if (!otpRequested) {
      // Simulate OTP request - just show OTP field
      setTimeout(() => {
        setOtpRequested(true);
        setLoading(false);
      }, 500);
      return;
    }

    // Bypass API call - create dummy auth and navigate
    // Check if phone ends with 00 for admin, otherwise voter
    const isAdmin = values.phone.endsWith('00');
    setTimeout(() => {
      const dummyToken = 'dummy-jwt-token-' + Date.now();
      const dummyUser = {
        id: 1,
        name: isAdmin ? 'Admin User' : 'Voter User',
        phone: values.phone,
        role: (isAdmin ? 'admin' : 'voter') as 'admin' | 'voter',
        wardId: isAdmin ? undefined : 101
      };
      setAuth(dummyToken, dummyUser);
      navigate(isAdmin ? '/admin/dashboard' : '/user/dashboard', { replace: true });
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              bgcolor: 'primary.light',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <PersonAddIcon sx={{ fontSize: 32 }} />
          </Box>
        </Box>
        <TextField
          label={t('forms.userSignup.phone')}
          fullWidth
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone && t(errors.phone.message || 'validation.required')}
          disabled={loading}
          placeholder="Enter your phone number"
        />
        {otpRequested && (
          <TextField
            label={t('forms.userSignup.otp')}
            fullWidth
            {...register('otp')}
            error={!!errors.otp}
            helperText={errors.otp && t(errors.otp.message || 'validation.required')}
            disabled={loading}
            placeholder="Enter OTP"
            autoFocus
          />
        )}
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ py: 1.5, borderRadius: 2, color: '#fff' }}
        >
          {loading
            ? t('common.loading') || 'Loading...'
            : otpRequested
              ? t('adminLogin.verify')
              : t('forms.userSignup.title')}
        </Button>
      </Stack>
    </form>
  );
};

export default UserSignupPage;
