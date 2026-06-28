import React, { useState } from 'react';
import {
  Box, Container, Typography, Paper, Button, ButtonGroup,
  IconButton, Grid, Chip, useTheme, AppBar, Toolbar
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/X';

const FF_HEADING = "'Heming', 'Geist Variable', 'Geist', sans-serif";

interface NewsItem {
  id: number;
  title: string;
  source: 'facebook' | 'youtube' | 'twitter';
  date: string;
  content: string;
  imageUrl?: string;
}

const DEMO_NEWS: NewsItem[] = [
  {
    id: 1,
    title: 'Ward 150 Budget Meeting Announcement',
    source: 'facebook',
    date: '2026-06-20',
    content: 'Public meeting scheduled for ward budget discussion on June 25th at 10 AM at the Community Hall. All citizens are encouraged to attend and participate in the participatory budgeting process.',
  },
  {
    id: 2,
    title: 'New Water Supply Project Update',
    source: 'youtube',
    date: '2026-06-18',
    content: 'The new water supply pipeline work has reached 60% completion. Expected to be fully operational by August 2026.',
  },
  {
    id: 3,
    title: 'Road Repair Initiative Launched',
    source: 'twitter',
    date: '2026-06-15',
    content: 'Mayor announces comprehensive road repair initiative covering 15 wards. Phase 1 to begin next week.',
  },
  {
    id: 4,
    title: 'Healthcare Camp in Ward 150',
    source: 'facebook',
    date: '2026-06-10',
    content: 'Free health checkup camp to be held on June 30th at Primary Health Center. All residents welcome.',
  },
  {
    id: 5,
    title: 'Election Commission Guidelines Released',
    source: 'youtube',
    date: '2026-06-08',
    content: 'Election Commission releases new guidelines for upcoming ward elections. Focus on transparency and voter verification.',
  },
  {
    id: 6,
    title: 'Sanitation Drive Success',
    source: 'twitter',
    date: '2026-06-05',
    content: 'Ward sanitation drive achieves 85% participation rate. Next phase to focus on drainage improvement.',
  },
];

const PrajaaVartePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { mode } = useThemeStore();
  const isDark = mode === 'dark';

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'facebook' | 'youtube' | 'twitter'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const navItems = [
    { label: 'Aspirant+', icon: <HomeRoundedIcon />, path: '/portal' },
    { label: 'Prajaalytics', icon: <ShowChartIcon />, path: '/portal/prajaalytics' },
    { label: 'Prajaa Varte', icon: <NewsletterIcon />, path: '/portal/prajaa-varte' },
    { label: 'Disavow', icon: <LinkOffIcon />, path: '/portal/disavow' },
  ];

  const currentNavIndex = navItems.findIndex((item) =>
    item.path === '/portal/prajaa-varte'
      ? location.pathname === '/portal/prajaa-varte'
      : location.pathname.startsWith(item.path)
  );

  const filteredNews = DEMO_NEWS.filter(news => {
    const matchesFilter = selectedFilter === 'all' || news.source === selectedFilter;
    const newsYear = news.date.split('-')[0];
    const matchesYear = !selectedYear || newsYear === selectedYear;
    const newsMonth = news.date.split('-')[1];
    const matchesMonth = !selectedMonth || newsMonth === selectedMonth;
    const newsDay = news.date.split('-')[2];
    const matchesDate = !selectedDate || newsDay === selectedDate;
    return matchesFilter && matchesYear && matchesMonth && matchesDate;
  });

  const currentNews = filteredNews[currentNewsIndex] || filteredNews[0];

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'facebook': return <FacebookIcon sx={{ fontSize: 20 }} />;
      case 'youtube': return <YouTubeIcon sx={{ fontSize: 20 }} />;
      case 'twitter': return <TwitterIcon sx={{ fontSize: 20 }} />;
      default: return null;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'facebook': return '#1877F2';
      case 'youtube': return '#FF0000';
      case 'twitter': return '#000000';
      default: return BRAND.yellow;
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

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
      <Container maxWidth="xl" sx={{ pt: 3, pb: 4 }}>
        {/* Page Title */}
        <Box sx={{ mb: 3, pl: { xs: 2, sm: 4, md: 6 } }}>
          <Typography variant="h3" sx={{
            fontFamily: '"Heming", "Geist Variable", "Geist", sans-serif',
            fontWeight: 900,
            color: '#111827',
            letterSpacing: '-0.025em',
            fontSize: { xs: '1.8rem', md: '2.2rem' },
          }}>
            Prajaa Varte
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', mt: 1 }}>
            News, announcements, and updates from across the platform
          </Typography>
        </Box>

        {/* Filter Section */}
        <Paper sx={{
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: '12px',
          p: 3,
          mb: 3
        }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Source Filters */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#374151', mb: 1.5 }}>
                Filter by Source
              </Typography>
              <ButtonGroup variant="outlined" sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                <Button
                  onClick={() => setSelectedFilter('all')}
                  sx={{
                    fontFamily: FF_HEADING,
                    fontWeight: 700,
                    textTransform: 'none',
                    bgcolor: selectedFilter === 'all' ? BRAND.red : 'transparent',
                    color: selectedFilter === 'all' ? '#fff' : '#6B7280',
                    borderColor: selectedFilter === 'all' ? BRAND.red : 'rgba(0,0,0,0.12)',
                    '&:hover': {
                      bgcolor: selectedFilter === 'all' ? BRAND.red2 : 'rgba(200,24,10,0.05)',
                    }
                  }}
                >
                  All
                </Button>
                <Button
                  onClick={() => setSelectedFilter('facebook')}
                  startIcon={<FacebookIcon />}
                  sx={{
                    fontFamily: FF_HEADING,
                    fontWeight: 700,
                    textTransform: 'none',
                    bgcolor: selectedFilter === 'facebook' ? '#1877F2' : 'transparent',
                    color: selectedFilter === 'facebook' ? '#fff' : '#6B7280',
                    borderColor: selectedFilter === 'facebook' ? '#1877F2' : 'rgba(0,0,0,0.12)',
                    '&:hover': {
                      bgcolor: selectedFilter === 'facebook' ? '#166FE5' : 'rgba(24,119,242,0.05)',
                    }
                  }}
                >
                  Facebook
                </Button>
                <Button
                  onClick={() => setSelectedFilter('youtube')}
                  startIcon={<YouTubeIcon />}
                  sx={{
                    fontFamily: FF_HEADING,
                    fontWeight: 700,
                    textTransform: 'none',
                    bgcolor: selectedFilter === 'youtube' ? '#FF0000' : 'transparent',
                    color: selectedFilter === 'youtube' ? '#fff' : '#6B7280',
                    borderColor: selectedFilter === 'youtube' ? '#FF0000' : 'rgba(0,0,0,0.12)',
                    '&:hover': {
                      bgcolor: selectedFilter === 'youtube' ? '#CC0000' : 'rgba(255,0,0,0.05)',
                    }
                  }}
                >
                  YouTube
                </Button>
                <Button
                  onClick={() => setSelectedFilter('twitter')}
                  startIcon={<TwitterIcon />}
                  sx={{
                    fontFamily: FF_HEADING,
                    fontWeight: 700,
                    textTransform: 'none',
                    bgcolor: selectedFilter === 'twitter' ? '#000' : 'transparent',
                    color: selectedFilter === 'twitter' ? '#fff' : '#6B7280',
                    borderColor: selectedFilter === 'twitter' ? '#000' : 'rgba(0,0,0,0.12)',
                    '&:hover': {
                      bgcolor: selectedFilter === 'twitter' ? '#333' : 'rgba(0,0,0,0.05)',
                    }
                  }}
                >
                  Twitter/X
                </Button>
              </ButtonGroup>
            </Box>

            {/* Date Filters */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#374151', mb: 1.5 }}>
                Filter by Date
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarMonthIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(0,0,0,0.12)',
                      backgroundColor: 'transparent',
                      fontFamily: FF_HEADING,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </Box>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(0,0,0,0.12)',
                    backgroundColor: 'transparent',
                    fontFamily: FF_HEADING,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Month</option>
                  {months.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(0,0,0,0.12)',
                    backgroundColor: 'transparent',
                    fontFamily: FF_HEADING,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Year</option>
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                {(selectedDate || selectedMonth || selectedYear) && (
                  <Button
                    size="small"
                    onClick={() => {
                      setSelectedDate('');
                      setSelectedMonth('');
                      setSelectedYear(new Date().getFullYear().toString());
                    }}
                    sx={{
                      fontFamily: FF_HEADING,
                      fontWeight: 700,
                      color: BRAND.red,
                      textTransform: 'none',
                      '&:hover': { bgcolor: 'rgba(200,24,10,0.05)' }
                    }}
                  >
                    Clear
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* News Display - Projector Style */}
        <Paper sx={{
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: '16px',
          overflow: 'hidden',
          mb: 3
        }}>
          <Grid container>
            {/* Left Side - Projector */}
            <Grid item xs={12} md={5} sx={{
              bgcolor: '#1a1a1a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              position: 'relative',
              minHeight: { xs: 300, md: 450 }
            }}>
              {/* Projector Body */}
              <Box sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                {/* Projector Lens */}
                <Box sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  bgcolor: 'linear-gradient(135deg, #333 0%, #1a1a1a 100%)',
                  border: '4px solid #444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(255,255,255,0.1), inset 0 0 20px rgba(0,0,0,0.5)',
                  mb: 2
                }}>
                  <Box sx={{
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    bgcolor: '#000',
                    border: '3px solid #555',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 0 30px rgba(200,24,10,0.3)',
                  }}>
                    <Box sx={{
                      width: 70,
                      height: 70,
                      borderRadius: '50%',
                      bgcolor: currentNews ? getSourceColor(currentNews.source) : '#333',
                      opacity: 0.8,
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.6, transform: 'scale(0.98)' },
                        '50%': { opacity: 0.9, transform: 'scale(1)' }
                      }
                    }} />
                  </Box>
                </Box>

                {/* Projector Controls */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: '#333',
                    border: '2px solid #555',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#444' }
                  }}>
                    <Box sx={{ width: 0, height: 0, borderLeft: '8px solid #22c55e', borderTop: '6px solid transparent', borderBottom: '6px solid transparent' }} />
                  </Box>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: '#333',
                    border: '2px solid #555',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#444' }
                  }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: '#f59e0b', borderRadius: '2px' }} />
                  </Box>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: '#333',
                    border: '2px solid #555',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#444' }
                  }}>
                    <Box sx={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '10px solid #ef4444' }} />
                  </Box>
                </Box>

                {/* Film Reels */}
                <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
                  <Box sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    bgcolor: '#222',
                    border: '3px solid #444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: currentNews ? 'spin 4s linear infinite' : 'none',
                    '@keyframes spin': {
                      'from': { transform: 'rotate(0deg)' },
                      'to': { transform: { xs: 'rotate(360deg)' } }
                    }
                  }}>
                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#111' }} />
                  </Box>
                  <Box sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    bgcolor: '#222',
                    border: '3px solid #444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: currentNews ? 'spin 4s linear infinite reverse' : 'none',
                  }}>
                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#111' }} />
                  </Box>
                </Box>
              </Box>

              {/* Status Light */}
              <Box sx={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Box sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: '#22c55e',
                  boxShadow: '0 0 8px #22c55e',
                  animation: 'blink 1s infinite',
                  '@keyframes blink': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 }
                  }
                }} />
                <Typography sx={{ fontFamily: FF_HEADING, fontSize: '10px', fontWeight: 700, color: '#22c55e' }}>
                  LIVE
                </Typography>
              </Box>
            </Grid>

            {/* Right Side - News Content */}
            <Grid item xs={12} md={7} sx={{ p: 4 }}>
              {currentNews ? (
                <Box>
                  {/* Source Badge */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      icon={getSourceIcon(currentNews.source)}
                      label={currentNews.source.charAt(0).toUpperCase() + currentNews.source.slice(1)}
                      size="small"
                      sx={{
                        fontFamily: FF_HEADING,
                        fontWeight: 700,
                        bgcolor: getSourceColor(currentNews.source),
                        color: '#fff',
                        '& .MuiChip-icon': { color: '#fff' }
                      }}
                    />
                    <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarMonthIcon sx={{ fontSize: 14 }} />
                      {new Date(currentNews.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>
                  </Box>

                  {/* Title */}
                  <Typography variant="h4" sx={{
                    fontFamily: FF_HEADING,
                    fontWeight: 800,
                    color: '#111827',
                    mb: 2,
                    lineHeight: 1.3
                  }}>
                    {currentNews.title}
                  </Typography>

                  {/* Content */}
                  <Typography variant="body1" sx={{
                    color: '#4B5563',
                    lineHeight: 1.8,
                    mb: 3
                  }}>
                    {currentNews.content}
                  </Typography>

                  {/* Navigation */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 2, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setCurrentNewsIndex(prev => prev > 0 ? prev - 1 : filteredNews.length - 1)}
                      disabled={filteredNews.length <= 1}
                      sx={{
                        fontFamily: FF_HEADING,
                        fontWeight: 700,
                        textTransform: 'none',
                        borderColor: BRAND.red,
                        color: BRAND.red,
                        '&:hover': {
                          borderColor: BRAND.red,
                          bgcolor: 'rgba(200,24,10,0.05)'
                        }
                      }}
                    >
                      Previous
                    </Button>
                    <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>
                      {currentNewsIndex + 1} / {filteredNews.length}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setCurrentNewsIndex(prev => prev < filteredNews.length - 1 ? prev + 1 : 0)}
                      disabled={filteredNews.length <= 1}
                      sx={{
                        fontFamily: FF_HEADING,
                        fontWeight: 700,
                        textTransform: 'none',
                        borderColor: BRAND.red,
                        color: BRAND.red,
                        '&:hover': {
                          borderColor: BRAND.red,
                          bgcolor: 'rgba(200,24,10,0.05)'
                        }
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', py: 8 }}>
                  <NewsletterIcon sx={{ fontSize: 64, color: '#D1D5DB', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>
                    No news found
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9CA3AF', textAlign: 'center' }}>
                    Try adjusting your filters to see more results
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* All News List */}
        <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 2 }}>
          All News & Announcements
        </Typography>
        <Grid container spacing={2}>
          {filteredNews.map((news, idx) => (
            <Grid item xs={12} sm={6} md={4} key={news.id}>
              <Paper
                sx={{
                  p: 2.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: idx === currentNewsIndex ? '2px solid' : '1px solid rgba(0,0,0,0.06)',
                  borderColor: idx === currentNewsIndex ? BRAND.red : 'rgba(0,0,0,0.06)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    borderColor: BRAND.red
                  }
                }}
                onClick={() => setCurrentNewsIndex(idx)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Chip
                    icon={getSourceIcon(news.source)}
                    label={news.source.charAt(0).toUpperCase() + news.source.slice(1)}
                    size="small"
                    sx={{
                      fontFamily: FF_HEADING,
                      fontWeight: 700,
                      fontSize: '10px',
                      bgcolor: getSourceColor(news.source),
                      color: '#fff',
                      '& .MuiChip-icon': { color: '#fff', fontSize: 14 }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                    {new Date(news.date).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{
                  fontFamily: FF_HEADING,
                  fontWeight: 700,
                  color: '#111827',
                  mb: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {news.title}
                </Typography>
                <Typography variant="body2" sx={{
                  color: '#6B7280',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {news.content}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default PrajaaVartePage;