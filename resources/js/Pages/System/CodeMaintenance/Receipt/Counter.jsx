import TableComponent from '@/Components/ui/tables/TableComponent'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import { Box, FormControl, Modal, Typography, Stack, TextField, Button, FormLabel, InputLabel, Select, MenuItem } from '@mui/material'
import { usePage, useForm, router } from '@inertiajs/react'
import LastEdited from './Component/LastEdited'
import { BoxPaddingX } from './Component/BoxPadding'
import React, { useState, useEffect, useMemo } from 'react'
import { defaultModalStyles } from '@/Utils/constants'
import { useDebounce } from 'react-use'

const Counter = ({ activeTab, setActiveTab }) => {
  const { setting_data, cashiers, collection_centers, counterOptions, most_recently_changed } = usePage().props

  const [search, setSearch] = useState('');

  useDebounce(() => {
    if (!search) return;
    setActiveTab({ ...activeTab, search: search, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })
  },
    500,
    [search]
  );

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
    name: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('system.code-maintenance.receipt.store', {
      type: "counter",
    }), {
      onSuccess: () => {
        handleClose();
      }
    });
  }

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    put(route('system.code-maintenance.receipt.update', {
      type: "counter",
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
      type: "counter",
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
      collection_center_id: row.collection_center_id,
      name: row.name,
      description: row.description
    });

    setEditMode(true);
    setOpen(true);
  }

  const handleOpenDelete = (row) => {
    setData({
      id: row.id,
      collection_center_id: row.collection_center_id,
      name: row.name,
      description: row.description
    });
    setOpenDelete(true);
  }

  const handleSelectCollectionCenter = (e) => {
    const collectionCenterData = collectionCenterOptions.find((collection_center) => collection_center.id === e.target.value)

    setData({ ...data, collection_center_id: e.target.value })

    setCollectionCenterSelected(collectionCenterData.name)
    setCounters(collectionCenterData.counters)
  }

  useEffect(() => {
    if (collection_centers) {
      setCollectionCenterOptions(collection_centers.map((collection_center) => ({
        id: collection_center.id,
        name: collection_center.name,
        code: collection_center.code,
        counters: collection_center.counters
      })))
    }

  }, [collection_centers])

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

  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={defaultModalStyles}>
          <Typography variant="h6" component="h2">
            {editMode ? 'Kemaskini' : 'Tambah'}  Kaunter
          </Typography>
          <Typography sx={{ mt: 2 }}>

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
              <Typography sx={{ width: 100 }}>Nama Kaunter</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <TextField
                    hiddenLabel
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
              <Typography sx={{ width: 100 }}>Keterangan</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <TextField
                    hiddenLabel
                    onChange={(e) => setData('description', e.target.value)}
                    value={data.description}
                    variant="standard"
                    size="small"
                  />
                  {errors.description && <div className="text-red-500 mt-2 text-sm">{errors.name}</div>}
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
            Hapus Kaunter?
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
        <TitleCaptions title="Kaunter" extraStyles={{ my: 2 }} />
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
            <InputLabel>No. Kaunter</InputLabel>
            <Select
              value={activeTab.name || ''}
              label="No. Kaunter"
              onChange={(e) => setActiveTab({ ...activeTab, name: e.target.value, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })}
            >
              <MenuItem value="">Semua</MenuItem>
              {
                counterOptions.map((item) =>
                  <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                )
              }
            </Select>
          </FormControl>
          <TextField fullWidth label="Carian" variant="outlined" size="small" sx={{ width: '200%' }} value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="contained" size="small" sx={{ borderRadius: 'var(--button-radius)' }} fullWidth
            onClick={() => {
              setActiveTab({...activeTab, search:'', collection_center_id: '', name: '', page: 1 })
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
              label: 'Pusat Kutipan',
              name: 'collection_center_id',
              renderCell: (row) => collectionCenterMap[row.collection_center_id]?.name || '—'
            },
            {
              label: 'Nama',
              name: 'name',
            },
            {
              label: 'Keterangan Kaunter',
              name: 'description',
            },
            {
              label: 'Tindakan',
              name: 'action',
              renderCell: (row) => {
                return (
                  <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: '1fr 1fr'}}>
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

export default Counter
