import React from 'react'
import {
  Box,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Stack,
  TextField,
  Button,
  FormLabel,
  Modal,
  Typography
} from '@mui/material'
const ModalAcceptForm = ({ openModalAccept, data, setData, handleClose, handleSubmit, processing, errors, cancelled_receipt }) => {
  return (
    <Modal
      open={openModalAccept}
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
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Luluskan Permohonan Batal Resit
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Typography sx={{ width: 300 }}>No. Resit</Typography>
            <Typography>:</Typography>
            <Box>
              <FormControl>
                <TextField
                  hiddenLabel
                  onChange={(e) => setData('receipt_number', e.target.value)}
                  value={data.receipt_number}
                  variant="standard"
                  size="small"
                  disabled
                />
              </FormControl>
            </Box>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Typography sx={{ width: 300 }}>No. Resit Ganti</Typography>
            <Typography>:</Typography>
            <Box>
              <FormControl>
                <TextField
                  hiddenLabel
                  value={cancelled_receipt?.new_receipt_number || ''}
                  variant="standard"
                  size="small"
                  disabled
                />
              </FormControl>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 10 }}>
            <Button variant="outlined" size="small" fullWidth onClick={handleClose}>Tutup</Button>
            <Button
              variant="contained"
              size="small"
              fullWidth
              color='success'
              onClick={handleSubmit}
              disabled={processing}
            >
              Lulus
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  )
}

export default ModalAcceptForm