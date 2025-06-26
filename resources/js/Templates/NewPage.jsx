import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import {
    Box,
    Typography,
} from '@mui/material';

export default function NewPage() {

    const { auth, currentRoute } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            currentRoute={currentRoute}
        >
            <Head title="PageTitle" />
            <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    PageTitle
                </Typography>
            </Box>
        </AuthenticatedLayout>
    );
}
