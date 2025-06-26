import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { Box, ButtonBase, Typography } from '@mui/material';
import {
    DocumentIcon,
    MapPinIcon,
    BuildingLibraryIcon,
    MapIcon,
    CreditCardIcon,
    ListBulletIcon,
    QrCodeIcon,
    QueueListIcon,
    PhoneIcon,
    CalendarDateRangeIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import pickBy from 'lodash/pickBy';
import { usePrevious } from 'react-use';

import ReceiptCollection from './ReceiptCollection';
import CollectionCenter from './CollectionCenter';
import Counter from './Counter';
import Bank from './Bank';
import CashierLocation from './CashierLocation';
import PaymentType from './PaymentType';
import IncomeCategory from './IncomeCategory';
import IncomeCode from './IncomeCode';
import DescriptionResultsCode from './DescriptionResultsCode';
import TerminalManagement from './TerminalManagement';
import { contentBackgroundStyles } from "@/Utils/constants.jsx";
import StartingDate from './StartingDate';

const iconMap = {
    receipt_collection: DocumentIcon,
    collection_center: MapPinIcon,
    counter: MapPinIcon,
    bank: BuildingLibraryIcon,
    default_cashier_location: MapIcon,
    payment_type: CreditCardIcon,
    income_category: ListBulletIcon,
    income_code: QrCodeIcon,
    // income_code_description: QueueListIcon,
    terminal_management: PhoneIcon,
    StartingDate: CalendarDateRangeIcon
};

const componentMap = {
    receipt_collection: ReceiptCollection,
    collection_center: CollectionCenter,
    counter: Counter,
    bank: Bank,
    default_cashier_location: CashierLocation,
    payment_type: PaymentType,
    income_category: IncomeCategory,
    income_code: IncomeCode,
    // income_code_description: DescriptionResultsCode,
    terminal_management: TerminalManagement,
    StartingDate: StartingDate
};

const receiverMenu = [
    { id: 1, type: 'receipt_collection', name: 'Kumpulan Resit' },
    { id: 2, type: 'collection_center', name: 'Pusat Kutipan' },
    { id: 3, type: 'counter', name: 'Kaunter' },
    { id: 4, type: 'bank', name: 'Bank' },
    { id: 5, type: 'default_cashier_location', name: 'Lokasi Juruwang' },
    { id: 6, type: 'payment_type', name: 'Jenis Bayaran' },
    { id: 7, type: 'income_category', name: 'Kategori Hasil' },
    { id: 8, type: 'income_code', name: 'Kod Hasil' },
    // { id: 8, type: 'income_code_description', name: 'Keterangan Kod Hasil' },
    { id: 9, type: 'terminal_management', name: 'Kawalan Terimaan' },
    { id: 10, type: 'StartingDate', name: 'Tarikh Permulaan Hari' },
];

const receiverMenuCounterSupervisor = [
    { id: 1, type: 'StartingDate', name: 'Tarikh Permulaan Hari' },
]

export default function Receiver({ auth }) {
    const { currentRoute } = usePage().props;
    const [activeMenu, setActiveMenu] = useState(1);
    const [activeTab, setActiveTab] = useState({ 
        type: '',
        code: '',
        name: '',
        search: '',
        collection_center_id: '',
        counter_id: '',
        description: ''
    });
    const prevValues = usePrevious(activeTab);

    useEffect(() => {
        if (!prevValues || JSON.stringify(prevValues) === JSON.stringify(activeTab)) return;

        const query = Object.keys(pickBy(activeTab)).length ? pickBy(activeTab) : {};

        router.get(route(route().current()), query, {
            replace: true,
            preserveState: true
        });
    }, [activeTab]);

    useEffect(() => {
        setActiveMenu(1);
        setActiveTab({ 
            type: 'receipt_collection',
            code: '',
            name: '',
            search: '',
            collection_center_id: '',
            counter_id: '',
            description: ''
        });
    },[]);

    const handleClickActiveMenu = (id, type) => {
        setActiveMenu(id);
        setActiveTab({ type, code: '', name: '', search: '', collection_center_id: '', counter_id: '', description: '', page: '' });
    };

    // const ActiveComponent = componentMap[receiverMenu.find(item => item.id === activeMenu)?.type];

    const ActiveComponent = componentMap[receiverMenu.find(item => item.id === activeMenu)?.type];

    return (
        <AuthenticatedLayout user={auth.user} currentRoute={currentRoute}>
            <Head title="Terimaan" />
            <Box sx={contentBackgroundStyles}>
                <Box>
                    <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                        Terimaan
                    </Typography>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
                        gap: 2
                    }}>
                        {(auth?.user.role?.name === 'counter_supervisor' ? receiverMenuCounterSupervisor : receiverMenu).map(({ id, type, name }) => {
                            const Icon = iconMap[type];
                            return (
                                <ButtonBase
                                    key={id}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: activeMenu === id ? '#F69B00' : '#E5E5E5',
                                        borderRadius: '5px',
                                        padding: '10px',
                                        fontSize: '13px',
                                        justifyContent: 'flex-start',
                                    }}
                                    onClick={() => handleClickActiveMenu(id, type)}
                                >
                                    <Icon className={`w-6 h-6 mr-1 ${activeMenu === id ? 'text-[#F69B00]' : ''}`} />
                                    {name}
                                </ButtonBase>
                            );
                        })}
                    </Box>
                </Box>
                <Box mt={2} >
                    {ActiveComponent && <ActiveComponent activeTab={activeTab} setActiveTab={setActiveTab} />}
                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
