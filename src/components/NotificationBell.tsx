import { IconButton, Badge, SxProps, Theme } from '@mui/material';
import {
  NotificationsNone as BellIcon,
  NotificationsActive as BellActiveIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useThemeStore from '../store/useThemeStore';
import { BRAND } from '../theme';

const FF = "'Baloo 2', sans-serif";

interface NotificationBellProps {
  /** Unread count rendered on the badge. Defaults to 0 (no badge). */
  count?: number;
  /** Destination route. Defaults to `/user/notifications`. */
  to?: string;
  sx?: SxProps<Theme>;
}

export default function NotificationBell({
  count = 0,
  to = '/user/notifications',
  sx,
}: NotificationBellProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useThemeStore();
  const isDark = mode === 'dark';

  const accent = isDark ? BRAND.yellow : BRAND.saffron;
  const hasUnread = count > 0;

  return (
    <IconButton
      onClick={() => navigate(to)}
      size="small"
      aria-label={t('notifications.title') || 'Notifications'}
      sx={{
        width: 36,
        height: 36,
        color: accent,
        '&:hover': {
          bgcolor: isDark ? 'rgba(245,168,0,0.10)' : 'rgba(245,168,0,0.12)',
        },
        ...sx,
      }}
    >
      <Badge
        badgeContent={count}
        max={9}
        overlap="circular"
        invisible={!hasUnread}
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
            boxShadow: hasUnread ? '0 0 0 2px rgba(200,24,10,0.25)' : 'none',
          },
        }}
      >
        {hasUnread ? <BellActiveIcon /> : <BellIcon />}
      </Badge>
    </IconButton>
  );
}
