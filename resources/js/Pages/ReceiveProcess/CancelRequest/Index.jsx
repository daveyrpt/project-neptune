import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';

import {
    Box,
    Typography,
    Button,
    Stack,
    TextField,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
} from '@mui/material'
import TableComponent from '@/Components/ui/tables/TableComponent';
import { contentBackgroundStyles } from "@/Utils/constants.jsx";
import { useMemo, useState, useEffect } from 'react';
import { useDebounce, usePrevious } from 'react-use';
import { pickBy, set } from 'lodash';
import { DatePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';

export default function CancelRequest() {
    const { auth, currentRoute, cancelled_receipts, users, collection_centers, counters } = usePage().props

    const [search, setSearch] = useState('');
    const [filterValues, setFilterValues] = useState({
        'filter[search]': '',
        page: 1
    })
    useDebounce(() => {
        if (!search) return;
        setFilterValues({ ...filterValues, 'filter[search]': search, page: cancelled_receipts.current_page !== 1 ? 1 : cancelled_receipts.current_page })
    },
        500,
        [search]
    );

    const prevValues = usePrevious(filterValues);

    useEffect(() => {
        // https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
        if (prevValues) {
            const query = Object.keys(pickBy(filterValues)).length ? pickBy(filterValues) : {};

            router.get(route(route().current()), query, {
                replace: true,
                preserveState: true
            });
        }
    }, [filterValues]);

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

    return (
        <AuthenticatedLayout
            auth={auth.user}
            currentRoute={currentRoute}
        >
            <Head title="Permohonan Batal Resit" />

            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    Senarai Permohonan Pembatalan Resit
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Pusat Kutipan</InputLabel>
                            <Select
                                value={filterValues['filter[collection_center_id]']}
                                label="Pusat Kutipan"
                                onChange={(e) => setFilterValues({ ...filterValues, 'filter[collection_center_id]': e.target.value, page: cancelled_receipts.current_page !== 1 ? 1 : cancelled_receipts.current_page })}
                            >
                                <MenuItem value="">Semua</MenuItem>
                                {
                                    collection_centers.map((collection_center) => (
                                        <MenuItem key={collection_center.id} value={collection_center.id}>{collection_center.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>No. Kaunter</InputLabel>
                            <Select
                                value={filterValues['filter[counter_id]']}
                                label="No. Kaunter"
                                onChange={(e) => setFilterValues({ ...filterValues, 'filter[counter_id]': e.target.value, page: cancelled_receipts.current_page !== 1 ? 1 : cancelled_receipts.current_page })}
                            >
                                {
                                    counters.map((counter) => (
                                        <MenuItem key={counter.id} value={counter.id}>{counter.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filterValues['filter[status]']}
                                label="Status"
                                onChange={(e) => setFilterValues({ ...filterValues, 'filter[status]': e.target.value, page: cancelled_receipts.current_page !== 1 ? 1 : cancelled_receipts.current_page })}
                            >
                                <MenuItem key='semua' value=''>Semua</MenuItem>
                                <MenuItem key='generated' value='approved'>Diluluskan</MenuItem>
                                <MenuItem key='rejected' value='rejected'>Ditolak</MenuItem>
                                <MenuItem key='pending' value='requested'>Dalam Proses</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
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
                            <Box sx={{ display: "flex", alignItems: "center" }}>-</Box>
                            <DatePicker
                                slotProps={{
                                    textField: { size: "small" },
                                    borderRadius: "10px",
                                }}
                                sx={{ width: 500 }}
                                value={filterValues['filter[end_date]'] ? dayjs(filterValues['filter[end_date]'], "DD-MM-YYYY") : null}
                                onChange={(value) =>
                                    setFilterValues({
                                        ...filterValues,
                                        'filter[end_date]': value.format("DD-MM-YYYY"),
                                        page:
                                            cancelled_receipts.current_page !== 1
                                                ? 1
                                                : cancelled_receipts.current_page,
                                    })
                                }
                            />
                        </Box>
                    </Grid>
                </Grid>
                <Stack direction="row" spacing={2} sx={{mt: 2}}>
                    <TextField
                        fullWidth
                        id="search"
                        label="Carian"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ width: '20%' }}
                        onClick={() => {
                            setFilterValues({ 'filter[search]': '', page: 1 });
                            setSearch('');
                        }}
                    >Reset</Button>
                </Stack>
                <Box sx={{ my: 4 }}>
                    <TableComponent
                        columns={[
                            {
                                label: 'ID Juruwang',
                                name: 'id_juruwang',
                                renderCell: (row) => userMap[row.user_id] || '—'
                            },
                            {
                                label: 'Pusat Kutipan',
                                name: 'pusat_kutipan',
                                renderCell: (row) => collectionCenterMap[row.collection_center_id] || '—'
                            },
                            {
                                label: 'No. Kaunter',
                                name: 'no_kaunter',
                                renderCell: (row) => counterMap[row.counter_id] || '—'
                            },
                            {
                                label: 'No. Resit Lama',
                                name: 'current_receipt_number',
                            },
                            {
                                label: 'No. Resit Ganti',
                                name: 'new_receipt_number',
                            },
                            {
                                label: 'Alasan',
                                name: 'reason_by_cashier',
                                renderCell: (row) => {
                                    return (
                                        <>
                                            {row.reason_by_cashier && (
                                                <div>
                                                    <strong>Juruwang</strong><br />
                                                    {row.reason_by_cashier}
                                                </div>
                                            )}
                                            {row.reason_by_admin && (
                                                <div style={{ marginTop: '0.5rem' }}>
                                                    <strong>Penyelia</strong><br />
                                                    {row.reason_by_admin}
                                                </div>
                                            )}
                                        </>
                                    );
                                }
                            },
                            {
                                label: 'Tarikh',
                                name: 'receipt_date',
                                renderCell: (row) => new Date(row.receipt_date).toLocaleDateString('en-GB')
                            },
                            {
                                label: 'Status',
                                name: 'status',
                                renderCell: (row) => {
                                    let badge;

                                    switch (row.status) {
                                        case 'approved':
                                            badge = <Chip label="Diluluskan" color="success" size="small" />;
                                            break;
                                        case 'rejected':
                                            badge = <Chip label="Ditolak" color="error" size="small" />;
                                            break;
                                        case 'requested':
                                            badge = <Chip label="Dalam Proses" color="warning" size="small" />;
                                            break;

                                        default:
                                            badge = <Chip label="N/A" color="default" size="small" />;
                                    }

                                    return <>{badge}</>;
                                }

                            },
                            {
                                label: 'Tindakan',
                                name: 'tindakan',
                                renderCell: row => (
                                    <>
                                        {row.status === 'requested' && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{ textTransform: 'none', mr: 1 }}
                                                href={route('receipt.preview', row.id)}
                                            >
                                                Lihat
                                            </Button>
                                        )}

                                    </>
                                )
                            }
                        ]}
                        rows={cancelled_receipts}
                        filterValues={filterValues}
                        setFilterValues={setFilterValues}
                    // rows={[
                    //     {
                    //         id: '1',
                    //         id_juruwang: '1',
                    //         pusat_kutipan: '1',
                    //         no_kaunter: '1',
                    //         no_resit: '1',
                    //         alasan: '1',
                    //         tarikh: '1',
                    //         no_resit_ganti: '1',
                    //         status: '1',
                    //         tindakan: '1',
                    //     },
                    //     {
                    //         id: '2',
                    //         id_juruwang: '1',
                    //         pusat_kutipan: '1',
                    //         no_kaunter: '1',
                    //         no_resit: '1',
                    //         alasan: '1',
                    //         tarikh: '1',
                    //         no_resit_ganti: '1',
                    //         status: '1',
                    //         tindakan: '1',
                    //     },
                    // ]}
                    />
                </Box>
            </Box>
        </AuthenticatedLayout>
    )
}

