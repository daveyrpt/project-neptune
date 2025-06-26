import React from 'react'
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Button,
    Grid,
} from '@mui/material'
import { usePage } from '@inertiajs/react';
import { DatePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';

export default function FilterSenaraiResitBatal({
    filterValues,
    setFilterValues,
    handleReset,
}) {
    const { reportData, collection_centers, counters } = usePage().props;

    return (
        <Grid container spacing={2}>
            {/* <Box sx={{ display: 'flex', gap: 2 }}> */}
            <Grid item xs={3} sm={6} md={2}>
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
            </Grid>
            <Grid item xs={3} sm={6} md={2}>
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
            </Grid>
            <Grid item xs={3} sm={6} md={2}>
                <FormControl fullWidth size="small">
                    <InputLabel>Jenis</InputLabel>
                    <Select
                        value={filterValues['filter[floating_type]']}
                        label="Jenis"
                        onChange={(e) => setFilterValues({ ...filterValues, 'filter[floating_type]': e.target.value, page: reportData.current_page !== 1 ? 1 : reportData.current_page })}
                    >
                        <MenuItem value="">Semua</MenuItem>
                        <MenuItem key='1' value='increment'>Penambahan</MenuItem>
                        <MenuItem key='2' value='decrement'>Pengurangan</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={3} sm={6} md={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FormControl fullWidth size="small">
                        <DatePicker
                            slotProps={{
                                textField: { size: "small" },
                                borderRadius: "10px",
                            }}
                            // sx={{ width: 300 }}
                            value={dayjs(filterValues.start_date, "DD-MM-YYYY")}
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
                            value={dayjs(filterValues.end_date, "DD-MM-YYYY")}
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
                </Box>
            </Grid>
            {/* <Button variant="contained" size="small" fullWidth onClick={handleReset}>Set Semula</Button> */}
            {/* </Box> */}
        </Grid>
    )
}
