import React from 'react';
import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  HowToVoteRounded as HowToVoteIcon,
  GavelRounded as GavelIcon,
  VisibilityRounded as VisibilityIcon,
  FactCheckRounded as FactCheckIcon,
  CampaignRounded as CampaignIcon,
} from '@mui/icons-material';
import useThemeStore from '../store/useThemeStore';
import employeesImg from '../assets/images/employees.webp';
import officeImg from '../assets/images/office.webp';

const AboutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { mode } = useThemeStore();
  const isDark = mode === 'dark' || mode === 'grey';
  const isKannada = (i18n.language || '').startsWith('kn');

  const FF = "'Lora', serif";
  const FF_HEADING = "'Round 8', 'Space Grotesk', sans-serif";
  const headingColor = isDark ? '#ffffff' : '#000000';
  const bg = theme.palette.background.default;
  const paper = theme.palette.background.paper;

  return (
    <Box sx={{ bgcolor: bg, minHeight: '80vh', color: isDark ? '#E2E2E3' : '#111827', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="xl">
        <Grid container spacing={8} sx={{ alignItems: 'center' }}>
          {/* Left Column: Mission Description */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Typography variant="overline" sx={{ fontFamily: FF_HEADING, fontWeight: 700, letterSpacing: 2, color: '#F5A800' }}>
              {t('pages.landing.foundation.kicker', { defaultValue: 'FOUNDATION PRINCIPLES' })}
            </Typography>
            <Typography variant="h2" sx={{ fontFamily: FF_HEADING, fontWeight: 800, mt: 1, mb: 3, fontSize: { xs: '2.2rem', md: '3.2rem' }, lineHeight: 1.2, color: headingColor }}>
              {(() => {
                const titleText = t('pages.landing.foundation.title', { defaultValue: 'Direct Democracy Foundation' });
                if (titleText.includes("Democracy")) {
                  const parts = titleText.split("Democracy");
                  return (
                    <>
                      {parts[0]}
                      <span style={{ color: '#F5A800' }}>Democracy</span>
                      {parts[1]}
                    </>
                  );
                } else if (titleText.includes("ಮೂಲ ಮೌಲ್ಯಗಳು")) {
                  const parts = titleText.split("ಮೂಲ ಮೌಲ್ಯಗಳು");
                  return (
                    <>
                      {parts[0]}
                      <span style={{ color: '#F5A800' }}>ಮೂಲ ಮೌಲ್ಯಗಳು</span>
                      {parts[1]}
                    </>
                  );
                }
                return titleText;
              })()}
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: FF, color: isDark ? '#A0A5B0' : '#4B5563', fontSize: '1.1rem', lineHeight: 1.7, mb: 5 }}>
              {t('pages.landing.foundation.subtitle', { defaultValue: 'Establishing a system where the citizens hold supreme authority, guiding candidates transparently.' })}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Pillar 1 */}
              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 2, bgcolor: 'rgba(245,168,0,0.1)', color: '#F5A800', flexShrink: 0 }}>
                  <HowToVoteIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 700, mb: 0.5, color: headingColor }}>
                    {t('pages.landing.pillars.election.title', { defaultValue: 'Citizen Decided Elections' })}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: FF, color: isDark ? '#A0A5B0' : '#4B5563', lineHeight: 1.5 }}>
                    {t('pages.landing.pillars.election.body', { defaultValue: 'Voters screen, approve, and direct candidates based on manifesto pledges.' })}
                  </Typography>
                </Box>
              </Box>

              {/* Pillar 2 */}
              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 2, bgcolor: 'rgba(200,24,10,0.1)', color: '#C8180A', flexShrink: 0 }}>
                  <GavelIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 700, mb: 0.5, color: headingColor }}>
                    {t('pages.landing.pillars.mission.title', { defaultValue: 'Accountable Governance' })}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: FF, color: isDark ? '#A0A5B0' : '#4B5563', lineHeight: 1.5 }}>
                    {t('pages.landing.pillars.mission.body', { defaultValue: 'Continuous citizen guidance and verification to enforce transparency.' })}
                  </Typography>
                </Box>
              </Box>

              {/* Pillar 3 */}
              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 2, bgcolor: 'rgba(34,197,94,0.1)', color: '#22c55e', flexShrink: 0 }}>
                  <VisibilityIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 700, mb: 0.5, color: headingColor }}>
                    {t('pages.landing.pillars.issues.title', { defaultValue: 'Complete Transparency' })}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: FF, color: isDark ? '#A0A5B0' : '#4B5563', lineHeight: 1.5 }}>
                    {t('pages.landing.pillars.issues.body', { defaultValue: 'Open tracking of public work approvals, candidate credentials, and spending.' })}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Values Cards Grid */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Grid container spacing={3}>
              <Grid size={6} sx={{ pb: { xs: 2, md: 4 } }}>
                <Box
                  sx={{
                    bgcolor: paper,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    height: '100%',
                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: '#F5A800',
                    }
                  }}
                >
                  <Box component="img" src={employeesImg} alt="Voters" sx={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 700, mb: 0.8, fontSize: 16, color: headingColor }}>
                      {t('pages.landing.features.item1.title', { defaultValue: 'Citizen Power' })}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: FF, color: isDark ? '#A0A5B0' : '#4B5563', fontSize: 13, lineHeight: 1.5 }}>
                      {t('pages.landing.features.item1.body', { defaultValue: 'Citizens decide on policies rather than representatives.' })}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={6} sx={{ mt: { md: 4 } }}>
                <Box
                  sx={{
                    bgcolor: paper,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    height: '100%',
                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: '#C8180A',
                    }
                  }}
                >
                  <Box component="img" src={officeImg} alt="Decisions" sx={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 700, mb: 0.8, fontSize: 16, color: headingColor }}>
                      {t('pages.landing.features.item2.title', { defaultValue: 'Accountability' })}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: FF, color: isDark ? '#A0A5B0' : '#4B5563', fontSize: 13, lineHeight: 1.5 }}>
                      {t('pages.landing.features.item2.body', { defaultValue: 'Elected officials act as workers executing decisions.' })}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={6} sx={{ mt: { md: -4 } }}>
                <Box
                  sx={{
                    bgcolor: paper,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: '12px',
                    p: 3,
                    height: '100%',
                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: '#F5A800',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 2, bgcolor: 'rgba(245,168,0,0.1)', color: '#F5A800', mb: 3 }}>
                    <FactCheckIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 700, mb: 0.8, fontSize: 16, color: headingColor }}>
                    {t('pages.landing.features.item3.title', { defaultValue: 'Transparency' })}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: FF, color: isDark ? '#A0A5B0' : '#4B5563', fontSize: 13, lineHeight: 1.5 }}>
                    {t('pages.landing.features.item3.body', { defaultValue: 'Decisions and funding details are cryptographically auditable.' })}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={6}>
                <Box
                  sx={{
                    bgcolor: paper,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: '12px',
                    p: 3,
                    height: '100%',
                    transition: 'transform 0.3s ease, border-color 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: '#C8180A',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 2, bgcolor: 'rgba(200,24,10,0.1)', color: '#C8180A', mb: 3 }}>
                    <CampaignIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 700, mb: 0.8, fontSize: 16, color: headingColor }}>
                    {t('pages.landing.features.item4.title', { defaultValue: 'Citizen Directives' })}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: FF, color: isDark ? '#A0A5B0' : '#4B5563', fontSize: 13, lineHeight: 1.5 }}>
                    {t('pages.landing.features.item4.body', { defaultValue: 'Voters guide the candidate on every legislative action.' })}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutPage;
