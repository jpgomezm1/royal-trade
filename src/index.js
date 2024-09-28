// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Provider } from 'react-redux'; // Importamos el Provider para Redux
import { store } from './store/store';  // Importamos el store de Redux

// Configuración del tema de Material UI
const theme = createTheme({
  palette: {
    mode: 'dark', // Indicamos que es un tema oscuro
    primary: {
      main: '#03DAC6', // Color principal
      contrastText: '#FFFFFF', // Texto en elementos primarios
    },
    background: {
      default: '#1A1A1A', // Fondo gris oscuro
      paper: '#212121', // Fondo para elementos tipo papel
    },
    text: {
      primary: '#E0E0E0', // Texto principal
      secondary: '#B0BEC5', // Texto secundario
    },
    divider: '#37474F', // Color de divisores
  },
  typography: {
    fontFamily: 'Poppins, sans-serif', // Tipografía personalizada
  },
});

// Renderizamos la aplicación dentro del Provider para Redux y con el tema de Material UI
ReactDOM.render(
  <Provider store={store}> {/* Envolvemos la app en el Provider para que el store esté disponible */}
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);
