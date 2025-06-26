import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import {
    Box,
    ButtonBase,
    Typography,
} from '@mui/material';
import {
    DocumentIcon,
    MapPinIcon,
    BuildingLibraryIcon,
    MapIcon,
    ListBulletIcon,
    QrCodeIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import CustomTabPanel from '@/Components/CustomTabPanel';
import { ConfigurationOSP } from './OspMenu/ConfigurationOSP';
import { ImportOSP } from './OspMenu/ImportOSP';
import { ListNotValidOSP } from './OspMenu/ListNotValidOSP';
import { UploadOSP } from './OspMenu/UploadOSP/Index';
import { EndProcessOSP } from './OspMenu/EndProcessOSP';
import { EditReceiveOSP } from './OspMenu/EditReceiveOSP';
import {contentBackgroundStyles} from "@/Utils/constants.jsx";
import { usePrevious } from 'react-use';
import pickBy from 'lodash/pickBy';
import { ClipboardDocumentListIcon, Cog6ToothIcon, DocumentArrowUpIcon, LockClosedIcon, PencilSquareIcon, QueueListIcon } from '@heroicons/react/24/solid';

export default function Osp({ auth }) {

    const { currentRoute } = usePage().props;

    const [activeMenu, setActiveMenu] = useState(1);

    const [activeTab, setActiveTab] = useState({
        type: '',
    })

    const handleClickActiveMenu = (id, type) => {
        setActiveMenu(id);
        setActiveTab({
            type: type
        })
    }

    const OSPMenu = [
        {
            id: 1,
            type: 'config',
            name: 'Konfigurasi OSP',
            icon: <Cog6ToothIcon className={activeMenu === 1 ? 'w-6 h-6 mr-1 text-[#F69B00]' : 'w-6 h-6 mr-1'} />,
            component: <ConfigurationOSP activeTab={activeTab} setActiveTab={setActiveTab} />
        },
        {
            id: 2,
            type: 'import',
            name: 'Import OSP',
            icon: <DocumentArrowUpIcon className={activeMenu === 2 ? 'w-6 h-6 mr-1 text-[#F69B00]' : 'w-6 h-6 mr-1'} />,
            component: <ImportOSP activeTab={activeTab} setActiveTab={setActiveTab} />
        },
        {
            id: 3,
            type: 'failed_osp_import',
            name: 'Senarai OSP Tidak Sah',
            icon: <ClipboardDocumentListIcon className={activeMenu === 3 ? 'w-6 h-6 mr-1 text-[#F69B00]' : 'w-6 h-6 mr-1'} />,
            component: <ListNotValidOSP activeTab={activeTab} setActiveTab={setActiveTab} />
        },
        {
            id: 4,
            type: 'osp',
            name: 'Muat Naik OSP',
            icon: <ClipboardDocumentListIcon className={activeMenu === 4 ? 'w-6 h-6 mr-1 text-[#F69B00]' : 'w-6 h-6 mr-1'} />,
            component: <UploadOSP activeTab={activeTab} setActiveTab={setActiveTab} />
        },
        {
            id: 5,
            type: 'saga',
            name: 'Kemaskini Terimaan OSP',
            icon: <PencilSquareIcon className={activeMenu === 6 ? 'w-6 h-6 mr-1 text-[#F69B00]' : 'w-6 h-6 mr-1'} />,
            component: <EditReceiveOSP activeTab={activeTab} setActiveTab={setActiveTab} />
        },
                {
            id: 6,
            type: 'plmis',
            name: 'Tamat Proses OSP',
            icon: <LockClosedIcon className={activeMenu === 7 ? 'w-6 h-6 mr-1 text-[#F69B00]' : 'w-6 h-6 mr-1'} />,
            component: <EndProcessOSP activeTab={activeTab} setActiveTab={setActiveTab} />
        },
    ]

        const prevValues = usePrevious(activeTab);
    
        useEffect(() => {
    
            if (prevValues) {
                const query = Object.keys(pickBy(activeTab)).length ? pickBy(activeTab) : {};
    
                router.get(route(route().current()), query, {
                    replace: true,
                    preserveState: true
                });
            }
    
        }, [activeTab])

    return (
        <AuthenticatedLayout
            user={auth.user}
            currentRoute={currentRoute}
        >
            <Head title={OSPMenu.find(item=>item.id === activeMenu)?.name} />
            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    {OSPMenu.find(item => item.id === activeMenu)?.name}
                </Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
                        gap: 2
                    }}
                >
                    {
                        OSPMenu.map((item, index) => (
                            <ButtonBase
                                key={index}
                                sx={{
                                    border: '1px solid #E5E5E5',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    fontSize: '13px',
                                    justifyContent: 'flex-start',
                                    borderColor: activeMenu === item.id ? '#F69B00' : '#E5E5E5',
                                }}
                                onClick={() => handleClickActiveMenu(item.id,item.type)}
                                fullWidth
                            >
                                {item.icon}
                                {item.name}
                            </ButtonBase>
                        ))
                    }
                </Box>
                <Box>
                    {
                        OSPMenu.map((item, index) => (
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
