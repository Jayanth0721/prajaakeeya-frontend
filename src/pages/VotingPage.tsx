import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Button,
  Snackbar,
  Alert,
  Box,
  Typography,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { HowToVote as HowToVoteIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/useAuthStore';
import { fetchWardAspirantsByNumber } from '../services/aspirantService';
import { fetchMyVote, fetchWardResults, submitVote, fetchVotingWindow } from '../services/voteService';
import { isMockMode } from '../config/appMode';
import { BRAND } from '../theme';

interface Aspirant {
  id: number;
  name: string;
  party?: string;
  bio?: string;
  manifesto: string;
  status: string;
  selfieUrl?: string | null;
}

const VotingPage = () => {
  const [aspirants, setAspirants] = useState<Aspirant[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAspirants, setLoadingAspirants] = useState(false);
  const [error, setError] = useState('');
  const [voteCounts, setVoteCounts] = useState<Record<number, number>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAspirant, setSelectedAspirant] = useState<Aspirant | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedAspirantId, setVotedAspirantId] = useState<number | null>(null);
  const [sopDialogOpen, setSopDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isVotingAllowed, setIsVotingAllowed] = useState(false);
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  // Determine if voting is allowed (at least one meeting/chat flag must be true)
  const canVote = user?.isChat || user?.isMeeting || user?.isDirectMeet || user?.isPhoneCall;
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const GOLD = isDark ? BRAND.yellow : BRAND.yellowLight;

  // Dummy aspirants data
  const dummyAspirants: Aspirant[] = useMemo(
    () => [
      { id: 1, name: 'Rajesh Kumar', bio: 'Community leader', manifesto: 'Focus on infrastructure', status: 'approved' },
      { id: 2, name: 'Priya Sharma', bio: 'Education advocate', manifesto: 'Quality education for all', status: 'approved' },
      { id: 3, name: 'Suresh Reddy', bio: 'Environmental activist', manifesto: 'Green initiatives', status: 'approved' }
    ],
    []
  );

  useEffect(() => {
    fetchVotingWindow()
      .then((resp) => setIsVotingAllowed(resp.data?.isVotingAllowed ?? false))
      .catch(() => setIsVotingAllowed(false));
  }, []);

  useEffect(() => {
    setError('');
    if (isMockMode) {
      setAspirants(dummyAspirants);
      return;
    }
    if (!user?.wardNumber) return;
    setLoadingAspirants(true);
    fetchWardAspirantsByNumber(user.wardNumber)
      .then((response) => {
        const data = Array.isArray(response.data) ? response.data : [];
        // Only show aspirants whose status is explicitly 'approved'
        const approved = data.filter((item) => String(item.status).toLowerCase() === 'approved');
        setAspirants(approved);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || t('common.error') || 'Failed to load candidates');
      })
      .finally(() => setLoadingAspirants(false));
  }, [dummyAspirants, t, user?.wardNumber]);

  useEffect(() => {
    if (isMockMode) return;
    if (!user?.wardId) return;
    fetchMyVote(user.wardId)
      .then((response) => {
        if (response.data?.aspirantId) {
          setHasVoted(true);
          setVotedAspirantId(response.data.aspirantId);
        }
      })
      .catch(() => undefined);
  }, [user?.wardId]);

  useEffect(() => {
    if (isMockMode) {
      setVoteCounts({ 1: 128, 2: 97, 3: 64 });
      return;
    }
    if (!user?.wardId) return;
    fetchWardResults(user.wardId)
      .then((response) => {
        // API may return either an array or an object with `results` array.
        const payload = response?.data;
        const rows = Array.isArray(payload) ? payload : (Array.isArray(payload?.results) ? payload.results : []);
        const map: Record<number, number> = {};
        rows.forEach((row: any) => {
          const id = Number(row.aspirantId ?? row.id);
          if (!Number.isNaN(id)) {
            map[id] = Number(row.totalVotes) || 0;
          }
        });
        setVoteCounts(map);
      })
      .catch(() => undefined);
  }, [user?.wardId]);

  // Helper to refresh vote counts (call after voting)
  const refreshVoteCounts = async () => {
    if (isMockMode) return;
    if (!user?.wardId) return;
    try {
      const response = await fetchWardResults(user.wardId);
      const payload = response?.data;
      const rows = Array.isArray(payload) ? payload : (Array.isArray(payload?.results) ? payload.results : []);
      const map: Record<number, number> = {};
      rows.forEach((row: any) => {
        const id = Number(row.aspirantId ?? row.id);
        if (!Number.isNaN(id)) {
          map[id] = Number(row.totalVotes) || 0;
        }
      });
      setVoteCounts(map);
    } catch (e) {
      // ignore
    }
  };

  const wardInfo = {
    number: user?.wardNumber || '101',
    name: user?.wardName || 'Ward 101 - Central'
  };

  const votedAspirant = aspirants.find((a) => a.id === votedAspirantId) || null;

  const handleVoteClick = (aspirant: Aspirant) => {
    if (hasVoted) return;
    setSelectedAspirant(aspirant);
    setSopDialogOpen(true);
  };

  const handleSopAccept = () => {
    setSopDialogOpen(false);
    if (!user?.wardId || !selectedAspirant?.id) return;
    setLoading(true);
    setError('');
    submitVote({ wardId: user.wardId, aspirantId: selectedAspirant.id })
      .then(() => {
        setHasVoted(true);
        setVotedAspirantId(selectedAspirant.id);
        setSuccessDialogOpen(true);
        refreshVoteCounts();
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || t('common.error') || 'Failed to cast vote');
      })
      .finally(() => setLoading(false));
  };

  const handleConfirmVote = () => {
    setConfirmOpen(false);
  };

  const FF_HEADING = "'Round 8', 'Space Grotesk', sans-serif";
  const FF_BODY = "'Absans', 'Lora', serif";
  const FF = FF_BODY;
  const panelBg = isDark
    ? 'linear-gradient(155deg, rgba(20,24,34,0.95) 0%, rgba(13,17,28,0.96) 100%)'
    : 'linear-gradient(155deg, #FFFFFF 0%, #F8FAFC 100%)';
  const border = isDark ? 'rgba(156,163,175,0.28)' : 'rgba(17,24,39,0.12)';
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;
  const muted = isDark ? 'rgba(255,255,255,0.62)' : 'rgba(17,24,39,0.62)';

  return (
    <Stack spacing={3} sx={{ pb: { xs: 2, md: 4 }, px: { xs: 1, sm: 0 } }}>
      <Box>
        <Typography variant="h4" sx={{ fontFamily: FF_HEADING, fontWeight: 800, mb: 0.8, color: textPrimary }}>
          {t('pages.voting.title') || 'Cast Your Vote'}
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: FF_BODY, color: muted }}>
          {t('pages.voting.subtitle') || 'Select your preferred candidate for your ward'}
        </Typography>

        <Box sx={{ bgcolor: isDark ? 'rgba(245,168,0,0.08)' : '#FFF7E6', borderRadius: 2.2, p: { xs: 1.35, sm: 1.6 }, mt: 1.1, borderLeft: `6px solid ${BRAND.yellow}`, border: `1px solid ${isDark ? 'rgba(245,168,0,0.28)' : 'rgba(245,168,0,0.4)'}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.7 }}>
            <Box sx={{ width: 34, height: 34, minWidth: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${BRAND.yellow}`, color: GOLD, bgcolor: isDark ? 'rgba(245,168,0,0.06)' : 'transparent' }}>
              <HowToVoteIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: isDark ? '#FFD27A' : '#B45309', fontSize: { xs: '1.05rem', sm: '1.1rem' } }}>
              {t('pages.voting.restrictionsTitle', { defaultValue: 'Voting Rights' })}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontFamily: FF_BODY, color: isDark ? '#F8D8A2' : '#92400E', lineHeight: 1.45, fontSize: { xs: '0.96rem', sm: '1rem' } }}>
              {t('pages.voting.restrictionsIntro', { defaultValue: 'You will receive voting rights once you complete the activity below.' })}
            </Typography>

            <Box component="ul" sx={{ mt: 0.55, pl: 2.4, color: isDark ? '#F8D8A2' : '#92400E', mb: 0 }}>
              <Typography component="li" variant="body2" sx={{ fontFamily: FF_BODY, lineHeight: 1.4, fontSize: { xs: '0.96rem', sm: '1rem' } }}>{t('pages.voting.restrictions.item2', { defaultValue: 'Interviewing (chat with aspirant), directly meeting, or having a phone call with a minimum of two aspirants.' })}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {hasVoted && votedAspirant && (
        <Card variant="outlined" sx={{ borderLeft: '4px solid', borderColor: 'success.main', bgcolor: isDark ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.08)', borderRadius: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 28 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: FF_BODY, color: textSecondary }}>
                {t('pages.voting.youHaveVotedFor')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, fontFamily: FF_HEADING, color: textPrimary }}>
                {votedAspirant.name}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
      <Card sx={{ px: { xs: 0, sm: 2 }, bgcolor: panelBg, border: `1px solid ${border}`, borderRadius: 3, boxShadow: isDark ? '0 16px 38px rgba(0,0,0,0.35)' : '0 8px 20px rgba(17,24,39,0.06)' }}>
        <Box sx={{ display: 'flex', height: 3 }}>
          {[BRAND.red, BRAND.blue, BRAND.brown].map(c => <Box key={c} sx={{ flex: 1, bgcolor: c }} />)}
        </Box>
        <CardContent sx={{ px: { xs: 2, sm: 3 }, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: isDark ? 'rgba(245,168,0,0.16)' : 'rgba(245,168,0,0.18)',
                color: GOLD,
                border: `1px solid ${isDark ? 'rgba(245,168,0,0.3)' : 'rgba(245,168,0,0.4)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <HowToVoteIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: textPrimary }}>
                {t('pages.voting.formTitle') || 'Voting Form'}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: FF_BODY, color: textSecondary }}>
                {t('pages.voting.formSubtitle') || 'Choose your candidate carefully'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{
              flexWrap: "wrap"
            }}>
              <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 220 }, p: 1.35, borderRadius: 2, bgcolor: isDark ? 'linear-gradient(135deg, rgba(37,58,154,0.16), rgba(245,168,0,0.08))' : 'linear-gradient(135deg, rgba(37,58,154,0.07), rgba(245,168,0,0.05))', border: `1px solid ${border}` }}>
                <Typography variant="body2" sx={{ fontFamily: FF_HEADING, color: textSecondary, fontWeight: 700, letterSpacing: '.03em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                  {t('pages.voting.wardLabel') || 'Ward Number'}:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, fontFamily: FF_HEADING, color: textPrimary, fontSize: '1.55rem', lineHeight: 1.1, mt: 0.45 }}>
                  {user?.wardNumber || wardInfo.number}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 220 }, p: 1.35, borderRadius: 2, bgcolor: isDark ? 'linear-gradient(135deg, rgba(37,58,154,0.12), rgba(245,168,0,0.06))' : 'linear-gradient(135deg, rgba(37,58,154,0.06), rgba(245,168,0,0.04))', border: `1px solid ${border}` }}>
                <Typography variant="body2" sx={{ fontFamily: FF_HEADING, color: textSecondary, fontWeight: 700, letterSpacing: '.03em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                  {t('userRegister.wardName') || 'Ward Name'}:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, fontFamily: FF_HEADING, color: textPrimary, fontSize: '1.25rem', lineHeight: 1.15, mt: 0.45 }}>
                  {user?.wardName || wardInfo.name || 'N/A'}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Stack spacing={2} sx={{ pb: 0.6 }}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {loadingAspirants ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CircularProgress size={24} />
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mt: 1
                  }}>
                  {t('common.loading') || 'Loading...'}
                </Typography>
              </Box>
            ) : aspirants.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="body2" sx={{
                  color: "text.secondary"
                }}>
                  {t('common.empty') || 'No candidates available'}
                </Typography>
              </Box>
            ) : (
              aspirants.map((aspirant) => (
                <Card key={aspirant.id} variant="outlined" sx={{ borderRadius: 2.2, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fff', border: `1px solid ${border}`, borderLeft: `3px solid ${BRAND.yellow}` }}>
                  <CardContent sx={{ p: { xs: 1.3, sm: 1.5 }, '&:last-child': { pb: { xs: 1.3, sm: 1.5 } } }}>
                    {isMobile ? (
                      <Stack spacing={1.05}>
                        <Stack direction="row" spacing={1.2} sx={{
                          alignItems: "center"
                        }}>
                          <Avatar
                            sx={{
                              width: 66,
                              height: 66,
                              bgcolor: isDark ? 'rgba(245,168,0,0.16)' : 'rgba(245,168,0,0.18)',
                              color: GOLD,
                              fontSize: 26,
                              fontWeight: 700,
                              border: `2px solid ${isDark ? 'rgba(245,168,0,0.4)' : 'rgba(245,168,0,0.55)'}`
                            }}
                            src={aspirant.selfieUrl || undefined}
                            alt={aspirant.name}
                          >
                            {(!aspirant.selfieUrl) && aspirant.name.charAt(0).toUpperCase()}
                          </Avatar>

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: textPrimary, lineHeight: 1.08, mb: 0.1, fontSize: '1.06rem' }}>
                              {aspirant.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: textSecondary, fontFamily: FF_BODY, lineHeight: 1.2 }}>
                              {aspirant.party || aspirant.bio || t('forms.aspirant.defaults.party')}
                            </Typography>
                            <Box sx={{ mt: 0.55, display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 0.85, py: 0.28, borderRadius: 1.2, bgcolor: isDark ? 'rgba(245,168,0,0.1)' : 'rgba(245,168,0,0.12)', border: `1px solid ${isDark ? 'rgba(245,168,0,0.26)' : 'rgba(245,168,0,0.34)'}` }}>
                              <Typography variant="caption" sx={{ color: muted, fontFamily: FF_HEADING, fontWeight: 700 }}>
                                {t('pages.voting.votesLabel') || 'Votes'}:
                              </Typography>
                              <Typography variant="caption" sx={{ color: textPrimary, fontFamily: FF_HEADING, fontWeight: 800 }}>
                                {voteCounts[aspirant.id] ?? 0}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>

                        <Stack direction="row" spacing={0.85} sx={{ width: '100%', '& > *': { flex: 1, minWidth: 0 } }}>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ minHeight: 36, py: 0.45, px: 1, fontSize: '0.72rem', fontFamily: FF_HEADING, fontWeight: 700, borderRadius: 1.6, borderColor: `${BRAND.yellow}`, color: isDark ? '#FFCB6A' : '#8A4A00', whiteSpace: 'normal', textAlign: 'center', '&:hover': { borderColor: BRAND.yellow, bgcolor: isDark ? 'rgba(245,168,0,0.07)' : 'rgba(245,168,0,0.08)' } }}
                            onClick={() => navigate(`/aspirants/${aspirant.id}`)}
                            fullWidth
                          >
                            {t('pages.voting.viewDetails') || 'View Details'}
                          </Button>
                          {(() => {
                            const isVotedFor = hasVoted && votedAspirantId === aspirant.id;
                            const shouldDisable = loading || !canVote || (hasVoted && !isVotedFor) || !isVotingAllowed;
                            if (isVotedFor) {
                              return (
                                <Box
                                  role="button"
                                  aria-disabled="true"
                                  tabIndex={-1}
                                  sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 0.6,
                                    minHeight: 36,
                                    py: 0.45,
                                    px: 1,
                                    bgcolor: '#28a745',
                                    color: '#fff',
                                    borderRadius: '7px',
                                    fontWeight: 700,
                                    pointerEvents: 'none',
                                    fontSize: i18n.language && i18n.language.startsWith('kn') ? '0.62rem' : '0.7rem',
                                    whiteSpace: 'normal',
                                    textAlign: 'center',
                                    lineHeight: 1.2,
                                  }}
                                >
                                  <CheckCircleIcon sx={{ fontSize: 14, color: '#fff' }} />
                                  <Box component="span">{t('pages.voting.voted') || 'Voted'}</Box>
                                </Box>
                              );
                            }
                            return (
                              <Button
                                variant="contained"
                                size="small"
                                disabled={shouldDisable}
                                color="primary"
                                onClick={() => handleVoteClick(aspirant)}
                                startIcon={
                                  loading && selectedAspirant?.id === aspirant.id ? (
                                    <CircularProgress size={16} />
                                  ) : (
                                    <HowToVoteIcon sx={{ fontSize: 16 }} />
                                  )
                                }
                                fullWidth
                                sx={{ minHeight: 36, py: 0.45, px: 1, fontSize: i18n.language && i18n.language.startsWith('kn') ? '0.66rem' : '0.74rem', color: '#fff', borderRadius: 1.6, fontFamily: FF_HEADING, fontWeight: 700, whiteSpace: 'normal', textAlign: 'center', lineHeight: 1.2 }}
                              >
                                {t('pages.voting.submit') || 'Vote'}
                              </Button>
                            );
                          })()}
                        </Stack>
                      </Stack>
                    ) : (
                      <Stack spacing={1.1}>
                        <Stack direction="row" spacing={1.4} sx={{
                          alignItems: "center"
                        }}>
                          <Avatar
                            sx={{
                              width: 66,
                              height: 66,
                              bgcolor: isDark ? 'rgba(245,168,0,0.16)' : 'rgba(245,168,0,0.18)',
                              color: GOLD,
                              fontSize: 26,
                              fontWeight: 700,
                              border: `2px solid ${isDark ? 'rgba(245,168,0,0.4)' : 'rgba(245,168,0,0.55)'}`
                            }}
                            src={aspirant.selfieUrl || undefined}
                            alt={aspirant.name}
                          >
                            {(!aspirant.selfieUrl) && aspirant.name.charAt(0).toUpperCase()}
                          </Avatar>

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: textPrimary, lineHeight: 1.08, mb: 0.1, fontSize: '1.2rem' }}>
                              {aspirant.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: textSecondary, fontFamily: FF_BODY, lineHeight: 1.2 }}>
                              {aspirant.party || aspirant.bio || t('forms.aspirant.defaults.party')}
                            </Typography>
                            <Box sx={{ mt: 0.55, display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 0.85, py: 0.28, borderRadius: 1.2, bgcolor: isDark ? 'rgba(245,168,0,0.1)' : 'rgba(245,168,0,0.12)', border: `1px solid ${isDark ? 'rgba(245,168,0,0.26)' : 'rgba(245,168,0,0.34)'}` }}>
                              <Typography variant="caption" sx={{ color: muted, fontFamily: FF_HEADING, fontWeight: 700 }}>
                                {t('pages.voting.votesLabel') || 'Votes'}:
                              </Typography>
                              <Typography variant="caption" sx={{ color: textPrimary, fontFamily: FF_HEADING, fontWeight: 800 }}>
                                {voteCounts[aspirant.id] ?? 0}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ flex: 1, minHeight: 38, py: 0.55, px: 1.3, fontSize: '0.82rem', fontFamily: FF_HEADING, fontWeight: 700, borderRadius: 1.8, borderColor: `${BRAND.yellow}`, color: isDark ? '#FFCB6A' : '#8A4A00', '&:hover': { borderColor: BRAND.yellow, bgcolor: isDark ? 'rgba(245,168,0,0.07)' : 'rgba(245,168,0,0.08)' } }}
                            onClick={() => navigate(`/aspirants/${aspirant.id}`)}
                          >
                            {t('pages.voting.viewDetails') || 'View Details'}
                          </Button>
                          {(() => {
                            const isVotedFor = hasVoted && votedAspirantId === aspirant.id;
                            const shouldDisable = loading || !canVote || (hasVoted && !isVotedFor) || !isVotingAllowed;
                            if (isVotedFor) {
                              return (
                                <Box
                                  role="button"
                                  aria-disabled="true"
                                  tabIndex={-1}
                                  sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1,
                                    flex: 1,
                                    minHeight: 38,
                                    py: 0.6,
                                    px: 1.5,
                                    bgcolor: '#28a745',
                                    color: '#fff',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    pointerEvents: 'none',
                                    fontSize: '0.9rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  <CheckCircleIcon sx={{ fontSize: 18, color: '#fff' }} />
                                  <Box component="span">{t('pages.voting.voted') || 'Voted'}</Box>
                                </Box>
                              );
                            }
                            return (
                              <Button
                                variant="contained"
                                size="medium"
                                disabled={shouldDisable}
                                color="primary"
                                onClick={() => handleVoteClick(aspirant)}
                                startIcon={
                                  loading && selectedAspirant?.id === aspirant.id ? (
                                    <CircularProgress size={18} />
                                  ) : (
                                    <HowToVoteIcon sx={{ fontSize: 18 }} />
                                  )
                                }
                                sx={{ flex: 1, minHeight: 38, py: 0.55, px: 1.3, fontSize: '0.92rem', color: '#fff', borderRadius: 1.8, fontFamily: FF_HEADING, fontWeight: 700 }}
                              >
                                {t('pages.voting.submit') || 'Vote'}
                              </Button>
                            );
                          })()}
                        </Stack>
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
        </CardContent>
      </Card>
      {/* SOP Dialog */}
      <Dialog open={sopDialogOpen} onClose={() => setSopDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}>
          {t('pages.voting.sopTitle') || 'Voter Standard Operating Procedure (SOP)'}
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
            {t('pages.voting.sopIntro') || 'Please read and acknowledge the following before casting your vote:'}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {t('pages.voting.sop.1.title')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 2
              }}>
              {t('pages.voting.sop.1.body')}
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {t('pages.voting.sop.2.title')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 2
              }}>
              {t('pages.voting.sop.2.body')}
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {t('pages.voting.sop.3.title')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 2
              }}>
              {t('pages.voting.sop.3.body')}
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {t('pages.voting.sop.4.title')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 2
              }}>
              {t('pages.voting.sop.4.body')}
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {t('pages.voting.sop.5.title')}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                mb: 2
              }}>
              {t('pages.voting.sop.5.body')}
            </Typography>
          </Box>

          <Box sx={{ bgcolor: 'warning.light', p: 2, borderRadius: 1, border: '1px solid', borderColor: 'warning.main' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t('pages.voting.sop.warningTitle')}
            </Typography>
            <Typography variant="body2" component="ul" sx={{ mt: 1, pl: 2 }}>
              <li>{t('pages.voting.sop.confirm1')}</li>
              <li>{t('pages.voting.sop.confirm2')}</li>
              <li>{t('pages.voting.sop.confirm3')}</li>
              <li>{t('pages.voting.sop.confirm4')}</li>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSopDialogOpen(false)} variant="outlined">
            {t('pages.voting.sopCancelButton') || 'Cancel'}
          </Button>
          <Button onClick={handleSopAccept} variant="contained" color="primary" sx={{ color: '#fff' }}>
            {t('pages.voting.sopAgreeButton') || 'I Agree & Proceed'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>{t('pages.voting.confirmTitle') || 'Confirm Vote'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('pages.voting.confirmDescription')}
          </DialogContentText>
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" gutterBottom sx={{
              color: "text.secondary"
            }}>
              {t('pages.voting.selectedCandidate')}:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedAspirant?.name}
            </Typography>
            {selectedAspirant && (
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mt: 0.5
                }}>
                {selectedAspirant.party || t('forms.aspirant.defaults.party')}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmOpen(false)}>{t('common.cancel') || 'Cancel'}</Button>
          <Button variant="contained" onClick={handleConfirmVote} startIcon={<HowToVoteIcon />}>
            {t('pages.voting.submit') || 'Vote'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Box
            sx={{
              width: 100,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'success.light',
              color: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 48 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            {t('pages.voting.successTitle') || 'Vote Cast Successfully!'}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mb: 1
            }}>
            {t('pages.voting.successLine1') || 'Your vote has been recorded securely.'}
          </Typography>
          <Typography variant="body2" sx={{
            color: "text.secondary"
          }}>
            {t('pages.voting.successLine2') || 'Thank you for participating in the democratic process.'}
          </Typography>
          <Box sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'grey.50', p: 2, borderRadius: 1, mt: 3, textAlign: 'left' }}>
            <Typography
              variant="caption"
              gutterBottom
              sx={{
                color: "text.secondary",
                display: "block"
              }}>
              {t('pages.voting.votedForLabel') || 'Voted For:'}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: textPrimary }}>
              {selectedAspirant?.name}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => setSuccessDialogOpen(false)} size="large">
            {t('pages.voting.close') || 'Close'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setOpen(false)}>
          {t('status.voteCast')}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default VotingPage;
