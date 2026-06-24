import React from 'react';
import { Box, Stack, Typography, Card, CardContent, Avatar, TextField, Button, Divider, IconButton, Snackbar, Alert, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import useAuthStore from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';
import { getAspirantMessages, getWardMessages, postAspirantMessage, deleteAspirantMessage, AspirantChatMessageDto } from '../services/aspirantChatService';

const AspirantDiscussionPage: React.FC = () => {
    const { user } = useAuthStore();
    const { t } = useTranslation();
    const aspirantId = Number(user?.aspirantId);
    const wardNumber = user?.wardNumber;
    const [deletingIds, setDeletingIds] = React.useState<number[]>([]);

    const [messages, setMessages] = React.useState<AspirantChatMessageDto[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [posting, setPosting] = React.useState(false);
    const [text, setText] = React.useState('');
    const [successOpen, setSuccessOpen] = React.useState(false);
    const [errorOpen, setErrorOpen] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState('');

    const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    React.useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                let resp;
                if (wardNumber) {
                    resp = await getWardMessages(wardNumber, 1, 200);
                } else if (aspirantId) {
                    resp = await getAspirantMessages(aspirantId, 1, 200);
                } else {
                    resp = { data: [] } as any;
                }
                const data = (resp.data?.data ?? resp.data) as AspirantChatMessageDto[];
                data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                if (!mounted) return;
                setMessages(data || []);
                setTimeout(scrollToBottom, 50);
            } catch (err: any) {
                setMessages([]);
                setErrorMsg(err?.response?.data?.message || 'Failed to load messages');
                setErrorOpen(true);
            } finally {
                setLoading(false);
            }
        };
        void load();
        return () => { mounted = false; };
    }, [aspirantId]);

    const handleDelete = async (messageId: number) => {
        if (!messageId) return;
        setDeletingIds((p) => [...p, messageId]);
        try {
            await deleteAspirantMessage(messageId);
            setMessages((prev) => prev.filter((m) => m.id !== messageId));
            setSuccessOpen(true);
        } catch (err: any) {
            setErrorMsg(err?.response?.data?.message || 'Failed to delete message');
            setErrorOpen(true);
        } finally {
            setDeletingIds((p) => p.filter((id) => id !== messageId));
        }
    };
    React.useEffect(() => {
        if (!wardNumber && !aspirantId) return;
        let mounted = true;
        const fetchLoop = async () => {
            try {
                let resp;
                if (wardNumber) {
                    resp = await getWardMessages(wardNumber, 1, 200);
                } else {
                    resp = await getAspirantMessages(aspirantId, 1, 200);
                }
                const data = (resp.data?.data ?? resp.data) as AspirantChatMessageDto[];
                data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                if (!mounted) return;
                setMessages(data || []);
            } catch (e) {
                // ignore polling errors
            }
        };
        const id = setInterval(fetchLoop, 5000);
        return () => { mounted = false; clearInterval(id); };
    }, [wardNumber, aspirantId]);

    const handleSend = async () => {
        if (!text.trim() || !aspirantId) return;
        setPosting(true);
        try {
            const resp = await postAspirantMessage(aspirantId, { content: text.trim() });
            const m = resp.data as AspirantChatMessageDto;
            setMessages((prev) => [...prev, m]);
            setText('');
            setSuccessOpen(true);
            setTimeout(scrollToBottom, 50);
        } catch (err: any) {
            setErrorMsg(err?.response?.data?.message || 'Failed to send message');
            setErrorOpen(true);
        } finally {
            setPosting(false);
        }
    };

    // Only aspirant users should access this page; show readonly if not aspirant
    const isAspirantUser = user?.role === 'aspirant' && Number(user?.aspirantId) === aspirantId;

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>{t('discussion.title') || 'Aspirant Chat Room'}</Typography>
            {!isAspirantUser && (
                <Alert severity="info" sx={{ mb: 2 }}>{t('discussion.onlyAspirant') || 'Only the aspirant may post messages here. You can view the conversation.'}</Alert>
            )}
            <Card sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.02)' : undefined, border: isDark ? '1px solid rgba(255,255,255,0.04)' : undefined }}>
                <CardContent>
                    <Stack spacing={2} sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 1, bgcolor: isDark ? 'transparent' : undefined }}>
                        {loading && <Typography variant="body2">{t('common.loading') || 'Loading messages...'}</Typography>}
                        {messages.map((m) => {
                            const isMe = m.userId === user?.id;
                            const isAspirant = !!(m.user && 'role' in m.user && (m.user as any).role === 'aspirant');
                            const canDelete = true; // show delete for every message (server will enforce auth)
                            return (
                                <Stack
                                    key={m.id}
                                    direction="row"
                                    spacing={2}
                                    sx={{
                                        alignItems: "flex-start",
                                        justifyContent: isMe ? 'flex-end' : 'flex-start'
                                    }}>
                                    {!isMe && (
                                        <Avatar sx={{ width: 44, height: 44, bgcolor: isDark ? 'rgba(245,168,0,0.12)' : 'primary.main', color: isDark ? '#F5A800' : undefined }}>{(m.user?.name || 'U').charAt(0)}</Avatar>
                                    )}
                                    {/* delete button for received messages (left side) */}
                                    {!isMe && canDelete && (
                                        <IconButton size="small" sx={{ alignSelf: 'flex-start', mt: 1 }} onClick={() => handleDelete(m.id)} disabled={deletingIds.includes(m.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    <Box sx={{ bgcolor: isMe ? (isDark ? 'rgba(34,197,94,0.18)' : 'primary.main') : (isDark ? 'rgba(255,255,255,0.03)' : 'grey.100'), color: isMe ? (isDark ? '#DFFFE6' : '#fff') : (isDark ? 'rgba(255,255,255,0.9)' : 'text.primary'), px: 2.5, py: 1.75, borderRadius: 2, maxWidth: '75%' }}>
                                        {!isMe && (
                                            <Stack direction="row" spacing={1} sx={{
                                                alignItems: "center"
                                            }}>
                                                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>{m.user?.name}</Typography>
                                                {isAspirant && <Typography variant="caption" sx={{ bgcolor: '#FFF7ED', color: '#F97316', px: 0.5, borderRadius: 1 }}>{t('discussion.labels.aspirant') || 'Aspirant'}</Typography>}
                                            </Stack>
                                        )}
                                        <Typography variant="body2">{m.content}</Typography>
                                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8 }}>{new Date(m.createdAt).toLocaleString()}</Typography>
                                    </Box>
                                    {/* delete button for sent messages (right side) */}
                                    {isMe && canDelete && (
                                        <IconButton size="small" sx={{ alignSelf: 'flex-start', mt: 1 }} onClick={() => handleDelete(m.id)} disabled={deletingIds.includes(m.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Stack>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </Stack>
                </CardContent>
            </Card>
            <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
                <TextField
                    fullWidth
                    placeholder={isAspirantUser ? (t('discussion.placeholder') || 'Write a message...') : (t('discussion.readOnly') || 'Read-only')}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={!isAspirantUser}
                    onKeyDown={async (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); await handleSend(); } }}
                    variant="outlined"
                    sx={{
                        bgcolor: isDark ? 'rgba(255,255,255,0.02)' : undefined,
                        '& .MuiOutlinedInput-root': {
                            color: isDark ? 'rgba(255,255,255,0.9)' : undefined,
                            '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.06)' : undefined },
                            '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.12)' : undefined },
                            '&.Mui-focused fieldset': { borderColor: isDark ? 'rgba(245,168,0,0.7)' : undefined },
                        }
                    }}
                />
                <Button variant="contained" endIcon={<SendIcon />} onClick={handleSend} disabled={posting || !isAspirantUser} sx={{ color: '#ffffff' }}>{t('discussion.send') || 'Send'}</Button>
            </Box>
            <Snackbar open={successOpen} autoHideDuration={2500} onClose={() => setSuccessOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity="success" onClose={() => setSuccessOpen(false)}>{t('discussion.sent') || 'Message posted'}</Alert>
            </Snackbar>
            <Snackbar open={errorOpen} autoHideDuration={3500} onClose={() => setErrorOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity="error" onClose={() => setErrorOpen(false)}>{errorMsg}</Alert>
            </Snackbar>
        </Box>
    );
};

export default AspirantDiscussionPage;
