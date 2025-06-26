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


export default function FilterLaporanAuditTrail({
  filterValues,
  setFilterValues,
}) {
  const { users, reportData, collection_centers, counters } = usePage().props;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={6}>
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
