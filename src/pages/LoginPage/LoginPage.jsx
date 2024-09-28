import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import logo from '../../assets/royalclub-logo.png';  // Asegúrate de que la ruta sea correcta

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      dispatch(loginSuccess(userCredential.user));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        padding: 3,
      }}
    >
      {/* Título Principal */}
      <Typography 
        variant={isMobile ? 'h4' : 'h2'} 
        align="center" 
        gutterBottom 
        sx={{ 
          fontWeight: 700, 
          color: 'primary.main', 
          mb: isMobile ? 4 : 8 
        }}
      >
        Dashboard Operaciones Royal Trade Club
      </Typography>

      <Paper elevation={3} sx={{ padding: isMobile ? 3 : 5, maxWidth: 500, width: '100%', borderRadius: 4 }}>
        
        {/* Logo en la parte superior */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: isMobile ? 1 : 2 }}>
          <img src={logo} alt="Royal Trade Logo" style={{ width: isMobile ? '80px' : '120px', height: 'auto' }} />
        </Box>
        
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          sx={{ fontWeight: 600, fontSize: isMobile ? '1.5rem' : '2rem' }}
        >
          Iniciar Sesión
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} noValidate>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            InputLabelProps={{ style: { fontSize: isMobile ? '0.8rem' : '1rem' }}}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            margin="normal"
            required
            InputLabelProps={{ style: { fontSize: isMobile ? '0.8rem' : '1rem' }}}
          />
          
          <Box sx={{ marginTop: 3 }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ padding: isMobile ? 1 : 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
