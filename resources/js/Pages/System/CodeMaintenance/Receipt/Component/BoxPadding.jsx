import { Box } from '@mui/material'
import React from 'react'

export function BoxPaddingX({ children }) {
    return (
        <Box sx={{ paddingX: '2rem' }}>
            {children}
        </Box>
  )
}
