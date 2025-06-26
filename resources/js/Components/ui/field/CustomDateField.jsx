import {
    Typography,
    Stack,
} from '@mui/material';
import {
    DateField
} from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';

export default function CustomDateField({ label, date, ...props }) {
    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={{ width: 120 }}>{label}</Typography>
            <Typography>:</Typography>
            <DateField
                slotProps={{
                    textField: {
                        size: "small",
                        fullWidth: true,
                    },
                }}
                value={dayjs(date)}
                {...props}
            />
        </Stack>
    )
}
