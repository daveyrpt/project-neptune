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
const ModalRejectForm = ({ openModalReject, handleClose, data, setData, errors, processing, handleSubmit }) => {
  return (
    <Modal
      open={openModalReject}
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
          Penolakan Permohonan Batal Resit
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
          {/* <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Typography sx={{ width: 300 }}>No. Resit Ganti</Typography>
            <Typography>:</Typography>
            <Box>
              <FormControl>
                <TextField
                  hiddenLabel
                  onChange={(e) => setData('receipt_replacement', e.target.value)}
                  value={data.receipt_replacement}
                  variant="standard"
                  size="small"
                />
              </FormControl>
              {errors.receipt_replacement && <div className="text-red-500 mt-2 text-sm">{errors.receipt_replacement}</div>}
            </Box>
          </Stack> */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Typography sx={{ width: 300 }}>Alasan Penolakan*</Typography>
            <Typography>:</Typography>
            <Box>
              <FormControl>
                <TextField
                  hiddenLabel
                  onChange={(e) => setData('reject_reason', e.target.value)}
                  value={data.reject_reason}
                  variant="standard"
                  size="small"
                />
              </FormControl>
              {errors.reject_reason && <div className="text-red-500 mt-2 text-sm">{errors.reject_reason}</div>}
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 10 }}>
            <Button variant="outlined" size="small" fullWidth onClick={handleClose}>Tutup</Button>
            <Button
              variant="contained"
              size="small"
              fullWidth
              color='error'
              onClick={handleSubmit}
              disabled={processing}
            >
              Tolak
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  )
}

export default ModalRejectForm