import React from 'react'
import { Box, Card, Grid, CardActionArea, CardContent, Stack, Typography, Divider, LinearProgress } from '@mui/material'
import { LineChart } from '@mui/x-charts';
import { Link } from '@inertiajs/react';

export default function Resit({ receipts, chartInfo, graphTransactions, graphAmounts }) {

    const cardReceipt = receipts.map((item, index) => {
        return {
            id: item.id,
            counterNumber: `Kaunter ${item.counter?.name || '-'}`,
            idJuruwang: `${item.user?.id} - ${item.user?.name || '-'}`,
            pusatKutipan: item.collection_center?.name || '-',
            serviceType: 'N/A',
            date: new Date(item.date).toLocaleDateString('en-GB'),
            time: new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            url: '/receipts/' + item.id,
            receiptNumber: item.receipt_number
        };
    })

    const data = [
        { label: 'Kutipan Tunai', value: chartInfo?.Tunai, color: '#e53935' },
        { label: 'Kutipan Cek', value: chartInfo?.Cek, color: '#00c853' },
        { label: 'Kutipan Kad Kredit', value: chartInfo?.KadKeredit, color: '#8e24aa' },
        { label: 'Kutipan Wang Pos/Kiriman Wang', value: chartInfo?.WangPos, color: '#bf360c' },
        { label: 'Kutipan EFT', value: chartInfo?.EFT, color: '#1e88e5' },
        { label: 'Kutipan Deraf Bank', value: chartInfo?.DerafBank, color: '#f500f5' },
        { label: 'Kutipan Slip Bank', value: chartInfo?.SlipBank, color: '#fdd835' },
        { label: 'Kutipan QR Pay', value: chartInfo?.QRPay, color: '#00bfa5' },
    ];

    const max = Math.max(...data.map(item => item.value));

    const margin = { right: 24 };
    const pData = [240, 139, 980, 390, 480, 380, 430];
    const xLabels = ['100', '200', '300', '400', '500', '600', '700',];

    const graphAmaunPenerimaanY = graphAmounts.map(item => parseFloat(item.y));
    const graphAmaunPenerimaanX = graphAmounts.map(item => item.x);

    const graphTransactionsY = graphTransactions.map(item => parseFloat(item.y));
    const graphTransactionsX = graphTransactions.map(item => item.x);


    return (
        <>
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
                            Tiada Rekod
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
                                                {card.receiptNumber}
                                            </Typography>
                                            <Box>
                                                <Box>
                                                    <Typography variant="subtitle3" color="text.secondary">
                                                        ID Juruwang
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {card.idJuruwang}
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
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <Link href={route('receipt.print', card.id)}>
                                                    <Typography variant="body2" color="success">
                                                        Lihat Resit
                                                    </Typography>
                                                </Link>
                                                <Link onClick={() => window.open(route('receipt.print-receipt', { id: card.id }))}>
                                                    <Typography variant="body2">
                                                        Cetak
                                                    </Typography>
                                                </Link>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        )))
                }
            </Box>
            <Card sx={{ p: 4, mt: 4 }} elevation={2}>
                <Grid container spacing={2}>
                    {data.map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>

                            <Box display="flex" alignItems="center" mb={1}>
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        backgroundColor: item.color,
                                        mr: 1,
                                    }}
                                />
                                <Typography variant="body2" color="textSecondary">
                                    {item.label}
                                </Typography>
                            </Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                RM{item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={(item.value / max) * 100}
                                sx={{
                                    height: 8,
                                    borderRadius: 5,
                                    backgroundColor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: item.color,
                                    },
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Card>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(min(200px, 100%), 1fr))", gap: 2 }}>
                <Grid size={6}>
                    <Card sx={{ p: 4, mt: 4 }} elevation={2}>
                        <LineChart
                            height={300}
                            width={500}
                            series={[
                                { data: graphAmaunPenerimaanY, label: 'Amaun Penerimaan' },
                            ]}
                            xAxis={[{ scaleType: 'point', data: graphAmaunPenerimaanX, label: 'Masa' }]}
                            yAxis={[{ width: 50, label: 'Jumlah (RM)' }]}
                            margin={margin}
                        />
                    </Card>
                </Grid>
                <Grid size={6}>
                    <Card sx={{ p: 4, mt: 4 }} elevation={2}>
                        <LineChart
                            height={300}
                            width={500}
                            series={[
                                { data: graphTransactionsY, label: 'Transaksi' },
                            ]}
                            xAxis={[{ scaleType: 'point', data: graphTransactionsX, label: 'Masa' }]}
                            yAxis={[{ width: 50, label: 'Bilangan' }]}
                            margin={margin}
                        />
                    </Card>
                </Grid>
            </Box>
        </>
    )
}
