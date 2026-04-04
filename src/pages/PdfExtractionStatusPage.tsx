import { Card, CardContent, Typography, LinearProgress, Stack, Chip, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ExtractionItem {
  wardName: string;
  status: string;
  progress: number;
}

// Dummy data
const dummyExtractions: ExtractionItem[] = [
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
  },
  {
    wardName: 'Ward 105 - West',
    status: 'Completed',
    progress: 100
  }
];

const PdfExtractionStatusPage = () => {
  const { t } = useTranslation();

  const getStatusColor = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'error' => {
    if (status.toLowerCase().includes('complete')) {
      return 'success';
    }
    if (status.toLowerCase().includes('processing')) {
      return 'primary';
    }
    if (status.toLowerCase().includes('pending')) {
      return 'warning';
    }
    return 'default';
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {t('pages.extraction.title') || 'PDF Extraction Status'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('pages.extraction.subtitle') || 'Monitor the progress of voter data extraction from PDFs'}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            {dummyExtractions.map((item) => (
              <Box key={item.wardName}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" mb={1}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {item.wardName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.status}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${item.progress}%`}
                    color={getStatusColor(item.status)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={item.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4
                    }
                  }}
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default PdfExtractionStatusPage;
