import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    CardActions,
    Stack,
    Typography,
    Button,
    CircularProgress,
    Divider,
    Chip,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Paper,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    FormLabel
} from '@mui/material';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import BadgeIcon from '@mui/icons-material/Badge';
import DomainIcon from '@mui/icons-material/Domain';
import GetAppIcon from '@mui/icons-material/GetApp';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import adminUsersService from '../../services/adminUsersService';
import { getAspirantById, verifyAspirantDocument } from '../../services/aspirantService';
import { approveAspirant } from '../../services/aspirantService';

const AdminUserDetailsPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState<{ open: boolean; action?: 'block' | 'unblock' | 'delete' }>({ open: false });
    const [aspirant, setAspirant] = useState<any | null>(null);
    const [verifyingDocs, setVerifyingDocs] = useState<Record<string, boolean>>({});
    const [verifyDialog, setVerifyDialog] = useState<{
        open: boolean;
        docKey?: string;
        status?: 'approved' | 'rejected';
        rejectionReason?: string;
    }>({ open: false });

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        (async () => {
            try {
                // Try to load as admin user id first
                let resp: any = null;
                try {
                    resp = await adminUsersService.getUser(Number(id));
                } catch (e) {
                    resp = null;
                }

                if (resp) {
                    setUser(resp as any);
                    // try to load aspirant details - attempt both user.id and the route id (in case route id is aspirant id)
                    try {
                        const tryIds = [Number(resp.id), Number(id)].filter(Boolean);
                        let aresp: any = null;
                        for (const tryId of tryIds) {
                            try {
                                aresp = await getAspirantById(tryId);
                                const adata = aresp?.data ?? aresp;
                                if (adata) {
                                    setAspirant(adata);
                                    break;
                                }
                            } catch (e) {
                                // ignore and try next
                            }
                        }
                    } catch (e) {
                        console.warn('Failed to load aspirant details', e);
                    }
                } else {
                    // If no admin user found, treat the id as aspirant id
                    try {
                        const aresp = await getAspirantById(Number(id));
                        const adata = aresp?.data ?? aresp;
                        setAspirant(adata);
                        // if aspirant has a linked userId, try to load user as well
                        const userId = adata?.userId ?? adata?.user?.id;
                        if (userId) {
                            try {
                                const uresp = await adminUsersService.getUser(Number(userId));
                                setUser(uresp as any);
                            } catch (e) {
                                // ignore
                            }
                        }
                    } catch (e) {
                        console.warn('Failed to load aspirant by id', e);
                    }
                }
            } catch (e) {
                console.error('Failed to load user', e);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const openConfirm = (action: 'block' | 'unblock' | 'delete') => setConfirm({ open: true, action });

    const perform = async () => {
        if (!user || !confirm.action) return setConfirm({ open: false });
        try {
            if (confirm.action === 'block') {
                await adminUsersService.blockUser(user.id);
                // Optimistically update the user status
                setUser({ ...user, isBlocked: true });
            } else if (confirm.action === 'unblock') {
                await adminUsersService.unblockUser(user.id);
                // Optimistically update the user status
                setUser({ ...user, isBlocked: false });
            } else if (confirm.action === 'delete') {
                await adminUsersService.deleteUser(user.id);
                navigate('/admin/users');
                return;
            }
        } catch (e) {
            console.error('Action failed', e);
            // Reload user data on error to ensure consistency
            try {
                const refreshed = await adminUsersService.getUser(user.id);
                setUser(refreshed as any);
            } catch (refreshError) {
                console.error('Failed to refresh user data', refreshError);
            }
        } finally {
            setConfirm({ open: false });
        }
    };

    const handleVerifyDocument = async () => {
        if (!aspirant || !verifyDialog.docKey || !verifyDialog.status) return;

        const docKey = verifyDialog.docKey;
        const statusField = statusFieldMap[docKey] || `${docKey}Status`;
        const prevStatus = (aspirant as any)[statusField];

        try {
            setVerifyingDocs((prev: Record<string, boolean>) => ({ ...prev, [docKey]: true }));
            // optimistic update
            setAspirant((prev: any) => prev ? ({ ...prev, [statusField]: verifyDialog.status }) : prev);

            const map: Record<string, string> = {
                agreement: 'agreement',
                propertyDeclaration: 'property_declaration',
                codeOfConduct: 'code_of_conduct',
                resume: 'resume',
                epicCard: 'epic_card',
                addressProof: 'address_proof',
                recentPhoto: 'recent_photo'
            };
            const apiDocType = map[docKey] || docKey;

            const payload: { status: string; rejectionReason?: string } = {
                status: verifyDialog.status === 'approved' ? 'verified' : 'rejected'
            };

            if (verifyDialog.status === 'rejected' && verifyDialog.rejectionReason) {
                payload.rejectionReason = verifyDialog.rejectionReason;
            }

            await verifyAspirantDocument(aspirant.id, apiDocType, payload);
            const refreshed = await getAspirantById(aspirant.id);
            setAspirant((refreshed?.data) ?? refreshed);
        } catch (e) {
            console.error('Failed to verify document', e);
            // revert optimistic update
            setAspirant((prev: any) => prev ? ({ ...prev, [statusField]: prevStatus }) : prev);
        } finally {
            setVerifyingDocs((prev: Record<string, boolean>) => ({ ...prev, [docKey]: false }));
            setVerifyDialog({ open: false });
        }
    };

    if (loading) return <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress /></Box>;
    if (!user) return <Typography color="error">User not found</Typography>;

    const raw = (user as any).raw ?? user;

    const statusFieldMap: Record<string, string> = {
        agreement: 'agreementStatus',
        propertyDeclaration: 'propertyDeclarationStatus',
        codeOfConduct: 'codeOfConductStatus',
        resume: 'resumeStatus',
        epicCard: 'epicCardStatus',
        addressProof: 'addressProofStatus',
        recentPhoto: 'recentPhotoStatus'
    };

    const docLabelMap: Record<string, string> = {
        agreement: 'Agreement',
        propertyDeclaration: 'Property Declaration',
        codeOfConduct: 'Code of Conduct',
        resume: 'Resume',
        epicCard: 'EPIC Card',
        addressProof: 'Address Proof',
        recentPhoto: 'Recent Photo'
    };

    const docs = aspirant ? [
        { key: 'agreement', url: aspirant.agreementUrl, status: aspirant.agreementStatus },
        { key: 'propertyDeclaration', url: aspirant.propertyDeclarationUrl, status: aspirant.propertyDeclarationStatus },
        { key: 'codeOfConduct', url: aspirant.codeOfConductUrl, status: aspirant.codeOfConductStatus },
        { key: 'resume', url: aspirant.resumeUrl, status: aspirant.resumeStatus },
        { key: 'epicCard', url: aspirant.epicCardUrl, status: aspirant.epicCardStatus },
        { key: 'addressProof', url: aspirant.addressProofUrl, status: aspirant.addressProofStatus },
        { key: 'recentPhoto', url: aspirant.recentPhotoUrl, status: aspirant.recentPhotoStatus }
    ] : [];

    return (
        <Box>
            <Card sx={{ overflow: 'visible', borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Avatar
                                src={(raw && raw.profilePicture) ? raw.profilePicture : undefined}
                                sx={{ width: 64, height: 64, bgcolor: (raw && raw.profilePicture) ? 'transparent' : 'primary.light', color: 'primary.contrastText', fontSize: 28 }}
                            >
                                {!raw?.profilePicture && String(user.name || 'A').trim().charAt(0).toUpperCase()}
                            </Avatar>
                        </Grid>

                        <Grid item xs>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>{user.name}</Typography>
                            <Box sx={{ mt: 0.5 }}>
                                <Chip label={(user.role || '—').toString().replace(/^(.)/, (s: string) => s.toUpperCase())} color="primary" size="small" sx={{ fontWeight: 700 }} />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                <strong>Ward:</strong> {user.wardName ?? '—'}{user.wardNumber ? ` (${user.wardNumber})` : ''}
                                {user.corporationName ? ` • Bangalore - ${user.corporationName}` : ''}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Chip label={user.isBlocked ? 'Blocked' : 'Active'} color={user.isBlocked ? 'error' : 'success'} sx={{ fontWeight: 700, borderRadius: 2, px: 1.5 }} />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />


                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Contact Information</Typography>
                                <Stack spacing={1}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PhoneAndroidIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                                            <Typography><strong>{raw.phone ?? '—'}</strong></Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BadgeIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">VOTER ID</Typography>
                                            <Typography><strong>{user.epicId ?? '—'}</strong></Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <DomainIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Corporation</Typography>
                                            <Typography><strong>{user.corporationName ? `Bangalore - ${user.corporationName}` : '—'}</strong></Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <DomainIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Ward</Typography>
                                            <Typography><strong>{user.wardName ?? '—'}</strong></Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <BadgeIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Booth Name</Typography>
                                            <Typography><strong>{raw.psName ?? '—'}</strong></Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Account Details</Typography>
                                <Stack spacing={1}>
                                    <Typography>Created: <strong>{raw.createdAt ? new Date(raw.createdAt).toLocaleDateString() : '—'}</strong></Typography>
                                    <Typography>Updated: <strong>{raw.updatedAt ? new Date(raw.updatedAt).toLocaleDateString() : '—'}</strong></Typography>
                                    <Typography>Status: <strong>{user.isBlocked ? 'Blocked' : 'Active'}</strong></Typography>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Aspirant Questionnaire */}
                    {aspirant && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Questionnaire Answers</Typography>
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                <Grid container spacing={2}>
                                    {
                                        (function renderQA() {
                                            const qaMap: Record<string, string> = {
                                                identityBackground: 'Identity Background',
                                                resignationPledge: 'Resignation Pledge',
                                                financialIntegrity: 'Financial Integrity',
                                                noHighCommand: 'No High Command',
                                                technicalCompetence: 'Technical Competence',
                                                transparency: 'Transparency',
                                                emergencyProtocol: 'Emergency Protocol',
                                                expertConsultation: 'Expert Consultation',
                                                voterFeedback: 'Voter Feedback',
                                                primaryRule: 'Primary Rule'
                                            };

                                            return Object.keys(qaMap).map((key, idx) => (
                                                <Grid item xs={12} key={key}>
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, py: 1 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{`${idx + 1}. ${qaMap[key]}`}</Typography>
                                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'text.primary' }}>{String(aspirant[key] ?? '—')}</Typography>
                                                    </Box>
                                                    <Divider sx={{ my: 1 }} />
                                                </Grid>
                                            ));
                                        })()
                                    }
                                </Grid>
                            </Paper>
                        </Box>
                    )}

                    {/* Aspirant Documents (if applicable) */}
                    {aspirant && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Aspirant Documents</Typography>
                            <Grid container spacing={2}>
                                {docs.map((doc) => (
                                    <Grid item xs={12} key={doc.key}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                                                <Typography sx={{ fontWeight: 700 }}>{docLabelMap[doc.key] ?? doc.key}</Typography>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {doc.status ? (
                                                        <Chip
                                                            label={String(doc.status).replace(/^(.)/, s => s.toUpperCase())}
                                                            color={doc.status === 'pending' ? 'warning' : (doc.status === 'approved' || doc.status === 'verified') ? 'success' : (doc.status === 'rejected' ? 'error' : 'default')}
                                                            size="small"
                                                        />
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">Status: —</Typography>
                                                    )}

                                                    {doc.url ? (
                                                        <Button href={doc.url} target="_blank" rel="noreferrer" startIcon={<GetAppIcon />} size="small" variant="outlined">Download</Button>
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">No document uploaded</Typography>
                                                    )}

                                                    {
                                                        (() => {
                                                            const statusField = statusFieldMap[doc.key] || `${doc.key}Status`;
                                                            const isVerified = doc.status === 'approved' || doc.status === 'verified';
                                                            const isVerifying = Boolean(verifyingDocs[doc.key]);
                                                            return (
                                                                <Button
                                                                    variant="contained"
                                                                    size="small"
                                                                    color={isVerified || isVerifying ? 'success' : 'primary'}
                                                                    disabled={!doc.url || isVerified || isVerifying}
                                                                    onClick={() => {
                                                                        setVerifyDialog({
                                                                            open: true,
                                                                            docKey: doc.key,
                                                                            status: 'approved',
                                                                            rejectionReason: ''
                                                                        });
                                                                    }}
                                                                >{isVerified ? 'Verified' : (isVerifying ? 'Verifying...' : 'Verify')}</Button>
                                                            );
                                                        })()
                                                    }
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {/* Approve Aspirant Button */}
                    {aspirant && aspirant.status !== 'approved' && (
                        <Box sx={{ mt: 4 }}>
                            <Button
                                variant="contained"
                                color="success"
                                size="large"
                                fullWidth
                                onClick={async () => {
                                    try {
                                        await approveAspirant(aspirant.id);
                                        const refreshed = await getAspirantById(aspirant.id);
                                        setAspirant((refreshed?.data) ?? refreshed);
                                    } catch (e) {
                                        console.error('Failed to approve aspirant', e);
                                    }
                                }}
                            >
                                Approve Aspirant
                            </Button>
                        </Box>
                    )}

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>Actions</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700 }}>{user.isBlocked ? 'Unblock User' : 'Block User'}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {user.isBlocked ? 'Allow this user to access the account again' : 'Prevent this user from accessing the account'}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Button
                                            variant="contained"
                                            color={user.isBlocked ? 'error' : 'warning'}
                                            startIcon={user.isBlocked ? <LockOpenIcon /> : <LockIcon />}
                                            onClick={() => openConfirm(user.isBlocked ? 'unblock' : 'block')}
                                        >
                                            {user.isBlocked ? 'Unblock User' : 'Block User'}
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700 }}>Delete User</Typography>
                                        <Typography variant="body2" color="text.secondary">Permanently remove this user</Typography>
                                    </Box>
                                    <Box>
                                        <Button variant="outlined" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => openConfirm('delete')}>Delete User</Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>

                <CardActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>Back to Users</Button>
                    <Button startIcon={<EditIcon />} variant="contained" onClick={() => navigate(`/admin/users/${user.id}/edit`)}>Edit User</Button>
                </CardActions>
            </Card>

            <Dialog open={confirm.open} onClose={() => setConfirm({ open: false })}>
                <DialogTitle>Confirm</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to {confirm.action} this user?
                        {confirm.action === 'delete' && ' This action cannot be undone.'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirm({ open: false })}>Cancel</Button>
                    <Button color="primary" variant="contained" onClick={perform}>Yes</Button>
                </DialogActions>
            </Dialog>

            {/* Document Verification Dialog */}
            <Dialog open={verifyDialog.open} onClose={() => setVerifyDialog({ open: false })} maxWidth="sm" fullWidth>
                <DialogTitle>Verify Document</DialogTitle>
                <DialogContent>
                    <FormControl component="fieldset" sx={{ mt: 1 }}>
                        <FormLabel component="legend">Verification Status</FormLabel>
                        <RadioGroup
                            value={verifyDialog.status}
                            onChange={(e) => setVerifyDialog(prev => ({ ...prev, status: e.target.value as 'approved' | 'rejected' }))}
                        >
                            <FormControlLabel value="approved" control={<Radio />} label="Approve Document" />
                            <FormControlLabel value="rejected" control={<Radio />} label="Reject Document" />
                        </RadioGroup>
                    </FormControl>

                    {verifyDialog.status === 'rejected' && (
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Rejection Reason"
                            placeholder="Please provide a reason for rejection..."
                            value={verifyDialog.rejectionReason}
                            onChange={(e) => setVerifyDialog(prev => ({ ...prev, rejectionReason: e.target.value }))}
                            sx={{ mt: 2 }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setVerifyDialog({ open: false })}>Cancel</Button>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleVerifyDocument}
                        disabled={!verifyDialog.status}
                    >
                        Verify
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminUserDetailsPage;
