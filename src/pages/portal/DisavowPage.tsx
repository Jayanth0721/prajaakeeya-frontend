import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button,
  Grid, Chip, AppBar, Toolbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tabs, Tab, TextField, Select, MenuItem, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions,
  LinearProgress
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { BRAND } from '../../theme';
import prajakeeyaLogo from '../../assets/images/prajakeeya.webp';
import LanguageSelector from '../../components/LanguageSelector';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import NewsletterIcon from '@mui/icons-material/Markunread';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import GavelIcon from '@mui/icons-material/Gavel';
import FlagIcon from '@mui/icons-material/Flag';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningIcon from '@mui/icons-material/Warning';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReplyIcon from '@mui/icons-material/Reply';
import DownloadIcon from '@mui/icons-material/Download';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const FF_HEADING = "'Heming', 'Geist Variable', 'Geist', sans-serif";

type ContentStatus = 'official' | 'verified' | 'disputed' | 'unverified';
type RequestStatus = 'pending' | 'under-review' | 'resolved' | 'appealed';
type Priority = 'low' | 'medium' | 'high' | 'critical';

interface DisavowRequest {
  id: string;
  title: string;
  description: string;
  contentSource: string;
  sourceType: 'facebook' | 'youtube' | 'twitter' | 'newspaper' | 'website' | 'other';
  contentStatus: ContentStatus;
  status: RequestStatus;
  priority: Priority;
  filedBy: string;
  filedDate: string;
  aspirantInvolved: string;
  citizenSupport: number;
  aspirantResponse?: string;
  responseDate?: string;
  resolution?: string;
  resolutionDate?: string;
  appealCount: number;
  verificationCount: number;
  disputeCount: number;
}

interface TransparencyLog {
  id: string;
  requestId: string;
  action: string;
  performedBy: string;
  date: string;
  details: string;
}

const DEMO_DISAVOW_REQUESTS: DisavowRequest[] = [
  {
    id: 'DIS-001',
    title: 'False Claim: Water Project Budget Misrepresentation',
    description: 'Aspirant claimed ₹50 lakhs allocated for water project. Actual budget is ₹35 lakhs as per official records.',
    contentSource: 'Facebook Post by Ramesh Kumar',
    sourceType: 'facebook',
    contentStatus: 'disputed',
    status: 'under-review',
    priority: 'high',
    filedBy: 'Vijay Kulkarni',
    filedDate: '2026-06-18',
    aspirantInvolved: 'Ramesh Kumar',
    citizenSupport: 45,
    verificationCount: 12,
    disputeCount: 3,
    appealCount: 0
  },
  {
    id: 'DIS-002',
    title: 'Unverified: Health Camp Date Announcement',
    description: 'Posted health camp for June 25, but official calendar shows it is scheduled for July 5.',
    contentSource: 'Twitter/X Post',
    sourceType: 'twitter',
    contentStatus: 'verified',
    status: 'resolved',
    priority: 'medium',
    filedBy: 'Lakshmi Prasad',
    filedDate: '2026-06-15',
    aspirantInvolved: 'Dr. Sunitha Rao',
    citizenSupport: 28,
    aspirantResponse: 'Apologies for the confusion. The date was updated after the initial post.',
    responseDate: '2026-06-16',
    resolution: 'Clarification provided. Content marked as verified.',
    resolutionDate: '2026-06-17',
    verificationCount: 8,
    disputeCount: 1,
    appealCount: 0
  },
  {
    id: 'DIS-003',
    title: 'Misleading: Road Repair Completion Claim',
    description: 'Aspirant claimed 90% completion of road repairs. Field verification shows only 45% completion.',
    contentSource: 'YouTube Video Statement',
    sourceType: 'youtube',
    contentStatus: 'disputed',
    status: 'pending',
    priority: 'critical',
    filedBy: 'Ravi Shetty',
    filedDate: '2026-06-20',
    aspirantInvolved: 'Anand Krishnamurthy',
    citizenSupport: 67,
    verificationCount: 5,
    disputeCount: 8,
    appealCount: 2
  },
  {
    id: 'DIS-004',
    title: 'Official: Budget Meeting Minutes Authenticated',
    description: 'Official budget meeting minutes with verified seal and signatures.',
    contentSource: 'Official Document Upload',
    sourceType: 'other',
    contentStatus: 'official',
    status: 'resolved',
    priority: 'low',
    filedBy: 'Admin',
    filedDate: '2026-06-10',
    aspirantInvolved: 'Multiple',
    citizenSupport: 0,
    resolution: 'Document verified as official. No action needed.',
    resolutionDate: '2026-06-11',
    verificationCount: 3,
    disputeCount: 0,
    appealCount: 0
  },
  {
    id: 'DIS-005',
    title: 'Claim: New Park Construction Started',
    description: 'Social media post claims new park construction started. No municipal records confirm this.',
    contentSource: 'WhatsApp Forward Screenshot',
    sourceType: 'other',
    contentStatus: 'unverified',
    status: 'pending',
    priority: 'medium',
    filedBy: 'Meera Nair',
    filedDate: '2026-06-19',
    aspirantInvolved: 'Priya Sharma',
    citizenSupport: 15,
    verificationCount: 2,
    disputeCount: 5,
    appealCount: 0
  },
];

