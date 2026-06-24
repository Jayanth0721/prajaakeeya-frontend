import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Stack,
    Alert,
    CircularProgress,
    useTheme,
    Chip,
    IconButton,
    Divider
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    Description as DescriptionIcon,
    CheckCircle as CheckCircleIcon,
    Download as DownloadIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import apiClient from '../../services/apiClient';

interface SopDocument {
    id: number;
    createdAt: number;
    updatedAt: number;
    documentType: string;
    documentUrl: string;
    version: string;
    description: string;
    isActive: boolean;
}

const AdminUploadSopPage: React.FC = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [file, setFile] = useState<File | null>(null);
    const [version, setVersion] = useState('v1.0');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [documents, setDocuments] = useState<SopDocument[]>([]);
    const [docsLoading, setDocsLoading] = useState(true);

    const fetchDocuments = async () => {
        setDocsLoading(true);
        try {
            const resp = await apiClient.get('/media/admin/documents');
            const list = Array.isArray(resp.data) ? resp.data : [];
            setDocuments(list);
        } catch {
            // ignore
        } finally {
            setDocsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        if (selected && selected.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB');
            setFile(null);
            return;
        }
        if (selected && selected.type !== 'application/pdf') {
            setError('Only PDF files are allowed');
            setFile(null);
            return;
        }
        setError(null);
        setFile(selected);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload');
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            formData.append('documentType', 'sop');
            formData.append('file', file, file.name);
            if (version.trim()) formData.append('version', version.trim());
            if (description.trim()) formData.append('description', description.trim());

            await apiClient.post('/media/admin/document', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 60000,
            });

            setSuccess('SOP uploaded successfully!');
            setFile(null);
            setVersion('v1.0');
            setDescription('');
            const fileInput = document.getElementById('sop-file-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            fetchDocuments();
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || 'Failed to upload SOP';
            setError(msg);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                {t('adminDashboard.nav.uploadSop', { defaultValue: 'Upload SOP Document' })}
            </Typography>
            <Card sx={{
                borderRadius: 3,
                boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(245,168,0,0.15)' : 'rgba(0,0,0,0.06)',
                width: '100%',
                mb: 3,
            }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                            mb: 3
                        }}>
                        Upload the SOP document (English & Kannada combined PDF). Max file size: 10MB.
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>{success}</Alert>}

                    <Stack spacing={2.5}>
                        <Box
                            sx={{
                                border: '2px dashed',
                                borderColor: file ? 'primary.main' : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'),
                                borderRadius: 2,
                                p: 3,
                                textAlign: 'center',
                                cursor: 'pointer',
                                bgcolor: file ? (isDark ? 'rgba(245,168,0,0.06)' : 'rgba(245,168,0,0.04)') : 'transparent',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: isDark ? 'rgba(245,168,0,0.08)' : 'rgba(245,168,0,0.06)',
                                },
                            }}
                            onClick={() => document.getElementById('sop-file-input')?.click()}
                        >
                            <input
                                id="sop-file-input"
                                type="file"
                                accept="application/pdf"
                                hidden
                                onChange={handleFileChange}
                            />
                            {file ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                    <DescriptionIcon sx={{ color: 'primary.main' }} />
                                    <Typography sx={{ fontWeight: 600 }}>{file.name}</Typography>
                                    <Typography variant="caption" sx={{
                                        color: "text.secondary"
                                    }}>
                                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                    </Typography>
                                </Box>
                            ) : (
                                <Box>
                                    <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                    <Typography sx={{ fontWeight: 600 }}>Click to select PDF file</Typography>
                                    <Typography variant="caption" sx={{
                                        color: "text.secondary"
                                    }}>
                                        SOP-English-Kannada.pdf (max 10MB)
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        <TextField
                            label="Version"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            placeholder="v1.0"
                            size="small"
                            fullWidth
                        />

                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Updated SOP for 2025"
                            size="small"
                            fullWidth
                            multiline
                            rows={2}
                        />

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleUpload}
                            disabled={uploading || !file}
                            startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                            sx={{
                                borderRadius: 2,
                                py: 1.2,
                                color: '#fff',
                                fontWeight: 700,
                            }}
                        >
                            {uploading ? 'Uploading...' : 'Upload SOP'}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
            {/* Uploaded Documents List */}
            <Card sx={{
                borderRadius: 3,
                boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(245,168,0,0.15)' : 'rgba(0,0,0,0.06)',
                width: '100%',
            }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Uploaded Documents
                        </Typography>
                        <IconButton size="small" onClick={fetchDocuments} aria-label="Refresh">
                            <RefreshIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {docsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress size={28} />
                        </Box>
                    ) : documents.length === 0 ? (
                        <Typography variant="body2" sx={{
                            color: "text.secondary"
                        }}>
                            No SOP documents uploaded yet.
                        </Typography>
                    ) : (
                        <Stack spacing={1.5} divider={<Divider />}>
                            {documents.map((doc) => (
                                <Box key={doc.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <DescriptionIcon sx={{ color: 'primary.main', flexShrink: 0 }} />
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                {doc.documentType.toUpperCase()}
                                            </Typography>
                                            {doc.version && (
                                                <Chip label={doc.version} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }} />
                                            )}
                                            {doc.isActive && (
                                                <Chip label="Active" size="small" color="success" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }} />
                                            )}
                                        </Box>
                                        {doc.description && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: "text.secondary",
                                                    display: 'block'
                                                }}>
                                                {doc.description}
                                            </Typography>
                                        )}
                                        <Typography variant="caption" sx={{
                                            color: "text.secondary"
                                        }}>
                                            Uploaded: {new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => window.open(doc.documentUrl, '_blank')}
                                        aria-label="Download"
                                        sx={{ color: 'primary.main' }}
                                    >
                                        <DownloadIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </Stack>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default AdminUploadSopPage;
