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
import dayjs from "dayjs";
import { contentBackgroundStyles } from "@/Utils/constants.jsx";

const client = {
    name: "Wisma Perbadanan Labuan",
    address1: "Peti Surat 81245",
    address2: "87022 Wilayah Persekutuan Labuan",
    address3: "Negeri Sembilan",
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

export default function Preview({ receipt }) {

    const paymentDetails = receipt.grouped ? receipt.groupReceipt[0].payment_detail : receipt.payment_detail;
    const cardHolderName = paymentDetails[0]?.card_holder_name;

    const receiptID = receipt.grouped ? receipt.groupReceipt[0].id : receipt.id;
    const receiptDate = receipt.grouped ? receipt.groupReceipt[0].receipt_date : receipt.receipt_date;
    const formattedDate = dayjs(receiptDate).format('DD/MM/YYYY hh:mm A');
    const receiptNumber = receipt.grouped ? receipt.groupReceipt[0].receipt_number : receipt.receipt_number;

    const juruwang = receipt['juruwang'];
    const counter = receipt['counter'].name;
    const collection_center = receipt['collection_center'].name;

    const accountNumber = receipt.grouped ? receipt.groupReceipt[0].account_number : receipt.account_number;
    console.log('receipt', receipt)
    return (
        <Box sx={contentBackgroundStyles} >
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
                                <Typography sx={styles.stdFont}><b>{client.name}</b></Typography>
                                <Typography sx={styles.stdFont}>{client.address1}</Typography>
                                <Typography sx={styles.stdFont}>{client.address2}</Typography>
                                <Typography sx={styles.stdFont}>{client.address3}</Typography>
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
                                                receipt.grouped ? (
                                                    receipt.groupReceipt.map((item, idx) => (
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
                                                receipt.grouped ? (
                                                    receipt.groupReceipt.map((item, idx) => (
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
                                        <TableCell sx={styles.tableBorder} colSpan={2} height={60}>
                                            {
                                                receipt.grouped ? (
                                                    receipt.groupReceipt.map((item, idx) => (
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
                                                receipt.grouped ? (
                                                    receipt.groupReceipt.map((item, idx) => (
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
                                        <TableCell sx={styles.singleBorderBottom}></TableCell>
                                        <TableCell align="right" sx={styles.singleBorderBottom}><b>Jumlah Besar</b></TableCell>
                                        <TableCell align="right" sx={styles.doubleBorderBottom}>
                                            <b>
                                                {receipt.grouped ? receipt.groupReceipt.map((item, idx) => item.amount).reduce((a, b) => a + b, 0) : receipt.amount}
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
        </Box >
    )
}
