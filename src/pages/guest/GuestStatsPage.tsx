import React from 'react';
import { Box, Container, Typography, Paper, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { BRAND } from '../../theme';

const FF_HEADING = "'Heming', 'Geist Variable', 'Geist', sans-serif";

const GuestStatsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ maxWidth: '1600px', mx: 'auto' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/guest/dashboard')}
          sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280', mb: 3 }}
        >
          Back to Dashboard
        </Button>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: '#111827', mb: 1 }}>
            Government Statistics & Fund Management
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: FF_HEADING, color: '#6B7280' }}>
            Transparency in public expenditure, fund allocation, and utilization tracking
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Karnataka</Typography>
              <Typography variant="h4" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: BRAND.red, my: 1 }}>₹2,85,000 Cr</Typography>
              <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#111827' }}>State Budget 2024-25</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Union of India</Typography>
              <Typography variant="h4" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: BRAND.blue, my: 1 }}>₹4,87,000 Cr</Typography>
              <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#111827' }}>Central Budget 2024-25</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>BBMP + Rural</Typography>
              <Typography variant="h4" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: BRAND.yellow, my: 1 }}>₹18,500 Cr</Typography>
              <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#111827' }}>District Planning 2024-25</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Combined</Typography>
              <Typography variant="h4" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: BRAND.green, my: 1 }}>₹72,000 Cr</Typography>
              <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#111827' }}>Social Sector Budget</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <AccountBalanceIcon sx={{ color: BRAND.red }} />
            <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827' }}>
              Fund Flow Chain
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontFamily: FF_HEADING, color: '#6B7280', mb: 2 }}>
            How government funds flow from central allocation to grassroots projects
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ p: 2, bgcolor: `${BRAND.red}05`, borderRadius: 2, border: `1px solid ${BRAND.red}15` }}>
                <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>Union Government → State</Typography>
                <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: BRAND.red, my: 1 }}>₹85,000 Cr</Typography>
                <Typography variant="caption" sx={{ fontFamily: FF_HEADING }}>Finance Commission Transfer</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ p: 2, bgcolor: `${BRAND.blue}05`, borderRadius: 2, border: `1px solid ${BRAND.blue}15` }}>
                <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>State → District</Typography>
                <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: BRAND.blue, my: 1 }}>₹32,000 Cr</Typography>
                <Typography variant="caption" sx={{ fontFamily: FF_HEADING }}>State Share & Grants</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ p: 2, bgcolor: `${BRAND.yellow}05`, borderRadius: 2, border: `1px solid ${BRAND.yellow}15` }}>
                <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>District → ULBs & GPs</Typography>
                <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: BRAND.yellow, my: 1 }}>₹18,500 Cr</Typography>
                <Typography variant="caption" sx={{ fontFamily: FF_HEADING }}>Local Body Share</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ p: 2, bgcolor: `${BRAND.green}05`, borderRadius: 2, border: `1px solid ${BRAND.green}15` }}>
                <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>ULBs → Ward Projects</Typography>
                <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: BRAND.green, my: 1 }}>₹5,200 Cr</Typography>
                <Typography variant="caption" sx={{ fontFamily: FF_HEADING }}>Grassroots Development</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BarChartIcon sx={{ color: BRAND.red }} />
                <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Key Performance Indicators</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 600 }}>Budget Utilization Rate</Typography>
                    <TrendingUpIcon sx={{ color: BRAND.green }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontFamily: FF_HEADING, fontWeight: 900 }}>82%</Typography>
                  <Typography variant="caption" sx={{ color: BRAND.green }}>+3% vs last year</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 600 }}>Direct Benefit Transfer</Typography>
                    <TrendingUpIcon sx={{ color: BRAND.green }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontFamily: FF_HEADING, fontWeight: 900 }}>94%</Typography>
                  <Typography variant="caption" sx={{ color: BRAND.green }}>+5% vs last year</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 600 }}>Public Grievance Resolution</Typography>
                    <TrendingUpIcon sx={{ color: BRAND.green }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontFamily: FF_HEADING, fontWeight: 900 }}>78%</Typography>
                  <Typography variant="caption" sx={{ color: BRAND.green }}>+8% vs last year</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 600 }}>Project Completion Rate</Typography>
                    <TrendingUpIcon sx={{ color: BRAND.red, transform: 'rotate(180deg)' }} />
                  </Box>
                  <Typography variant="h4" sx={{ fontFamily: FF_HEADING, fontWeight: 900 }}>71%</Typography>
                  <Typography variant="caption" sx={{ color: BRAND.red }}>-2% vs last year</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PieChartIcon sx={{ color: BRAND.red }} />
                <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Centrally Sponsored Schemes</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  { name: 'MGNREGA', center: '60%', state: '40%', amount: '₹8,500 Cr' },
                  { name: 'PM-KISAN', center: '100%', state: '0%', amount: '₹6,000 Cr' },
                  { name: 'Swachh Bharat', center: '60%', state: '40%', amount: '₹3,200 Cr' },
                  { name: 'Ayushman Bharat', center: '70%', state: '30%', amount: '₹6,400 Cr' },
                  { name: 'PM Awas Yojana', center: '80%', state: '20%', amount: '₹4,800 Cr' },
                ].map((scheme) => (
                  <Box key={scheme.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: '#F9FAFB', borderRadius: 1 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 700 }}>{scheme.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption" sx={{ fontFamily: FF_HEADING, color: BRAND.blue }}>Center: {scheme.center}</Typography>
                        <Typography variant="caption" sx={{ fontFamily: FF_HEADING, color: BRAND.red }}>State: {scheme.state}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: BRAND.yellow }}>{scheme.amount}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', mt: 3, bgcolor: `${BRAND.yellow}10` }}>
          <Typography variant="subtitle1" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 1 }}>
            How to Interpret This Data
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: FF_HEADING, color: '#6B7280', lineHeight: 1.7 }}>
            This dashboard provides transparency into how public funds are allocated and utilized across different government schemes and administrative levels. The utilization percentage indicates how effectively allocated funds have been spent. Direct Benefit Transfer (DBT) metrics show what percentage of benefits reach citizens directly.
          </Typography>
        </Paper>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="caption" sx={{ fontFamily: FF_HEADING, color: '#9CA3AF' }}>
            Data sourced from Ministry of Finance, State Budget documents, and CAG reports. Updated quarterly.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default GuestStatsPage;