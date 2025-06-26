import React from 'react'
import { Box, Paper, Stack, Typography } from '@mui/material'
import { CheckCircleIcon, ChevronRightIcon, DocumentIcon, CalendarDaysIcon, CheckBadgeIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { Link } from '@inertiajs/react'

export default function Laporan({ reportIndicator }) {
    const iconColor = "h-6 w-6 text-[#F69B00]";

    const listMenu = [
        {
            label: "Slip Deposit Bank (Tunai)",
            icon: <DocumentIcon className={iconColor} />,
            link: route('report.custom-report', 'slip_deposit_bank_tunai'),
            iconIndicator: reportIndicator.CSH ? <ExclamationCircleIcon className="w-6 h-6 text-[#FF0000]" /> : <CheckCircleIcon className="w-6 h-6 text-[#10A71C]" />
        },
        // {
        //     label: "Laporan Tamat Hari",
        //     icon: <CalendarDaysIcon className={iconColor} />,
        //     link: route('report.custom-report', 'laporan_tamat_hari'),
        //     //iconCheckOrError
        // },
        // {
        //     label: 'CS09 - S. Bayaran Kod Hasil (Rumusan)',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'cs09'),
        //     //iconCheckOrError
        // },
        {
            label: 'Slip Deposit Bank (Cek)',
            icon: <CheckBadgeIcon className={iconColor} />,
            link: route('report.custom-report', 'slip_deposit_bank_cek'),
            iconIndicator: reportIndicator.Cek ? <ExclamationCircleIcon className="w-6 h-6 text-[#FF0000]" /> : <CheckCircleIcon className="w-6 h-6 text-[#10A71C]" />
        },
        // {
        //     label: 'Laporan Audit Roi',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'laporan_audit_roi'),
        //     //iconCheckOrError
        // },
        // {
        //     label: 'CS10 - S. Audit Bayaran Kaunter',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'cs10'),
        //     //iconCheckOrError
        // },
        {
            label: 'Slip Deposit Bank (CC)',
            icon: <CheckBadgeIcon className={iconColor} />,
            link: route('report.custom-report', 'slip_deposit_bank_cc'),
            iconIndicator: reportIndicator.CC ? <ExclamationCircleIcon className="w-6 h-6 text-[#FF0000]" /> : <CheckCircleIcon className="w-6 h-6 text-[#10A71C]" />
        },
        // {
        //     label: 'Laporan Audit Roi Mengikut Resit',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'laporan_audit_roi_mengikut_resit'),
        //     //iconCheckOrError
        // },
        // {
        //     label: 'CS11 - Butir-butir Pungutan (Maklumat)',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'cs11'),
        //     //iconCheckOrError
        // },
        {
            label: 'Slip Deposit Bank (Wang Pos)',
            icon: <CheckBadgeIcon className={iconColor} />,
            link: route('report.custom-report', 'slip_deposit_bank_pos'),
            iconIndicator: reportIndicator.WangPos ? <ExclamationCircleIcon className="w-6 h-6 text-[#FF0000]" /> : <CheckCircleIcon className="w-6 h-6 text-[#10A71C]" />
        },
        // {
        //     label: 'Laporan Audit Trail',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'laporan_audit_trail'),
        //     //iconCheckOrError
        // },
        // {
        //     label: 'CS12 - Butir-butir Pungutan (Rumusan)',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'cs12'),
        //     //iconCheckOrError
        // },
        {
            label: 'Slip Deposit Bank (EFT)',
            icon: <CheckBadgeIcon className={iconColor} />,
            link: route('report.custom-report', 'slip_deposit_bank_eft'),
            iconIndicator: reportIndicator.EFT ? <ExclamationCircleIcon className="w-6 h-6 text-[#FF0000]" /> : <CheckCircleIcon className="w-6 h-6 text-[#10A71C]" />
        },
        // {
        //     label: 'CS04 - S. Audit Mengikut Jenis Bayaran',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'cs04'),
        //     //iconCheckOrError
        // },
        // {
        //     label: 'CS13 - Senarai Terperinci Bayaran Kaunter',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'cs13'),
        //     //iconCheckOrError
        // },
        {
            label: 'Slip Deposit Bank (Deraf Bank)',
            icon: <CheckBadgeIcon className={iconColor} />,
            link: route('report.custom-report', 'slip_deposit_bank_deraf_bank'),
            iconIndicator: reportIndicator.DerafBank ? <ExclamationCircleIcon className="w-6 h-6 text-[#FF0000]" /> : <CheckCircleIcon className="w-6 h-6 text-[#10A71C]" />
        },
        // {
        //     label: 'CS05 - S. Audit Jenis Bayaran (Rumusan)',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'cs05'),
        //     //iconCheckOrError
        // },
        // {
        //     label: 'CS16 - S. Audit Pemprosesan Pengunjung Hari',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'cs16'),
        //     //iconCheckOrError
        // },
        {
            label: 'Slip Deposit Bank (Slip Bank)',
            icon: <CheckBadgeIcon className={iconColor} />,
            link: route('report.custom-report', 'slip_deposit_bank_slip_bank'),
            iconIndicator: reportIndicator.DerafBank ? <ExclamationCircleIcon className="w-6 h-6 text-[#FF0000]" /> : <CheckCircleIcon className="w-6 h-6 text-[#10A71C]" />
        },
        {
            label: 'Slip Deposit Bank (QR Pay)',
            icon: <CheckBadgeIcon className={iconColor} />,
            link: route('report.custom-report', 'slip_deposit_bank_qr'),
            iconIndicator: reportIndicator.DerafBank ? <ExclamationCircleIcon className="w-6 h-6 text-[#FF0000]" /> : <CheckCircleIcon className="w-6 h-6 text-[#10A71C]" />
        },
        // {
        //     label: 'CS06 - S. Audit Mengikut Jenis Pungutan',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'cs06'),
        //     //iconCheckOrError
        // },
        // {
        //     label: 'CS17 - S. Bayaran Mengikut Nama Pembayar',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'cs17'),
        //     //iconCheckOrError
        // },
        // {
        //     label: 'Senarai Resit Batal',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'senarai_resit_batal'),
        //     //iconCheckOrError
        // },
        // {
        //     label: 'CS07 - S. Audit Jenis Pungutan Sama dengan CS05',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'cs07'),
        //     //iconCheckOrError
        // },
        // {
        //     label: 'Inquiry',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'inquiry'),
        //     //iconCheckOrError
        // },
        // {
        //     label: 'Laporan Edit Resit',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'laporan_edit_resit'),
        //     //iconCheckOrError
        // },
        // {
        //     label: 'CS08 - S. Bayaran Mengikut Kod Hasil',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'cs08'),
        //     //iconCheckOrError
        // },
        // {
        //     label: 'Laporan Wang Apungan',
        //     icon: <CheckBadgeIcon className={iconColor} />,
        //     link: route('report.custom-report', 'report-float-cash'),
        //     //iconCheckOrError
        // },
    ]


    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link href={route('report.index')}>
                    <Typography sx={{display: 'flex', alignItems: 'center'}}>
                        Lihat Semua <ChevronRightIcon className="h-3 w-3" />
                    </Typography>
                </Link>
            </Box>
            <Box sx={{ my: 4, display: "grid", gridTemplateColumns: "repeat(3, minmax(min(200px, 100%), 1fr))", gap: 2 }}>

                {
                    listMenu.map((item, index) => (
                        <Link href={item.link}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: 2
                                }}
                                component={Paper}
                                elevation={3}
                                key={index}
                            >
                                <Box>
                                    <Stack direction="row">
                                        {item.icon}
                                        <Typography variant='p' sx={{ alignSelf: 'center' }}>
                                            {item.label}
                                        </Typography>
                                    </Stack>
                                </Box>
                                <Box>
                                    <Stack direction="row">
                                        {/* <CheckCircleIcon className="h-6 w-6" /> */}
                                        {item.iconIndicator}
                                        <ChevronRightIcon className="h-6 w-6" />
                                    </Stack>
                                </Box>
                            </Box>
                        </Link>
                    ))
                }
            </Box>
        </Box>
    )
}
