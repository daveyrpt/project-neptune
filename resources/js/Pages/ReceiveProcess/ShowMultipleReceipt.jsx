import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    Box,
} from "@mui/material";
import Preview from "./ReceiptPreview/Preview";

export default function ShowMultipleReceipt({ auth, receipts, currentRoute }) {
    return (
        <AuthenticatedLayout user={auth.user} currentRoute={currentRoute}>
            <Box>
                <Head title="Print" />
                {
                    receipts.map((receipt) => {
                        return (
                            <Preview key={receipt.id} receipt={receipt} />
                        );
                    })
                }
            </Box>
        </AuthenticatedLayout>
    );
}
