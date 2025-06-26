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
    Button
} from '@mui/material';
import {
    DateField
} from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { useEffect, useState } from 'react';
import { contentBackgroundStyles } from '@/Utils/constants';
import dayjs from 'dayjs';

export default function CashReceiptBreakdown() {

    const { auth, currentRoute, cashiers, collection_centers, receipt_collections } = usePage().props;

    const [cashierOptions, setCashierOptions] = useState([]);
    const [cashiersSelected, setCashierSelected] = useState('');

    const [collectionCenterOptions, setCollectionCenterOptions] = useState([]);
    const [collectionCenterSelected, setCollectionCenterSelected] = useState('');

    const [receiptCollectionOptions, setReceiptCollectionOptions] = useState([]);
    const [receiptCollectionSelected, setReceiptCollectionSelected] = useState('');

    const [counters, setCounters] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        user_id: auth.user?.id,
        staff_id: auth.user?.staff_id,
        collection_center_id: auth.user?.current_cashier_opened_counter?.collection_center?.id,
        counter_id: auth.user?.current_cashier_opened_counter?.counter?.id,
        type: '',
        date_applied: dayjs().format('YYYY-MM-DD'),
        total: '',
    })

    console.log('data', data)

    const handleSelectCashier = (e) => {
        const cashierData = cashierOptions.find((cashier) => cashier.id === e.target.value)
        setData({ ...data, user_id: cashierData.id })
        setCashierSelected(cashierData.name)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('float-cash.store'), {
            onSuccess: () => {
                // Optionally reset or show a toast
            },
            onError: () => {
                // errors will be available from the `errors` object
            }
        });
    };

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
                name: receipt_collection.name,
            })))
        }

    }, [cashiers, collection_centers, receipt_collections])

    const columns = [
        {
            label: 'Amaun (RM)',
            name: 'amount',
        },
        {
            label: 'Kuantiti',
            name: 'kuantiti',
        },
        {
            label: 'Nilai (RM)',
            name: 'nilai',
        }
    ]

    return (
        <AuthenticatedLayout
            user={auth.user}
            currentRoute={currentRoute}
        >
            <Head title="Wang Apungan" />
            <Box sx={contentBackgroundStyles}>

                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    Wang Apungan
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
                        <Typography sx={{ width: 100 }}>Jenis</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl>
                                <Select
                                    size='small'
                                    value={data.type}
                                    onChange={(e) => setData({ ...data, type: e.target.value })}
                                    fullWidth
                                >
                                    <MenuItem value="increment">Penambahan Wang Apungan</MenuItem>
                                    <MenuItem value="decrement">Pengurangan Wang Apungan</MenuItem>
                                    {/* {
                                        counters.map((counter) => (
                                            <MenuItem key={counter.id} value={counter.id}>{counter.name}</MenuItem>
                                        ))
                                    } */}
                                </Select>
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
                            value={dayjs(data.date_applied)}
                            onChange={(date) => {
                                setData({ ...data, date_applied: date });
                            }}
                            disabled
                        />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography sx={{ width: 100 }}>Jumlah (RM)</Typography>
                        <Typography>:</Typography>
                        <Box>
                            <FormControl>
                                <TextField
                                    size='small'
                                    type="number"
                                    fullWidth
                                    value={data.total}
                                    onChange={(e) => setData({ ...data, total: e.target.value })}
                                />
                            </FormControl>
                        </Box>
                    </Stack>
                </Box>
                <Stack sx={{ display: "flex", flexDirection: "row", gap: 2, marginX: '3rem', marginY: '2rem' }}>
                    {/* <Button variant="outlined" fullWidth>Batal</Button> */}
                    <Button variant="contained" fullWidth onClick={handleSubmit} disabled={processing}>Hantar</Button>
                </Stack>
            </Box>
        </AuthenticatedLayout>
    );
}
