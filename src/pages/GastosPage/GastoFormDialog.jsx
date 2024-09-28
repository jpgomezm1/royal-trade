import React from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StyledDialog } from './StyledComponents';

const GastoFormDialog = ({
  open,
  handleClose,
  handleSubmit,
  fecha,
  setFecha,
  concepto,
  setConcepto,
  monto,
  setMonto,
  plataforma,
  setPlataforma,
  tipo,
  setTipo,
  categoria,
  setCategoria,
  errors,
  setErrors,
}) => {
  return (
    <StyledDialog open={open} onClose={handleClose}>
      <DialogTitle>Agregar Gasto</DialogTitle>
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
            label="Concepto"
            value={concepto}
            onChange={(e) => {
              setConcepto(e.target.value);
              setErrors({ ...errors, concepto: '' });
            }}
            error={Boolean(errors.concepto)}
            helperText={errors.concepto}
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

          {/* Selector para el campo Tipo */}
          <FormControl fullWidth margin="normal" error={Boolean(errors.tipo)}>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value);
                setErrors({ ...errors, tipo: '' });
              }}
              label="Tipo"
            >
              <MenuItem value="Fijo">Fijo</MenuItem>
              <MenuItem value="Variable">Variable</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Categoría"
            value={categoria}
            onChange={(e) => {
              setCategoria(e.target.value);
              setErrors({ ...errors, categoria: '' });
            }}
            error={Boolean(errors.categoria)}
            helperText={errors.categoria}
            fullWidth
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default GastoFormDialog;
