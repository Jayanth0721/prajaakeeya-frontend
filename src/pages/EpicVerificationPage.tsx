import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from '../services/apiClient';
import { isMockMode } from '../config/appMode';
import {
  Card,
  CardContent,
  Stack,
  TextField,
  Button,
  Alert,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { VerifiedUser as VerifiedUserIcon } from '@mui/icons-material';

const EpicVerificationPage = () => {
  const [epic, setEpic] = useState('');
  const [result, setResult] = useState<{ wardName: string; name: string } | null>(null);
  const { t } = useTranslation();

  // Dummy EPIC to ward mapping
  const epicWardMap: Record<string, { wardName: string; name: string }> = {
    'ABC1234567': { wardName: 'Ward 101 - Central', name: 'Rajesh Kumar' },
    'DEF2345678': { wardName: 'Ward 102 - North', name: 'Priya Sharma' },
    'GHI3456789': { wardName: 'Ward 103 - South', name: 'Suresh Reddy' },
    'JKL4567890': { wardName: 'Ward 104 - East', name: 'Anita Desai' },
    'MNO5678901': { wardName: 'Ward 105 - West', name: 'Vikram Singh' }
  };

  const handleVerify = async () => {
    const upperEpic = epic.toUpperCase();
    if (isMockMode) {
      const found = epicWardMap[upperEpic];
      if (found) {
        setResult(found);
      } else if (epic.length >= 3) {
        // Show dummy result for any EPIC with 3+ characters
        setResult({
          wardName: 'Ward 101 - Central',
          name: 'Sample Voter'
        });
      } else {
        setResult(null);
      }
      return;
    }
    try {
      const { data } = await apiClient.get(`/voters/epic/${upperEpic}`);
      if (data?.wardName) {
        setResult({ wardName: data.wardName, name: data.name || 'Verified Voter' });
      } else {
        setResult(null);
      }
    } catch {
      setResult(null);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {t('pages.epic.title') || 'EPIC Verification'}
        </Typography>
        <Typography variant="body1" sx={{
          color: "text.secondary"
        }}>
          {t('pages.epic.subtitle') || 'Verify your EPIC number and find your assigned ward'}
        </Typography>
      </Box>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <TextField
              label={t('pages.epic.epicLabel') || 'Enter EPIC Number'}
              value={epic}
              onChange={(event) => {
                setEpic(event.target.value);
                setResult(null);
              }}
              placeholder="e.g., ABC1234567"
              fullWidth
            />
            <Button variant="contained" onClick={handleVerify} fullWidth size="large">
              {t('adminLogin.verify') || 'Verify EPIC'}
            </Button>
            {result && (
              <Alert
                severity="success"
                icon={<VerifiedUserIcon />}
                sx={{ borderRadius: 2 }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {t('pages.epic.verified') || 'EPIC Verified Successfully!'}
                </Typography>
                <Typography variant="body2" sx={{
                  color: "text.secondary"
                }}>
                  <strong>Name:</strong> {result.name}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={result.wardName}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
              </Alert>
            )}
            {epic && !result && epic.length < 3 && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                {t('pages.epic.enterEpic') || 'Please enter a valid EPIC number'}
              </Alert>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default EpicVerificationPage;
