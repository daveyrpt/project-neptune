import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Box, Typography, Stack, Button} from '@mui/material'
import TableComponent from '@/Components/ui/tables/TableComponent';
import {contentBackgroundStyles} from "@/Utils/constants.jsx";

export default function Receipt({ auth, receipts }) {

    const { currentRoute } = usePage().props;

    // Receipt data
    console.log(receipts)

    return (
        <AuthenticatedLayout
            user={auth.user}
            currentRoute={currentRoute}
        >
            <Head title="Kemaskini Nombor Resit" />
            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    Kemaskini Nombor Resit
                </Typography>
                <Box sx={{ my:4 }}>
                    <TableComponent />
                </Box>
                <Stack direction="row" spacing={2} >
                    <Button variant="outlined" size="small" fullWidth>Batal</Button>
                    <Button variant="contained" size="small" fullWidth>Kemaskini</Button>
                </Stack>
            </Box>
        </AuthenticatedLayout>
    );
}
