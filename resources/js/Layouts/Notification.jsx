import { ExclamationCircleIcon, XMarkIcon} from '@heroicons/react/24/solid'
import {Link, usePage} from '@inertiajs/react'
import {TextField, Typography, Box, Button, Stack, Tooltip} from '@mui/material'
import React from 'react'
import {useNotification} from '@/NotificationContext'

export default function Notification() {
    const {closeNotification} = useNotification();

    const { auth } = usePage().props
    const notifications = auth?.notifications || [];

    return (
        <Box sx={{border:'1px solid black',height:'100%', p: 2}}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Tooltip title="Tutup Notifikasi" placement="top">
                    <Button onClick={closeNotification}>
                        <XMarkIcon className='w-6 h-6'/>
                    </Button></Tooltip>
                {/* <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Cari Kata Kunci"
                    variant="outlined"
                    size="small"
                /> */}

            </Stack>
            {/* <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
                <Typography sx={{fontWeight:'bold'}}>Notifikasi</Typography>
                <Link>
                    <Typography sx={{fontWeight:'bold'}}>Lihat Semua</Typography>
                </Link>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', mt: 2}}>
                <Box>
                    <ExclamationCircleIcon className='w-10 h-10'/>
                </Box>
                <Box>
                    <Typography>Laporan Kewangan Dihantar</Typography>
                    <Typography>19/2/2023</Typography>
                </Box>
            </Box> */}

            <Box sx={{ mt: 2 ,overflowY: 'scroll' ,maxHeight: '100vh'}} >
                {notifications.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' , mb: 2 }}>
                        <Link href={route('notifications.markAllAsRead')}><Typography>Tandakan Semua Sebagai Telah Dibaca</Typography></Link>
                    </Box>
                )}
                {notifications.length === 0 ? (
                    <Typography>Tiada notifikasi</Typography>
                ) : (
                    notifications.map((notification) => (
                        <Link
                            key={notification.id}
                            href={notification.data.url} 
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <Box
                                key={notification.id}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: 2,
                                    p: 1,
                                    mb: 1,
                                    // border: '1px solid #ccc',
                                    // borderRadius: 1,
                                }}
                            >
                                <Box>
                                    <ExclamationCircleIcon className='w-10 h-10 text-yellow-500' />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        {notification.data.title || notification.type}
                                    </Typography>
                                    <Typography>
                                        {notification.data.message || notification.type}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {notification.created_at}
                                    </Typography>
                                </Box>
                            </Box>
                        </Link>
                    ))
                )}
            </Box>

        </Box>
    )
}
