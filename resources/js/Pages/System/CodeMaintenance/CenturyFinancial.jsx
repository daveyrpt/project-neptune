import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ListBulletIcon, Square3Stack3DIcon } from '@heroicons/react/24/solid';
import { Head, usePage, router } from '@inertiajs/react';
import {
    Box,
    Typography,
    Stack,
    Button
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import CustomTabPanel from '@/Components/CustomTabPanel';
import MoneyGroup from './CenturyFinancialMenu/MoneyGroup';
import AutoNumbering from './CenturyFinancialMenu/AutoNumbering';
import pickBy from 'lodash/pickBy';
import { usePrevious } from 'react-use';
import { contentBackgroundStyles } from "@/Utils/constants.jsx";

export default function CenturyFinancial({ auth }) {

    const { currentRoute } = usePage().props;

    const [activeMenu, setActiveMenu] = useState(1);
    const [activeTab, setActiveTab] = useState({
        type: '',
        code: '',
        name: '',
    })

    const handleClickActiveMenu = (id, type) => {
        setActiveMenu(id);
        setActiveTab({
            type: type
        })
    }

    useEffect(() => {
        setActiveMenu(1);
        setActiveTab({
            type: 'cash_collection',
            code: '',
            name: '',
            search: '',
            collection_center_id: '',
            counter_id: '',
            description: ''
        });
    }, []);

    const centuryFinancialMenu = [
        {
            id: 1,
            type: 'cash_collection',
            name: 'Kumpulan Wang',
            icon: <Square3Stack3DIcon className={activeMenu === 1 ? 'w-6 h-6 mr-1 text-[#F69B00]' : 'w-6 h-6 mr-1'} />,
            component: <MoneyGroup activeTab={activeTab} setActiveTab={setActiveTab} />
        },
        {
            id: 2,
            type: 'auto_numbering',
            name: 'Auto Penomboran',
            icon: <ListBulletIcon className={activeMenu === 2 ? 'w-6 h-6 mr-1 text-[#F69B00]' : 'w-6 h-6 mr-1'} />,
            component: <AutoNumbering activeTab={activeTab} setActiveTab={setActiveTab} />
        }
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
            <Head title="Century Financial" />
            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    Century Financial
                </Typography>
                <Stack direction="row" spacing={2}>
                    {
                        centuryFinancialMenu.map((item, index) => (
                            <Button
                                key={index}
                                sx={{
                                    border: '1px solid #E5E5E5',
                                    borderRadius: '--var(border-radius)',
                                    padding: '10px',
                                    fontSize: '13px',
                                    justifyContent: 'flex-start',
                                    borderColor: activeMenu === item.id ? '#F69B00' : '#E5E5E5',
                                }}
                                onClick={() => handleClickActiveMenu(item.id, item.type)}
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
                        centuryFinancialMenu.map((item, index) => (
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
