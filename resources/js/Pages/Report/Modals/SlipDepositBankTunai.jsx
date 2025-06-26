import { usePage } from '@inertiajs/react'
import { Box, Typography, FormControl, MenuItem, InputLabel, Select, Stack, TextField, Button, FormLabel, Modal } from '@mui/material'
import { useState, useEffect } from 'react';
import {
    DateField
} from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs';

export default function SlipDepositBankTunai({
    data,
    open,
    handleCloseModal,
    setData,
    processing,
    errors,
    handleSubmitReport
}) {

    const { cashiers, collection_centers, receipt_collections } = usePage().props


    const [cashierOptions, setCashierOptions] = useState([]);
    const [cashiersSelected, setCashierSelected] = useState('');

    const [collectionCenterOptions, setCollectionCenterOptions] = useState([]);
    const [collectionCenterSelected, setCollectionCenterSelected] = useState('');

    const [receiptCollectionOptions, setReceiptCollectionOptions] = useState([]);
    const [receiptCollectionSelected, setReceiptCollectionSelected] = useState('');

    const [counters, setCounters] = useState([]);

    const handleSelectCashier = (e) => {
        const cashierData = cashierOptions.find((cashier) => cashier.id === e.target.value)
        setData({ ...data, user_id: cashierData.id })
        setCashierSelected(cashierData.name)
    }

    const handleSelectCollectionCenter = (e) => {
        const collectionCenterData = collectionCenterOptions.find((collection_center) => collection_center.id === e.target.value)

        setData({ ...data, collection_center_id: e.target.value })

        setCollectionCenterSelected(collectionCenterData.name)
        setCounters(collectionCenterData.counters)
    }

    const handleSelectReceiptCollection = (e) => {
        const receiptCollectionData = receiptCollectionOptions.find((receipt_collection) => receipt_collection.id === e.target.value)
        setData({ ...data, receipt_collection_id: e.target.value })
        setReceiptCollectionSelected(receiptCollectionData.name)
    }

    useEffect(() => {
        if (cashiers) {
            setCashierOptions(cashiers.map((cashier) => ({
                id: cashier.id,
                name: cashier.name,
            })))
        }

        if (collection_centers) {
            setCollectionCenterOptions(collection_centers.map((collection_center) => ({
                id: collection_center.id,
                name: collection_center.name,
                counters: collection_center.counters
            })))
        }

        if (receipt_collections) {
            setReceiptCollectionOptions(receipt_collections.map((receipt_collection) => ({
                id: receipt_collection.id,
                name: receipt_collection.name,
            })))
        }

    }, [cashiers, collection_centers])

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
                    Laporan Slip Deposit Bank (Tunai)
                </Typography>
                <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 150 }}>ID Juruwang</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <Select
                                    onChange={handleSelectCashier}
                                    size='small'
                                    value={data.user_id}
                                    fullWidth
                                >
                                    <MenuItem value="">Semua</MenuItem>
                                    {
                                        cashierOptions.map((cashier) => (
                                            <MenuItem key={cashier.id} value={cashier.id}>{cashier.id}</MenuItem>
                                        ))
                                    }
                                </Select>
                                <TextField
                                    hiddenLabel
                                    value={cashiersSelected}
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
                                <Select
                                    onChange={handleSelectCollectionCenter}
                                    size='small'
                                    value={data.collection_center_id}
                                    fullWidth
                                >
                                    <MenuItem value="">Semua</MenuItem>
                                    {
                                        collectionCenterOptions.map((collection_center) => (
                                            <MenuItem key={collection_center.id} value={collection_center.id}>{collection_center.id}</MenuItem>
                                        ))
                                    }
                                </Select>
                                <TextField
                                    hiddenLabel
                                    value={collectionCenterSelected}
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
                            <FormControl>
                                <Select
                                    size='small'
                                    value={data.counter_id}
                                    onChange={(e) => setData({ ...data, counter_id: e.target.value })}
                                    fullWidth
                                >
                                    <MenuItem value="">Semua</MenuItem>
                                    {
                                        counters.map((counter) => (
                                            <MenuItem key={counter.id} value={counter.id}>{counter.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                                {errors.counter_id && <div className="text-red-500 mt-2 text-sm">{errors.counter_id}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 150 }}>Kumpulan Resit</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <Select
                                    size='small'
                                    value={data.receipt_collection_id}
                                    onChange={handleSelectReceiptCollection}
                                    fullWidth
                                >
                                    <MenuItem value="">Semua</MenuItem>
                                    {
                                        receiptCollectionOptions.map((receipt) => (
                                            <MenuItem key={receipt.id} value={receipt.id}>{receipt.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                                <TextField
                                    hiddenLabel
                                    value={receiptCollectionSelected}
                                    variant="filled"
                                    size="small"
                                    disabled
                                />
                                {errors.receipt_collection_id && <div className="text-red-500 mt-2 text-sm">{errors.receipt_collection_id}</div>}
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
                                    onChange={(e) => setData('type', e.target.value)}
                                    value={data.type}
                                    variant="filled"
                                    size="small"
                                />
                                {errors.type && <div className="text-red-500 mt-2 text-sm">{errors.type}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 150 }}>Tarikh Penerimaan</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl>
                                <DateField
                                    slotProps={{
                                        textField: { size: 'small' },
                                        borderRadius: '10px',
                                    }}
                                    value={dayjs(data.date)}
                                    onChange={(newValue) => {
                                        setData('date', newValue);
                                    }}
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
                                <Select
                                    size='small'
                                    value={data.type_report}
                                    onChange={(e) => setData({ ...data, type_report: e.target.value })}
                                    fullWidth
                                >
                                    <MenuItem value="terperinci">Terperinci</MenuItem>
                                    <MenuItem value="ringkasan">Ringkasan</MenuItem>
                                </Select>
                                {errors.type_report && <div className="text-red-500 mt-2 text-sm">{errors.type_report}</div>}
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
                                    value={data.deposit_date}
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
                                    onChange={(e) => setData('no_slip_bank', e.target.value)}
                                    value={data.no_slip_bank}
                                    variant="filled"
                                    size="small"
                                />
                                {errors.no_slip_bank && <div className="text-red-500 mt-2 text-sm">{errors.no_slip_bank}</div>}
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
