import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Stack,
    Typography,
    Alert,
    Card,
    CardContent,
    CircularProgress,
    useTheme,
    Container
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { verifyAspirantRegistration, resendAspirantRegistrationOtp } from '../services/aspirantService';
import useAuthStore from '../store/useAuthStore';
import { BRAND } from '../theme';

interface LocationState {
    verificationId?: string;
    phone?: string;
    aspirantData?: any;
}

const AspirantOtpVerificationPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { fetchProfile } = useAuthStore();

    const state = (location.state as LocationState) || {};
    const initialVerificationId = state.verificationId || '';
    const phone = state.phone || '';
    const aspirantData = state.aspirantData || {};

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);
    const [otpExpiryTimer, setOtpExpiryTimer] = useState(60);
    const [currentVerificationId, setCurrentVerificationId] = useState(initialVerificationId);

    useEffect(() => {
        if (!currentVerificationId) {
            navigate('/user/aspirants/register', { replace: true });
        }
    }, [currentVerificationId, navigate]);

    // Resend countdown timer effect
    useEffect(() => {
        if (resendCountdown <= 0) return;
        const timer = setInterval(() => {
            setResendCountdown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCountdown]);

    // OTP Expiry countdown timer effect
    useEffect(() => {
        if (otpExpiryTimer <= 0) return;
        const timer = setInterval(() => {
            setOtpExpiryTimer(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [otpExpiryTimer]);

    const handleVerifyOtp = async () => {
        setError('');

        if (!otp || otp.length !== 4 || !/^\d+$/.test(otp)) {
            setError(t('validation.otpLength') || 'Please enter a valid 4-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await verifyAspirantRegistration(currentVerificationId, otp);
            const data = response?.data ?? response;

            // Mark success and refresh profile
            setSuccess(true);
            try {
                await fetchProfile();
            } catch (e) {
                console.warn('Failed to refresh profile after verification:', e);
            }

            // Navigate to documents upload step with the aspirant data
            setTimeout(() => {
                navigate('/user/aspirants/register', {
                    replace: true,
                    state: {
                        aspirantVerified: true,
                        aspirantData: data || aspirantData,
                        skipToDocuments: true
                    }
                });
            }, 1500);
        } catch (err: any) {
            const errorMsg =
                err?.response?.data?.message ||
                err?.message ||
                t('common.error') ||
                'Verification failed. Please check your OTP and try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setResendLoading(true);
        try {
            const response = await resendAspirantRegistrationOtp();
            const data = response?.data ?? response;

            // Update verification ID if returned
            if (data?.verificationId) {
                setCurrentVerificationId(data.verificationId);
            }

            // Start 60-second countdowns for both resend and OTP expiry
            setResendCountdown(60);
            setOtpExpiryTimer(60);
            setError('');
        } catch (err: any) {
            const errorMsg =
                err?.response?.data?.message ||
                err?.message ||
                t('common.error') ||
                'Failed to resend OTP. Please try again.';
            setError(errorMsg);
        } finally {
            setResendLoading(false);
        }
    };

    const FF_HEADING = "'Heming', 'Geist Variable', 'Geist', sans-serif";
    const FF_BODY = "'Geist Variable', 'Geist', sans-serif";

    return (
        <Container maxWidth="sm" sx={{ py: { xs: 3, md: 6 } }}>
            <Stack spacing={3}>

                {/* Header */}
                <Box>
                    <Typography
                        variant="h4"
                        sx={{ fontFamily: FF_HEADING, fontWeight: 800, mb: 1, color: theme.palette.text.primary }}
                    >
                        {t('pages.register.otpLabel') || 'Verify OTP'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                        {t('pages.register.otpDescription', { phone }) || `We've sent a 4-digit OTP to ${phone}. Enter the code below to verify your registration.`}
                    </Typography>
                </Box>

                {/* Success state */}
                {success && (
                    <Card sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CheckIcon sx={{ fontSize: 32, color: '#4caf50' }} />
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#4caf50' }}>
                                    Verified!
                                </Typography>
                                <Typography variant="body2" sx={{
                                    color: "text.secondary"
                                }}>
                                    Your registration has been verified. Proceeding...
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {/* Form */}
                {!success && (
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                {error && (
                                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                                        {error}
                                    </Alert>
                                )}

                                {/* OTP Input */}
                                <TextField
                                    fullWidth
                                    label={t('pages.register.otpLabel') || 'Enter OTP'}
                                    placeholder="0000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    disabled={loading}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            color: isDark ? '#fff' : theme.palette.text.primary,
                                            '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(17,24,39,0.18)' },
                                            '&:hover fieldset': { borderColor: 'rgba(245,168,0,0.45)' },
                                            '&.Mui-focused fieldset': { borderColor: '#F5A800', borderWidth: '1.5px' }
                                        },
                                        '& .MuiInputLabel-root': { color: isDark ? 'rgba(255,255,255,0.55)' : theme.palette.text.secondary },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#F5A800' }
                                    }}
                                    slotProps={{
                                        htmlInput: {
                                            maxLength: 4,
                                            style: { textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.5rem', fontWeight: 'bold' }
                                        }
                                    }}
                                />

                                {/* Verify Button */}
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={loading || otp.length !== 4}
                                    onClick={handleVerifyOtp}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                                    sx={{
                                        py: 1.4,
                                        borderRadius: 2,
                                        fontFamily: FF_HEADING,
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        color: '#fff',
                                        background: 'linear-gradient(135deg, #C8180A 0%, #d41a0b 50%, #E02010 100%)',
                                        boxShadow: '0 4px 20px rgba(200,24,10,0.45)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #E02010 0%, #C8180A 100%)',
                                            boxShadow: '0 6px 28px rgba(200,24,10,0.6)'
                                        },
                                        '&.Mui-disabled': {
                                            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(17,24,39,0.12)',
                                            color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(17,24,39,0.4)'
                                        }
                                    }}
                                >
                                    {loading ? t('common.loading') || 'Verifying...' : 'Verify OTP'}
                                </Button>

                                {/* OTP Expiry Timer with Resend Button */}
                                <Typography sx={{ textAlign: 'center', fontSize: '0.85rem', color: theme.palette.text.secondary }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                        <span style={{ color: otpExpiryTimer <= 10 ? '#F5A800' : 'inherit', fontWeight: otpExpiryTimer <= 10 ? 600 : 400 }}>
                                            {otpExpiryTimer > 0
                                                ? t('pages.register.otpExpiresIn', { seconds: otpExpiryTimer })
                                                : t('pages.register.otpExpired')
                                            }
                                        </span>
                                        <Button
                                            variant="text"
                                            size="small"
                                            disabled={resendCountdown > 0 || resendLoading}
                                            onClick={handleResendOtp}
                                            startIcon={resendLoading ? <CircularProgress size={14} color="inherit" /> : null}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                color: resendCountdown > 0 ? 'rgba(245,168,0,0.5)' : '#F5A800',
                                                '&:hover': {
                                                    textDecoration: resendCountdown > 0 ? 'none' : 'underline',
                                                    bgcolor: 'transparent'
                                                },
                                                cursor: resendCountdown > 0 ? 'not-allowed' : 'pointer',
                                                padding: '2px 4px',
                                                minHeight: 'auto'
                                            }}
                                        >
                                            {resendLoading ? 'Sending...' : t('pages.register.resendOtpLink') || 'Resend'}
                                        </Button>
                                    </Box>
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                )}
            </Stack>
        </Container>
    );
};

export default AspirantOtpVerificationPage;
