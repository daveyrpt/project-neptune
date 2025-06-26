import TableComponent from '@/Components/ui/tables/TableComponent'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import { Box, FormControl, Modal, Typography, Stack, TextField, Button, FormLabel, InputLabel, Select, MenuItem } from '@mui/material'
import { usePage, useForm, router } from '@inertiajs/react'
import LastEdited from './Component/LastEdited'
import { BoxPaddingX } from './Component/BoxPadding'
import React, { useState, useEffect, useMemo } from 'react'
import { defaultModalStyles } from '@/Utils/constants'
import { useDebounce } from 'react-use'

const CashierLocation = ({ activeTab, setActiveTab }) => {
  const { setting_data, cashiers, collection_centers, counterOptions, most_recently_changed } = usePage().props

  const [search, setSearch] = useState('')

  useDebounce(() => {
    if (!search) return;
    setActiveTab({ ...activeTab, search: search, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })
  },
    500,
    [search]
  );

  const [cashierOptions, setCashierOptions] = useState([]);
  const [cashiersSelected, setCashierSelected] = useState('');

  const [collectionCenterOptions, setCollectionCenterOptions] = useState([]);
  const [collectionCenterSelected, setCollectionCenterSelected] = useState('');

  const [counters, setCounters] = useState([]);

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

  const { data, setData, post, put, processing, errors, reset } = useForm({
    id: '',
    collection_center_id: '',
    counter_id: '',
    user_id: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('system.code-maintenance.receipt.store', {
      type: "default_cashier_location",
    }), {
      onSuccess: () => {
        handleClose();
      }
    });
  }

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    put(route('system.code-maintenance.receipt.update', {
      type: "default_cashier_location",
      id: data.id
    }), {
      onSuccess: () => {
        handleClose();
      }
    });
  }

  const handleSubmitDelete = (e) => {
    e.preventDefault();
    router.delete(route('system.code-maintenance.receipt.destroy', {
      type: "default_cashier_location",
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
      counter_id: row.counter_id,
      user_id: row.user_id,
      collection_center_id: row.collection_center_id
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

  const handleSelectCashier = (e) => {
    const cashierData = cashierOptions.find((cashier) => cashier.id === e.target.value)
    setData({ ...data, user_id: cashierData.id })
    setCashierSelected(cashierData.name)
  }

  const handleSelectCollectionCenter = (e) => {
    const collectionCenterData = collectionCenterOptions.find((collection_center) => collection_center.id === e.target.value)

    setData({ ...data, collection_center_id: e.target.value })

    setCollectionCenterSelected(collectionCenterData.name)
    setCounters(collectionCenterData.counters)
  }

  useEffect(() => {
    if (cashiers) {
      setCashierOptions(cashiers.map((cashier) => ({
        id: cashier.id,
        name: cashier.name,
        staff_id: cashier.staff_id
      })))
    }

    if (collection_centers) {
      setCollectionCenterOptions(collection_centers.map((collection_center) => ({
        id: collection_center.id,
        name: collection_center.name,
        code: collection_center.code,
        counters: collection_center.counters
      })))
    }

  }, [cashiers, collection_centers])


  const cashierMap = useMemo(() => {
    const map = {};
    cashiers?.forEach(cashier => {
      map[cashier.id] = cashier.name;
    });
    return map;
  }, [cashiers]);

  const collectionCenterMap = useMemo(() => {
    const map = {};
    collection_centers?.forEach(cc => {
      map[cc.id] = {
        name: cc.name,
        counters: cc.counters || []
      };
    });
    return map;
  }, [collection_centers]);

  console.log('this',collectionCenterOptions)

  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={defaultModalStyles}>
          <Typography variant="h6" component="h2">
            {editMode ? 'Kemaskini' : 'Tambah'}  Lokasi Juruwang
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography sx={{ width: 100 }}>ID Juruwang</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <Select
                    onChange={handleSelectCashier}
                    size='small'
                    value={data.user_id}
                    fullWidth
                    variant='standard'
                  >
                    <MenuItem value="">Semua</MenuItem>
                    {
                      cashierOptions.map((cashier) => (
                        <MenuItem key={cashier.id} value={cashier.id}>{cashier.staff_id}</MenuItem>
                      ))
                    }
                  </Select>
                  <TextField
                    hiddenLabel
                    value={cashiersSelected}
                    variant="standard"
                    size="small"
                    disabled
                  />
                  {errors.user_id && <div className="text-red-500 mt-2 text-sm">{errors.user_id}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography sx={{ width: 100 }}>Pusat Kutipan</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <Select
                    onChange={handleSelectCollectionCenter}
                    size='small'
                    value={data.collection_center_id}
                    fullWidth
                    variant='standard'
                  >
                    <MenuItem value="">Semua</MenuItem>
                    {
                      collectionCenterOptions.map((collection_center) => (
                        <MenuItem key={collection_center.id} value={collection_center.id}>{collection_center.code}</MenuItem>
                      ))
                    }
                  </Select>
                  <TextField
                    hiddenLabel
                    id="name"
                    name="name"
                    value={collectionCenterSelected}
                    defaultValue=""
                    variant="standard"
                    size="small"
                    disabled
                  />
                  {errors.collection_center_id && <div className="text-red-500 mt-2 text-sm">{errors.collection_center_id}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 100 }}>No. Kaunter</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <Select
                    size='small'
                    value={data.counter_id}
                    onChange={(e) => setData({ ...data, counter_id: e.target.value })}
                    fullWidth
                    variant='standard'
                  >
                    {
                      counters.length === 0 && <MenuItem value="">Tiada</MenuItem>
                    }
                    {
                      counters.map((counter) => (
                        <MenuItem key={counter.id} value={counter.id}>{counter.name}</MenuItem>
                      ))
                    }
                  </Select>
                  {errors.counter_id && <div className="text-red-500 mt-2 text-sm">{errors.counter_id}</div>}
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
          </Typography>
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
            Hapus Lokasi Juruwang?
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
        <TitleCaptions title="Lokasi Juruwang" extraStyles={{ my: 2 }} />
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Pusat Kutipan</InputLabel>
            <Select
              value={activeTab.collection_center_id || ''}
              label="Pusat Kutipan"
              onChange={(e) => setActiveTab({ ...activeTab, collection_center_id: e.target.value, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })}
            >
              <MenuItem value="">Semua</MenuItem>
              {
                collectionCenterOptions.map((item) =>
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                )
              }
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Nombor Kaunter</InputLabel>
            <Select
              value={activeTab.counter_id || ''}
              label="Nombor Kaunter"
              onChange={(e) => setActiveTab({ ...activeTab, counter_id: e.target.value, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })}
            >
              <MenuItem value="">Semua</MenuItem>
              {
                counterOptions.map((item) =>
                  <MenuItem key={item.name} value={item.id}>{item.name}</MenuItem>
                )
              }
            </Select>
          </FormControl>
          <TextField fullWidth label="Carian" variant="outlined" size="small" sx={{ width: '200%' }} value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="contained" size="small" sx={{ borderRadius: 'var(--button-radius)' }} fullWidth
            onClick={() => {
              setActiveTab({...activeTab, search:'', collection_center_id: '', counter_id: '', page: 1 })
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
              label: 'Juruwang',
              name: 'user_id',
              renderCell: (row) => cashierMap[row.user_id] || '—'
            },
            {
              label: 'Pusat Kutipan',
              name: 'collection_center_id',
              renderCell: (row) => collectionCenterMap[row.collection_center_id]?.name || '—'

            },
            {
              label: 'Nombor Kaunter',
              name: 'counter_id',
              renderCell: (row) => {
                const cc = collectionCenterMap[row.collection_center_id];
                const counter = cc?.counters?.find(c => c.id === row.counter_id);
                return counter?.name || '—';
              }

            },
            {
              label: 'Tindakan',
              name: 'action',
              renderCell: (row) => {
                return (
                  <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: '1fr 1fr' }}>
                    <Button variant="contained" size="small" sx={{ textTransform: 'none', mr: 1 }} onClick={() => handleOpenEdit(row)}>Kemaskini</Button>
                    <Button variant="contained" size="small" color='error' sx={{ textTransform: 'none', mr: 1 }}
                      onClick={() => handleOpenDelete(row)}
                    >Hapus</Button>
                  </Box>
                )
              }
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

export default CashierLocation
