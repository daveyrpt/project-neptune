import TableComponent from '@/Components/ui/tables/TableComponent'
import TitleCaptions from '@/Components/ui/TitleCaptions'
import CustomTextField from '@/Components/ui/field/CustomTextField'
import { Box } from '@mui/material'
import React from 'react'

const OpenItemReview = () => {
    return (
        <Box>
            <TitleCaptions
                title="Semakan Open Item"
                captions="Semakan Integrasi Open Item"
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2,mt:5 }}>
                <CustomTextField
                    id="date"
                    label="Tarikh"
                    name="date"
                    value="11/11/2023"
                />
                <CustomTextField
                    id="oureopit"
                    label="AUREOPIT"
                    name="AUREOPIT"
                    value="113222 rekod"
                />
                <CustomTextField
                    id="aurealloc"
                    label="AUREALLOC"
                    name="aurealloc"
                    value="42342 rekod"
                />
            </Box>
        </Box>
    )
}

export default OpenItemReview
