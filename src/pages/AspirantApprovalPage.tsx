import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Box,
  Stack,
  Avatar,
  Button,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { Person as PersonIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { fetchWardAspirantsByNumber, approveAspirant, fetchAspirant } from '../services/aspirantService';
import { getWards } from '../services/wardService';
import { isMockMode } from '../config/appMode';

interface Ward {
  id?: number;
  name: string;
  number: string;
}

interface Aspirant {
  id: number;
  name: string;
  party: string;
  manifesto: string;
  status: 'pending' | 'approved' | 'rejected';
  wardId?: number;
  bio?: string;
  recentPhotoUrl?: string;
}

const dummyAspirants: Aspirant[] = [
  {
    id: 1,
    name: 'Ramesh Kumar',
    party: 'Prajaakeeya',
    manifesto: 'Focus on infrastructure development and citizen welfare',
    status: 'pending',
    bio: 'Social worker with 10 years of community service experience'
  },
  {
    id: 2,
    name: 'Sunita Rao',
    party: 'Prajaakeeya',
    manifesto: 'Education and healthcare for all, women empowerment',
    status: 'pending',
    bio: 'Educationist and women rights activist'
  },
  {
    id: 3,
    name: 'Kiran Shetty',
    party: 'Prajaakeeya',
    manifesto: 'Clean environment, waste management, green initiatives',
    status: 'approved',
    bio: 'Environmental engineer and sustainability advocate'
  },
  {
    id: 4,
    name: 'Deepak Patel',
    party: 'Prajaakeeya',
    manifesto: 'Digital governance, transparency, and accountability',
    status: 'pending',
    bio: 'IT professional and governance reform advocate'
  },
  {
    id: 5,
    name: 'Lakshmi Menon',
    party: 'Prajaakeeya',
    manifesto: 'Affordable housing and urban development',
    status: 'pending',
    bio: 'Urban planner and housing rights activist'
  },
  {
    id: 6,
    name: 'Arjun Malhotra',
    party: 'Prajaakeeya',
    manifesto: 'Youth development and employment opportunities',
    status: 'approved',
    bio: 'Business leader and youth mentor'
  }
];

const AspirantApprovalPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedWardNumber, setSelectedWardNumber] = useState<string>('');
  const [aspirants, setAspirants] = useState<Aspirant[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingWards, setLoadingWards] = useState(true);
  const [error, setError] = useState('');

  // Detect if this is the public page (/aspirants) vs admin page (/admin/aspirants/approval)
  const isPublicPage = location.pathname === '/aspirants';

  // Fallback translation helper to traverse resource bundle when `t()` returns raw keys
  const tr = (key: string, fallback: string) => {
    const res = t(key);
    if (typeof res === 'string' && res !== key && res) return res;
    try {
      const bundle = i18n.getResourceBundle(i18n.language, 'translation') || {};
      const parts = key.split('.');
      let cur: any = bundle;
      for (const p of parts) {
        if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
          cur = cur[p];
        } else {
          cur = undefined;
          break;
        }
      }
      if (typeof cur === 'string' && cur) return cur;
    } catch (e) {
      // ignore
    }
    return fallback;
  };

  // removed geography filters; only ward selection is needed
  const [wardInputValue, setWardInputValue] = useState('');

  // Dummy data for mock mode
  const dummyWards: Ward[] = [
    { id: 1, name: 'Ward 101 - Central', number: '101' },
    { id: 2, name: 'Ward 102 - North', number: '102' }
  ];

  // Load wards on mount
  useEffect(() => {
    setLoadingWards(true);
    setError('');
    if (isMockMode) {
      setTimeout(() => {
        // map dummy to simplified Ward shape
        setWards(dummyWards.map((d) => ({ number: d.number, name: d.name })));
        setLoadingWards(false);
      }, 300);
      return;
    }

    // fetch wards list from /api/wards/list via getWards()
    getWards()
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        const mapped: Ward[] = data.map((w: any) => ({ number: w.ward_number || w.number || String(w), name: w.ward_name || w.name || '' }));
        setWards(mapped);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || t('common.error') || 'Failed to load wards');
      })
      .finally(() => setLoadingWards(false));
  }, []);

  // removed geography filter effects - wards list is fetched once and filtered client-side by Autocomplete

  // Fetch aspirants when ward number changes
  useEffect(() => {
    if (!selectedWardNumber) {
      setAspirants([]);
      return;
    }
    setLoading(true);
    setError('');
    if (isMockMode) {
      setTimeout(() => {
        setAspirants(dummyAspirants);
        setLoading(false);
      }, 500);
      return;
    }
    fetchWardAspirantsByNumber(selectedWardNumber)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        setAspirants(data);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || t('common.error') || 'Failed to load aspirants');
        setAspirants([]);
      })
      .finally(() => setLoading(false));
  }, [selectedWardNumber]);

  const handleApprove = async (id: number) => {
    if (isMockMode) {
      setAspirants((prev) => prev.map((asp) => (asp.id === id ? { ...asp, status: 'approved' } : asp)));
      return;
    }
    try {
      await approveAspirant(id);
      setAspirants((prev) => prev.map((asp) => (asp.id === id ? { ...asp, status: 'approved' } : asp)));
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to approve aspirant');
    }
  };

  const handleRowClick = async (aspirant: Aspirant) => {
    if (isPublicPage) return;
    try {
      if (isMockMode) {
        navigate(`/admin/users/${aspirant.id}`);
        return;
      }
      const resp = await fetchAspirant(aspirant.id);
      const data = (resp && (resp as any).data) ? (resp as any).data : resp;
      // navigate to admin users page using the aspirant id (AdminUserDetailsPage now handles aspirant ids)
      navigate(`/admin/users/${aspirant.id}`);
    } catch (e) {
      console.error('Failed to fetch aspirant details', e);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {isPublicPage
            ? tr('pages.aspirants.title', 'Aspirants')
            : tr('pages.aspirantApproval.title', 'Aspirant Approval')}
        </Typography>
        <Typography variant="body1" sx={{
          color: "text.secondary"
        }}>
          {isPublicPage
            ? tr('pages.aspirants.subtitle', 'View aspirants registered for wards')
            : tr('pages.aspirantApproval.subtitle', 'Review and approve aspirants for wards')}
        </Typography>
      </Box>
      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3, flexWrap: 'wrap' }}>
            <Autocomplete
              options={wards}
              getOptionLabel={(o) => `${o.number} - ${o.name}`}
              value={wards.find((w) => w.number === selectedWardNumber) || null}
              onChange={(_, newValue) => setSelectedWardNumber(newValue ? newValue.number : '')}
              inputValue={wardInputValue}
              onInputChange={(_, newInput) => {
                setWardInputValue(newInput);
              }}
              disabled={loadingWards || wards.length === 0}
              sx={{ minWidth: 320 }}
              renderInput={(params) => (
                <TextField {...params} label={tr('pages.aspirantApproval.wardSelect', 'Select Ward')} />
              )}
            />
          </Stack>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>{t('forms.aspirant.name') || 'Name'}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{t('forms.aspirant.party') || 'Party'}</TableCell>
                  {!isPublicPage && (
                    <>
                      <TableCell sx={{ fontWeight: 600 }}>{t('forms.aspirant.manifesto') || 'Manifesto'}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        {t('common.status') || 'Status'}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {aspirants.length > 0 ? (
                  aspirants.map((aspirant) => (
                    <TableRow
                      key={aspirant.id}
                      hover
                      sx={{ cursor: !isPublicPage ? 'pointer' : 'default' }}
                      onClick={() => handleRowClick(aspirant)}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={2} sx={{
                          alignItems: "center"
                        }}>
                          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }} src={aspirant.recentPhotoUrl || undefined}>
                            {!aspirant.recentPhotoUrl && aspirant.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {aspirant.name}
                            </Typography>
                            {!isPublicPage && aspirant.manifesto && (
                              <Typography variant="caption" sx={{
                                color: "text.secondary"
                              }}>
                                {aspirant.manifesto}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{aspirant.party}</TableCell>
                      {!isPublicPage && (
                        <>
                          <TableCell>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                              {aspirant.manifesto}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="caption"
                              sx={{
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                bgcolor: aspirant.status === 'approved' ? 'success.light' : 'warning.light',
                                color: aspirant.status === 'approved' ? 'success.dark' : 'warning.dark',
                                fontWeight: 600
                              }}
                            >
                              {aspirant.status}
                            </Typography>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={isPublicPage ? 2 : 5} align="center" sx={{ py: 4 }}>
                      <Typography sx={{
                        color: "text.secondary"
                      }}>
                        {selectedWardNumber
                          ? tr('pages.aspirantApproval.noAspirants', 'No aspirants found for this ward')
                          : tr('pages.aspirantApproval.selectWard', 'Select a ward to view aspirants')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default AspirantApprovalPage;
