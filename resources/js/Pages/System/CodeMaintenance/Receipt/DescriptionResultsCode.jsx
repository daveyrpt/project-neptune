import TableComponent from '@/Components/ui/tables/TableComponent'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import { Box, InputLabel, Select, MenuItem, FormControl, Modal, Typography, Stack, TextField, Button, FormLabel } from '@mui/material'
import { usePage, useForm } from '@inertiajs/react'
import React, { useState } from 'react'
import MaintenanceSearchBar from "@/Components/MaintenanceSearchBar.jsx";
import LastEdited from './Component/LastEdited'
import { BoxPaddingX } from './Component/BoxPadding'

const DescriptionResultsCode = ({ activeTab, setActiveTab }) => {
  const { setting_data, collection_centers } = usePage().props

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { data, errors, setData, post, processing } = useForm({
    code: '',
    name: '',
    collection_center_id: [],
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    // post(route('system.code-maintenance.receipt.store'), {
    //   onSuccess: () => {
    //     handleClose();
    //   }
    // });
  }

  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          // border: '2px solid #000',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}>
          <Typography variant="h6" component="h2">
            Tambah Keterangan Kod Hasil
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography sx={{ width: 300 }}>Kod Kumpulan Resit</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <TextField
                    hiddenLabel
                    id="code"
                    name="code"
                    onChange={(e) => setData('code', e.target.value)}
                    defaultValue=""
                    variant="filled"
                    size="small"
                  />
                  {errors.code && <div className="text-red-500 mt-2 text-sm">{errors.code}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 300 }}>Kumpulan Resit</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <TextField
                    hiddenLabel
                    id="name"
                    name="name"
                    onChange={(e) => setData('name', e.target.value)}
                    defaultValue=""
                    variant="filled"
                    size="small"
                  />
                  {errors.name && <div className="text-red-500 mt-2 text-sm">{errors.name}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={handleClose}
                sx={{ textTransform: 'none' }}
              >
                Batal
              </Button>
              <Button
                variant="contained"
                size="small"
                fullWidth
                onClick={handleSubmit}
                disabled={processing}
              >
                OK
              </Button>
            </Stack>
          </Typography>
        </Box>
      </Modal>
      <BoxPaddingX>
        <TitleCaptions title="Keterangan Kod Hasil" extraStyles={{ my: 2 }} />
          <MaintenanceSearchBar activeTab={activeTab} setActiveTab={setActiveTab} handleOpen={handleOpen} setting_data={setting_data} />
      </BoxPaddingX>
      <Box sx={{ mt: 2 }}>
        <TableComponent
          columns={[
            {
              label: 'Bil',
              name: 'id'
            },
            {
              label: 'Kod Hasil',
              name: 'code'
            },
            {
              label: 'Keterangan Kod Hasil',
              name: 'description'
            },
            {
              label: 'Tindakan',
              name: 'action',
              renderCell: (row) => {
                return (
                  <Button variant="contained" size="small">
                    Edit
                  </Button>
                )
              }
            }
          ]}
        />
      </Box>
      <LastEdited
        name={setting_data.data[0]?.latest_change?.causer?.name}
        date_created={setting_data.data[0]?.first_change?.created_at}
        date_modified={setting_data.data[0]?.latest_change?.updated_at}
      />
    </Box>
  )
}

export default DescriptionResultsCode
