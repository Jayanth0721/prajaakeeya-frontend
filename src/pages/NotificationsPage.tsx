import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Button,
  Chip,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  NotificationsNone as BellIcon,
  HowToVote as VoteIcon,
  Campaign as CampaignIcon,
  ReportProblem as IssueIcon,
  PersonAddAlt as AspirantIcon,
  DoneAll as DoneAllIcon,
  DeleteOutline as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BRAND } from '../theme';

const FF = "'Baloo 2', sans-serif";

type Kind = 'vote' | 'issue' | 'aspirant' | 'announcement';
type Bucket = 'today' | 'yesterday' | 'earlier';

interface NotificationItem {
  id: string;
  kind: Kind;
  title: string;
  body?: string;
  time: string;
  bucket: Bucket;
  read?: boolean;
  href?: string;
}

const SAMPLE: NotificationItem[] = [
  {
    id: 'n1',
    kind: 'vote',
    title: 'Ward voting window opens tomorrow',
    body: 'Cast your vote for ward aspirants between 9 AM – 6 PM.',
    time: '2h ago',
    bucket: 'today',
    href: '/user/vote',
  },
  {
    id: 'n2',
    kind: 'issue',
    title: 'New public issue near you',
    body: 'Pothole reported on MG Road — 3 citizens upvoted.',
    time: '5h ago',
    bucket: 'today',
    href: '/user/civic-issues',
  },
  {
    id: 'n3',
    kind: 'aspirant',
    title: 'A new aspirant joined your ward',
    body: 'Tap to view profile and manifesto.',
    time: 'Yesterday, 6:14 PM',
    bucket: 'yesterday',
    read: true,
    href: '/user/aspirantslist',
  },
  {
    id: 'n4',
    kind: 'announcement',
    title: 'Welcome to Prajaakeeya',
    body: 'Get started by completing your profile.',
    time: '3 days ago',
    bucket: 'earlier',
    read: true,
    href: '/user/complete-profile',
  },
];

