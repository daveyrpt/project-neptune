import TableComponent from '@/Components/ui/tables/TableComponent'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import { usePage, useForm, router } from '@inertiajs/react'
import { Box, FormControl, MenuItem, InputLabel, Select, Stack, TextField, Button, FormLabel, Modal, Typography, Checkbox } from '@mui/material'
import { DateField } from '@mui/x-date-pickers-pro'
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs'
import React, { useState, useMemo } from 'react'

const MoneyGroup = ({activeTab, setActiveTab}) => {

  const { setting_data, banks, setting_cash_collections, most_recently_changed } = usePage().props
  console.log(setting_data)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [editMode, setEditMode] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleCloseDelete = () => setOpenDelete(false);

  const bankMap = useMemo(() => {
    const map = {};
    banks?.forEach(bank => {
      map[bank.id] = bank.name;
    });
    return map;
  }, [banks]);

  const { data, setData, post, put, processing, errors } = useForm({
    id: '',
    code: '',
    name: '',
    bank_id: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('system.code-maintenance.century-financial.store', {
      type: "cash_collection",
    }), {
      onSuccess: () => {
        handleClose();
      }
    });
  }

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    put(route('system.code-maintenance.century-financial.update', {
      type: "cash_collection",
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
      type: "cash_collection",
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
      bank_id: row.bank_id,

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
            {editMode ? 'Kemaskini' : 'Tambah'} Kumpulan Wang
          </Typography>
          <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 100 }}>Kod Kumpulan Wang</Typography>
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
              <Typography sx={{ width: 100 }}>Kumpulan Wang</Typography>
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
              <Typography sx={{ width: 100 }}>Bank</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <Select
                    size='small'
                    value={data.bank_id}
                    onChange={(e) => setData({ ...data, bank_id: e.target.value })}
                    fullWidth
                  >
                    <MenuItem value="">Semua</MenuItem>
                    {
                      banks.map((item) => {
                        return (
                          <MenuItem key="item.id" value={item.id}>{item.code}-{item.name}</MenuItem>
                        )
                      })
                    }

                  </Select>
                  {errors.bank_id && <div className="text-red-500 mt-2 text-sm">{errors.bank_id}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 100 }}>Default</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <Checkbox
                    size='small'
                  />
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
            Hapus Kumpulan Wang?
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
      <TitleCaptions title="Kumpulan Wang" extraStyles={{ my: 2 }} />
      <Stack direction="row" spacing={2} >
        <FormControl fullWidth size="small">
          <InputLabel>Kod Kumpulan Wang</InputLabel>
          <Select
            value={activeTab.code}
            label="Kod Kumpulan Wang"
            onChange={(e) => setActiveTab({ ...activeTab, code: e.target.value, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })}
          >
            {
              setting_cash_collections.map((item) =>
                <MenuItem key={item.code} value={item.code}>{item.code}</MenuItem>
              )
            }
          </Select>
        </FormControl>
        <FormControl fullWidth size="small">
          <InputLabel>Kumpulan Wang</InputLabel>
          <Select
            value={activeTab.name}
            label="Kumpulan Wang"
            onChange={(e) => setActiveTab({ ...activeTab, name: e.target.value, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })}
          >
            {
              setting_cash_collections.map((item) =>
                <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
              )
            }
          </Select>
        </FormControl>
        {/* <TextField fullWidth id="search" label="Carian" sx={{ width: '200%' }} variant="outlined" size="small" /> */}
        <Button variant="contained" size="small" sx={{ borderRadius: 'var(--button-radius)' }} onClick={() => setActiveTab({...activeTab, code: '', name: '', page: 1 })} fullWidth>Reset</Button>
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
            { id: 'kod_kumpulan_wang', label: 'Kod Kumpulan Wang', name: 'code' },
            { id: 'kumpulan_wang', label: 'Kumpulan Wang', name: 'name' },
            {
              id: 'bank',
              label: 'Bank',
              name: 'bank_id',
              renderCell: (row) => bankMap[row.bank_id] || '—'
            },
            {
              id: 'default',
              label: 'Default',
              name: 'is_default',
            },
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

export default MoneyGroup
