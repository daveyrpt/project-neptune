import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import {
    Box,
    Typography,
    FormControl,
    MenuItem,
    InputLabel,
    Select,
    Stack,
    TextField,
    Button,
    FormLabel,
} from "@mui/material";
import TableComponent from "@/Components/ui/tables/TableComponent";
import TitleCaptions from "@/Components/ui/TitleCaptions";
import { contentBackgroundStyles } from "@/Utils/constants.jsx";
import { DateField } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { useState, useMemo, useEffect } from "react";
import { usePrevious } from "react-use";
import { pickBy } from "lodash";

export default function CashierManagements({ auth }) {
    const {
        currentRoute,
        cashier_managements,
        users,
        collection_centers,
        counters,
    } = usePage().props;

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

    const [filterValues, setFilterValues] = useState({
            page: 1,
        "filter[search]": "",
        "filter[collection_center_id]": "",
        "filter[counter_id]": "",
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

    return (
        <AuthenticatedLayout user={auth.user} currentRoute={currentRoute}>
            <Head title="Kawalan Juruwang" />
            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    Kawalan Juruwang
                </Typography>
                <Stack direction="row" spacing={2}>
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
                                        cashier_managements.current_page !== 1
                                            ? 1
                                            : cashier_managements.current_page,
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
                                        cashier_managements.current_page !== 1
                                            ? 1
                                            : cashier_managements.current_page,
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
            
                </Stack>
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
                                cashier_managements.current_page !== 1
                                    ? 1
                                    : cashier_managements.current_page,
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
                                id: "index",
                                label: "Bil",
                                renderCell: (row, index) =>
                                    <>
                                        {(cashier_managements.from ?? 0) + index}.
                                    </>
                            },
                            {
                                label: "ID Juruwang",
                                name: "user_id",
                                renderCell: (row) =>
                                    userMap[row.user_id] || "—",
                            },
                            {
                                label: "Pusat Kutipan",
                                name: "collection_center_id",
                                renderCell: (row) =>
                                    collectionCenterMap[
                                    row.collection_center_id
                                    ] || "—",
                            },
                            {
                                label: "No. Kaunter",
                                name: "counter_id",
                                renderCell: (row) =>
                                    counterMap[row.counter_id] || "—",
                            },
                            {
                                label: "Wang Runcit",
                                name: "retail_money",
                                renderCell: (row) => (
                                    <>
                                        {row.retail_money
                                            ? "RM " + row.retail_money
                                            : "-"}
                                    </>
                                ),
                            },
                            {
                                label: "Tarikh Penerimaan",
                                name: "created_at",
                                renderCell: (row) => (
                                    <>{dayjs(row.created_at).format('DD-MM-YYYY HH:mm:ss')}</>
                                ),
                                    
                            },
                            // {
                            //     id: 'tindakan',
                            //     label: 'Tindakan',
                            //     renderCell: (row) => (
                            //         <>
                            //             <Button variant="text" size="small" sx={{ textTransform: 'none' }} onClick={() => handleOpenEdit(row)}>Kemaskini</Button>
                            //             <Button variant="text" size="small" color='error' sx={{ textTransform: 'none' }} onClick={() => handleOpenDelete(row)}>Hapus</Button>
                            //         </>
                            //     )
                            // },
                        ]}
                        
                        rows={cashier_managements}
                        filterValues={filterValues}
                        setFilterValues={setFilterValues}
                        
                    />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <TitleCaptions
                        title="Dikemaskini Oleh"
                        extraStyles={{ mb: 2 }}
                    />
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: 2,
                        }}
                    >
                        <FormControl sx={{ flexDirection: "row" }}>
                            <FormLabel
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginRight: 2,
                                    width: 150,
                                }}
                                id="demo-row-radio-buttons-group-label"
                            >
                                Dihasilkan:
                            </FormLabel>
                            <DateField
                                defaultValue={dayjs(
                                    cashier_managements.data[0]?.first_change
                                        ?.created_at
                                )}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        fullWidth: true,
                                    },
                                }}
                                disabled
                            />
                        </FormControl>
                        <FormControl sx={{ flexDirection: "row" }}>
                            <FormLabel
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginRight: 2,
                                    width: 150,
                                }}
                                id="demo-row-radio-buttons-group-label"
                            >
                                Oleh:
                            </FormLabel>
                            <TextField
                                hiddenLabel
                                id="filled-hidden-label-small"
                                value={
                                    cashier_managements.data[1]?.latest_change
                                        ?.causer?.name
                                }
                                placeholder="Kosongkan jika ada"
                                variant="filled"
                                size="small"
                                disabled
                            />
                        </FormControl>
                        <FormControl sx={{ flexDirection: "row" }}>
                            <FormLabel
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginRight: 2,
                                    width: 150,
                                }}
                                id="demo-row-radio-buttons-group-label"
                            >
                                Diubah:
                            </FormLabel>
                            <DateField
                                defaultValue={dayjs(
                                    cashier_managements.data[0]
                                        ?.latest_change?.created_at
                                )}
                                slotProps={{
                                    textField: {
                                        size: "small",
                                        fullWidth: true,
                                    },
                                }}
                                disabled
                            />
                        </FormControl>
                    </Box>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
