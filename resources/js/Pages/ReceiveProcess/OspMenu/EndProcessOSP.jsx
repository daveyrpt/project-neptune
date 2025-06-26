import CustomDateField from '@/Components/ui/field/CustomDateField'
import CustomTextField from '@/Components/ui/field/CustomTextField'
import TableComponent from '@/Components/ui/tables/TableComponent'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import { useForm, usePage } from '@inertiajs/react'
import { Box, Button, Stack, Typography, Select, MenuItem } from '@mui/material'
import React from 'react'
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs';

export const EndProcessOSP = () => {

  const { auth, collection_centers, cashiers, counters, total_amount} = usePage().props


  const { data, setData, post } = useForm({
    collection_center_id: 3,
    cashier_id: auth?.user.id,
    counter_id: 18,
    date: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('osp.end-osp-process'), {
      onSuccess: () => {
        handleClose();
      }
    });
  }

  return (
    <Box>
      <TitleCaptions
        title="Tamat Proses OSP"
        extraStyles={{ my: 2 }}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: 'repeat(2, minmax(min(200px, 100%), 1fr))',
          gap: 4
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ gridColumn: 'span 2' }}>
          <Typography sx={{ width: 120 }}>ID Juruwang</Typography>
          <Typography>:</Typography>
          <Select
            hiddenLabel
            value={data.cashier_id}
            onChange={(e) => setData('cashier_id', e.target.value)}
            label="Pusat Kutipan"
            size="small"
            disabled
          >
            {cashiers.map((cashier) => (
              <MenuItem key={cashier.id} value={cashier.id}>
                {cashier.id} - {cashier.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ gridColumn: 'span 2' }}>
          <Typography sx={{ width: 120 }}>Pusat Kutipan</Typography>
          <Typography>:</Typography>
          <Select
            hiddenLabel
            value={data.collection_center_id}
            onChange={(e) => setData('collection_center_id', e.target.value)}
            label="Pusat Kutipan"
            size="small"
            disabled
          >
            {collection_centers.map((center) => (
              <MenuItem key={center.id} value={center.id}>
                {center.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography sx={{ width: 120 }}>Nombor Kaunter</Typography>
          <Typography>:</Typography>
          <Select
            hiddenLabel
            value={data.counter_id}
            onChange={(e) => setData('counter_id', e.target.value)}
            label="Pusat Kutipan"
            size="small"
            disabled
          >
            {counters.map((center) => (
              <MenuItem key={center.id} value={center.id}>
                {center.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        <CustomDateField
          label="Tarikh Kutipan"
          value={dayjs(data.date)}
          onChange={(e) => setData('date', e)}
        />
        <CustomTextField
          label="Baki Juruwang(RM)"
          value={total_amount.toFixed(2)}
          extraStyle={{ gridColumn: 'span 2' }}
        />
      </Box>
      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button variant="outlined" size="small" fullWidth>Batal</Button>
        <Button variant="contained" size="small" fullWidth onClick={handleSubmit}>OK</Button>
      </Stack>
    </Box>
  )
}
