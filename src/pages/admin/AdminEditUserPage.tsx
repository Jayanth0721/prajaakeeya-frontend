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
    MenuItem,
    CircularProgress,
    Alert,
    FormControlLabel,
    Switch
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import adminUsersService from '../../services/adminUsersService';

const AdminEditUserPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        relativeName: '',
        epicId: '',
        gender: '',
        wardId: '',
        role: 'voter',
        isBlocked: false
    });

    useEffect(() => {
        if (!id) return;
        setFetchLoading(true);
        (async () => {
            try {
                const userData = await adminUsersService.getUser(Number(id));
                setUser(userData);
                const raw = userData.raw || userData;
                setFormData({
                    name: userData.name || '',
                    relativeName: raw.relativeName || '',
                    epicId: userData.epicId || '',
                    gender: raw.gender || '',
                    wardId: raw.wardId ? String(raw.wardId) : '',
                    role: userData.role || 'voter',
                    isBlocked: userData.isBlocked || false
                });
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load user');
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
            const submitData: any = {
                ...formData,
            };

            // Handle wardId conversion
            if (formData.wardId && formData.wardId.trim()) {
                const wardIdNum = Number(formData.wardId);
                if (!isNaN(wardIdNum)) {
                    submitData.wardId = wardIdNum;
                }
            } else {
                // Don't include wardId if it's empty
                delete submitData.wardId;
            }

            await adminUsersService.updateUser(Number(id), submitData);
            navigate('/admin/users');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = field === 'isBlocked' ? e.target.checked : e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (fetchLoading) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography color="error">User not found</Typography>
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
                                Edit User
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error">{error}</Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    label="Name"
                                    value={formData.name}
                                    onChange={handleChange('name')}
                                    fullWidth
                                />

                                <TextField
                                    label="Relative Name"
                                    value={formData.relativeName}
                                    onChange={handleChange('relativeName')}
                                    fullWidth
                                />

                                <TextField
                                    label="VOTER ID"
                                    value={formData.epicId}
                                    onChange={handleChange('epicId')}
                                    fullWidth
                                />

                                <TextField
                                    select
                                    label="Gender"
                                    value={formData.gender}
                                    onChange={handleChange('gender')}
                                    fullWidth
                                >
                                    <MenuItem value="">Not specified</MenuItem>
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </TextField>


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

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isBlocked}
                                            onChange={handleChange('isBlocked')}
                                            color="error"
                                        />
                                    }
                                    label="Blocked"
                                />
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
                        startIcon={loading ? <CircularProgress size={20} /> : <EditIcon />}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update User'}
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
};

export default AdminEditUserPage;