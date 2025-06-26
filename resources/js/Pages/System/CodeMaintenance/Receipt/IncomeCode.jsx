import TableComponent from '@/Components/ui/tables/TableComponent'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import { Box, InputLabel, Select, MenuItem, FormControl, Modal, Typography, Stack, TextField, Button, FormLabel } from '@mui/material'
import { usePage, useForm, router } from '@inertiajs/react'
import { useState } from 'react'
import LastEdited from './Component/LastEdited'
import { BoxPaddingX } from './Component/BoxPadding'
import { defaultModalStyles } from '@/Utils/constants'
import { useDebounce } from 'react-use'

const IncomeCode = ({ activeTab, setActiveTab }) => {
  const { setting_data, receipt_collections, banks, income_codes, income_categories, most_recently_changed, no_banks } = usePage().props

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
    setEditMode(false)
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
      receipt_collection_id: row.receipt_collection_id,
      bank_id: row.bank_id,
      income_category_id: row.income_category_id,
      gl_account: row.gl_account,
      default_amount: row.default_amount,
      printed_receipt_format: row.printed_receipt_format,
    })

    setEditMode(true);
    setOpen(true);
  }

  const handleOpenDelete = (row) => {
    setData({
      id: row.id,
    });
    setOpenDelete(true);
  }

  const { data, errors, setData, post, put, reset, processing } = useForm({
    // 'code' => 'required|unique:income_codes',
    // 'name' => 'required',
    // 'description' => 'required',
    // 'receipt_collection_id' => 'required|exists:receipt_collections,id',
    // 'bank_id' => 'required|exists:banks,id',
    // 'income_category_id' => 'required|exists:income_categories,id',
    // 'gl_account' => 'required',
    // 'default_amount' => 'required|numeric',
    // 'printed_receipt_format' => 'required',
    id: '',
    code: '',
    name: '',
    description: '',
    receipt_collection_id: '',
    bank_id: '',
    income_category_id: '',
    gl_account: '',
    default_amount: '',
    printed_receipt_format: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('system.code-maintenance.receipt.store', {
      type: "income_code",
    }), {
      onSuccess: () => {
        handleClose();
      }
    });
  }

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    put(route('system.code-maintenance.receipt.update', {
      type: "income_code",
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
      type: "income_code",
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
            {editMode ? 'Kemaskini' : 'Tambah'} Kod Hasil
          </Typography>
          <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 200 }}>Kod Hasil</Typography>
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
              <Typography sx={{ width: 200 }}>Keterangan Ringkas</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <TextField
                    hiddenLabel
                    name="name"
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
              <Typography sx={{ width: 200 }}>Kumpulan Resit</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <Select
                    size='small'
                    value={data.receipt_collection_id}
                    onChange={(e) => setData({ ...data, receipt_collection_id: e.target.value })}
                    sx={{ minWidth: 200 }}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    {
                      receipt_collections.map((item) => {
                        return (
                          <MenuItem key={item.id} value={item.id}>{item.code}</MenuItem>
                        )
                      })
                    }
                  </Select>
                  {errors.receipt_collection_id && <div className="text-red-500 mt-2 text-sm">{errors.receipt_collection_id}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 200 }}>No. Bank</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <Select
                    size='small'
                    value={data.bank_id}
                    onChange={(e) => setData({ ...data, bank_id: e.target.value })}
                    sx={{ minWidth: 200 }}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    {
                      no_banks.map((item) => {
                        return (
                          <MenuItem key={item.BNK_NUM} value={item.BNK_NUM}>{item.BNK_NME}</MenuItem>
                        )
                      })
                    }
                  </Select>
                  {errors.bank_id && <div className="text-red-500 mt-2 text-sm">{errors.bank_id}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 200 }}>Kategori Hasil</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <Select
                    size='small'
                    value={data.income_category_id}
                    onChange={(e) => setData({ ...data, income_category_id: e.target.value })}
                    sx={{ minWidth: 200 }}
                  >
                    <MenuItem value="">Semua</MenuItem>
                    {
                      income_categories.map((item) => {
                        return (
                          <MenuItem key={item.id} value={item.id}>{item.code}-{item.name}</MenuItem>
                        )
                      })
                    }
                  </Select>
                  {errors.income_category_id && <div className="text-red-500 mt-2 text-sm">{errors.income_category_id}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 200 }}>Akaun GL</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <TextField
                    hiddenLabel
                    name="gl_account"
                    onChange={(e) => setData('gl_account', e.target.value)}
                    value={data.gl_account}
                    variant="standard"
                    size="small"
                  />
                  {errors.gl_account && <div className="text-red-500 mt-2 text-sm">{errors.gl_account}</div>}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ width: 200 }}>Default Amaun</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <TextField
                    type='number'
                    hiddenLabel
                    name="default_amount"
                    onChange={(e) => setData('default_amount', e.target.value)}
                    value={data.default_amount}
                    placeholder="Kosong Jika Tiada"
                    variant="standard"
                    size="small"
                  />
                  {errors.default_amount && <div className="text-red-500 mt-2 text-sm">{errors.default_amount}</div>}
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
            Hapus Kod Hasil?
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
        <TitleCaptions title="Kod Hasil" extraStyles={{ my: 2 }} />
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Kod Hasil</InputLabel>
            <Select
              value={activeTab.code || ''}
              label="Kod Hasil"
              onChange={(e) => setActiveTab({ ...activeTab, code: e.target.value, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })}
            >
              <MenuItem value="">Semua</MenuItem>
              {
                income_codes.map((item) =>
                  <MenuItem key={item.code} value={item.code}>{item.code}</MenuItem>
                )
              }
            </Select>
          </FormControl>
          {/* <FormControl fullWidth size="small">
            <InputLabel>Nama Bank</InputLabel>
            <Select
              value={activeTab.name || ''}
              label="Nama Bank"
              onChange={(e) => setActiveTab({ ...activeTab, name: e.target.value, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })}
            >
              <MenuItem value="">Semua</MenuItem>
              {
                banks.map((item) =>
                  <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                )
              }
            </Select>
          </FormControl> */}
          <TextField fullWidth label="Carian" variant="outlined" size="small" sx={{ width: '200%' }} value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="contained" size="small" sx={{ borderRadius: 'var(--button-radius)' }} fullWidth
            onClick={() => {
              setActiveTab({...activeTab, search:'', code: '', name: '', page: 1 })
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
              label: 'Kod Hasil',
              name: 'code',
            },
            {
              label: 'Keterangan',
              name: 'name',
            },
            {
              label: 'Keterangan Ringkas',
              name: 'description',
            },
            {
              label: 'Kumpulan Resit',
              name: 'receipt_collection_id',
            },
            {
              label: 'Nombor Bank',
              name: 'bank_id',
              renderCell: (row) => {
                if (row.bank_id === 1) return 'CIMB01';
                if (row.bank_id === 2) return 'MBIMB';
                return 'N/A';
              }
            },
            {
              label: 'Kategori Hasil',
              name: 'income_category_id',
            },
            {
              label: 'Akaun GL',
              name: 'gl_account'
            },
            {
              label: 'Default Amaun',
              name: 'default_amount'
            },
            {
              label: 'Tindakan',
              name: 'action',
              renderCell: (row) => (
                <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: '1fr 1fr' }}>
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

export default IncomeCode
