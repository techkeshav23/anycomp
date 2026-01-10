'use client';

import { createTheme } from '@mui/material/styles';
import { Red_Hat_Display } from 'next/font/google';

const redHatDisplay = Red_Hat_Display({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Matches Tailwind primary
    },
    text: {
      primary: '#222222', // Strict requirement: #222222
    },
  },
  typography: {
    fontFamily: `var(--font-red-hat-display), "Proxima Nova", "Inter", sans-serif`,
    allVariants: {
      color: '#222222',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
