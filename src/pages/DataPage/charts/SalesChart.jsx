import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { CircularProgress, Box, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import axios from 'axios';

// Definir la URL base de la API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]); // Para almacenar los ingresos por mes
  const [loading, setLoading] = useState(true); // Estado de carga
  const [products, setProducts] = useState([]); // Lista de productos
  const [platforms, setPlatforms] = useState([]); // Lista de plataformas
  const [selectedProduct, setSelectedProduct] = useState(''); // Producto seleccionado
  const [selectedPlatform, setSelectedPlatform] = useState(''); // Plataforma seleccionada

  // Cargar los ingresos
  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/ingresos/`);
        const data = response.data;

        if (!data || data.length === 0) {
          console.error('No sales data found');
          setSalesData([]);
          setLoading(false);
          return;
        }

        // Filtrar los productos y plataformas únicos para los dropdowns
        const uniqueProducts = [...new Set(data.map((ingreso) => ingreso.producto))];
        const uniquePlatforms = [...new Set(data.map((ingreso) => ingreso.plataforma))];

        setProducts(uniqueProducts);
        setPlatforms(uniquePlatforms);

        // Filtrar datos por producto y plataforma si se seleccionan
        const filteredData = data.filter(
          (ingreso) =>
            (selectedProduct ? ingreso.producto === selectedProduct : true) &&
            (selectedPlatform ? ingreso.plataforma === selectedPlatform : true)
        );

        // Acumular los ingresos por mes
        const ingresosPorMes = Array(12).fill(0); // Inicializar array para los meses
        filteredData.forEach((ingreso) => {
          if (ingreso.monto && ingreso.fecha) {
            const dateObj = new Date(ingreso.fecha);
            const correctedDate = new Date(dateObj);
            correctedDate.setDate(dateObj.getDate() + 1); // Solucionar el problema del día 1
            const month = correctedDate.getMonth();
            ingresosPorMes[month] += ingreso.monto;
          }
        });

        setSalesData(ingresosPorMes);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [selectedProduct, selectedPlatform]); // Vuelve a ejecutar si cambian el producto o la plataforma

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
  const annotations = salesData.map((value, index) => ({
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
            <InputLabel sx={{ color: 'white', fontWeight: 'bold' }}>Producto</InputLabel>
            <Select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {products.map((product) => (
                <MenuItem key={product} value={product}>
                  {product}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

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

      {/* Gráfico de ingresos */}
      <Plot
        data={[
          {
            x: months,
            y: salesData,
            type: 'bar',
            marker: {
              color: '#52B86A',
              opacity: 0.8,
              line: {
                color: '#52B86A',
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
            text: 'Ingresos Mensuales',
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

export default SalesChart;


