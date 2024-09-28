import React from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { StyledDialog } from './StyledComponents';

const ConfirmDeleteDialog = ({
  open,
  handleCancelDelete,
  handleConfirmDelete,
  ingresoToDelete,
}) => {
  return (
    <StyledDialog open={open} onClose={handleCancelDelete}>
      <DialogTitle>Confirmar Eliminación</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Estás seguro de que deseas eliminar el ingreso{' '}
          <strong>{ingresoToDelete?.producto}</strong>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelDelete}>Cancelar</Button>
        <Button
          onClick={handleConfirmDelete}
          variant="contained"
          color="error"
        >
          Eliminar
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default ConfirmDeleteDialog;


