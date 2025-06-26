import React from 'react'
import {
    Box,
    FormControl,
    FormLabel,
    TextField
} from '@mui/material'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'
import { DateField } from '@mui/x-date-pickers-pro'
import dayjs from 'dayjs'
import 'dayjs/locale/en-gb'

export default function LastEdited({ name, date_created, date_modified }) {

    return (
        <Box sx={{ mt: 2, padding: '2rem' }}>
            <TitleCaptions title="Dikemaskini Oleh" extraStyles={{ mb: 2 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                <FormControl sx={{ flexDirection: 'row' }}>
                    <FormLabel
                        sx={{ display: 'flex', alignItems: 'center', marginRight: 2, width: 150 }}
                    >
                        Dihasilkan:
                    </FormLabel>
                    <DateField
                        value={dayjs(date_created)}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        disabled
                    />
                </FormControl>
                <FormControl sx={{ flexDirection: 'row' }}>
                    <FormLabel
                        sx={{ display: 'flex', alignItems: 'center', marginRight: 2, width: 150 }}
                    >
                        Oleh:
                    </FormLabel>
                    <TextField
                        hiddenLabel
                        value={name}
                        variant="filled"
                        size="small"
                        disabled
                    />
                </FormControl>
                <FormControl sx={{ flexDirection: 'row' }}>
                    <FormLabel
                        sx={{ display: 'flex', alignItems: 'center', marginRight: 2, width: 150 }}
                    >
                        Diubah:
                    </FormLabel>
                    <DateField
                        value={dayjs(date_modified)}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        disabled
                    />
                </FormControl>
            </Box>
        </Box>
    )
}
