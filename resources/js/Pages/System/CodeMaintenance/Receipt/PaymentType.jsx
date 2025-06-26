import TableComponent from '@/Components/ui/tables/TableComponent'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import { Box, FormControl, Modal, Typography, Stack, TextField, Button, InputLabel, MenuItem, Select } from '@mui/material'
import { usePage, useForm, router } from '@inertiajs/react'
import LastEdited from './Component/LastEdited'
import { BoxPaddingX } from './Component/BoxPadding'
import React, { useState } from 'react'
import MaintenanceSearchBar from "@/Components/MaintenanceSearchBar.jsx";
import { defaultModalStyles } from '@/Utils/constants'
import { useDebounce } from 'react-use'


const PaymentType = ({ activeTab, setActiveTab }) => {
  const { setting_data, payment_types, most_recently_changed } = usePage().props

  // console.log('payment_types', payment_types)

  const [search, setSearch] = useState('')

  useDebounce(() => {
    if (!search) return;
    setActiveTab({ ...activeTab, search: search, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })
  },
    500,
    [search]
  );

  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    reset();
    setEditMode(false);
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const [editMode, setEditMode] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleCloseDelete = () => setOpenDelete(false);

  const handleOpenEdit = (row) => {
    setData({
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      destination: row.destination
    })

    setEditMode(true);
    setOpen(true);
  }

  const handleOpenDelete = (row) => {
    setData({
      id: row.id,
      code: row.code,
      name: row.name,
    });
    setOpenDelete(true);
  }

  const { data, errors, setData, post, put, processing, reset } = useForm({
    id: '',
    code: '',
    name: '',
    description: '',
    destination: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('system.code-maintenance.receipt.store', {
      type: "payment_type",
    }), {
      onSuccess: () => {
        handleClose();
      }
    });
  }

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    put(route('system.code-maintenance.receipt.update', {
      type: "payment_type",
      id: data.id
    }), {
      onSuccess: () => {
        setEditMode(false);
        reset();
        handleClose();
      }
    });
  }

  const handleSubmitDelete = (e) => {
    e.preventDefault();
    router.delete(route('system.code-maintenance.receipt.destroy', {
      type: "payment_type",
      id: data.id
    }), {
      onSuccess: () => {
        reset();
        handleCloseDelete();
      }
    });
  }

  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={defaultModalStyles}>
          <Typography variant="h6" component="h2">
            {editMode ? 'Kemaskini' : 'Tambah'} Jenis Bayaran
          </Typography>
          <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 200 }}>Jenis Bayaran</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <TextField
                    hiddenLabel
                    name="code"
                    onChange={(e) => setData('code', e.target.value)}
                    value={data.code}
                    variant="standard"
                    size="small"
                  />
                  {errors.code && <div className="text-red-500 mt-2 text-sm">{errors.code}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 200 }}>Keterangan</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <TextField
                    hiddenLabel
                    name="name"
                    onChange={(e) => setData('name', e.target.value)}
                    value={data.name}
                    variant="standard"
                    size="small"
                  />
                  {errors.name && <div className="text-red-500 mt-2 text-sm">{errors.name}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 200 }}>Jenis Bayaran CF</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <TextField
                    hiddenLabel
                    name="description"
                    onChange={(e) => setData('description', e.target.value)}
                    value={data.description}
                    variant="standard"
                    size="small"
                  />
                  {errors.description && <div className="text-red-500 mt-2 text-sm">{errors.description}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 200 }}>Destinasi Penghantaran</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <Select
                    name="destination"
                    onChange={(e) => setData('destination', e.target.value)}
                    value={data.destination}
                    size="small"
                    fullWidth
                    variant='standard'
                  >
                    <MenuItem value="CB">CB</MenuItem>
                  </Select>
                  {errors.destination && <div className="text-red-500 mt-2 text-sm">{errors.destination}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 200 }}>Jenis Antaramuka</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <Select
                    onChange={(e) => setData('interface_type', e.target.value)}
                    value={data.interface_type}
                    size="small"
                    fullWidth
                    variant='standard'
                  >
                    <MenuItem value="1">1</MenuItem>
                  </Select>
                  {errors.interface_type && <div className="text-red-500 mt-2 text-sm">{errors.interface_type}</div>}
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
                onClick={editMode ? handleSubmitEdit : handleSubmit}
                disabled={processing}
              >
                OK
              </Button>
            </Stack>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
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
            Hapus Jenis Bayaran?
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Tindakan ini tidak boleh dikembalikan
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={handleCloseDelete}
              sx={{ textTransform: 'none' }}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              size="small"
              color="error"
              fullWidth
              onClick={handleSubmitDelete}
              disabled={processing}
            >
              OK
            </Button>
          </Stack>
        </Box>
      </Modal>
      <BoxPaddingX>
        <TitleCaptions title="Jenis Bayaran" extraStyles={{ my: 2 }} />
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Jenis Bayaran</InputLabel>
            <Select
              value={activeTab.code || ''}
              label="Jenis Bayaran"
              onChange={(e) => setActiveTab({ ...activeTab, code: e.target.value, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })}
            >
              <MenuItem value="">Semua</MenuItem>
              {
                payment_types.map((item) =>
                  <MenuItem key={item.code} value={item.code}>{item.code}</MenuItem>
                )
              }
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Keterangan</InputLabel>
            <Select
              value={activeTab.description || ''}
              label="Nombor Kaunter"
              onChange={(e) => setActiveTab({ ...activeTab, description: e.target.value, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })}
            >
              <MenuItem value="">Semua</MenuItem>
              {
                payment_types.map((item) =>
                  <MenuItem key={item.id} value={item.description}>{item.description}</MenuItem>
                )
              }
            </Select>
          </FormControl>
          <TextField fullWidth label="Carian" variant="outlined" size="small" sx={{ width: '200%' }} value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="contained" size="small" sx={{ borderRadius: 'var(--button-radius)' }} fullWidth
            onClick={() => {
              setActiveTab({...activeTab,search:'', code: '', description: '', page: 1 })
              setSearch('')
            }}
          >Reset</Button>
          <Button
            sx={{ borderRadius: 'var(--button-radius)' }}
            onClick={handleOpen}
            variant="contained"
            size="small"
            fullWidth
          >
            Tambah
          </Button>
        </Stack>
      </BoxPaddingX>
      <Box sx={{ mt: 2 }}>
        <TableComponent
          columns={[
            {
              label: 'Bil',
              name: 'id'
            },
            {
              label: 'Jenis Bayaran',
              name: 'code'
            },
            {
              label: 'Keterangan',
              name: 'name'
            },
            {
              label: 'Jenis Bayaran CF',
              name: 'description'
            },
            {
              label: 'Destinasi Penghantaran',
              name: 'destination'
            },
            {
              label: 'Jenis Antaramuka',
              name: 'destination'
            },
            {
              label: 'Tindakan',
              name: 'action',
              renderCell: (row) => (
                <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: '1fr 1fr'}}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ textTransform: 'none', mr: 1 }}
                    onClick={() => handleOpenEdit(row)}
                  >
                    Kemaskini
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color='error'
                    sx={{ textTransform: 'none', mr: 1 }}
                    onClick={() => handleOpenDelete(row)}
                  >
                    Hapus
                  </Button>
                </Box>
              )
            }
          ]}
          rows={setting_data}
          filterValues={activeTab}
          setFilterValues={setActiveTab}
        />
      </Box>
      <LastEdited
        name={setting_data.data[most_recently_changed]?.latest_change?.causer?.name}
        date_created={setting_data.data[0]?.first_change?.created_at}
        date_modified={setting_data.data[0]?.latest_change?.updated_at}
      />
    </Box>
  )
}

export default PaymentType
