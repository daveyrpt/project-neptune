import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Box,
    Typography,
    Stack,
    FormControl,
    MenuItem,
    Select,
    TextField,
    Grid,
    Button
} from '@mui/material';
import {
    DateField
} from '@mui/x-date-pickers-pro';
import { useEffect, useState } from 'react';
import CustomTextField from '@/Components/ui/field/CustomTextField';
import dayjs from 'dayjs';
import MoneyTable from '@/Components/ui/tables/MoneyTable';
import { contentBackgroundStyles } from '@/Utils/constants';

export default function CashReceiptBreakdown() {

    const { auth, currentRoute, cashiers, collection_centers, receipt_collections, total_ammount_receipt } = usePage().props;

    const [cashierOptions, setCashierOptions] = useState([]);
    const [cashiersSelected, setCashierSelected] = useState('');

    const [collectionCenterOptions, setCollectionCenterOptions] = useState([]);
    const [collectionCenterSelected, setCollectionCenterSelected] = useState('');

    const [receiptCollectionOptions, setReceiptCollectionOptions] = useState([]);
    const [receiptCollectionSelected, setReceiptCollectionSelected] = useState('');

    const [counters, setCounters] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        collection_center_id: auth.user?.current_cashier_opened_counter?.collection_center?.id,
        counter_id: auth.user?.current_cashier_opened_counter?.counter?.id,
        user_id: auth.user?.id,
        staff_id: auth.user?.staff_id,
        receipt_date: dayjs().format('YYYY-MM-DD'),

        RM100: '',
        RM50: '',
        RM20: '',
        RM10: '',
        RM5: '',
        RM1: '',

        'RM0.50': '',
        'RM0.20': '',
        'RM0.10': '',
        'RM0.05': '',
    });

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
                staff_id: cashier.staff_id
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
                code: receipt_collection.code,
            })))
        }

    }, [cashiers, collection_centers, receipt_collections])

    const tunaiDenominations = [100, 50, 20, 10, 5, 1];
    const syilingDenominations = [0.5, 0.2, 0.1, 0.05];

    const [cashQuantities, setCashQuantities] = useState(
        tunaiDenominations.reduce((acc, val) => ({ ...acc, [val]: '' }), {})
    );
    const [coinQuantities, setCoinQuantities] = useState(
        syilingDenominations.reduce((acc, val) => ({ ...acc, [val]: '' }), {})
    );

    const calculateTotal = (denominations, quantities) => {
        return denominations.reduce((total, denom) => {
            const qty = parseInt(quantities[denom] || '0', 10);
            return total + denom * qty;
        }, 0);
    };

    const totalCash = calculateTotal(tunaiDenominations, cashQuantities);
    const totalCoins = calculateTotal(syilingDenominations, coinQuantities);
    const totalTunaiDibuka = totalCash + totalCoins;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('cash-receipt-breakdown.store'), {
            onSuccess: () => {
                // Optionally reset or show a toast
            },
            onError: () => {
                // errors will be available from the `errors` object
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            currentRoute={currentRoute}
        >
            <Head title="Pecahan Terimaan Tunai" />
            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    Pecahan Terimaan Tunai
                </Typography>
                <Box
                    sx={{
                        display: "grid",
                        gap: 3
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 100 }}>ID Juruwang</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <Select
                                    onChange={handleSelectCashier}
                                    size='small'
                                    value={data.staff_id}
                                    fullWidth
                                    disabled
                                >
                                    <MenuItem value="">Semua</MenuItem>
                                    {
                                        cashierOptions.map((cashier) => (
                                            <MenuItem key={cashier.id} value={cashier.staff_id}>{cashier.staff_id}</MenuItem>
                                        ))
                                    }
                                </Select>
                                <TextField
                                    hiddenLabel
                                    id="user_id"
                                    name="user_id"
                                    //value={cashiersSelected}
                                    value={auth.user?.name}
                                    variant="filled"
                                    size="small"
                                    disabled
                                />
                                {errors.code && <div className="text-red-500 mt-2 text-sm">{errors.code}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 100 }}>Pusat Kutipan</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <Select
                                    onChange={handleSelectCollectionCenter}
                                    size='small'
                                    value={data.collection_center_id}
                                    fullWidth
                                    disabled
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
                                    id="name"
                                    name="name"
                                    //value={collectionCenterSelected}
                                    value={auth.user?.current_cashier_opened_counter?.collection_center?.name}
                                    defaultValue=""
                                    variant="filled"
                                    size="small"
                                    disabled
                                />
                                {errors.name && <div className="text-red-500 mt-2 text-sm">{errors.name}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 100 }}>No. Kaunter</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl>
                                {/* <Select
                                        size='small'
                                        value={data.counter_id}
                                        onChange={(e) => setData({ ...data, counter_id: e.target.value })}
                                        fullWidth
                                        disabled
                                    >
                                        <MenuItem value="">Semua</MenuItem>
                                        {
                                            counters.map((counter) => (
                                                <MenuItem key={counter.id} value={counter.id}>{counter.name}</MenuItem>
                                            ))
                                        }
                                    </Select> */}
                                <TextField
                                    hiddenLabel
                                    id="name"
                                    name="name"
                                    //value={collectionCenterSelected}
                                    value={auth.user?.current_cashier_opened_counter?.counter?.id}
                                    defaultValue=""
                                    fullWidth
                                    size="small"
                                    disabled
                                />
                                {errors.name && <div className="text-red-500 mt-2 text-sm">{errors.name}</div>}
                            </FormControl>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 120 }}>Tarikh Penerimaan</Typography>
                        <Typography>:</Typography>
                        <DateField
                            slotProps={{
                                textField: {
                                    size: "small",
                                    fullWidth: true,
                                },
                            }}
                            value={dayjs(data.receipt_date)}
                            onChange={(date) => {
                                setData({ ...data, receipt_date: date ? date.format('YYYY-MM-DD HH:mm:ss') : null });
                            }}
                            disabled
                        />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 100 }}>Kumpulan Resit</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <Select
                                    onChange={handleSelectReceiptCollection}
                                    size='small'
                                    value={data.receipt_collection_id}
                                    fullWidth
                                >
                                    {
                                        receiptCollectionOptions.map((receipt_collection) => (
                                            <MenuItem key={receipt_collection.id} value={receipt_collection.id}>{receipt_collection.code}</MenuItem>
                                        ))
                                    }
                                </Select>
                                {/* <TextField
                                    hiddenLabel
                                    value={receiptCollectionSelected}
                                    defaultValue=""
                                    variant="filled"
                                    size="small"
                                    disabled
                                /> */}
                            </FormControl>
                        </Box>
                    </Stack>
                </Box>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <MoneyTable
                        title="Pecahan Tunai"
                        denominations={[100, 50, 20, 10, 5, 1]}
                        quantities={cashQuantities}
                        setQuantities={setCashQuantities}
                        setData={setData}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <MoneyTable
                        title="Pecahan Syiling"
                        denominations={[0.50, 0.20, 0.10, 0.05]}
                        quantities={coinQuantities}
                        setQuantities={setCoinQuantities}
                        setData={setData}
                    />
                </Grid>
            </Grid>
            <Grid item xs={12} sx={{ paddingX: '3rem' }}>
                <Stack direction='column' sx={{ mt: 2, gap: 2 }}>
                    <CustomTextField
                        label="Jumlah Ringgit"
                        value={Number(totalCash).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                        extraStyle={{ width: "100%" }}
                    />
                    {/* <CustomTextField
                                    label="Jumlah Tunai Dibuka"
                                    value={total_float_cash}
                                /> */}
                    <CustomTextField
                        label="Jumlah Tunai Dikira"
                        value={Number(totalCoins + totalCash).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    />
                </Stack>
                <Stack direction='column' sx={{ mt: 2 }} gap={2}>
                    <CustomTextField
                        label="Jumlah Syiling"
                        value={totalCoins.toFixed(2)}
                    />
                    <CustomTextField
                        label="Amaun Penerimaan"
                        value={Number(total_ammount_receipt).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    />
                </Stack>
            </Grid>
            <Stack sx={{ display: "flex", flexDirection: "row", gap: 2, marginX: '3rem', marginY: '2rem' }}>
                {/* <Button variant="outlined" fullWidth>Batal</Button> */}
                <Button variant="contained" fullWidth onClick={handleSubmit} disabled={processing}>
                    Simpan
                </Button>
            </Stack>
        </AuthenticatedLayout>
    );
}
