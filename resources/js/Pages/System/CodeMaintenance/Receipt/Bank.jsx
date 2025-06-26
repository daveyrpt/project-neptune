import TableComponent from '@/Components/ui/tables/TableComponent'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import { Box, FormControl, Modal, Typography, Stack, TextField, Button, InputLabel, Select, MenuItem } from '@mui/material'
import { usePage, useForm, router } from '@inertiajs/react'
import LastEdited from './Component/LastEdited'
import { BoxPaddingX } from './Component/BoxPadding'
import React, { useState } from 'react'
import MaintenanceSearchBar from "@/Components/MaintenanceSearchBar.jsx";
import DeletePopup from '@/Components/ui/modals/DeletePopup.jsx'
import { defaultModalStyles } from '@/Utils/constants'
import { useDebounce } from 'react-use'

const Bank = ({ activeTab, setActiveTab }) => {
    const { setting_data, banks, most_recently_changed } = usePage().props

    const [search, setSearch] = useState("");

    useDebounce(() => {
        if (!search) return;
        setActiveTab({ ...activeTab, search: search, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })
    },
        500,
        [search]
    );

    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        reset();
        setEditMode(false);
        setOpen(true)
    }
    const handleClose = () => setOpen(false)

    const [editMode, setEditMode] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);
    const handleCloseDelete = () => setOpenDelete(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: '',
        code: '',
        name: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('system.code-maintenance.receipt.store', {
            type: "bank",
        }), {
            onSuccess: () => {
                handleClose();
            }
        });
    }

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        put(route('system.code-maintenance.receipt.update', {
            type: "bank",
            id: data.id
        }), {
            onSuccess: () => {
                handleCloseEdit();
            }
        });
    }
    const handleCloseEdit = () => setOpen(false)
    const handleSubmitDelete = (e) => {
        e.preventDefault();
        router.delete(route('system.code-maintenance.receipt.destroy', {
            type: "bank",
            id: data.id
        }), {
            onSuccess: () => {
                handleCloseDelete();
            }
        });
    }

    const handleOpenEdit = (row) => {
        setData({
            id: row.id,
            code: row.code,
            name: row.name,
            description: row.description
        });
        setEditMode(true);
        setOpen(true);
    }

    const handleOpenDelete = (row) => {
        setData({
            id: row.id,
            code: row.code,
            name: row.name,
        });
        setOpenDelete(true);
    }


    return (
        <Box>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={defaultModalStyles}>
                    <Typography variant="h6" component="h2">
                        {editMode ? 'Kemaskini' : 'Tambah'} Bank
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 300 }}>Kod Bank</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <TextField
                                        hiddenLabel
                                        onChange={(e) => setData('code', e.target.value)}
                                        value={data.code}
                                        variant="standard"
                                        size="small"
                                    />
                                    {errors.code && <div className="text-red-500 mt-2 text-sm">{errors.code}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 300 }}>Nama Bank</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <TextField
                                        hiddenLabel
                                        onChange={(e) => setData('name', e.target.value)}
                                        value={data.name}
                                        variant="standard"
                                        size="small"
                                    />
                                    {errors.name && <div className="text-red-500 mt-2 text-sm">{errors.name}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 300 }}>Jenis</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <Select
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        variant="standard"
                                        size="small"
                                    >
                                        <MenuItem value="1">Dalam</MenuItem>
                                        <MenuItem value="0">Luar</MenuItem>
                                    </Select>
                                    {errors.description && <div className="text-red-500 mt-2 text-sm">{errors.description}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                            <Button
                                variant="outlined"
                                size="small"
                                fullWidth
                                onClick={handleClose}
                                sx={{ textTransform: 'none' }}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                fullWidth
                                onClick={editMode ? handleSubmitEdit : handleSubmit}
                                disabled={processing}
                            >
                                Simpan
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>
            <DeletePopup
                openDelete={openDelete}
                handleCloseDelete={handleCloseDelete}
                title="Hapus Bank"
                subtitle="Adakah anda pasti untuk menghapus bank ini?"
                processing={processing}
                handleSubmitDelete={handleSubmitDelete}
            />
            <BoxPaddingX>
                <TitleCaptions title="Bank" extraStyles={{ my: 2 }} />
                <Stack direction="row" spacing={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Kod Bank</InputLabel>
                        <Select
                            value={activeTab.code || ''}
                            label="Kod Bank"
                            onChange={(e) => setActiveTab({ ...activeTab, code: e.target.value })}
                        >
                            <MenuItem value="">Semua</MenuItem>
                            {
                                banks.map((item) =>
                                    <MenuItem key={item.code} value={item.code}>{item.code}</MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                        <InputLabel>Nama Bank</InputLabel>
                        <Select
                            value={activeTab.name || ''}
                            label="Nama Bank"
                            onChange={(e) => setActiveTab({ ...activeTab, name: e.target.value })}
                        >
                            <MenuItem value="">Semua</MenuItem>
                            {
                                banks.map((item) =>
                                    <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>
                    <TextField fullWidth label="Carian" variant="outlined" size="small" sx={{ width: '200%' }} value={search} onChange={(e) => setSearch(e.target.value)} />
                    <Button variant="contained" size="small" sx={{ borderRadius: 'var(--button-radius)' }} fullWidth
                        onClick={() => {
                            setActiveTab({ ...activeTab, search: '', code: '', name: '', page: 1 })
                            setSearch('')
                        }}
                    >Reset</Button>
                    <Button
                        sx={{ borderRadius: 'var(--button-radius)' }}
                        onClick={handleOpen}
                        variant="contained"
                        size="small"
                        fullWidth
                    >
                        Tambah
                    </Button>
                </Stack>
            </BoxPaddingX>
            <Box sx={{ mt: 2 }}>
                <TableComponent
                    columns={[
                        {
                            label: 'Bil',
                            name: 'id'
                        },
                        {
                            label: 'Kod Bank',
                            name: 'code'
                        },
                        {
                            label: 'Nama Bank',
                            name: 'name'
                        },
                        {
                            label: 'Jenis',
                            name: 'description'
                        },
                        {
                            label: 'Tindakan',
                            name: 'action',
                            renderCell: (row) => {
                                return (
                                    <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: '1fr 1fr' }}>
                                        <Button variant="contained" size="small" sx={{ textTransform: 'none', mr: 1 }}
                                            onClick={() => handleOpenEdit(row)}>
                                            Kemaskini
                                        </Button>
                                        <Button variant="contained" size="small" color='error' sx={{ textTransform: 'none', mr: 1 }}
                                            onClick={() => handleOpenDelete(row)}>
                                            Hapus
                                        </Button>
                                    </Box>
                                )
                            }
                        }
                    ]}
                    rows={setting_data}
                    filterValues={activeTab}
                    setFilterValues={setActiveTab}
                />
            </Box>
            <LastEdited
                name={setting_data.data[most_recently_changed]?.latest_change?.causer?.name}
                date_created={setting_data.data[0]?.first_change?.created_at}
                date_modified={setting_data.data[0]?.latest_change?.updated_at}
            />
        </Box >
    )
}

export default Bank