const DEMO_TRANSPARENCY_LOG: TransparencyLog[] = [
  { id: 'LOG-001', requestId: 'DIS-001', action: 'Filed', performedBy: 'Vijay Kulkarni', date: '2026-06-18', details: 'Disavow request submitted for review' },
  { id: 'LOG-002', requestId: 'DIS-001', action: 'Assigned', performedBy: 'Admin', date: '2026-06-18', details: 'Request assigned to verification team' },
  { id: 'LOG-003', requestId: 'DIS-001', action: 'Evidence Submitted', performedBy: 'Vijay Kulkarni', date: '2026-06-19', details: 'Budget documents uploaded as evidence' },
  { id: 'LOG-004', requestId: 'DIS-002', action: 'Response Received', performedBy: 'Dr. Sunitha Rao', date: '2026-06-16', details: 'Aspirant provided clarification' },
  { id: 'LOG-005', requestId: 'DIS-002', action: 'Resolved', performedBy: 'Admin', date: '2026-06-17', details: 'Request closed with clarification' },
  { id: 'LOG-006', requestId: 'DIS-003', action: 'Appealed', performedBy: 'Anand Krishnamurthy', date: '2026-06-21', details: 'Aspirant filed appeal against dispute claim' },
  { id: 'LOG-007', requestId: 'DIS-003', action: 'Escalated', performedBy: 'Admin', date: '2026-06-21', details: 'Appeal escalated to senior review board' },
];

const DisavowPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<DisavowRequest | null>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState('');

  const navItems = [
    { label: 'Aspirant+', icon: <HomeRoundedIcon />, path: '/portal' },
    { label: 'Prajaalytics', icon: <ShowChartIcon />, path: '/portal/prajaalytics' },
    { label: 'Prajaa Varte', icon: <NewsletterIcon />, path: '/portal/prajaa-varte' },
    { label: 'Disavow', icon: <LinkOffIcon />, path: '/portal/disavow' },
  ];

  const currentNavIndex = navItems.findIndex((item) =>
    item.path === '/portal/disavow'
      ? location.pathname === '/portal/disavow'
      : location.pathname.startsWith(item.path)
  );

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'pending': return '#6B7280';
      case 'under-review': return '#F5A800';
      case 'resolved': return '#22c55e';
      case 'appealed': return '#C8180A';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case 'pending': return <HelpIcon sx={{ fontSize: 16 }} />;
      case 'under-review': return <FlagIcon sx={{ fontSize: 16 }} />;
      case 'resolved': return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case 'appealed': return <GavelIcon sx={{ fontSize: 16 }} />;
      default: return <HelpIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'low': return '#6B7280';
      case 'medium': return '#F5A800';
      case 'high': return '#C8180A';
      case 'critical': return '#7C3AED';
      default: return '#6B7280';
    }
  };

  const getContentStatusChip = (status: ContentStatus) => {
    const config: Record<ContentStatus, { bgcolor: string; label: string }> = {
      official: { bgcolor: '#22c55e', label: 'Official' },
      verified: { bgcolor: '#253A9A', label: 'Verified' },
      disputed: { bgcolor: '#F5A800', label: 'Disputed' },
      unverified: { bgcolor: '#6B7280', label: 'Unverified' }
    };
    const c = config[status] ?? { bgcolor: '#6B7280', label: 'Unknown' };
    return (
      <Chip
        label={c.label}
        size="small"
        sx={{
          fontFamily: FF_HEADING,
          fontWeight: 700,
          fontSize: '10px',
          bgcolor: c.bgcolor,
          color: '#fff'
        }}
      />
    );
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'facebook': return '📘';
      case 'youtube': return '📹';
      case 'twitter': return '🐦';
      case 'newspaper': return '📰';
      case 'website': return '🌐';
      default: return '📄';
    }
  };

  const filteredRequests = DEMO_DISAVOW_REQUESTS.filter(req => {
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || req.priority === priorityFilter;
    const matchesSearch = !searchQuery || 
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.aspirantInvolved.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const stats = {
    total: DEMO_DISAVOW_REQUESTS.length,
    pending: DEMO_DISAVOW_REQUESTS.filter(r => r.status === 'pending').length,
    underReview: DEMO_DISAVOW_REQUESTS.filter(r => r.status === 'under-review').length,
    resolved: DEMO_DISAVOW_REQUESTS.filter(r => r.status === 'resolved').length,
    disputed: DEMO_DISAVOW_REQUESTS.filter(r => r.contentStatus === 'disputed').length,
  };

  const handleSubmitResponse = () => {
    alert('Response submitted successfully!');
    setResponseDialogOpen(false);
    setResponseText('');
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <AppBar position="sticky" elevation={0} sx={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(24px) saturate(1.8)',
        color: 'text.primary',
        borderBottom: '1px solid rgba(200,24,10,0.06)',
      }}>
        <Box sx={{ display: 'flex', height: '3px', bgcolor: `${BRAND.red}20` }} />

        <Toolbar sx={{ justifyContent: 'space-between', py: 1, minHeight: '72px !important', px: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box sx={{ p: 0.8, borderRadius: 2, background: `linear-gradient(135deg,rgba(200,24,10,.18),rgba(245,168,0,.14))`, border: '1px solid' }}>
              <Box component="img" src={prajakeeyaLogo} alt="Prajaakeeya" sx={{ height: 34 }} />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: FF_HEADING, fontWeight: 800, lineHeight: 1.05, fontSize: '1.08rem' }}>
                Prajaaakeeya
              </Typography>
              <Typography sx={{ fontFamily: FF_HEADING, fontSize: '0.73rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(17,24,39,0.45)' }}>
                GUEST
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LanguageSelector sx={{ minWidth: 64, px: 1, fontFamily: FF_HEADING, fontWeight: 800, fontSize: '0.9rem', color: BRAND.saffron }} />
            <Button variant="contained" size="small" onClick={() => navigate('/register')}
              sx={{ fontFamily: FF_HEADING, minHeight: 36, px: 2, bgcolor: BRAND.red, '&:hover': { bgcolor: BRAND.red2 } }}>
              Register
            </Button>
          </Box>
        </Toolbar>

        <Box sx={{ display: 'flex', borderTop: '1px solid rgba(0,0,0,0.06)', px: 3, py: 1, justifyContent: 'center' }}>
          <Box sx={{
            display: 'flex', gap: 1, py: 0.5, px: 1,
            background: 'rgba(255,255,255,0.5)', borderRadius: 3,
            border: '1px solid rgba(200,24,10,0.06)',
          }}>
            {navItems.map((item, idx) => {
              const active = idx === currentNavIndex;
              return (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    fontFamily: FF_HEADING, fontWeight: 700, textTransform: 'none',
                    borderRadius: 50, px: 2.5, py: 0.8, fontSize: '0.85rem',
                    color: active ? '#fff' : 'rgba(17,24,39,0.62)',
                    background: active ? 'linear-gradient(135deg, rgba(200,24,10,0.88) 0%, rgba(245,168,0,0.75) 100%)' : 'transparent',
                    border: active ? '1px solid rgba(200,24,10,0.25)' : '1px solid transparent',
                    boxShadow: active ? '0 4px 12px rgba(200,24,10,0.3)' : 'none',
                    '&:hover': active ? { transform: 'translateY(-1px)' } : { background: 'rgba(200,24,10,0.04)', color: 'rgba(17,24,39,0.85)' },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Box>
      </AppBar>

      <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 }, py: 3 }}>
        <Box sx={{ maxWidth: '1600px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h3" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: '#111827', fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                Disavow & Content Verification
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#6B7280', mt: 0.5 }}>
                Report false claims and verify content authenticity
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<FlagIcon />}
              sx={{ fontFamily: FF_HEADING, fontWeight: 700, bgcolor: BRAND.red, '&:hover': { bgcolor: BRAND.red2 } }}>
              File New Request
            </Button>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Total Requests', value: stats.total, color: '#111827' },
              { label: 'Pending', value: stats.pending, color: '#6B7280' },
              { label: 'Under Review', value: stats.underReview, color: '#F5A800' },
              { label: 'Resolved', value: stats.resolved, color: '#22c55e' },
              { label: 'Disputed Content', value: stats.disputed, color: '#C8180A' },
            ].map((stat, idx) => (
              <Grid item xs={6} md={2.4} key={idx}>
                <Paper sx={{ p: 2, textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <Typography variant="h4" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ mb: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
            <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{ startAdornment: <SearchIcon sx={{ color: '#9CA3AF', mr: 1 }} /> }}
                sx={{ minWidth: 250, fontFamily: FF_HEADING }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel sx={{ fontFamily: FF_HEADING, fontWeight: 700 }}>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ fontFamily: FF_HEADING, fontWeight: 700 }}
                >
                  <MenuItem value="all" sx={{ fontFamily: FF_HEADING }}>All</MenuItem>
                  <MenuItem value="pending" sx={{ fontFamily: FF_HEADING }}>Pending</MenuItem>
                  <MenuItem value="under-review" sx={{ fontFamily: FF_HEADING }}>Under Review</MenuItem>
                  <MenuItem value="resolved" sx={{ fontFamily: FF_HEADING }}>Resolved</MenuItem>
                  <MenuItem value="appealed" sx={{ fontFamily: FF_HEADING }}>Appealed</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel sx={{ fontFamily: FF_HEADING, fontWeight: 700 }}>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  label="Priority"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  sx={{ fontFamily: FF_HEADING, fontWeight: 700 }}
                >
                  <MenuItem value="all" sx={{ fontFamily: FF_HEADING }}>All</MenuItem>
                  <MenuItem value="low" sx={{ fontFamily: FF_HEADING }}>Low</MenuItem>
                  <MenuItem value="medium" sx={{ fontFamily: FF_HEADING }}>Medium</MenuItem>
                  <MenuItem value="high" sx={{ fontFamily: FF_HEADING }}>High</MenuItem>
                  <MenuItem value="critical" sx={{ fontFamily: FF_HEADING }}>Critical</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ ml: 'auto' }}>
                <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ fontFamily: FF_HEADING, fontWeight: 700 }}>
                  Export
                </Button>
              </Box>
            </Box>
          </Paper>

          <Tabs value={selectedTab} onChange={(_, v) => setSelectedTab(v)} sx={{ borderBottom: '1px solid rgba(0,0,0,0.06)', mb: 2 }}>
            <Tab label="All Requests" sx={{ fontFamily: FF_HEADING, fontWeight: 700, textTransform: 'none' }} />
            <Tab label="My Filings" sx={{ fontFamily: FF_HEADING, fontWeight: 700, textTransform: 'none' }} />
            <Tab label="Responses" sx={{ fontFamily: FF_HEADING, fontWeight: 700, textTransform: 'none' }} />
            <Tab label="Audit Log" sx={{ fontFamily: FF_HEADING, fontWeight: 700, textTransform: 'none' }} icon={<HistoryIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
          </Tabs>

          {selectedTab === 0 && (
            <TableContainer component={Paper} sx={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                    <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>ID</TableCell>
                    <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Title</TableCell>
                    <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Source</TableCell>
                    <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Content Status</TableCell>
                    <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Request Status</TableCell>
                    <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Priority</TableCell>
                    <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Aspirant</TableCell>
                    <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Support</TableCell>
                    <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: BRAND.red }}>
                          {request.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#111827', mb: 0.25 }}>
                            {request.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6B7280' }}>
                            {request.description.substring(0, 60)}...
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography>{getSourceIcon(request.sourceType)}</Typography>
                          <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#6B7280' }}>
                            {request.sourceType}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {getContentStatusChip(request.contentStatus)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(request.status)}
                          label={request.status.replace('-', ' ')}
                          size="small"
                          sx={{
                            fontFamily: FF_HEADING, fontWeight: 700, fontSize: '10px', textTransform: 'uppercase',
                            bgcolor: `${getStatusColor(request.status)}20`, color: getStatusColor(request.status)
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.priority}
                          size="small"
                          sx={{
                            fontFamily: FF_HEADING, fontWeight: 700, fontSize: '10px', textTransform: 'uppercase',
                            bgcolor: getPriorityColor(request.priority), color: '#fff'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#111827' }}>
                          {request.aspirantInvolved}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ThumbUpIcon sx={{ fontSize: 14, color: '#22c55e' }} />
                          <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>
                            {request.citizenSupport}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Button size="small" variant="outlined" sx={{ fontFamily: FF_HEADING, fontWeight: 700, minWidth: 'auto', px: 1, py: 0.5 }}>
                            View
                          </Button>
                          <Button size="small" variant="text" startIcon={<ReplyIcon />} sx={{ fontFamily: FF_HEADING, fontWeight: 700, minWidth: 'auto', px: 1, py: 0.5 }}
                            onClick={() => { setSelectedRequest(request); setResponseDialogOpen(true); }}>
                            Respond
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {selectedTab === 1 && (
            <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
              <FlagIcon sx={{ fontSize: 48, color: '#D1D5DB', mb: 2 }} />
              <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#6B7280' }}>
                No filings yet
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: FF_HEADING, color: '#9CA3AF', mb: 2 }}>
                You haven't filed any disavow requests yet.
              </Typography>
              <Button variant="contained" startIcon={<FlagIcon />} sx={{ fontFamily: FF_HEADING, fontWeight: 700, bgcolor: BRAND.red }}>
                File First Request
              </Button>
            </Paper>
          )}

          {selectedTab === 2 && (
            <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
              <ReplyIcon sx={{ fontSize: 48, color: '#D1D5DB', mb: 2 }} />
              <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#6B7280' }}>
                No responses yet
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: FF_HEADING, color: '#9CA3AF', mb: 2 }}>
                Aspirant responses to disavow requests will appear here.
              </Typography>
            </Paper>
          )}

          {selectedTab === 3 && (
            <TableContainer component={Paper} sx={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                    <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Log ID</TableCell>
                    <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Request</TableCell>
                    <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Action</TableCell>
                    <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Performed By</TableCell>
                    <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Date</TableCell>
                    <TableCell sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {DEMO_TRANSPARENCY_LOG.map((log) => (
                    <TableRow key={log.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: BRAND.blue }}>
                          {log.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#111827' }}>
                          {log.requestId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={log.action} size="small" sx={{ fontFamily: FF_HEADING, fontWeight: 700, bgcolor: `${BRAND.red}15`, color: BRAND.red }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 600 }}>
                          {log.performedBy}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: FF_HEADING, color: '#6B7280' }}>
                          {log.date}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: FF_HEADING, color: '#6B7280' }}>
                          {log.details}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Box sx={{ maxWidth: '1600px', mx: 'auto', mt: 4 }}>
          <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 2 }}>
            Content Verification Status Distribution
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { status: 'official', label: 'Official', count: 1, color: '#22c55e', Icon: CheckCircleIcon },
              { status: 'verified', label: 'Verified', count: 1, color: '#253A9A', Icon: VerifiedIcon },
              { status: 'disputed', label: 'Disputed', count: 2, color: '#F5A800', Icon: WarningIcon },
              { status: 'unverified', label: 'Unverified', count: 1, color: '#6B7280', Icon: HelpIcon },
            ].map((item) => (
              <Grid item xs={6} md={3} key={item.status}>
                <Paper sx={{ p: 2, border: `2px solid ${item.color}`, borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <item.Icon sx={{ color: item.color, fontSize: 24 }} />
                    <Typography variant="h5" sx={{ fontFamily: FF_HEADING, fontWeight: 900, color: item.color }}>
                      {item.count}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 700, color: '#6B7280' }}>
                    {item.label}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(item.count / DEMO_DISAVOW_REQUESTS.length) * 100}
                    sx={{
                      mt: 1, height: 6, borderRadius: 3,
                      bgcolor: `${item.color}20`,
                      '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 3 }
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ maxWidth: '1600px', mx: 'auto', mt: 4 }}>
          <Paper sx={{ p: 3, border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: '#111827', mb: 2 }}>
              Appeals & Escalation Process
            </Typography>
            <Grid container spacing={3}>
              {[
                { step: 1, title: 'Initial Filing', desc: 'Citizen files disavow request with evidence', Icon: FlagIcon },
                { step: 2, title: 'Verification', desc: 'Community moderators verify claims', Icon: SearchIcon },
                { step: 3, title: 'Aspirant Response', desc: 'Aspirant can respond within 7 days', Icon: ReplyIcon },
                { step: 4, title: 'Resolution', desc: 'Decision made with status update', Icon: CheckCircleIcon },
                { step: 5, title: 'Appeal (if needed)', desc: 'Escalate to senior review board', Icon: GavelIcon },
              ].map((item) => (
                <Grid item xs={12} sm={6} md={2.4} key={item.step}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{
                      width: 48, height: 48, borderRadius: '50%', bgcolor: `${BRAND.red}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      mx: 'auto', mb: 1, border: `2px solid ${BRAND.red}`
                    }}>
                      <item.Icon sx={{ color: BRAND.red, fontSize: 24 }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontFamily: FF_HEADING, fontWeight: 800, color: BRAND.red }}>
                      Step {item.step}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: FF_HEADING, fontWeight: 600, color: '#111827', mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      </Box>

      <Dialog open={responseDialogOpen} onClose={() => setResponseDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: FF_HEADING, fontWeight: 800 }}>
          Submit Official Response
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ fontFamily: FF_HEADING, color: '#6B7280', mb: 2 }}>
            Request: {selectedRequest?.title}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Response"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            sx={{ fontFamily: FF_HEADING }}
          />
          <Typography variant="caption" sx={{ fontFamily: FF_HEADING, color: '#9CA3AF', mt: 1, display: 'block' }}>
            By submitting, you confirm this response is accurate and made in good faith.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setResponseDialogOpen(false)} sx={{ fontFamily: FF_HEADING, fontWeight: 700 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitResponse} sx={{ fontFamily: FF_HEADING, fontWeight: 700, bgcolor: BRAND.red }}>
            Submit Response
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DisavowPage;