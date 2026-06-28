import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Chip,
  Container,
  IconButton,
  useTheme,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import {
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Contrast as ContrastIcon,
  ArrowBack as ArrowBackIcon,
  HomeRounded as HomeRoundedIcon,
  ReportProblemRounded as ReportProblemRoundedIcon,
  GroupsRounded as GroupsRoundedIcon,
  DescriptionRounded as DescriptionRoundedIcon,
  PersonAddAlt1Rounded as PersonAddAlt1RoundedIcon,
  PersonRounded as PersonRoundedIcon,
  ForumRounded as ForumIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import prajakeeyaLogo from '../assets/images/prajakeeya.webp';
import { BRAND } from '../theme';
import LanguageSelector from '../components/LanguageSelector';
import NotificationBell from '../components/NotificationBell';
import { fetchAspirant } from '../services/aspirantService';
import AppFooter from '../components/AppFooter';

import RainEffect from '../components/RainEffect';

const FF_HEADING = "'Heming', 'Geist Variable', 'Geist', sans-serif";
const FF_BODY = "'Geist Variable', 'Geist', sans-serif";

const UserLayout = () => {
  const { t } = useTranslation();
  const { logout, user } = useAuthStore();
  const { mode, toggleTheme, rainEnabled, toggleRain } = useThemeStore();
  const showHeader = user?.role === 'voter';
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDark = mode === 'dark';
  const isDashboard = location.pathname === '/user/dashboard';
  const isVotersPage = location.pathname === '/user/voters';
  const isCivicIssuesPage = location.pathname === '/user/civic-issues';
  const isSopPage = location.pathname === '/user/sop';
  const isAspirantRegister = location.pathname === '/user/aspirants/register' || location.pathname === '/user/aspirants/declaration' || location.pathname === '/user/aspirants/documents';
  const isNotificationsPage = location.pathname === '/user/notifications';
  const isRegisteredAspirants = location.pathname === '/user/registered-aspirants';
  const isProfilePage = location.pathname === '/user/complete-profile' || location.pathname === '/user/dashboard/profile';

  const [aspirantName, setAspirantName] = useState<string | null>(null);
  const [aspirantLoading, setAspirantLoading] = useState(user?.role === 'aspirant');

  useEffect(() => {
    if (user?.role === 'aspirant' && user.aspirantId) {
      setAspirantLoading(true);
      fetchAspirant(user.aspirantId)
        .then(res => setAspirantName(res.data?.name ?? null))
        .catch(() => setAspirantName(null))
        .finally(() => setAspirantLoading(false));
    } else {
      setAspirantLoading(false);
    }
  }, [user?.role, user?.aspirantId]);

  const displayUser = user || { name: 'Voter User', wardId: 101, wardName: '', profilePicture: null } as any;
  const displayName = user?.role === 'aspirant'
    ? (aspirantLoading ? '' : (aspirantName || displayUser.name))
    : displayUser.name;
  // Derive ward number from user profile (already available from /auth/me) — no extra API call needed
  const wardNumber = displayUser.wardNumber || displayUser.wardId || null;

  const handleLogout = () => { logout(); navigate('/'); };

  // ── Mobile bottom navigation (xs only). Mirrors the dashboard's primary
  //    actions; the dashboard "Home" now shows the aspirants list with tabs.
  //    For a fully-registered aspirant the last tab becomes "My Profile"
  //    instead of "Register Aspirant" (mirrors the dashboard tile logic). ──
  const isAspirant = user?.role === 'aspirant' && (user as any)?.documentStatus === 'completed';
  const bottomNavItems = [
    { label: t('common.home', { defaultValue: 'Home' }), icon: <HomeRoundedIcon />, path: '/user/dashboard' },
    { label: 'Katte', icon: <ForumIcon />, path: '/user/discussions' },
    { label: 'Karyakartas', icon: <GroupsRoundedIcon />, path: '/user/karyakartas' },
    isAspirant
      ? { label: t('userDashboard.actions.myProfile', { defaultValue: 'My Profile' }), icon: <PersonRoundedIcon />, path: '/user/dashboard/profile' }
      : { label: t('userDashboard.actions.registerAspirant', { defaultValue: 'Register Aspirant' }), icon: <PersonAddAlt1RoundedIcon />, path: '/user/aspirants/declaration' },
  ];
  const currentNavIndex = bottomNavItems.findIndex((item) =>
    item.path === '/user/dashboard'
      ? location.pathname === '/user/dashboard'
      : location.pathname.startsWith(item.path)
  );

  // Theme-aware colour helpers
  const navBg = isDark
    ? 'radial-gradient(130% 140% at 0% 0%, rgba(200,24,10,0.2) 0%, rgba(13,15,18,1) 55%), radial-gradient(120% 130% at 100% 0%, rgba(37,58,154,0.16) 0%, rgba(13,15,18,1) 55%)'
    : `linear-gradient(135deg, #fff 0%, #FFF8F0 100%)`;

  const subtleText = isDark ? 'rgba(255,255,255,0.52)' : 'rgba(17,24,39,0.45)';

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {mode === 'grey' && rainEnabled && <RainEffect />}
      {showHeader && (
        <AppBar position="sticky" elevation={0} sx={{
        /* Glassmorphic frosted AppBar */
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
        '&::before': isDark ? {
          content: '""',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.012) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        } : {},
      }}>
        {/* Tri-colour top accent */}
        <Box sx={{ display: 'flex', height: '3px' }}>
          {[BRAND.red, BRAND.blue, BRAND.brown].map(c => <Box key={c} sx={{ flex: 1, bgcolor: c }} />)}
        </Box>

        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
          <Toolbar sx={{ justifyContent: 'space-between', py: { xs: 0.9, sm: 1.2 }, minHeight: { xs: 56, sm: 72 }, px: { xs: 1 } }}>
            {/* Left: back button (mobile, non-dashboard) or logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* Mobile back button — shown on all pages except dashboard, voters, civic issues, sop, aspirant register, notifications, and registered-aspirants */}
              {!isDashboard && !isVotersPage && !isCivicIssuesPage && !isSopPage && !isAspirantRegister && !isNotificationsPage && !isRegisteredAspirants && !isProfilePage && (
                <IconButton
                  onClick={() => navigate(-1)}
                  size="small"
                  aria-label="go back"
                  sx={{
                    display: { xs: 'flex', sm: 'none' },
                    color: isDark ? BRAND.yellow : BRAND.saffron,
                    p: 0.8, borderRadius: 2,
                    background: `linear-gradient(135deg,rgba(200,24,10,.18),rgba(245,168,0,.14))`,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <ArrowBackIcon sx={{ fontSize: 22 }} />
                </IconButton>
              )}

              {/* Logo — always on desktop, on dashboard/voters/civic-issues/sop on mobile */}
              <Box
                sx={{ display: { xs: (isDashboard || isVotersPage || isCivicIssuesPage || isSopPage || isAspirantRegister || isNotificationsPage || isRegisteredAspirants || isProfilePage) ? 'flex' : 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
                onClick={() => navigate('/user/dashboard')}
              >
                <Box sx={{
                  p: 0.8, borderRadius: 2,
                  background: `linear-gradient(135deg,rgba(200,24,10,.18),rgba(245,168,0,.14))`,
                  border: `1px solid ${theme.palette.divider}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Box component="img" src={prajakeeyaLogo} alt={t('userDashboard.title')} sx={{ height: { xs: 28, sm: 34 } }} />
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography sx={{ fontFamily: FF_HEADING, fontWeight: 800, lineHeight: 1.05, color: isDark ? '#fff' : 'text.primary', fontSize: { sm: '1rem', md: '1.08rem' } }}>
                    {t('pages.landing.kicker')}
                  </Typography>
                  <Typography sx={{ fontFamily: FF_HEADING, fontSize: '0.73rem', letterSpacing: '.06em', textTransform: 'uppercase', color: subtleText }}>
                    {t('menu.dashboard') || 'Dashboard'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Right: theme toggle + lang switch + avatar + logout(desktop) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.8, sm: 1.5 } }}>
              {mode === 'grey' && (
                <IconButton
                  onClick={toggleRain}
                  size="small"
                  title="Toggle Rain Effect"
                  sx={{
                    width: 36,
                    height: 36,
                    color: rainEnabled ? '#AECAE8' : '#9CA3AF',
                    border: `1.5px solid ${rainEnabled ? 'rgba(255, 255, 255, 0.15)' : 'transparent'}`,
                    bgcolor: rainEnabled ? 'rgba(255,255,255,0.06)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  <span style={{ fontSize: '18px' }}>🌧️</span>
                </IconButton>
              )}
              {/* Theme toggle */}
              <IconButton
                onClick={toggleTheme}
                size="small"
                aria-label={
                  mode === 'dark'
                    ? 'Switch to light theme'
                    : mode === 'light'
                    ? 'Switch to grey theme'
                    : 'Switch to dark theme'
                }
                sx={{
                  width: 36, height: 36,
                  color: mode === 'light' ? BRAND.saffron : mode === 'grey' ? '#9CA3AF' : BRAND.yellow,
                }}>
                {mode === 'dark' ? (
                  <DarkModeIcon />
                ) : mode === 'light' ? (
                  <LightModeIcon />
                ) : (
                  <ContrastIcon />
                )}
              </IconButton>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate('/user/about')}
                sx={{
                  fontFamily: FF_HEADING,
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: isDark ? BRAND.yellow : BRAND.saffron,
                  textTransform: 'none',
                  mr: { xs: 0.5, sm: 1 },
                }}
              >
                About Us
              </Button>

              {/* Lang selector */}
              <LanguageSelector
                sx={{
                  minWidth: 64,
                  px: 1,
                  fontFamily: FF_HEADING,
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: isDark ? BRAND.yellow : BRAND.saffron,
                }}
              />

              {/* Notifications bell — opens /user/notifications */}
              <NotificationBell />

              <Box sx={{ width: { xs: 4, sm: 8 } }} />

              {/* User avatar (desktop: full, mobile: compact) */}
              <Box sx={{
                display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.2, cursor: 'pointer',
                p: 0.7, pr: { xs: 0.7, sm: 1.2 }, borderRadius: 3,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.14)' : theme.palette.divider}`,
                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'action.hover',
                '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.07)' : 'action.selected' },
              }} onClick={() => navigate('/user/complete-profile')}>
                <Avatar
                  src={displayUser.profilePicture || undefined}
                  alt={displayName || 'User'}
                  sx={{
                    width: { xs: 34, sm: 38 }, height: { xs: 34, sm: 38 },
                    bgcolor: displayUser.profilePicture ? 'transparent' : 'primary.main',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : theme.palette.divider}`,
                  }}
                >
                  {!displayUser.profilePicture && (displayName?.charAt(0).toUpperCase() || 'U')}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, lineHeight: 1.2, color: isDark ? '#fff' : 'text.primary' }}>
                    {displayName}
                  </Typography>
                  {(wardNumber || displayUser.wardId) && (
                    <Chip
                      label={`Ward ${wardNumber ?? displayUser.wardId}`}
                      size="small"
                      sx={{
                        height: 18, fontSize: '0.64rem', fontWeight: 700, fontFamily: FF_HEADING,
                        bgcolor: isDark ? 'rgba(245,168,0,0.16)' : 'rgba(245,168,0,0.15)',
                        color: isDark ? '#ffe4aa' : BRAND.brown,
                        border: `1px solid rgba(245,168,0,0.36)`,
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* Mobile-only profile avatar */}
              <Box
                onClick={() => navigate('/user/complete-profile')}
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <Avatar
                  src={displayUser.profilePicture || undefined}
                  alt={displayName || 'User'}
                  sx={{
                    width: 34, height: 34,
                    bgcolor: displayUser.profilePicture ? 'transparent' : 'primary.main',
                    border: `2px solid ${isDark ? 'rgba(245,168,0,0.55)' : BRAND.yellow}`,
                  }}
                >
                  {!displayUser.profilePicture && (displayName?.charAt(0).toUpperCase() || 'U')}
                </Avatar>
              </Box>

              {/* Logout (desktop) */}
              <Button size="small" startIcon={<LogoutIcon />} onClick={handleLogout}
                sx={{
                  fontFamily: FF_HEADING, borderRadius: 50,
                  display: { xs: 'none', sm: 'inline-flex' },
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : theme.palette.divider}`,
                  color: isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                  textTransform: 'none', fontWeight: 700,
                  '&:hover': {
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.45)' : theme.palette.primary.main}`,
                    color: isDark ? '#fff' : 'text.primary',
                    bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'action.hover',
                  },
                }}>
                {t('common.logout')}
              </Button>
            </Box>
          </Toolbar>
        </Container>

        {/* Desktop primary nav — Anchored Glassmorphic Tab Indicator */}
        <Box sx={{ display: { xs: 'none', sm: 'block' }, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap',
              gap: { sm: 0.5, md: 0.75 }, py: 0.6,
              /* glassmorphic container tint */
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
              {bottomNavItems.map((item, idx) => {
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
                        ? isDark
                          ? 'linear-gradient(135deg, rgba(245,168,0,0.85) 0%, rgba(200,24,10,0.7) 100%)'
                          : 'linear-gradient(135deg, rgba(200,24,10,0.88) 0%, rgba(245,168,0,0.75) 100%)'
                        : 'transparent',
                      backdropFilter: active ? 'blur(16px)' : 'none',
                      WebkitBackdropFilter: active ? 'blur(16px)' : 'none',
                      border: active
                        ? `1px solid ${isDark ? 'rgba(245,168,0,0.4)' : 'rgba(200,24,10,0.25)'}` 
                        : '1px solid transparent',
                      boxShadow: active
                        ? isDark
                          ? '0 4px 20px -4px rgba(245,168,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)'
                          : '0 4px 20px -4px rgba(200,24,10,0.3), inset 0 1px 0 rgba(255,255,255,0.5)'
                        : 'none',
                      '& .MuiButton-startIcon': {
                        mr: 0.6,
                        transition: 'transform 0.3s ease',
                      },
                      '&:hover': active
                        ? {
                            boxShadow: isDark
                              ? '0 6px 28px -4px rgba(245,168,0,0.55), inset 0 1px 0 rgba(255,255,255,0.2)'
                              : '0 6px 28px -4px rgba(200,24,10,0.4), inset 0 1px 0 rgba(255,255,255,0.6)',
                            transform: 'translateY(-1px)',
                          }
                        : {
                            background: isDark
                              ? 'rgba(255,255,255,0.06)'
                              : 'rgba(200,24,10,0.04)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(200,24,10,0.08)'}`,
                            color: isDark ? '#fff' : 'rgba(17,24,39,0.85)',
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
      )}

      <Container maxWidth="xl" sx={{ pt: { xs: 3, sm: 4, md: 5 }, pb: { xs: showHeader ? 'calc(90px + env(safe-area-inset-bottom))' : 4, sm: 4, md: 5 }, flex: 1 }}>
        <Outlet />
      </Container>

      <AppFooter />

      {/* Mobile bottom navigation — fixed, xs only */}
      {/* Mobile bottom navigation — Anchored Glassmorphic Tab Indicator */}
      {showHeader && (
        <Paper
          elevation={0}
          sx={{
            display: { xs: 'block', sm: 'none' },
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: (theme) => theme.zIndex.appBar,
            /* Glassmorphic frosted base */
            backgroundColor: isDark ? 'rgba(13,15,18,0.72)' : 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(24px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,24,10,0.06)'}`,
            pb: 'calc(8px + env(safe-area-inset-bottom))',
          }}
        >
          <BottomNavigation
            showLabels
            value={currentNavIndex === -1 ? false : currentNavIndex}
            onChange={(_, newValue) => navigate(bottomNavItems[newValue].path)}
            sx={{
              bgcolor: 'transparent',
              height: 66,
              alignItems: 'flex-start',
              pt: 1,
              '& .MuiBottomNavigationAction-root': {
                minWidth: 0,
                px: 0.5,
                justifyContent: 'flex-start',
                gap: 0.4,
                color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(17,24,39,0.42)',
                transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
                borderRadius: 2,
                mx: 0.3,
                position: 'relative',
              },
              '& .MuiBottomNavigationAction-root.Mui-selected': {
                color: isDark ? '#fff' : BRAND.saffron,
                background: isDark
                  ? 'linear-gradient(180deg, rgba(245,168,0,0.18) 0%, rgba(245,168,0,0.04) 100%)'
                  : 'linear-gradient(180deg, rgba(200,24,10,0.1) 0%, rgba(200,24,10,0.02) 100%)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                '& .MuiSvgIcon-root': {
                  filter: isDark
                    ? 'drop-shadow(0 2px 8px rgba(245,168,0,0.5))'
                    : 'drop-shadow(0 2px 8px rgba(200,24,10,0.35))',
                },
              },
              '& .MuiBottomNavigationAction-label': {
                mt: 0,
                lineHeight: 1.2,
                fontFamily: FF_HEADING,
                fontWeight: 700,
                fontSize: '0.62rem',
                transition: 'all 0.3s ease',
                '&.Mui-selected': { fontSize: '0.64rem', fontWeight: 800 },
              },
            }}
          >
            {bottomNavItems.map((item) => (
              <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
};

export default UserLayout;
