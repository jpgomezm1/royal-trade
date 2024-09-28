// src/components/DataPage.jsx

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, AppBar, CircularProgress } from '@mui/material';
import TabPanel from './TabPanel'; // Importar el componente TabPanel para gestionar el contenido de las pestañas
import SalesChart from './charts/SalesChart';
import ExpensesChart from './charts/ExpensesChart';
import OperationChart from './charts/OperationChart'; // Gráfico de utilidad
import MarginChart from './charts/MarginChart'; // Gráfico de margen
import IncomeExpensesComparisonChart from './charts/IncomeExpensesComparisonChart'; // Importar el nuevo gráfico
import ExpensesByCategoryChart from './charts/ExpensesByCategoryChart';
import SalesByProductChart from './charts/SalesByProductChart';
import WeeklySalesChart from './charts/WeeklySalesChart';

const DataPage = () => {
  const [currentTab, setCurrentTab] = useState(0); // Estado para controlar la pestaña activa
  const [loading, setLoading] = useState(false);   // Estado de carga

  // Función para cambiar de pestaña
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ padding: 2, borderRadius: 2, maxWidth: '1200px', margin: '0 auto', width: '100%', mt: 5 }}>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: 'transparent', 
          boxShadow: 'none', 
          borderBottom: '2px solid #03DAC6' 
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="tabs"
          TabIndicatorProps={{ 
            style: { 
              backgroundColor: '#03DAC6', 
              height: '3px', 
              borderRadius: '1.5px' // Borde redondeado del indicador
            } 
          }}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              color: '#A6A6A6',
              padding: '12px 24px',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                color: '#5E55FE',
                backgroundColor: 'rgba(94, 85, 254, 0.1)',
                borderRadius: '8px',
              },
              '&.Mui-selected': {
                color: '#FFFFFF',
                backgroundColor: '#03DAC6',
                borderRadius: '8px',
              },
            },
            '& .MuiTabs-flexContainer': {
              gap: '12px',
            },
          }}
        >
          <Tab label="Ingresos" />
          <Tab label="Gastos" />
          <Tab label="Operación" />
        </Tabs>
      </AppBar>

      {/* Pestaña Ingresos */}
      <TabPanel value={currentTab} index={0}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box>
            <SalesChart />
            <SalesByProductChart />
            <WeeklySalesChart />
          </Box>
        )}
      </TabPanel>

      {/* Pestaña Gastos */}
      <TabPanel value={currentTab} index={1}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box>
            <ExpensesChart /> 
            <ExpensesByCategoryChart /> 
          </Box>
        )}
      </TabPanel>

      {/* Pestaña Operación */}
      <TabPanel value={currentTab} index={2}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Box>
            <OperationChart />
            <MarginChart />  
            <IncomeExpensesComparisonChart /> 
          </Box>
        )}
      </TabPanel>
    </Box>
  );
};

export default DataPage;


