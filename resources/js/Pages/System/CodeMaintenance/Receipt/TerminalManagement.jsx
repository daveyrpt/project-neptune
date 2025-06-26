import TitleCaptions from '@/Components/ui/TitleCaptions'
import {
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
  FormControl,
  Stack,
  Select,
  MenuItem,
  Button
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'

const TerminalManagement = ({ activeTab, setActiveTab }) => {
  const { collection_centers, income_codes, setting_terminal_management } = usePage().props

  const [collectionCenterOptions, setCollectionCenterOptions] = useState([])
  const [selectedIncomeCodes, setSelectedIncomeCodes] = useState([])
  console.log('setting_terminal',setting_terminal_management)
  const { data, setData, errors, post } = useForm({
    collection_center_id: '',
    selected_income_codes: []
  })

  useEffect(() => {
    if (collection_centers) {
      setCollectionCenterOptions(collection_centers.map(center => ({
        id: center.id,
        name: center.name,
        counters: center.counters
      })))
    }
  }, [collection_centers])

  useEffect(() => {
    setData('selected_income_codes', selectedIncomeCodes)
  }, [selectedIncomeCodes])

  const handleSelectPusatKutipan = (e) => {
    setData('collection_center_id', e.target.value)
    setActiveTab({
      ...activeTab,
      collection_center_id: e.target.value
    })
  }

  useEffect(() => {
    if (setting_terminal_management) {
      setSelectedIncomeCodes(setting_terminal_management)
    }
  }, [setting_terminal_management])

  console.log(data)

  const handleSelectedIncomeCodes = (e,codeId) => {
    if (e.target.checked) {
      setSelectedIncomeCodes([...selectedIncomeCodes, codeId])
    } else {
      setSelectedIncomeCodes(selectedIncomeCodes.filter(item => item !== codeId))
    }
  }

  const handleSelectAllIncomeCodes = (e) => {
    if (e.target.checked) {
      const allIds = income_codes.map(item => item.id)
      setSelectedIncomeCodes(allIds)
    } else {
      setSelectedIncomeCodes([])
    }
  }

  const handleSubmit = () => {
    post(route('system.code-maintenance.receipt.store', {
      type: "terminal_management",
    }))
  }

  const isAllSelected = selectedIncomeCodes.length === income_codes.length
  // console.log(selectedIncomeCodes)
  return (
    <Box>
      <TitleCaptions title="Kawalan Terimaan" extraStyles={{ my: 2 }} />
      <Stack direction="column" spacing={2}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Typography sx={{ width: 120 }}>Pusat Kutipan</Typography>
            <Typography>:</Typography>
            <Box>
              <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <Select
                  onChange={handleSelectPusatKutipan}
                  size="small"
                  value={data.collection_center_id}
                  fullWidth
                  variant="standard"
                >
                  <MenuItem value="">Semua</MenuItem>
                  {collectionCenterOptions.map(center => (
                    <MenuItem key={center.id} value={center.id}>
                      {center.id}-{center.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.collection_center_id && (
                <div className="text-red-500 mt-2 text-sm">{errors.collection_center_id}</div>
              )}
            </Box>
          </Stack>

          <Stack direction="column">
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <Typography sx={{ width: 120 }}>Status</Typography>
              <Typography>:</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(min(200px, 100%), 1fr))', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAllSelected}
                      onClick={handleSelectAllIncomeCodes}
                      size="small"
                      value="all"
                    />
                  }
                  label="Semua"
                  sx={{ gridColumn: 'span 2' }}
                />
                {income_codes.map(code => (
                  <FormControlLabel
                    key={code.id}
                    control={
                      <Checkbox
                        size="small"
                        checked={selectedIncomeCodes.includes(code.id)}
                        onClick={() => handleSelectedIncomeCodes({ target: { checked: !selectedIncomeCodes.includes(code.id) } }, code.id)}
                        value={code.name}
                      />
                    }
                    label={code.name}
                  />
                ))}
              </Box>
            </Stack>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 10 }}>
            <Button variant="contained" fullWidth onClick={handleSubmit}>Simpan</Button>
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}

export default TerminalManagement
