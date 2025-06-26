import TitleCaptions from '@/Components/ui/TitleCaptions'
import CustomTextField from '@/Components/ui/field/CustomTextField'
import TableComponent from '@/Components/ui/tables/TableComponent';
import { Box, styled, Button, Stack, Typography } from '@mui/material'
import { useState, useMemo } from 'react';
import ModalOpenItem from './ModalOpenItem';
import ModalEdit from './ModalEdit';
import { usePage, router, useForm } from '@inertiajs/react';
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs'

export const UploadOSP = ({ activeTab, setActiveTab }) => {

  const { osp_data, collection_centers, counters, total_amount, customer_not_exist } = usePage().props;

  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalOpenItem, setOpenModalOpenItem] = useState(false);
  
  const collectionCenterMap = useMemo(() => {
      const map = {};
      collection_centers?.forEach((collection_center) => {
          map[collection_center.id] = collection_center.name;
      });
      return map;
  }, [collection_centers]);

  const counterMap = useMemo(() => {
      const map = {};
      counters?.forEach((counter) => {
          map[counter.id] = counter.name;
      });
      return map;
  }, [counters]);

  const { data, setData, post, put, processing, errors, clearErrors } = useForm({
      id: '',
      account_number: '',
      account_holder_name: '',
      amount: '',
  });

  const handleDelete = (e, id) => {
      e.preventDefault();
      router.delete(route('osp.delete-osp', {
          id
      }), {
          onSuccess: () => {
              handleClose();
          }
      });
  }

  const handleSubmitEdit = (e) => {
      e.preventDefault();
      put(route('osp.update-osp', {
          id: data.id
      }), {
          onSuccess: () => {
              handleClose();
              setOpenModalEdit(false);
          }
      });
  }

  const handleEdit = (row) => {
     setData({
        id: row.id,
        account_number: row.account_number,
        account_holder_name: row.account_holder_name,
        amount: row.amount,
    });

    setOpenModalEdit(true);
  }

  const handleSubmitOpenItem = (e) => {
    e.preventDefault();
    post(route('advance-payment-request.store'), {
        onSuccess: () => {
            setOpenModalOpenItem(false);
        }
    });
  }

  const handleOpenItem = (row) => {
    setData({
        id: '',
        system: '',
        account_number: row.account_number,
        identity_number: row.identity_number,
        customer_name: row.account_holder_name,
        route: 'osp-open-item',
    });

    setOpenModalOpenItem(true);
  }

  const handleReadyToBeUpload = (e) => {

    e.preventDefault();
    router.post(route('osp.ready-to-be-upload'), {
        onSuccess: () => {
            handleClose();
        }
    });
  }

  const handlePrint = () => {
    window.open(route('osp.print-osp'), '_blank');
  }

  return (
    <Box>
      <ModalOpenItem
        openModalOpenItem={openModalOpenItem}
        handleSubmitOpenItem={handleSubmitOpenItem}
        processing={processing}
        data={data}
        setData={setData}
        errors={errors}
        handleClose={() => setOpenModalOpenItem(false)}
      />
      <ModalEdit
        openModalOpenItem={openModalEdit}
        handleSubmitEdit={handleSubmitEdit}
        processing={processing}
        data={data}
        setData={setData}
        errors={errors}
        handleClose={() => setOpenModalEdit(false)}
      />
      <TitleCaptions
        title="Muat Naik OSP"
        extraStyles={{ my: 2 }}
      />
      <Box>
        <TableComponent
          columns={[
            {
              label: 'Bil',
              name: 'id'
            },
            {
              label: 'Jenis Import',
              name: 'import_type'
            },
            {
              label: 'Pusat Kutipan',
              name: 'collection_center_id',
              renderCell: (row) => collectionCenterMap[row.collection_center_id] || '—'
            },
            {
              label: 'Terminal',
              name: 'counter_id',
              renderCell: (row) => counterMap[row.counter_id] || '—'
            },
            {
              label: 'Tarikh Kutipan',
              name: 'collection_date',
              renderCell: (row) => dayjs(row.collection_date).format('DD-MM-YYYY') || '—'
            },
            {
              label: 'No. Akaun',
              name: 'account_number',
              renderCell: (row) => (
                <span className={row.customer_exists ? 'text-black' : 'text-red-600'}>
                    {row.account_number}
                </span>
              )
            },
            {
              label: 'Nombor Resit OSP',
              name: 'osp_receipt_number'
            },
            {
              label: 'Pemegang Akaun',
              name: 'account_holder_name'
            },
            {
              label: 'Amaun (RM)',
              name: 'amount',
              renderCell: (row) => Number(row.amount).toFixed(2)
            },
            {
              label: 'Tindakan',
              name: 'tindakan',
              renderCell: row => {
                return (
                  <>
                    <Button
                      onClick={() => handleDelete(event, row.id)}
                      variant="text"
                      size="small"
                      color="error"
                      sx={{ textTransform: 'none' }}
                    >
                      Hapus
                    </Button>
                    <Button
                      onClick={() => handleEdit(row)}
                      variant="text"
                      size="small"
                      color="primaryButton"
                      sx={{ textTransform: 'none' }}
                    >
                      Kemaskini
                    </Button>
                    <Button
                      onClick={() => handleOpenItem(row)}
                      variant="text"
                      size="small"
                      color="secondaryButton"
                      sx={{ textTransform: 'none' }}

                    >
                      +Open Item
                    </Button>
                  </>
                )
              }
            }

          ]}
          rows={osp_data}
          filterValues={activeTab}
          setFilterValues={setActiveTab}
        />
      </Box>
      <CustomTextField
        label="Jumlah"
        value={Number(total_amount).toFixed(2)}
      />
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" fullWidth color="primary" sx={{ textTransform: 'none' }} disabled={customer_not_exist} onClick={() => handleReadyToBeUpload(event)}>Muat  Naik OSP</Button>

        <Button variant="contained" fullWidth color="primary" sx={{ textTransform: 'none' }} onClick={() => handlePrint()}>Cetak</Button>

      </Stack>
      <Typography variant="subtitle1">
        *Nombor Akaun berwarna merah tidak wujud dalam Open Item. Sila kemaskini Nombor Akaun atau Tambah Open Item bagi akaun tersebut.
      </Typography>
      <Typography variant="subtitle1" color="red">
        Nota: Sila pastikan semua nombor akaun telah diisi dengan lengkap sebelum memuat naik maklumat OSP. Muat naik tidak akan diproses sekiranya terdapat maklumat yang tidak lengkap.
      </Typography>
    </Box>
  )
}
