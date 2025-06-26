import React from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
} from '@mui/material'
import { usePage } from '@inertiajs/react';
import { DatePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';

export default function FilterCS04({
  filterValues,
  setFilterValues,
}) {
  const { users, reportData, collection_centers, counters, payment_type } = usePage().props;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
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
      <Grid item xs={12} sm={6} md={3}>
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
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel>Jenis Bayaran</InputLabel>
          <Select
            value={filterValues['filter[payment_type]']}
            label="Jenis Bayaran"
            onChange={(e) => setFilterValues({ ...filterValues, 'filter[payment_type]': e.target.value, page: reportData.current_page !== 1 ? 1 : reportData.current_page })}
          >
            <MenuItem value="">Semua</MenuItem>
            {
              payment_type.map((item, index) => (
                <MenuItem key={index} value={item.name}>{item.description}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <DatePicker
            slotProps={{
              textField: { size: "small" },
              borderRadius: "10px",
            }}
            value={dayjs(filterValues.start_date, "DD-MM-YYYY")}
            onChange={(value) =>
              setFilterValues({
                ...filterValues,
                start_date: value.format("DD-MM-YYYY"),
              })
            }
          />
          <Box sx={{ display: "flex", alignItems: "center" }}>-</Box>
          <DatePicker
            slotProps={{
              textField: { size: "small" },
              borderRadius: "10px",
            }}
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
        </Box>
      </Grid>
    </Grid>
  )
}
