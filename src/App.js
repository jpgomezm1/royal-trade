// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar/Navbar'; // Importamos el componente Navbar
import LoginPage from './pages/LoginPage/LoginPage';
import IngresosPage from './pages/IngresosPage/IngresosPage';
import GastosPage from './pages/GastosPage/GastosPage';
import DataPage from './pages/DataPage/DataPage';
import { Box } from '@mui/material'; // Para manejar el diseño del contenido

function App() {
  const user = useSelector((state) => state.auth.user); // Accedemos al estado del usuario

  return (
    <Router>
      {user && <Navbar />} {/* Mostramos la Navbar solo si el usuario está logueado */}
      <Box
        component="main"
        sx={{
          p: 3,
          marginLeft: { sm: user ? '260px' : '0' }, // Ajustamos el margen si la Navbar está visible
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Routes>
          {!user ? (
            <Route path="/login" element={<LoginPage />} /> // Redirigimos al login si no hay usuario
          ) : (
            <>
              <Route path="/" element={<Navigate to="/ingresos" replace />} />
              <Route path="/ingresos" element={<IngresosPage />} />
              <Route path="/gastos" element={<GastosPage />} />
              <Route path="/data" element={<DataPage />} />
            </>
          )}
          <Route path="*" element={<Navigate to={user ? '/ingresos' : '/login'} />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
