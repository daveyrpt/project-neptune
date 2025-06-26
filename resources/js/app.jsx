import './bootstrap';
import '../css/app.css';
import '@fontsource/poppins/100.css';
import '@fontsource/poppins/200.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

import { createTheme, ThemeProvider } from '@mui/material';
import { NotificationProvider } from './NotificationContext';

import {
    LocalizationProvider,
} from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import 'dayjs/locale/en-gb';

const defaultTheme = createTheme();

const theme = createTheme({
    palette: {
        primaryButton: {
            main: '#1692E6'
        },
        secondaryButton: {
            main: '#004269'
        },
        primary: {
            main: '#004269'
        },
        secondary: {
            main: '#F69B00'
        },
        iconColor: {
            main: '#F69B00'
        },
    },
    components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '10px',
        },
      },
    },
  },
    typography: {
        fontFamily: ['Poppins', 'sans-serif',].join(','),
        h1: {
            fontSize: defaultTheme.typography.pxToRem(48),
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: -0.5,
        },
        h2: {
            fontSize: defaultTheme.typography.pxToRem(36),
            fontWeight: 600,
            lineHeight: 1.2,
        },
        h3: {
            fontSize: defaultTheme.typography.pxToRem(30),
            lineHeight: 1.2,
        },
        h4: {
            fontSize: defaultTheme.typography.pxToRem(24),
            fontWeight: 600,
            lineHeight: 1.5,
        },
        h4SemiBold: {
            fontSize: defaultTheme.typography.pxToRem(27),
            fontWeight: 600,
        },
        h5: {
            fontSize: defaultTheme.typography.pxToRem(20),
            fontWeight: 600,
        },
        h5Normal: {
            fontSize: defaultTheme.typography.pxToRem(20),
        },
        h6: {
            fontSize: defaultTheme.typography.pxToRem(18),
            fontWeight: 600,
        },
        subtitle2: {
            fontSize: defaultTheme.typography.pxToRem(14),
            fontWeight: 500,
        },
        body1: {
            fontSize: defaultTheme.typography.pxToRem(14),
        },
        body2: {
            fontSize: defaultTheme.typography.pxToRem(14),
            fontWeight: 400,
        },
        caption: {
            fontSize: defaultTheme.typography.pxToRem(12),
            fontWeight: 400,
        },
        headerTitle: {
            fontSize: defaultTheme.typography.pxToRem(20),
            fontWeight: 600,
        },
        headerSubTitle: {
            fontSize: defaultTheme.typography.pxToRem(14),
            fontWeight: 600,
        },
        subtitle1: {
            fontSize: defaultTheme.typography.pxToRem(13),
            color: '#4B5563',
            fontStyle: 'italic',
        },
        subtitle3: {
            fontSize: defaultTheme.typography.pxToRem(13),
            color: '#4B5563',
        },
        p: {
            fontSize: defaultTheme.typography.pxToRem(13),
        }
    },
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                    <NotificationProvider>
                        <App {...props} />
                    </NotificationProvider>
                </LocalizationProvider>
            </ThemeProvider>);
    },
    progress: {
        color: '#4B5563',
    },
});
