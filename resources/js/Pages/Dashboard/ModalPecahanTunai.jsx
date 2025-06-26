import React from 'react'
import {
    Box,
    Stack,
    TextField,
    Button,
    Modal,
    Typography,
    Grid,
} from '@mui/material'

import MoneyTable from '@/Components/ui/tables/MoneyTable'

const ModalPecahanTunai = ({
    openModal,
    handleClose,
    syilingDenominations,
    cashQuantities,
    coinQuantities,
    setCashQuantities,
    setCoinQuantities,
    totalCash,
    totalCoins,
    totalTunaiDibuka,
    setData,
    handleSubmitPecahanTunai
}) => {

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "80%",
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        borderRadius: 2,
        p: 4,
    }

    return (
        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Amaun Pembukaan Wang Apungan
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <MoneyTable
                            title="Pecahan Tunai"
                            denominations={[100, 50, 20, 10, 5, 1]}
                            quantities={cashQuantities}
                            setQuantities={setCashQuantities}
                            setData={setData}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <MoneyTable
                            title="Pecahan Syiling"
                            denominations={syilingDenominations}
                            quantities={coinQuantities}
                            setQuantities={setCoinQuantities}
                            setData={setData}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography sx={{ fontSize: '15px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                    Jumlah Ringgit
                                </Typography>
                            </Box>
                            <TextField
                                InputProps={{ readOnly: true }}
                                value={totalCash}
                                size="small"
                                sx={{ input: { textAlign: 'center' } }}
                            />
                        </Stack>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography sx={{ fontSize: '15px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                    Jumlah Tunai Dibuka
                                </Typography>
                            </Box>
                            <TextField
                                InputProps={{readOnly:true}}
                                value={totalTunaiDibuka}
                                size="small"
                                sx={{ input: { textAlign: 'center' } }}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'center' }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography sx={{ fontSize: '15px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                    Jumlah Syiling
                                </Typography>
                            </Box>
                            <TextField
                                InputProps={{ readOnly: true }}
                                value={totalCoins.toFixed(2)}
                                size="small"
                                sx={{ input: { textAlign: 'center' } }}
                            />
                        </Stack>
                    </Grid>
                </Grid>
                <Stack sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2 }}>
                    <Button onClick={handleClose} variant="outlined" fullWidth>Kembali</Button>
                    <Button variant="contained" fullWidth onClick={handleSubmitPecahanTunai}>Simpan</Button>
                </Stack>
            </Box>
        </Modal>
    )
}

export default ModalPecahanTunai
