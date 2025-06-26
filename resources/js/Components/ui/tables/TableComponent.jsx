import React from 'react'
import {
    TableContainer,
    TableRow,
    Table,
    TableHead,
    TableCell,
    TableBody,
    Pagination,
    Typography,
    Paper,
    Box,
} from '@mui/material'
import get from 'lodash/get';

const TableComponent = ({ columns = [], rows = [], filterValues, setFilterValues }) => {
    const handleChangePage = (event, newPage) => {
        setFilterValues({
            ...filterValues,
            page: newPage
        });
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{ backgroundColor: 'primary.main' }}>
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableCell
                                    key={column.label}
                                    sx={{
                                        color: 'white',
                                        textAlign: index === columns.length - 1 ? 'center' : 'left', // Align last column to the right
                                        paddingLeft: index === columns.length - 1 ? '0' : '10',
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows && rows?.data?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    Tiada Data
                                </TableCell>
                            </TableRow>
                        )}
                        {rows?.data?.map((row, rowIndex) => (
                            <TableRow key={rowIndex} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                {columns.map((column, colIndex) => {
                                    if (column.label === 'Bil') {
                                        return (<TableCell
                                            key={column.label}
                                            align={colIndex === columns.length - 1 ? 'center' : column.align} // Align last column to the right
                                        >
                                            {rows?.from + rowIndex}
                                        </TableCell>)
                                    } else {
                                        return (<TableCell
                                            key={column.label}
                                            align={colIndex === columns.length - 1 ? 'center' : column.align} // Align last column to the right
                                        >
                                            {column.renderCell ? column.renderCell(row, rowIndex) : get(row, column.name) ?? 'N/A'}
                                        </TableCell>)
                                    }
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="p">
                    {/* Add meta data here */}
                    {
                        rows?.total == 0 ?
                            null :
                            `Paparan ${rows?.from} hingga ${rows?.to} daripada ${rows?.total} entri`
                    }
                </Typography>
                <Pagination
                    sx={{ mt: 2 }}
                    shape="rounded"
                    count={rows?.last_page}
                    page={rows?.current_page}
                    onChange={handleChangePage}
                />
            </Box>
        </>
    )
}

export default TableComponent
