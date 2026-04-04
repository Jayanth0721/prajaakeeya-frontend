import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Card, CardContent, Chip, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  People as PeopleIcon,
  HowToVote as HowToVoteIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import StatsCard from '../components/StatsCard';
import apiClient from '../services/apiClient';
import { isMockMode } from '../config/appMode';

interface DashboardResponse {
  totals: {
    wards: number;
    voters: number;
    aspirants: number;
    votes: number;
  };
  extractionQueue: Array<{
    wardId?: number;
    wardName: string;
    status: string;
    progress: number;
  }>;
}

const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(!isMockMode);
  const [error, setError] = useState('');
  const dummyData: DashboardResponse = useMemo(
    () => ({
      totals: {
        wards: 28,
        voters: 125000,
        aspirants: 45,
        votes: 87500
      },
      extractionQueue: [
        {
          wardName: 'Ward 101 - Central',
          status: 'Completed',
          progress: 100
        },
        {
          wardName: 'Ward 102 - North',
          status: 'Processing',
          progress: 75
        },
        {
          wardName: 'Ward 103 - South',
          status: 'Processing',
          progress: 45
        },
        {
          wardName: 'Ward 104 - East',
          status: 'Pending',
          progress: 0
        }
      ]
    }),
    []
  );
  const [data, setData] = useState<DashboardResponse>(dummyData);

  useEffect(() => {
    if (isMockMode) return;
    setLoading(true);
    apiClient
      .get<DashboardResponse>('/admin/dashboard')
      .then((response) => {
        setData({
          totals: response.data.totals,
          extractionQueue: response.data.extractionQueue || []
        });
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || t('common.error') || 'Failed to load dashboard');
      })
      .finally(() => setLoading(false));
  }, [t]);

  const getStatusColor = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'error' => {
    if (status.toLowerCase().includes('complete') || status.toLowerCase().includes('done')) {
      return 'success';
    }
    if (status.toLowerCase().includes('error') || status.toLowerCase().includes('failed')) {
      return 'error';
    }
    if (status.toLowerCase().includes('processing') || status.toLowerCase().includes('running')) {
      return 'primary';
    }
    return 'default';
  };

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {t('adminDashboard.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('adminDashboard.subtitle') || 'Overview of your ward management system'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            label={t('adminDashboard.cards.wards')}
            value={data.totals.wards}
            icon={<LocationOnIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            label={t('adminDashboard.cards.voters')}
            value={data.totals.voters}
            icon={<PeopleIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            label={t('adminDashboard.cards.aspirants')}
            value={data.totals.aspirants}
            icon={<HowToVoteIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            label={t('adminDashboard.cards.votes')}
            value={data.totals.votes}
            icon={<BarChartIcon />}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Extraction Progress removed from dashboard */}
    </Stack>
  );
};

export default AdminDashboardPage;
