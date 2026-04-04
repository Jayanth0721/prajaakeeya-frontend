import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import meetingsService from '../../services/meetingsService';

const AdminCreateMeetingPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        wardId: '',
        title: '',
        description: '',
        meetingLink: '',
        scheduledAt: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Convert scheduledAt to timestamp
            const scheduledDateTime = new Date(formData.scheduledAt);
            const timestamp = scheduledDateTime.getTime();

            const submitData = {
                wardId: Number(formData.wardId),
                title: formData.title,
                description: formData.description,
                meetingLink: formData.meetingLink,
                scheduledAt: timestamp
            };

            await meetingsService.createMeeting(submitData);
            navigate('/admin/meetings');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create meeting');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <Box>
            <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
                <CardContent>
                    <Stack spacing={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <VideoCallIcon color="primary" />
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Create New Meeting
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error">{error}</Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    label="Ward ID"
                                    value={formData.wardId}
                                    onChange={handleChange('wardId')}
                                    required
                                    fullWidth
                                    type="number"
                                    placeholder="e.g., 368"
                                />

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
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
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
                        startIcon={loading ? <CircularProgress size={20} /> : <VideoCallIcon />}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Meeting'}
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
};

export default AdminCreateMeetingPage;