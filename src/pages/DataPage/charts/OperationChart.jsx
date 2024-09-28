import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { CircularProgress, Box } from '@mui/material';
import axios from 'axios';

// Definir la URL base de la API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const OperationChart = () => {
  const [operationData, setOperationData] = useState([]); // Para almacenar la utilidad mensual
  const [loading, setLoading] = useState(true); // Estado de carga

  // Cargar los ingresos y gastos
  useEffect(() => {
    const fetchOperationData = async () => {
      setLoading(true);
      try {
        // Obtener los ingresos
        const ingresosResponse = await axios.get(`${API_BASE_URL}/ingresos/`);
        const ingresosData = ingresosResponse.data;

        // Obtener los gastos
        const gastosResponse = await axios.get(`${API_BASE_URL}/gastos/`);
        const gastosData = gastosResponse.data;

        // Calcular los ingresos por mes
        const ingresosPorMes = Array(12).fill(0);
        ingresosData.forEach((ingreso) => {
          if (ingreso.monto && ingreso.fecha) {
            const dateObj = new Date(ingreso.fecha);
            // Ajustar para solucionar el problema del día 1
            const correctedDate = new Date(dateObj);
            correctedDate.setDate(dateObj.getDate() + 1); // Sumar 1 día para corregir el primer día del mes
            const month = correctedDate.getMonth(); // Obtener el mes corregido
            ingresosPorMes[month] += ingreso.monto;
          }
        });

        // Calcular los gastos por mes
        const gastosPorMes = Array(12).fill(0);
        gastosData.forEach((gasto) => {
          if (gasto.monto && gasto.fecha) {
            const dateObj = new Date(gasto.fecha);
            // Ajustar para solucionar el problema del día 1
            const correctedDate = new Date(dateObj);
            correctedDate.setDate(dateObj.getDate() + 1); // Sumar 1 día para corregir el primer día del mes
            const month = correctedDate.getMonth(); // Obtener el mes corregido
            gastosPorMes[month] += gasto.monto;
          }
        });

        // Calcular la utilidad por mes (Ingresos - Gastos)
        const utilidadPorMes = ingresosPorMes.map((ingreso, index) => ingreso - gastosPorMes[index]);

        setOperationData(utilidadPorMes);
      } catch (error) {
        console.error('Error fetching operation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOperationData();
  }, []); // Ejecutar una sola vez al montar el componente

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Crear las anotaciones para cada barra
  const annotations = operationData.map((value, index) => ({
    x: months[index],
    y: value,
    text: value.toLocaleString('es-CO', { style: 'currency', currency: 'USD' }),
    xanchor: 'center',
    yanchor: 'bottom',
    showarrow: false,
    font: {
      family: 'Poppins, sans-serif',
      size: 14,
      color: '#333',
    },
  }));

  // Definir los colores de las barras (verde para positivo, rojo para negativo)
  const barColors = operationData.map(value => value >= 0 ? '#28A745' : '#FF5733');

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)', mt: 6 }}>
      {/* Gráfico de utilidad mensual */}
      <Plot
        data={[
          {
            x: months,
            y: operationData,
            type: 'bar',
            marker: {
              color: barColors, // Usar el array de colores para cada barra
              opacity: 0.8,
              line: {
                color: barColors.map(color => color === '#28A745' ? '#1E7E34' : '#C0392B'), // Verde para positivo, rojo para negativo
                width: 2,
              },
            },
            hoverinfo: 'x+y',
            hoverlabel: {
              bgcolor: '#ffffff',
              font: { color: '#000000' },
            },
          },
        ]}
        layout={{
          title: {
            text: 'Utilidad Mensual (Ingresos - Gastos)',
            font: {
              family: 'Poppins, sans-serif',
              size: 30,
              color: '#333333',
              weight: 'bold',
            },
            xref: 'paper',
            x: 0.5,
            xanchor: 'center',
          },
          plot_bgcolor: 'transparent',
          paper_bgcolor: 'transparent',
          xaxis: {
            showgrid: false,
            tickfont: {
              family: 'Roboto, sans-serif',
              size: 14,
              color: '#666666',
            },
          },
          yaxis: {
            showgrid: true,
            gridcolor: '#eaeaea',
            tickfont: {
              family: 'Roboto, sans-serif',
              size: 14,
              color: '#666666',
            },
          },
          margin: {
            l: 60,
            r: 30,
            b: 50,
            t: 50,
          },
          hovermode: 'closest',
          height: 400,
          annotations: annotations,
        }}
        style={{ width: '100%' }}
        config={{
          responsive: true,
          displayModeBar: false,
        }}
      />
    </Box>
  );
};

export default OperationChart;


