import CustomTextField from '@/Components/ui/field/CustomTextField'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import { Box,  Stack,Button } from '@mui/material'
import React from 'react'

const ExportDataToOffline = () => {
  return (
    <Box>
      <TitleCaptions
        title="Export Data ke Offline"
        captions="Proses Ini Dilakukan sekiranya data gagal disalin secara automatik."
      />
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2,mt:5 }}>
        <CustomTextField
          id="proses_date"
          label="Tarikh Proses"
          name="proses_date"
          value="11/11/2023"
        />
        <CustomTextField
          id="progress"
          label="Progress"
          name="progress"
          value=""
        />
      </Box>
      <Stack direction="row" spacing={2} sx={{ mt: 20 }}>
        <Button variant="outlined" fullWidth>Batal</Button>
        <Button variant="contained" fullWidth>Ok</Button>
      </Stack>
    </Box>
  )
}

export default ExportDataToOffline
