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
const ModalOpenItem = ({ openModalOpenItem, handleClose, handleSubmitOpenItem, data, setData, errors, processing }) => {
    return (
        <Modal
            open={openModalOpenItem}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={defaultModalStyles}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Bayaran Pendahuluan
                </Typography>
                <Typography component="p">
                    Maklumat ini didaftar sekiranya pelanggan ingin membayar bil yang belum dijana oleh sistem
                </Typography>
                <TitleCaptions
                    title="Open Item"
                />
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Typography sx={{ width: 300 }}>Sistem</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl sx={{ width: 300, display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <Select
                                    onChange={(e) => setData({ ...data, system: e.target.value })}
                                    size='small'
                                    value={data.system}
                                    fullWidth
                                >
                                    <MenuItem value="PRS">Sewaan (PRS)</MenuItem>
                                    <MenuItem value="PAS">Cukai (PAS)</MenuItem>
                                    <MenuItem value="LISO">Lesen Operasi (LIS Operating)</MenuItem>
                                    <MenuItem value="LIST">Lesen Perniagaan (LIS Trading)</MenuItem>
                                    <MenuItem value="NBL">Lesen UUK</MenuItem>
                                </Select>
                                {errors.system && <div className="text-red-500 mt-2 text-sm">{errors.system}</div>}
                            </FormControl>
                        </Box>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 300 }}>No Akaun/No. Lesen</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl fullWidth sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <TextField
                                    hiddenLabel
                                    value={data.account_number}
                                    onChange={(e) => setData({ ...data, account_number: e.target.value })}
                                    variant="standard"
                                    size="small"
                                />
                                {errors.account_number && <div className="text-red-500 mt-2 text-sm">{errors.account_number}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 300 }}>ID Pelanggan</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl sx={{ width: 300,  display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <TextField
                                    hiddenLabel
                                    value={data.identity_number}
                                    onChange={(e) => setData({ ...data, identity_number: e.target.value })}
                                    variant="standard"
                                    size="small"
                                />
                                {errors.identity_number && <div className="text-red-500 mt-2 text-sm">{errors.identity_number}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 300 }}>Nama Pelanggan</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl sx={{ width: 300,  display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <TextField
                                    hiddenLabel
                                    value={data.customer_name}
                                    onChange={(e) => setData({ ...data, customer_name: e.target.value })}
                                    variant="standard"
                                    size="small"
                                />
                                {errors.customer_name && <div className="text-red-500 mt-2 text-sm">{errors.customer_name}</div>}
                            </FormControl>
                        </Box>
                    </Stack>

                    <Typography component="p">
                        *Setelah maklumat bil didaftarkan, sila teruskan dengan proses Terimaan.
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button variant="outlined" size="small" fullWidth onClick={handleClose}>Tutup</Button>
                        <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            onClick={handleSubmitOpenItem}
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

export default ModalOpenItem