import TableComponent from "@/Components/ui/tables/TableComponent";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
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
    Chip,
    Modal,
    Grid
} from "@mui/material";
import {
    DatePicker,
} from "@mui/x-date-pickers-pro";
import { contentBackgroundStyles, defaultModalStyles } from "@/Utils/constants";
import { useState, useMemo, useEffect } from "react";
import { usePrevious } from "react-use";
import { pickBy, set } from "lodash";
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs'

export default function FloatingCashList() {
    const {
        auth,
        currentRoute,
        float_cash_requests,
        users,
        collection_centers,
        counters,
    } = usePage().props;

    const permissions = auth.permissions || [];

    const [openRejectModal, setOpenRejectModal] = useState(false);

    const handleOpenRejectModal = (rejectId) => {
        setOpenRejectModal(true);
        setData("reject_id", rejectId);
    };

    const handleCloseRejectModal = () => {
        setData("reject_id", null);
        setOpenRejectModal(false);
    };

    const userMap = useMemo(() => {
        const map = {};
        users?.forEach((user) => {
            map[user.id] = user.name;
        });
        return map;
    }, [users]);

    const collectionCenterMap = useMemo(() => {
        const map = {};
        collection_centers?.forEach((collection_center) => {
            map[collection_center.id] = collection_center.name;
        });
        return map;
    }, [collection_centers]);

    const counterMap = useMemo(() => {
        const map = {};
        counters?.forEach((counter) => {
            map[counter.id] = counter.name;
        });
        return map;
    }, [counters]);

    const { data, setData, errors, post, processing, reset } = useForm({
        float_cash_request: float_cash_requests.id,
    });

    const handleApprove = (value) => {
        post(
            route("float-cash.approve", {
                float_cash_request: value,
            }),
            {
                onSuccess: () => {
                    handleClose();
                },
            },

        );
    };

    const handleReject = (value) => {
        post(
            route("float-cash.reject", {
                float_cash_request: data.reject_id,
            }),
            {
                onSuccess: () => {
                    reset();
                    handleCloseRejectModal();
                },
            }
        );
    };

    const [filterValues, setFilterValues] = useState({
        page: 1,
        "filter[search]": "",
        "filter[collection_center_id]": "",
        "filter[counter_id]": "",
        "filter[start_date]": "",
        "filter[end_date]": "",
    });

    const prevValues = usePrevious(filterValues);

    useEffect(() => {
        if (
            !prevValues ||
            JSON.stringify(prevValues) === JSON.stringify(filterValues)
        )
            return;

        const query = Object.keys(pickBy(filterValues)).length
            ? pickBy(filterValues)
            : {};

        router.get(route(route().current()), query, {
            replace: true,
            preserveState: true,
        });
    }, [filterValues]);

    useEffect(()=>{
        setFilterValues({
            page: 1,
            "filter[search]": "",
            "filter[collection_center_id]": "",
            "filter[counter_id]": "",
            "filter[start_date]": "",
            "filter[end_date]": "",
        })
    },[])

    return (
        <AuthenticatedLayout user={auth.user} currentRoute={currentRoute}>
            <Head title="Senarai Permohonan" />
            <Modal
                open={openRejectModal}
                onClose={() => setOpenRejectModal(false)}
            >
                <Box sx={defaultModalStyles}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Penolakan Permohonan
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                            <Typography sx={{ width: 300 }}>Alasan Penolakan</Typography>
                            <Typography>:</Typography>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                onChange={(e) => setData('reason', e.target.value)}
                            />
                            {errors.reason && (
                                <Typography variant="caption" color="error">
                                    {errors.reason}
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                    <Stack sx={{ display: "flex", flexDirection: "row", gap: 2, marginY: '3rem' }}>
                        <Button variant="outlined" fullWidth onClick={handleCloseRejectModal}>Batal</Button>
                        <Button color="error" variant="contained" fullWidth onClick={handleReject} disabled={processing}>
                            Tolak
                        </Button>
                    </Stack>
                </Box>
            </Modal >
            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    Senarai Permohonan
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Pusat Kutipan</InputLabel>
                            <Select
                                value={filterValues["filter[collection_center_id]"]}
                                label="Pusat Kutipan"
                                onChange={(e) =>
                                    setFilterValues({
                                        ...filterValues,
                                        "filter[collection_center_id]":
                                            e.target.value,
                                        page:
                                            float_cash_requests.current_page !== 1
                                                ? 1
                                                : float_cash_requests.current_page,
                                    })
                                }
                            >
                                <MenuItem value="">Semua</MenuItem>
                                {collection_centers.map((collection_center) => (
                                    <MenuItem
                                        key={collection_center.id}
                                        value={collection_center.id}
                                    >
                                        {collection_center.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>No. Kaunter</InputLabel>
                            <Select
                                value={filterValues["filter[counter_id]"]}
                                label="No. Kaunter"
                                onChange={(e) =>
                                    setFilterValues({
                                        ...filterValues,
                                        "filter[counter_id]": e.target.value,
                                        page:
                                            float_cash_requests.current_page !== 1
                                                ? 1
                                                : float_cash_requests.current_page,
                                    })
                                }
                            >
                                {counters.map((counter) => (
                                    <MenuItem key={counter.id} value={counter.id}>
                                        {counter.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <DatePicker
                                slotProps={{
                                    textField: { size: "small" },
                                    borderRadius: "10px",
                                }}
                                format="DD/MM/YYYY"
                                sx={{ width: 500 }}
                                value={dayjs(filterValues["filter[start_date]"], "DD/MM/YYYY") ?? null}
                                onChange={(value) =>
                                    setFilterValues({
                                        ...filterValues,
                                        'filter[start_date]': value.format('DD-MM-YYYY'),
                                    })
                                }
                            />
                            <Box sx={{ display: "flex", alignItems: "center" }}>-</Box>
                            <DatePicker
                                slotProps={{
                                    textField: { size: "small" },
                                    borderRadius: "10px",
                                }}
                                format="DD/MM/YYYY"
                                sx={{ width: 500 }}
                                value={dayjs(filterValues["filter[end_date]"], "DD/MM/YYYY") ?? null}
                                onChange={(value) =>
                                    setFilterValues({
                                        ...filterValues,
                                        'filter[end_date]': value.format("DD-MM-YYYY"),
                                        page:
                                            float_cash_requests.current_page !== 1
                                                ? 1
                                                : float_cash_requests.current_page,
                                    })
                                }
                            />
                        </Box>
                    </Grid>
                </Grid>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <TextField
                        hiddenLabel
                        fullWidth
                        label="Carian"
                        variant="outlined"
                        size="small"
                        onChange={(e) => setFilterValues({
                            ...filterValues,
                            "filter[search]": e.target.value,
                            page:
                                float_cash_requests.current_page !== 1
                                    ? 1
                                    : float_cash_requests.current_page,
                        })}
                    />
                    <Button
                        sx={{
                            borderRadius: "var(--button-radius)",
                            textTransform: "none",
                            width: 300,
                        }}
                        variant="contained"
                        size="small"
                        fullWidth
                        onClick={() => setFilterValues({
                            page: 1,
                            "filter[search]": "",
                            "filter[collection_center_id]": "",
                            "filter[counter_id]": "",
                            "filter[start_date]": "",
                            "filter[end_date]": "",
                        })}
                    >
                        Reset
                    </Button>
                </Stack>
                <Box sx={{ mt: 2 }}>
                    <TableComponent
                        columns={[
                            {
                                label: "ID Juruwang",
                                name: "user_id",
                                renderCell: (row) => userMap[row.user_id] || "—",
                            },
                            {
                                label: "Pusat Kutipan",
                                name: "collection_center_id",
                                renderCell: (row) =>
                                    collectionCenterMap[row.collection_center_id] ||
                                    "—",
                            },
                            {
                                label: "No. Kaunter",
                                name: "counter_id",
                                renderCell: (row) =>
                                    counterMap[row.counter_id] || "—",
                            },
                            {
                                label: "Jenis",
                                name: "type",
                                renderCell: (row) => (
                                    <span>
                                        {row.type === "increment"
                                            ? "Penambahan"
                                            : "Pengurangan"}
                                    </span>
                                ),
                            },
                            {
                                label: "Tarikh",
                                name: "date",
                                renderCell: (row) =>
                                    dayjs(row.date_applied).format("DD-MM-YYYY") ||
                                    "—",
                            },
                            {
                                label: "Jumlah",
                                name: "total",
                            },
                            {
                                label: "Status",
                                name: "status",
                                renderCell: (row) => {
                                    let badge;

                                    switch (row.status) {
                                        case "approved":
                                            badge = (
                                                <Chip
                                                    label="Lulus"
                                                    color="success"
                                                    size="small"
                                                />
                                            );
                                            break;
                                        case "rejected":
                                            badge = (
                                                <Chip
                                                    label="Tolak"
                                                    color="error"
                                                    size="small"
                                                />
                                            );
                                            break;
                                        case "requested":
                                            badge = (
                                                <Chip
                                                    label="Dalam Proses"
                                                    color="warning"
                                                    size="small"
                                                />
                                            );
                                            break;
                                        case "pending":
                                            badge = (
                                                <Chip
                                                    label=""
                                                    color="primary"
                                                    size="small"
                                                />
                                            );
                                            break;
                                        default:
                                            badge = (
                                                <Chip
                                                    label="N/A"
                                                    color="default"
                                                    size="small"
                                                />
                                            );
                                    }

                                    return <>{badge}</>;
                                },
                            },
                            {
                                label: "Catatan",
                                name: "reason"
                            },
                            {
                                label: "Tindakan",
                                name: "tindakan",
                                renderCell: (row) =>
                                    row.status === "requested" &&
                                    permissions.includes(
                                        "update request float cash"
                                    ) && (
                                        <>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{ textTransform: 'none', mr: 1 }}
                                                color="success"
                                                onClick={() =>
                                                    handleApprove(row.id)
                                                }
                                            >
                                                Lulus
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{ textTransform: 'none', mr: 1 }}
                                                color="error"
                                                onClick={() => handleOpenRejectModal(row.id)}
                                            >
                                                Tolak
                                            </Button>
                                        </>
                                    ),
                            },
                        ]}
                        rows={float_cash_requests}
                        filterValues={filterValues}
                        setFilterValues={setFilterValues}
                    />
                </Box>
            </Box>
        </AuthenticatedLayout >
    );
}
