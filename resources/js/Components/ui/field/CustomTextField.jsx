import React from 'react'
import { FormControl, Typography, TextField, Stack, Box } from '@mui/material'

export default function CustomTextField({ id, label, placeholder, name, value, extraStyle , variant = 'outlined' ,width = 120, onChange, ...props }) {
    return (
        <Stack direction="row" alignItems="center" spacing={2} style={extraStyle}>
            <Typography sx={{ width: width }}>{label}</Typography>
            <Typography>:</Typography>
            <TextField
                id={id}
                placeholder={placeholder}
                name={name}
                value={value}
                variant={variant}
                size="small"
                onChange={onChange}
                fullWidth
                {...props}
            />
        </Stack>
    )
}

