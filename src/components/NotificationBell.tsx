import { useState, useMemo } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  SxProps,
  Theme,
  useTheme,
} from '@mui/material';
import {
  NotificationsNone as BellIcon,
  HowToVote as VoteIcon,
  Campaign as CampaignIcon,
  ReportProblem as IssueIcon,
  PersonAddAlt as AspirantIcon,
  DoneAll as DoneAllIcon,
  NotificationsActive as NotificationsActiveIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import useThemeStore from '../store/useThemeStore';
import { BRAND } from '../theme';

const FF = "'Baloo 2', sans-serif";

export type NotificationKind = 'vote' | 'issue' | 'aspirant' | 'announcement';

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  body?: string;
  time: string;
  read?: boolean;
  href?: string;
}

interface NotificationBellProps {
  sx?: SxProps<Theme>;
  items?: NotificationItem[];
  onItemClick?: (n: NotificationItem) => void;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
}

const KIND_META: Record<NotificationKind, { icon: React.ReactNode; tint: string }> = {
  vote: { icon: <VoteIcon fontSize="small" />, tint: BRAND.blue },
  issue: { icon: <IssueIcon fontSize="small" />, tint: BRAND.red },
  aspirant: { icon: <AspirantIcon fontSize="small" />, tint: BRAND.brown },
  announcement: { icon: <CampaignIcon fontSize="small" />, tint: BRAND.saffron },
};

const SAMPLE: NotificationItem[] = [
  {
    id: 'n1',
    kind: 'vote',
    title: 'Ward voting window opens tomorrow',
    body: 'Cast your vote for ward aspirants between 9 AM – 6 PM.',
    time: '2h ago',
  },
  {
    id: 'n2',
    kind: 'issue',
    title: 'New public issue near you',
    body: 'Pothole reported on MG Road — 3 citizens upvoted.',
    time: '5h ago',
  },
  {
    id: 'n3',
    kind: 'aspirant',
    title: 'A new aspirant joined your ward',
    body: 'Tap to view profile and manifesto.',
    time: 'Yesterday',
    read: true,
  },
];

