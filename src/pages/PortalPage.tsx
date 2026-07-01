import React, { useState } from 'react';
import {
  Box, Container, Grid, Typography, Card, CardContent, IconButton,
  Avatar, TextField, Button, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Tooltip, Divider, Paper, Badge, Stack, useTheme, AppBar, Toolbar, BottomNavigation, BottomNavigationAction
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/X';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CloseIcon from '@mui/icons-material/Close';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ForumIcon from '@mui/icons-material/ForumRounded';
import BarChartIcon from '@mui/icons-material/BarChart';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import NewsletterIcon from '@mui/icons-material/Markunread';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GavelIcon from '@mui/icons-material/Gavel';
import WarningIcon from '@mui/icons-material/Warning';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PersonGroupIcon from '@mui/icons-material/Group';
import { BRAND } from '../theme';
import prajakeeyaLogo from '../assets/images/prajakeeya.webp';
import LanguageSelector from '../components/LanguageSelector';
import useThemeStore from '../store/useThemeStore';

interface Star {
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
}

interface AspirantProfile {
  id: number;
  name: string;
  party: string;
  constituency: string;
  wardNumber: string;
  selfieUrl: string;
  verified: boolean;
  rating: number;
  meetingsHeld: number;
  issuesAddressed: number;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    whatsapp?: string;
  };
  officeAddress: string;
  subordinateOfficeAddress: string;
  phone1: string;
  phone2: string;
  education: string;
  familyPoliticalConnection: boolean;
  familyGovtOfficialConnection: boolean;
  electionAffidavitUrl: string;
  manifesto: string;
}

