import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Stack,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import FileUploadInput from '../components/FileUploadInput';
import { uploadWardVotersExcel } from '../services/voterRollService';
import { getWards } from '../services/wardService';
import { getStates, getParliamentary, getAssembly } from '../services/geographyService';
import { isMockMode } from '../config/appMode';

interface Ward {
  id: number;
  name: string;
  number: string;
  assembly: string;
  zone?: string;
}

const UploadBoothPdfsPage = () => {
  const { t } = useTranslation();
  const [wardId, setWardId] = useState<number | ''>('');
  const [states, setStates] = useState<string[]>([]);
  const [parliaments, setParliaments] = useState<string[]>([]);
  const [assemblies, setAssemblies] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedParliamentary, setSelectedParliamentary] = useState<string>('');
  const [selectedAssembly, setSelectedAssembly] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingWards, setLoadingWards] = useState(true);
  const [wards, setWards] = useState<Ward[]>([]);
  const [error, setError] = useState('');

  // Dummy wards data
  const dummyWards: Ward[] = [
    { id: 1, name: 'Ward 101 - Central', number: '101', assembly: 'Bengaluru Central', zone: 'N/A' },
    { id: 2, name: 'Ward 102 - North', number: '102', assembly: 'Bengaluru North', zone: 'N/A' },
    { id: 3, name: 'Ward 103 - South', number: '103', assembly: 'Bengaluru South', zone: 'N/A' }
  ];

  // Load states on mount and initial wards
  useEffect(() => {
    setLoadingWards(true);
    setError('');
    if (isMockMode) {
      setTimeout(() => {
        setWards(dummyWards);
        setStates(['Karnataka']);
        setParliaments(['Bangalore South', 'Bangalore Central']);
        setAssemblies(['Jayanagar', 'Rajajinagar', 'Seshadripuram']);
        setLoadingWards(false);
      }, 300);
      return;
    }

    getStates()
      .then((sResp) => {
        const extractNames = (data: any) => {
          if (!Array.isArray(data)) return [];
          return data.map((item: any) => (typeof item === 'string' ? item : item?.name || String(item)));
        };
        setStates(extractNames(sResp.data));
      })
      .catch(() => setStates([]));

    // initial fetch of wards without filters
    getWards()
      .then((response) => setWards(response.data as Ward[]))
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || t('common.error') || 'Failed to load wards');
      })
      .finally(() => setLoadingWards(false));
  }, []);

  // Fetch parliaments when state changes
  useEffect(() => {
    if (!selectedState) {
      setParliaments([]);
      return;
    }
    if (isMockMode) {
      setParliaments(['Bangalore South', 'Bangalore Central']);
      return;
    }
    getParliamentary(selectedState)
      .then((pResp) => {
        const extract = (data: any) => (Array.isArray(data) ? data.map((i: any) => (typeof i === 'string' ? i : i?.name || String(i))) : []);
        setParliaments(extract(pResp.data));
      })
      .catch(() => setParliaments([]));
  }, [selectedState]);

  // Fetch assemblies when state or parliamentary changes
  useEffect(() => {
    if (!selectedState) {
      setAssemblies([]);
      return;
    }
    if (isMockMode) {
      setAssemblies(['Jayanagar', 'Rajajinagar', 'Seshadripuram']);
      return;
    }
    getAssembly(selectedState, selectedParliamentary)
      .then((aResp) => {
        const extract = (data: any) => (Array.isArray(data) ? data.map((i: any) => (typeof i === 'string' ? i : i?.name || String(i))) : []);
        setAssemblies(extract(aResp.data));
      })
      .catch(() => setAssemblies([]));
  }, [selectedState, selectedParliamentary]);

  // Fetch wards when any filter changes
  useEffect(() => {
    setLoadingWards(true);
    setError('');
    if (isMockMode) {
      // filter dummy wards by assembly if selected
      let filtered = dummyWards;
      if (selectedAssembly) filtered = filtered.filter((w) => w.assembly === selectedAssembly);
      setWards(filtered);
      setLoadingWards(false);
      return;
    }
    getWards(selectedState || undefined, selectedParliamentary || undefined, selectedAssembly || undefined)
      .then((resp) => setWards(resp.data as Ward[]))
      .catch((err) => setError(err?.response?.data?.message || err?.message || t('common.error') || 'Failed to load wards'))
      .finally(() => setLoadingWards(false));
  }, [selectedState, selectedParliamentary, selectedAssembly]);

  const handleUpload = async () => {
    if (!wardId || files.length === 0) return;
    setLoading(true);
    setError('');
    if (isMockMode) {
      setTimeout(() => {
        setSuccess(true);
        setFiles([]);
        setWardId('');
        setLoading(false);
      }, 1500);
      return;
    }
    try {
      await uploadWardVotersExcel(Number(wardId), files[0]);
      setSuccess(true);
      setFiles([]);
      setWardId('');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || t('common.error') || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {t('adminDashboard.nav.upload')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('forms.upload.description') || 'Upload ward-wise voter Excel sheet for a ward'}
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
              <UploadIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('forms.upload.title') || 'Excel Upload'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('forms.upload.subtitle') || 'Select ward and upload Excel file'}
              </Typography>
            </Box>
          </Box>

          <Stack spacing={3}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              select
              label={t('forms.ward.state')}
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                // reset downstream selections
                setSelectedParliamentary('');
                setSelectedAssembly('');
                setWardId('');
              }}
              fullWidth
              disabled={loading || loadingWards}
            >
              {states.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label={t('forms.ward.parliamentary')}
              value={selectedParliamentary}
              onChange={(e) => {
                setSelectedParliamentary(e.target.value);
                setSelectedAssembly('');
                setWardId('');
              }}
              fullWidth
              disabled={loading || loadingWards || !selectedState}
            >
              {parliaments.map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label={t('forms.ward.assembly')}
              value={selectedAssembly}
              onChange={(e) => {
                setSelectedAssembly(e.target.value);
                setWardId('');
              }}
              fullWidth
              disabled={loading || loadingWards || !selectedState}
            >
              {assemblies.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label={t('forms.upload.ward')}
              fullWidth
              value={wardId}
              onChange={(e) => setWardId(e.target.value === '' ? '' : Number(e.target.value))}
              disabled={loading || loadingWards}
              error={!wardId && files.length > 0}
              helperText={!wardId && files.length > 0 ? 'Please select a ward' : ''}
            >
              {loadingWards ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  {t('common.loading') || 'Loading wards...'}
                </MenuItem>
              ) : (
                wards.map((ward) => (
                  <MenuItem key={ward.id} value={ward.id}>
                    {ward.name} (Ward {ward.number})
                  </MenuItem>
                ))
              )}
            </TextField>
            <FileUploadInput
              label={t('forms.upload.files') || 'Upload Excel'}
              onChange={(list) => setFiles(list ? [list[0]] : [])}
              selectedNames={files.map((file) => file.name)}
              disabled={loading}
              multiple={false}
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            />
            {files.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('forms.upload.selectedFiles') || 'Selected files'} ({files.length}):
                </Typography>
                <Stack spacing={0.5}>
                  {files.map((file, index) => (
                    <Typography key={index} variant="caption" color="text.secondary">
                      • {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!wardId || files.length === 0 || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
              fullWidth
              size="large"
            >
              {loading ? t('common.uploading') || 'Uploading...' : t('common.upload')}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          {t('status.uploadSuccess')}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default UploadBoothPdfsPage;
