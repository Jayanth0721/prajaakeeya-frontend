import { Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import { ReactNode } from 'react';

interface ModernLoginLayoutProps {
    children: ReactNode;
}

export default function ModernLoginLayout({ children }: ModernLoginLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f6f8fb',
                p: { xs: 1, sm: 2 },
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: { xs: '100%', sm: 400, md: 420 },
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                    p: { xs: 3, sm: 5, md: 6 },
                    bgcolor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{ width: '100%' }}>{children}</Box>
            </Paper>
        </Box>
    );
}
