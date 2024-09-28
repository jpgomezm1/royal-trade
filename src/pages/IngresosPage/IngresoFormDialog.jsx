import React from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StyledDialog } from './StyledComponents';

const IngresoFormDialog = ({
  open,
  handleClose,
  handleSubmit,
  editMode,
  fecha,
  setFecha,
  producto,
  setProducto,
  monto,
  setMonto,
  plataforma,
  setPlataforma,
  errors,
  setErrors,
}) => {
  return (
    <StyledDialog open={open} onClose={handleClose}>
      <DialogTitle>
        {editMode ? 'Editar Ingreso' : 'Agregar Ingreso'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha"
              value={fecha}
              onChange={(newValue) => {
                setFecha(newValue);
                setErrors({ ...errors, fecha: '' });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.fecha)}
                  helperText={errors.fecha}
                  InputProps={{
                    ...params.InputProps,
                    readOnly: true,
                  }}
                />
              )}
            />
          </LocalizationProvider>
          <TextField
            label="Producto"
            value={producto}
            onChange={(e) => {
              setProducto(e.target.value);
              setErrors({ ...errors, producto: '' });
            }}
            error={Boolean(errors.producto)}
            helperText={errors.producto}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Monto (USD)"
            value={monto}
            onChange={(e) => {
              setMonto(e.target.value);
              setErrors({ ...errors, monto: '' });
            }}
            type="number"
            error={Boolean(errors.monto)}
            helperText={errors.monto}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Plataforma"
            value={plataforma}
            onChange={(e) => {
              setPlataforma(e.target.value);
              setErrors({ ...errors, plataforma: '' });
            }}
            error={Boolean(errors.plataforma)}
            helperText={errors.plataforma}
            fullWidth
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editMode ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default IngresoFormDialog;


