// src/components/charts/SalesByProductChart.jsx

import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { CircularProgress, Box, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import axios from 'axios';

// Definir la URL base de la API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SalesByProductChart = () => {
  const [salesData, setSalesData] = useState({}); // Cambiamos a un objeto
  const [loading, setLoading] = useState(true); // Estado de carga
  const [products, setProducts] = useState([]); // Lista de productos
  const [platforms, setPlatforms] = useState([]); // Lista de plataformas
  const [selectedPlatform, setSelectedPlatform] = useState(''); // Plataforma seleccionada

  // Cargar las ventas
  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/ingresos/`);
        const data = response.data;

        if (!data || data.length === 0) {
          console.error('No sales data found');
          setSalesData({});
          setLoading(false);
          return;
        }

        // Filtrar los productos y plataformas únicos para los dropdowns
        const uniqueProducts = [...new Set(data.map((ingreso) => ingreso.producto))];
        const uniquePlatforms = [...new Set(data.map((ingreso) => ingreso.plataforma))];

        setProducts(uniqueProducts);
        setPlatforms(uniquePlatforms);

        // Filtrar datos por plataforma si se selecciona
        const filteredData = data.filter(
          (ingreso) => (selectedPlatform ? ingreso.plataforma === selectedPlatform : true)
        );

        // Crear un objeto para almacenar los ingresos por mes y producto
        const ingresosPorMesYProducto = {};

        // Inicializar el objeto para cada mes y producto
        for (let month = 0; month < 12; month++) {
          ingresosPorMesYProducto[month] = {};
          uniqueProducts.forEach((product) => {
            ingresosPorMesYProducto[month][product] = 0;
          });
        }

        // Acumular los ingresos por mes y producto
        filteredData.forEach((ingreso) => {
          if (ingreso.monto && ingreso.fecha) {
            const dateObj = new Date(ingreso.fecha);
            const correctedDate = new Date(dateObj);
            correctedDate.setDate(dateObj.getDate() + 1); // Solucionar el problema del día 1
            const month = correctedDate.getMonth();
            const product = ingreso.producto;
            ingresosPorMesYProducto[month][product] += ingreso.monto;
          }
        });

        setSalesData(ingresosPorMesYProducto);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [selectedPlatform]);

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

  // Generar colores para los productos
  const colorPalette = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#33FFF3', '#FFC300',
    '#DAF7A6', '#581845', '#C70039', '#900C3F', '#FF8D1A', '#1AFFD5',
    '#8DFF1A', '#1A1AFF', '#FF1A8D', '#1AFF8D', '#8D1AFF', '#FF1A1A',
    // Agrega más colores si tienes más productos
  ];

  const productColors = {};
  products.forEach((product, index) => {
    productColors[product] = colorPalette[index % colorPalette.length];
  });

  // Preparar los datos para Plotly
  const plotData = products.map((product) => {
    const yValues = months.map((_, monthIndex) => {
      return salesData[monthIndex] ? salesData[monthIndex][product] || 0 : 0;
    });

    return {
      x: months,
      y: yValues,
      type: 'bar',
      name: product,
      marker: {
        color: productColors[product],
      },
      hoverinfo: 'x+y',
      hoverlabel: {
        bgcolor: '#ffffff',
        font: { color: '#000000' },
      },
    };
  });

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)', mt: 6 }}>
      {/* Contenedor del dropdown de plataformas */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={4} md={3}>
          <FormControl fullWidth sx={{ backgroundColor: '#9b9b9b', borderRadius: '8px' }}>
            <InputLabel sx={{ color: 'white', fontWeight: 'bold' }}>Plataforma</InputLabel>
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

      {/* Gráfico de ventas por producto */}
      <Plot
        data={plotData}
        layout={{
          title: {
            text: 'Ventas Mensuales por Producto',
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
          barmode: 'stack',
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

export default SalesByProductChart;