export default function NotificationsPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { t } = useTranslation();

  const [items, setItems] = useState<NotificationItem[]>(SAMPLE);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const accent = isDark ? BRAND.yellow : BRAND.saffron;
  const textPrimary = theme.palette.text.primary;
  const subText = isDark ? 'rgba(255,255,255,0.62)' : 'rgba(17,24,39,0.6)';
  const borderFaint = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(17,24,39,0.10)';

  const KIND_META: Record<Kind, { icon: React.ReactNode; tint: string; label: string }> = {
    vote: {
      icon: <VoteIcon fontSize="small" />,
      tint: BRAND.blue,
      label: t('notifications.kinds.vote') || 'Voting',
    },
    issue: {
      icon: <IssueIcon fontSize="small" />,
      tint: BRAND.red,
      label: t('notifications.kinds.issue') || 'Public Issue',
    },
    aspirant: {
      icon: <AspirantIcon fontSize="small" />,
      tint: BRAND.brown,
      label: t('notifications.kinds.aspirant') || 'Aspirant',
    },
    announcement: {
      icon: <CampaignIcon fontSize="small" />,
      tint: BRAND.saffron,
      label: t('notifications.kinds.announcement') || 'Announcement',
    },
  };

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);
  const visible = useMemo(
    () => (filter === 'unread' ? items.filter((n) => !n.read) : items),
    [items, filter],
  );

  const grouped = useMemo(() => {
    const map: Record<Bucket, NotificationItem[]> = { today: [], yesterday: [], earlier: [] };
    for (const n of visible) map[n.bucket].push(n);
    return map;
  }, [visible]);

  const handleMarkAll = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const handleClear = () => setItems([]);

  const handleClickItem = (n: NotificationItem) => {
    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    if (n.href) navigate(n.href);
  };

  const sectionLabel = (b: Bucket) =>
    b === 'today'
      ? t('notifications.sections.today') || 'Today'
      : b === 'yesterday'
        ? t('notifications.sections.yesterday') || 'Yesterday'
        : t('notifications.sections.earlier') || 'Earlier';

  return (
    <Stack spacing={3} sx={{ pb: { xs: 4, md: 6 } }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1.4, sm: 2 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title={t('common.back') || 'Back'}>
              <IconButton
                onClick={() => navigate(-1)}
                size="small"
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  color: accent,
                  border: `1px solid ${borderFaint}`,
                  borderRadius: 2,
                  p: 0.8,
                  background: 'linear-gradient(135deg,rgba(200,24,10,.10),rgba(245,168,0,.10))',
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>

            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                bgcolor: 'rgba(245,168,0,0.12)',
                color: accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(245,168,0,0.3)',
                flexShrink: 0,
              }}
            >
              <BellIcon />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="h4"
                  sx={{ fontFamily: FF, fontWeight: 800, color: textPrimary, lineHeight: 1.1 }}
                >
                  {t('notifications.title') || 'Notifications'}
                </Typography>
                {unreadCount > 0 && (
                  <Chip
                    size="small"
                    label={`${unreadCount} ${t('notifications.new') || 'new'}`}
                    sx={{
                      height: 22,
                      fontFamily: FF,
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      bgcolor: isDark ? 'rgba(245,168,0,0.18)' : 'rgba(245,168,0,0.16)',
                      color: isDark ? '#ffe4aa' : BRAND.brown,
                      border: `1px solid rgba(245,168,0,0.4)`,
                    }}
                  />
                )}
              </Box>
              <Typography variant="body2" sx={{ fontFamily: FF, color: subText, mt: 0.3 }}>
                {t('notifications.subtitle') || 'Stay updated on your ward, issues, and aspirants.'}
              </Typography>
            </Box>
          </Box>

          {/* Right side actions */}
          <Stack direction="row" spacing={1} sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}>
            <Button
              size="small"
              variant="outlined"
              disabled={unreadCount === 0}
              startIcon={<DoneAllIcon sx={{ fontSize: 18 }} />}
              onClick={handleMarkAll}
              sx={{
                fontFamily: FF,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 50,
                borderColor: borderFaint,
                color: accent,
                '&:hover': {
                  borderColor: accent,
                  bgcolor: isDark ? 'rgba(245,168,0,0.08)' : 'rgba(245,168,0,0.10)',
                },
                '&.Mui-disabled': { color: subText, borderColor: borderFaint },
              }}
            >
              {t('notifications.markAllRead') || 'Mark all read'}
            </Button>
            <Tooltip title={t('notifications.clearAll') || 'Clear all'}>
              <span>
                <IconButton
                  size="small"
                  disabled={items.length === 0}
                  onClick={handleClear}
                  sx={{
                    color: subText,
                    border: `1px solid ${borderFaint}`,
                    borderRadius: 50,
                    '&:hover': { color: BRAND.red, borderColor: BRAND.red },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Box>
      </motion.div>

      {/* Filter tabs */}
      <ToggleButtonGroup
        value={filter}
        exclusive
        size="small"
        onChange={(_, v) => v && setFilter(v)}
        sx={{
          alignSelf: 'flex-start',
          '& .MuiToggleButton-root': {
            fontFamily: FF,
            fontWeight: 700,
            textTransform: 'none',
            border: `1px solid ${borderFaint}`,
            color: subText,
            px: 2,
            '&.Mui-selected': {
              bgcolor: isDark ? 'rgba(245,168,0,0.16)' : 'rgba(245,168,0,0.14)',
              color: accent,
              borderColor: accent,
            },
          },
        }}
      >
        <ToggleButton value="all">
          {t('notifications.tabs.all') || 'All'} ({items.length})
        </ToggleButton>
        <ToggleButton value="unread">
          {t('notifications.tabs.unread') || 'Unread'} ({unreadCount})
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Empty state */}
      {visible.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: { xs: 6, md: 9 },
            border: `1px dashed ${borderFaint}`,
            borderRadius: 4,
            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(17,24,39,0.02)',
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 1.6,
              bgcolor: isDark ? 'rgba(245,168,0,0.14)' : 'rgba(245,168,0,0.15)',
              color: accent,
              border: `1px solid rgba(245,168,0,0.36)`,
            }}
          >
            <BellIcon />
          </Avatar>
          <Typography
            sx={{ fontFamily: FF, fontWeight: 800, color: textPrimary, fontSize: '1.05rem' }}
          >
            {filter === 'unread'
              ? t('notifications.emptyUnreadTitle') || 'No unread notifications'
              : t('notifications.emptyTitle') || "You're all caught up"}
          </Typography>
          <Typography sx={{ fontFamily: FF, color: subText, mt: 0.5 }}>
            {t('notifications.emptyBody') || 'New activity will show up here.'}
          </Typography>
        </Box>
      )}

      {/* Grouped list */}
      {(['today', 'yesterday', 'earlier'] as Bucket[]).map((bucket) => {
        const list = grouped[bucket];
        if (!list || list.length === 0) return null;
        return (
          <Box key={bucket}>
            <Typography
              sx={{
                fontFamily: FF,
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
                color: subText,
                mb: 1,
              }}
            >
              {sectionLabel(bucket)}
            </Typography>

            <Stack spacing={1.2}>
              {list.map((n) => {
                const meta = KIND_META[n.kind];
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Box
                      onClick={() => handleClickItem(n)}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        gap: 1.4,
                        p: { xs: 1.4, sm: 1.8 },
                        borderRadius: 3,
                        cursor: 'pointer',
                        border: `1px solid ${
                          !n.read
                            ? isDark
                              ? 'rgba(245,168,0,0.32)'
                              : 'rgba(245,168,0,0.42)'
                            : borderFaint
                        }`,
                        background: !n.read
                          ? isDark
                            ? 'linear-gradient(135deg, rgba(245,168,0,0.08), rgba(200,24,10,0.05))'
                            : 'linear-gradient(135deg, rgba(245,168,0,0.08), rgba(200,24,10,0.04))'
                          : isDark
                            ? 'rgba(255,255,255,0.02)'
                            : '#fff',
                        transition: 'transform .15s ease, box-shadow .15s ease, border-color .15s ease',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          borderColor: accent,
                          boxShadow: isDark
                            ? '0 10px 24px rgba(0,0,0,0.35)'
                            : '0 8px 22px rgba(17,24,39,0.08)',
                        },
                      }}
                    >
                      {!n.read && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 14,
                            right: 14,
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: BRAND.red,
                            boxShadow: `0 0 0 4px ${isDark ? 'rgba(200,24,10,0.18)' : 'rgba(200,24,10,0.14)'}`,
                          }}
                        />
                      )}
                      <Avatar
                        sx={{
                          width: 42,
                          height: 42,
                          flexShrink: 0,
                          bgcolor: isDark ? `${meta.tint}22` : `${meta.tint}1f`,
                          color: meta.tint,
                          border: `1px solid ${meta.tint}55`,
                        }}
                      >
                        {meta.icon}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0, pr: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.8,
                            flexWrap: 'wrap',
                            mb: 0.3,
                          }}
                        >
                          <Chip
                            size="small"
                            label={meta.label}
                            sx={{
                              height: 18,
                              fontFamily: FF,
                              fontWeight: 700,
                              fontSize: '0.62rem',
                              letterSpacing: '.04em',
                              textTransform: 'uppercase',
                              bgcolor: `${meta.tint}1a`,
                              color: meta.tint,
                              border: `1px solid ${meta.tint}55`,
                            }}
                          />
                          <Typography
                            sx={{
                              fontFamily: FF,
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: subText,
                            }}
                          >
                            • {n.time}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: FF,
                            fontWeight: n.read ? 600 : 800,
                            fontSize: '0.95rem',
                            lineHeight: 1.3,
                            color: textPrimary,
                          }}
                        >
                          {n.title}
                        </Typography>
                        {n.body && (
                          <Typography
                            sx={{
                              fontFamily: FF,
                              fontSize: '0.84rem',
                              color: subText,
                              mt: 0.4,
                              lineHeight: 1.4,
                            }}
                          >
                            {n.body}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </motion.div>
                );
              })}
            </Stack>
          </Box>
        );
      })}

      {items.length > 0 && (
        <Divider sx={{ borderColor: borderFaint, opacity: 0.6 }}>
          <Typography
            sx={{
              fontFamily: FF,
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: subText,
              px: 1,
            }}
          >
            {t('notifications.endOfList') || "You're all caught up"}
          </Typography>
        </Divider>
      )}
    </Stack>
  );
}
