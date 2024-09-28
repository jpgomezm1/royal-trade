import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Box,
  useTheme,
} from '@mui/material';
import { StyledTableHead } from './StyledComponents';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const GastosTable = ({
  gastos,
  handleEditClick,
  handleDeleteClick,
}) => {
  // Asegúrate de obtener el tema desde el hook useTheme
  const theme = useTheme();

  return (
    <Box mt={4}>
      <Table
        sx={{
          minWidth: 650,
          backgroundColor: theme.palette.background.paper, // Aquí usamos el tema correctamente
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
        }}
      >
        <StyledTableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Concepto</TableCell>
            <TableCell>Monto (USD)</TableCell>
            <TableCell>Plataforma</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {gastos.map((gasto) => (
            <TableRow
              key={gasto.id}
              sx={{
                backgroundColor: theme.palette.action.hover,
                '&:hover': {
                  backgroundColor: theme.palette.action.selected,
                },
              }}
            >
              <TableCell sx={{ color: theme.palette.text.primary }}>
                {gasto.fecha}
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                {gasto.concepto}
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                {gasto.monto.toFixed(2)}
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                {gasto.plataforma}
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                {gasto.tipo}
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>
                {gasto.categoria}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => handleEditClick(gasto)}
                  color="primary"
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteClick(gasto)}
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

export default GastosTable;
