import {Button, Stack, TextField} from "@mui/material";
import MultipleSelect from "@/Pages/System/CodeMaintenance/Receipt/Component/MultipleSelect.jsx";
import React from "react";

 const MaintenanceSearchBar = ({activeTab,setActiveTab,handleOpen, setting_data}) => {
    return (
        <Stack direction="row" spacing={2}>
            <MultipleSelect activeTab={activeTab} setActiveTab={setActiveTab} setting_data={setting_data}/>
            <TextField fullWidth id="search" label="Carian" variant="outlined" size="small" sx={{width: '200%'}}/>
            <Button variant="contained" size="small" sx={{borderRadius: 'var(--button-radius)'}} fullWidth>Cari</Button>
            <Button
                sx={{borderRadius: 'var(--button-radius)'}}
                onClick={handleOpen}
                variant="contained"
                size="small"
                fullWidth
            >
                Tambah
            </Button>
        </Stack>
    )
}

export default MaintenanceSearchBar
