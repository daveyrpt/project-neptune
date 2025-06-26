import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Box,
    Typography,
    Stack,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    TextField,
} from '@mui/material';
import TitleCaptions from '@/Components/ui/TitleCaptions';
import {contentBackgroundStyles} from "@/Utils/constants.jsx";

export default function Configuration({ auth }) {

    const { currentRoute, system_configurations } = usePage().props;

    const paymentMethods = [
        "Tunai",
        "Cek",
        "Kad Kredit",
        "Wang Pos",
        "EFT",
        "Deraf Bank",
        "Slip Bank",
    ];

    const { data, setData, post } = useForm({
        status: system_configurations.status || 'online',
        total_max_cash: system_configurations.total_max_cash || '',
        total_max_receipt: system_configurations.total_max_receipt || '',
        max_float_cash: system_configurations.max_float_cash || '',
        allowed_cancel_receipt: system_configurations.allowed_cancel_receipt || '',
        osp_status: system_configurations.osp_status || '',
        receipt_format: system_configurations.receipt_format || '',
    })

    const handleSubmit = () => {
        post(route('system.configuration.update'));
    }


    return (
        <AuthenticatedLayout
            user={auth.user}
            currentRoute={currentRoute}
        >
            <Head title="Konfigurasi Sistem" />
            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    Konfigurasi Sistem
                </Typography>
                <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
                    <Button onClick={handleSubmit} variant="contained" sx={{ textTransform: 'none',padding:'12px 40px',borderRadius:'var(--button-radius)' }}>Kemaskini</Button>
                </Stack>
                {/* <Box>
                    <TitleCaptions
                        title="Capaian Sistem"
                        captions="Capaian Sistem sama ada Online (Data disimpan di server) atau Offline(data di simpandi kaunter dan akan dieksport ke server apabila wujud sambungan ke server)."
                    />
                    <Box sx={{ marginBottom: 4 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 120 }}>Status</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        row
                                        defaultValue={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        name="status"
                                    >
                                        <FormControlLabel
                                            value="online"
                                            control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }} />}
                                            label="Online"
                                        />
                                        <FormControlLabel
                                            value="offline"
                                            control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 15 }, }} />}
                                            label="Offline"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </Stack>
                    </Box>
                </Box> */}
                <Box sx={{ marginBottom: 4 }}>
                    <TitleCaptions
                        title="Kawalan Juruwang"
                        captions="Sistem membenarkan pengguna untuk menghadkan jumlah keseluruhan kutipan harian dan menghadkan jumlah kutipan resit" />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <FormControl sx={{ flexDirection: 'row' }}>
                            <FormLabel sx={{ display: 'flex', alignItems: 'center', marginRight: 2, width: 300 }} id="demo-row-radio-buttons-group-label">Default jumlah had tunai (RM):</FormLabel>
                            {/* this should be number */}
                            <TextField
                                hiddenLabel
                                id="filled-hidden-label-small"
                                defaultValue={data.total_max_cash}
                                onChange={(e) => setData('total_max_cash', e.target.value)}
                                type='number'
                                placeholder='Kosongkan jika tiada'
                                variant="filled"
                                size="small"
                                fullWidth
                            />
                        </FormControl>
                        <FormControl sx={{ flexDirection: 'row' }}>
                            <FormLabel sx={{ display: 'flex', alignItems: 'center', marginRight: 2, width: 300 }} id="demo-row-radio-buttons-group-label">Default jumlah had resit (RM):</FormLabel>
                            {/* this should be number */}
                            <TextField
                                hiddenLabel
                                id="filled-hidden-label-small"
                                defaultValue={data.total_max_receipt}
                                onChange={(e) => setData('total_max_receipt', e.target.value)}
                                type='number'
                                placeholder="Kosongkan jika tiada"
                                variant="filled"
                                size="small"
                                fullWidth
                            />
                        </FormControl>
                        <FormControl sx={{ flexDirection: 'row' }}>
                            <FormLabel sx={{ display: 'flex', alignItems: 'center', marginRight: 2, width: 300 }} id="demo-row-radio-buttons-group-label">Had Wang Runcit (RM):</FormLabel>
                            {/* this should be number */}
                            <TextField
                                hiddenLabel
                                id="filled-hidden-label-small"
                                defaultValue={data.max_float_cash}
                                onChange={(e) => setData('max_float_cash', e.target.value)}
                                type='number'
                                placeholder="Kosongkan jika tiada"
                                variant="filled"
                                size="small"
                                fullWidth
                            />
                        </FormControl>
                    </Box>
                </Box>
                <Box sx={{ marginBottom: 4 }}>
                    <TitleCaptions
                        title="Pembatalan Resit"
                        captions="Sistem membenarkan kawalan kepada pengguna samaada boleh membuat pembatalan resit atau tidak."
                    />
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 120 }}>Status</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        row
                                        name="allowed_cancel_receipt"
                                        defaultValue={data.allowed_cancel_receipt}
                                        onChange={(e) => setData('allowed_cancel_receipt', e.target.value)}
                                    >
                                        <FormControlLabel value="enable" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }} />} label="Enable" />
                                        <FormControlLabel value="disable" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }} />} label="Disable" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
                <Box sx={{ marginBottom: 4 }}>
                    <TitleCaptions
                        title="Slip Deposit Bank"
                        captions="Sistem membenarkan pengguna untuk membuat pilihan Slip Deposit Bank samaada Single atau Multiple"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Stack spacing={1}>
                            {paymentMethods.map((method) => (
                                <Stack key={method} direction="row" alignItems="center" spacing={2}>
                                    <Typography sx={{ width: 120 }}>{method}</Typography>
                                    <Typography>:</Typography>
                                    <Box>
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                row
                                                name={method}
                                                // defaultValue={data.method}
                                                // onChange={(e) => setData('method', e.target.value)}
                                            >
                                                <FormControlLabel value="single" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }} />} label="Single" />
                                                <FormControlLabel value="multiple" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }} />} label="Multiple" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Box>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>
                </Box>
                <Box sx={{ marginBottom: 4 }}>
                    <TitleCaptions
                        title="OSP"
                        captions="Sistem membenarkan kawalan kepada pengguna samaada boleh membuat pembatalan resit atau tidak."
                    />
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 120 }}>Status</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        row
                                        defaultValue={data.osp_status}
                                        onChange={(e) => setData('osp_status', e.target.value)}
                                    >
                                        <FormControlLabel value="reject" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }} />} label="Reject No Akaun Tidak Wujud" />
                                        <FormControlLabel value="edit" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }} />} label="Kemaskini No. Akaun" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </Stack>
                    </Box>
                </Box>
                {/* <Box sx={{ marginBottom: 4 }}>
                    <TitleCaptions
                        title="Cetak Resit"
                        captions="Terdapat beberapa format cetakan boleh dipilih.Pilihan dibuat berdasarkan kod hasil."
                    />
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 120 }}>Status</Typography>
                            <Typography>:</Typography>
                            <Box>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        row
                                        defaultValue={data.receipt_format}
                                        onChange={(e) => setData('receipt_format', e.target.value)}
                                    >
                                        <FormControlLabel value="image1" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }} />} label="Image" />
                                        <FormControlLabel value="image2" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }} />} label="Image" />
                                        <FormControlLabel value="image3" control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 15 } }} />} label="Image" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </Stack>
                    </Box>
                </Box> */}
            </Box>
        </AuthenticatedLayout>
    );
}
