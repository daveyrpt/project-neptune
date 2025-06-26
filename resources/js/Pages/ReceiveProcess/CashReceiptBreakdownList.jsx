import TableComponent from '@/Components/ui/tables/TableComponent';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import {
    Box,
    Typography,
    Stack,
    FormControl,
    MenuItem,
    InputLabel,
    Select,
    Button,
    TextField,
    Paper
} from '@mui/material';
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs'
import { useState, useMemo, useEffect } from 'react';
import { useDebounce, usePrevious } from 'react-use';
import { pickBy } from 'lodash';
import { contentBackgroundStyles } from '@/Utils/constants';
import { DatePicker } from '@mui/x-date-pickers-pro';
export default function CashReceiptBreakdownList() {

    const { auth, currentRoute, cash_receipt_breakdown, users, collection_centers, counters, receipt_collections } = usePage().props;

    const [search, setSearch] = useState('');

    useDebounce(() => {
        if (!search) return;
        setFilterValues({ ...filterValues, 'filter[search]': search, page: cash_receipt_breakdown.current_page !== 1 ? 1 : cash_receipt_breakdown.current_page })
    },
        500,
        [search]
    );

    const userMap = useMemo(() => {
        const map = {};
        users?.forEach(user => {
            map[user.id] = user.name;
        });
        return map;
    }, [users]);

    const collectionCenterMap = useMemo(() => {
        const map = {};
        collection_centers?.forEach(collection_center => {
            map[collection_center.id] = collection_center.name;
        });
        return map;
    }, [collection_centers]);

    const counterMap = useMemo(() => {
        const map = {};
        counters?.forEach(counter => {
            map[counter.id] = counter.name;
        });
        return map;
    }, [counters]);

    const receiptCollectionMap = useMemo(() => {
        const map = {};
        receipt_collections?.forEach(receipt_collection => {
            map[receipt_collection.id] = receipt_collection.name;
        });
        return map;
    }, [receipt_collections]);

    const [filterValues, setFilterValues] = useState({
        page: 1,
        'filter[search]': '',
        'filter[collection_center_id]': '',
        'filter[counter_id]': '',
        'filter[start_date]': '',
    });

    const prevValues = usePrevious(filterValues);

    useEffect(() => {
        if (!prevValues || JSON.stringify(prevValues) === JSON.stringify(filterValues)) return;

        const query = Object.keys(pickBy(filterValues)).length ? pickBy(filterValues) : {};

        router.get(route(route().current()), query, {
            replace: true,
            preserveState: true
        });
    }, [filterValues]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            currentRoute={currentRoute}
        >
            <Head title="Senarai Pecahan Terimaan Tunai" />
            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    Senarai Pecahan Terimaan Tunai
                </Typography>
                <Stack direction="row" spacing={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Pusat Kutipan</InputLabel>
                        <Select
                            value={filterValues['filter[collection_center_id]']}
                            label="Pusat Kutipan"
                            onChange={(e) => setFilterValues({ ...filterValues, 'filter[collection_center_id]': e.target.value, page: cash_receipt_breakdown.current_page !== 1 ? 1 : cash_receipt_breakdown.current_page })}
                        >
                            <MenuItem value="">Semua</MenuItem>
                            {
                                collection_centers.map((collection_center) => (
                                    <MenuItem key={collection_center.id} value={collection_center.id}>{collection_center.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                        <InputLabel>No. Kaunter</InputLabel>
                        <Select
                            value={filterValues['filter[counter_id]']}
                            label="No. Kaunter"
                            onChange={(e) => setFilterValues({ ...filterValues, 'filter[counter_id]': e.target.value, page: cash_receipt_breakdown.current_page !== 1 ? 1 : cash_receipt_breakdown.current_page })}
                        >
                            {
                                counters.map((counter) => (
                                    <MenuItem key={counter.id} value={counter.id}>{counter.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <DatePicker
                        slotProps={{
                            textField: { size: "small" },
                            borderRadius: "10px",
                        }}
                        sx={{ width: 500 }}
                        value={filterValues['filter[start_date]'] ? dayjs(filterValues['filter[start_date]'], "DD-MM-YYYY") : null}
                        onChange={(value) =>
                            setFilterValues({
                                ...filterValues,
                                'filter[start_date]': value.format("DD-MM-YYYY"),
                            })
                        }
                    />
                    {/* <TextField hiddenLabel fullWidth id="search" label="Carian" variant="outlined" size="small" value={search} onChange={(e) => setSearch(e.target.value)} /> */}
                    <Button
                        sx={{ borderRadius: 'var(--button-radius)', textTransform: 'none', width: 300 }}
                        variant="contained" size="small" fullWidth 
                        onClick={()=>{
                            setSearch('');
                            setFilterValues({
                                page: 1,
                                'filter[search]': '',
                                'filter[collection_center_id]': '',
                                'filter[counter_id]': '',
                                'filter[start_date]': '',
                            });
                        }}
                    >Reset</Button>
                </Stack>
                <Box sx={{ mt: 2 }}>
                    <TableComponent
                        columns={[
                            {
                                label: 'ID Juruwang',
                                name: 'user_id',
                                renderCell: (row) => userMap[row.user_id] || '—'
                            },
                            {
                                label: 'Pusat Kutipan',
                                name: 'collection_center_id',
                                renderCell: (row) => collectionCenterMap[row.collection_center_id] || '—'
                            },
                            {
                                label: 'No. Kaunter',
                                name: 'counter_id',
                                renderCell: (row) => counterMap[row.counter_id] || '—'
                            },
                            {
                                label: 'Tarikh Penerimaan',
                                name: 'receipt_date',
                                renderCell: (row) => dayjs(row.receipt_date).format('DD-MM-YYYY') || '—'
                            },
                            {
                                label: 'Kumpulan Resit',
                                name: 'receipt_collection_id',
                                renderCell: (row) => receiptCollectionMap[row.receipt_collection_id] || '—'
                            },
                            {
                                label: 'Amaun Penerimaan',
                                name: 'total_amount',
                                renderCell: (row) => 'RM ' + row.total_amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') || '—'
                            },
                            {
                                label: 'Tindakan',
                                name: 'action',
                                renderCell: (row) => {
                                    return (
                                        <>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{ textTransform: 'none', mr: 1 }}
                                                href={route('cash-receipt-breakdown.print', row.id)}>
                                                Cetak
                                            </Button>
                                        </>
                                    )
                                },
                            }
                        ]}
                        rows={cash_receipt_breakdown}
                    />
                </Box>
            </Box>
        </AuthenticatedLayout >
    );
}
