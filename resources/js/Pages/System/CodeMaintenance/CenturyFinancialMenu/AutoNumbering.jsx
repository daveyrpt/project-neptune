import TableComponent from '@/Components/ui/tables/TableComponent'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import { usePage, useForm, router } from '@inertiajs/react'
import { Box, FormControl, MenuItem, InputLabel, Select, Stack, TextField, Button, FormLabel, Modal, Typography } from '@mui/material'
import { DateField } from '@mui/x-date-pickers-pro'
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const AutoNumbering = ({ activeTab, setActiveTab }) => {

  const { setting_data, setting_cash_collections, setting_auto_numberings, most_recently_changed } = usePage().props


  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [editMode, setEditMode] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleCloseDelete = () => setOpenDelete(false);

  const { data, setData, post, put, processing, errors } = useForm({
    id: '',
    code: '',
    name: '',
    setting_cash_collection_id: '',
    prefix: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('system.code-maintenance.century-financial.store', {
      type: "auto_numbering",
    }), {
      onSuccess: () => {
        handleClose();
      }
    });
  }

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    put(route('system.code-maintenance.century-financial.update', {
      type: "auto_numbering",
      id: data.id
    }), {
      onSuccess: () => {
        handleClose();
      }
    });
  }

  const handleSubmitDelete = (e) => {
    e.preventDefault();
    router.delete(route('system.code-maintenance.century-financial.destroy', {
      type: "auto_numbering",
      id: data.id
    }), {
      onSuccess: () => {
        handleCloseDelete();
      }
    });
  }

  const handleOpenEdit = (row) => {
    setData({
      id: row.id,
      code: row.code,
      name: row.name,
      setting_cash_collection_id: row.setting_cash_collection_id,
      prefix: row.prefix
    });

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
            {editMode ? 'Kemaskini' : 'Tambah'} Auto Penomboran
          </Typography>
          <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 100 }}>Jenis</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <TextField
                    size='small'
                    value={data.code}
                    onChange={(e) => setData({ ...data, code: e.target.value })}
                    fullWidth
                  />
                  {errors.code && <div className="text-red-500 mt-2 text-sm">{errors.code}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 100 }}>No</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <TextField
                    size='small'
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    fullWidth
                  />
                  {errors.name && <div className="text-red-500 mt-2 text-sm">{errors.name}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 100 }}>Kumpulan Wang</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <Select
                    size='small'
                    value={data.setting_cash_collection_id}
                    onChange={(e) => setData({ ...data, setting_cash_collection_id: e.target.value })}
                    fullWidth
                  >
                    <MenuItem value="">Semua</MenuItem>
                    {
                      setting_cash_collections.map((item) => {
                        return (
                          <MenuItem key="item.id" value={item.id}>{item.code}-{item.name}</MenuItem>
                        )
                      })
                    }
                  </Select>
                  {errors.setting_cash_collection_id && <div className="text-red-500 mt-2 text-sm">{errors.setting_cash_collection_id}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 100 }}>Prefix</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <TextField
                    size='small'
                    value={data.prefix}
                    onChange={(e) => setData({ ...data, prefix: e.target.value })}
                    fullWidth
                  />
                  {errors.prefix && <div className="text-red-500 mt-2 text-sm">{errors.prefix}</div>}
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
            Hapus Auto Penomboran?
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
      <TitleCaptions title="Auto Penomboran" extraStyles={{ my: 2 }} />
      <Stack direction="row" spacing={2} >
        <FormControl fullWidth size="small">
          <InputLabel>Jenis</InputLabel>
          <Select
            value={activeTab.code}
            label="Jenis"
            onChange={(e) => setActiveTab({ ...activeTab, code: e.target.value })}
          >
            {
              setting_auto_numberings.map((item) => {
                return (
                  <MenuItem key="item.id" value={item.code}>{item.code}</MenuItem>
                )
              })
            }
          </Select>
        </FormControl>
        <FormControl fullWidth size="small">
          <InputLabel>Kumpulan Wang</InputLabel>
          <Select
            value={activeTab.setting_cash_collection_id}
            label="Kumpulan Wang"
            onChange={(e) => setActiveTab({ ...activeTab, setting_cash_collection_id: e.target.value, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })}
          >
            {
              setting_cash_collections.map((item) => {
                return (
                  <MenuItem key="item.id" value={item.id}>{item.id}</MenuItem>
                )
              })
            }
          </Select>
        </FormControl>
        {/* <TextField fullWidth id="search" label="Carian" variant="outlined" sx={{ width: '200%' }} size="small" /> */}
        <Button variant="contained" size="small" sx={{ borderRadius: 'var(--button-radius)' }} onClick={() => setActiveTab({...activeTab, code: '', name: '', page: setting_data.current_page !== 1 ? 1 : setting_data.current_page }) } fullWidth>Reset</Button>
        <Button variant="contained" size="small" sx={{ borderRadius: 'var(--button-radius)' }} fullWidth onClick={handleOpen}>Tambah</Button>
      </Stack>
      <Box sx={{ mt: 2 }}>
        <TableComponent
          columns={[
            {
              id: 'bil',
              label: 'Bil',
              renderCell: (row) => (
                <>
                  {row.id}
                </>
              )
            },
            { id: 'jenis', label: 'Jenis', name: 'code' },
            { id: 'no', label: 'No', name: 'name' },
            { id: 'kumpulan_wang', label: 'Kumpulan Wang', name: 'setting_cash_collection_id' },
            { id: 'prefix', label: 'Prefix', name: 'prefix' },
            {
              id: 'tindakan',
              label: 'Tindakan',
              renderCell: (row) => (
                <>
                  <Button variant="contained" size="small" sx={{ textTransform: 'none', mr: 1 }} onClick={() => handleOpenEdit(row)}>Kemaskini</Button>
                  <Button variant="contained" size="small" color='error' sx={{ textTransform: 'none', mr: 1 }} onClick={() => handleOpenDelete(row)}>Hapus</Button>
                </>
              )
            },
          ]}
          rows={setting_data}
          filterValues={activeTab}
          setFilterValues={setActiveTab}
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <TitleCaptions title="Dikemaskini Oleh" extraStyles={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          <FormControl sx={{ flexDirection: 'row' }}>
            <FormLabel
              sx={{ display: 'flex', alignItems: 'center', marginRight: 2, width: 150 }}
              id="demo-row-radio-buttons-group-label"
            >
              Dihasilkan:
            </FormLabel>
            <DateField
              defaultValue={dayjs(setting_data.data[0]?.first_change?.created_at)}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
              disabled
            />
          </FormControl>
          <FormControl sx={{ flexDirection: 'row' }}>
            <FormLabel
              sx={{ display: 'flex', alignItems: 'center', marginRight: 2, width: 150 }}
              id="demo-row-radio-buttons-group-label"
            >
              Oleh:
            </FormLabel>
            <TextField
              hiddenLabel
              id="filled-hidden-label-small"
              value={setting_data.data[most_recently_changed]?.latest_change?.causer?.name}
              placeholder="Kosongkan jika ada"
              variant="filled"
              size="small"
            />
          </FormControl>
          <FormControl sx={{ flexDirection: 'row' }}>
            <FormLabel
              sx={{ display: 'flex', alignItems: 'center', marginRight: 2, width: 150 }}
              id="demo-row-radio-buttons-group-label"
            >
              Diubah:
            </FormLabel>
            <DateField
              defaultValue={dayjs(setting_data.data[0]?.latest_change?.created_at)}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
              disabled
            />
          </FormControl>
        </Box>
      </Box>
    </Box>
  )
}

export default AutoNumbering
