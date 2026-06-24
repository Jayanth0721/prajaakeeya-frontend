import React, { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tooltip,
} from '@mui/material';
import {
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Telegram as TelegramIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Link as LinkIcon,
    AddCircleOutlined as AddCircleIcon,
} from '@mui/icons-material';
import { fetchAllWards, updateWardTelegramLink, deleteWardTelegramLink, Ward } from '../../services/wardService';

const ZONE_COLORS: Record<string, string> = {
    Central: '#1565C0',
    East: '#2E7D32',
    North: '#6A1B9A',
    South: '#AD1457',
    West: '#E65100',
};

const AdminTelegramLinksPage: React.FC = () => {
    const [wards, setWards] = useState<Ward[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    // Edit dialog
    const [editWard, setEditWard] = useState<Ward | null>(null);
    const [editLink, setEditLink] = useState('');
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    // Delete state
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadWards = () => {
        setLoading(true);
        setError('');
        fetchAllWards()
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : [];
                setWards(data);
            })
            .catch((err) => {
                setError(err?.response?.data?.message || err?.message || 'Failed to load wards');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadWards();
    }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return wards;
        const q = search.toLowerCase();
        return wards.filter(
            (w) =>
                w.number?.toLowerCase().includes(q) ||
                w.name?.toLowerCase().includes(q) ||
                w.zone?.toLowerCase().includes(q) ||
                w.state?.toLowerCase().includes(q)
        );
    }, [wards, search]);

    const openEdit = (ward: Ward) => {
        setDialogMode(ward.telegramGroupLink ? 'edit' : 'add');
        setEditWard(ward);
        setEditLink(ward.telegramGroupLink ?? '');
        setSaveError('');
    };

    const closeEdit = () => {
        setEditWard(null);
        setEditLink('');
        setSaveError('');
    };

    const handleSave = async () => {
        if (!editWard) return;
        setSaving(true);
        setSaveError('');
        try {
            await updateWardTelegramLink(editWard.id, editLink.trim());
            closeEdit();
            loadWards();
        } catch (err: any) {
            setSaveError(err?.response?.data?.message || err?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (ward: Ward) => {
        if (!window.confirm(`Delete Telegram link for ${ward.number} – ${ward.name}?`)) return;
        setDeletingId(ward.id);
        try {
            await deleteWardTelegramLink(ward.id);
            loadWards();
        } catch (err: any) {
            alert(err?.response?.data?.message || err?.message || 'Failed to delete');
        } finally {
            setDeletingId(null);
        }
    };

    const linkedCount = wards.filter((w) => w.telegramGroupLink).length;

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* Header */}
            <Stack
                direction="row"
                spacing={1.5}
                sx={{
                    alignItems: "center",
                    mb: 3
                }}>
                <TelegramIcon sx={{ color: '#229ED9', fontSize: 32 }} />
                <Box>
                    <Typography variant="h5" sx={{
                        fontWeight: 700
                    }}>
                        Telegram Links
                    </Typography>
                    <Typography variant="body2" sx={{
                        color: "text.secondary"
                    }}>
                        Manage Telegram group links for each ward
                    </Typography>
                </Box>
            </Stack>
            {/* Stats */}
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    mb: 3,
                    flexWrap: "wrap"
                }}>
                <Card sx={{ flex: '1 1 140px', minWidth: 140 }}>
                    <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="caption" sx={{
                            color: "text.secondary"
                        }}>Total Wards</Typography>
                        <Typography variant="h5" sx={{
                            fontWeight: 700
                        }}>{wards.length}</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ flex: '1 1 140px', minWidth: 140 }}>
                    <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="caption" sx={{
                            color: "text.secondary"
                        }}>Links Added</Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: "success.main"
                            }}>{linkedCount}</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ flex: '1 1 140px', minWidth: 140 }}>
                    <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="caption" sx={{
                            color: "text.secondary"
                        }}>Pending</Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: "warning.main"
                            }}>{wards.length - linkedCount}</Typography>
                    </CardContent>
                </Card>
            </Stack>
            {/* Search */}
            <TextField
                placeholder="Search by ward number, name, zone or state..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                slotProps={{ input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                } }}
            />
            {/* Error */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {/* Table */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, bgcolor: '#1a2535', color: '#e0e0e0' }}>No</TableCell>
                                <TableCell sx={{ fontWeight: 700, bgcolor: '#1a2535', color: '#e0e0e0' }}>Ward No.</TableCell>
                                <TableCell sx={{ fontWeight: 700, bgcolor: '#1a2535', color: '#e0e0e0' }}>Ward Name</TableCell>
                                <TableCell sx={{ fontWeight: 700, bgcolor: '#1a2535', color: '#e0e0e0' }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: 700, bgcolor: '#1a2535', color: '#e0e0e0' }}>Zone</TableCell>
                                <TableCell sx={{ fontWeight: 700, bgcolor: '#1a2535', color: '#e0e0e0' }}>Telegram Link</TableCell>
                                <TableCell sx={{ fontWeight: 700, bgcolor: '#1a2535', color: '#e0e0e0', width: 100 }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                        No wards found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((ward, idx) => (
                                    <TableRow key={ward.id} hover>
                                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{idx + 1}</TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 600,
                                                    fontFamily: "monospace"
                                                }}>
                                                {ward.number}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{ward.name}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{
                                                color: "text.secondary"
                                            }}>{ward.category ?? '-'}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={ward.zone}
                                                size="small"
                                                sx={{
                                                    bgcolor: ZONE_COLORS[ward.zone] ?? '#546E7A',
                                                    color: '#fff',
                                                    fontWeight: 600,
                                                    fontSize: '0.7rem',
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {ward.telegramGroupLink ? (
                                                <Stack direction="row" spacing={0.5} sx={{
                                                    alignItems: "center"
                                                }}>
                                                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />
                                                    <Tooltip title={ward.telegramGroupLink} placement="top">
                                                        <Typography
                                                            component="a"
                                                            href={ward.telegramGroupLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            variant="body2"
                                                            sx={{
                                                                color: '#229ED9',
                                                                textDecoration: 'none',
                                                                maxWidth: 220,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                display: 'block',
                                                                '&:hover': { textDecoration: 'underline' },
                                                            }}
                                                        >
                                                            {ward.telegramGroupLink}
                                                        </Typography>
                                                    </Tooltip>
                                                </Stack>
                                            ) : (
                                                <Stack direction="row" spacing={0.5} sx={{
                                                    alignItems: "center"
                                                }}>
                                                    <CancelIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                                                    <Typography variant="body2" sx={{
                                                        color: "text.disabled"
                                                    }}>Not added</Typography>
                                                </Stack>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={0.5}>
                                                {ward.telegramGroupLink ? (
                                                    <Tooltip title="Edit Telegram Link">
                                                        <IconButton size="small" onClick={() => openEdit(ward)} sx={{ color: '#229ED9' }}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Add Telegram Link">
                                                        <IconButton size="small" onClick={() => openEdit(ward)} sx={{ color: 'success.main' }}>
                                                            <AddCircleIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {ward.telegramGroupLink && (
                                                    <Tooltip title="Delete Telegram Link">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDelete(ward)}
                                                            disabled={deletingId === ward.id}
                                                            sx={{ color: 'error.main' }}
                                                        >
                                                            {deletingId === ward.id
                                                                ? <CircularProgress size={14} color="inherit" />
                                                                : <DeleteIcon fontSize="small" />}
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {/* Add / Edit Dialog */}
            <Dialog open={!!editWard} onClose={closeEdit} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TelegramIcon sx={{ color: '#229ED9' }} />
                    {dialogMode === 'add' ? 'Add Telegram Link' : 'Edit Telegram Link'}
                </DialogTitle>
                <DialogContent>
                    {editWard && (
                        <Box>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    mb: 2,
                                    mt: 0.5
                                }}>
                                <Chip label={editWard.number} size="small" sx={{ fontFamily: 'monospace', fontWeight: 700 }} />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "text.secondary",
                                        alignSelf: "center"
                                    }}>
                                    {editWard.name} — {editWard.zone}
                                </Typography>
                            </Stack>
                            <TextField
                                label="Telegram Group Link"
                                placeholder="https://t.me/..."
                                fullWidth
                                value={editLink}
                                onChange={(e) => setEditLink(e.target.value)}
                                error={!!saveError}
                                helperText={saveError || 'Paste the full Telegram group invite link'}
                                slotProps={{ input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LinkIcon sx={{
                                                fontSize: "small"
                                            }} />
                                        </InputAdornment>
                                    ),
                                } }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeEdit} disabled={saving}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <TelegramIcon />}
                        sx={{ bgcolor: '#229ED9', '&:hover': { bgcolor: '#1A8AC4' } }}
                    >
                        {saving ? 'Saving...' : 'Save Link'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminTelegramLinksPage;
