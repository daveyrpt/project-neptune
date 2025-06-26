import React from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material'
import { usePage } from '@inertiajs/react';
import { DatePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';

export default function FilterCS06({
  filterValues,
  setFilterValues,
}) {
  const { users, reportData,collection_centers, counters } = usePage().props;

  return (
    <>
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
      <DatePicker
        slotProps={{
          textField: { size: "small" },
          borderRadius: "10px",
        }}
        sx={{ width: 500 }}
        value={dayjs(filterValues.receipt_date, "DD-MM-YYYY")}
        onChange={(value) =>
          setFilterValues({
            ...filterValues,
            receipt_date: value.format("DD-MM-YYYY"),
          })
        }
      />
    </>
  )
}
