import TitleCaptions from '@/Components/ui/TitleCaptions'
import CustomTextField from '@/Components/ui/field/CustomTextField'
import TableComponent from '@/Components/ui/tables/TableComponent';
import { Box, styled, Button, Stack, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { usePage, router } from '@inertiajs/react';
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs'

export const ListNotValidOSP = () => {

  const { osp_data, collection_centers, counters } = usePage().props;

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

  const handleDelete = (e, id) => {
      e.preventDefault();
      router.delete(route('osp.delete-import', {
          id
      }), {
          onSuccess: () => {
              
          }
      });
  }

  return (
    <Box>
      <TitleCaptions
        title="Senarai OSP Tidak Sah"
        extraStyles={{ my: 2 }}
      />
      <Box>
        <TableComponent
          columns={[
            {
              label: 'Bil.',
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
              label: 'Status',
              name: 'status',
              renderCell: (row) => row.status === 'failed' ? 'Tidak Sah' : 'Sah'
            },
            {
              label: 'Tindakan',
              name: 'tindakan',
              renderCell: row => {
                return (
                  <>
                    <Button
                      onClick={() => handleDelete(event, row.id)}
                      variant="contained"
                      size="small"
                      color="error"
                      sx={{ textTransform: 'none' }}
                    >
                      Hapus
                    </Button>
                  </>
                )
              }
            }

          ]}
          rows={osp_data}
        />
      </Box>
    </Box>
  )
}
