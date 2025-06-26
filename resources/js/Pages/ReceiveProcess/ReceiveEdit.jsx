import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import {
    Box,
    Typography,
    Button,
    Stack,
    TextField,
    Checkbox,
} from '@mui/material'
import TitleCaptions from '@/Components/ui/TitleCaptions';
import { DateField } from '@mui/x-date-pickers-pro'
import dayjs from 'dayjs'
import { contentBackgroundStyles } from "@/Utils/constants.jsx";

export default function ReceiveEdit() {
    const { auth, currentRoute, receipt, receipt_details } = usePage().props

    console.log('receipt', receipt)
    console.log('receipt_details', receipt_details)

    const { data, setData, put, processing } = useForm({
        id: receipt.id,
        income_code: receipt.service ?? 'N/A',
        collection_center_id: receipt.collection_center_id,
        counter_id: receipt.counter_id,
        account_number: receipt.account_number ?? 'N/A',
        receipt_number: receipt.receipt_number,
        description: receipt.description,
        amount_paid: receipt.amount,
        edit_description: receipt.edit_description
    })

    const handleSubmit = () => {
        put(route('receipt.update', receipt.id))
    }

    const handleClose = () => {
        router.visit(route('receipt.index'));
    }

    return (
        <AuthenticatedLayout
            auth={auth.user}
            currentRoute={currentRoute}
        >
            <Head title="Receive Edit" />

            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    Edit Terimaan
                </Typography>
                <Box>
                    <TitleCaptions title="Maklumat Bayaran" extraStyles={{ my: 2 }} />
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 2,
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 120 }}>Tarikh Penerimaan</Typography>
                            <Typography>:</Typography>
                            <DateField
                                defaultValue={dayjs(data.date)}
                                slotProps={{
                                    textField: {
                                        size: 'small', fullWidth: true, variant: 'standard', disabled: true, color:'#EFEFEF'
                                    }
                                }}
                                disabled
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 120 }}>Kod Hasil</Typography>
                            <Typography>:</Typography>
                            <TextField
                                value={data.income_code}
                                onChange={(e) => setData('income_code', e.target.value)}
                                variant="standard"
                                size="small"
                                fullWidth
                                disabled
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 120 }}>Pusat Kutipan</Typography>
                            <Typography>:</Typography>
                            <TextField
                                value={data.collection_center_id}
                                onChange={(e) => setData('collection_center_id', e.target.value)}
                                variant="standard"
                                size="small"
                                fullWidth
                                disabled
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 120 }}>No. Akaun</Typography>
                            <Typography>:</Typography>
                            <TextField
                                value={data.account_number}
                                onChange={(e) => setData('account_number', e.target.value)}
                                variant="standard"
                                size="small"
                                fullWidth
                                disabled
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 120 }}>No. Kaunter</Typography>
                            <Typography>:</Typography>
                            <TextField
                                value={data.counter_id}
                                onChange={(e) => setData('counter_id', e.target.value)}
                                variant="standard"
                                size="small"
                                fullWidth
                                disabled
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 120 }}>Amaun (RM)</Typography>
                            <Typography>:</Typography>
                            <TextField
                                value={data.amount_paid}
                                onChange={(e) => setData('amount_paid', e.target.value)}
                                variant="standard"
                                size="small"
                                fullWidth
                                disabled      
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 120 }}>No. Resit</Typography>
                            <Typography>:</Typography>
                            <TextField
                                value={data.receipt_number}
                                onChange={(e) => setData('receipt_number', e.target.value)}
                                variant="standard"
                                size="small"
                                fullWidth
                                disabled
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography sx={{ width: 120 }}>Pelarasan</Typography>
                            <Typography>:</Typography>
                            <Checkbox defaultChecked />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ gridColumn: 'span 2' }}>
                            <Typography sx={{ width: 120 }}>Keterangan</Typography>
                            <Typography>:</Typography>
                            <TextField
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                variant="standard"
                                size="small"
                                fullWidth
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ gridColumn: 'span 2' }}>
                            <Typography sx={{ width: 120 }}>Keterangan Kemaskini</Typography>
                            <Typography>:</Typography>
                            <TextField
                                value={data.edit_description}
                                variant="standard"
                                size="small"
                                onChange={(e) => setData('edit_description', e.target.value)}
                                fullWidth
                            />
                        </Stack>
                    </Box>
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button variant="outlined" size="small" fullWidth onClick={handleClose}>Batal</Button>
                        <Button variant="contained" size="small" disabled={processing} fullWidth onClick={handleSubmit}>OK</Button>
                    </Stack>
                    <Typography component="p" variant="caption" sx={{ mt: 2 }}>
                        *Pelarasan = Resit yang telah dibuat pelarasan di PLMIS.
                    </Typography>
                </Box>
            </Box>
        </AuthenticatedLayout>
    )
}

