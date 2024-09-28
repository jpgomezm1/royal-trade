import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Button,
  Snackbar,
  Alert,
  useTheme,
  Grid,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Box,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add as AddIcon, MoneyOff as MoneyIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import GastosTable from './GastosTable';
import GastoFormDialog from './GastoFormDialog';
import * as XLSX from 'xlsx';
import ConfirmDeleteDialog from '../IngresosPage/ConfirmDeleteDialog'; // Asumo que este componente es compartido

// Definir la URL base de la API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const GastosPage = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [openMassUpload, setOpenMassUpload] = useState(false); // Estado para el diálogo de carga masiva
  const [file, setFile] = useState(null); // Estado para manejar el archivo Excel
  const [fecha, setFecha] = useState(null);
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [tipo, setTipo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [gastos, setGastos] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errors, setErrors] = useState({
    fecha: '',
    concepto: '',
    monto: '',
    plataforma: '',
    tipo: '',
    categoria: '',
  });

  // Estados para filtros
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Obtener la lista de gastos
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/gastos/`)
      .then((response) => setGastos(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Abrir y cerrar diálogos
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFecha(null);
    setConcepto('');
    setMonto('');
    setPlataforma('');
    setTipo('');
    setCategoria('');
    setErrors({
      fecha: '',
      concepto: '',
      monto: '',
      plataforma: '',
      tipo: '',
      categoria: '',
    });
  };

  // Funciones para manejar la carga masiva
  const handleOpenMassUpload = () => {
    setOpenMassUpload(true);
  };

  const handleCloseMassUpload = () => {
    setOpenMassUpload(false);
    setFile(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert('Por favor, selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    axios.post(`${API_BASE_URL}/gastos/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        setGastos([...gastos, ...response.data]); // Agregar los gastos cargados
        setSnackbarOpen(true);
        handleCloseMassUpload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Función para descargar la plantilla de Excel
  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new(); // Crear un nuevo libro de trabajo
    const ws = XLSX.utils.json_to_sheet([
      { Fecha: 'YYYY-MM-DD', Concepto: 'Concepto', Monto: 0, Plataforma: 'Plataforma', Tipo: 'Tipo', Categoria: 'Categoria' },
    ]); // Crear una hoja de trabajo con una fila de ejemplo
    XLSX.utils.book_append_sheet(wb, ws, 'Gastos'); // Agregar la hoja al libro
    XLSX.writeFile(wb, 'plantilla_gastos.xlsx'); // Descargar el archivo
  };

  // Función para enviar datos de nuevo gasto o editar gasto
  const handleSubmit = () => {
    // Validar los campos
    const newErrors = {
      fecha: fecha ? '' : 'Este campo es obligatorio',
      concepto: concepto ? '' : 'Este campo es obligatorio',
      monto: monto ? '' : 'Este campo es obligatorio',
      plataforma: plataforma ? '' : 'Este campo es obligatorio',
      tipo: tipo ? '' : 'Este campo es obligatorio',
      categoria: categoria ? '' : 'Este campo es obligatorio',
    };

    if (
      newErrors.fecha ||
      newErrors.concepto ||
      newErrors.monto ||
      newErrors.plataforma ||
      newErrors.tipo ||
      newErrors.categoria
    ) {
      setErrors(newErrors);
      return;
    }

    const newGasto = {
      fecha: fecha.format('YYYY-MM-DD'),
      concepto,
      monto: parseFloat(monto),
      plataforma,
      tipo,
      categoria,
    };

    axios
      .post(`${API_BASE_URL}/gastos/`, newGasto)
      .then((response) => {
        setGastos([...gastos, response.data]);
        setSnackbarOpen(true);
        handleClose();
      })
      .catch((error) => console.error(error));
  };

  // Función para obtener los gastos filtrados
  const getFilteredGastos = () => {
    return gastos.filter((gasto) => {
      const matchesMonth =
        selectedMonth === ''
          ? true
          : dayjs(gasto.fecha).format('YYYY-MM') === selectedMonth;
      const matchesCategory =
        selectedCategory === '' ? true : gasto.categoria === selectedCategory;
      return matchesMonth && matchesCategory;
    });
  };

  // Obtener el total de gastos filtrados
  const totalGastos = getFilteredGastos().reduce((acc, curr) => acc + curr.monto, 0);

  // Obtener lista de meses únicos
  const uniqueMonths = Array.from(
    new Set(gastos.map((gasto) => dayjs(gasto.fecha).format('YYYY-MM')))
  ).sort();

  // Obtener lista de categorías únicas
  const uniqueCategories = Array.from(new Set(gastos.map((gasto) => gasto.categoria))).sort();

  return (
    <Container sx={{ color: theme.palette.text.primary, mt: 4 }}>
      {/* Summary Card */}
      <Box sx={{ mb: 4, width: { xs: '100%', md: '33.33%' }, minWidth: '300px' }}>
        <Card
          sx={{
            backgroundColor: theme.palette.primary.main,
            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)',
            color: theme.palette.primary.contrastText,
            display: 'flex',
            flexDirection: 'column', // Mantener la dirección en columna para centrar el texto
            alignItems: 'center', // Centrar horizontalmente
            justifyContent: 'center', // Centrar verticalmente
            padding: '24px',
            borderRadius: '16px',
            boxShadow: theme.shadows[6],
            textAlign: 'center',
            width: '100%',
            height: '150px', // Ajustar la altura para que sea más compacta sin el ícono
          }}
        >
          <CardContent sx={{ padding: 0 }}> {/* Mantener sin padding adicional */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.5rem', mt: 2 }}>
              Total Gastos
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalGastos)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Botón para agregar gasto */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          startIcon={<AddIcon />}
          sx={{ mb: 2 }}
        >
          Agregar Gasto
        </Button>

        {/* Botón para carga masiva */}
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={handleOpenMassUpload}
          sx={{ mb: 2, ml: 2, backgroundColor: '#00AC47', fontWeight: 'bold' }}
        >
          Carga Masiva
        </Button>
      </Box>

      {/* Dropdowns para filtrar */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="month-filter-label">Filtrar por Mes</InputLabel>
            <Select
              labelId="month-filter-label"
              value={selectedMonth}
              label="Filtrar por Mes"
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <MenuItem value="">
                <em>Todos los Meses</em>
              </MenuItem>
              {uniqueMonths.map((month) => (
                <MenuItem key={month} value={month}>
                  {dayjs(month).format('MMMM YYYY')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="category-filter-label">Filtrar por Categoría</InputLabel>
            <Select
              labelId="category-filter-label"
              value={selectedCategory}
              label="Filtrar por Categoría"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">
                <em>Todas las Categorías</em>
              </MenuItem>
              {uniqueCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Tabla de Gastos */}
      <GastosTable gastos={getFilteredGastos()} />

      {/* Diálogo para agregar/editar gasto */}
      <GastoFormDialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        fecha={fecha}
        setFecha={setFecha}
        concepto={concepto}
        setConcepto={setConcepto}
        monto={monto}
        setMonto={setMonto}
        plataforma={plataforma}
        setPlataforma={setPlataforma}
        tipo={tipo}
        setTipo={setTipo}
        categoria={categoria}
        setCategoria={setCategoria}
        errors={errors}
        setErrors={setErrors}
      />

      {/* Diálogo de carga masiva */}
      <Dialog open={openMassUpload} onClose={handleCloseMassUpload}>
        <DialogTitle>Carga Masiva de Gastos</DialogTitle>
        <DialogContent>
          <Typography>
            Para realizar una carga masiva de gastos, por favor utiliza la plantilla disponible y sube el archivo Excel con los datos correctamente llenados.
          </Typography>
          <Button
            variant="outlined"
            onClick={handleDownloadTemplate}
            sx={{ mt: 2 }}
          >
            Descargar Plantilla
          </Button>
          <TextField
            type="file"
            onChange={handleFileChange}
            fullWidth
            sx={{ mt: 3 }}
            inputProps={{ accept: '.xlsx, .xls' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMassUpload}>Cancelar</Button>
          <Button onClick={handleUpload} variant="contained" color="primary">
            Subir Archivo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Gasto agregado exitosamente.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default GastosPage;
