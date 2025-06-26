import React from 'react'
import { FormControl, MenuItem, InputLabel, Select } from '@mui/material'
import { usePage } from '@inertiajs/react'

export default function MultipleSelect({ activeTab, setActiveTab ,setting_data}) {
    const { collection_centers } = usePage().props

    return (
        <>
            <FormControl fullWidth size="small">
                <InputLabel>Kod Kumpulan Resit</InputLabel>
                <Select
                    defaultValue={''}
                    value={activeTab.code}
                    label="Kod Kumpulan Resit"
                    onChange={(e) => setActiveTab({ ...activeTab, code: e.target.value, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })}
                >
                    <MenuItem value="">Semua</MenuItem>
                    {
                        collection_centers.map((item) =>
                            <MenuItem key={item.code} value={item.code}>{item.code}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
            <FormControl fullWidth size="small">
                <InputLabel>Kumpulan Resit</InputLabel>
                <Select
                    defaultValue={''}
                    value={activeTab.name}
                    label="Kumpulan Resit"
                    onChange={(e) => setActiveTab({ ...activeTab, name: e.target.value, page: setting_data.current_page !== 1 ? 1 : setting_data.current_page })}
                >
                    <MenuItem value="">Semua</MenuItem>
                    {
                        collection_centers.map((item) =>
                            <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
        </>
    )
}
