import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    Box,
    Typography,
    TableContainer,
    TableRow,
    Table,
    TableCell,
    TableBody,
    Button,
} from "@mui/material";
import { contentBackgroundStyles } from "@/Utils/constants.jsx";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
const client = {
    title: "PERBADANAN LABUAN",
    name: "Wisma Perbadanan Labuan",
    address1: "Peti Surat 81245",
    address2: "87022 Wilayah Persekutuan Labuan",
    phone: "087 408600, 408601",
    fax: "087 428997, 419400, 426803",
    web: "www.pl.gov.my",
    mail: "webmaster@pl.gov.my"
};

const styles = {
    smallFont: { fontSize: '10px' },
    stdFont: { fontSize: '11px' },
    bigFont: { fontSize: '18px' },
    tableBorder: {
        border: '1px solid black',
        padding: '3px',
        fontSize: '10px'
    },
    section: {
        marginBottom: '40px'
    },
    printHeader: {
        fontWeight: 'bold',
        fontSize: '14px',
        textAlign: 'center',
        marginBottom: '10px'
    },
    doubleBorderBottom: {
        borderBottom: '3px double black'
    },
    singleBorderBottom: {
        borderBottom: '1px solid black'
    }
};

function convertSenToWords(amount) {

    const ones = [
        '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima',
        'Enam', 'Tujuh', 'Lapan', 'Sembilan', 'Sepuluh',
        'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas',
        'Lima Belas', 'Enam Belas', 'Tujuh Belas',
        'Lapan Belas', 'Sembilan Belas'
    ];

    const tens = [
        '', '', 'Dua Puluh', 'Tiga Puluh', 'Empat Puluh',
        'Lima Puluh', 'Enam Puluh', 'Tujuh Puluh',
        'Lapan Puluh', 'Sembilan Puluh'
    ];

    const decimal = Math.round((amount - Math.floor(amount)) * 100);

    if (decimal === 0) return '';
    if (decimal < 20) return ones[decimal].toUpperCase() + ' SEN';

    const tensDigit = Math.floor(decimal / 10);
    const onesDigit = decimal % 10;

    let words = tens[tensDigit];
    if (onesDigit > 0) {
        words += ' ' + ones[onesDigit];
    }

    return words.toUpperCase() + ' SEN';
}


function convertIntegerToWords(amount) {
    amount = Math.floor(amount);
    if (amount === 0) return '';

    const ones = [
        '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima',
        'Enam', 'Tujuh', 'Lapan', 'Sembilan', 'Sepuluh',
        'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas',
        'Lima Belas', 'Enam Belas', 'Tujuh Belas',
        'Lapan Belas', 'Sembilan Belas'
    ];

    const tens = [
        '', '', 'Dua Puluh', 'Tiga Puluh', 'Empat Puluh',
        'Lima Puluh', 'Enam Puluh', 'Tujuh Puluh',
        'Lapan Puluh', 'Sembilan Puluh'
    ];

    const magnitudes = ['', 'Ribu', 'Juta', 'Bilion', 'Trilion'];

    let words = '';
    let i = 0;

    while (amount > 0) {
        const chunk = amount % 1000;
        if (chunk > 0) {
            let chunkWords = '';

            const hundreds = Math.floor(chunk / 100);
            const remainder = chunk % 100;

            if (hundreds > 0) {
                chunkWords += ones[hundreds] + ' Ratus ';
            }

            if (remainder > 0) {
                if (remainder < 20) {
                    chunkWords += ones[remainder] + ' ';
                } else {
                    const tensDigit = Math.floor(remainder / 10);
                    const onesDigit = remainder % 10;

                    chunkWords += tens[tensDigit] + ' ';
                    if (onesDigit > 0) {
                        chunkWords += ones[onesDigit] + ' ';
                    }
                }
            }

            words = chunkWords + magnitudes[i] + ' ' + words;
        }

        amount = Math.floor(amount / 1000);
        i++;
    }

    return words.toUpperCase().replace(/\s+/g, ' ').trim() + " RINGGIT";
}



