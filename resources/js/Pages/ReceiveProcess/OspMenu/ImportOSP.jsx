import TitleCaptions from '@/Components/ui/TitleCaptions'
import CustomTextField from '@/Components/ui/field/CustomTextField'
import { CloudIcon } from '@heroicons/react/24/solid';
import { Box, styled, Button, Stack, Typography, InputLabel, Select, MenuItem, FormControl, Input } from '@mui/material'
import React from 'react'
import { usePage, useForm, router } from '@inertiajs/react';
import CustomDateField from '@/Components/ui/field/CustomDateField';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const ImportOSP = () => {

  const { collection_centers, import_type } = usePage().props;

  const { data, setData, post, errors, processing } = useForm({
    collection_center_id: '3',
    counter_id: '99',
    file: '',
    import_type: 'POS' || '',
  });
  
  const [selectedFileName, setSelectedFileName] = React.useState('');


  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('osp.import'), {
      onSuccess: () => {
        handleClose();
      }
    });
  }

  return (
    <Box>
      <TitleCaptions
        title="Import OSP"
        extraStyles={{ my: 2 }}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: 'repeat(2, minmax(min(200px, 100%), 1fr))',
          gap: 4
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ gridColumn: 'span 2' }}>
          <Typography sx={{ width: 120 }}>Pusat Kutipan</Typography>
          <Typography>:</Typography>
          <Select
            hiddenLabel
            value={data.collection_center_id}
            onChange={(e) => setData('collection_center_id', e.target.value)}
            label="Pusat Kutipan"
            size="small"
            disabled
          >
            {collection_centers?.length === 0 ? (
              <MenuItem value="">Tiada</MenuItem>
            ) : (
              collection_centers.map((item) => (
                <MenuItem key={item} value={item.id}>
                  {item.code}-{item.name}
                </MenuItem>
              ))
            )}
          </Select>
        </Stack>
        <CustomTextField
          label="No. Terminal"
          variant='standard'
          onChange={(e) => setData('counter_id', e.target.value)}
          value={data.counter_id}
          disabled
        />
        <CustomDateField
          label="Tarikh Kutipan"
          variant='standard'
          disabled
        />
        <Stack direction="row" alignItems="center" spacing={2} sx={{ gridColumn: 'span 2' }}>
          <Typography sx={{ width: 120 }}>Jenis Import</Typography>
          <Typography>:</Typography>
          <Select
            hiddenLabel
            value={data.import_type}
            onChange={(e) => setData('import_type', e.target.value)}
            label="Jenis Import"
            size="small"
          >            
            {import_type?.length === 0 ? (
              <MenuItem value="">Tiada</MenuItem>
            ) : (
              import_type.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))
            )}
          </Select>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography sx={{ width: 120 }}>Muat Naik</Typography>
          <Typography>:</Typography>
          <Box>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudIcon />}
            >
              Pilih Fail
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => {
                  const file = event.target.files[0];
                  setData('file', file);
                  setSelectedFileName(file ? file.name : '');
                }}
                multiple
              />
            </Button>
            {selectedFileName && (
              <Typography variant="caption" sx={{ mt: 1, ml: 1 }}>
                Fail: {selectedFileName}
              </Typography>
            )}
          </Box>
        </Stack>
        {/* Submit Button */}
        <Stack sx={{ gridColumn: 'span 2', mt: 2 }} direction="row" alignItems="center" spacing={2}>
          <Button variant="outlined" size="small" sx={{ borderRadius: 'var(--button-radius)',height: 40 }} fullWidth onClick={() => router.visit(route('osp.index'))}>Batal</Button>
          <Button variant="contained" size="small" sx={{ borderRadius: 'var(--button-radius)',height: 40 }} fullWidth onClick={handleSubmit}>Import</Button>
        </Stack>
      </Box>
    </Box>
  )
}
