import {
    Typography,
    TextField,
    TableContainer,
    TableRow,
    Table,
    TableHead,
    TableCell,
    TableBody,
    Paper,
} from '@mui/material';
import {useMemo} from 'react';

const MoneyTable = ({title, denominations, quantities, setQuantities, setData}) => {
    const handleQuantityChange = (value, denomination) => {
        const numericValue = value.replace(/\D/g, '');

        setQuantities((prev) => ({
            ...prev,
            [denomination]: numericValue,
        }));

        // Laravel requires keys like 'RM100' or 'RM0.50'
        setData(prev => ({
            ...prev,
            [typeof denomination === 'number' ? `RM${denomination}` : denomination]: numericValue,
        }));
    };

    const nilaiPerRow = useMemo(() => {
        const rows = {};
        denominations.forEach((denomination) => {
            const qty = parseInt(quantities[denomination] || '0', 10);
            rows[denomination] = denomination * qty;
        });
        return rows;
    }, [quantities, denominations]);

    const totalNilai = useMemo(() => {
        return Object.values(nilaiPerRow).reduce((sum, val) => sum + val, 0);
    }, [nilaiPerRow]);

    return (
        <>
            <Typography variant='body2' sx={{
                marginLeft: '1rem',
                marginY: '2rem',
                fontWeight: 'bold',
                color: '#004269',
                fontSize: '18px'
            }}>
                {title}
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{backgroundColor: 'primary.main'}}>
                        <TableRow>
                            <TableCell sx={{color: 'white'}} align='center'>Nilai (RM)</TableCell>
                            <TableCell sx={{color: 'white'}} align='center'>Kuantiti</TableCell>
                            <TableCell sx={{color: 'white'}} align='center'>Jumlah (RM)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {denominations.map((denom) => (
                            <TableRow sx={{backgroundColor: '#e5f5ff'}} key={denom}>
                                <TableCell sx={{borderBottom:'1px solid #ccc'}} align='center'>{denom?.toFixed(2)}</TableCell>
                                <TableCell sx={{borderBottom:'1px solid #ccc'}} align='center'>
                                    <TextField
                                        sx={{
                                            backgroundColor: '#ffff', textAlign: 'center',
                                            input: {
                                                textAlign: 'center',
                                            },
                                        }}
                                        size="small"
                                        value={quantities[denom]}
                                        onChange={(e) => handleQuantityChange(e.target.value, denom)}
                                    />
                                </TableCell>
                                <TableCell sx={{borderBottom:'1px solid #ccc'}} align='center'>
                                    {nilaiPerRow[denom]?.toFixed(2) || '0.00'}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow sx={{backgroundColor: '#e5f5ff'}}>
                            <TableCell colSpan={2} sx={{fontWeight: 'bold', textAlign: 'right'}}>
                                Total
                            </TableCell>
                            <TableCell sx={{fontWeight: 'bold', textAlign: 'center'}}>
                                {totalNilai.toFixed(2)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default MoneyTable
