import CustomTextField from '@/Components/ui/field/CustomTextField'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import { usePage, useForm, router } from '@inertiajs/react'
import TableComponent from '@/Components/ui/tables/TableComponent'

export const ConfigurationOSP = ({activeTab, setActiveTab}) => {

  const config = usePage().props.osp_data ?? {};

  const { osp_data } = usePage().props;

  const { data, setData, post, errors, processing } = useForm({
    import_type: config.import_type || '',
    description: config.description || '',
    header: config.header || '',
    footer: config.footer || '',
    collection_date_starting: config.collection_date_starting || '',
    collection_date_length: config.collection_date_length || '',
    income_code_starting: config.income_code_starting || '',
    income_code_length: config.income_code_length || '',
    account_number_starting: config.account_number_starting || '',
    account_number_length: config.account_number_length || '',
    account_holder_name_starting: config.account_holder_name_starting || '',
    account_holder_name_length: config.account_holder_name_length || '',
    amount_starting: config.amount_starting || '',
    amount_length: config.amount_length || '',
    osp_receipt_starting: config.osp_receipt_starting || '',
    osp_receipt_length: config.osp_receipt_length || '',
    identity_number_starting: config.identity_number_starting || '',
    identity_number_length: config.identity_number_length || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('osp.config'), {
      onSuccess: () => {
        handleClose();
      }
    });
  }

    const handleDelete = (e,value) => {
        e.preventDefault();
        router.delete(route('osp.destroy-config', {
            osp_config: value
        }), {
            onSuccess: () => {
                handleClose();
            }
        });
    };

  console.log('data', osp_data)
  return (
    <Box>
      <Box>
        <TitleCaptions
          title="Konfigurasi OSP"
          extraStyles={{ my: 2 }}
        />
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(min(200px, 100%), 1fr))',
          gap: 4,
        }}>
          <CustomTextField
            variant='standard'
            label="Jenis Import"
            value={data.import_type}
            onChange={(e) => setData('import_type', e.target.value)}
            extraStyle={{ gridColumn: 'span 2' }}
          />
          <CustomTextField
            variant='standard'
            label="Keterangan"
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            extraStyle={{ gridColumn: 'span 2' }}
          />
          <CustomTextField
            variant='standard'
            label="Header"
            value={data.header}
            onChange={(e) => setData('header', e.target.value)}
          />
          <CustomTextField
            variant='standard'
            label="Footer"
            value={data.footer}
            onChange={(e) => setData('footer', e.target.value)}
          />
        </Box>
      </Box>
      <Box>
        <TitleCaptions
          title="Jenis Medan"
          extraStyles={{ mt: 5, mb: 2 }}
        />
        <Box
          sx={{
            display: "grid",
            gap: 4
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <span style={{ width: 230 }}></span>
            <Typography sx={{ width: 200 }}>Kedudukan Mula</Typography>
            <Typography sx={{ width: 200 }}>Panjang Aksara</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ width: 200 }}>Tarikh Kutipan</Typography>
            <Typography>:</Typography>
            <TextField
              sx={{ width: 200 }}
              placeholder="Nyatakan"
              value={data.collection_date_starting}
              onChange={(e) => setData('collection_date_starting', e.target.value)}
              variant="standard"
              size="small"
              fullWidth
            />
            <TextField
              sx={{ width: 200 }}
              placeholder="Nyatakan"
              value={data.collection_date_length}
              onChange={(e) => setData('collection_date_length', e.target.value)}
              variant="standard"
              size="small"
              fullWidth
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ width: 200 }}>Kod Hasil</Typography>
            <Typography>:</Typography>
            <TextField
              sx={{ width: 200 }}
              placeholder="Nyatakan"
              value={data.income_code_starting}
              onChange={(e) => setData('income_code_starting', e.target.value)}
              variant="standard"
              size="small"
              fullWidth
            />
            <TextField
              sx={{ width: 200 }}
              placeholder="Nyatakan"
              value={data.income_code_length}
              onChange={(e) => setData('income_code_length', e.target.value)}
              variant="standard"
              size="small"
              fullWidth
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ width: 200 }}>Nombor Akaun</Typography>
            <Typography>:</Typography>
            <TextField
              sx={{ width: 200 }}
              placeholder="Nyatakan"
              value={data.account_number_starting}
              onChange={(e) => setData('account_number_starting', e.target.value)}
              variant="standard"
              size="small"
              fullWidth
            />
            <TextField
              sx={{ width: 200 }}
              placeholder="Nyatakan"
              value={data.account_number_length}
              onChange={(e) => setData('account_number_length', e.target.value)}
              variant="standard"
              size="small"
              fullWidth
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ width: 200 }}>Amaun</Typography>
            <Typography>:</Typography>
            <TextField
              sx={{ width: 200 }}
              placeholder="Nyatakan"
              value={data.amount_starting}
              onChange={(e) => setData('amount_starting', e.target.value)}
              variant="standard"
              size="small"
              fullWidth
            />
            <TextField
              sx={{ width: 200 }}
              placeholder="Nyatakan"
              value={data.amount_length}
              onChange={(e) => setData('amount_length', e.target.value)}
              variant="standard"
              size="small"
              fullWidth
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ width: 200 }}>No. Resit OSP</Typography>
            <Typography>:</Typography>
            <TextField
              sx={{ width: 200 }}
              placeholder="Nyatakan"
              value={data.osp_receipt_starting}
              onChange={(e) => setData('osp_receipt_starting', e.target.value)}
              variant="standard"
              size="small"
              fullWidth
            />
            <TextField
              sx={{ width: 200 }}
              placeholder="Nyatakan"
              value={data.osp_receipt_length}
              onChange={(e) => setData('osp_receipt_length', e.target.value)}
              variant="standard"
              size="small"
              fullWidth
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ width: 200 }}>Nama Pemegang Akaun</Typography>
            <Typography>:</Typography>
            <TextField
              sx={{ width: 200 }}
              placeholder="Nyatakan"
              value={data.account_holder_name_starting}
              onChange={(e) => setData('account_holder_name_starting', e.target.value)}
              variant="standard"
              size="small"
              fullWidth
            />
            <TextField
              sx={{ width: 200 }}
              placeholder="Nyatakan"
              value={data.account_holder_name_length}
              onChange={(e) => setData('account_holder_name_length', e.target.value)}
              variant="standard"
              size="small"
              fullWidth
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ width: 200 }}>No. IC</Typography>
            <Typography>:</Typography>
            <TextField
              sx={{ width: 200 }}
              placeholder="Nyatakan"
              value={data.identity_number_starting}
              onChange={(e) => setData('identity_number_starting', e.target.value)}
              variant="standard"
              size="small"
              fullWidth
            />
            <TextField
              sx={{ width: 200 }}
              placeholder="Nyatakan"
              value={data.identity_number_length}
              onChange={(e) => setData('identity_number_length', e.target.value)}
              variant="standard"
              size="small"
              fullWidth
            />
          </Stack>
          <Button variant="contained" size="small" disabled={processing} sx={{ borderRadius: 'var(--button-radius)', mt: 4, mb: 2 }} fullWidth onClick={handleSubmit}>Tambah</Button>
        </Box>
        <Box>
          <TableComponent
            columns={[
              {
                label: 'Jenis Import',
                name: 'import_type',
              },
              {
                label: 'Keterangan',
                name: 'description'
              },
              {
                label: 'Header',
                name: 'header'
              },
              {
                label: 'Footer',
                name: 'footer'
              },
              {
                label: 'Tarikh Kutipan',
                renderCell: (row) => {
                  return (
                    <Box>
                      <Typography>{row.collection_date_starting}</Typography>
                      <Typography>{row.collection_date_length}</Typography>
                    </Box>
                  )
                }
              },
              {
                label: 'Kod Hasil',
                renderCell: (row) => {
                  return (
                    <Box>
                      <Typography>{row.income_code_starting}</Typography>
                      <Typography>{row.income_code_length}</Typography>
                    </Box>
                  )
                }
              },
              {
                label: 'Nombor Akaun',
                renderCell: (row) => {
                  return (
                    <Box>
                      <Typography>{row.account_number_starting}</Typography>
                      <Typography>{row.account_number_length}</Typography>
                    </Box>
                  )
                }
              },
              {
                label: 'Amaun',
                renderCell: (row) => {
                  return (
                    <Box>
                      <Typography>{row.amount_starting}</Typography>
                      <Typography>{row.amount_length}</Typography>
                    </Box>
                  )
                }
              },
              {
                label: 'No. Resit OSP',
                renderCell: (row) => {
                  return (
                    <Box>
                      <Typography>{row.osp_receipt_starting}</Typography>
                      <Typography>{row.osp_receipt_length}</Typography>
                    </Box>
                  )
                }
              },
              {
                label: 'Nama Pemegang Akaun',
                renderCell: (row) => {
                  return (
                    <Box>
                      <Typography>{row.account_holder_name_starting}</Typography>
                      <Typography>{row.account_holder_name_length}</Typography>
                    </Box>
                  )
                }
              },
              {
                label: 'No. IC',
                renderCell: (row) => {
                  return (
                    <Box>
                      <Typography>{row.identity_number_starting}</Typography>
                      <Typography>{row.identity_number_length}</Typography>
                    </Box>
                  )
                }
              },
              {
                label: "Tindakan",
                name: "tindakan",
                renderCell: (row) => {
                  return (
                    <Box>
                      {/* <IconButton size="small" color="success" onClick={() => handleEdit(row)}>
                        <Edit />
                      </IconButton> */}
                      <Button variant="contained" size="small" color='error' sx={{ textTransform: 'none', mr: 1 }} onClick={(e) => handleDelete(e, row.id)}>Hapus</Button>
                    </Box>
                  )
                }
              }
            ]}
            rows={osp_data}
            filterValues={activeTab}
            setFilterValues={setActiveTab}
            />
        </Box>
        <Box>
          <TitleCaptions
            title="Dikemaskini Oleh"
            extraStyles={{ mb: 2 }}
          />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(min(200px,100%),1fr))',
              gap: 4
            }}
          >
            <CustomTextField
              variant='standard'
              label="Dihasilkan"
              disabled
            />
            <CustomTextField
              variant='standard'
              label="Oleh"
              disabled
            />
            <CustomTextField
              variant='standard'
              label="Diubah"
              disabled
            />
          </Box>
        </Box>
      </Box>

    </Box>
  )
}
