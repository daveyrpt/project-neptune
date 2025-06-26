import React from 'react'
import { InboxIcon, MapPinIcon } from '@heroicons/react/24/solid'
import { usePage, router } from '@inertiajs/react';
import { Avatar, Stack, Typography, Button } from '@mui/material';
import {sidebarPaddingStyles} from "@/Utils/constants.jsx";

const SidebarHeader = ({collapsed, setCollapsed, setValue}) => {

    const { auth } = usePage().props;

    const handleCounterSelection = () => {
        router.get(route('counter-and-collection-center.index'));
    }

    return (
        <div className="p-4 my-[40px]" style={sidebarPaddingStyles}>
            <div className='flex justify-between my-2'>
                <Avatar alt='user_profile' src={auth?.avatar} />
                <Avatar
                    alt='user_profile'
                    src='/images/Labuan.jpg'
                    sx={{ width: 56, height: 56 }}
                    onClick={() => {
                        setCollapsed(!collapsed)
                        setValue(!collapsed)
                    }}
                />
            </div>
            <Stack direction="column" spacing={1}>
                <Typography variant="h5Normal">
                    Selamat Datang,
                </Typography>
                <Typography variant='h4SemiBold'>
                    {auth.user?.name}
                </Typography>
                <Typography variant="headerSubTitle">
                    {auth.user?.role?.display_name} | {auth.user?.staff_id}
                </Typography>
            </Stack>

            {auth.user?.role?.display_name === 'Juruwang' && (
                <>
                    <div className="grid gap-1 grid-cols-2 text-sm my-2">

                        <div className='flex items-center'>
                            <span>
                                <InboxIcon className='size-4' />
                            </span>
                            <span>Pusat Kutipan {auth.user?.current_cashier_opened_counter?.collection_center?.name || '-'}</span>
                        </div>
                        <div className='flex items-center'>
                            <span>
                                <MapPinIcon className='size-4' />
                            </span>
                            <span>Kaunter {auth.user?.current_cashier_opened_counter?.counter?.name || '-'}</span>
                        </div>

                    </div>
                    <Button
                        variant="contained"
                        fullWidth
                        color="success"
                        onClick={handleCounterSelection}
                    >
                        Pilih Kaunter
                    </Button>
                </>
            )}

        </div>
    )
}

export default SidebarHeader
