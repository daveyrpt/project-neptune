import TableComponent from '@/Components/ui/tables/TableComponent';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { contentBackgroundStyles } from '@/Utils/constants';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import {
    Box,
    Typography,
    Stack,
    FormControl,
    MenuItem,
    InputLabel,
    Select,
    Button,
    TextField
} from '@mui/material';
import {
    DatePicker
} from '@mui/x-date-pickers-pro';
import { useState, useMemo, useEffect } from 'react';
import { usePrevious } from 'react-use';
import { pickBy } from 'lodash';
import LaporanWangApungan from './Modals/LaporanWangApungan';
import SlipDepositBankTunai from './Modals/SlipDepositBankTunai';
import SlipDepositDraftBank from './Modals/SlipDepositDrafBank';
import SlipDepositBankCek from './Modals/SlipDepositBankCek';
import SlipDepositBankTunaiEdit from './Edits/SlipDepositBankTunaiEdit';
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs'
import FilterLaporanAuditRol from './FilterButtons/FilterLaporanAuditRol';
import FilterCS04 from './FilterButtons/FilterCS04';
import FilterCS05 from './FilterButtons/FilterCS05';
import FilterCS06 from './FilterButtons/FilterCS06';
import FilterCS07 from './FilterButtons/FilterCS07';
import FilterCS08 from './FilterButtons/FilterCS08';
import FilterCS13 from './FilterButtons/FilterCS13';
import FilterSlipDepositBankTunai from './FilterButtons/FilterSlipDepositBankTunai';
import FilterSlipDepositDraftBank from './FilterButtons/FilterSlipDepositDraftBank';
import FilterSlipDepositBankCek from './FilterButtons/FilterSlipDepositBankCek';
import FilterLaporanEditResit from './FilterButtons/FilterLaporanEditResit';
import FilterSenaraiResitBatal from './FilterButtons/FilterSenaraiResitBatal';
import FilterReportFloatCash from './FilterButtons/FilterReportFloatCash';
import FilterInquiry from './FilterButtons/FilterInquiry';
import FilterLaporanAuditTrail from './FilterButtons/FilterLaporanAuditTrail';
import FilterLaporanTamatHari from './FilterButtons/FilterLaporanTamatHari';

