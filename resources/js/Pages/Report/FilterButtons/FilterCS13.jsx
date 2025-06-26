import React from 'react'
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Button,
} from '@mui/material'
import { usePage } from '@inertiajs/react';
import { DatePicker } from '@mui/x-date-pickers-pro';

export default function FilterInquiry({
    filterValues,
    setFilterValues,
    handleReset,
}) {
    const { reportData, collection_centers, counters, payment_type, income_codes } = usePage().props;
    
    return (
        <>
            {/* <Box sx={{ display: 'flex', gap: 2 }}> */}
                <FormControl fullWidth size="small">
                    <InputLabel>Pusat Kutipan</InputLabel>
                    <Select
                        value={filterValues['filter[collection_center_id]']}
                        label="No. Kaunter"
                        onChange={(e) => setFilterValues({ ...filterValues, 'filter[collection_center_id]': e.target.value, page: reportData.current_page !== 1 ? 1 : reportData.current_page })}
                    >
                        <MenuItem value="">Semua</MenuItem>
                        {
                            collection_centers.map((item, index) => (
                                <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                    <InputLabel>No. Kaunter</InputLabel>
                    <Select
                        value={filterValues['filter[counter_id]']}
                        label="No. Kaunter"
                        onChange={(e) => setFilterValues({ ...filterValues, 'filter[counter_id]': e.target.value, page: reportData.current_page !== 1 ? 1 : reportData.current_page })}
                    >
                        <MenuItem value="">Semua</MenuItem>
                        {
                            counters.map((item, index) => (
                                <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                    <InputLabel>Kod Hasil</InputLabel>
                    <Select
                        value={filterValues['filter[income_code]']}
                        label="Kod Hasil"
                        onChange={(e) => setFilterValues({ ...filterValues, 'filter[income_code]': e.target.value, page: reportData.current_page !== 1 ? 1 : reportData.current_page })}
                    >
                        <MenuItem value="">Semua</MenuItem>
                        {
                            income_codes.map((item, index) => (
                                <MenuItem key={index} value={item.name}>{item.description}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <DatePicker
                        slotProps={{
                            textField: { size: "small" },
                            borderRadius: "10px",
                        }}
                        // sx={{ width: 300 }}
                        onChange={(value) =>
                            setFilterValues({
                                ...filterValues,
                                start_date: value.format("DD-MM-YYYY"),
                            })
                        }
                    />
                </FormControl>
                <Box sx={{ display: "flex", alignItems: "center" }}>-</Box>
                <FormControl fullWidth size="small">
                    <DatePicker
                        slotProps={{
                            textField: { size: "small" },
                            borderRadius: "10px",
                        }}
                        // sx={{ width: 500 }}
                        onChange={(value) =>
                            setFilterValues({
                                ...filterValues,
                                end_date: value.format("DD-MM-YYYY"),
                                page:
                                    reportData.current_page !== 1
                                        ? 1
                                        : reportData.current_page,
                            })
                        }
                    />
                </FormControl>
                {/* <Button variant="contained" size="small" fullWidth onClick={handleReset}>Set Semula</Button> */}
            {/* </Box> */}
        </>
    )
}
