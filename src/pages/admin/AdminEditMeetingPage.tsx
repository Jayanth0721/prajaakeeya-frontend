import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    CardActions,
    Stack,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    FormControlLabel,
    Switch
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import meetingsService from '../../services/meetingsService';

const AdminEditMeetingPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [meeting, setMeeting] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        meetingLink: '',
        scheduledAt: '',
        isActive: true
    });

    useEffect(() => {
        if (!id) return;
        setFetchLoading(true);
        (async () => {
            try {
                const meetings = await meetingsService.getMeetings();
                const meetingData = meetings.find(m => m.id === Number(id));
                if (!meetingData) {
                    setError('Meeting not found');
                    return;
                }
                setMeeting(meetingData);

                // Convert scheduledAt from ISO string to datetime-local format.
                // Guard against an invalid/missing scheduledAt: new Date(bad).toISOString()
                // throws "Invalid time value" (RangeError) and white-screens the page.
                const scheduledDate = new Date(meetingData.scheduledAt);
                const datetimeLocal = isNaN(scheduledDate.getTime())
                    ? ''
                    : scheduledDate.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM

                setFormData({
                    title: meetingData.title,
                    description: meetingData.description,
                    meetingLink: meetingData.meetingLink,
                    scheduledAt: datetimeLocal,
                    isActive: meetingData.isActive
                });
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load meeting');
            } finally {
                setFetchLoading(false);
            }
        })();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        setLoading(true);
        setError('');

        try {
            // Convert scheduledAt to timestamp
            const scheduledDateTime = new Date(formData.scheduledAt);
            const timestamp = scheduledDateTime.getTime();

            const submitData: any = {
                title: formData.title,
                description: formData.description,
                meetingLink: formData.meetingLink,
                scheduledAt: timestamp,
                isActive: formData.isActive
            };

            await meetingsService.updateMeeting(Number(id), submitData);
            navigate('/admin/meetings');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update meeting');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = field === 'isActive' ? e.target.checked : e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (fetchLoading) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error && !meeting) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
                <CardContent>
                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <EditIcon color="primary" />
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Edit Meeting
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error">{error}</Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    label="Title"
                                    value={formData.title}
                                    onChange={handleChange('title')}
                                    required
                                    fullWidth
                                    placeholder="e.g., Weekly Ward Meeting"
                                />

                                <TextField
                                    label="Description"
                                    value={formData.description}
                                    onChange={handleChange('description')}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="e.g., Discussion on ward development"
                                />

                                <TextField
                                    label="Meeting Link"
                                    value={formData.meetingLink}
                                    onChange={handleChange('meetingLink')}
                                    required
                                    fullWidth
                                    placeholder="e.g., https://meet.google.com/xyz-abcd-efg"
                                />

                                <TextField
                                    label="Scheduled At"
                                    value={formData.scheduledAt}
                                    onChange={handleChange('scheduledAt')}
                                    required
                                    fullWidth
                                    type="datetime-local"
                                    slotProps={{ inputLabel: {
                                        shrink: true,
                                    } }}
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isActive}
                                            onChange={handleChange('isActive')}
                                            color="success"
                                        />
                                    }
                                    label="Active"
                                />
                            </Stack>
                        </Box>
                    </Stack>
                </CardContent>

                <CardActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/admin/meetings')}
                        disabled={loading}
                    >
                        Back
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={loading ? <CircularProgress size={20} /> : <EditIcon />}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Meeting'}
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
};

export default AdminEditMeetingPage;