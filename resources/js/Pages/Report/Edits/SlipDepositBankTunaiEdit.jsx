import { usePage } from '@inertiajs/react'
import { Box, Typography, FormControl, MenuItem, InputLabel, Select, Stack, TextField, Button, FormLabel, Modal } from '@mui/material'
import { useState, useEffect } from 'react';
import {
    DateField
} from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs';

export default function SlipDepositBankTunaiEdit({
    data,
    open,
    handleCloseModal,
    setData,
    processing,
    errors,
    handleSubmitReport
}) {

    const { auth, cashiers, collection_centers, receipt_collections, counters } = usePage().props

    console.log('slip deposit bank', data)
    console.log('auth', auth.user.staff_id)
    console.log('cashiers', cashiers)

    const kumpulanResit = receipt_collections.find(receipt_collection => receipt_collection.name === data.receipt_collection)

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
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
                    Kemaskini Slip Deposit Bank (Tunai)
                </Typography>
                <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 150 }}>ID Juruwang</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <TextField
                                    hiddenLabel
                                    value={auth.user.staff_id}
                                    variant="filled"
                                    size="small"
                                    disabled
                                />
                                {errors.user_id && <div className="text-red-500 mt-2 text-sm">{errors.user_id}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 150 }}>Pusat Kutipan</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <TextField
                                    hiddenLabel
                                    value={collection_centers.find((collection_center) => collection_center.id === data.collection_center_id)?.name}
                                    variant="filled"
                                    size="small"
                                    disabled
                                />
                                {errors.collection_center_id && <div className="text-red-500 mt-2 text-sm">{errors.collection_center_id}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 150 }}>No. Kaunter</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <TextField
                                    hiddenLabel
                                    value={counters.find((counter) => counter.id === data.counter_id)?.name}
                                    variant="filled"
                                    size="small"
                                    disabled
                                />
                                {errors.counter_id && <div className="text-red-500 mt-2 text-sm">{errors.counter_id}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 150 }}>Kumpulan Resit</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <TextField
                                    hiddenLabel
                                    value={`${kumpulanResit?.code} - ${kumpulanResit?.name}`}
                                    variant="filled"
                                    size="small"
                                    disabled
                                />
                                {errors.receipt_collection && <div className="text-red-500 mt-2 text-sm">{errors.receipt_collection}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 150 }}>Jenis Bayaran</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl>
                                <TextField
                                    hiddenLabel
                                    onChange={(e) => setData('payment_type', e.target.value)}
                                    value={data.payment_type}
                                    variant="filled"
                                    size="small"
                                    disabled
                                />
                                {errors.payment_type && <div className="text-red-500 mt-2 text-sm">{errors.payment_type}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 150 }}>Tarikh Penerimaan</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl>
                                <TextField
                                    hiddenLabel
                                    value={dayjs(data.date).format('DD/MM/YYYY')}
                                    variant="filled"
                                    size="small"
                                    disabled
                                />
                                {errors.date && <div className="text-red-500 mt-2 text-sm">{errors.date}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 150 }}>Jenis Laporan</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl>
                                <TextField
                                    hiddenLabel
                                    value={data.report_type === 'terperinci' ? 'Terperinci' : 'Ringkasan'}
                                    variant="filled"
                                    size="small"
                                    disabled
                                    />
                                {errors.report_type && <div className="text-red-500 mt-2 text-sm">{errors.report_type}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 150 }}>Tarikh Deposit</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl>
                                <DateField
                                    slotProps={{
                                        textField: { size: 'small' },
                                        borderRadius: '10px',
                                    }}
                                    value={dayjs(data.deposit_date)}
                                    onChange={(newValue) => {
                                        setData('deposit_date', newValue);
                                    }}
                                />
                                {errors.deposit_date && <div className="text-red-500 mt-2 text-sm">{errors.deposit_date}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 150 }}>No. Slip Bank</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl>
                                <TextField
                                    hiddenLabel
                                    onChange={(e) => setData('slip_number', e.target.value)}
                                    value={data.slip_number}
                                    variant="filled"
                                    size="small"
                                />
                                {errors.slip_number && <div className="text-red-500 mt-2 text-sm">{errors.slip_number}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={handleCloseModal}
                            sx={{ textTransform: 'none' }}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            onClick={handleSubmitReport}
                            disabled={processing}
                        >
                            OK
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Modal>
    )
}
