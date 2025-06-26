import React from 'react'
import { Box, Card, CardActionArea, CardContent, Stack, Typography, Divider } from '@mui/material'


export default function Kaunter({ active_counter }) {

    const cardReceipt = active_counter.map((item, index) => {
        return {
            id: item.id,
            counterNumber: `Kaunter ${item.counter?.name || '-'}`,
            idJuruwang: `${item.user?.id}-${item.user?.name || '-'}`,
            pusatKutipan: item.collection_center?.name || '-',
            serviceType: 'N/A',
            date: new Date(item.opened_at).toLocaleDateString('en-GB'),
            time: new Date(item.opened_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            url: `#`,
        };
    });

    const cardReceipt2 = [
        {
            id: 1,
            counterNumber: 'Kaunter 1',
            idJuruwang: '105-Aziz',
            pusatKutipan: 'Wisma PL',
            serviceType: 'Pembayaran Bill',
            date: '2023-03-01',
            time: '10:00',
            url: '#',
        },
        {
            id: 2,
            counterNumber: 'Kaunter 2',
            idJuruwang: '105-Aziz',
            pusatKutipan: 'Wisma PL',
            serviceType: 'Pembayaran Bill',
            date: '2023-03-01',
            time: '10:00',
            url: '#',
        }
    ]

    return (
        <Box
            sx={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
                gap: 4,
            }}>
            {
                cardReceipt.length === 0 ? (
                    <Typography variant="body1" color="textSecondary">
                        Tiada Kaunter Dibuka
                    </Typography>
                ) : (
                    cardReceipt.map((card, index) => (
                        <Card>
                            <CardActionArea
                                onClick={() => console.log('go to receipt')}
                                sx={{
                                    height: '100%',
                                }}
                            >
                                <CardContent sx={{ height: '100%' }}>
                                    <Stack spacing={2}>
                                        <Typography variant="h6" component="div">
                                            {card.counterNumber}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle3" color="text.secondary">
                                                    ID Juruwang
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {card.idJuruwang}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle3">
                                                    Pusat Kutipan
                                                </Typography>
                                                <Typography variant="body2">
                                                    {card.pusatKutipan}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Stack>
                                                <Typography variant="subtitle3" color="text.secondary">
                                                    Tarikh
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {card.date}
                                                </Typography>
                                            </Stack>
                                            <Stack>
                                                <Typography variant="subtitle3" color="text.secondary">
                                                    Masa
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {card.time}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                        <Divider />
                                        <Typography variant="body2" color="success">
                                            Buka
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))
                )}
            
        </Box>
    )
}
