import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import {
  CircularProgress,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Slider,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { startOfWeek, endOfWeek, format, parseISO, getWeek } from 'date-fns';

// Definir la URL base de la API
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const WeeklySalesChart = () => {
  const [salesData, setSalesData] = useState({
    weeks: [],
    ventas: [],
  });
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [weekRange, setWeekRange] = useState([0, 4]); // Mostrar las primeras 5 semanas por defecto

  // Cargar las ventas
  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/ingresos/`);
        const data = response.data;

        if (!data || data.length === 0) {
          console.error('No sales data found');
          setSalesData({ weeks: [], ventas: [] });
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

        // Crear un objeto para almacenar las ventas por semana
        const ventasPorSemana = {};

        filteredData.forEach((ingreso) => {
          if (ingreso.monto && ingreso.fecha) {
            const dateObj = parseISO(ingreso.fecha);

            // Obtener el inicio y fin de la semana
            const weekStart = startOfWeek(dateObj, { weekStartsOn: 1 }); // Semana comienza el lunes
            const weekEnd = endOfWeek(dateObj, { weekStartsOn: 1 }); // Semana termina el domingo

            const weekKey = format(weekStart, 'yyyy-MM-dd');

            if (!ventasPorSemana[weekKey]) {
              ventasPorSemana[weekKey] = {
                weekStart,
                weekEnd,
                total: 0,
              };
            }

            ventasPorSemana[weekKey].total += ingreso.monto;
          }
        });

        // Ordenar las semanas
        const sortedWeekKeys = Object.keys(ventasPorSemana).sort((a, b) => new Date(a) - new Date(b));

        const weeks = [];
        const ventas = [];

        sortedWeekKeys.forEach((weekKey) => {
          const weekData = ventasPorSemana[weekKey];
          const weekNumber = getWeek(weekData.weekStart, { weekStartsOn: 1 });
          const weekStartFormatted = format(weekData.weekStart, 'dd/MM');
          const weekEndFormatted = format(weekData.weekEnd, 'dd/MM');

          const label = `Semana ${weekNumber} (${weekStartFormatted} - ${weekEndFormatted})`;
          weeks.push(label);
          ventas.push(weekData.total);
        });

        setSalesData({
          weeks,
          ventas,
        });

        // Inicializar el rango de semanas
        setWeekRange([0, weeks.length - 1]);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [selectedProduct, selectedPlatform]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Filtrar semanas y ventas según el rango seleccionado
  const filteredWeeks = salesData.weeks.slice(weekRange[0], weekRange[1] + 1);
  const filteredVentas = salesData.ventas.slice(weekRange[0], weekRange[1] + 1);

  // Crear las anotaciones para cada barra
  const annotations = filteredVentas.map((value, index) => ({
    x: filteredWeeks[index],
    y: value,
    text: value.toLocaleString('es-CO', { style: 'currency', currency: 'USD' }),
    xanchor: 'center',
    yanchor: 'bottom',
    showarrow: false,
    font: {
      family: 'Poppins, sans-serif',
      size: 10,
      color: '#333',
    },
  }));

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
        mt: 6,
      }}
    >
      {/* Contenedor de los dropdowns */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={4} md={3}>
          <FormControl
            fullWidth
            sx={{ backgroundColor: '#9b9b9b', borderRadius: '8px', color: 'white' }}
          >
            <InputLabel sx={{ color: 'white', fontWeight: 'bold' }}>Producto</InputLabel>
            <Select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
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

      {/* Gráfico de ventas por semana */}
      <Plot
        data={[
          {
            x: filteredWeeks,
            y: filteredVentas,
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
            text: 'Ventas Semanales',
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
              size: 10,
              color: '#666666',
            },
            tickangle: filteredWeeks.length > 10 ? -45 : 0, // Rotar etiquetas si hay más de 10 semanas
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
            b: filteredWeeks.length > 10 ? 100 : 50, // Ajustar margen inferior
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

      {/* Control deslizante para seleccionar el rango de semanas */}
      <Box sx={{ mt: 3 }}>
        <Typography gutterBottom sx={{ color: 'black' }}>Seleccionar rango de semanas:</Typography>
        <Slider
          value={weekRange}
          onChange={(e, newValue) => setWeekRange(newValue)}
          valueLabelDisplay="auto"
          min={0}
          max={salesData.weeks.length - 1}
          sx={{ mb: 3 }}
        />
        <Typography sx={{ color: 'black' }}>Desde: {salesData.weeks[weekRange[0]]}</Typography>
        <Typography sx={{ color: 'black' }}>Hasta: {salesData.weeks[weekRange[1]]}</Typography>
      </Box>
    </Box>
  );
};

export default WeeklySalesChart;
