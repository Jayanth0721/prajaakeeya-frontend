import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, Box, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Props {
    reports: any[];
    loading?: boolean;
    onView: (id: string) => void;
}

const statusColor = (s: string) => {
    switch (s) {
        case 'pending':
        case 'Pending':
            return 'warning';
        case 'In Progress':
        case 'in_progress':
        case 'InProgress':
            return 'info';
        case 'Resolved':
        case 'resolved':
            return 'success';
        case 'Rejected':
        case 'rejected':
            return 'default';
        default:
            return 'default';
    }
};

const truncateOneLineStyle = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 } as const;

const ReportsTable: React.FC<Props> = ({ reports, onView }) => {
    if (!reports || reports.length === 0) {
        return (
            <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">No reports found</Typography>
            </Box>
        );
    }

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Report ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Reported User</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Reported User Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Reported By</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Ward</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Reported On</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {reports.map((r) => {
                    const id = r.id ?? r.reportId ?? r.report_id ?? '';
                    const reportedUserName = r.reportedUser?.nameEn || r.reportedUser?.name || r.submittedBy?.name || '';
                    const reportedUserType = r.reportedUserType || r.reportedUser?.role || r.userType || '';
                    const reportedByName = r.reportedBy?.nameEn || r.reportedBy?.name || r.submittedBy?.name || '';
                    const wardName = r.ward?.name || r.ward || r.wardName || '';
                    const reason = r.reason || r.description || r.title || '';
                    const status = r.status || r.currentStatus || '';
                    const createdAt = r.createdAt || r.created_at || r.created || '';

                    return (
                        <TableRow key={id} hover>
                            <TableCell>{id}</TableCell>
                            <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{reportedUserName}</Typography>
                            </TableCell>
                            <TableCell>{reportedUserType}</TableCell>
                            <TableCell>{reportedByName}</TableCell>
                            <TableCell>{wardName}</TableCell>
                            <TableCell>
                                <Typography variant="body2" sx={truncateOneLineStyle} title={reason}>
                                    {reason}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip label={status} color={statusColor(status)} />
                            </TableCell>
                            <TableCell>{createdAt ? new Date(createdAt).toLocaleString() : ''}</TableCell>
                            <TableCell>
                                <IconButton size="small" onClick={() => onView(id)} title="View details">
                                    <VisibilityIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default ReportsTable;
