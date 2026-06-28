import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Grid, Button, Divider, Chip, LinearProgress, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PollIcon from '@mui/icons-material/Poll';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import FeedbackIcon from '@mui/icons-material/Feedback';
import GroupsIcon from '@mui/icons-material/Groups';
import EventIcon from '@mui/icons-material/Event';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { BRAND } from '../../theme';

const FF_HEADING = "'Heming', 'Geist Variable', 'Geist', sans-serif";

interface UpcomingMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: number;
  type: 'ward' | 'constituency' | 'party';
}

interface ActivePoll {
  id: string;
  question: string;
  votes: number;
  endsIn: string;
  options: { label: string; percentage: number }[];
}

interface FeedbackItem {
  id: string;
  title: string;
  category: string;
  responses: number;
  urgency: 'high' | 'medium' | 'low';
}

const DEMO_MEETINGS: UpcomingMeeting[] = [
  { id: 'M1', title: 'Ward 150 Monthly Meeting', date: '2026-06-29', time: '10:00 AM', attendees: 45, type: 'ward' },
  { id: 'M2', title: 'BSK 3rd Stage Constituency Discussion', date: '2026-07-02', time: '4:00 PM', attendees: 120, type: 'constituency' },
  { id: 'M3', title: 'Party Workers Training Session', date: '2026-07-05', time: '11:00 AM', attendees: 85, type: 'party' },
];

const DEMO_POLLS: ActivePoll[] = [
  {
    id: 'P1',
    question: 'Should we prioritize road infrastructure or drainage in Ward 150?',
    votes: 234,
    endsIn: '2 days',
    options: [
      { label: 'Road Infrastructure', percentage: 62 },
      { label: 'Drainage System', percentage: 38 },
    ],
  },
  {
    id: 'P2',
    question: 'Preferred timing for weekend karyakarta meetings?',
    votes: 156,
    endsIn: '4 days',
    options: [
      { label: 'Saturday Morning', percentage: 45 },
      { label: 'Saturday Evening', percentage: 30 },
      { label: 'Sunday Morning', percentage: 25 },
    ],
  },
];

const DEMO_FEEDBACK: FeedbackItem[] = [
  { id: 'F1', title: 'Garbage collection schedule in BSK 3rd Stage', category: 'Sanitation', responses: 89, urgency: 'high' },
  { id: 'F2', title: 'Street light maintenance in Kathriguppe', category: 'Infrastructure', responses: 67, urgency: 'medium' },
  { id: 'F3', title: 'Public park maintenance request', category: 'Parks', responses: 45, urgency: 'low' },
];

