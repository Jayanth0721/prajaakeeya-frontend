import { useState } from 'react';
import { Button, Stack, Box, CircularProgress, Typography, useTheme, keyframes } from '@mui/material';
import { motion } from 'framer-motion';

const amountPulse = keyframes`
  0%, 100% {
    text-shadow: 0 0 10px rgba(255,180,0,0.7), 0 0 20px rgba(255,140,0,0.5), 0 0 40px rgba(255,100,0,0.3);
    background-position: 0% 50%;
  }
  50% {
    text-shadow: 0 0 20px rgba(255,200,0,1), 0 0 40px rgba(255,160,0,0.8), 0 0 60px rgba(255,100,0,0.5), 0 0 80px rgba(255,60,0,0.3);
    background-position: 100% 50%;
  }
`;
import SplitAuthLayout from '../components/SplitAuthLayout';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const UserPledgePage = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const mutedText = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(17,24,39,0.62)';
  const secondaryText = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(17,24,39,0.72)';
  const strongText = isDark ? 'rgba(255,255,255,0.88)' : 'rgba(17,24,39,0.92)';
  const panelBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(17,24,39,0.03)';
  const panelBorder = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(17,24,39,0.12)';
  const navigate = useNavigate();
  const isKannada = i18n.language === 'kn';

  const [hasReadOath] = useState(true);

  const [loading, setLoading] = useState(false);

  const oathParagraphs = [
    { text: t('pages.login.oath.para0'), strong: true },
    { text: t('pages.login.oath.para1'), strong: true },
    { text: t('pages.login.oath.para2'), strong: true },
    { text: t('pages.login.oath.para3'), strong: true },
    // { text: t('pages.login.oath.para4'), strong: true },
    // { text: t('pages.login.oath.para5'), strong: true },
  ];

  const handleContinue = () => {
    setLoading(true);
    navigate('/register', { state: { fromPledge: true } });
  };

  // ── Oath / Pledge view ────────────────────────────────────────────────────────
  const oathContent = (
    <Stack spacing={2}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{
          fontSize: isKannada ? '1.05rem' : '1.1rem',
          fontWeight: 800,
          color: '#F5A800',
          fontFamily: isKannada ? '"Tiro Kannada", serif' : '"Baloo 2", cursive',
          letterSpacing: '0.5px',
        }}>
          {t('pages.login.oath.title')}
        </Typography>
        <Typography sx={{ fontSize: '0.78rem', color: mutedText, mt: 0.5 }}>
          {t('pages.login.oath.subtitle')}
        </Typography>
      </Box>

      {/* Pledge content */}
      <Box>
        <Box>
          <Stack spacing={1.5}>
            {oathParagraphs.map((para, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex', gap: 1.25, alignItems: 'flex-start',
                  p: '10px 12px', borderRadius: '10px',
                  ...(para.strong ? {
                    background: 'linear-gradient(135deg, rgba(200,24,10,0.18), rgba(245,168,0,0.12))',
                    border: '1px solid rgba(245,168,0,0.28)',
                  } : {
                    background: panelBg,
                    border: `1px solid ${panelBorder}`,
                  }),
                }}
              >
                <Typography component="span" sx={{
                  color: para.strong ? '#F5A800' : mutedText,
                  flexShrink: 0, fontSize: para.strong ? '0.9rem' : '0.75rem', mt: '3px',
                }}>
                  {para.strong ? '✊' : '•'}
                </Typography>
                <Typography sx={{
                  fontSize: isKannada ? '0.88rem' : '0.875rem',
                  color: strongText,
                  lineHeight: 1.75,
                  fontFamily: isKannada ? '"Tiro Kannada", serif' : 'inherit',
                  fontWeight: 600,
                }}>
                  {idx === 0 ? (() => {
                    const amountRegex = /(₹[\d,]+)/;
                    const match = para.text.match(amountRegex);
                    if (!match) return para.text;
                    const amount = match[0];
                    const parts = para.text.split(amount);
                    return (
                      <>
                        {parts[0]}
                        <Box
                          component="span"
                          sx={{
                            fontWeight: 900,
                            fontSize: '1.15em',
                            background: isDark
                              ? 'linear-gradient(90deg, #FFD700, #FF8C00, #FFD700)'
                              : 'linear-gradient(90deg, #E65100, #F57C00, #E65100)',
                            backgroundSize: '200% auto',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            animation: `${amountPulse} 2.5s ease-in-out infinite`,
                            display: 'inline',
                          }}
                        >
                          {amount}
                        </Box>
                        {parts[1]}
                      </>
                    );
                  })() : para.text}
                </Typography>
              </Box>
            ))}
            <Box sx={{ height: 0 }} />
          </Stack>
        </Box>

      </Box>

      {/* After oath is read — proceed to register */}
      {hasReadOath ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Stack spacing={0.75}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
              <Box
                component={motion.div as any}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                sx={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px #4ade80' }}
              />
              <Typography sx={{ color: '#4ade80', fontSize: '0.8rem', fontWeight: 600 }}>
                {t('pages.login.oath.fullRead')}
              </Typography>
            </Box>

            <Stack spacing={0.7}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                onClick={handleContinue}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  py: 1.4, borderRadius: 2, color: '#fff', fontWeight: 700, fontSize: '1rem', textTransform: 'none',
                  background: 'linear-gradient(135deg, #C8180A 0%, #d41a0b 50%, #E02010 100%)',
                  boxShadow: '0 4px 20px rgba(200,24,10,0.45)',
                  '&:hover': { background: 'linear-gradient(135deg, #E02010 0%, #C8180A 100%)', boxShadow: '0 6px 28px rgba(200,24,10,0.6)' },
                  '&.Mui-disabled': {
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(17,24,39,0.12)',
                    color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(17,24,39,0.45)',
                  },
                }}
              >
                {loading ? t('common.loading') : t('pages.register.registerNow')}
              </Button>
              <Typography sx={{ textAlign: 'center', fontSize: '0.82rem', color: mutedText }}>
                {t('pages.register.alreadyHaveAccount')}{' '}
                <Box
                  component="span"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#F5A800',
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {t('pages.register.signIn')}
                </Box>
              </Typography>
            </Stack>

          </Stack>
        </motion.div>
      ) : (
        <Button
          fullWidth
          size="large"
          disabled
          sx={{
            py: 1.4, borderRadius: 2, fontWeight: 700, fontSize: '1rem', textTransform: 'none',
            '&.Mui-disabled': {
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(17,24,39,0.12)',
              color: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(17,24,39,0.45)',
            },
          }}
        >
          {t('pages.login.requestOtp')}
        </Button>
      )}

    </Stack>
  );

  return (
    <SplitAuthLayout
      leftTitle={t('pages.register.leftTitle')}
      leftSubtitle={t('pages.register.leftSubtitle')}
      cardTitle={t('pages.register.title')}
      showFooter={false}
    >
      {oathContent}
    </SplitAuthLayout>
  );
};

export default UserPledgePage;