export default function NotificationBell({
  sx,
  items,
  onItemClick,
  onMarkAllRead,
  onViewAll,
}: NotificationBellProps) {
  const { t } = useTranslation();
  const { mode } = useThemeStore();
  const theme = useTheme();
  const isDark = mode === 'dark';

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [internalItems, setInternalItems] = useState<NotificationItem[]>(items ?? SAMPLE);

  const list = items ?? internalItems;
  const unreadCount = useMemo(() => list.filter((n) => !n.read).length, [list]);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleMarkAll = () => {
    if (onMarkAllRead) onMarkAllRead();
    else setInternalItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClickItem = (n: NotificationItem) => {
    if (onItemClick) onItemClick(n);
    else setInternalItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    handleClose();
  };

  const accent = isDark ? BRAND.yellow : BRAND.saffron;
  const panelBg = isDark
    ? 'radial-gradient(120% 140% at 0% 0%, rgba(200,24,10,0.14) 0%, rgba(14,12,12,0.98) 60%), #0e0c0c'
    : '#fff';
  const subText = isDark ? 'rgba(255,255,255,0.62)' : 'rgba(17,24,39,0.6)';

  return (
    <>
      <IconButton
        onClick={handleOpen}
        size="small"
        aria-label={t('notifications.title') || 'notifications'}
        sx={{
          width: 36,
          height: 36,
          color: accent,
          position: 'relative',
          '&:hover': {
            bgcolor: isDark ? 'rgba(245,168,0,0.10)' : 'rgba(245,168,0,0.12)',
          },
          ...sx,
        }}
      >
        <Badge
          badgeContent={unreadCount}
          max={9}
          overlap="circular"
          sx={{
            '& .MuiBadge-badge': {
              fontFamily: FF,
              fontWeight: 800,
              fontSize: '0.62rem',
              minWidth: 16,
              height: 16,
              padding: '0 4px',
              bgcolor: BRAND.red,
              color: '#fff',
              border: `2px solid ${isDark ? '#0e0c0c' : '#fff'}`,
              boxShadow: unreadCount > 0 ? `0 0 0 2px rgba(200,24,10,0.25)` : 'none',
            },
          }}
        >
          {unreadCount > 0 ? <NotificationsActiveIcon /> : <BellIcon />}
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: { xs: 'calc(100vw - 24px)', sm: 380 },
              maxWidth: 420,
              borderRadius: 3,
              overflow: 'hidden',
              background: panelBg,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : theme.palette.divider}`,
              boxShadow: isDark
                ? '0 24px 60px rgba(0,0,0,0.6)'
                : '0 18px 48px rgba(17,24,39,0.14)',
            },
          },
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', height: 3 }}>
          {[BRAND.red, BRAND.blue, BRAND.brown].map((c) => (
            <Box key={c} sx={{ flex: 1, bgcolor: c }} />
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              sx={{
                fontFamily: FF,
                fontWeight: 800,
                fontSize: '1rem',
                color: isDark ? '#fff' : 'text.primary',
              }}
            >
              {t('notifications.title') || 'Notifications'}
            </Typography>
            {unreadCount > 0 && (
              <Chip
                size="small"
                label={`${unreadCount} ${t('notifications.new') || 'new'}`}
                sx={{
                  height: 20,
                  fontFamily: FF,
                  fontWeight: 700,
                  fontSize: '0.66rem',
                  bgcolor: isDark ? 'rgba(245,168,0,0.18)' : 'rgba(245,168,0,0.16)',
                  color: isDark ? '#ffe4aa' : BRAND.brown,
                  border: `1px solid rgba(245,168,0,0.4)`,
                }}
              />
            )}
          </Box>
          <Button
            size="small"
            disabled={unreadCount === 0}
            startIcon={<DoneAllIcon sx={{ fontSize: 16 }} />}
            onClick={handleMarkAll}
            sx={{
              fontFamily: FF,
              fontWeight: 700,
              fontSize: '0.74rem',
              textTransform: 'none',
              color: accent,
              '&.Mui-disabled': { color: subText },
            }}
          >
            {t('notifications.markAllRead') || 'Mark all read'}
          </Button>
        </Box>
        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : undefined }} />

        {/* List */}
        {list.length === 0 ? (
          <Box sx={{ px: 3, py: 5, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                mx: 'auto',
                mb: 1.4,
                bgcolor: isDark ? 'rgba(245,168,0,0.14)' : 'rgba(245,168,0,0.15)',
                color: accent,
                border: `1px solid rgba(245,168,0,0.36)`,
              }}
            >
              <BellIcon />
            </Avatar>
            <Typography
              sx={{
                fontFamily: FF,
                fontWeight: 700,
                color: isDark ? '#fff' : 'text.primary',
                mb: 0.3,
              }}
            >
              {t('notifications.emptyTitle') || "You're all caught up"}
            </Typography>
            <Typography sx={{ fontFamily: FF, fontSize: '0.82rem', color: subText }}>
              {t('notifications.emptyBody') || 'New activity will show up here.'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0, maxHeight: 380, overflowY: 'auto' }}>
            {list.map((n) => {
              const meta = KIND_META[n.kind];
              return (
                <ListItemButton
                  key={n.id}
                  onClick={() => handleClickItem(n)}
                  alignItems="flex-start"
                  sx={{
                    px: 2,
                    py: 1.3,
                    gap: 1.2,
                    position: 'relative',
                    bgcolor: !n.read
                      ? isDark
                        ? 'rgba(245,168,0,0.06)'
                        : 'rgba(245,168,0,0.07)'
                      : 'transparent',
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'action.hover',
                    },
                    '&::before': !n.read
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: 6,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: BRAND.red,
                        }
                      : {},
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 44 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: isDark ? `${meta.tint}22` : `${meta.tint}1f`,
                        color: meta.tint,
                        border: `1px solid ${meta.tint}55`,
                      }}
                    >
                      {meta.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontFamily: FF,
                          fontWeight: n.read ? 600 : 800,
                          fontSize: '0.88rem',
                          lineHeight: 1.25,
                          color: isDark ? '#fff' : 'text.primary',
                        }}
                      >
                        {n.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        {n.body && (
                          <Typography
                            component="span"
                            sx={{
                              display: 'block',
                              fontFamily: FF,
                              fontSize: '0.78rem',
                              color: subText,
                              mt: 0.3,
                            }}
                          >
                            {n.body}
                          </Typography>
                        )}
                        <Typography
                          component="span"
                          sx={{
                            display: 'block',
                            fontFamily: FF,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '.04em',
                            textTransform: 'uppercase',
                            color: isDark ? 'rgba(255,255,255,0.42)' : 'rgba(17,24,39,0.42)',
                            mt: 0.5,
                          }}
                        >
                          {n.time}
                        </Typography>
                      </>
                    }
                  />
                </ListItemButton>
              );
            })}
          </List>
        )}

        {/* Footer */}
        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : undefined }} />
        <Box sx={{ p: 1 }}>
          <Button
            fullWidth
            size="small"
            onClick={() => {
              onViewAll?.();
              handleClose();
            }}
            sx={{
              fontFamily: FF,
              fontWeight: 800,
              textTransform: 'none',
              fontSize: '0.84rem',
              color: accent,
              borderRadius: 2,
              '&:hover': {
                bgcolor: isDark ? 'rgba(245,168,0,0.10)' : 'rgba(245,168,0,0.12)',
              },
            }}
          >
            {t('notifications.viewAll') || 'View all notifications'}
          </Button>
        </Box>
      </Popover>
    </>
  );
}
