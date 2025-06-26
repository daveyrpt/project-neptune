import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
import TitleCaptions from '@/Components/ui/TitleCaptions';
import { contentBackgroundStyles } from '@/Utils/constants';

export default function AdvancePaymentRequest() {

    const { auth, currentRoute } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        system: '',
        account_number: '',
        identity_number: '',
        customer_name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('advance-payment-request.store'), {
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
            <Head title="Bayaran Pendahuluan" />
            <Box sx={contentBackgroundStyles}>
                <Box>
                    <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                        Bayaran Pendahuluan
                    </Typography>
                    <TitleCaptions title="Buka Item" extraStyles={{ my: 2 }} />
                    <Box
                        sx={{
                            display: "grid",
                            gap: 3
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 200 }}>Sistem</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    <Select
                                        onChange={(e) => setData({ ...data, system: e.target.value })}
                                        size='small'
                                        value={data.system}
                                        fullWidth
                                    >
                                        <MenuItem value="PRS">Sewaan (PRS)</MenuItem>
                                        <MenuItem value="PAS">Cukai (PAS)</MenuItem>
                                        <MenuItem value="LISO">Lesen Operasi (LIS Operating)</MenuItem>
                                        <MenuItem value="LIST">Lesen Perniagaan (LIS Trading)</MenuItem>
                                        <MenuItem value="NBL">Lesen UUK</MenuItem>
                                    </Select>
                                    {errors.system && <div className="text-red-500 mt-2 text-sm">{errors.system}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 200 }}>No Akaun/No. Lesen</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                    <TextField
                                        hiddenLabel
                                        value={data.account_number}
                                        onChange={(e) => setData({ ...data, account_number: e.target.value })}
                                        variant="standard"
                                        size="small"
                                    />
                                    {errors.account_number && <div className="text-red-500 mt-2 text-sm">{errors.account_number}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 200 }}>ID Pelanggan</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <TextField
                                        hiddenLabel
                                        value={data.identity_number}
                                        onChange={(e) => setData({ ...data, identity_number: e.target.value })}
                                        variant="standard"
                                        size="small"
                                    />
                                    {errors.identity_number && <div className="text-red-500 mt-2 text-sm">{errors.identity_number}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 200 }}>Nama Pelanggan</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl>
                                    <TextField
                                        hiddenLabel
                                        value={data.customer_name}
                                        onChange={(e) => setData({ ...data, customer_name: e.target.value })}
                                        variant="standard"
                                        size="small"
                                    />
                                    {errors.customer_name && <div className="text-red-500 mt-2 text-sm">{errors.customer_name}</div>}
                                </FormControl>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
                <Typography component="p" variant="p" sx={{ marginTop: '3rem', marginBottom: '1rem' }}>
                    *Setelah maklumat bil didaftarkan, sila teruskan dengan proses <Link style={{ color: 'blue', textDecoration: 'underline' }}  href={route('receipt.create')}>Terimaan</Link>
                </Typography>
                <Stack sx={{ display: "flex", flexDirection: "row", gap: 2, marginBottom: '3rem' }}>
                    {/* <Button variant="outlined" fullWidth>Batal</Button> */}
                    <Button variant="contained" fullWidth onClick={handleSubmit} disabled={processing}>
                        Simpan
                    </Button>
                </Stack>
            </Box>
        </AuthenticatedLayout>
    );
}
