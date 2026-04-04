import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Box,
  Typography,
  Stack
} from '@mui/material';
import { AddLocation as AddLocationIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { wardSchema } from '../utils/validation';
import { createWard, WardInput } from '../services/wardService';
import { isMockMode } from '../config/appMode';
import { getStates, getParliamentary, getAssembly } from '../services/geographyService';

const CreateWardPage = () => {
  const { t } = useTranslation();
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<WardInput>({ resolver: yupResolver(wardSchema) });

  const selectedState = watch('state');
  const selectedParliamentary = watch('parliamentary');

  const [states, setStates] = useState<string[]>([]);
  const [parliaments, setParliaments] = useState<string[]>([]);
  const [assemblies, setAssemblies] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Load states on mount
  useEffect(() => {
    setLoadingOptions(true);
    if (isMockMode) {
      setTimeout(() => {
        setStates(['Karnataka']);
        setLoadingOptions(false);
      }, 300);
      return;
    }

    getStates()
      .then((sResp) => {
        const extractNames = (data: any) => {
          if (!Array.isArray(data)) return [];
          return data.map((item) => (typeof item === 'string' ? item : item?.name || String(item)));
        };
        setStates(extractNames(sResp.data));
      })
      .catch(() => setStates([]))
      .finally(() => setLoadingOptions(false));
  }, []);

  // Load parliamentary when state changes
  useEffect(() => {
    if (!selectedState) {
      setParliaments([]);
      return;
    }

    if (isMockMode) {
      setTimeout(() => {
        setParliaments(['Bangalore South', 'Bangalore Central']);
      }, 200);
      return;
    }

    getParliamentary(selectedState)
      .then((pResp) => {
        const extractNames = (data: any) => {
          if (!Array.isArray(data)) return [];
          return data.map((item) => (typeof item === 'string' ? item : item?.name || String(item)));
        };
        setParliaments(extractNames(pResp.data));
      })
      .catch(() => setParliaments([]));
  }, [selectedState]);

  // Load assemblies when state or parliamentary changes
  useEffect(() => {
    if (!selectedState) {
      setAssemblies([]);
      return;
    }

    if (isMockMode) {
      setTimeout(() => {
        setAssemblies(['Jayanagar', 'Rajajinagar', 'Seshadripuram']);
      }, 200);
      return;
    }

    getAssembly(selectedState, selectedParliamentary)
      .then((aResp) => {
        const extractNames = (data: any) => {
          if (!Array.isArray(data)) return [];
          return data.map((item) => (typeof item === 'string' ? item : item?.name || String(item)));
        };
        setAssemblies(extractNames(aResp.data));
      })
      .catch(() => setAssemblies([]));
  }, [selectedState, selectedParliamentary]);

  const onSubmit = async (values: WardInput) => {
    setLoading(true);
    if (isMockMode) {
      setTimeout(() => {
        setSuccessOpen(true);
        reset();
        setLoading(false);
      }, 1000);
      return;
    }
    try {
      await createWard(values);
      setSuccessOpen(true);
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {t('adminDashboard.nav.createWard')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('forms.ward.description') || 'Create a new ward with its details'}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'primary.light',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AddLocationIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('forms.ward.title') || 'Ward Information'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('forms.ward.subtitle') || 'Enter the ward details below'}
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('forms.ward.number')}
                  {...register('number')}
                  error={!!errors.number}
                  helperText={errors.number && t(errors.number.message || 'validation.required')}
                  placeholder="e.g., 101"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('forms.ward.name')}
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name && t(errors.name.message || 'validation.required')}
                  placeholder="e.g., Central Ward"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label={t('forms.ward.state')}
                  {...register('state')}
                  error={!!errors.state}
                  helperText={errors.state && t(errors.state.message || 'validation.required')}
                  disabled={loadingOptions}
                >
                  {states.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label={t('forms.ward.parliamentary')}
                  {...register('parliamentary')}
                  error={!!errors.parliamentary}
                  helperText={errors.parliamentary && t(errors.parliamentary.message || 'validation.required')}
                  disabled={loadingOptions}
                >
                  {parliaments.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  label={t('forms.ward.assembly')}
                  {...register('assembly')}
                  error={!!errors.assembly}
                  helperText={errors.assembly && t(errors.assembly.message || 'validation.required')}
                  disabled={loadingOptions}
                >
                  {assemblies.map((a) => (
                    <MenuItem key={a} value={a}>
                      {a}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => reset()}
                    disabled={loading}
                  >
                    {t('common.reset') || 'Reset'}
                  </Button>
                  <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? t('common.creating') || 'Creating...' : t('common.submit')}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccessOpen(false)}>
          {t('status.wardCreated')}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default CreateWardPage;