const PORTAL_ASPIRANTS: AspirantProfile[] = [
  {
    id: 1,
    name: 'Ramesh Kumar',
    party: 'Janata Dal (Secular)',
    constituency: 'Bangalore South',
    wardNumber: '150',
    selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    verified: true,
    rating: 4.2,
    meetingsHeld: 28,
    issuesAddressed: 45,
    socialMedia: {
      instagram: 'https://instagram.com/ramesh_ward150',
      facebook: 'https://facebook.com/rameshkumar.ward150',
      twitter: 'https://twitter.com/ramesh_ward150',
      whatsapp: '+91 98765 43210'
    },
    officeAddress: 'Ward 150 Office, MG Road, Bangalore',
    subordinateOfficeAddress: 'Zone 5 Sub-Office, Koramangala',
    phone1: '+91 98765 43210',
    phone2: '+91 80 12345 678',
    education: 'MBA in Public Policy, IIM Bangalore',
    familyPoliticalConnection: true,
    familyGovtOfficialConnection: false,
    electionAffidavitUrl: '#',
    manifesto: 'Focus on water conservation, road infrastructure, and transparent budgeting.'
  },
  {
    id: 2,
    name: 'Dr. Sunitha Rao',
    party: 'Bharatiya Janata Party',
    constituency: 'Bangalore South',
    wardNumber: '150',
    selfieUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    verified: true,
    rating: 4.5,
    meetingsHeld: 35,
    issuesAddressed: 62,
    socialMedia: {
      instagram: 'https://instagram.com/dr_sunitha_health',
      facebook: 'https://facebook.com/dr.sunitha.rao',
      linkedin: 'https://linkedin.com/in/sunitha-rao',
      twitter: 'https://twitter.com/dr_sunitha',
      whatsapp: '+91 91234 56789'
    },
    officeAddress: 'Ward 150 Health Center, Residency Road',
    subordinateOfficeAddress: 'City Medical Office, Vidhana Soudha',
    phone1: '+91 91234 56789',
    phone2: '+91 80 23456 789',
    education: 'MBBS, MD in Public Health, Bangalore Medical College',
    familyPoliticalConnection: false,
    familyGovtOfficialConnection: true,
    electionAffidavitUrl: '#',
    manifesto: 'Healthcare access, sanitation improvements, and elderly care programs.'
  },
  {
    id: 3,
    name: 'Anand Krishnamurthy',
    party: 'Indian National Congress',
    constituency: 'Bangalore South',
    wardNumber: '149',
    selfieUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    verified: true,
    rating: 3.9,
    meetingsHeld: 22,
    issuesAddressed: 38,
    socialMedia: {
      instagram: 'https://instagram.com/anand_ward149',
      facebook: 'https://facebook.com/anand.krishnamurthy',
      whatsapp: '+91 99887 76655'
    },
    officeAddress: 'Ward 149 Community Hall, Indiranagar',
    subordinateOfficeAddress: 'East Zone Office, HAL',
    phone1: '+91 99887 76655',
    phone2: '+91 80 34567 890',
    education: 'B.Tech, IIT Delhi; MPA, Harvard Kennedy School',
    familyPoliticalConnection: true,
    familyGovtOfficialConnection: true,
    electionAffidavitUrl: '#',
    manifesto: 'Technology-driven governance, youth employment, and smart city initiatives.'
  },
  {
    id: 4,
    name: 'Priya Sharma',
    party: 'Aam Aadmi Party',
    constituency: 'Bangalore North',
    wardNumber: '125',
    selfieUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    verified: true,
    rating: 4.7,
    meetingsHeld: 42,
    issuesAddressed: 71,
    socialMedia: {
      instagram: 'https://instagram.com/priya_ward125',
      facebook: 'https://facebook.com/priya.sharma.ward125',
      linkedin: 'https://linkedin.com/in/priya-sharma-ward125',
      twitter: 'https://twitter.com/priya_ward125',
      whatsapp: '+91 98765 12345'
    },
    officeAddress: 'Ward 125 Office, Rajaji Nagar',
    subordinateOfficeAddress: 'West Zone Office, Malleswaram',
    phone1: '+91 98765 12345',
    phone2: '+91 80 45678 901',
    education: 'MA in Development Economics, JNU; LLM, National Law School',
    familyPoliticalConnection: false,
    familyGovtOfficialConnection: false,
    electionAffidavitUrl: '#',
    manifesto: 'Education reform, women safety, and environmental sustainability.'
  },
  {
    id: 5,
    name: 'M. Venkatesh',
    party: 'Independent',
    constituency: 'Bangalore Central',
    wardNumber: '178',
    selfieUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    verified: false,
    rating: 3.6,
    meetingsHeld: 15,
    issuesAddressed: 24,
    socialMedia: {
      facebook: 'https://facebook.com/venkatesh.independent',
      whatsapp: '+91 97654 32109'
    },
    officeAddress: 'Ward 178 Meeting Point, Jayanagar',
    subordinateOfficeAddress: 'South Zone Office, BTM Layout',
    phone1: '+91 97654 32109',
    phone2: '+91 80 56789 012',
    education: 'B.Com; Active community volunteer for 15 years',
    familyPoliticalConnection: false,
    familyGovtOfficialConnection: false,
    electionAffidavitUrl: '#',
    manifesto: 'Grassroots democracy, local business support, and waste management.'
  },
  {
    id: 6,
    name: 'Kavita Reddy',
    party: 'Janata Dal (Secular)',
    constituency: 'Bangalore East',
    wardNumber: '201',
    selfieUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    verified: true,
    rating: 4.1,
    meetingsHeld: 31,
    issuesAddressed: 52,
    socialMedia: {
      instagram: 'https://instagram.com/kavita_reddy_ward201',
      linkedin: 'https://linkedin.com/in/kavita-reddy-ward201',
      twitter: 'https://twitter.com/kavita_reddy201',
      whatsapp: '+91 96543 21098'
    },
    officeAddress: 'Ward 201 Civic Center, Whitefield',
    subordinateOfficeAddress: 'East Zone Office, Marathahalli',
    phone1: '+91 96543 21098',
    phone2: '+91 80 67890 123',
    education: 'B.E. in Civil Engineering; MPA, TISS',
    familyPoliticalConnection: true,
    familyGovtOfficialConnection: true,
    electionAffidavitUrl: '#',
    manifesto: 'Infrastructure development, IT sector liaison, and affordable housing.'
  }
];

const PortalPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { mode } = useThemeStore();
  const isDark = mode === 'dark';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAspirant, setSelectedAspirant] = useState<AspirantProfile | null>(null);

  const GOLD = BRAND.yellow;
  const textHigh = '#4B5563';
  const BORDER = 'rgba(239, 68, 68, 0.2)';
  const FF_HEADING = "'Heming', 'Geist Variable', 'Geist', sans-serif";
  const subtleText = isDark ? 'rgba(255,255,255,0.52)' : 'rgba(17,24,39,0.45)';

  const navItems = [
    { label: 'Aspirant+', icon: <HomeRoundedIcon />, path: '/portal' },
    { label: 'Prajaalytics', icon: <ShowChartIcon />, path: '/portal/prajaalytics' },
    { label: 'Prajaa Varte', icon: <NewsletterIcon />, path: '/portal/prajaa-varte' },
    { label: 'Disavow', icon: <LinkOffIcon />, path: '/portal/disavow' },
  ];

  const currentNavIndex = navItems.findIndex((item) =>
    item.path === '/portal'
      ? location.pathname === '/portal'
      : location.pathname.startsWith(item.path)
  );

  const filteredAspirants = PORTAL_ASPIRANTS.filter(aspirant =>
    aspirant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    aspirant.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
    aspirant.constituency.toLowerCase().includes(searchQuery.toLowerCase()) ||
    aspirant.wardNumber.includes(searchQuery)
  );

  const handleAspirantClick = (aspirant: AspirantProfile) => {
    setSelectedAspirant(aspirant);
  };

  const handleCloseDialog = () => {
    setSelectedAspirant(null);
  };

  const renderSocialMediaIcon = (platform: string, url: string | undefined, color: string) => {
    if (!url) return null;

    const iconMap: Record<string, React.ReactNode> = {
      instagram: <InstagramIcon />,
      facebook: <FacebookIcon />,
      linkedin: <LinkedInIcon />,
      twitter: <TwitterIcon />,
      whatsapp: <WhatsAppIcon />
    };

    return (
      <Tooltip title={platform}>
        <IconButton
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: color,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          {iconMap[platform]}
        </IconButton>
      </Tooltip>
    );
  };

