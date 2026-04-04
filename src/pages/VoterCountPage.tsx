import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, Box, Stack, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { fetchWardVoterCounts } from '../services/voterRollService';

interface WardStat {
  wardId?: number;
  wardNumber?: string;
  wardName: string;
  total: number;
}

const VoterCountPage = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<WardStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetchWardVoterCounts();
        const data = Array.isArray(resp.data) ? resp.data : [];
        setStats(data.map((r: any) => ({ wardId: r.wardId, wardNumber: r.wardNumber, wardName: r.wardName, total: r.total })));
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || 'Failed to load voter counts');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {t('pages.voterCount.title') || 'Voter Count by Ward'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('pages.voterCount.subtitle') || 'Total number of registered voters in each ward'}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>{t('pages.voterCount.ward') || 'Ward'}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {t('pages.voterCount.total') || 'Total Voters'}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.map((row) => (
                  <TableRow key={row.wardId ?? row.wardName} hover>
                    <TableCell>
                      {row.wardNumber ? `${row.wardNumber} - ${row.wardName}` : row.wardName}
                    </TableCell>
                    <TableCell align="right">{(row.total ?? 0).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default VoterCountPage;
