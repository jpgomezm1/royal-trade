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
import {
  Add as AddIcon,
  AttachMoney as MoneyIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

// Importar los componentes creados
import IngresosTable from './IngresosTable';
import IngresoFormDialog from './IngresoFormDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

// Definir la URL base de la API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const IngresosPage = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [openMassUpload, setOpenMassUpload] = useState(false); // Estado para el diálogo de carga masiva
  const [file, setFile] = useState(null); // Estado para manejar el archivo Excel
  const [fecha, setFecha] = useState(null);
  const [producto, setProducto] = useState('');
  const [monto, setMonto] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [ingresos, setIngresos] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errors, setErrors] = useState({
    fecha: '',
    producto: '',
    monto: '',
    plataforma: '',
  });

  // Estados para edición
  const [editMode, setEditMode] = useState(false);
  const [selectedIngreso, setSelectedIngreso] = useState(null);

  // Estados para el diálogo de confirmación de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ingresoToDelete, setIngresoToDelete] = useState(null);

  // **Nuevos estados para los filtros**
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedProductFilter, setSelectedProductFilter] = useState('');

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/ingresos/`)
      .then((response) => setIngresos(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleClickOpen = () => {
    setEditMode(false);
    setSelectedIngreso(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedIngreso(null);
    // Limpiar los campos
    setFecha(null);
    setProducto('');
    setMonto('');
    setPlataforma('');
    setErrors({
      fecha: '',
      producto: '',
      monto: '',
      plataforma: '',
    });
  };

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

    axios.post(`${API_BASE_URL}/ingresos/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        setIngresos([...ingresos, ...response.data]); // Agregar los ingresos cargados
        setSnackbarOpen(true);
        handleCloseMassUpload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEditClick = (ingreso) => {
    setEditMode(true);
    setSelectedIngreso(ingreso);
    setFecha(dayjs(ingreso.fecha));
    setProducto(ingreso.producto);
    setMonto(ingreso.monto.toString());
    setPlataforma(ingreso.plataforma);
    setOpen(true);
  };

  const handleDeleteClick = (ingreso) => {
    setIngresoToDelete(ingreso);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (ingresoToDelete) {
      axios
        .delete(`${API_BASE_URL}/ingresos/${ingresoToDelete.id}`)
        .then(() => {
          setIngresos(
            ingresos.filter((ingreso) => ingreso.id !== ingresoToDelete.id)
          );
          setSnackbarOpen(true);
          setDeleteDialogOpen(false);
          setIngresoToDelete(null);
        })
        .catch((error) => console.error(error));
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setIngresoToDelete(null);
  };

  const handleSubmit = () => {
    // Validar los campos
    const newErrors = {
      fecha: fecha ? '' : 'Este campo es obligatorio',
      producto: producto ? '' : 'Este campo es obligatorio',
      monto: monto ? '' : 'Este campo es obligatorio',
      plataforma: plataforma ? '' : 'Este campo es obligatorio',
    };

    if (
      newErrors.fecha ||
      newErrors.producto ||
      newErrors.monto ||
      newErrors.plataforma
    ) {
      setErrors(newErrors);
      return;
    }

    const ingresoData = {
      fecha: fecha.format('YYYY-MM-DD'),
      producto,
      monto: parseFloat(monto),
      plataforma,
    };

    if (editMode && selectedIngreso) {
      // Actualizar ingreso existente
      axios
        .put(
          `${API_BASE_URL}/ingresos/${selectedIngreso.id}`,
          ingresoData
        )
        .then((response) => {
          setIngresos(
            ingresos.map((ingreso) =>
              ingreso.id === selectedIngreso.id ? response.data : ingreso
            )
          );
          setSnackbarOpen(true);
          handleClose();
        })
        .catch((error) => console.error(error));
    } else {
      // Crear nuevo ingreso
      axios
        .post(`${API_BASE_URL}/ingresos/`, ingresoData)
        .then((response) => {
          setIngresos([...ingresos, response.data]);
          setSnackbarOpen(true);
          handleClose();
        })
        .catch((error) => console.error(error));
    }
  };

  // **Función para obtener los ingresos filtrados**
  const getFilteredIngresos = () => {
    return ingresos.filter((ingreso) => {
      const matchesMonth =
        selectedMonth === ''
          ? true
          : dayjs(ingreso.fecha).format('YYYY-MM') === selectedMonth;
      const matchesProduct =
        selectedProductFilter === ''
          ? true
          : ingreso.producto === selectedProductFilter;
      return matchesMonth && matchesProduct;
    });
  };

  // **Obtener el total de ingresos filtrados**
  const totalIngresos = getFilteredIngresos().reduce(
    (acc, curr) => acc + curr.monto,
    0
  );

  // **Obtener lista de meses únicos**
  const uniqueMonths = Array.from(
    new Set(
      ingresos.map((ingreso) => dayjs(ingreso.fecha).format('YYYY-MM'))
    )
  ).sort();

  // **Obtener lista de productos únicos**
  const uniqueProducts = Array.from(
    new Set(ingresos.map((ingreso) => ingreso.producto))
  ).sort();

  // **Generar plantilla de Excel dinámicamente**
  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new(); // Crear un nuevo libro de trabajo
    const ws = XLSX.utils.json_to_sheet([
      { Fecha: 'YYYY-MM-DD', Producto: 'Producto', Monto: 0, Plataforma: 'Plataforma' },
    ]); // Crear una hoja de trabajo con una fila de ejemplo
    XLSX.utils.book_append_sheet(wb, ws, 'Ingresos'); // Agregar la hoja al libro
    XLSX.writeFile(wb, 'plantilla_ingresos.xlsx'); // Descargar el archivo
  };

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
            borderRadius: '16px', // Esquinas más redondeadas
            boxShadow: theme.shadows[6], // Sombra para darle más profundidad
            textAlign: 'center', // Centrar el texto
            width: '100%',
            height: '150px', // Mantener la altura compacta sin el ícono
          }}
        >
          <CardContent sx={{ padding: 0 }}> {/* Mantener sin padding adicional */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.5rem', mt: 2 }}>
              Total Ingresos
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalIngresos)}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Botón para agregar ingresos y carga masiva */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          startIcon={<AddIcon />}
          sx={{ mb: 2 }}
        >
          Agregar Ingreso
        </Button>

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
            <InputLabel id="product-filter-label">Filtrar por Producto</InputLabel>
            <Select
              labelId="product-filter-label"
              value={selectedProductFilter}
              label="Filtrar por Producto"
              onChange={(e) => setSelectedProductFilter(e.target.value)}
            >
              <MenuItem value="">
                <em>Todos los Productos</em>
              </MenuItem>
              {uniqueProducts.map((product) => (
                <MenuItem key={product} value={product}>
                  {product}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Tabla de Ingresos */}
      <IngresosTable
        ingresos={getFilteredIngresos()}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        theme={theme}
      />

      {/* Diálogo de agregar/editar ingreso */}
      <IngresoFormDialog
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        editMode={editMode}
        fecha={fecha}
        setFecha={setFecha}
        producto={producto}
        setProducto={setProducto}
        monto={monto}
        setMonto={setMonto}
        plataforma={plataforma}
        setPlataforma={setPlataforma}
        errors={errors}
        setErrors={setErrors}
      />

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
        ingresoToDelete={ingresoToDelete}
      />

      {/* Diálogo de carga masiva */}
      <Dialog open={openMassUpload} onClose={handleCloseMassUpload}>
        <DialogTitle>Carga Masiva de Ingresos</DialogTitle>
        <DialogContent>
          <Typography>
            Para realizar una carga masiva de ingresos, por favor utiliza la
            plantilla disponible y sube el archivo Excel con los datos
            correctamente llenados.
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
          {editMode
            ? 'Ingreso actualizado exitosamente.'
            : 'Ingreso agregado exitosamente.'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default IngresosPage;