return (
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Guest Layout Header */}
      <AppBar position="sticky" elevation={0} sx={{
        background: isDark
          ? 'rgba(13,15,18,0.72)'
          : 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(24px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
        color: isDark ? 'white' : 'text.primary',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,24,10,0.06)'}`,
        boxShadow: isDark
          ? '0 4px 24px -4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)'
          : '0 4px 24px -4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.7)',
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
                <Typography sx={{ fontFamily: FF_HEADING, fontWeight: 800, lineHeight: 1.05, color: isDark ? '#fff' : 'text.primary', fontSize: { sm: '1rem', md: '1.08rem' } }}>
                  Prajaaakeeya
                </Typography>
                <Typography sx={{ fontFamily: FF_HEADING, fontSize: '0.73rem', letterSpacing: '.06em', textTransform: 'uppercase', color: subtleText }}>
                  GUEST
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, sm: 1.5 } }}>
              <IconButton onClick={() => {}} size="small"
                sx={{ width: 36, height: 36, color: isDark ? BRAND.yellow : BRAND.saffron }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              </IconButton>

              <LanguageSelector sx={{ minWidth: 64, px: 1, fontFamily: FF_HEADING, fontWeight: 800, fontSize: '0.9rem', color: isDark ? BRAND.yellow : BRAND.saffron }} />

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
              background: isDark
                ? 'rgba(255,255,255,0.02)'
                : 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(200,24,10,0.06)'}`,
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
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.32s cubic-bezier(.4,0,.2,1)',
                      color: active
                        ? '#fff'
                        : (isDark ? 'rgba(255,255,255,0.68)' : 'rgba(17,24,39,0.62)'),
                      background: active
                        ? 'linear-gradient(135deg, rgba(200,24,10,0.88) 0%, rgba(245,168,0,0.75) 100%)'
                        : 'transparent',
                      backdropFilter: active ? 'blur(16px)' : 'none',
                      WebkitBackdropFilter: active ? 'blur(16px)' : 'none',
                      border: active
                        ? `1px solid rgba(200,24,10,0.25)` 
                        : '1px solid transparent',
                      boxShadow: active
                        ? '0 4px 20px -4px rgba(200,24,10,0.3), inset 0 1px 0 rgba(255,255,255,0.5)'
                        : 'none',
                      '& .MuiButton-startIcon': {
                        mr: 0.6,
                        transition: 'transform 0.3s ease',
                      },
                      '&:hover': active
                        ? {
                            boxShadow: '0 6px 28px -4px rgba(200,24,10,0.4), inset 0 1px 0 rgba(255,255,255,0.6)',
                            transform: 'translateY(-1px)',
                          }
                        : {
                            background: 'rgba(200,24,10,0.04)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: `1px solid rgba(200,24,10,0.08)`,
                            color: 'rgba(17,24,39,0.85)',
                            '& .MuiButton-startIcon': {
                              transform: 'scale(1.1)',
                            },
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
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Container maxWidth="xl" sx={{ pt: 2, pb: 2 }}>
          {/* Prajaa Prapancha Page Title */}
          <Box sx={{ 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            pl: { xs: 2, sm: 4, md: 6 }
          }}>
            <Typography variant="h3" sx={{
              fontFamily: '"Heming", "Geist Variable", "Geist", sans-serif',
              fontWeight: 900,
              color: '#111827',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
            }}>
              Welcome to,
            </Typography>
            <Typography variant="h3" sx={{
              fontFamily: '"Heming", "Geist Variable", "Geist", sans-serif',
              fontWeight: 900,
              color: BRAND.yellow,
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              fontSize: { xs: '1.8rem', md: '2.5rem' },
            }}>
              Prajaa Prapancha
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Tooltip title="Back to Home">
              <IconButton
                onClick={() => navigate('/')}
                sx={{
                  color: '#fff',
                  bgcolor: BRAND.red,
                  border: '1px solid rgba(200, 24, 10, 0.3)',
                  '&:hover': {
                    bgcolor: BRAND.red2,
                    borderColor: BRAND.red2
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: '#111827',
                letterSpacing: '-0.02em',
                flex: 1
              }}
            >
              Aspirant Portal
            </Typography>
          </Box>

          {/* Leader Section */}
          <Paper
            sx={{
              bgcolor: 'rgba(34, 197, 94, 0.06)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '12px',
              p: 3,
              mb: 4
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{
                width: 12,
                height: 12,
                bgcolor: '#22c55e',
                borderRadius: '50%',
                animation: 'pulse 2s infinite ease-in-out',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.5, transform: 'scale(1.2)' }
                }
              }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Leader Dashboard
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: '8px',
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <Avatar
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    sx={{
                      width: 56,
                      height: 56,
                      border: `2px solid ${BRAND.yellow}`,
                      boxShadow: '0 4px 12px rgba(245, 168, 0, 0.3)'
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827', mb: 0.25 }}>
                      Current Leader
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: BRAND.yellow }}>
                      Ramesh Kumar
                    </Typography>
                    <Typography variant="caption" sx={{ color: textHigh, display: 'block' }}>
                      Ward 150 • Janata Dal (Secular)
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: '8px',
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <Avatar
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80"
                    sx={{
                      width: 56,
                      height: 56,
                      border: `2px solid ${BRAND.red}`,
                      opacity: 0.7
                    }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827', mb: 0.25 }}>
                      Standby Leader
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: BRAND.red }}>
                      Dr. Sunitha Rao
                    </Typography>
                    <Typography variant="caption" sx={{ color: textHigh, display: 'block' }}>
                      Ward 150 • Bharatiya Janata Party
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Search Bar */}
          <Paper
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '12px',
              px: 2,
              py: 1,
              mb: 4
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon sx={{ color: '#9CA3AF' }} />
              <TextField
                placeholder="Search by name, party, constituency, or ward..."
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="standard"
                sx={{
                  '& .MuiInputBase-root': {
                    color: '#111827',
                    height: '40px'
                  },
                  '& .MuiInput-underline:before': {
                    borderBottom: '1px solid rgba(0,0,0,0.1)'
                  },
                  '& .MuiInput-underline:hover:before': {
                    borderBottom: '1px solid rgba(0,0,0,0.2)'
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: BRAND.red
                  }
                }}
              />
            </Box>
          </Paper>

          {/* Quick Access Tiles */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              {/* Aspirants */}
              <Grid size={{ xs: 6, md: 3 }}>
                <Paper
                  onClick={() => navigate('/guest/aspirants')}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.9)',
                    border: `1px solid ${BRAND.red}20`,
                    borderRadius: '12px',
                    p: 2.5,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: BRAND.red,
                      boxShadow: `0 8px 24px ${BRAND.red}15`
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ p: 1, bgcolor: `${BRAND.red}10`, borderRadius: 2 }}>
                      <GroupIcon sx={{ color: BRAND.red, fontSize: 24 }} />
                    </Box>
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', mb: 0.5 }}>
                    Aspirants
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280' }}>
                    View all aspirants
                  </Typography>
                </Paper>
              </Grid>

              {/* Public Issues */}
              <Grid size={{ xs: 6, md: 3 }}>
                <Paper
                  onClick={() => navigate('/guest/civic-issues')}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.9)',
                    border: `1px solid ${BRAND.yellow}20`,
                    borderRadius: '12px',
                    p: 2.5,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: BRAND.yellow,
                      boxShadow: `0 8px 24px ${BRAND.yellow}15`
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ p: 1, bgcolor: `${BRAND.yellow}10`, borderRadius: 2 }}>
                      <WarningIcon sx={{ color: BRAND.yellow, fontSize: 24 }} />
                    </Box>
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', mb: 0.5 }}>
                    Public Issues
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280' }}>
                    Report civic problems
                  </Typography>
                </Paper>
              </Grid>

              {/* SOP */}
              <Grid size={{ xs: 6, md: 3 }}>
                <Paper
                  onClick={() => navigate('/guest/sop')}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.9)',
                    border: `1px solid ${BRAND.red}20`,
                    borderRadius: '12px',
                    p: 2.5,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: BRAND.red,
                      boxShadow: `0 8px 24px ${BRAND.red}15`
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ p: 1, bgcolor: `${BRAND.red}10`, borderRadius: 2 }}>
                      <DescriptionIcon sx={{ color: BRAND.red, fontSize: 24 }} />
                    </Box>
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', mb: 0.5 }}>
                    SOP
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280' }}>
                    System operation guide
                  </Typography>
                </Paper>
              </Grid>

              {/* Registered Aspirants */}
              <Grid size={{ xs: 6, md: 3 }}>
                <Paper
                  onClick={() => navigate('/guest/registered-aspirants')}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.9)',
                    border: `1px solid ${BRAND.yellow}20`,
                    borderRadius: '12px',
                    p: 2.5,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: BRAND.yellow,
                      boxShadow: `0 8px 24px ${BRAND.yellow}15`
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ p: 1, bgcolor: `${BRAND.yellow}10`, borderRadius: 2 }}>
                      <HowToVoteIcon sx={{ color: BRAND.yellow, fontSize: 24 }} />
                    </Box>
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#111827', mb: 0.5 }}>
                    Registered
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280' }}>
                    View registered aspirants
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Aspirant Grid */}
          <Grid container spacing={2.5}>
            {filteredAspirants.map((aspirant) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={aspirant.id}>
                <Card
                  onClick={() => handleAspirantClick(aspirant)}
                  sx={{
                    background: '#FFFFFF',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 6px 20px rgba(17, 24, 39, 0.04)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: BRAND.red,
                      boxShadow: '0 12px 40px rgba(200, 24, 10, 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          aspirant.verified && (
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                bgcolor: BRAND.yellow,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #fff'
                              }}
                            >
                              <VerifiedIcon sx={{ fontSize: 12, color: '#120C1C' }} />
                            </Box>
                          )
                        }
                      >
                        <Avatar
                          src={aspirant.selfieUrl}
                          sx={{
                            width: 64,
                            height: 64,
                            border: `2px solid ${BRAND.red}`,
                            boxShadow: '0 4px 12px rgba(200, 24, 10, 0.2)'
                          }}
                        />
                      </Badge>

                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            color: '#111827',
                            mb: 0.25
                          }}
                        >
                          {aspirant.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: BRAND.yellow,
                            fontWeight: 700,
                            display: 'block'
                          }}
                        >
                          {aspirant.party}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#6B7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mt: 0.25
                          }}
                        >
                          <LocationOnIcon sx={{ fontSize: 12 }} />
                          Ward {aspirant.wardNumber} • {aspirant.constituency}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Quick Stats */}
                    <Divider sx={{ my: 1.5, borderColor: 'rgba(0,0,0,0.06)' }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <ThumbUpIcon sx={{ fontSize: 18, color: BRAND.yellow }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
                          {aspirant.rating}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <MeetingRoomIcon sx={{ fontSize: 18, color: BRAND.red }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
                          {aspirant.meetingsHeld}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <TrendingUpIcon sx={{ fontSize: 18, color: BRAND.yellow }} />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
                          {aspirant.issuesAddressed}
                        </Typography>
                      </Box>
                    </Box>

                    {/* View Profile Button */}
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{
                        mt: 2,
                        borderColor: BRAND.yellow,
                        color: BRAND.yellow,
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: '8px',
                        py: 1,
                        '&:hover': {
                          borderColor: BRAND.yellow,
                          bgcolor: 'rgba(245, 168, 0, 0.05)'
                        }
                      }}
                    >
                      View Full Profile
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredAspirants.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ color: '#9CA3AF' }}>
                No aspirants found matching your search
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Aspirant Detail Dialog */}
      <Dialog
        open={!!selectedAspirant}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        slotProps={{
          backdrop: {
            style: { backdropFilter: 'blur(12px)', backgroundColor: 'rgba(248, 250, 252, 0.85)' }
          },
          paper: {
            style: {
              backgroundColor: '#FFFFFF',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              color: '#111827',
              maxHeight: '90vh',
              overflow: 'hidden'
            }
          }
        }}
      >
        {selectedAspirant && (
          <>
            {/* Dialog Header */}
            <DialogTitle
              sx={{
                bgcolor: 'rgba(200, 24, 10, 0.05)',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                pb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    selectedAspirant.verified && (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: BRAND.yellow,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid #fff'
                        }}
                      >
                        <VerifiedIcon sx={{ fontSize: 14, color: '#120C1C' }} />
                      </Box>
                    )
                  }
                >
                  <Avatar
                    src={selectedAspirant.selfieUrl}
                    sx={{
                      width: 72,
                      height: 72,
                      border: `3px solid ${BRAND.red}`,
                      boxShadow: '0 4px 16px rgba(200, 24, 10, 0.2)'
                    }}
                  />
                </Badge>

                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', mb: 0.5 }}>
                    {selectedAspirant.name}
                  </Typography>
                  <Chip
                    label={selectedAspirant.party}
                    sx={{
                      bgcolor: 'rgba(245, 168, 0, 0.1)',
                      color: BRAND.yellow,
                      fontWeight: 700,
                      border: '1px solid rgba(245, 168, 0, 0.3)'
                    }}
                  />
                </Box>
              </Box>

              <IconButton
                onClick={handleCloseDialog}
                sx={{
                  color: '#9CA3AF',
                  '&:hover': { color: '#111827', bgcolor: 'rgba(0,0,0,0.05)' }
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: 'rgba(0,0,0,0.06)', p: 3 }}>
              {/* Constituency Info */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon sx={{ color: BRAND.yellow }} />
                  <Typography variant="body2" sx={{ color: '#111827' }}>
                    <strong>Ward:</strong> {selectedAspirant.wardNumber}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon sx={{ color: BRAND.yellow }} />
                  <Typography variant="body2" sx={{ color: '#111827' }}>
                    <strong>Constituency:</strong> {selectedAspirant.constituency}
                  </Typography>
                </Box>
              </Box>

              {/* Social Media Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: BRAND.yellow }}>
                  Social Media
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {renderSocialMediaIcon('Instagram', selectedAspirant.socialMedia.instagram, '#E4405F')}
                  {renderSocialMediaIcon('Facebook', selectedAspirant.socialMedia.facebook, '#1877F2')}
                  {renderSocialMediaIcon('LinkedIn', selectedAspirant.socialMedia.linkedin, '#0A66C2')}
                  {renderSocialMediaIcon('Twitter/X', selectedAspirant.socialMedia.twitter, '#111827')}
                  {renderSocialMediaIcon('WhatsApp', selectedAspirant.socialMedia.whatsapp, '#25D366')}
                </Box>
              </Box>

              <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.06)' }} />

              {/* Office Details */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: BRAND.yellow }}>
                  Office Details
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
                  <Paper
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.02)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: '8px',
                      p: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOnIcon sx={{ color: BRAND.red, fontSize: 18 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Main Office
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                      {selectedAspirant.officeAddress}
                    </Typography>
                  </Paper>

                  <Paper
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      p: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocationOnIcon sx={{ color: BRAND.red, fontSize: 18 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Subordinate Office
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                      {selectedAspirant.subordinateOfficeAddress}
                    </Typography>
                  </Paper>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Paper
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      p: 2,
                      flex: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <PhoneIcon sx={{ color: BRAND.yellow, fontSize: 16 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Phone 1
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                      {selectedAspirant.phone1}
                    </Typography>
                  </Paper>

                  <Paper
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      p: 2,
                      flex: 1
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <PhoneIcon sx={{ color: BRAND.yellow, fontSize: 16 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Phone 2
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                      {selectedAspirant.phone2}
                    </Typography>
                  </Paper>
                </Box>
              </Box>

              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

              {/* Progress Card */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: BRAND.yellow }}>
                  Progress Card
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 4 }}>
                    <Paper
                      sx={{
                        bgcolor: 'rgba(200, 24, 10, 0.1)',
                        border: `1px solid ${BRAND.red}`,
                        borderRadius: '8px',
                        p: 2,
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 900, color: BRAND.red, mb: 0.5 }}>
                        {selectedAspirant.rating}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                        Voter Rating
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 4 }}>
                    <Paper
                      sx={{
                        bgcolor: 'rgba(245, 168, 0, 0.1)',
                        border: `1px solid ${BRAND.yellow}`,
                        borderRadius: '8px',
                        p: 2,
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 900, color: BRAND.yellow, mb: 0.5 }}>
                        {selectedAspirant.meetingsHeld}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                        Meetings Held
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid size={{ xs: 4 }}>
                    <Paper
                      sx={{
                        bgcolor: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        borderRadius: '8px',
                        p: 2,
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 900, color: '#22c55e', mb: 0.5 }}>
                        {selectedAspirant.issuesAddressed}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                        Issues Addressed
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

              {/* Education */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <SchoolIcon sx={{ color: BRAND.yellow }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Education
                  </Typography>
                </Box>
                <Paper
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    p: 2
                  }}
                >
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {selectedAspirant.education}
                  </Typography>
                </Paper>
              </Box>

              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

              {/* Family Connections */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <GroupIcon sx={{ color: BRAND.yellow }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Family Connections
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip
                    label={`Political Connections: ${selectedAspirant.familyPoliticalConnection ? 'Yes' : 'No'}`}
                    color={selectedAspirant.familyPoliticalConnection ? 'success' : 'default'}
                    sx={{ fontWeight: 700 }}
                  />
                  <Chip
                    label={`Govt Officials: ${selectedAspirant.familyGovtOfficialConnection ? 'Yes' : 'No'}`}
                    color={selectedAspirant.familyGovtOfficialConnection ? 'success' : 'default'}
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

              {/* Election Affidavit */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <DescriptionIcon sx={{ color: BRAND.yellow }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Election Affidavit
                  </Typography>
                </Box>
                <Button
                  href={selectedAspirant.electionAffidavitUrl}
                  target="_blank"
                  variant="outlined"
                  sx={{
                    borderColor: BRAND.yellow,
                    color: BRAND.yellow,
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: BRAND.yellow,
                      bgcolor: 'rgba(245, 168, 0, 0.1)'
                    }
                  }}
                >
                  View / Download Affidavit
                </Button>
              </Box>

              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

              {/* Manifesto */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: BRAND.yellow }}>
                  Manifesto
                </Typography>
                <Paper
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    p: 2
                  }}
                >
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
                    {selectedAspirant.manifesto}
                  </Typography>
                </Paper>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Button
                onClick={handleCloseDialog}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#fff',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 4,
                  '&:hover': {
                    borderColor: '#fff',
                    bgcolor: 'rgba(255,255,255,0.05)'
                  }
                }}
                variant="outlined"
              >
                Close
              </Button>
              <Button
                sx={{
                  bgcolor: BRAND.red,
                  color: '#fff',
                  fontWeight: 700,
                  textTransform: 'none',
                  px: 4,
                  '&:hover': {
                    bgcolor: BRAND.red2
                  }
                }}
                variant="contained"
              >
                Contact Aspirant
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default PortalPage;