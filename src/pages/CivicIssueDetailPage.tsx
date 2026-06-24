import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  CircularProgress,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  ReportProblem as ReportProblemIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { getIssue, CivicIssue } from '../services/civicIssuesService';
import { BRAND } from '../theme';

const FF_HEADING = "'Heming', 'Geist Variable', 'Geist', sans-serif";
const FF_BODY = "'Geist Variable', 'Geist', sans-serif";
const FF = FF_BODY;

const formatDate = (ts: number | string) => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(new Date(ts));
  } catch {
    return String(ts);
  }
};

const formatTime = (ts: number | string) => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date(ts));
  } catch {
    return '';
  }
};

const CivicIssueDetailPage: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const wardNumber = user?.wardNumber ?? user?.wardId ?? '';

  const [issue, setIssue] = useState<CivicIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Colours
  const GOLD = isDark ? BRAND.yellow : BRAND.yellowLight;
  const GOLDD = 'rgba(245,168,0,0.45)';
  const BG = theme.palette.background.paper;
  const bgPage = isDark ? theme.palette.background.default : '#f8f7f4';
  const borderFaint = isDark ? 'rgba(245,168,0,0.18)' : 'rgba(245,168,0,0.28)';
  const borderSubtle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(17,24,39,0.10)';
  const textPrimary = theme.palette.text.primary;
  const textMid = isDark ? 'rgba(255,255,255,0.64)' : 'rgba(17,24,39,0.65)';
  const textDim = isDark ? 'rgba(255,255,255,0.42)' : 'rgba(17,24,39,0.46)';

  useEffect(() => {
    if (!wardNumber || !id) { setLoading(false); return; }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getIssue(wardNumber, Number(id));
        if (!cancelled) setIssue(data);
      } catch (err: any) {
        if (!cancelled) setError(err?.response?.data?.message || err?.message || 'Failed to load issue.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [wardNumber, id]);

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', px: { xs: 1, sm: 0 } }}>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: GOLD }} />
        </Box>
      ) : error ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Box sx={{
            bgcolor: BG, borderRadius: 3, border: `1px solid rgba(200,24,10,0.3)`,
            py: 7, textAlign: 'center',
          }}>
            <ReportProblemIcon sx={{ fontSize: 44, color: '#C8180A', mb: 1.5 }} />
            <Typography sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#C8180A', mb: 0.8 }}>
              Could not load issue
            </Typography>
            <Typography sx={{ fontFamily: FF_BODY, fontSize: '0.88rem', color: textMid, mb: 3 }}>
              {error}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/user/civic-issues')}
              sx={{
                fontFamily: FF_HEADING, fontWeight: 700, borderRadius: 2, textTransform: 'none',
                borderColor: GOLDD, color: GOLD,
                '&:hover': { bgcolor: 'rgba(245,168,0,0.06)', borderColor: GOLD },
              }}
            >
              Go Back
            </Button>
          </Box>
        </motion.div>
      ) : issue ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{
            bgcolor: BG,
            borderRadius: 3,
            border: `1px solid ${borderFaint}`,
            overflow: 'hidden',
            boxShadow: isDark ? '0 14px 36px rgba(0,0,0,0.36)' : '0 4px 18px rgba(17,24,39,0.07)',
          }}>
            {/* Tri-colour top bar */}
            <Box sx={{ display: 'flex', height: '4px' }}>
              {[BRAND.red, BRAND.blue, BRAND.brown].map(c => (
                <Box key={c} sx={{ flex: 1, bgcolor: c }} />
              ))}
            </Box>

            {/* ── Title section ──────────────────────────────────────────── */}
            <Box sx={{ px: { xs: 2.5, sm: 4 }, pt: 3.5, pb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{
                  width: 48, height: 48, borderRadius: '10px', flexShrink: 0,
                  background: 'linear-gradient(135deg,rgba(200,24,10,.22),rgba(37,58,154,.18))',
                  border: '1.5px solid rgba(245,168,0,.30)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ReportProblemIcon sx={{ color: GOLD, fontSize: 24 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{
                    fontFamily: FF_HEADING, fontWeight: 800,
                    fontSize: { xs: '1.2rem', sm: '1.45rem' },
                    color: textPrimary, lineHeight: 1.25,
                  }}>
                    {issue.title}
                  </Typography>

                  {/* Meta row */}
                  <Stack direction="row" spacing={2} sx={{ mt: 1.2, flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                      <CalendarIcon sx={{ fontSize: 13, color: textDim }} />
                      <Typography sx={{ fontFamily: FF_BODY, fontSize: '0.8rem', color: textDim }}>
                        {formatDate(issue.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                      <TimeIcon sx={{ fontSize: 13, color: textDim }} />
                      <Typography sx={{ fontFamily: FF_BODY, fontSize: '0.8rem', color: textDim }}>
                        {formatTime(issue.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{
                      px: 1.2, py: 0.2, borderRadius: 1,
                      bgcolor: 'rgba(37,58,154,0.12)',
                      border: '1px solid rgba(37,58,154,0.25)',
                    }}>
                      <Typography sx={{ fontFamily: FF_HEADING, fontSize: '0.72rem', fontWeight: 700, color: '#253A9A' }}>
                        Ward {wardNumber}
                      </Typography>
                    </Box>
                    <Box sx={{
                      px: 1.2, py: 0.2, borderRadius: 1,
                      bgcolor: issue.isActive ? 'rgba(22,163,74,0.12)' : 'rgba(100,100,100,0.12)',
                      border: `1px solid ${issue.isActive ? 'rgba(22,163,74,0.25)' : 'rgba(100,100,100,0.25)'}`,
                    }}>
                      <Typography sx={{
                        fontFamily: FF_HEADING, fontSize: '0.72rem', fontWeight: 700,
                        color: issue.isActive ? '#15803d' : '#666',
                      }}>
                        {issue.isActive ? 'Active' : 'Closed'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ borderColor: borderSubtle }} />

            {/* ── Description ────────────────────────────────────────────── */}
            <Box sx={{ px: { xs: 2.5, sm: 4 }, py: 3 }}>
              <Typography sx={{
                fontFamily: FF_HEADING, fontWeight: 700, fontSize: '0.78rem',
                color: textDim, textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5,
              }}>
                Description
              </Typography>
              <Typography sx={{
                fontFamily: FF_BODY, color: textMid,
                lineHeight: 1.85, fontSize: { xs: '0.92rem', sm: '1rem' },
                whiteSpace: 'pre-wrap',
              }}>
                {issue.description}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: borderSubtle }} />

            {/* ── Footer actions ─────────────────────────────────────────── */}
            <Box sx={{
              px: { xs: 2.5, sm: 4 }, py: 2.5,
              display: 'flex', justifyContent: 'flex-end', gap: 1.5,
              flexWrap: 'wrap',
            }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/user/civic-issues/report')}
                sx={{
                  fontFamily: FF_HEADING, fontWeight: 700, borderRadius: 2, textTransform: 'none',
                  px: 2.5,
                  background: `linear-gradient(135deg,${BRAND.red} 0%,${BRAND.yellow} 100%)`,
                  color: '#fff',
                  boxShadow: '0 4px 18px rgba(200,24,10,0.28)',
                  '&:hover': {
                    background: `linear-gradient(135deg,#e01c0c 0%,#ffb800 100%)`,
                    boxShadow: '0 6px 24px rgba(200,24,10,0.44)',
                  },
                }}
              >
                Report Another
              </Button>
            </Box>
          </Box>
        </motion.div>
      ) : null}
    </Box>
  );
};

export default CivicIssueDetailPage;
