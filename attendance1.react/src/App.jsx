import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { router } from './routes';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
