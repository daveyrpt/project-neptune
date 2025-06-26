import React from 'react'
import {
    Box,
    FormControl,
    MenuItem,
    InputLabel,
    Select,
    Stack,
    TextField,
    Button,
    FormLabel,
    Modal,
    Typography
} from '@mui/material'
import { defaultModalStyles } from '@/Utils/constants'
import TitleCaptions from '@/Components/ui/TitleCaptions'
const ModalEdit = ({ openModalOpenItem, handleClose, handleSubmitEdit, data, setData, errors, processing }) => {
    return (
        <Modal
            open={openModalOpenItem}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                minWidth: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 2,
                p: 4,
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Kemaskini Nombor Akaun
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Typography sx={{ width: 300 }}>No. Akaun/ No. Lesen</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl>
                                <TextField
                                    hiddenLabel
                                    id="account_number"
                                    name="account_number"
                                    value={data.account_number}
                                    onChange={(e) => setData('account_number', e.target.value)}
                                    variant="filled"
                                    size="small"
                                />
                                {errors.account_number && <div className="text-red-500 mt-2 text-sm">{errors.account_number}</div>}
                            </FormControl>
                        </Box>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Typography sx={{ width: 300 }}>Pemegang Akaun</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl>
                                <TextField
                                    hiddenLabel
                                    id="account_holder_name"
                                    name="account_holder_name"
                                    value={data.account_holder_name}
                                    onChange={(e) => setData('account_holder_name', e.target.value)}
                                    variant="filled"
                                    size="small"
                                />
                                {errors.account_holder_name && <div className="text-red-500 mt-2 text-sm">{errors.account_holder_name}</div>}
                            </FormControl>
                        </Box>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Typography sx={{ width: 300 }}>Amaun (RM)</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl>
                                <TextField
                                    hiddenLabel
                                    id="amount"
                                    name="amount"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    variant="filled"
                                    size="small"
                                />
                                {errors.amount && <div className="text-red-500 mt-2 text-sm">{errors.amount}</div>}
                            </FormControl>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={handleClose}
                        >
                            Tutup
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            onClick={handleSubmitEdit}
                            disabled={processing}
                        >
                            Simpan
                        </Button>
                    </Stack>
                </Typography>
            </Box>
        </Modal>
    )
}

export default ModalEdit