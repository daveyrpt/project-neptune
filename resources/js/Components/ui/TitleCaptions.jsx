import React from 'react'
import { Box, Typography } from '@mui/material'

const TitleCaptions = ({title, captions, extraStyles}) => {
    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', ...extraStyles}}>
                <Typography component="h5" variant="headerSubTitle"
                            sx={{ color: 'var(--text-color)', fontSize: '17px !important',paddingBottom: '10px' }}>
                    {title}
                </Typography>
            </Box>
            <Box>
                <Typography variant="subtitle1">
                    {captions}
                </Typography>
            </Box>
        </>
    )
}

export default TitleCaptions
