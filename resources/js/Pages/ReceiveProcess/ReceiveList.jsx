import TableComponent from '@/Components/ui/tables/TableComponent';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
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
    Modal,
    Chip,
    Tooltip,
} from '@mui/material';
import {
    DatePicker
} from '@mui/x-date-pickers-pro';
import { contentBackgroundStyles } from "@/Utils/constants.jsx";
import { useState, useMemo, useEffect } from 'react';
import { useDebounce, usePrevious } from 'react-use';
import { pickBy } from 'lodash';
import dayjs from 'dayjs';

export default function ReceiveList() {

    const { auth, currentRoute, receipts, counters, collection_centers } = usePage().props;

    console.log('receipts', receipts)

    const permissions = auth.permissions || [];

    const [search, setSearch] = useState('');

    const [openRequestCancel, setOpenRequestCancel] = useState(false)
    const handleOpenRequestCancel = (row) => {
        setData({
            receipt_id: row.id,
            current_receipt_number: row.receipt_number,
            new_receipt_number: '',
            reason_by_cashier: ''
        })
        setOpenRequestCancel(true)
    }
    const handleCloseRequestCancel = () => setOpenRequestCancel(false)

    const { data, setData, post, put, processing, errors } = useForm({
        receipt_id: '',
        current_receipt_number: '',
        new_receipt_number: '',
        reason_by_cashier: ''
    });


    const handleSubmitRequestCancel = (e) => {
        e.preventDefault();
        post(route('receipt.cancel.request-form.store', data.id), {
            onSuccess: () => {
                handleCloseRequestCancel();
            }
        });
    }

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

    const [filterValues, setFilterValues] = useState({
        'filter[search]': '',
        'filter[collection_center_id]': '',
        'filter[counter_id]': '',
        'filter[status]': '',
        page: 1,
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

    useDebounce(() => {
        if (!search) return;
        setFilterValues({ ...filterValues, 'filter[search]': search, page: receipts.current_page !== 1 ? 1 : receipts.current_page })
    },
        500,
        [search]
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            currentRoute={currentRoute}
        >
            <Modal
                open={openRequestCancel}
                onClose={handleCloseRequestCancel}
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
                        Permohonan Batal Resit
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 300 }}>No. Resit</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <TextField
                                        hiddenLabel
                                        onChange={(e) => setData('current_receipt_number', e.target.value)}
                                        value={data.current_receipt_number}
                                        variant="filled"
                                        size="small"
                                    />
                                    {errors.current_receipt_number && <div className="text-red-500 mt-2 text-sm">{errors.current_receipt_number}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 300 }}>No. Resit Ganti</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <TextField
                                        hiddenLabel
                                        onChange={(e) => setData('new_receipt_number', e.target.value)}
                                        variant="filled"
                                        size="small"
                                        placeholder='Jika ada sahaja'
                                    />
                                    {errors.new_receipt_number && <div className="text-red-500 mt-2 text-sm">{errors.new_receipt_number}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 300 }}>Alasan Pembatalan</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <TextField
                                        hiddenLabel
                                        onChange={(e) => setData('reason_by_cashier', e.target.value)}
                                        value={data.reason_by_cashier}
                                        variant="filled"
                                        size="small"
                                        placeholder='Nyatakan alasan Pembatalan'
                                    />
                                    {errors.reason_by_cashier && <div className="text-red-500 mt-2 text-sm">{errors.reason_by_cashier}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                fullWidth
                                onClick={handleCloseRequestCancel}
                                sx={{ textTransform: 'none' }}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                fullWidth
                                onClick={handleSubmitRequestCancel}
                                disabled={processing}
                                color='error'
                            >
                                Sahkan
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>
            <Head title="Senarai Terimaan" />
            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    Senarai Terimaan
                </Typography>
                <Stack direction="row" spacing={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Pusat Kutipan</InputLabel>
                        <Select
                            value={filterValues['filter[collection_center_id]']}
                            label="Pusat Kutipan"
                            onChange={(e) => setFilterValues({ ...filterValues, 'filter[collection_center_id]': e.target.value, page: receipts.current_page !== 1 ? 1 : receipts.current_page })}
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
                            onChange={(e) => setFilterValues({ ...filterValues, 'filter[counter_id]': e.target.value, page: receipts.current_page !== 1 ? 1 : receipts.current_page })}
                        >
                            {
                                counters.map((counter) => (
                                    <MenuItem key={counter.id} value={counter.id}>{counter.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filterValues['filter[status]']}
                            label="Status"
                            onChange={(e) => setFilterValues({ ...filterValues, 'filter[status]': e.target.value, page: receipts.current_page !== 1 ? 1 : receipts.current_page })}
                        >
                            <MenuItem key='semua' value=''>Semua</MenuItem>
                            <MenuItem key='generated' value='generated'>Dijana</MenuItem>
                            <MenuItem key='replaced' value='replaced'>Ditukar</MenuItem>
                            <MenuItem key='cancelled' value='cancelled'>Dibatalkan</MenuItem>
                            <MenuItem key='cancel request' value='cancel request'>Permohonan Batal</MenuItem>
                            <MenuItem key='edited' value='edited'>Dikemaskini</MenuItem>
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
                                    receipts.current_page !== 1
                                        ? 1
                                        : receipts.current_page,
                            })
                        }
                    />
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <TextField hiddenLabel fullWidth id="search" label="Carian" variant="outlined" size="small" value={search}
                        onChange={(e) => setSearch(e.target.value)} />
                    <Button
                        sx={{ borderRadius: 'var(--button-radius)', textTransform: 'none', width: 300 }}
                        variant="contained" size="small" fullWidth onClick={() => {
                            setFilterValues({
                                'filter[search]': '',
                                'filter[collection_center_id]': '',
                                'filter[counter_id]': '',
                                'filter[start_date]': '',
                                'filter[end_date]': '',
                                page: 1,
                            })
                            setSearch('')
                        }}>
                        Reset
                    </Button>
                </Stack>
                <Box sx={{ mt: 2 }}>
                    <TableComponent
                        columns={[
                            {
                                label: 'Tarikh',
                                name: 'date',
                                 renderCell: (row) => dayjs(row.date).format('DD/MM/YYYY HH:mm:ss') || '—'
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
                                label: 'Kod Hasil',
                                name: 'service',
                            },
                            {
                                label: 'Nombor Akaun',
                                name: 'account_number',
                            },
                            {
                                label: 'No. Resit',
                                name: 'receipt_number',
                            },
                            {
                                label: 'Amaun (RM)',
                                name: 'amount',
                            },
                            {
                                label: 'Dikemaskini Oleh',
                                name: 'amount',
                                renderCell: (row) => row?.latest_change?.causer?.name || '—'
                            },
                            {
                                label: 'Status',
                                name: 'status',
                                renderCell: (row) => {
                                    let badge;

                                    switch (row.status) {
                                        case 'generated':
                                            badge = <Chip label="Dijana" color="success" size="small" />;
                                            break;
                                        case 'replaced':
                                            badge = <Chip label="Ditukar" color="success" size="small" />;
                                            break;
                                        case 'cancelled':
                                            badge = <Chip label="Dibatalkan" color="error" size="small" />;
                                            break;
                                        case 'cancel request':
                                            badge = <Chip label="Permohonan Batal" color="warning" size="small" />;
                                            break;
                                        case 'edited':
                                            badge = <Tooltip componentsProps={{
                                                tooltip: {
                                                    sx: {
                                                        fontSize: '14px',
                                                        padding: '8px 12px',
                                                    },
                                                },
                                            }} title={row.edit_description} placement="top" arrow><Chip label="Dikemaskini" color="primary" size="small" /></Tooltip>;
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
                                renderCell: (row) => (
                                    <>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            sx={{ textTransform: 'none', m: 1 }}
                                            href={route('receipt.print', row.id)}>
                                            Lihat
                                        </Button>
                                  
                                        <Button
                                            variant="contained"
                                            size="small"
                                            sx={{ textTransform: 'none', m: 1 }}
                                            href={route('receipt.edit', row.id)}
                                        >
                                            Kemaskini
                                        </Button>
                               
                                        {
                                            permissions.includes('request cancel receipt') && row.status == 'generated' && (
                                                // true && (

                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    sx={{ textTransform: 'none', m: 1 }}
                                                    color='error'
                                                    onClick={() => handleOpenRequestCancel(row)}
                                                >
                                                    Mohon Batal
                                                </Button>
                                            )
                                        }

                                    </>
                                )
                            }
                        ]}
                        rows={receipts}
                        filterValues={filterValues}
                        setFilterValues={setFilterValues}
                    />
                </Box>
            </Box>
        </AuthenticatedLayout >
    );
}
