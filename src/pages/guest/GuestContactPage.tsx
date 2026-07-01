import React from 'react';
import { Box, Container, Typography, Paper, Grid, Button, Divider, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LanguageIcon from '@mui/icons-material/Language';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/X';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BRAND } from '../../theme';

const FF_HEADING = "'Heming', 'Geist Variable', 'Geist', sans-serif";

const GuestContactPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ maxWidth: '1600px', mx: 'auto' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/guest/dashboard')}
          sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280', mb: 3 }}
        >
          Back to Dashboard
        </Button>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: '#111827', mb: 1 }}>
            Contact Us
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: FF_HEADING, color: '#6B7280' }}>
            Get in touch with the Uttama Prajaakeeya Party
          </Typography>
        </Box>

        <Paper sx={{ p: 4, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', mb: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ p: 1.5, bgcolor: `${BRAND.red}10`, borderRadius: 2 }}>
                  <LocationOnIcon sx={{ color: BRAND.red }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 0.5 }}>
                    Main Headquarters
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: FF_HEADING, color: '#6B7280', lineHeight: 1.7 }}>
                    No. 7A, "Sumane", 1st Cross, 6th Phase, BSK 3rd Stage,<br />
                    Kathriguppe, Bengaluru, Karnataka - 560085
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ p: 1.5, bgcolor: `${BRAND.red}10`, borderRadius: 2 }}>
                  <EmailIcon sx={{ color: BRAND.red }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 0.5 }}>
                    Email
                  </Typography>
                  <Link href="mailto:prajaakeeyainfo@gmail.com" sx={{ fontFamily: FF_HEADING, color: BRAND.blue, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    prajaakeeyainfo@gmail.com
                  </Link>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ p: 1.5, bgcolor: `${BRAND.red}10`, borderRadius: 2 }}>
                  <PhoneIcon sx={{ color: BRAND.red }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 0.5 }}>
                    Phone
                  </Typography>
                  <Link href="tel:+917975822460" sx={{ fontFamily: FF_HEADING, color: BRAND.blue, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    +91 79758 22460
                  </Link>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ p: 1.5, bgcolor: `${BRAND.red}10`, borderRadius: 2 }}>
                  <ScheduleIcon sx={{ color: BRAND.red }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 0.5 }}>
                    Office Hours
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: FF_HEADING, color: '#6B7280' }}>
                    Monday to Sunday, typically open from 10:00 AM
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ p: 1.5, bgcolor: `${BRAND.red}10`, borderRadius: 2 }}>
                  <LanguageIcon sx={{ color: BRAND.red }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 0.5 }}>
                    Official Website
                  </Typography>
                  <Link href="https://www.prajaakeeya.org/" target="_blank" sx={{ fontFamily: FF_HEADING, color: BRAND.blue, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    www.prajaakeeya.org
                  </Link>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 4, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', mb: 4 }}>
          <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 2 }}>
            Regional Offices
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: FF_HEADING, color: '#6B7280' }}>
            There are also various regional offices and local representatives, such as the branch located near Ganapati Temple Road in Andrahalli.
          </Typography>
        </Paper>

        <Paper sx={{ p: 4, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
          <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 3 }}>
            Follow Us on Social Media
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<FacebookIcon />}
              href="https://www.facebook.com/prajaakeeya.org/"
              target="_blank"
              sx={{ fontFamily: FF_HEADING, fontWeight: 700, bgcolor: '#1877F2', '&:hover': { bgcolor: '#166FE5' } }}
            >
              Facebook
            </Button>
            <Button
              variant="contained"
              startIcon={<InstagramIcon />}
              href="https://www.instagram.com/prajaakeeyalive/"
              target="_blank"
              sx={{ fontFamily: FF_HEADING, fontWeight: 700, bgcolor: '#E4405F', '&:hover': { bgcolor: '#D63850' } }}
            >
              Instagram
            </Button>
            <Button
              variant="contained"
              startIcon={<TwitterIcon />}
              href="https://x.com/Prajaakeeyalive"
              target="_blank"
              sx={{ fontFamily: FF_HEADING, fontWeight: 700, bgcolor: '#000', '&:hover': { bgcolor: '#333' } }}
            >
              X (Twitter)
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default GuestContactPage;