export default function Print({ auth, currentRoute, grouped, receipt, juruwang, counter, collection_center }) {
// console.log('receiptddafa', receipt)
    const paymentDetails = grouped ? receipt[0].payment_detail : receipt.payment_detail;
    const cardHolderName = paymentDetails[0]?.card_holder_name;

    const receiptID = grouped ? receipt[0].id : receipt.id;
    const receiptDate = grouped ? receipt[0].receipt_date : receipt.receipt_date;
    const formattedDate = dayjs(receiptDate).format('DD/MM/YYYY hh:mm A');
    const receiptNumber = grouped ? receipt[0].receipt_number : receipt.receipt_number;

    const accountNumber = grouped ? receipt[0].account_number : receipt.account_number;
    const [totalAmount, setTotalAmount] = useState(0)

    useEffect(()=>{

        if(grouped) setTotalAmount(parseFloat(receipt.map((item, idx) => item.amount).reduce((a, b) => +a + +b).toFixed(2)))
        else setTotalAmount(parseFloat(receipt.amount))

    },[])

    return (
        <AuthenticatedLayout user={auth.user} currentRoute={currentRoute}>
            <Box>
                <Head title="Print" />
                <Box sx={contentBackgroundStyles}>
                    <Box sx={{
                        px: 4, py: 2,
                        width: '210mm',
                        minHeight: '297mm',
                        padding: '20mm',
                        backgroundColor: 'white',
                        color: 'black',
                        boxSizing: 'border-box',
                        margin: 'auto',
                        border: '1px solid black'
                    }}>
                        {["ASAL", "PENDUA"].map((label, idx) => (
                            <Box key={idx} sx={styles.section}>
                                <Box display="flex" justifyContent="space-between">
                                    <Box width="30%" textAlign="center">
                                        <img src="/images/Labuan.jpg" alt="Logo" width={100} />
                                    </Box>
                                    <Box width="55%">
                                        <Typography sx={styles.stdFont}><b>{client.title}</b></Typography>
                                        <Typography sx={styles.stdFont}>{client.name}</Typography>
                                        <Typography sx={styles.stdFont}>{client.address1}</Typography>
                                        <Typography sx={styles.stdFont}>{client.address2}</Typography>
                                        <Typography sx={styles.stdFont}>Tel : {client.phone} &nbsp;&nbsp;&nbsp; Fax : {client.fax}</Typography>
                                        <Typography sx={styles.stdFont}>Laman Web : {client.web} &nbsp;&nbsp;&nbsp; E-mail : {client.mail}</Typography>
                                    </Box>
                                    <Box width="15%" textAlign="right">
                                        <Typography><b>{label}</b></Typography>
                                    </Box>
                                </Box>

                                <Box mt={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography sx={styles.stdFont}><b>Juruwang :{juruwang} ({counter}) {collection_center}</b></Typography>
                                        <Typography sx={styles.stdFont}><b>Tarikh :{formattedDate}</b></Typography>
                                    </Box>
                                    <Box>
                                        <Typography sx={styles.stdFont}><b>{receiptNumber}</b></Typography>
                                    </Box>
                                </Box>

                                <TableContainer sx={{ mt: 2 }}>
                                    <Table size="small">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell colSpan={3} align="center" sx={styles.tableBorder}><b>RESIT RASMI</b></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={styles.tableBorder} width="44%"><b>PEMBAYAR</b></TableCell>
                                                <TableCell sx={styles.tableBorder} width="38%"><b>MAKLUMAT PEMBAYARAN</b></TableCell>
                                                <TableCell sx={styles.tableBorder} width="12%"></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={styles.tableBorder} height={45}>
                                                    {cardHolderName}<br />
                                                    No.Akaun : {accountNumber}
                                                </TableCell>
                                                <TableCell sx={styles.tableBorder}>
                                                    Jenis Bayaran : {receipt.payment_type}<br />
                                                    {
                                                        grouped ? (
                                                            receipt.map((item, idx) => (
                                                                <div key={idx}>
                                                                    No. Rujukan : {item.reference_number}<br />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div>
                                                                No. Rujukan : {receipt.reference_number}<br />
                                                            </div>
                                                        )
                                                    }
                                                </TableCell>
                                                <TableCell sx={styles.tableBorder}>
                                                    {
                                                        grouped ? (
                                                            receipt.map((item, idx) => (
                                                                <div key={idx}>
                                                                    Kod :{item.income_code || item.service}<br />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div>
                                                                Kod :{receipt.income_code || receipt.service}<br />
                                                            </div>
                                                        )
                                                    }
                                                    {/* Kod :{receipt.details[0]?.income_code || receipt.service} */}

                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={styles.tableBorder} colSpan={2}><b>PERKARA</b></TableCell>
                                                <TableCell sx={styles.tableBorder}><b>RM</b></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={styles.tableBorder} style={{wordWrap: 'break-word', wordBreak: 'break-all'}} colSpan={2} height={60}>
                                                    {
                                                        grouped ? (
                                                            receipt.map((item, idx) => (
                                                                <div key={idx}>
                                                                    {item.description}<br />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div>
                                                                {receipt.description}<br />
                                                            </div>
                                                        )
                                                    }
                                                </TableCell>
                                                <TableCell sx={styles.tableBorder}>
                                                    {
                                                        grouped ? (
                                                            receipt.map((item, idx) => (
                                                                <div key={idx}>
                                                                    {item.amount}<br />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div>
                                                                {receipt.amount}<br />
                                                            </div>
                                                        )
                                                    }
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={2}>&nbsp;</TableCell>
                                                <TableCell>&nbsp;</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={styles.singleBorderBottom}>{`${convertIntegerToWords(totalAmount)} ${convertSenToWords(totalAmount)} SAHAJA`}</TableCell>
                                                <TableCell align="right" sx={styles.singleBorderBottom}><b>Jumlah Besar</b></TableCell>
                                                <TableCell align="right" sx={styles.doubleBorderBottom}>
                                                    {/* salah display ni */}
                                                    {/* <b>
                                                        {grouped ? receipt[receipt.length - 1].amount_to_be_paid : receipt.amount_to_be_paid}
                                                    </b> */}
                                                    <b>
                                                        {grouped ? receipt.map((item, idx) => item.amount).reduce((a, b) => +a + +b).toFixed(2) : receipt.amount}
                                                    </b>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={3} sx={{ fontSize: '10px' }}><i>Resit ini tidak memerlukan tandatangan kerana dicetak oleh komputer.</i></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {
                                    label === "ASAL" && (
                                        <Box my={2}>
                                            <Typography align="center" sx={styles.smallFont}>
                                                ....................................................................................................................................Potong di sini....................................................................................................................................
                                            </Typography>
                                        </Box>
                                    )
                                }
                            </Box>
                        ))}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button fullWidth variant="outlined" onClick={() => window.history.back()}>Kembali</Button>
                            <Button fullWidth variant="contained" onClick={() => window.open(route('receipt.print-receipt', { id: receiptID }))}>Cetak</Button>
                        </Box>
                    </Box>

                </Box>
            </Box>
        </AuthenticatedLayout>
    );
}
