import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, CircularProgress, Snackbar, Alert as MuiAlert, Button } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import { getAspirantById, withdrawMe } from '../../services/aspirantService';
import AspirantProfileTab from '../../components/aspirant/AspirantProfileTab';
import ProfileCompletionPage from '../ProfileCompletionPage';

const AspirantProfilePage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const [aspirantProfile, setAspirantProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [withdrawBusy, setWithdrawBusy] = useState(false);
    const [snack, setSnack] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

    const handleWithdraw = async () => {
        setWithdrawBusy(true);
        try {
            await withdrawMe();
            setSnack({ open: true, message: t('userDashboard.aspirant.withdrawn') || 'Withdrawn successfully', severity: 'success' });
            // Redirect to dashboard and auto-refresh so the user sees updated state
            setTimeout(() => { navigate('/user/dashboard'); window.location.reload(); }, 1800);
        } catch (err: any) {
            const serverMsg = err?.response?.data?.message || err?.message || t('userDashboard.aspirant.withdrawFailed') || 'Failed to withdraw';
            setSnack({ open: true, message: serverMsg, severity: 'error' });
        } finally {
            setWithdrawBusy(false);
        }
    };

    useEffect(() => {
        const fetchAspirantProfile = async () => {
            try {
                if (!user?.id) {
                    navigate('/register');
                    return;
                }

                // Use aspirantId if available, otherwise fall back to user.id
                const aspirantId = user?.aspirantId ?? user?.id;
                if (!aspirantId) {
                    setError('No aspirant ID available');
                    setLoading(false);
                    return;
                }

                const resp: { data: any } = await getAspirantById(aspirantId);
                const data = resp?.data;
                // normalize/format fields like in dashboard so UI shows friendly values
                const normalized = {
                    ...data,
                    wardNumber: data?.ward?.number ?? data?.wardNumber,
                    assembly: data?.ward?.assembly ?? data?.assembly ?? data?.wardName,
                    applicationDate: data?.createdAt ? new Date(data.createdAt).toISOString().split('T')[0] : data?.applicationDate,
                    documents: Array.isArray(data?.documents) ? data.documents : [],
                    meetings: Array.isArray(data?.meetings) ? data.meetings : [],
                    // Fallback to user-level fields if not present in aspirant data
                    electionType: data?.electionType ?? user?.electionType,
                    electionName: data?.electionName ?? user?.electionName,
                    constituencyName: data?.constituencyName ?? user?.constituencyName,
                };
                setAspirantProfile(normalized);
            } catch (err: any) {
                setError(err.message || 'Failed to load aspirant profile');
            } finally {
                setLoading(false);
            }
        };

        fetchAspirantProfile();
    }, [user, navigate]);

    const handleDownload = async (url: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const filename = url.split('/').pop() || 'download';
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch {
            window.open(url, '_blank');
        }
    };

    if (loading) {
        return (
            <Box sx={{ py: 4, px: { xs: 0, md: 3 } }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ py: 4, px: { xs: 2, md: 3 } }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!aspirantProfile) {
        return (
            <Box sx={{ py: 4, px: { xs: 2, md: 3 } }}>
                <Alert severity="warning">
                    {t('userDashboard.aspirant.noProfile') || 'Aspirant profile not found'}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ py: { xs: 2, md: 4 }, px: { xs: 0, md: 3 } }}>
            <ProfileCompletionPage hideLogout />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, px: { xs: 2, md: 0 } }}>
                {t('userDashboard.aspirant.tabs.profile') || 'My Profile'}
            </Typography>

            <AspirantProfileTab
                aspirantProfile={aspirantProfile}
                isMobile={true}
                handleDownload={handleDownload}
                onWithdraw={handleWithdraw}
                withdrawBusy={withdrawBusy}
            />

            {/* Logout button at bottom of profile (full width) */}
            <Box sx={{ mt: 3, mb: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    onClick={() => { logout(); navigate('/'); }}
                    sx={{
                        fontWeight: 700,
                        textTransform: 'none',
                        py: 1.2,
                        borderRadius: 2,
                        borderColor: 'rgba(255,255,255,0.25)',
                        color: 'text.secondary',
                        '&:hover': { borderColor: 'error.main', color: 'error.main', bgcolor: 'rgba(200,24,10,0.06)' },
                    }}
                >
                    {t('common.logout') || 'Logout'}
                </Button>
            </Box>

            <Snackbar
                open={snack.open}
                autoHideDuration={3500}
                onClose={() => setSnack(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert onClose={() => setSnack(s => ({ ...s, open: false }))} severity={snack.severity} sx={{ width: '100%' }}>
                    {snack.message}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default AspirantProfilePage;