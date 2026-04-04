import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Stack,
    Typography,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    CircularProgress,
    Pagination,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Autocomplete
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import UsersTable from '../../components/admin/UsersTable';
import adminUsersService, { AdminUser } from '../../services/adminUsersService';
import { getWards } from '../../services/wardService';

const AdminUsersListPage: React.FC = () => {
    const navigate = useNavigate();
    const isAdmin = useAuthStore((s) => s.isAdmin);

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [wardFilter, setWardFilter] = useState('');
    const [wardsList, setWardsList] = useState<{ ward_number: string; ward_name: string }[]>([]);
    const [selectedWard, setSelectedWard] = useState<{ ward_number: string; ward_name: string } | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [total, setTotal] = useState(0);
    const [confirm, setConfirm] = useState<{ open: boolean; id?: number; action?: 'delete' | 'block' | 'unblock' }>({ open: false });

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        load();
        // fetch wards for the filter
        (async () => {
            try {
                const resp = await getWards();
                const data = resp?.data ?? resp ?? [];
                setWardsList(Array.isArray(data) ? data : []);
            } catch (e) {
                console.warn('Failed to load wards', e);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin]);

    const load = async (opts?: { page?: number }) => {
        setLoading(true);
        try {
            const p = opts?.page ?? page;
            const resp = await adminUsersService.getUsers({ page: p, pageSize, search: search || undefined, status: statusFilter || undefined, wardNumber: wardFilter || undefined });
            // backend may return array or { data, total }
            if (Array.isArray(resp)) {
                setUsers(resp as AdminUser[]);
                setTotal((resp as AdminUser[]).length);
            } else if (resp && Array.isArray((resp as any).data)) {
                setUsers((resp as any).data as AdminUser[]);
                setTotal(Number((resp as any).total ?? (resp as any).count ?? ((resp as any).data as AdminUser[]).length));
            } else {
                setUsers([]);
                setTotal(0);
            }
            setPage(p);
        } catch (e) {
            console.error('Failed to load users', e);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBlock = (user: AdminUser) => {
        setConfirm({ open: true, id: user.id, action: user.isBlocked ? 'unblock' : 'block' });
    };

    const handleDelete = (id?: number) => setConfirm({ open: true, id, action: 'delete' });

    const performConfirm = async () => {
        if (!confirm.id || !confirm.action) return setConfirm({ open: false });
        try {
            if (confirm.action === 'delete') {
                await adminUsersService.deleteUser(confirm.id);
                // Remove the user from the list
                setUsers(prev => prev.filter(u => u.id !== confirm.id));
                setTotal(prev => prev - 1);
            } else if (confirm.action === 'block') {
                await adminUsersService.blockUser(confirm.id);
                // Update the user status optimistically
                setUsers(prev => prev.map(u => u.id === confirm.id ? { ...u, isBlocked: true } : u));
            } else if (confirm.action === 'unblock') {
                await adminUsersService.unblockUser(confirm.id);
                // Update the user status optimistically
                setUsers(prev => prev.map(u => u.id === confirm.id ? { ...u, isBlocked: false } : u));
            }
        } catch (e) {
            console.error('Action failed', e);
            // Reload on error to ensure consistency
            await load({ page });
        } finally {
            setConfirm({ open: false });
        }
    };

    const handlePageChange = (_: any, value: number) => {
        setPage(value);
        load({ page: value });
    };

    const wards = Array.from(new Set(users.map((u) => u.wardNumber).filter((v): v is string => Boolean(v)))) as string[];

    // keep selectedWard in sync if wardFilter value is set externally
    useEffect(() => {
        if (!wardFilter) {
            setSelectedWard(null);
            return;
        }
        const found = wardsList.find((w) => w.ward_number === wardFilter) || null;
        setSelectedWard(found);
    }, [wardFilter, wardsList]);

    if (!isAdmin) return null;

    return (
        <Stack spacing={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>Users lists</Typography>
                    {selectedWard && (
                        <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            Ward: {selectedWard.ward_name}
                        </Typography>
                    )}
                </Box>
                <Button variant="contained" color="primary" onClick={() => navigate('/admin/users/create')}>
                    Create User
                </Button>
            </Box>

            <Card>
                <CardContent>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }} alignItems="center">
                        <Box sx={{ minWidth: 250 }}>
                            <Autocomplete
                                options={wardsList}
                                getOptionLabel={(o) => `${o.ward_number} • ${o.ward_name}`}
                                value={selectedWard}
                                onChange={(_, v) => {
                                    setSelectedWard(v ?? null);
                                    setWardFilter(v?.ward_number ?? '');
                                }}
                                renderInput={(params) => <TextField {...params} label="Ward" />}
                                clearOnEscape
                            />
                        </Box>
                        <Button variant="contained" onClick={() => load({ page: 1 })}>Apply</Button>
                    </Stack>

                    {loading ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress /></Box>
                    ) : (
                        <>
                            <UsersTable users={users} onView={(id) => navigate(`/admin/users/${id}`)} onEdit={(id) => navigate(`/admin/users/${id}/edit`)} onToggleBlock={handleToggleBlock} onDelete={(id) => handleDelete(id)} />

                            <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                                <Grid item>
                                    <Typography variant="body2">Total: {total}</Typography>
                                </Grid>
                                <Grid item>
                                    <Pagination count={Math.max(1, Math.ceil(total / pageSize))} page={page} onChange={handlePageChange} />
                                </Grid>
                            </Grid>
                        </>
                    )}
                </CardContent>
            </Card>

            <Dialog open={confirm.open} onClose={() => setConfirm({ open: false })}>
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to {confirm.action} this user?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirm({ open: false })}>Cancel</Button>
                    <Button color="primary" variant="contained" onClick={performConfirm}>Yes</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};

export default AdminUsersListPage;
