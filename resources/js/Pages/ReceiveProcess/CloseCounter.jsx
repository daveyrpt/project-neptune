import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Box,Typography, FormControl, MenuItem, InputLabel, Select, Stack, TextField, Button, FormLabel } from '@mui/material'
import TableComponent from '@/Components/ui/tables/TableComponent';
import TitleCaptions from '@/Components/ui/TitleCaptions';
import {contentBackgroundStyles} from "@/Utils/constants.jsx";

export default function CloseCounter({ auth }) {

    const { currentRoute } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            currentRoute={currentRoute}
        >
            <Head title="Tutup Kaunter" />
            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    Tutup Kaunter
                </Typography>
                <Stack direction="row" spacing={2} >
                    <FormControl fullWidth size="small">
                        <InputLabel id="counter-select2">Kod Kumpulan Resit</InputLabel>
                        <Select
                            labelId="counter-select2"
                            id="demo-simple-select2"
                            value=""
                            label="Kod Kumpulan Resit"
                            onChange={() => console.log('')}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                        <InputLabel id="counter-select2">Kumpulan Resit</InputLabel>
                        <Select
                            labelId="counter-select2"
                            id="demo-simple-select2"
                            value=""
                            label="Kumpulan Resit"
                            onChange={() => console.log('')}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField fullWidth id="search" label="Carian" variant="outlined" size="small" />
                    <Button variant="contained" size="small" fullWidth>Cari</Button>
                    <Button variant="contained" size="small" fullWidth>Tambah</Button>
                </Stack>
                <Box sx={{ mt: 2 }}>
                    <TableComponent />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <TitleCaptions title="Dikemaskini Oleh" extraStyles={{ mb: 2 }}/>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                        <FormControl sx={{ flexDirection: 'row' }}>
                            <FormLabel
                                sx={{ display: 'flex', alignItems: 'center', marginRight: 2, width: 150 }}
                                id="demo-row-radio-buttons-group-label"
                            >
                                Dihasilkan:
                            </FormLabel>
                            <TextField
                                hiddenLabel
                                id="filled-hidden-label-small"
                                defaultValue=""
                                placeholder='Kosongkan jika ada'
                                variant="filled"
                                size="small"
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
                            <TextField
                                hiddenLabel
                                id="filled-hidden-label-small"
                                defaultValue=""
                                placeholder="Kosongkan jika ada"
                                variant="filled"
                                size="small"
                            />
                        </FormControl>
                    </Box>
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
