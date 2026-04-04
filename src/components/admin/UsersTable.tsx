import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    Box,
    Typography,
    Chip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { AdminUser } from '../../services/adminUsersService';

type Props = {
    users: AdminUser[];
    onView?: (id: number) => void;
    onToggleBlock?: (user: AdminUser) => void;
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
};

const UsersTable: React.FC<Props> = ({ users, onView, onToggleBlock, onDelete, onEdit }) => {
    if (!users || users.length === 0) return <Box sx={{ py: 4 }}><Typography>No users found.</Typography></Box>;

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>EPIC</TableCell>
                        <TableCell>Corporation</TableCell>
                        <TableCell>Ward Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {users.map((u) => (
                        <TableRow key={u.id}>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.email || '—'}</TableCell>
                            <TableCell>{u.role}</TableCell>
                            <TableCell>{u.epicId || '—'}</TableCell>
                            <TableCell>{u.corporationName || '—'}</TableCell>
                            <TableCell>
                                <Typography sx={{ fontWeight: 600 }}>{u.wardName || '—'}</Typography>
                                {u.wardNumber && (
                                    <Typography variant="caption" color="text.secondary">{u.wardNumber}</Typography>
                                )}
                            </TableCell>
                            <TableCell>
                                {u.isBlocked ? (
                                    <Chip label="Blocked" color="error" size="small" />
                                ) : (
                                    <Chip label="Active" color="success" size="small" />
                                )}
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title="View">
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onView && onView(u.id); }}>
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Edit">
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit && onEdit(u.id); }}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={u.isBlocked ? 'Unblock' : 'Block'}>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => { e.stopPropagation(); onToggleBlock && onToggleBlock(u); }}
                                        color={u.isBlocked ? 'error' : 'default'}
                                    >
                                        {u.isBlocked ? <LockOpenIcon /> : <BlockIcon />}
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete">
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete && onDelete(u.id); }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UsersTable;
