import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Box, Typography, Chip, Avatar,
} from '@mui/material';

import { AdminUser } from '../../services/adminUsersService';

type Props = {
    users: AdminUser[];
    onView?: (id: number) => void;
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
};

const safeAvatarSrc = (url?: string | null) => {
    if (!url) return undefined;
    // Google profile pictures are blocked by ORB (no CORS headers); skip them
    if (url.includes('googleusercontent.com') || url.includes('lh3.google')) return undefined;
    return url;
};

const UsersTable: React.FC<Props> = ({ users }) => {
    if (!users || users.length === 0) return <Box sx={{ py: 4 }}><Typography>No users found.</Typography></Box>;

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((u) => (
                        <TableRow key={u.id} hover>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar
                                        src={safeAvatarSrc(u.profilePicture)}
                                        alt={u.name}
                                        sx={{ width: 34, height: 34, bgcolor: 'primary.main' }}
                                    >
                                        {u.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{u.name}</Typography>
                                </Box>
                            </TableCell>
                            <TableCell>{u.role}</TableCell>
                            <TableCell>
                                {u.isBlocked
                                    ? <Chip label="Blocked" color="error" size="small" />
                                    : <Chip label="Active" color="success" size="small" />
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UsersTable;
