import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import { Box, Typography, FormControl, MenuItem, InputLabel, Select, Stack, TextField, Button, FormLabel, Modal } from '@mui/material'
import TableComponent from '@/Components/ui/tables/TableComponent';
import TitleCaptions from '@/Components/ui/TitleCaptions';
import { DateField } from '@mui/x-date-pickers-pro'
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs'
import { useEffect, useState, useMemo } from 'react';
import { useDebounce, usePrevious } from 'react-use';
import pickBy from 'lodash/pickBy';
import { contentBackgroundStyles } from "@/Utils/constants.jsx";
import DeletePopup from '@/Components/ui/modals/DeletePopup.jsx'

export default function UserManagement({ auth }) {

    const { currentRoute, roles, users, allUserId } = usePage().props;
    console.log('allUserId', allUserId)
    const [userOptions, setUserOptions] = useState([]);
    const [roleOptions, setRoleOptions] = useState([]);

    const [search, setSearch] = useState('');

    useDebounce(() => {
        if (!search) return;
        setValues({ ...values, 'filter[search]': search, page: users.current_page !== 1 ? 1 : users.current_page })
    },
        500,
        [search]
    );

    const [open, setOpen] = useState(false)

    const roleMap = useMemo(() => {
        const map = {};
        roles?.forEach(role => {
            map[role.id] = role.display_name;
        });
        return map;
    }, [roles]);

    const handleOpen = () => {
        clearErrors();
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
        setData({
            id: '',
            staff_id: '',
            user_name: '',
            role_id: '',
            password: '',
            is_active: 1,
        })
        setEditMode(false);
    }
    const [editMode, setEditMode] = useState(false);

    const [openDelete, setOpenDelete] = useState(false);
    const handleCloseDelete = () => setOpenDelete(false);

    const { data, setData, post, put, processing, errors,clearErrors } = useForm({
        id: '',
        staff_id: '',
        user_name: '',
        email: '',
        google_email: '',
        role_id: '',
        password: '',
        is_active: 1,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('user.store'), {
            onSuccess: () => {
                handleClose();
            }
        });
    }

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        put(route('user.update', {
            id: data.id
        }), {
            onSuccess: () => {
                handleClose();
            }
        });
    }

    const handleSubmitDelete = (e) => {
        e.preventDefault();
        router.delete(route('user.destroy', {
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
            staff_id: row.staff_id,
            user_name: row.name,
            email: row.email,
            google_email: row.google_email,
            role_id: row.role.id,
            is_active: row.is_active
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

    const handlePrint = () => {
        window.open(route('user.print'), '_blank');
    };

    const [values, setValues] = useState({
        page: 1,
        'filter[staff_id]': '',
        'filter[role]': '',
        'filter[search]': ''
    })

    const prevValues = usePrevious(values);

    useEffect(() => {
        // https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
        if (prevValues) {
            const query = Object.keys(pickBy(values)).length ? pickBy(values) : {};

            router.get(route(route().current()), query, {
                replace: true,
                preserveState: true
            });
        }
    }, [values]);

    useEffect(() => {
        const userOptions = allUserId.map((user) => ({
            value: user.staff_id,
            label: user.staff_id,
        }));
        setUserOptions(userOptions);

        const roleOptions = roles.map((role) => ({
            value: role.id,
            label: role.display_name,
        }));
        setRoleOptions(roleOptions);
    }, [])

    const handleSearch = () => {
        setValues({
            ...values,
            'filter[search]': search,
            page: users.current_page !== 1 ? 1 : users.current_page
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            currentRoute={currentRoute}
        >
            <Modal
                open={open}
                onClose={handleClose}
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
                        {editMode ? 'Kemaskini' : 'Tambah'} Pengguna
                    </Typography>
                    <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 100 }}>ID Pengguna<span className="text-red-500">*</span></Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <TextField
                                        size='small'
                                        value={data.staff_id}
                                        onChange={(e) => setData({ ...data, staff_id: e.target.value })}
                                        fullWidth
                                    />
                                    {errors.staff_id && <div className="text-red-500 mt-2 text-sm">{errors.staff_id}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 100 }}>Emel<span className="text-red-500">*</span></Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <TextField
                                        required
                                        size='small'
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData({ ...data, email: e.target.value })}
                                        fullWidth
                                    />
                                    {errors.email && <div className="text-red-500 mt-2 text-sm">{errors.email}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 100 }}>Google Email</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <TextField
                                        required
                                        size='small'
                                        type="email"
                                        value={data.google_email}
                                        onChange={(e) => setData({ ...data, google_email: e.target.value })}
                                        fullWidth
                                    />
                                    {errors.google_email && <div className="text-red-500 mt-2 text-sm">{errors.google_email}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 100 }}>Nama Pengguna<span className="text-red-500">*</span></Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <TextField
                                        size='small'
                                        value={data.user_name}
                                        onChange={(e) => setData({ ...data, user_name: e.target.value })}
                                        fullWidth
                                    />
                                    {errors.user_name && <div className="text-red-500 mt-2 text-sm">{errors.user_name}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 100 }}>Peranan<span className="text-red-500">*</span></Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <Select
                                        size='small'
                                        value={data.role_id}
                                        onChange={(e) => setData({ ...data, role_id: e.target.value })}
                                        fullWidth
                                    >
                                        <MenuItem value="">Semua</MenuItem>
                                        {
                                            roleOptions.map((role) => (
                                                <MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                    {errors.role_id && <div className="text-red-500 mt-2 text-sm">{errors.role_id}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 100 }}>Kata Laluan{!editMode && <span className="text-red-500">*</span>}</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <TextField
                                        type="password"
                                        size='small'
                                        value={data.password}
                                        onChange={(e) => setData({ ...data, password: e.target.value })}
                                        fullWidth
                                        required={!editMode}
                                    />
                                    {errors.password && <div className="text-red-500 mt-2 text-sm">{errors.password}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 100 }}>Status<span className="text-red-500">*</span></Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <Select
                                        size='small'
                                        value={data.is_active}
                                        onChange={(e) => setData({ ...data, is_active: e.target.value })}
                                        fullWidth
                                    >
                                        <MenuItem value="1">Aktif</MenuItem>
                                        <MenuItem value="0">Tidak Aktif</MenuItem>
                                    </Select>
                                    {errors.is_active && <div className="text-red-500 mt-2 text-sm">{errors.is_active}</div>}
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
                                OK
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Modal>
            <DeletePopup
                openDelete={openDelete}
                handleCloseDelete={handleCloseDelete}
                title="Hapus Pengguna"
                subtitle="Adakah anda pasti untuk menghapus maklumat ini?"
                processing={processing}
                handleSubmitDelete={handleSubmitDelete}
            />
            <Head title="Pengurusan Pengguna" />
            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    Pengurusan Pengguna
                </Typography>
                <Stack direction="row" spacing={2}>
                    <FormControl fullWidth size="small">
                        <InputLabel>ID Pengguna</InputLabel>
                        <Select
                            value={values['filter[staff_id]']}
                            label="ID Pengguna"
                            onChange={(e) => setValues({ ...values, 'filter[staff_id]': e.target.value, page: users?.current_page !== 1 ? 1 : users?.current_page })}
                        >
                            <MenuItem value="">Semua</MenuItem>
                            {userOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                        <InputLabel>Peranan</InputLabel>
                        <Select
                            value={values['filter[role]']}
                            label="Peranan"
                            onChange={(e) => setValues({ ...values, 'filter[role]': e.target.value })}
                        >
                            <MenuItem value="">Semua</MenuItem>
                            {roleOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField fullWidth id="search" label="Carian" variant="outlined" size="small" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <Button variant="contained" size="small" sx={{ borderRadius: 'var(--button-radius)' }}
                        fullWidth onClick={() => {
                            setValues({ ...values, 'filter[staff_id]': '', 'filter[role]': '', 'filter[search]': '', page: 1 })
                            setSearch('')
                        }}>Reset</Button>
                    <Button variant="contained" size="small" sx={{ borderRadius: 'var(--button-radius)' }}
                        fullWidth onClick={handleOpen}>Tambah</Button>
                    <Button variant="contained" size="small" sx={{ borderRadius: 'var(--button-radius)' }} fullWidth onClick={handlePrint}>Muat
                        Turun</Button>
                </Stack>
                <Box sx={{ mt: 2 }}>
                    <TableComponent
                        columns={[
                            {
                                id: 'bil',
                                label: 'Bil',
                                renderCell: (row) => (
                                    <>
                                        {row.id}
                                    </>
                                )
                            },
                            { id: 'id_pengguna', label: 'ID Pengguna', name: 'staff_id' },
                            { id: 'nama_pengguna', label: 'Nama Pengguna', name: 'name' },
                            { id: 'email', label: 'Emel', name: 'email' },
                            { id: 'gmail', label: 'GMail', name: 'google_email' },
                            {
                                id: 'peranan',
                                label: 'Peranan',
                                name: 'role_id',
                                renderCell: (row) => roleMap[row.role_id] || '—'
                            },
                            {
                                id: 'status',
                                label: 'Status',
                                renderCell: (row) => (
                                    <>
                                        {row.is_active ? 'Aktif' : 'Tidak Aktif'}
                                    </>
                                )
                            },
                            {
                                id: 'tindakan',
                                label: 'Tindakan',
                                renderCell: (row) => (
                                    <>
                                        <Button variant="contained" size="small" sx={{ textTransform: 'none', mr: 1 }} onClick={() => handleOpenEdit(row)}>Kemaskini</Button>
                                        <Button variant="contained" size="small" color='error' sx={{ textTransform: 'none', mr: 1 }} onClick={() => handleOpenDelete(row)}>Hapus</Button>
                                    </>
                                )
                            },
                        ]}
                        rows={users}
                        filterValues={values}
                        setFilterValues={setValues}
                    />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <TitleCaptions title="Dikemaskini Oleh" extraStyles={{ mb: 2 }} />
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                        <FormControl sx={{ flexDirection: 'row' }}>
                            <FormLabel
                                sx={{ display: 'flex', alignItems: 'center', marginRight: 2, width: 150 }}
                                id="demo-row-radio-buttons-group-label"
                            >
                                Dihasilkan:
                            </FormLabel>
                            <DateField
                                defaultValue={dayjs(users.data[0]?.first_change?.created_at)}
                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                disabled
                            />
                        </FormControl>
                        <FormControl sx={{ flexDirection: 'row' }}>
                            <FormLabel
                                sx={{ display: 'flex', alignItems: 'center', marginRight: 2, width: 150 }}
                                id="demo-row-radio-buttons-group-label"
                            >
                                Oleh:
                            </FormLabel>
                            <TextField
                                hiddenLabel
                                id="filled-hidden-label-small"
                                defaultValue=""
                                value={users.data[0]?.latest_change?.causer?.name}
                                placeholder="Kosongkan jika ada"
                                variant="filled"
                                size="small"
                            />
                        </FormControl>
                        <FormControl sx={{ flexDirection: 'row' }}>
                            <FormLabel
                                sx={{ display: 'flex', alignItems: 'center', marginRight: 2, width: 150 }}
                                id="demo-row-radio-buttons-group-label"
                            >
                                Diubah:
                            </FormLabel>
                            <DateField
                                defaultValue={dayjs(users.data[0]?.latest_change?.created_at)}
                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                disabled
                            />
                        </FormControl>
                    </Box>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