export default function Report() {

    const { auth, currentRoute, reportData, pageTitle, typeReport, collection_centers, counters, users, filterData } = usePage().props;
    
    const permissions = auth.permissions || [];

    const collectionCenterMap = useMemo(() => {
        const map = {};
        collection_centers?.forEach(collection_center => {
            map[collection_center.id] = collection_center.name;
        });
        return map;
    }, [collection_centers]);

    const counterMap = useMemo(() => {
        const map = {};
        counters?.forEach(counter => {
            map[counter.id] = counter.name;
        });
        return map;
    }, [counters]);

    const userMap = useMemo(() => {
        const map = {};
        users?.forEach(user => {
            map[user.id] = user.staff_id + ' - ' + user.name;
        });
        return map;
    }, [users]);


    const defaultSlipDepositBank = [
        {
            label: 'Pusat Kutipan',
            name: 'collection_center_id',
        },
        {
            label: 'No. Kaunter',
            name: 'counter_id',
        },
        {
            label: 'Tarikh Penerimaan',
            name: 'date',
            renderCell: (row) => {
                return (
                    <>
                        {new Date(row.date).toLocaleDateString('en-GB')}
                    </>
                )
            }
        },
        {
            label: 'Amaun(RM)',
            name: 'amount_from_receipt'
        },
        {
            label: 'Tarikh Deposit',
            name: 'deposit_date',
            renderCell: (row) => {
                const date = dayjs(row.deposit_date);
                return (
                <>
                    {date.isValid() ? date.format('DD/MM/YYYY') : '—'}
                </>
                );
            }
        },
        {
            label: 'Tindakan',
            name: 'tindakan',
            renderCell: (row) => {
                return (
                    <>    
                        {typeReport !== 'slip_deposit_bank_tunai' && 
                            <Button variant="contained" size="small" sx={{ textTransform: 'none', mr: 1 }} onClick={() => handleShow(row.id)}>
                                Lihat
                            </Button>
                        }
                        {row.isAllowView && (
                            <Button variant="contained" size="small" sx={{ textTransform: 'none', mr: 1 }} onClick={() => handleShow(row.id)}>
                                Lihat
                            </Button>
                        )}

                        {!row?.isAllowView && row?.isAllowEdit && permissions?.includes('manage report') && (
                            <Button
                                variant="contained"
                                sx={{ textTransform: 'none', mr: 1 }}
                                size="small"
                                onClick={() => handleOpenModalEdit(row)}
                            >
                                Kemaskini
                            </Button>
                        )}
                    </>
                )
            }

        }]

    const defaultCS = [
        {
            label: 'Tarikh Penerimaan',
            name: 'tarikh_penerimaan',
        },
        {
            label: 'Pusat Kutipan',
            name: 'pusat_kutipan',
        },
        {
            label: 'No. Kaunter',
            name: 'no_kaunter',
        },
        {
            label: 'Kod Hasil',
            name: 'kod_hasil',
        },
        {
            label: 'No. Akaun',
            name: 'no_akaun',
        },
        {
            label: 'Rujukan',
            name: 'rujukan',
        },
        {
            label: 'Nombor Resit',
            name: 'nombor_resit',
        },
        {
            label: 'Jenis Bayaran',
            name: 'jenis_bayaran'
        },
        {
            label: 'Kad Kredit/ No. Check',
            name: 'kad_kredit_no_check'
        }
    ]

    const defaultCS2 = [
        {
            label: 'Tarikh Penerimaan',
            name: 'tarikh_penerimaan',
        },
        {
            label: 'Pusat Kutipan',
            name: 'pusat_kutipan',
        },
        {
            label: 'No. Kaunter',
            name: 'no_kaunter',
        },
        {
            label: 'Kod Hasil',
            name: 'kod_hasil',
        },
        {
            label: 'Rujukan',
            name: 'rujukan',
        },
        {
            label: 'Nombor Resit',
            name: 'nombor_resit',
        },
        {
            label: 'Jenis Bayaran',
            name: 'jenis_bayaran'
        },
        {
            label: 'Kad Kredit/ No. Check',
            name: 'kad_kredit_no_check'
        }
    ]

    const inquiry = [
        {
            label: 'Bil',
            name: 'id',
            renderCell: (row) => {
                return (
                    <>
                        {row.id}
                    </>
                )
            }
        },
        {
            label: 'Tarikh Penerimaan',
            name: 'date',
            renderCell: (row) => {
                return (
                    <>
                        {new Date(row.date).toLocaleDateString('en-GB')}
                    </>
                )
            }
        },
        {
            label: 'Pusat Kutipan',
            name: 'collection_center_id',
            renderCell: (row) => collectionCenterMap[row.collection_center_id] || '—',
        },
        {
            label: 'No. Kaunter',
            name: 'counter_id',
            renderCell: (row) => counterMap[row.counter_id] || '—'
        },
        {
            label: 'Kod Hasil',
            name: 'service'
        },
        {
            label: 'Nombor Akaun',
            name: 'account_number'
        },
        {
            label: 'Rujukan',
            name: 'reference_number'
        },
        {
            label: 'Nombor Resit',
            name: 'receipt_number'
        },
        {
            label: 'Jenis Bayaran',
            name: 'payment_type',
            renderCell: (row) => row.payment_type?.description || '—',
        },
        {
            label: 'Keterangan',
            name: 'description',
            renderCell: (row) => {
                return (
                    <>
                        {row.description}
                    </>
                )
            }
        },
        {
            label: 'Amaun (RM)',
            name: 'total_amount',
        }
    ]

    const typeColumns = {
        "slip_deposit_bank_cek": defaultSlipDepositBank,
        "slip_deposit_bank_tunai": [
        {
            label: 'Bil',
            name: 'id',
            renderCell: (row) => {
                return (
                    <>
                        {row.id}
                    </>
                )
            }
        },
        {
            label: 'ID Juruwang',
            name: 'user_id',
            renderCell: (row) => userMap[row.user_id] || '—'
        },
        {
            label: 'Pusat Kutipan',
            name: 'collection_center_id',
        },
        {
            label: 'No. Kaunter',
            name: 'counter_id',
        },
        {
            label: 'Kumpulan Resit',
            name: 'kumpulan_resit',
        },
        {
            label: 'Jenis Bayaran',
            name: 'jenis_bayaran'
        },
        {
            label: 'Amaun(RM)',
            name: 'amount_from_receipt'
        },
        {
            label: 'Tarikh Penerimaan',
            name: 'date',
            renderCell: (row) => {
                return (
                    <>
                        {new Date(row.date).toLocaleDateString('en-GB')}
                    </>
                )
            }
        },
        {
            label: 'No. Slip Bank',
            name: 'slip_number',
            renderCell: (row) => {
                return (
                    <>
                        {row.slip_number || '—'}
                    </>
                )
            }
        },
        {
            label: 'Tindakan',
            name: 'tindakan',
            renderCell: (row) => {
                return (
                    <>
                        {typeReport !== 'slip_deposit_bank_tunai' && 
                            <Button variant="contained" size="small" sx={{ textTransform: 'none', mr: 1 }} onClick={() => handleShow(row.id)}>
                                Lihat
                            </Button>
                        }

                        {row.isAllowView && (
                            <Button variant="contained" size="small" sx={{ textTransform: 'none', mr: 1 }}onClick={() => handleShow(row.id)}>
                                Lihat
                            </Button>
                        )}

                        {!row?.isAllowView &&
                            row?.isAllowEdit &&
                            auth?.user?.role?.name === 'cashier' &&
                            row?.user_id === auth?.user?.id &&
                            permissions?.includes('manage report') && (
                                <Button
                                    variant="contained"
                                    sx={{ textTransform: 'none', mr: 1 }}
                                    size="small"
                                    onClick={() => handleOpenModalEdit(row)}
                                >
                                    Kemaskini
                                </Button>
                            )}

                        {!row?.isAllowView &&
                            row?.isAllowEdit &&
                            auth?.user?.role?.name !== 'cashier' &&
                            permissions?.includes('manage report') && (
                                <Button
                                    variant="contained"
                                    sx={{ textTransform: 'none', mr: 1 }}
                                    size="small"
                                    onClick={() => handleOpenModalEdit(row)}
                                >
                                    Kemaskini
                                </Button>
                            )}
                    </>
                )
            }

        }],
        "slip_deposit_bank_cc": defaultSlipDepositBank,
        "slip_deposit_bank_wang_pos": defaultSlipDepositBank,
        "slip_deposit_bank_eft": defaultSlipDepositBank,
        "slip_deposit_bank_deraf_bank": defaultSlipDepositBank,
        "slip_deposit_bank_bank": defaultSlipDepositBank,
        "slip_deposit_bank_qr": defaultSlipDepositBank,
        "slip_deposit_bank_slip_bank": defaultSlipDepositBank,
        "inquiry": inquiry,

        'senarai_resit_batal': [
            {
                label: 'Bil',
                name: 'id',
                renderCell: (row) => {
                    return (
                        <>
                            {row.id}
                        </>
                    )
                },
            },
            {
                label: 'ID Juruwang',
                name: 'id_juruwang',
                renderCell: (row) => userMap[row.user_id] || '—'
            },
            {
                label: 'Pusat Kutipan',
                name: 'collection_center_id',
                renderCell: (row) => collectionCenterMap[row.collection_center_id] || '—',
            },
            {
                label: 'No. Kaunter',
                name: 'counter_id',
                renderCell: (row) => counterMap[row.counter_id] || '—'
            },
            {
                label: 'Tarikh',
                name: 'date',
                renderCell: (row) => dayjs(row.date).format('DD/MM/YYYY') || '—'
            },
            {
                label: 'No. Resit',
                name: 'receipt_number',
            },
            {
                label: 'No. Resit Ganti',
                name: 'new_receipt_number',
                renderCell: (row) => {
                    return (
                        <>
                            {row.cancelled?.new_receipt_number || '—'}
                        </>
                    )
                },
            },
            {
                label: 'Alasan Batal',
                name: 'alasan',
                renderCell: (row) => {
                    return (
                        <>
                            {row.cancelled?.reason_by_cashier || '—'}
                        </>
                    )
                },
            },
        ],
        'report-float-cash': [
            {
                label: 'Id Juruwang',
                name: 'id_juruwang',
                renderCell: (row) => userMap[row.user_id] || '—'
            },
            {
                label: 'Pusat Kutipan',
                name: 'pusat_kutipan',
                renderCell: (row) => collectionCenterMap[row.collection_center_id] || '—',
            },
            {
                label: 'No. Kaunter',
                name: 'no_kaunter',
                renderCell: (row) => counterMap[row.counter_id] || '—'
            },
            {
                label: 'Jenis',
                name: 'type',
                renderCell: (row) => {
                    return (
                        <>
                            {row.type === 'increment' ? 'Penambahan' : 'Pengurangan'}
                        </>
                    )
                },
            },
            {
                label: 'Tarikh',
                name: 'date_applied',
                renderCell: (row) => dayjs(row.date_applied).format('DD-MM-YYYY')
            },
            {
                label: 'Jumlah',
                name: 'total',
                renderCell: (row) => {
                    return (
                        <>
                            RM {row.total}
                        </>
                    )
                },
            },
        ],
        'cs04': [
            {
                label: 'Bil',
                name: 'id',
                renderCell: (row) => {
                    return (
                        <>
                            {row.id}
                        </>
                    )
                },
            },
            {
                label: 'Jenis Bayaran',
                name: 'payment_type',
                renderCell: (row) => row.payment_type?.description || '—',
            },
            {
                label: 'Kod Hasil',
                name: 'service',
            },
            {
                label: 'Amaun(RM)',
                name: 'total_amount'
            },
            {
                label: 'Bilangan Bil',
                name: 'current_bill',
            },
        ],
        'cs05': [
            {
                label: 'Jenis Bayaran',
                name: 'jenis_bayaran',
                renderCell: (row) => <>{row.jenis_bayaran}</>
            },
            {
                label: 'Amaun (RM)',
                name: 'amount',
                renderCell: (row) => <>{row.amount}</>
            },
           {
                label: 'Transaksi',
                name: 'count',
                renderCell: (row) => <>{row.count}</>
            },
        ],
        'cs06': [
            {
                label: 'Jenis Bayaran',
                name: 'service',
                renderCell: (row) => <>{row.service}</>
            },
           {
                label: 'Resit - Harian',
                name: 'count',
                renderCell: (row) => <>{row.count}</>
            },
            {
                label: 'Amaun - Harian (RM)',
                name: 'amount',
                renderCell: (row) => <>{row.amount}</>
            },
           {
                label: 'Resit - Bulanan',
                name: 'count',
                renderCell: (row) => <>{row.month_count}</>
            },
            {
                label: 'Amaun - Bulanan (RM)',
                name: 'amount',
                renderCell: (row) => <>{row.month_amount}</>
            },
           {
                label: 'Resit - Tahunan',
                name: 'count',
                renderCell: (row) => <>{row.year_count}</>
            },
            {
                label: 'Amaun - Tahunan (RM)',
                name: 'amount',
                renderCell: (row) => <>{row.year_amount}</>
            },
        ],
        'cs07': [
            {
                label: 'Jenis Bayaran',
                name: 'service',
                renderCell: (row) => <>{row.service}</>
            },
           {
                label: 'Resit - Harian',
                name: 'count',
                renderCell: (row) => <>{row.count}</>
            },
            {
                label: 'Amaun - Harian (RM)',
                name: 'amount',
                renderCell: (row) => <>{row.amount}</>
            },
           {
                label: 'Resit - Bulanan',
                name: 'count',
                renderCell: (row) => <>{row.month_count}</>
            },
            {
                label: 'Amaun - Bulanan (RM)',
                name: 'amount',
                renderCell: (row) => <>{row.month_amount}</>
            },
           {
                label: 'Resit - Tahunan',
                name: 'count',
                renderCell: (row) => <>{row.year_count}</>
            },
            {
                label: 'Amaun - Tahunan (RM)',
                name: 'amount',
                renderCell: (row) => <>{row.year_amount}</>
            },

        ],
        "cs08": [
            {
                label: 'Bil',
                name: 'id',
                renderCell: (row) => {
                    return (
                        <>
                            {row.id}
                        </>
                    )
                },
            },
            {
                label: 'Tarikh & Masa',
                name: 'date',
                renderCell: (row) => dayjs(row.date).format('DD-MM-YYYY HH:mm:ss') || '—'
            },
            {
                label: 'ID Juruwang',
                name: 'user_id',
                renderCell: (row) => userMap[row.user_id] || '—'
            },
            {
                label: 'Status',
                name: 'status',
                renderCell: (row) => 'N'
            },
            {
                label: 'Kod Hasil',
                name: 'service',
            },
            {
                label: 'No. Resit',
                name: 'receipt_number',
            },
            {
                label: 'Jenis Bayaran',
                name: 'payment_type',
                renderCell: (row) => row.payment_type?.description || '—',
            },
            {
                label: 'Amaun (RM)',
                name: 'total_amount',
            },
        ],
        "cs09": [
            {
                label: 'Bil',
                name: 'id',
                renderCell: (row) => {
                    return (
                        <>
                            {row.id}
                        </>
                    )
                },
            },
            {
                label: 'Kod Hasil',
                name: 'service',
                renderCell: (row) => <>{row.code}</>
            },
            {
                label: 'Keterangan',
                name: 'service',
                renderCell: (row) => <>{row.jenis_bayaran}</>
            },
            {
                label: 'Amaun (RM)',
                name: 'total_amount',
                renderCell: (row) => <>{row.amount}</>
            },
        ],
        'cs10': [
            {
                label: 'Tarikh',
                name: 'date',
                renderCell: (row) => dayjs(row.date).format('DD/MM/YYYY') || '—'
            },
            {
                label: 'Jenis Bayaran',
                name: 'payment_type',
                renderCell: (row) => row.payment_type?.description || '—'
            },
            {
                label: 'Status',
                name: 'status',
                renderCell: (row) => 'N'
            },
            {
                label: 'No. Akaun',
                name: 'account_number'
            },
            {
                label: 'No. Bil',
                name: 'bill_number',
                renderCell: (row) => row.details[0]?.bill_number || '—'
            },
            {
                label: 'No. Resit',
                name: 'receipt_number'
            },
            {
                label: 'Keterangan',
                name: 'description',
                renderCell: (row) => {
                    return (
                        <>
                            {row.description || 'N/A'}     
                        </>
                    )
                }
            },
            {
                label: 'Amaun (RM)',
                name: 'total_amount'
            },            
        ],
        'cs11': [
            {
                label: 'Bil',
                name: 'id',
                renderCell: (row) => {
                    return (
                        <>
                            {row.id}
                        </>
                    )
                },
            },
            {
                label: 'Tarikh & Masa',
                name: 'date',
                renderCell: (row) => dayjs(row.date).format('DD-MM-YYYY HH:mm:ss') || '—'
            },
            {
                label: 'No. Resit',
                name: 'receipt_number'
            },
            {
                label: 'No. Akaun',
                name: 'account_number'
            },

            {
                label: 'Status',
                name: 'status',
                renderCell: (row) => 'N'
            },
            {
                label: 'Jenis Bayaran',
                name: 'payment_type',
                renderCell: (row) => row.payment_type?.description || '—'
            },
            {
                label: 'Amaun (RM)',
                name: 'total_amount'
            },         
        ],
        'cs12': [
            {
                label: 'Jenis Bayaran',
                name: 'jenis_bayaran',
                renderCell: (row) => <>{row.jenis_bayaran}</>
            },
            {
                label: 'Jumlah Bayaran',
                name: 'amount',
                renderCell: (row) => <>{row.amount}</>
            },
           {
                label: 'Transaksi',
                name: 'count',
                renderCell: (row) => <>{row.count}</>
            },

        ],
        'cs13': [
            {
                label: 'Bil',
                name: 'id',
                renderCell: (row) => {
                    return (
                        <>
                            {row.id}
                        </>
                    )
                },
            },
            {
                label: 'Tarikh & Masa',
                name: 'date',
                renderCell: (row) => dayjs(row.date).format('DD/MM/YYYY HH:mm:ss') || '—'
            },
            {
                label: 'ID Juruwang',
                name: 'user_id',
                renderCell: (row) => userMap[row.user_id] || '—'
            },
            {
                label: 'No. Resit',
                name: 'receipt_number'
            },
            {
                label: 'No. Akaun',
                name: 'account_number'
            },
            {
                label: 'Kod Hasil',
                name: 'service',
                renderCell: (row) => row.income_code?.code || '—'
            },
            {
                label: 'Status',
                name: 'status',
                renderCell: (row) => 'N'
            },
            {
                label: 'Jenis Bayaran',
                name: 'payment_type',
                renderCell: (row) => row.payment_type?.description || '—'
            },
            {
                label: 'Amaun (RM)',
                name: 'total_amount'
            },      
        ],
        'cs16': [
            {
                label: 'Bil',
                name: 'id',
                renderCell: (row) => {
                    return (
                        <>
                            {row.id}
                        </>
                    )
                }
            },
            {
                label: 'Tarikh',
                name: 'date',
                renderCell: (row) => dayjs(row.date).format('DD/MM/YYYY') || '—'
            },
            {
                label: 'ID Juruwang',
                name: 'user_id',
                renderCell: (row) => userMap[row.user_id] || '—'
            },
            {
                label: 'No. Akaun',
                name: 'account_number'
            },
            {
                label: 'No. Resit',
                name: 'receipt_number'
            },          
            {
                label: 'Kod Hasil',
                name: 'service',
                renderCell: (row) => row.income_code?.code || '—'
            },
            {
                label: 'Jenis Bayaran',
                name: 'payment_type',
                renderCell: (row) => row.payment_type?.description || '—'
            },
            {
                label: 'Amaun (RM)',
                name: 'total_amount'
            },           
            // {
            //     label: 'Tindakan',
            //     name: 'tindakan',
            //     renderCell: (row) => {
            //         return (
            //             <>
            //                 <Button
            //                     variant="contained"
            //                     size="small"
            //                     sx={{ textTransform: 'none', mr: 1 }}
            //                     href={route('report.print.cs16', row.id)}>
            //                     Lihat
            //                 </Button>
            //             </>
            //         )
            //     },
            // }, 
        ],
        'cs17': [
            {
                label: 'Tarikh',
                name: 'date',
                renderCell: (row) => dayjs(row.date).format('DD/MM/YYYY') || '—'
            },
            {
                label: 'Jenis Bayaran',
                name: 'payment_type',
                renderCell: (row) => row.payment_type?.description || '—'
            },
            {
                label: 'Kod Hasil',
                name: 'service',
                renderCell: (row) => row.income_code?.code || '—'
            },
            {
                label: 'Pusat Kutipan',
                name: 'pusat_kutipan',
                renderCell: (row) => collectionCenterMap[row.collection_center_id] || '—',
            },
            {
                label: 'No. Akaun',
                name: 'account_number'
            },
            {
                label: 'Nama Pembayar',
                name: 'customer_name',
            },
            {
                label: 'Amaun (RM)',
                name: 'total_amount'
            },   
            {
                label: 'Tindakan',
                name: 'tindakan',
                renderCell: (row) => {
                    return (
                        <>
                            <Button
                                variant="contained"
                                size="small"
                                sx={{ textTransform: 'none', mr: 1 }}
                                href={route('report.print.cs17', {customer : row.customer_name, filterValues})}>
                                Lihat
                            </Button>
                        </>
                    )
                },
            },
        ],

        'laporan_audit_trail': [
            {
                label: 'Tarikh',
                name: 'created_at',
                renderCell: (row) => {
                    return (
                        <>
                            {new Date(row.created_at).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false
                            })}
                        </>
                    );
                }
            },
            {
                label: 'Pengguna',
                name: 'causer_id',
                renderCell: (row) => userMap[row.causer_id] || '—'
            },
            {
                label: 'Aktiviti Pengguna',
                name: 'log_name',
                renderCell: (row) => {
                    switch (row.log_name) {
                        case 'login':
                            return 'Log Masuk';
                        case 'logout':
                            return 'Log Keluar';
                        default:
                            return row.log_name;
                    }
                }
            },
        ],
        'laporan_tamat_hari': [
            // {
            //     label: 'Bil',
            //     name: 'id',
            //     renderCell: (row) => {
            //         return (
            //             <>
            //                 {row.id}
            //             </>
            //         )
            //     },
            // },
            // {
            //     label: 'ID Juruwang',
            //     name: 'id_juruwang',
            //     renderCell: (row) => userMap[row.user_id] || '—'
            // },
            // {
            //     label: 'Pusat Kutipan',
            //     name: 'collection_center_id',
            //     renderCell: (row) => collectionCenterMap[row.collection_center_id] || '—',
            // },
            // {
            //     label: 'No. Kaunter',
            //     name: 'counter_id',
            //     renderCell: (row) => counterMap[row.counter_id] || '—'
            // },
            // {
            //     label: 'Tarikh Penerimaan',
            //     name: 'closed_at',
            //     renderCell: (row) => dayjs(row.closed_at).format('DD-MM-YYYY') || '—'
            // },

            // {
            //     label: 'Tindakan',
            //     name: 'tindakan',
            //     renderCell: (row) => {
            //         return (
            //             <>
            //                 <Button variant="contained" size="small" sx={{ textTransform: 'none', mr: 1 }}>Lihat</Button>
            //             </>
            //         )
            //     },
            // },
            {
                label: 'Jenis Bayaran',
                name: 'jenis_bayaran',
                renderCell: (row) => <>{row.jenis_bayaran}</>
            },
           {
                label: 'Bilangan',
                name: 'count',
                renderCell: (row) => <>{row.count}</>
            },
            {
                label: 'Amaun (RM)',
                name: 'amount',
                renderCell: (row) => <>{row.amount}</>
            },
        ],

        'laporan_edit_resit': [
            {
                label: 'Bil',
                name: 'id',
                renderCell: (row) => {
                    return (
                        <>
                            {row.id}
                        </>
                    )
                },
            },
            {
                label: 'Pusat Kutipan',
                name: 'collection_center_id',
                renderCell: (row) => collectionCenterMap[row.collection_center_id] || '—',
            },
            {
                label: 'No. Kaunter',
                name: 'counter_id',
                renderCell: (row) => counterMap[row.counter_id] || '—'
            },
            {
                label: 'Tarikh',
                name: 'tarikh',
                renderCell: (row) => dayjs(row.receipt_date).format('DD/MM/YYYY') || '—'
            },
            {
                label: 'No. Resit',
                name: 'receipt_number',
            },
            {
                label: 'Keterangan Kemaskini',
                name: 'edit_description',
                renderCell: (row) => {
                    return (
                        <>
                            {row.edit_description || '—'}
                        </>
                    )
                },
            },
            {
                label: 'Dikemaskini Oleh',
                name: 'edit_description',
                renderCell: (row) => row?.latest_change?.causer?.name || '—'
            },
        ],
        'laporan_audit_roi': [

            {
                label: 'ID Juruwang',
                name: 'id_juruwang',
                renderCell: (row) => userMap[row.user_id] || '—'
            },
            {
                label: 'Pusat Kutipan',
                name: 'collection_center_id',
                renderCell: (row) => collectionCenterMap[row.collection_center_id] || '—',
            },
            {
                label: 'No. Kaunter',
                name: 'counter_id',
                renderCell: (row) => counterMap[row.counter_id] || '—'
            },
            {
                label: 'Masa',
                name: 'date',
                renderCell: (row) => dayjs(row.date).format('DD-MM-YYYY HH:mm:ss') || '—'
            },
            {
                label: 'No. Akaun',
                name: 'account_number',
            },
            {
                label: 'No. Resit',
                name: 'receipt_number',
            },
            {
                label: 'Bilangan Bil',
                name: 'current_bill',
            },
            {
                label: 'Amaun Penerimaan (RM)',
                name: 'total_amount',
            },
        ],
        'laporan_audit_roi_mengikut_resit': [
            {
                label: 'Bil',
                name: 'id',
                renderCell: (row) => {
                    return (
                        <>
                            {row.id}
                        </>
                    )
                },
            },
            {
                label: 'ID Juruwang',
                name: 'id_juruwang',
                renderCell: (row) => userMap[row.user_id] || '—'
            },
            {
                label: 'Pusat Kutipan',
                name: 'collection_center_id',
                renderCell: (row) => collectionCenterMap[row.collection_center_id] || '—',
            },
            {
                label: 'No. Kaunter',
                name: 'counter_id',
                renderCell: (row) => counterMap[row.counter_id] || '—'
            },
            {
                label: 'Masa',
                name: 'date',
                renderCell: (row) => dayjs(row.date).format('DD-MM-YYYY HH:mm:ss') || '—'
            },
            // {
            //     label: 'Bilangan Bil',
            //     name: 'current_bill',
            // },
            {
                label: 'No. Akaun',
                name: 'account_number',
            },
            {
                label: 'No. Resit',
                name: 'receipt_number',
            },
            {
                label: 'No. Cek',
                name: 'id',
                 renderCell: (row) => {
                    return (
                        <>
                            N/A
                        </>
                    )
                },
            },
            {
                label: 'Amaun (RM)',
                name: 'total_amount',
            },
        ],
   

    }

    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);

    const handleOpenModal = () => {
        reset();
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    }

    const handleOpenModalEdit = (row) => {
        reset()
        setData(
            {
                id: row.id,
                collection_center_id: row.collection_center_id,
                counter_id: row.counter_id,
                date: row.date,
                payment_type: row.payment_type,
                deposit_date: row.deposit_date,
                slip_number: row.slip_number,
                receipt_collection: row.receipt_collection,
                report_type: row.report_type,
            }
        )

        setOpenModalEdit(true);
    }

    const handleCloseModalEdit = () => {
        setOpenModalEdit(false);
    }

    const { data, setData, post, put, processing, errors, reset } = useForm({

    })


    const handleSubmitReport = () => {
        // post(route('float-cash.store'))
    }

    const handleSubmitReportEdit = (e) => {
        e.preventDefault();
        put(route('report.update', {
            id: data.id
        }), {
            onSuccess: () => {
                handleCloseModalEdit();
            }
        });
    }

    const handleReset = () => {
        setFilterValues({
            id: '',
            collection_center_id: '',
            counter_id: '',
            date: '',
            payment_type: '',
            deposit_date: '',
            slip_number: '',
            receipt_collection: '',
            report_type: '',
            user_id: '',
            income_code: '',
            start_date: '',
            end_date: '',
            'filter[income_code]': [],
            'filter[income_code_id]': [],
            'filter[payment_type]': []
        })
    }

    const handlePrint = () => {
        switch (typeReport) {
            case 'laporan_audit_trail':
                window.open(route('report.print.audit-trail',{...filterValues}), '_blank');
                break;
            case 'cs04':
            case 'cs05':
            case 'cs06':
            case 'cs07':
            case 'cs08':
            case 'cs09':
            case 'cs10':
            case 'cs11':
            case 'cs12':
            case 'cs13':
            case 'cs16':
            case 'cs17':
                window.open(route('report.print-default', { type: typeReport, filterValues: filterValues }), '_blank');
                break;
            case 'senarai_resit_batal':
            case 'inquiry':
            case 'report-float-cash':
                window.open(route('report.print-default', { type: typeReport }), '_blank');
                break;
            case 'laporan_edit_resit':
            case 'laporan_tamat_hari':
                window.open(route('report.print-default', { type: typeReport, filterValues: filterValues}), '_blank');
                break;
            case 'laporan_audit_roi':
                window.open(route('report.print-default', { type: typeReport, filterValues: filterValues}), '_blank');
                break;
            case 'laporan_audit_roi_mengikut_resit':
                
                window.open(route('report.print-default', { type: typeReport, filterValues: filterValues}), '_blank');
                // window.open(route('report.print-default', { type: typeReport, filterValues: filterValues}), '_blank');
                break;
            default:
                window.open(route('report.print.bank-deposit-slip', {...filterValues, type: typeReport }), '_blank');
        }
    };

    const handleShow = (row) => {
        window.open(route('report.show', { bankDepositSlip: row }), '_blank');
    }

    const modalComponents = {
        'report-float-cash': <LaporanWangApungan
            open={openModal}
            setOpenModal={setOpenModal}
            handleOpenModal={handleOpenModal}
            handleCloseModal={handleCloseModal}
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            handleSubmitReport={handleSubmitReport}
        />,
        'slip_deposit_bank_tunai': <SlipDepositBankTunai
            open={openModal}
            setOpenModal={setOpenModal}
            handleOpenModal={handleOpenModal}
            handleCloseModal={handleCloseModal}
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            handleSubmitReport={handleSubmitReport}
        />,
        'slip_deposit_bank_deraf_bank': <SlipDepositDraftBank
            open={openModal}
            setOpenModal={setOpenModal}
            handleOpenModal={handleOpenModal}
            handleCloseModal={handleCloseModal}
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            handleSubmitReport={handleSubmitReport}
        />,
        'slip_deposit_bank_cek': <SlipDepositBankCek
            open={openModal}
            setOpenModal={setOpenModal}
            handleOpenModal={handleOpenModal}
            handleCloseModal={handleCloseModal}
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            handleSubmitReport={handleSubmitReport}
        />,
    }

    const editComponents = {
        'slip_deposit_bank_tunai': <SlipDepositBankTunaiEdit
            open={openModalEdit}
            setOpenModal={setOpenModalEdit}
            handleOpenModal={handleOpenModalEdit}
            handleCloseModal={handleCloseModalEdit}
            data={data}
            setData={setData}
            errors={errors}
            processing={processing}
            handleSubmitReport={handleSubmitReportEdit}
        />
    }

    const [filterValues, setFilterValues] = useState({
        page: filterData?.page ?? 1,
        'filter[search]': filterData?.filter['search'] ?? '',
        'filter[collection_center_id]': filterData?.filter['collection_center_id'] ?? '',
        'filter[counter_id]': filterData?.filter['counter_id'] ?? '',
        'filter[user_id]': filterData?.filter['user_id'] ?? '',
        'filter[income_code]': filterData?.filter['income_code'] ?? [],
        'filter[income_code_id]': filterData?.filter['income_code_id'] ?? [],
        'filter[payment_type]': filterData?.filter['payment_type'] ?? [],
        'filter[floating_type]': '',
        start_date: filterData?.start_date ?? '',
        end_date: filterData?.end_date ?? '',
    });

    const prevValues = usePrevious(filterValues);

    useEffect(() => {
        if (!prevValues || JSON.stringify(prevValues) === JSON.stringify(filterValues)) return;

        const query = Object.keys(pickBy(filterValues)).length ? pickBy(filterValues) : {};

        router.get(route(route().current(), typeReport), query, {
            replace: true,
            preserveState: true
        });
    }, [filterValues]);

    const filterButtonComponents = {
        'slip_deposit_bank_tunai': <FilterSlipDepositBankTunai filterValues={filterValues} setFilterValues={setFilterValues} />,
        'slip_deposit_bank_cek': <FilterSlipDepositBankCek filterValues={filterValues} setFilterValues={setFilterValues} />,
        'slip_deposit_bank_cc': <FilterSlipDepositBankCek filterValues={filterValues} setFilterValues={setFilterValues} />,
        'slip_deposit_bank_wang_pos': <FilterSlipDepositBankCek filterValues={filterValues} setFilterValues={setFilterValues} />,
        'slip_deposit_bank_eft': <FilterSlipDepositBankCek filterValues={filterValues} setFilterValues={setFilterValues} />,
        'slip_deposit_bank_deraf_bank': <FilterSlipDepositBankCek filterValues={filterValues} setFilterValues={setFilterValues} />,
        // 'slip_deposit_bank_deraf_bank': <FilterSlipDepositDraftBank filterValues={filterValues} setFilterValues={setFilterValues} />,
        'slip_deposit_bank_slip_bank': <FilterSlipDepositBankCek filterValues={filterValues} setFilterValues={setFilterValues} />,
        'slip_deposit_bank_qr': <FilterSlipDepositBankCek filterValues={filterValues} setFilterValues={setFilterValues} />,
        'laporan_audit_roi': <FilterLaporanAuditRol filterValues={filterValues} setFilterValues={setFilterValues} />,
        'laporan_audit_roi_mengikut_resit': <FilterLaporanAuditRol filterValues={filterValues} setFilterValues={setFilterValues} />,
        'cs04': <FilterCS04 filterValues={filterValues} setFilterValues={setFilterValues} />,
        'cs05': <FilterCS05 filterValues={filterValues} setFilterValues={setFilterValues} />,
        'cs06': <FilterCS06 filterValues={filterValues} setFilterValues={setFilterValues} />,
        'cs07': <FilterCS06 filterValues={filterValues} setFilterValues={setFilterValues} />,
        'cs08': <FilterCS08 filterValues={filterValues} setFilterValues={setFilterValues} />,
        'cs09': <FilterCS08 filterValues={filterValues} setFilterValues={setFilterValues} />,
        'cs10': <FilterLaporanEditResit filterValues={filterValues} setFilterValues={setFilterValues} />,
        'cs11': <FilterLaporanEditResit filterValues={filterValues} setFilterValues={setFilterValues} />,
        'cs12': <FilterSlipDepositBankTunai filterValues={filterValues} setFilterValues={setFilterValues} />,
        'cs13': <FilterCS13 filterValues={filterValues} setFilterValues={setFilterValues} />,
        'cs16': <FilterLaporanEditResit filterValues={filterValues} setFilterValues={setFilterValues} />,
        'cs17': <FilterCS04 filterValues={filterValues} setFilterValues={setFilterValues} />,
        'inquiry': <FilterInquiry filterValues={filterValues} setFilterValues={setFilterValues}/>,
        'laporan_edit_resit': <FilterLaporanEditResit filterValues={filterValues} setFilterValues={setFilterValues} />,
        'senarai_resit_batal':<FilterSenaraiResitBatal filterValues={filterValues} setFilterValues={setFilterValues} />,
        'report-float-cash': <FilterReportFloatCash filterValues={filterValues} setFilterValues={setFilterValues} handleReset={handleReset}/>,
        'laporan_tamat_hari': <FilterLaporanTamatHari filterValues={filterValues} setFilterValues={setFilterValues} />,
        'laporan_audit_trail': <FilterLaporanAuditTrail filterValues={filterValues} setFilterValues={setFilterValues} />,
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            currentRoute={currentRoute}
        >
            {modalComponents[typeReport]}
            {editComponents[typeReport]}
            <Head title={pageTitle} />
            <Box sx={contentBackgroundStyles}>
                <Typography component="h3" variant="headerTitle" sx={{ mb: 2 }}>
                    {pageTitle}
                </Typography>
                <Stack direction="row" spacing={2}>
                    {filterButtonComponents[typeReport]}
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    {/* <TextField fullWidth id="search" label="Carian" variant="outlined" size="small"
                        onChange={(e) => setFilterValues({ ...filterValues, 'filter[search]': e.target.value, page: reportData.current_page !== 1 ? 1 : reportData.current_page })}
                    /> */}

                    <Button variant="contained" size="small" fullWidth onClick={handleReset}>Set Semula</Button>
                    <Button variant="contained" size="small" fullWidth onClick={handlePrint}>Muat Turun</Button>
                    {/* <Button variant="contained" size="small" fullWidth>Cetak</Button> */}
                    {/* <Button variant="contained" size="small" fullWidth onClick={handleOpenModal}>Laporan</Button> */}
                </Stack>
                <Box sx={{ mt: 2 }}>
                    <TableComponent
                        columns={typeColumns[typeReport]}
                        rows={reportData}
                        filterValues={filterValues}
                        setFilterValues={setFilterValues}
                    />
                </Box>
                <Button href={route('report.index')} variant="outlined" size="small" fullWidth>Kembali</Button>
            </Box>
        </AuthenticatedLayout>
    );
}
