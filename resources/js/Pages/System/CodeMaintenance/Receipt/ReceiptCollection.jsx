import TableComponent from '@/Components/ui/tables/TableComponent'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import { useForm, usePage, router } from '@inertiajs/react'
import {
  Box,
  FormControl,
  Stack,
  TextField,
  Button,
  Modal,
  Typography,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useState } from 'react'
import 'dayjs/locale/en-gb';
import LastEdited from './Component/LastEdited'
import { BoxPaddingX } from './Component/BoxPadding'
import { defaultModalStyles } from '@/Utils/constants'
import { useDebounce } from 'react-use'

const ReceiptCollection = ({ activeTab, setActiveTab }) => {

  const { setting_data, receipt_collections, most_recently_changed } = usePage().props;

  const [search, setSearch] = useState('');

  useDebounce(() => {
      if (!search) return;
      setActiveTab({ ...activeTab, search: search, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })
    },
    500,
    [search]
  );

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    reset();
    setEditMode(false);
    setOpen(true);
  }
  const handleClose = (e, reason) => {
    //Contoh kalau nak disable click backdrop
    // if (reason && reason === "backdropClick") return
    setOpen(false);
  }
  const [editMode, setEditMode] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const handleCloseDelete = () => setOpenDelete(false);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    id: '',
    code: '',
    name: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('system.code-maintenance.receipt.store', {
      type: "receipt_collection",
    }), {
      onSuccess: () => {
        handleClose();
      }
    });
  }

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    put(route('system.code-maintenance.receipt.update', {
      type: "receipt_collection",
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
      type: "receipt_collection",
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
        <Box sx={defaultModalStyles}>
          <Typography variant="h6" component="h2">
            {editMode ? 'Kemaskini Kumpulan Resit' : 'Tambah Kumpulan Resit'}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Typography sx={{ width: 300 }}>Kod Kumpulan Resit</Typography>
              <Typography>:</Typography>
              <Box>
                <FormControl>
                  <TextField
                    hiddenLabel
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
              <Typography sx={{ width: 300 }}>Kumpulan Resit</Typography>
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
        <Box sx={defaultModalStyles}>
          <Typography variant="h6" component="h2">
            Hapus Kumpulan Resit?
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
        <TitleCaptions title="Kumpulan Resit" extraStyles={{ my: 2 }} />
        <Stack direction="row" spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Kod Kumpulan Resit</InputLabel>
            <Select
              value={activeTab.code || ''}
              label="Kod Kumpulan Resit"
              onChange={(e) => setActiveTab({ ...activeTab, code: e.target.value, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })}
            >
              <MenuItem value="">Semua</MenuItem>
              {
                receipt_collections.map((item) =>
                  <MenuItem key={item.id} value={item.code}>{item.code}</MenuItem>
                )
              }
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Kumpulan Resit</InputLabel>
            <Select
              value={activeTab.name || ''}
              label="Kumpulan Resit"
              onChange={(e) => setActiveTab({ ...activeTab, name: e.target.value, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })}
            >
              <MenuItem value="">Semua</MenuItem>
              {
                receipt_collections.map((item) =>
                  <MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>
                )
              }
            </Select>
          </FormControl>
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
              id: 'bil',
              label: 'Bil',
              renderCell: (row) => (
                <>
                  {row.id}
                </>
              )
            },
            { id: 'kod_kumpulan_resit', label: 'Kod Kumpulan Resit', name: 'code' },
            { id: 'kumpulan_resit', label: 'Kumpulan Resit', name: 'name' },
            {
              id: 'tindakan',
              label: 'Tindakan',
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
            },
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

export default ReceiptCollection
