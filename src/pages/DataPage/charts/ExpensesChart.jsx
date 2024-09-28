import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { CircularProgress, Box, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import axios from 'axios';

// Definir la URL base de la API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ExpensesChart = () => {
  const [expensesData, setExpensesData] = useState([]); // Para almacenar los gastos por mes
  const [loading, setLoading] = useState(true); // Estado de carga
  const [categories, setCategories] = useState([]); // Lista de categorías de gastos
  const [platforms, setPlatforms] = useState([]); // Lista de plataformas
  const [selectedCategory, setSelectedCategory] = useState(''); // Categoría seleccionada
  const [selectedPlatform, setSelectedPlatform] = useState(''); // Plataforma seleccionada

  // Cargar los gastos
  useEffect(() => {
    const fetchExpensesData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/gastos/`);
        const data = response.data;

        if (!data || data.length === 0) {
          console.error('No expenses data found');
          setExpensesData([]);
          setLoading(false);
          return;
        }

        // Filtrar las categorías y plataformas únicas para los dropdowns
        const uniqueCategories = [...new Set(data.map((gasto) => gasto.categoria))];
        const uniquePlatforms = [...new Set(data.map((gasto) => gasto.plataforma))];

        setCategories(uniqueCategories);
        setPlatforms(uniquePlatforms);

        // Filtrar datos por categoría y plataforma si se seleccionan
        const filteredData = data.filter(
          (gasto) =>
            (selectedCategory ? gasto.categoria === selectedCategory : true) &&
            (selectedPlatform ? gasto.plataforma === selectedPlatform : true)
        );

        // Acumular los gastos por mes
        const gastosPorMes = Array(12).fill(0); // Inicializar array para los meses
        filteredData.forEach((gasto) => {
          if (gasto.monto && gasto.fecha) {
            const dateObj = new Date(gasto.fecha);
            const correctedDate = new Date(dateObj);
            correctedDate.setDate(dateObj.getDate() + 1); // Solucionar el problema del día 1
            const month = correctedDate.getMonth();
            gastosPorMes[month] += gasto.monto;
          }
        });

        setExpensesData(gastosPorMes);
      } catch (error) {
        console.error('Error fetching expenses data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpensesData();
  }, [selectedCategory, selectedPlatform]); // Vuelve a ejecutar si cambian la categoría o la plataforma

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
  const annotations = expensesData.map((value, index) => ({
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

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)', mt: 6 }}>
      {/* Contenedor de los dropdowns */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={4} md={3}>
          <FormControl fullWidth sx={{ backgroundColor: '#9b9b9b', borderRadius: '8px', color: 'white' }}>
            <InputLabel sx={{ color: 'white', fontWeight: 'bold' }}>Categoría</InputLabel> {/* Ajuste de color del label */}
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={4} md={3}>
          <FormControl fullWidth sx={{ backgroundColor: '#9b9b9b', borderRadius: '8px' }}>
            <InputLabel sx={{ color: 'white', fontWeight: 'bold' }}>Plataforma</InputLabel> {/* Ajuste de color del label */}
            <Select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <MenuItem value="">Todas</MenuItem>
              {platforms.map((platform) => (
                <MenuItem key={platform} value={platform}>
                  {platform}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Gráfico de gastos */}
      <Plot
        data={[
          {
            x: months,
            y: expensesData,
            type: 'bar',
            marker: {
              color: '#FF5733',
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
          title: {
            text: 'Gastos Mensuales',
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

export default ExpensesChart;
