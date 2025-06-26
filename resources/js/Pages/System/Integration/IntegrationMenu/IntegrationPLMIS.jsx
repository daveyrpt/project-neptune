import CustomTabPanel from '@/Components/CustomTabPanel'
import { Box, Tabs, Tab, Button,Stack } from '@mui/material'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import CustomTextField from '@/Components/ui/field/CustomTextField'
import React from 'react'

const IntegrationPLMIS = () => {
  const [tabs, setTabs] = React.useState(0)
  const handleTabsChange = (event, newValue) => {
    setTabs(newValue)
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', my: 2 }}>
        <Tabs value={tabs} onChange={handleTabsChange} aria-label="basic tabs example" variant="fullWidth">
          <Tab label="Kaunter" sx={{ fontSize: '13px' }} />
          <Tab label="Export Paytran" sx={{ fontSize: '13px' }} />
        </Tabs>
      </Box>
      <Box>
        <CustomTabPanel value={tabs} index={0}>
          <TitleCaptions
            title="Semakan Paytran"
            captions="Semakan Data Integrasi Paytran"
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2,mt:5 }}>
            <CustomTextField
              id="date"
              label="Tarikh"
              name="date"
              value="11/11/2023"
            />
            <CustomTextField
              id="paytran"
              label="Progress"
              name="paytran"
              value="113222 rekod"
            />
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={tabs} index={1}>
          <TitleCaptions
            title="Export Paytran"
            captions="Export Data Integrasi Paytran"
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2,mt:5 }}>
            <CustomTextField
              id="date"
              label="Tarikh"
              name="date"
              value="11/11/2023"
            />
            <CustomTextField
              id="paytran"
              label="Progress"
              name="paytran"
              value=""
            />
          </Box>
          <Stack direction="row" spacing={2} sx={{ mt: 20 }}>
            <Button variant="outlined" fullWidth>Batal</Button>
            <Button variant="contained" fullWidth>Ok</Button>
          </Stack>
        </CustomTabPanel>
      </Box>

    </Box>
  )
}

export default IntegrationPLMIS
