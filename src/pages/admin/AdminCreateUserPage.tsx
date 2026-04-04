import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardActions,
    Stack,
    Typography,
    TextField,
    Button,
    MenuItem,
    CircularProgress,
    Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import adminUsersService from '../../services/adminUsersService';

const AdminCreateUserPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        epicNumber: '',
        phone: '',
        role: 'voter'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await adminUsersService.createUser(formData);
            navigate('/admin/users');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create user');
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
                            <PersonAddIcon color="primary" />
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Create New User
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error">{error}</Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    label="EPIC Number"
                                    value={formData.epicNumber}
                                    onChange={handleChange('epicNumber')}
                                    required
                                    fullWidth
                                    placeholder="e.g., WEC2064541"
                                />

                                <TextField
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange('phone')}
                                    required
                                    fullWidth
                                    placeholder="e.g., 9876543210"
                                    type="tel"
                                />

                                <TextField
                                    select
                                    label="Role"
                                    value={formData.role}
                                    onChange={handleChange('role')}
                                    required
                                    fullWidth
                                >
                                    <MenuItem value="voter">Voter</MenuItem>
                                    <MenuItem value="aspirant">Aspirant</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </TextField>
                            </Stack>
                        </Box>
                    </Stack>
                </CardContent>

                <CardActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/admin/users')}
                        disabled={loading}
                    >
                        Back
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create User'}
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
};

export default AdminCreateUserPage;