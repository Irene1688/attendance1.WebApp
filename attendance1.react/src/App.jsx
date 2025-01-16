import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import { MessageProvider } from './contexts/MessageContext';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { router } from './routes';
import { theme } from './styles';

function App() {
  return (
    <MessageProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>
      </ThemeProvider>
    </MessageProvider>
  );
}

export default App;
