import { Head, usePage, router, useForm } from "@inertiajs/react";
import { useState, useEffect, useMemo } from "react";
import TableComponent from "@/Components/ui/tables/TableComponent";
import TitleCaptions from "@/Components/ui/TitleCaptions";
import { BoxPaddingX } from "../System/CodeMaintenance/Receipt/Component/BoxPadding";
import LastEdited from "../System/CodeMaintenance/Receipt/Component/LastEdited";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
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
    Modal,
    FormControlLabel,
    RadioGroup,
    Radio,
} from "@mui/material";

export default function Index() {

    const { auth, currentRoute, setting_data, collection_centers, most_recently_changed } = usePage().props;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: "",
        collection_center_id: "",
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "",
        sunday: "",
    });

    const workingDays = [
        { id: 1, label: "Isnin", name: "monday" },
        { id: 2, label: "Selasa", name: "tuesday" },
        { id: 3, label: "Rabu", name: "wednesday" },
        { id: 4, label: "Khamis", name: "thursday" },
        { id: 5, label: "Jumaat", name: "friday" },
        { id: 6, label: "Sabtu", name: "saturday" },
        { id: 7, label: "Ahad", name: "sunday" },
    ];

    const [collectionCenterOptions, setCollectionCenterOptions] = useState([]);

    const handleClose = () => setOpen(false);
    const handleCloseDelete = () => setOpenDelete(false);

    const [editMode, setEditMode] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpenEdit = (row) => {
        reset();
        setData({
            id: row.id,
            collection_center_id: row.collection_center_id,
            monday: row.monday,
            tuesday: row.tuesday,
            wednesday: row.wednesday,
            thursday: row.thursday,
            friday: row.friday,
            saturday: row.saturday,
            sunday: row.sunday,
        });

        setEditMode(true);
        setOpen(true);
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        put(
            route("system.code-maintenance.receipt.update", {
                type: "StartingDate",
                id: data.id,
            }),
            {
                onSuccess: () => {
                    handleClose();
                },
            }
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(
            route("system.code-maintenance.receipt.store", {
                type: "StartingDate",
            }),
            {
                onSuccess: () => {
                    handleClose();
                },
            }
        );
    };

    const handleSubmitDelete = (e) => {
        e.preventDefault();
        router.delete(
            route("system.code-maintenance.receipt.destroy", {
                type: "StartingDate",
                id: data.id,
            }),
            {
                onSuccess: () => {
                    handleCloseDelete();
                },
            }
        );
    };

    useEffect(() => {
        if (collection_centers) {
            setCollectionCenterOptions(
                collection_centers.map((collection_center) => ({
                    id: collection_center.id,
                    name: collection_center.name,
                    counters: collection_center.counters,
                }))
            );
        }
    }, [collection_centers]);

    const collectionCenterMap = useMemo(() => {
        const map = {};
        collection_centers?.forEach((cc) => {
            map[cc.id] = {
                name: cc.name,
                counters: cc.counters || [],
            };
        });
        return map;
    }, [collection_centers]);

    return (
        <AuthenticatedLayout user={auth.user} currentRoute={currentRoute}>
        <Box>
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        bgcolor: "background.paper",
                        // border: '2px solid #000',
                        boxShadow: 24,
                        borderRadius: 2,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h2">
                        {editMode ? "Kemaskini" : "Tambah"} Tarikh Permulaan
                        Hari
                    </Typography>
                    <Box sx={{ display: "grid", gap: 2, mt: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 100 }}>
                                Pusat Kutipan
                            </Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 2,
                                    }}
                                >
                                    <Select
                                        onChange={(e) =>
                                            setData(
                                                "collection_center_id",
                                                e.target.value
                                            )
                                        }
                                        size="small"
                                        value={data.collection_center_id}
                                        fullWidth
                                        disabled
                                    >
                                        <MenuItem value="">Semua</MenuItem>
                                        {collectionCenterOptions.map(
                                            (collection_center) => (
                                                <MenuItem
                                                    key={collection_center.id}
                                                    value={collection_center.id}
                                                >
                                                    {collection_center.id}-
                                                    {collection_center.name}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                    {errors.collection_center_id && (
                                        <div className="text-red-500 mt-2 text-sm">
                                            {errors.collection_center_id}
                                        </div>
                                    )}
                                </FormControl>
                            </Box>
                        </Stack>
                    </Box>
                    <TitleCaptions
                        title=" Permulaan Hari Bekerja"
                        extraStyles={{ mt: 2 }}
                    />
                    <Box>
                        {workingDays.map((workingDay) => (
                            <Stack
                                key={workingDay.id}
                                direction="row"
                                alignItems="center"
                                spacing={2}
                            >
                                <Typography sx={{ width: 120 }}>
                                    {workingDay.label}
                                </Typography>
                                <Typography>:</Typography>
                                <Box>
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            row
                                            onChange={(e) =>
                                                setData(
                                                    workingDay.name,
                                                    e.target.value
                                                )
                                            }
                                            value={data[workingDay.name]}
                                        >
                                            <FormControlLabel
                                                value="1"
                                                control={
                                                    <Radio
                                                        sx={{
                                                            "& .MuiSvgIcon-root":
                                                            {
                                                                fontSize: 15,
                                                            },
                                                        }}
                                                    />
                                                }
                                                label="Ya"
                                            />
                                            <FormControlLabel
                                                value="0"
                                                control={
                                                    <Radio
                                                        sx={{
                                                            "& .MuiSvgIcon-root":
                                                            {
                                                                fontSize: 15,
                                                            },
                                                        }}
                                                    />
                                                }
                                                label="Tidak"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            </Stack>
                        ))}
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                            mt: 4,
                        }}
                    >
                        <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={handleClose}
                            sx={{ textTransform: "none" }}
                        >
                            Tutup
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            onClick={editMode ? handleSubmitEdit : handleSubmit}
                            sx={{ textTransform: "none" }}
                        >
                            Simpan
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Modal open={openDelete} onClose={handleCloseDelete}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        bgcolor: "background.paper",
                        // border: '2px solid #000',
                        boxShadow: 24,
                        borderRadius: 2,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h2">
                        Hapus Bank?
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Tindakan ini tidak boleh dikembalikan
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={handleCloseDelete}
                            sx={{ textTransform: "none" }}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            color="error"
                            fullWidth
                            onClick={handleSubmitDelete}
                            disabled={processing}
                        >
                            OK
                        </Button>
                    </Stack>
                </Box>
            </Modal>
            <BoxPaddingX>
                <TitleCaptions
                    title="Tarikh Permulaan Hari"
                    extraStyles={{ my: 2 }}
                />
            </BoxPaddingX>
            <Box sx={{ m: 2 }}>
                <TableComponent
                    columns={[
                        {
                            id: "bil",
                            label: "Bil",
                            renderCell: (row) => <>{row.id}</>,
                        },
                        {
                            id: "pusat_kutipan",
                            label: "Pusat Kutipan",
                            name: "collection_center_id",
                            renderCell: (row) =>
                                collectionCenterMap[row.collection_center_id]
                                    ?.name || "—",
                        },
                        {
                            id: "isnin",
                            label: "Isnin",
                            name: "monday",
                            renderCell: (row) => (
                                <>{row.monday ? "Ya" : "Tidak"}</>
                            ),
                        },
                        {
                            id: "tuesday",
                            label: "Selasa",
                            name: "tuesday",
                            renderCell: (row) => (
                                <>{row.tuesday ? "Ya" : "Tidak"}</>
                            ),
                        },
                        {
                            id: "wednesday",
                            label: "Rabu",
                            name: "wednesday",
                            renderCell: (row) => (
                                <>{row.wednesday ? "Ya" : "Tidak"}</>
                            ),
                        },
                        {
                            id: "thursday",
                            label: "Khamis",
                            name: "thursday",
                            renderCell: (row) => (
                                <>{row.thursday ? "Ya" : "Tidak"}</>
                            ),
                        },
                        {
                            id: "friday",
                            label: "Jumaat",
                            name: "friday",
                            renderCell: (row) => (
                                <>{row.friday ? "Ya" : "Tidak"}</>
                            ),
                        },
                        {
                            id: "saturday",
                            label: "Sabtu",
                            name: "saturday",
                            renderCell: (row) => (
                                <>{row.saturday ? "Ya" : "Tidak"}</>
                            ),
                        },
                        {
                            id: "sunday",
                            label: "Ahad",
                            name: "sunday",
                            renderCell: (row) => (
                                <>{row.sunday ? "Ya" : "Tidak"}</>
                            ),
                        },
                        {
                            id: "tindakan",
                            label: "Tindakan",
                            renderCell: (row) => (
                                <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: '1fr'}}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ textTransform: "none", mr: 1 }}
                                        onClick={() => handleOpenEdit(row)}
                                    >
                                        Kemaskini
                                    </Button>
                                    {/* <Button variant="text" size="small" color='error' sx={{ textTransform: 'none' }} onClick={() => handleOpenDelete(row)}>Hapus</Button> */}
                                </Box>
                            ),
                        },
                    ]}
                    rows={setting_data}
                />
            </Box>
            <LastEdited
                name={
                    setting_data.data[most_recently_changed]?.latest_change
                        ?.causer?.name
                }
                date_created={setting_data.data[0]?.first_change?.created_at}
                date_modified={setting_data.data[0]?.latest_change?.updated_at}
            />
        </Box>
        </AuthenticatedLayout>
    );
}