import CustomDateField from '@/Components/ui/field/CustomDateField'
import CustomTextField from '@/Components/ui/field/CustomTextField'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import { Box, LinearProgress, Stack, Typography, Button, FormControl } from '@mui/material'
import React from 'react'
import { DateField } from '@mui/x-date-pickers-pro'
import { Head, useForm, usePage, router } from '@inertiajs/react';
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs';

export const EditReceiveOSP = () => {
  const { auth} = usePage().props
  const { data, setData, post, processing, errors } = useForm({
    collection_center_id: 3,
    cashier_id: auth?.user.id,
    counter_id: 18,
    date: '',
  })

  const handleSubmit = (e) => {
    console.log(data)
    e.preventDefault()
    post(route('osp.end-osp-process'), {
      onSuccess: () => {
        handleClose();
      }
    })
  }

  return (
    <Box>
      <TitleCaptions
        title="Progress"
        extraStyles={{ my: 2 }}
      />
      <Box
        sx={{
          display: "grid",
          gap: 4
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography sx={{ width: 120 }}>Tarikh Resit Dari</Typography>
          <Typography>:</Typography>
          <Box>
              <FormControl>
                  <DateField
                      slotProps={{
                          textField: { size: 'small' },
                          borderRadius: '10px',
                      }}
                      value={dayjs(data.date)}
                      onChange={(newValue) => {
                          setData('date', newValue);
                      }}
                  />
                  {errors.date && <div className="text-red-500 mt-2 text-sm">{errors.date}</div>}
              </FormControl>
          </Box>
        </Stack>
        {/* <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
          <Typography sx={{ width: 120 }}>Rekod</Typography>
          <Typography>:</Typography>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1, mr: 1 }}>
              <LinearProgress variant="determinate" value={70} color="primary" />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                70%
              </Typography>
            </Box>
          </Box>
        </Stack> */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" size="small" disabled={processing} fullWidth onClick={(e) => handleSubmit(e)}>Proses</Button>
        </Stack>
      </Box>
    </Box >
  )
}
