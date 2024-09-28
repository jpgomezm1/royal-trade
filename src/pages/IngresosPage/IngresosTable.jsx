import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Box,
} from '@mui/material';
import { StyledTableHead } from './StyledComponents';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const IngresosTable = ({
  ingresos,
  handleEditClick,
  handleDeleteClick,
  theme,
}) => {
  return (
    <Box mt={4}>
      <Table
        sx={{
          minWidth: 650,
          backgroundColor: theme.palette.background.paper,
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
        }}
      >
        <StyledTableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Producto</TableCell>
            <TableCell>Monto (USD)</TableCell>
            <TableCell>Plataforma</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {ingresos.map((ingreso) => (
            <TableRow
              key={ingreso.id}
              sx={{
                backgroundColor: theme.palette.action.hover,
                '&:hover': {
                  backgroundColor: theme.palette.action.selected,
                },
              }}
            >
              <TableCell sx={{ color: theme.palette.text.primary }}>
                {ingreso.fecha}
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                {ingreso.producto}
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                {ingreso.monto.toFixed(2)}
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                {ingreso.plataforma}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => handleEditClick(ingreso)}
                  color="primary"
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteClick(ingreso)}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default IngresosTable;


