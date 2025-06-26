import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import {
    Box,
    Typography,
    TableContainer,
    TableRow,
    Table,
    TableHead,
    TableCell,
    TableBody,
    Paper,
    Button,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    Checkbox,
    ListItemText,
    MenuItem,
    Stack,
    TextField
} from '@mui/material'
import TitleCaptions from '@/Components/ui/TitleCaptions';
import CustomTextField from '@/Components/ui/field/CustomTextField';
import { useState } from 'react';
import { MinusCircleIcon } from '@heroicons/react/24/solid';
import ModalAcceptForm from './ModalAcceptForm';
import ModalRejectForm from './ModalRejectForm';
import { contentBackgroundStyles } from '@/Utils/constants';
import CustomDateField from '@/Components/ui/field/CustomDateField';


const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

export default function Show() {
    const { auth, currentRoute, receipt, cancelled_receipt, collection_centers, counters, current_bill, payment_detail } = usePage().props;

    console.log('cec', receipt)
    console.log('collection_centers', collection_centers)

    const [rows, setRows] = useState([]);
    const [editable, setEditable] = useState(false);

    const [openModalAccept, setOpenModalAccept] = useState(false);
    const [openModalReject, setOpenModalReject] = useState(false);

    const { data, setData, errors, post, put, processing,reset } = useForm({
        id: cancelled_receipt.id,
        user_id: receipt.user_id,
        collection_center_id: receipt.collection_center_id,
        counter_id: receipt.counter_id,
        type: '',
        date_applied: '',
        total: '',
        receipt_number: receipt.receipt_number,
        description: receipt.description || '',
    })


    const handleEditForm = () => {
        setEditable(!editable)
    }

    const handleClose = () => {
        router.visit(route('receipt.cancel.index'));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route('receipt.cancel.request-form.update', data.id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditable(false); // Optionally lock form
            }
        });
    };

    const handleRejectForm = () => {
        reset();
        console.log('handleRejectForm')
        setOpenModalReject(true)
    }

    const handleAcceptForm = () => {
        console.log('handleAcceptForm')
        setOpenModalAccept(true)
    }

    const deleteItem = (index) => {
        setRows(rows.filter(row => row.index !== index));
    };


    const handleApprove = (e) => {
        console.log('handleApprove')
        e.preventDefault();
        post(route('receipt.cancel.request-form.approve', {
            cancelledReceipt: data.id
        }), {
          onSuccess: () => {
            handleClose();
          }
        });
    }

    const handleReject = (e) => {
        console.log('handleReject')
        e.preventDefault();
        post(route('receipt.cancel.request-form.reject', {
            cancelledReceipt: data.id
        }), {
          onSuccess: () => {
            handleClose();
          }
        });
    }


    return (
        <AuthenticatedLayout
            user={auth.user}
            currentRoute={currentRoute}
        >
            <ModalAcceptForm
                openModalAccept={openModalAccept}
                handleClose={() => setOpenModalAccept(false)}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleApprove}
                cancelled_receipt={cancelled_receipt}
            />
            <ModalRejectForm
                openModalReject={openModalReject}
                handleClose={() => setOpenModalReject(false)}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleReject}
            />
            <Head title="Borang Resit" />
            <Stack direction="row" spacing={2} justifyContent={'flex-end'} mt={3}>
                {/* <Button
                    onClick={handleEditForm}
                    variant="contained"
                    size="small"
                    sx={{ 
                        textTransform: 'none',
                        width: 260,
                        height: '40px',
                        borderRadius: 'var(--button-radius)'
                    }}
                >
                    Kemaskini
                </Button> */}
                <Button
                    onClick={handleRejectForm}
                    variant="contained"
                    size="small"
                    color='error'
                    disabled={editable}
                    sx={{ 
                        textTransform: 'none',
                        width: 260,
                        height: '40px',
                        borderRadius: 'var(--button-radius)'
                    }}
                >
                    Tolak
                </Button>
                <Button
                    onClick={handleAcceptForm}
                    variant="contained"
                    size="small"
                    disabled={editable}
                    color='success'
                    sx={{ 
                        textTransform: 'none',
                        width: 260,
                        height: '40px',
                        borderRadius: 'var(--button-radius)'
                    }}
                >
                    Lulus
                </Button>
            </Stack>
            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    Borang Resit
                </Typography>
                <TitleCaptions title="Maklumat" extraStyles={{ mb: 2 }} />
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: 'repeat(2, minmax(min(200px, 100%), 1fr))',
                        gap: 4
                    }}
                >
                    <CustomTextField
                        variant='standard'
                        label="Juruwang"
                        value={data.user_id}
                        disabled
                    />
                    <CustomTextField
                        variant='standard'
                        label="Pusat Kutipan"
                        value={collection_centers.find((item) => item.id === data.collection_center_id).name}
                        disabled
                    />
                    <CustomDateField
                        variant='standard'
                        label="Tarikh"
                        //date={data.date}
                        date={new Date(data.date).toLocaleDateString('en-GB')}
                        disabled
                    />
                    <CustomTextField
                        variant='standard'
                        label="No. Kaunter"
                        value={counters.find((item) => item.id === data.counter_id).name}
                        disabled
                    />
                    <CustomTextField
                        variant='standard'
                        label="Bilangan Bil"
                        value={current_bill}
                        disabled
                    />

                </Box>
                <Box sx={{ mt: 2 }}>
                    <TitleCaptions title="Butiran Bil" />
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead sx={{ backgroundColor: '#004269' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white' }}>Bil</TableCell>
                                    <TableCell sx={{ color: 'white' }}>No. Akaun</TableCell>
                                    <TableCell sx={{ color: 'white' }}>No. Bil</TableCell>
                                    <TableCell sx={{ color: 'white' }}>No. Resit</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Kod Hasil</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Keterangan</TableCell>
                                    <TableCell sx={{ color: 'white' }}>No. Rujukan</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Amaun</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                    <TableRow
                                        // key={row.name}
                                        // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            1
                                        </TableCell>
                                        <TableCell>
                                            {/* <FormControl sx={{ m: 1, width: 150 }} size='small'>
                                                <InputLabel size='small'>No. Akaun</InputLabel>
                                                <Select
                                                    size='small'
                                                    multiple
                                                    value={personName}
                                                    onChange={handleChange}
                                                    input={<OutlinedInput label="No. Akaun" />}
                                                    renderValue={(selected) => selected.join(', ')}
                                                >
                                                    {names.map((name) => (
                                                        <MenuItem key={name} value={name}>
                                                            <Checkbox checked={personName.includes(name)} />
                                                            <ListItemText primary={name} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl> */}
                                            {receipt.account_number}
                                        </TableCell>
                                        <TableCell>
                                            {/* <FormControl sx={{ m: 1, width: 150 }} size='small'>
                                                <InputLabel size='small'>No. Bil</InputLabel>
                                                <Select
                                                    size='small'
                                                    multiple
                                                    value={personName}
                                                    onChange={handleChange}
                                                    input={<OutlinedInput label="No. Bil" />}
                                                    renderValue={(selected) => selected.join(', ')}
                                                >
                                                    {names.map((name) => (
                                                        <MenuItem key={name} value={name}>
                                                            <Checkbox checked={personName.includes(name)} />
                                                            <ListItemText primary={name} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl> */}
                                            {receipt?.details?.[0]?.bill_number}
                                        </TableCell>
                                        <TableCell>
                                            {/* <FormControl sx={{ m: 1, width: 150 }} size='small'>
                                                <InputLabel size='small'>No. Resit</InputLabel>
                                                <Select
                                                    size='small'
                                                    multiple
                                                    value={personName}
                                                    onChange={handleChange}
                                                    input={<OutlinedInput label="No. Resit" />}
                                                    renderValue={(selected) => selected.join(', ')}
                                                >
                                                    {names.map((name) => (
                                                        <MenuItem key={name} value={name}>
                                                            <Checkbox checked={personName.includes(name)} />
                                                            <ListItemText primary={name} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl> */}
                                            {receipt.receipt_number}
                                        </TableCell>
                                        <TableCell>
                                            {/* <FormControl sx={{ m: 1, width: 150 }} size='small'>
                                                <InputLabel size='small'>Kod Hasil</InputLabel>
                                                <Select
                                                    size='small'
                                                    multiple
                                                    value={data.income_code}
                                                >
                                                    {names.map((name) => (
                                                        <MenuItem key={name} value={name}>
                                                            <ListItemText primary={name} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl> */}
                                            {receipt.service}
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                size='small'
                                                fullWidth
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                disabled={!editable}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {receipt.reference_number}
                                        </TableCell>
                                        <TableCell>
                                            {receipt.amount_to_be_paid}
                                        </TableCell>
                                    </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <TitleCaptions
                        title="Butiran Bayaran"
                    />
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead sx={{ backgroundColor: '#004269' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white' }}>Jenis</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Amaun</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Kod Bank</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Nama Bank</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Rujukan</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Pembayar/Pemegang Kad</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    receipt.details.map((detail, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{payment_detail.type || '-'}</TableCell>
                                            <TableCell>{payment_detail.amount || '-'}</TableCell>
                                            <TableCell>{payment_detail.code_bank || '-'}</TableCell>
                                            <TableCell>{payment_detail.bank_name || '-'}</TableCell>
                                            <TableCell>{payment_detail.reference_number || '-'}</TableCell>
                                            <TableCell>{payment_detail.reference || '-'}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <TitleCaptions title="Jumlah Akhir" />
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: 'repeat(2, minmax(min(200px, 100%), 1fr))',
                            gap: 4,
                            mt: 2,
                        }}
                    >
                        <CustomTextField
                            label="Amaun Kena Bayar (RM)"
                            value={receipt.amount_to_be_paid}
                            disabled
                        />
                        <CustomTextField
                            label="Amaun Diterima (RM)"
                            value={receipt.amount_paid}
                            disabled
                        />
                        <CustomTextField
                            label="Baki Dikembalikan (RM)"
                            value={receipt.return_amount}
                            disabled
                        />
                    </Box>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
                    {/* <Button variant="outlined" fullWidth onClick={handleClose}>Batal</Button> */}
                    {editable ? (
                        <Button variant="contained" fullWidth onClick={handleSubmit}>Simpan</Button>
                    ) : (
                        <Box />
                    )}
                </Box>
            </Box>
        </AuthenticatedLayout>
    )
}
