import React, { useState } from 'react';
import {
  Box, Container, Typography, Paper, Button, ButtonGroup,
  Grid, Chip, useTheme, AppBar, Toolbar, Select, MenuItem,
  FormControl, InputLabel, IconButton, Tooltip, LinearProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { BRAND } from '../../theme';
import prajakeeyaLogo from '../../assets/images/prajakeeya.webp';
import LanguageSelector from '../../components/LanguageSelector';
import useThemeStore from '../../store/useThemeStore';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ForumIcon from '@mui/icons-material/ForumRounded';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import NewsletterIcon from '@mui/icons-material/Markunread';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GavelIcon from '@mui/icons-material/Gavel';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const FF_HEADING = "'Heming', 'Geist Variable', 'Geist', sans-serif";

interface PerformanceData {
  month: string;
  meetingsHeld: number;
  issuesResolved: number;
  citizenRating: number;
}

interface AspirantPerformance {
  name: string;
  party: string;
  meetingsHeld: number;
  issuesResolved: number;
  citizenRating: number;
  avgResponseTime: string;
  promisesKept: number;
  promisesMade: number;
}

interface Milestone {
  id: number;
  title: string;
  category: string;
  status: 'completed' | 'in-progress' | 'pending';
  targetDate: string;
  completionDate?: string;
  progress: number;
}

interface FeedbackItem {
  id: number;
  citizen: string;
  aspirant: string;
  rating: number;
  comment: string;
  date: string;
  category: 'positive' | 'neutral' | 'negative';
}

const DEMO_PERFORMANCE_DATA: PerformanceData[] = [
  { month: 'Jan', meetingsHeld: 12, issuesResolved: 28, citizenRating: 3.8 },
  { month: 'Feb', meetingsHeld: 15, issuesResolved: 35, citizenRating: 4.1 },
  { month: 'Mar', meetingsHeld: 18, issuesResolved: 42, citizenRating: 4.3 },
  { month: 'Apr', meetingsHeld: 22, issuesResolved: 51, citizenRating: 4.0 },
  { month: 'May', meetingsHeld: 25, issuesResolved: 48, citizenRating: 4.5 },
  { month: 'Jun', meetingsHeld: 28, issuesResolved: 62, citizenRating: 4.7 },
];

const DEMO_ASPIRANTS: AspirantPerformance[] = [
  { name: 'Ramesh Kumar', party: 'JD(S)', meetingsHeld: 28, issuesResolved: 62, citizenRating: 4.7, avgResponseTime: '2.3 days', promisesKept: 8, promisesMade: 12 },
  { name: 'Dr. Sunitha Rao', party: 'BJP', meetingsHeld: 35, issuesResolved: 71, citizenRating: 4.5, avgResponseTime: '1.8 days', promisesKept: 10, promisesMade: 14 },
  { name: 'Anand Krishnamurthy', party: 'INC', meetingsHeld: 22, issuesResolved: 38, citizenRating: 3.9, avgResponseTime: '3.5 days', promisesKept: 5, promisesMade: 11 },
  { name: 'Priya Sharma', party: 'AAP', meetingsHeld: 42, issuesResolved: 85, citizenRating: 4.8, avgResponseTime: '1.2 days', promisesKept: 12, promisesMade: 15 },
  { name: 'M. Venkatesh', party: 'Independent', meetingsHeld: 15, issuesResolved: 24, citizenRating: 3.2, avgResponseTime: '4.8 days', promisesKept: 3, promisesMade: 9 },
];

const DEMO_MILESTONES: Milestone[] = [
  { id: 1, title: 'Ward 150 Road Repair Phase 1', category: 'Infrastructure', status: 'completed', targetDate: '2026-03-15', completionDate: '2026-03-10', progress: 100 },
  { id: 2, title: 'Water Supply Pipeline Installation', category: 'Utilities', status: 'in-progress', targetDate: '2026-08-30', progress: 65 },
  { id: 3, title: 'Healthcare Camp - Q2', category: 'Health', status: 'completed', targetDate: '2026-06-30', completionDate: '2026-06-28', progress: 100 },
  { id: 4, title: 'Digital Literacy Program', category: 'Education', status: 'pending', targetDate: '2026-09-15', progress: 0 },
  { id: 5, title: 'Drainage Improvement Phase 2', category: 'Infrastructure', status: 'in-progress', targetDate: '2026-07-20', progress: 40 },
  { id: 6, title: 'Park Renovation Project', category: 'Environment', status: 'pending', targetDate: '2026-10-01', progress: 0 },
];

const DEMO_FEEDBACK: FeedbackItem[] = [
  { id: 1, citizen: 'Vijay K', aspirant: 'Ramesh Kumar', rating: 5, comment: 'Excellent response time on water issue. Very professional.', date: '2026-06-20', category: 'positive' },
  { id: 2, citizen: 'Lakshmi P', aspirant: 'Dr. Sunitha Rao', rating: 4, comment: 'Healthcare camp was well organized. Thank you!', date: '2026-06-18', category: 'positive' },
  { id: 3, citizen: 'Ravi S', aspirant: 'Anand Krishnamurthy', rating: 2, comment: 'No update on road repair since last month.', date: '2026-06-15', category: 'negative' },
  { id: 4, citizen: 'Meera N', aspirant: 'Priya Sharma', rating: 5, comment: 'Best aspirant we have had. Highly responsive.', date: '2026-06-12', category: 'positive' },
  { id: 5, citizen: 'Suresh R', aspirant: 'M. Venkatesh', rating: 3, comment: 'Meeting was scheduled but postponed without notice.', date: '2026-06-10', category: 'neutral' },
  { id: 6, citizen: 'Anitha G', aspirant: 'Ramesh Kumar', rating: 4, comment: 'Budget meeting details shared on time.', date: '2026-06-08', category: 'positive' },
];

const WORD_CLOUD_WORDS = [
  { text: 'Infrastructure', weight: 85, color: '#C8180A' },
  { text: 'Water', weight: 72, color: '#253A9A' },
  { text: 'Roads', weight: 68, color: '#C8180A' },
  { text: 'Healthcare', weight: 65, color: '#22c55e' },
  { text: 'Drainage', weight: 58, color: '#F5A800' },
  { text: 'Parks', weight: 52, color: '#22c55e' },
  { text: 'Education', weight: 48, color: '#253A9A' },
  { text: 'Sanitation', weight: 45, color: '#F5A800' },
  { text: 'Transport', weight: 42, color: '#C8180A' },
  { text: 'Lighting', weight: 38, color: '#F5A800' },
  { text: 'Waste', weight: 35, color: '#22c55e' },
  { text: 'Safety', weight: 32, color: '#253A9A' },
];

const PrajaalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { mode } = useThemeStore();

  const [selectedWard, setSelectedWard] = useState<string>('150');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('6months');

  const navItems = [
    { label: 'Aspirant+', icon: <HomeRoundedIcon />, path: '/portal' },
    { label: 'Prajaalytics', icon: <ShowChartIcon />, path: '/portal/prajaalytics' },
    { label: 'Prajaa Varte', icon: <NewsletterIcon />, path: '/portal/prajaa-varte' },
    { label: 'Disavow', icon: <LinkOffIcon />, path: '/portal/disavow' },
  ];

  const currentNavIndex = navItems.findIndex((item) =>
    item.path === '/portal/prajaalytics'
      ? location.pathname === '/portal/prajaalytics'
      : location.pathname.startsWith(item.path)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'in-progress': return '#F5A800';
      case 'pending': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Infrastructure': return '🏗️';
      case 'Utilities': return '💧';
      case 'Health': return '🏥';
      case 'Education': return '📚';
      case 'Environment': return '🌿';
      default: return '📌';
    }
  };

  const handleExportPDF = () => {
    alert('PDF Export functionality - In production, this would generate a detailed analytics report');
  };

  const handleExportCSV = () => {
    alert('CSV Export functionality - In production, this would export raw data for analysis');
  };

  const maxValue = Math.max(...DEMO_PERFORMANCE_DATA.map(d => Math.max(d.meetingsHeld, d.issuesResolved)));

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Guest Layout Header */}
      <AppBar position="sticky" elevation={0} sx={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(24px) saturate(1.8)',
        color: 'text.primary',
        borderBottom: '1px solid rgba(200,24,10,0.06)',
        boxShadow: '0 4px 24px -4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.7)',
      }}>
        <Box sx={{ display: 'flex', height: '3px' }}>
          {[BRAND.red, BRAND.blue, BRAND.brown].map(c => <Box key={c} sx={{ flex: 1, bgcolor: c }} />)}
        </Box>

        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
          <Toolbar sx={{ justifyContent: 'space-between', py: { xs: 0.9, sm: 1.2 }, minHeight: { xs: 56, sm: 72 }, px: { xs: 1 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
              onClick={() => navigate('/')}>
              <Box sx={{
                p: 0.8, borderRadius: 2,
                background: 'linear-gradient(135deg,rgba(200,24,10,.18),rgba(245,168,0,.14))',
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Box component="img" src={prajakeeyaLogo} alt="Prajaakeeya" sx={{ height: { xs: 28, sm: 34 } }} />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ fontFamily: FF_HEADING, fontWeight: 800, lineHeight: 1.05, color: 'text.primary', fontSize: { sm: '1rem', md: '1.08rem' } }}>
                  Prajaaakeeya
                </Typography>
                <Typography sx={{ fontFamily: FF_HEADING, fontSize: '0.73rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(17,24,39,0.45)' }}>
                  GUEST
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, sm: 1.5 } }}>
              <LanguageSelector sx={{ minWidth: 64, px: 1, fontFamily: FF_HEADING, fontWeight: 800, fontSize: '0.9rem', color: BRAND.saffron }} />
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate('/register')}
                sx={{ fontFamily: FF_HEADING, minHeight: 36, px: 2, bgcolor: BRAND.red, '&:hover': { bgcolor: BRAND.red2 } }}
              >
                Register
              </Button>
            </Box>
          </Toolbar>
        </Container>

        {/* Desktop primary navigation */}
        <Box sx={{ display: { xs: 'none', sm: 'block' }, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap',
              gap: { sm: 0.5, md: 0.75 }, py: 0.6,
              borderRadius: 2.5,
              mx: { sm: 2, md: 4 },
              my: 0.5,
              px: 1,
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(200,24,10,0.06)',
            }}>
              {navItems.map((item, idx) => {
                const active = idx === currentNavIndex;
                return (
                  <Button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    startIcon={item.icon}
                    sx={{
                      fontFamily: FF_HEADING,
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 50,
                      px: { sm: 1.6, md: 2.2 },
                      py: 0.8,
                      fontSize: { sm: '0.8rem', md: '0.88rem' },
                      color: active
                        ? '#fff'
                        : 'rgba(17,24,39,0.62)',
                      background: active
                        ? 'linear-gradient(135deg, rgba(200,24,10,0.88) 0%, rgba(245,168,0,0.75) 100%)'
                        : 'transparent',
                      border: active
                        ? '1px solid rgba(200,24,10,0.25)'
                        : '1px solid transparent',
                      boxShadow: active
                        ? '0 4px 20px -4px rgba(200,24,10,0.3), inset 0 1px 0 rgba(255,255,255,0.5)'
                        : 'none',
                      '&:hover': active
                        ? {
                            boxShadow: '0 6px 28px -4px rgba(200,24,10,0.4), inset 0 1px 0 rgba(255,255,255,0.6)',
                            transform: 'translateY(-1px)',
                          }
                        : {
                            background: 'rgba(200,24,10,0.04)',
                            color: 'rgba(17,24,39,0.85)',
                          },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          </Container>
        </Box>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 }, pt: 3, pb: 4 }}>
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2, maxWidth: '1600px', mx: 'auto' }}>
          <Box>
            <Typography variant="h3" sx={{
              fontFamily: '"Heming", "Geist Variable", "Geist", sans-serif',
              fontWeight: 900,
              color: '#111827',
              letterSpacing: '-0.025em',
              fontSize: { xs: '1.8rem', md: '2.2rem' },
            }}>
              Prajaalytics
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280', mt: 1 }}>
              Performance metrics, citizen feedback, and ward analytics
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel sx={{ fontFamily: FF_HEADING, fontWeight: 700 }}>Ward</InputLabel>
              <Select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                label="Ward"
                sx={{ fontFamily: FF_HEADING, fontWeight: 700 }}
              >
                <MenuItem value="150">Ward 150</MenuItem>
                <MenuItem value="149">Ward 149</MenuItem>
                <MenuItem value="125">Ward 125</MenuItem>
                <MenuItem value="201">Ward 201</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel sx={{ fontFamily: FF_HEADING, fontWeight: 700 }}>Time Range</InputLabel>
              <Select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                label="Time Range"
                sx={{ fontFamily: FF_HEADING, fontWeight: 700 }}
              >
                <MenuItem value="3months">Last 3 Months</MenuItem>
                <MenuItem value="6months">Last 6 Months</MenuItem>
                <MenuItem value="1year">Last 1 Year</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>

            <Tooltip title="Export PDF Report">
              <IconButton onClick={handleExportPDF} sx={{ bgcolor: BRAND.red, color: '#fff', '&:hover': { bgcolor: BRAND.red2 } }}>
                <PictureAsPdfIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export CSV Data">
              <IconButton onClick={handleExportCSV} sx={{ bgcolor: BRAND.yellow, color: '#111827', '&:hover': { bgcolor: BRAND.yellowLight } }}>
                <TableChartIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper sx={{ p: 2.5, textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)' }}>
              <Typography variant="h3" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: BRAND.red }}>
                132
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>
                Total Meetings
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: '#22c55e' }} />
                <Typography variant="caption" sx={{ color: '#22c55e', fontWeight: 700 }}>+12%</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper sx={{ p: 2.5, textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)' }}>
              <Typography variant="h3" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: BRAND.yellow }}>
                260
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>
                Issues Resolved
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: '#22c55e' }} />
                <Typography variant="caption" sx={{ color: '#22c55e', fontWeight: 700 }}>+18%</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper sx={{ p: 2.5, textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)' }}>
              <Typography variant="h3" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: '#22c55e' }}>
                4.3
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>
                Avg Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: '#22c55e' }} />
                <Typography variant="caption" sx={{ color: '#22c55e', fontWeight: 700 }}>+0.4</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper sx={{ p: 2.5, textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)' }}>
              <Typography variant="h3" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: '#253A9A' }}>
                78%
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>
                Promises Kept
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: '#22c55e' }} />
                <Typography variant="caption" sx={{ color: '#22c55e', fontWeight: 700 }}>+5%</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Performance Chart */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 3 }}>
                Performance Trends
              </Typography>
              
              {/* Simple Bar Chart */}
              <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 250, gap: 2 }}>
                {DEMO_PERFORMANCE_DATA.map((data, idx) => (
                  <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end', height: '100%' }}>
                      {/* Meetings Bar */}
                      <Box sx={{
                        width: 24,
                        height: `${(data.meetingsHeld / maxValue) * 200}px`,
                        bgcolor: BRAND.red,
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.5s ease',
                        position: 'relative'
                      }}>
                        <Typography variant="caption" sx={{
                          position: 'absolute',
                          top: -20,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontFamily: FF_HEADING,
                          fontWeight: 700,
                          fontSize: '10px',
                          color: BRAND.red
                        }}>
                          {data.meetingsHeld}
                        </Typography>
                      </Box>
                      {/* Issues Bar */}
                      <Box sx={{
                        width: 24,
                        height: `${(data.issuesResolved / maxValue) * 200}px`,
                        bgcolor: BRAND.yellow,
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.5s ease',
                        position: 'relative'
                      }}>
                        <Typography variant="caption" sx={{
                          position: 'absolute',
                          top: -20,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontFamily: FF_HEADING,
                          fontWeight: 700,
                          fontSize: '10px',
                          color: BRAND.yellowLight
                        }}>
                          {data.issuesResolved}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280', mt: 1 }}>
                      {data.month}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: BRAND.red, borderRadius: '4px' }} />
                  <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#6B7280' }}>
                    Meetings Held
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: BRAND.yellow, borderRadius: '4px' }} />
                  <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#6B7280' }}>
                    Issues Resolved
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Citizen Rating Trend */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 3 }}>
                Citizen Rating Trend
              </Typography>
              
              {/* Simple Line Chart for Ratings */}
              <Box sx={{ position: 'relative', height: 180 }}>
                <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="37.5" x2="300" y2="37.5" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4" />
                  <line x1="0" y1="75" x2="300" y2="75" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4" />
                  <line x1="0" y1="112.5" x2="300" y2="112.5" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4" />
                  
                  {/* Y-axis labels */}
                  <text x="5" y="15" fontSize="10" fill="#9CA3AF" fontFamily="Heming">5</text>
                  <text x="5" y="42" fontSize="10" fill="#9CA3AF" fontFamily="Heming">4</text>
                  <text x="5" y="77" fontSize="10" fill="#9CA3AF" fontFamily="Heming">3</text>
                  <text x="5" y="115" fontSize="10" fill="#9CA3AF" fontFamily="Heming">2</text>

                  {/* Line path */}
                  <path
                    d={`M 0 ${150 - ((DEMO_PERFORMANCE_DATA[0].citizenRating - 2) / 3 * 150)}
                        L ${300/5} ${150 - ((DEMO_PERFORMANCE_DATA[1].citizenRating - 2) / 3 * 150)}
                        L ${600/5} ${150 - ((DEMO_PERFORMANCE_DATA[2].citizenRating - 2) / 3 * 150)}
                        L ${900/5} ${150 - ((DEMO_PERFORMANCE_DATA[3].citizenRating - 2) / 3 * 150)}
                        L ${1200/5} ${150 - ((DEMO_PERFORMANCE_DATA[4].citizenRating - 2) / 3 * 150)}
                        L ${1500/5} ${150 - ((DEMO_PERFORMANCE_DATA[5].citizenRating - 2) / 3 * 150)}`}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Area under line */}
                  <path
                    d={`M 0 ${150 - ((DEMO_PERFORMANCE_DATA[0].citizenRating - 2) / 3 * 150)}
                        L ${300/5} ${150 - ((DEMO_PERFORMANCE_DATA[1].citizenRating - 2) / 3 * 150)}
                        L ${600/5} ${150 - ((DEMO_PERFORMANCE_DATA[2].citizenRating - 2) / 3 * 150)}
                        L ${900/5} ${150 - ((DEMO_PERFORMANCE_DATA[3].citizenRating - 2) / 3 * 150)}
                        L ${1200/5} ${150 - ((DEMO_PERFORMANCE_DATA[4].citizenRating - 2) / 3 * 150)}
                        L ${1500/5} ${150 - ((DEMO_PERFORMANCE_DATA[5].citizenRating - 2) / 3 * 150)}
                        L ${1500/5} 150 L 0 150 Z`}
                    fill="url(#greenGradient)"
                    opacity="0.2"
                  />
                  
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="1" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Data points */}
                  {DEMO_PERFORMANCE_DATA.map((data, idx) => (
                    <circle
                      key={idx}
                      cx={idx * 300/5}
                      cy={150 - ((data.citizenRating - 2) / 3 * 150)}
                      r="5"
                      fill="#22c55e"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
                
                {/* X-axis labels */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  {DEMO_PERFORMANCE_DATA.map((data, idx) => (
                    <Typography key={idx} variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#6B7280', fontSize: '10px' }}>
                      {data.month}
                    </Typography>
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#6B7280' }}>
                  Current: <span style={{ color: '#22c55e', fontWeight: 800 }}>4.7</span>
                </Typography>
                <Typography variant="caption" sx={{ color: '#22c55e', fontFamily: FF_HEADING, fontWeight: 700 }}>
                  +0.9 from start
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Voter Sentiment - Word Cloud */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 3 }}>
                Voter Sentiment - Topic Analysis
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', py: 2 }}>
                {WORD_CLOUD_WORDS.map((word, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      bgcolor: `${word.color}15`,
                      border: `1px solid ${word.color}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        bgcolor: `${word.color}30`,
                        boxShadow: `0 4px 12px ${word.color}40`
                      }
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FF_HEADING,
                        fontWeight: word.weight > 70 ? 800 : word.weight > 50 ? 700 : 600,
                        fontSize: word.weight > 70 ? '1.1rem' : word.weight > 50 ? '0.95rem' : '0.8rem',
                        color: word.color
                      }}
                    >
                      {word.text}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Chip label="Most Discussed" size="small" sx={{ fontFamily: FF_HEADING, fontWeight: 700, bgcolor: BRAND.red, color: '#fff' }} />
                <Chip label="Positive Sentiment" size="small" sx={{ fontFamily: FF_HEADING, fontWeight: 700, bgcolor: '#22c55e', color: '#fff' }} />
                <Chip label="Action Needed" size="small" sx={{ fontFamily: FF_HEADING, fontWeight: 700, bgcolor: BRAND.yellow, color: '#111827' }} />
              </Box>
            </Paper>
          </Grid>

          {/* Attendance Heatmap */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 3 }}>
                Response Time Heatmap (Days)
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1 }}>
                {DEMO_ASPIRANTS.map((aspirant, idx) => (
                  <Box key={idx} sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 700, fontSize: '10px', color: '#6B7280', display: 'block', mb: 0.5 }}>
                      {aspirant.name.split(' ')[0]}
                    </Typography>
                    <Box sx={{
                      height: 60,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: parseFloat(aspirant.avgResponseTime) < 2 ? '#22c55e' :
                             parseFloat(aspirant.avgResponseTime) < 4 ? '#F5A800' : '#C8180A',
                      opacity: 0.8 + (parseFloat(aspirant.avgResponseTime) < 2 ? 0.2 : parseFloat(aspirant.avgResponseTime) < 4 ? 0.1 : 0),
                      transition: 'all 0.3s ease',
                      '&:hover': { transform: 'scale(1.05)', opacity: 1 }
                    }}>
                      <Typography sx={{ fontFamily: FF_HEADING, fontWeight: 800, fontSize: '12px', color: '#fff' }}>
                        {aspirant.avgResponseTime.split('.')[0]}d
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 600, fontSize: '9px', color: '#9CA3AF', mt: 0.5, display: 'block' }}>
                      {aspirant.avgResponseTime}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: '#22c55e', borderRadius: '4px' }} />
<Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#6B7280' }}>{"<2 days"}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 16, height: 16, bgcolor: '#F5A800', borderRadius: '4px' }} />
                        <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#6B7280' }}>2-4 days</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 16, height: 16, bgcolor: '#C8180A', borderRadius: '4px' }} />
                        <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#6B7280' }}>{">4 days"}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Progress Milestones */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 3 }}>
                Progress Milestones
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {DEMO_MILESTONES.map((milestone) => (
                  <Box key={milestone.id} sx={{
                    p: 2,
                    borderRadius: '8px',
                    bgcolor: 'rgba(0,0,0,0.02)',
                    border: `1px solid ${getStatusColor(milestone.status)}30`,
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '16px' }}>{getCategoryIcon(milestone.category)}</Typography>
                        <Typography variant="subtitle2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#111827' }}>
                          {milestone.title}
                        </Typography>
                      </Box>
                      <Chip
                        label={milestone.status.replace('-', ' ')}
                        size="small"
                        sx={{
                          fontFamily: FF_HEADING,
                          fontWeight: 700,
                          fontSize: '10px',
                          textTransform: 'uppercase',
                          bgcolor: getStatusColor(milestone.status),
                          color: '#fff'
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarMonthIcon sx={{ fontSize: 12 }} />
                        Target: {new Date(milestone.targetDate).toLocaleDateString()}
                      </Typography>
                      {milestone.completionDate && (
                        <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CheckCircleIcon sx={{ fontSize: 12 }} />
                          Completed: {new Date(milestone.completionDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={milestone.progress}
                        sx={{
                          flex: 1,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'rgba(0,0,0,0.06)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getStatusColor(milestone.status),
                            borderRadius: 4
                          }
                        }}
                      />
                      <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: getStatusColor(milestone.status), minWidth: 40 }}>
                        {milestone.progress}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Citizen Feedback Aggregator */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 3 }}>
                Citizen Feedback Aggregator
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {DEMO_FEEDBACK.map((feedback) => (
                  <Box key={feedback.id} sx={{
                    p: 2,
                    borderRadius: '8px',
                    bgcolor: feedback.category === 'positive' ? 'rgba(34,197,94,0.05)' :
                           feedback.category === 'negative' ? 'rgba(200,24,10,0.05)' : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${feedback.category === 'positive' ? 'rgba(34,197,94,0.2)' :
                            feedback.category === 'negative' ? 'rgba(200,24,10,0.2)' : 'rgba(0,0,0,0.06)'}`,
                    '&:hover': { transform: 'translateX(4px)', transition: 'transform 0.2s ease' }
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#111827' }}>
                          {feedback.citizen}
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#6B7280' }}>
                          re: {feedback.aspirant}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {[...Array(5)].map((_, i) => (
                          i < feedback.rating ?
                            <ThumbUpIcon key={i} sx={{ fontSize: 14, color: '#22c55e' }} /> :
                            <ThumbDownIcon key={i} sx={{ fontSize: 14, color: '#D1D5DB' }} />
                        ))}
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 500, color: '#4B5563', mb: 1 }}>
                      "{feedback.comment}"
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#9CA3AF' }}>
                      {new Date(feedback.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Aspirant Comparison Table */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827' }}>
                  Aspirant Performance Comparison
                </Typography>
                <Chip
                  label="Ward Benchmark"
                  size="small"
                  icon={<GroupsIcon sx={{ fontSize: 14 }} />}
                  sx={{ fontFamily: FF_HEADING, fontWeight: 700, bgcolor: BRAND.red, color: '#fff' }}
                />
              </Box>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                      <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#374151' }}>Aspirant</TableCell>
                      <TableCell align="center" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#374151' }}>Meetings</TableCell>
                      <TableCell align="center" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#374151' }}>Issues</TableCell>
                      <TableCell align="center" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#374151' }}>Rating</TableCell>
                      <TableCell align="center" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#374151' }}>Response</TableCell>
                      <TableCell align="center" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#374151' }}>Promises</TableCell>
                      <TableCell align="center" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#374151' }}>Success</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {DEMO_ASPIRANTS.map((aspirant, idx) => (
                      <TableRow key={idx} sx={{
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                        borderBottom: idx < DEMO_ASPIRANTS.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none'
                      }}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#111827' }}>
                              {aspirant.name}
                            </Typography>
                            <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: BRAND.yellow }}>
                              {aspirant.party}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: BRAND.red }}>
                            {aspirant.meetingsHeld}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: BRAND.yellow }}>
                            {aspirant.issuesResolved}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#22c55e' }}>
                              {aspirant.citizenRating}
                            </Typography>
                            <TrendingUpIcon sx={{ fontSize: 14, color: '#22c55e' }} />
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{
                            fontFamily: FF_HEADING,
                            fontWeight: 700,
                            color: parseFloat(aspirant.avgResponseTime) < 2 ? '#22c55e' :
                                   parseFloat(aspirant.avgResponseTime) < 4 ? '#F5A800' : '#C8180A'
                          }}>
                            {aspirant.avgResponseTime}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#111827' }}>
                            {aspirant.promisesKept}/{aspirant.promisesMade}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${Math.round((aspirant.promisesKept / aspirant.promisesMade) * 100)}%`}
                            size="small"
                            sx={{
                              fontFamily: FF_HEADING,
                              fontWeight: 800,
                              bgcolor: (aspirant.promisesKept / aspirant.promisesMade) > 0.7 ? '#22c55e20' :
                                     (aspirant.promisesKept / aspirant.promisesMade) > 0.4 ? '#F5A80020' : '#C8180A20',
                              color: (aspirant.promisesKept / aspirant.promisesMade) > 0.7 ? '#22c55e' :
                                     (aspirant.promisesKept / aspirant.promisesMade) > 0.4 ? '#F5A800' : '#C8180A'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PrajaalyticsPage;