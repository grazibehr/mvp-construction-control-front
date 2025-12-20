import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Alert,
  Grid,
  MenuItem,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { DatePicker } from '@mui/x-date-pickers';
import {
  ArrowBackOutlined,
  AddOutlined,
  DeleteOutlined,
  AttachMoneyOutlined,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useProjects } from '../context/ProjectContext';
import { formatCurrency, formatCurrencyInput, parseCurrencyInput, categoryNames } from '../utils/formatters';
import { CustomCard, CustomButton, CustomTextField } from '../components/ui';

const ExpenseControl = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById, addExpense, removeExpense, loading: contextLoading } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    category: 'material',
    amount: '',
    date: dayjs(),
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const project = useMemo(() => {
    if (contextLoading) return null;
    return getProjectById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, contextLoading, refreshKey]);

  const expenses = useMemo(() => {
    return project?.expenses || [];
  }, [project]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseCurrencyInput(value);
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      date: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newExpense = {
      description: formData.description,
      category: formData.category,
      amount: parseFloat(formData.amount),
      date: formData.date.format('YYYY-MM-DD'),
    };

    addExpense(id, newExpense);
    setRefreshKey((k) => k + 1);

    setFormData({
      description: '',
      category: 'material',
      amount: '',
      date: dayjs(),
    });
    setShowForm(false);
    setAlert({
      type: 'success',
      message: 'Despesa adicionada com sucesso!',
    });
  };

  const handleDeleteExpense = (expenseId) => {
    removeExpense(id, expenseId);
    setRefreshKey((k) => k + 1);

    setAlert({
      type: 'success',
      message: 'Despesa removida com sucesso!',
    });
  };

  if (!project) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Projeto não encontrado</Alert>
      </Box>
    );
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = project.budget - totalSpent;
  const percentUsed = (totalSpent / project.budget) * 100;

  const columns = [
    {
      field: 'date',
      headerName: 'Data',
      width: 120,
      valueFormatter: (value) => dayjs(value).format('DD/MM/YYYY'),
    },
    {
      field: 'description',
      headerName: 'Descrição',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'category',
      headerName: 'Categoria',
      width: 150,
      valueGetter: (value) => categoryNames[value] || value,
    },
    {
      field: 'amount',
      headerName: 'Valor',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      valueFormatter: (value) => formatCurrency(value),
    },
    {
      field: 'actions',
      headerName: '',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton size="small" color="error" onClick={() => handleDeleteExpense(params.row.id)}>
          <DeleteOutlined />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <CustomButton variant="text" startIcon={<ArrowBackOutlined />} onClick={() => navigate(`/project/${id}`)} sx={{ mb: 2 }}>
          Voltar
        </CustomButton>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Controle de Gastos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {project.name}
        </Typography>
      </Box>

      {alert && (
        <Alert severity={alert.type} onClose={() => setAlert(null)} sx={{ mb: 3 }}>
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <CustomCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <AttachMoneyOutlined color="primary" />
              <Typography variant="body2" color="text.secondary">
                Orçamento Total
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {formatCurrency(project.budget)}
            </Typography>
          </CustomCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <AttachMoneyOutlined color="error" />
              <Typography variant="body2" color="text.secondary">
                Total Gasto
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
              {formatCurrency(totalSpent)}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(percentUsed, 100)}
              sx={{
                mt: 2,
                height: 8,
                borderRadius: 4,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'),
              }}
              color={percentUsed > 100 ? 'error' : 'primary'}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {percentUsed.toFixed(1)}% utilizado
            </Typography>
          </CustomCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <CustomCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <AttachMoneyOutlined color={remaining >= 0 ? 'success' : 'error'} />
              <Typography variant="body2" color="text.secondary">
                Restante
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: remaining >= 0 ? 'success.main' : 'error.main' }}>
              {formatCurrency(remaining)}
            </Typography>
          </CustomCard>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <CustomButton
          variant="primary"
          startIcon={<AddOutlined />}
          onClick={() => setShowForm(true)}
        >
          Adicionar Despesa
        </CustomButton>
      </Box>

      <CustomCard padding={0} sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={expenses}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-footerContainer': {
              borderTop: 2,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            },
          }}
        />
      </CustomCard>

      <Box
        sx={{
          mt: 2,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Total de Despesas: {expenses.length}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Total: {formatCurrency(totalSpent)}
        </Typography>
      </Box>

      <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Adicionar Nova Despesa</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <CustomTextField
                required
                name="description"
                label="Descrição"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ex: Compra de cimento"
              />

              <CustomTextField
                required
                select
                name="category"
                label="Categoria"
                value={formData.category}
                onChange={handleInputChange}
              >
                <MenuItem value="material">Material</MenuItem>
                <MenuItem value="mao_de_obra">Mão de Obra</MenuItem>
                <MenuItem value="equipamentos">Equipamentos</MenuItem>
                <MenuItem value="fundacao">Fundação</MenuItem>
                <MenuItem value="infraestrutura">Infraestrutura</MenuItem>
                <MenuItem value="projeto">Projeto</MenuItem>
                <MenuItem value="licencas">Licenças</MenuItem>
                <MenuItem value="acabamento">Acabamento</MenuItem>
              </CustomTextField>

              <CustomTextField
                required
                name="amount"
                label="Valor"
                value={formatCurrencyInput(formData.amount)}
                onChange={handleCurrencyChange}
                prefix="R$"
                placeholder="0,00"
              />

              <DatePicker
                label="Data"
                value={formData.date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <CustomButton variant="text" onClick={() => setShowForm(false)}>Cancelar</CustomButton>
            <CustomButton type="submit" variant="primary">
              Adicionar
            </CustomButton>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ExpenseControl;
