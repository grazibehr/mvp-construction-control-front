import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  LinearProgress,
  Chip,
  MenuItem,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  IconButton,
  Slider,
  Collapse,
  Fade,
  Snackbar,
  Paper,
  TextField,
  Divider,
} from '@mui/material';
import {
  ArrowBackOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  CloudUploadOutlined,
  AttachMoneyOutlined,
  CalendarTodayOutlined,
  GroupOutlined,
  LocationOnOutlined,
  BusinessOutlined,
  DescriptionOutlined,
  TrendingUpOutlined,
  CheckCircle,
  Error as ErrorIcon,
  HelpOutline,
  PhotoCameraOutlined,
  EngineeringOutlined,
  ArchitectureOutlined,
  GroupsOutlined,
  FlagOutlined,
  InfoOutlined,
  Warning,
  Close,
  DeleteOutline,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useProjects } from '../context/ProjectContext';
import { formatCurrency, formatCurrencyInput, parseCurrencyInput, categoryNames } from '../utils/formatters';
import { CustomCard, CustomButton, CustomTextField } from '../components/ui';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById, updateProject, deleteProject, addExpense, removeExpense, loading: contextLoading } = useProjects();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [activeSection, setActiveSection] = useState(0);

  // Estados para modal de adicionar despesa
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    category: 'material',
    amount: '',
  });
  const [expensePage, setExpensePage] = useState(0);
  const expensesPerPage = 5;

  useEffect(() => {
    if (contextLoading) {
      setLoading(true);
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 600));
        const foundProject = getProjectById(id);

        if (foundProject) {
          setProject(foundProject);
        } else {
          setAlert({
            type: 'error',
            message: 'Projeto não encontrado'
          });
          setTimeout(() => navigate('/projects'), 2000);
        }
      } catch {
        setAlert({
          type: 'error',
          message: 'Erro ao carregar detalhes do projeto'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate, getProjectById, contextLoading]);

  const changesMade = useMemo(() => {
    if (!editedProject || !project) return 0;
    let changes = 0;
    const fieldsToCheck = ['name', 'description', 'location', 'budget', 'spent', 'startDate', 'expectedEndDate', 'status', 'progress'];
    fieldsToCheck.forEach(field => {
      if (editedProject[field] !== project[field]) changes++;
    });
    if (editedProject.team?.engineer !== project.team?.engineer) changes++;
    if (editedProject.team?.architect !== project.team?.architect) changes++;
    if (editedProject.team?.workers !== project.team?.workers) changes++;
    if (previewImage && previewImage !== project.image) changes++;
    return changes;
  }, [editedProject, project, previewImage]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status) => {
    const colors = {
      'em_andamento': 'primary',
      'concluido': 'success',
      'planejamento': 'warning',
      'pausado': 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      'em_andamento': 'Em Andamento',
      'concluido': 'Concluído',
      'planejamento': 'Planejamento',
      'pausado': 'Pausado'
    };
    return texts[status] || status;
  };

  const handleEdit = () => {
    setEditedProject({ ...project });
    setPreviewImage(project.image);
    setIsEditing(true);
    setErrors({});
    setTouched({});
    setActiveSection(0);
  };

  const handleTryCancelEdit = () => {
    if (changesMade > 0) {
      setShowCancelModal(true);
    } else {
      handleCancelEdit();
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProject(null);
    setPreviewImage(null);
    setErrors({});
    setTouched({});
    setShowCancelModal(false);
  };

  const handleDelete = () => {
    deleteProject(id);
    setShowDeleteModal(false);
    navigate('/projects');
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value?.trim()) {
          newErrors.name = 'Nome é obrigatório';
        } else if (value.trim().length < 3) {
          newErrors.name = 'Mínimo de 3 caracteres';
        } else {
          delete newErrors.name;
        }
        break;
      case 'description':
        if (!value?.trim()) {
          newErrors.description = 'Descrição é obrigatória';
        } else if (value.trim().length < 10) {
          newErrors.description = 'Mínimo de 10 caracteres';
        } else {
          delete newErrors.description;
        }
        break;
      case 'location':
        if (!value?.trim()) {
          newErrors.location = 'Localização é obrigatória';
        } else {
          delete newErrors.location;
        }
        break;
      case 'budget':
        if (!value || parseFloat(value) <= 0) {
          newErrors.budget = 'Orçamento deve ser maior que zero';
        } else {
          delete newErrors.budget;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[name];
  };

  const isFieldValid = (name) => {
    const value = editedProject?.[name];
    const hasValue = value !== '' && value !== null && value !== undefined;
    const hasNoError = !errors[name];
    return hasValue && hasNoError && touched[name];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({
      ...prev,
      [name]: name === 'budget' || name === 'spent' ? parseFloat(value) || 0 : value
    }));
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleTeamChange = (e) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({
      ...prev,
      team: {
        ...prev.team,
        [name]: name === 'workers' ? parseInt(value) || 0 : value
      }
    }));
  };

  // Handler para campos de moeda
  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseCurrencyInput(value);
    setEditedProject(prev => ({
      ...prev,
      [name]: numericValue
    }));
    if (touched[name]) {
      validateField(name, numericValue);
    }
  };

  const handleProgressChange = (event, newValue) => {
    setEditedProject(prev => ({
      ...prev,
      progress: newValue
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Imagem muito grande. Máximo 5MB.',
          severity: 'error'
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setEditedProject(prev => ({ ...prev, image: reader.result }));
        setSnackbar({
          open: true,
          message: 'Imagem atualizada!',
          severity: 'success'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAllFields = () => {
    const requiredFields = ['name', 'description', 'location', 'budget'];
    let isValid = true;

    requiredFields.forEach(field => {
      setTouched(prev => ({ ...prev, [field]: true }));
      if (!validateField(field, editedProject[field])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleTrySave = () => {
    if (!validateAllFields()) {
      setAlert({
        type: 'error',
        message: 'Por favor, corrija os erros antes de salvar'
      });
      return;
    }
    setShowSaveModal(true);
  };

  const handleSave = async () => {
    setShowSaveModal(false);
    setSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateProject(id, editedProject);

      setProject(editedProject);
      setIsEditing(false);
      setEditedProject(null);
      setPreviewImage(null);

      setAlert({
        type: 'success',
        message: 'Projeto atualizado com sucesso!'
      });
    } catch {
      setAlert({
        type: 'error',
        message: 'Erro ao salvar projeto'
      });
    } finally {
      setSaving(false);
    }
  };

  // Funções do modal de despesa
  const handleExpenseInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = () => {
    if (!expenseForm.description || !expenseForm.amount) {
      setSnackbar({ open: true, message: 'Preencha todos os campos', severity: 'warning' });
      return;
    }

    const newExpense = {
      description: expenseForm.description,
      category: expenseForm.category,
      amount: parseFloat(expenseForm.amount),
      date: new Date().toISOString().split('T')[0],
    };

    addExpense(id, newExpense);

    // Atualizar o projeto local
    const updatedProject = getProjectById(id);
    setProject(updatedProject);

    setExpenseForm({ description: '', category: 'material', amount: '' });
    setShowExpenseModal(false);
    setSnackbar({ open: true, message: 'Despesa adicionada com sucesso!', severity: 'success' });
  };

  const handleDeleteExpense = (expenseId) => {
    removeExpense(id, expenseId);
    const updatedProject = getProjectById(id);
    setProject(updatedProject);
    setSnackbar({ open: true, message: 'Despesa removida!', severity: 'success' });
  };

  // eslint-disable-next-line no-unused-vars
  const SectionHeader = ({ icon: Icon, title, subtitle, isComplete }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
        pb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            background: isComplete
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isComplete
              ? '0 4px 15px rgba(16, 185, 129, 0.4)'
              : '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
          }}
        >
          {isComplete ? (
            <CheckCircle sx={{ color: 'white', fontSize: 24 }} />
          ) : (
            <Icon sx={{ color: 'white', fontSize: 24 }} />
          )}
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Box>
      {isComplete && (
        <Chip
          icon={<CheckCircle sx={{ fontSize: 16 }} />}
          label="Completo"
          color="success"
          size="small"
          variant="outlined"
        />
      )}
    </Box>
  );

  const ValidatedTextField = ({ name, required, tooltip, ...props }) => {
    const showSuccess = isFieldValid(name) && required;
    const showError = !!errors[name] && touched[name];

    return (
      <TextField
        name={name}
        value={editedProject?.[name] || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        error={showError}
        required={required}
        {...props}
        InputProps={{
          ...props.InputProps,
          endAdornment: (
            <>
              {props.InputProps?.endAdornment}
              {showSuccess && (
                <InputAdornment position="end">
                  <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                </InputAdornment>
              )}
              {showError && (
                <InputAdornment position="end">
                  <ErrorIcon sx={{ color: 'error.main', fontSize: 20 }} />
                </InputAdornment>
              )}
              {tooltip && !showSuccess && !showError && (
                <InputAdornment position="end">
                  <Tooltip title={tooltip} arrow placement="top">
                    <IconButton size="small" tabIndex={-1}>
                      <HelpOutline sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )}
            </>
          ),
          sx: {
            ...props.InputProps?.sx,
            transition: 'all 0.2s ease',
            ...(showSuccess && {
              '& fieldset': {
                borderColor: 'success.main',
              },
            }),
          },
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Carregando detalhes do projeto...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Projeto não encontrado</Alert>
      </Box>
    );
  }

  const budgetPercentage = (project.spent / project.budget) * 100;
  const isOverBudget = budgetPercentage > 100;
  const remaining = project.budget - project.spent;

  return (
    <Box>
      
      <Collapse in={!!alert}>
        <Alert
          severity={alert?.type}
          onClose={() => setAlert(null)}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {alert?.message}
        </Alert>
      </Collapse>

      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CustomButton
          variant="outlined"
          startIcon={<ArrowBackOutlined />}
          onClick={() => navigate('/projects')}
        >
          Voltar
        </CustomButton>
        {!isEditing && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <CustomButton
              variant="primary"
              startIcon={<EditOutlined />}
              onClick={handleEdit}
            >
              Editar Projeto
            </CustomButton>
            <CustomButton
              variant="error"
              onClick={() => setShowDeleteModal(true)}
            >
              Excluir
            </CustomButton>
          </Box>
        )}
      </Box>

      {!isEditing && (
        <CustomCard sx={{ mb: 4, position: 'relative', overflow: 'hidden' }} padding={0}>
          <Box
            sx={{
              height: 300,
              backgroundImage: `url(${project.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
              },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                zIndex: 1,
                color: 'white',
              }}
            >
              <Chip
                label={getStatusText(project.status)}
                color={getStatusColor(project.status)}
                sx={{ mb: 2 }}
              />
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {project.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnOutlined fontSize="small" />
                <Typography variant="body1">{project.location}</Typography>
              </Box>
            </Box>
          </Box>
        </CustomCard>
      )}

      {isEditing && editedProject && (
        <Fade in={isEditing}>
          <Box sx={{ mb: 4 }}>
            <CustomCard padding={{ xs: 2, md: 4 }}>
              {/* Header */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EditOutlined sx={{ color: "white", fontSize: 24 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Editar Projeto
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {changesMade > 0
                      ? `${changesMade} ${changesMade === 1 ? 'alteração pendente' : 'alterações pendentes'}`
                      : 'Atualize os dados do projeto'}
                  </Typography>
                </Box>
                <Chip
                  label={`${changesMade} alterações`}
                  color={changesMade > 0 ? "warning" : "default"}
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Seção: Imagem do Projeto */}
              <Typography
                variant="overline"
                sx={{ fontWeight: 600, color: "text.secondary", letterSpacing: 1 }}
              >
                Imagem do Projeto
              </Typography>

              <Box
                sx={{
                  height: 200,
                  backgroundImage: `url(${previewImage || editedProject.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '8px',
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  border: '2px dashed',
                  borderColor: 'divider',
                  mt: 1,
                  mb: 4,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    '& .upload-overlay': {
                      opacity: 1,
                    },
                  },
                }}
              >
                <Box
                  className="upload-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                  }}
                >
                  <label htmlFor="image-upload-edit" style={{ cursor: 'pointer', textAlign: 'center' }}>
                    <CloudUploadOutlined sx={{ fontSize: 48, color: 'white', mb: 1 }} />
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                      Clique para alterar imagem
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      JPG, PNG ou GIF (máx. 5MB)
                    </Typography>
                  </label>
                  <input
                    id="image-upload-edit"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </Box>
              </Box>

              {/* Seção: Informações do Projeto */}
              <Typography
                variant="overline"
                sx={{ fontWeight: 600, color: "text.secondary", letterSpacing: 1 }}
              >
                Informações do Projeto
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                  gap: 2.5,
                  mt: 1,
                  mb: 4,
                }}
              >
                <CustomTextField
                  required
                  name="name"
                  label="Nome do Projeto"
                  placeholder="Ex: Edifício Residencial Solar"
                  value={editedProject.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.name && touched.name}
                  helperText={errors.name && touched.name ? errors.name : ""}
                />
                <CustomTextField
                  required
                  name="budget"
                  label="Orçamento (R$)"
                  placeholder="0,00"
                  value={formatCurrencyInput(editedProject.budget)}
                  onChange={handleCurrencyChange}
                  onBlur={handleBlur}
                  error={!!errors.budget && touched.budget}
                  helperText={
                    errors.budget && touched.budget
                      ? errors.budget
                      : editedProject.budget
                      ? formatCurrency(editedProject.budget)
                      : ""
                  }
                />
                <CustomTextField
                  required
                  name="location"
                  label="Localização da Obra"
                  placeholder="Endereço completo"
                  value={editedProject.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.location && touched.location}
                  helperText={
                    errors.location && touched.location ? errors.location : ""
                  }
                />
                <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
                  <CustomTextField
                    required
                    multiline
                    rows={3}
                    name="description"
                    label="Descrição do Projeto"
                    placeholder="Descreva os objetivos e escopo do projeto..."
                    value={editedProject.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.description && touched.description}
                    helperText={
                      errors.description && touched.description
                        ? errors.description
                        : ""
                    }
                  />
                </Box>
              </Box>

              {/* Seção: Cronograma e Status */}
              <Typography
                variant="overline"
                sx={{ fontWeight: 600, color: "text.secondary", letterSpacing: 1 }}
              >
                Cronograma e Status
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                  gap: 2.5,
                  mt: 1,
                  mb: 4,
                }}
              >
                <CustomTextField
                  type="date"
                  name="startDate"
                  label="Data de Início"
                  value={editedProject.startDate || ''}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
                <CustomTextField
                  type="date"
                  name="expectedEndDate"
                  label="Previsão de Término"
                  value={editedProject.expectedEndDate || ''}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
                <CustomTextField
                  select
                  name="status"
                  label="Status"
                  value={editedProject.status || 'planejamento'}
                  onChange={handleChange}
                >
                  <MenuItem value="planejamento">Planejamento</MenuItem>
                  <MenuItem value="em_andamento">Em Andamento</MenuItem>
                  <MenuItem value="concluido">Concluído</MenuItem>
                  <MenuItem value="pausado">Pausado</MenuItem>
                </CustomTextField>
              </Box>

              {/* Seção: Progresso */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Progresso da Obra
                  </Typography>
                  <Chip
                    label={`${editedProject.progress || 0}%`}
                    size="small"
                    color={editedProject.progress >= 100 ? 'success' : editedProject.progress >= 50 ? 'primary' : 'default'}
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
                <Slider
                  value={editedProject.progress || 0}
                  onChange={handleProgressChange}
                  valueLabelDisplay="auto"
                  step={5}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' },
                  ]}
                  min={0}
                  max={100}
                />
              </Box>

              {/* Seção: Equipe */}
              <Typography
                variant="overline"
                sx={{ fontWeight: 600, color: "text.secondary", letterSpacing: 1 }}
              >
                Equipe Responsável
                <Chip
                  label="Opcional"
                  size="small"
                  variant="outlined"
                  sx={{ ml: 1, height: 20, fontSize: "0.65rem" }}
                />
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                  gap: 2.5,
                  mt: 1,
                  mb: 3,
                }}
              >
                <CustomTextField
                  name="engineer"
                  label="Engenheiro"
                  placeholder="Nome completo"
                  value={editedProject.team?.engineer || ''}
                  onChange={handleTeamChange}
                />
                <CustomTextField
                  name="architect"
                  label="Arquiteto"
                  placeholder="Nome completo"
                  value={editedProject.team?.architect || ''}
                  onChange={handleTeamChange}
                />
                <CustomTextField
                  type="number"
                  name="workers"
                  label="Nº de Trabalhadores"
                  placeholder="0"
                  value={editedProject.team?.workers || 0}
                  onChange={handleTeamChange}
                  inputProps={{ min: 0 }}
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Botões */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <CustomButton
                  variant="outlined"
                  onClick={handleTryCancelEdit}
                  disabled={saving}
                  sx={{ order: { xs: 2, sm: 1 } }}
                >
                  Cancelar
                </CustomButton>
                <CustomButton
                  variant={changesMade > 0 ? "success" : "primary"}
                  loading={saving}
                  disabled={saving || changesMade === 0}
                  startIcon={<SaveOutlined />}
                  onClick={handleTrySave}
                  sx={{ order: { xs: 1, sm: 2 }, px: 4 }}
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </CustomButton>
              </Box>
            </CustomCard>
          </Box>
        </Fade>
      )}

      {!isEditing && (
        <Box>
          {/* KPIs - Chips outlined */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
            <Chip
              variant="outlined"
              color="primary"
              label={`Orçamento: ${formatCurrency(project.budget)}`}
              sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem' }, py: 2.5 }}
            />
            <Chip
              variant="outlined"
              color={isOverBudget ? 'error' : 'warning'}
              label={`Gasto: ${formatCurrency(project.spent)}`}
              sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem' }, py: 2.5 }}
            />
            <Chip
              variant="outlined"
              color={remaining >= 0 ? 'success' : 'error'}
              label={`Saldo: ${formatCurrency(remaining)}`}
              sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem' }, py: 2.5 }}
            />
            <Chip
              variant="outlined"
              color="info"
              label={`Progresso: ${project.progress}%`}
              sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem' }, py: 2.5 }}
            />
          </Box>

          {/* Barra de progresso visual */}
          <CustomCard sx={{ mb: 3 }} padding={{ xs: 2, sm: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Progresso da Obra
              </Typography>
              <Chip
                label={project.progress === 100 ? 'Concluído' : `${100 - project.progress}% restante`}
                size="small"
                color={project.progress === 100 ? 'success' : 'primary'}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={project.progress}
              sx={{
                height: 12,
                borderRadius: 6,
                bgcolor: 'rgba(0,0,0,0.08)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 6,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Início: {formatDate(project.startDate)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Término: {formatDate(project.expectedEndDate)}
              </Typography>
            </Box>
          </CustomCard>

          {/* Descrição + Equipe */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 2, mb: 3 }}>
            <CustomCard padding={{ xs: 2, sm: 3 }} sx={{ height: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Sobre o Projeto
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {project.description}
              </Typography>

              {isOverBudget && (
                <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                  Orçamento excedido em {formatCurrency(Math.abs(remaining))}
                </Alert>
              )}
            </CustomCard>

            <CustomCard padding={{ xs: 2, sm: 3 }} sx={{ height: '100%' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Equipe Responsável
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 36, height: 36, borderRadius: 2,
                    bgcolor: 'primary.light', color: 'primary.main',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <EngineeringOutlined fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Engenheiro</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{project.team.engineer}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 36, height: 36, borderRadius: 2,
                    bgcolor: 'secondary.light', color: 'secondary.main',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <ArchitectureOutlined fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Arquiteto</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{project.team.architect}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 36, height: 36, borderRadius: 2,
                    bgcolor: 'success.light', color: 'success.main',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <GroupOutlined fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Trabalhadores</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{project.team.workers} pessoas</Typography>
                  </Box>
                </Box>
              </Box>
            </CustomCard>
          </Box>

        </Box>
      )}

      {!isEditing && project && (
        <CustomCard padding={{ xs: 2, sm: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Despesas
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {project.expenses?.length || 0} registros
              </Typography>
            </Box>
            <CustomButton
              size="small"
              variant="success"
              onClick={() => setShowExpenseModal(true)}
            >
              + Adicionar
            </CustomButton>
          </Box>
          {project.expenses && project.expenses.length > 0 ? (
            <>
              {/* Versão Desktop - Tabela */}
              <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Categoria</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Descrição</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Valor</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>Data</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, width: 60 }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {project.expenses
                      .slice(expensePage * expensesPerPage, (expensePage + 1) * expensesPerPage)
                      .map(expense => (
                      <TableRow key={expense.id} hover>
                        <TableCell>
                          <Chip label={categoryNames[expense.category] || expense.category} size="small" />
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {formatCurrency(expense.amount)}
                        </TableCell>
                        <TableCell align="right">{formatDate(expense.date)}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteExpense(expense.id)}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Versão Mobile - Cards */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
                {project.expenses
                  .slice(expensePage * expensesPerPage, (expensePage + 1) * expensesPerPage)
                  .map(expense => (
                  <Card key={expense.id} variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Chip label={categoryNames[expense.category] || expense.category} size="small" sx={{ fontSize: '0.7rem' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {formatCurrency(expense.amount)}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteExpense(expense.id)}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {expense.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(expense.date)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Paginação */}
              {project.expenses.length > expensesPerPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <IconButton
                    size="small"
                    disabled={expensePage === 0}
                    onClick={() => setExpensePage(p => p - 1)}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {expensePage + 1} de {Math.ceil(project.expenses.length / expensesPerPage)}
                  </Typography>
                  <IconButton
                    size="small"
                    disabled={(expensePage + 1) * expensesPerPage >= project.expenses.length}
                    onClick={() => setExpensePage(p => p + 1)}
                  >
                    <ChevronRight />
                  </IconButton>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Nenhuma despesa registrada
              </Typography>
            </Box>
          )}
        </CustomCard>
      )}



      
      <Dialog
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        PaperProps={{ sx: { borderRadius: 3, maxWidth: 450 } }}
      >
        <Box
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <CheckCircle sx={{ fontSize: 48, mb: 1 }} />
          <DialogTitle sx={{ color: 'white', p: 0 }}>
            Salvar Alterações
          </DialogTitle>
        </Box>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Você está prestes a salvar {changesMade} {changesMade === 1 ? 'alteração' : 'alterações'} no projeto.
          </Typography>
          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
            As alterações serão aplicadas imediatamente.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <CustomButton variant="outlined" onClick={() => setShowSaveModal(false)}>
            Revisar
          </CustomButton>
          <CustomButton variant="success" onClick={handleSave}>
            Confirmar e Salvar
          </CustomButton>
        </DialogActions>
      </Dialog>

      
      <Dialog
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        PaperProps={{ sx: { borderRadius: 3, maxWidth: 400 } }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Warning sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
          <DialogTitle sx={{ p: 0, mb: 1 }}>Descartar alterações?</DialogTitle>
          <Typography variant="body2" color="text.secondary">
            Você tem {changesMade} {changesMade === 1 ? 'alteração não salva' : 'alterações não salvas'}. Deseja realmente descartar?
          </Typography>
        </Box>
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
          <CustomButton variant="outlined" onClick={() => setShowCancelModal(false)}>
            Continuar editando
          </CustomButton>
          <CustomButton variant="error" onClick={handleCancelEdit}>
            Descartar
          </CustomButton>
        </DialogActions>
      </Dialog>

      {/* Modal Confirmar Exclusão */}
      <Dialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        PaperProps={{ sx: { borderRadius: '8px', maxWidth: 400 } }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <ErrorIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <DialogTitle sx={{ p: 0, mb: 1 }}>Excluir projeto?</DialogTitle>
          <Typography variant="body2" color="text.secondary">
            Esta ação não pode ser desfeita. O projeto "{project?.name}" será permanentemente excluído.
          </Typography>
        </Box>
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
          <CustomButton variant="outlined" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </CustomButton>
          <CustomButton variant="error" onClick={handleDelete}>
            Excluir
          </CustomButton>
        </DialogActions>
      </Dialog>

      {/* Modal Adicionar Despesa */}
      <Dialog
        open={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Adicionar Nova Despesa
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <CustomTextField
              required
              name="description"
              label="Descrição"
              value={expenseForm.description}
              onChange={handleExpenseInputChange}
              placeholder="Ex: Compra de cimento"
            />
            <CustomTextField
              required
              select
              name="category"
              label="Categoria"
              value={expenseForm.category}
              onChange={handleExpenseInputChange}
            >
              {Object.entries(categoryNames).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </CustomTextField>
            <CustomTextField
              required
              name="amount"
              label="Valor"
              value={formatCurrencyInput(expenseForm.amount)}
              onChange={(e) => {
                const numericValue = parseCurrencyInput(e.target.value);
                setExpenseForm(prev => ({ ...prev, amount: numericValue }));
              }}
              prefix="R$"
              placeholder="0,00"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <CustomButton variant="text" onClick={() => setShowExpenseModal(false)}>
            Cancelar
          </CustomButton>
          <CustomButton variant="success" onClick={handleAddExpense}>
            Adicionar
          </CustomButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={() => setSnackbar(s => ({ ...s, open: false }))}
            >
              <Close fontSize="small" />
            </IconButton>
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectDetail;
