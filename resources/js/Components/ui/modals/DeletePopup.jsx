import {
    Box,
    Button,
    Modal,
    Stack,
    Typography,
} from '@mui/material';
export default function DeletePopup({ openDelete, handleCloseDelete, title, subtitle, processing, handleSubmitDelete }) {
    return (
        <Modal
            open={openDelete}
            onClose={handleCloseDelete}
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'background.paper',
                // border: '2px solid #000',
                boxShadow: 24,
                borderRadius: 2,
                p: 4,
            }}>
                <Typography variant="h6" component="h2">
                    {title}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    {subtitle}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={handleCloseDelete}
                        sx={{ textTransform: 'none' }}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color="error"
                        fullWidth
                        onClick={handleSubmitDelete}
                        disabled={processing}
                    >
                        OK
                    </Button>
                </Stack>
            </Box>
        </Modal>
    )
}
