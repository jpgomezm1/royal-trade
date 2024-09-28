import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { CircularProgress, Box } from '@mui/material';
import axios from 'axios';

// Definir la URL base de la API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const IncomeExpensesComparisonChart = () => {
  const [incomeData, setIncomeData] = useState([]); // Ingresos mensuales
  const [expensesData, setExpensesData] = useState([]); // Gastos mensuales
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchData = async () => {
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
            const correctedDate = new Date(dateObj);
            correctedDate.setDate(dateObj.getDate() + 1); // Sumar 1 día para corregir el primer día del mes
            const month = correctedDate.getMonth();
            ingresosPorMes[month] += ingreso.monto;
          }
        });

        // Calcular los gastos por mes
        const gastosPorMes = Array(12).fill(0);
        gastosData.forEach((gasto) => {
          if (gasto.monto && gasto.fecha) {
            const dateObj = new Date(gasto.fecha);
            const correctedDate = new Date(dateObj);
            correctedDate.setDate(dateObj.getDate() + 1); // Sumar 1 día para corregir el primer día del mes
            const month = correctedDate.getMonth();
            gastosPorMes[month] += gasto.monto;
          }
        });

        setIncomeData(ingresosPorMes);
        setExpensesData(gastosPorMes);
      } catch (error) {
        console.error('Error fetching income and expenses data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)', mt: 6 }}>
      {/* Gráfico comparativo de ingresos y gastos */}
      <Plot
        data={[
          {
            x: months,
            y: incomeData,
            type: 'bar',
            name: 'Ingresos',
            marker: {
              color: '#28A745', // Verde para ingresos
              opacity: 0.8,
              line: {
                color: '#1E7E34',
                width: 2,
              },
            },
            hoverinfo: 'x+y',
            hoverlabel: {
              bgcolor: '#ffffff',
              font: { color: '#000000' },
            },
          },
          {
            x: months,
            y: expensesData,
            type: 'bar',
            name: 'Gastos',
            marker: {
              color: '#FF5733', // Rojo para gastos
              opacity: 0.8,
              line: {
                color: '#C0392B',
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
          barmode: 'group', // Agrupar las barras lado a lado
          title: {
            text: 'Comparación Mensual de Ingresos y Gastos',
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
          legend: {
            orientation: 'h',
            x: 0.5,
            xanchor: 'center',
            y: -0.2,
            font: {
              family: 'Poppins, sans-serif',
              size: 14,
              color: '#333333',
            },
          },
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

export default IncomeExpensesComparisonChart;
