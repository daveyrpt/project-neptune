import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, usePage} from '@inertiajs/react';
import {
    Box,
    Typography,
    Stack,
    Button
} from '@mui/material';
import {ListBulletIcon, Square3Stack3DIcon} from '@heroicons/react/24/solid';
import {useState} from 'react';
import CustomTabPanel from '@/Components/CustomTabPanel';
import OpenItemReview from './IntegrationMenu/OpenItemReview';
import ExportDataToOffline from './IntegrationMenu/ExportDataToOffline';
import ImportDataFromOnline from './IntegrationMenu/ImportDataFromOnline';
import IntegrationPLMIS from './IntegrationMenu/IntegrationPLMIS';
import {contentBackgroundStyles} from "@/Utils/constants.jsx";

export default function Integration({auth}) {

    const {currentRoute} = usePage().props;

    const [activeMenu, setActiveMenu] = useState(1);

    const handleClickActiveMenu = (id) => {
        setActiveMenu(id);
    }

    const IntegrationMenu = [
        {
            id: 1,
            name: 'Semakan Open Item',
            icon: <Square3Stack3DIcon className={activeMenu === 1 ? 'w-6 h-6 mr-1 text-[#F69B00]' : 'w-6 h-6 mr-1'}/>,
            component: <OpenItemReview/>
        },
        {
            id: 2,
            name: 'Export Data ke Offline',
            icon: <ListBulletIcon className={activeMenu === 2 ? 'w-6 h-6 mr-1 text-[#F69B00]' : 'w-6 h-6 mr-1'}/>,
            component: <ExportDataToOffline/>
        },
        {
            id: 3,
            name: 'Import Data dari Offline',
            icon: <ListBulletIcon className={activeMenu === 3 ? 'w-6 h-6 mr-1 text-[#F69B00]' : 'w-6 h-6 mr-1'}/>,
            component: <ImportDataFromOnline/>
        },
        {
            id: 4,
            name: 'Integrasi PLMIS',
            icon: <ListBulletIcon className={activeMenu === 4 ? 'w-6 h-6 mr-1 text-[#F69B00]' : 'w-6 h-6 mr-1'}/>,
            component: <IntegrationPLMIS/>
        }
    ]

    return (
        <AuthenticatedLayout
            user={auth.user}
            currentRoute={currentRoute}
        >
            <Head title="Integrasi"/>
            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{mb: 2}}>
                    Integrasi
                </Typography>
                <Stack direction="row" spacing={2} sx={{mb: 5, mt: 5}}>
                    {
                        IntegrationMenu.map((item, index) => (
                            <Button
                                key={index}
                                sx={{
                                    border: '1px solid #E5E5E5',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    fontSize: '13px',
                                    justifyContent: 'flex-start',
                                    borderColor: activeMenu === item.id ? '#F69B00' : '#E5E5E5',
                                }}
                                onClick={() => handleClickActiveMenu(item.id)}
                                fullWidth
                            >
                                {item.icon}
                                {item.name}
                            </Button>
                        ))
                    }
                </Stack>
                <Box>
                    {
                        IntegrationMenu.map((item, index) => (
                            <CustomTabPanel key={index} value={activeMenu} index={item.id}>
                                {item.component}
                            </CustomTabPanel>
                        ))
                    }
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