const GuestKaryakartasPage: React.FC = () => {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);

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
            Karyakartas
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: FF_HEADING, color: '#6B7280', maxWidth: 600, mx: 'auto' }}>
            The backbone of our democratic movement. Karyakartas actively participate in polls, feedback, and meeting sessions to ensure every voice is heard.
          </Typography>
        </Box>

        {!registered ? (
          <Paper sx={{ p: 4, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'inline-flex', p: 2, borderRadius: '50%', bgcolor: `${BRAND.red}10`, mb: 2 }}>
              <HowToRegIcon sx={{ fontSize: 48, color: BRAND.red }} />
            </Box>
            <Typography variant="h5" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 1 }}>
              Become a Karyakarta
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: FF_HEADING, color: '#6B7280', mb: 3, maxWidth: 500, mx: 'auto' }}>
              Register as a karyakarta to participate in polls, attend meeting sessions, submit feedback, and help strengthen our democratic platform.
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setRegistered(true)}
              sx={{ fontFamily: FF_HEADING, fontWeight: 700, bgcolor: BRAND.red, px: 4, '&:hover': { bgcolor: BRAND.red2 } }}
            >
              Register as Karyakarta
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ p: 4, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 32 }} />
              <Box>
                <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827' }}>
                  You're registered as a Karyakarta!
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: FF_HEADING, color: '#6B7280' }}>
                  Welcome to the team. Your voice matters in shaping our democracy.
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', textAlign: 'center' }}>
              <PollIcon sx={{ fontSize: 40, color: BRAND.red, mb: 1 }} />
              <Typography variant="h4" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: '#111827' }}>
                12
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>
                Active Polls
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', textAlign: 'center' }}>
              <VideoCallIcon sx={{ fontSize: 40, color: BRAND.yellow, mb: 1 }} />
              <Typography variant="h4" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: '#111827' }}>
                8
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>
                Meeting Sessions
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', textAlign: 'center' }}>
              <FeedbackIcon sx={{ fontSize: 40, color: BRAND.blue, mb: 1 }} />
              <Typography variant="h4" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: '#111827' }}>
                24
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>
                Feedback Items
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <VideoCallIcon sx={{ color: BRAND.red }} />
                <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827' }}>
                  Upcoming Meetings
                </Typography>
              </Box>
              {DEMO_MEETINGS.map((meeting) => (
                <Box key={meeting.id} sx={{ mb: 2, p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#111827' }}>
                      {meeting.title}
                    </Typography>
                    <Chip
                      label={meeting.type}
                      size="small"
                      sx={{
                        fontFamily: FF_HEADING,
                        fontWeight: 700,
                        fontSize: '10px',
                        bgcolor: meeting.type === 'ward' ? `${BRAND.red}15` : meeting.type === 'constituency' ? `${BRAND.yellow}15` : `${BRAND.blue}15`,
                        color: meeting.type === 'ward' ? BRAND.red : meeting.type === 'constituency' ? BRAND.yellow : BRAND.blue,
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EventIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                      <Typography variant="caption" sx={{ fontFamily: FF_HEADING, color: '#6B7280' }}>
                        {meeting.date}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                      <Typography variant="caption" sx={{ fontFamily: FF_HEADING, color: '#6B7280' }}>
                        {meeting.time}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <GroupsIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                      <Typography variant="caption" sx={{ fontFamily: FF_HEADING, color: '#6B7280' }}>
                        {meeting.attendees} attending
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
              <Button fullWidth variant="outlined" sx={{ fontFamily: FF_HEADING, fontWeight: 700, mt: 1 }}>
                View All Meetings
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <PollIcon sx={{ color: BRAND.red }} />
                <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827' }}>
                  Active Polls
                </Typography>
              </Box>
              {DEMO_POLLS.map((poll) => (
                <Box key={poll.id} sx={{ mb: 3, p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#111827', mb: 1 }}>
                    {poll.question}
                  </Typography>
                  {poll.options.map((option, idx) => (
                    <Box key={idx} sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#6B7280' }}>
                          {option.label}
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: BRAND.red }}>
                          {option.percentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={option.percentage}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(0,0,0,0.06)',
                          '& .MuiLinearProgress-bar': { bgcolor: idx === 0 ? BRAND.red : BRAND.yellow, borderRadius: 3 },
                        }}
                      />
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="caption" sx={{ fontFamily: FF_HEADING, color: '#9CA3AF' }}>
                      {poll.votes} votes • Ends in {poll.endsIn}
                    </Typography>
                    <Button size="small" variant="text" sx={{ fontFamily: FF_HEADING, fontWeight: 700 }}>
                      Vote Now
                    </Button>
                  </Box>
                </Box>
              ))}
              <Button fullWidth variant="outlined" sx={{ fontFamily: FF_HEADING, fontWeight: 700, mt: 1 }}>
                View All Polls
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <FeedbackIcon sx={{ color: BRAND.red }} />
            <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827' }}>
              Priority Feedback Items
            </Typography>
          </Box>
          <List disablePadding>
            {DEMO_FEEDBACK.map((item, idx) => (
              <ListItem
                key={item.id}
                sx={{
                  px: 2,
                  py: 1.5,
                  bgcolor: '#F9FAFB',
                  borderRadius: 2,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: item.urgency === 'high' ? `${BRAND.red}15` : item.urgency === 'medium' ? `${BRAND.yellow}15` : `${BRAND.blue}15` }}>
                    <FeedbackIcon sx={{ color: item.urgency === 'high' ? BRAND.red : item.urgency === 'medium' ? BRAND.yellow : BRAND.blue, fontSize: 20 }} />
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#111827' }}>
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                        <Chip label={item.category} size="small" sx={{ fontFamily: FF_HEADING, fontWeight: 700, fontSize: '9px', height: 20 }} />
                        <Typography variant="caption" sx={{ fontFamily: FF_HEADING, color: '#9CA3AF' }}>
                          {item.responses} responses
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
                <Chip
                  label={item.urgency}
                  size="small"
                  sx={{
                    fontFamily: FF_HEADING,
                    fontWeight: 700,
                    fontSize: '10px',
                    bgcolor: item.urgency === 'high' ? `${BRAND.red}15` : item.urgency === 'medium' ? `${BRAND.yellow}15` : `${BRAND.blue}15`,
                    color: item.urgency === 'high' ? BRAND.red : item.urgency === 'medium' ? BRAND.yellow : BRAND.blue,
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Button fullWidth variant="outlined" sx={{ fontFamily: FF_HEADING, fontWeight: 700, mt: 2 }}>
            View All Feedback
          </Button>
        </Paper>

        <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px', mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <TrendingUpIcon sx={{ color: BRAND.red }} />
            <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827' }}>
              Karyakarta Benefits
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {[
              { title: 'Vote in Decisions', desc: 'Your vote counts in party decisions and candidate selections', icon: '🗳️' },
              { title: 'Attend Meetings', desc: 'Join ward, constituency, and party-wide discussion sessions', icon: '📹' },
              { title: 'Submit Feedback', desc: 'Report local issues and suggest improvements directly', icon: '📝' },
              { title: 'Earn Recognition', desc: 'Track your contributions and earn badges for participation', icon: '🏆' },
              { title: 'Priority Updates', desc: 'Receive early access to party announcements and events', icon: '📢' },
              { title: 'Network Locally', desc: 'Connect with fellow karyakartas in your ward and constituency', icon: '🤝' },
            ].map((benefit, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 2, height: '100%' }}>
                  <Typography sx={{ fontSize: '24px', mb: 1 }}>{benefit.icon}</Typography>
                  <Typography variant="subtitle2" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 0.5 }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: FF_HEADING, color: '#6B7280' }}>
                    {benefit.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default GuestKaryakartasPage;