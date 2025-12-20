import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Alert,
  Dialog,
  DialogContent,
  DialogActions,
  MenuItem,
  Divider,
  Chip,
} from "@mui/material";
import {
  BusinessOutlined,
  CheckCircleOutlined,
  ArrowBack,
  Send,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useProjects } from "../context/ProjectContext";
import {
  formatCurrency,
  formatCurrencyInput,
  parseCurrencyInput,
} from "../utils/formatters";
import { CustomCard, CustomButton, CustomTextField } from "../components/ui";

const REQUIRED_FIELDS = [
  "name",
  "description",
  "location",
  "budget",
  "startDate",
  "expectedEndDate",
];

const initialFormData = {
  name: "",
  description: "",
  location: "",
  budget: "",
  startDate: null,
  expectedEndDate: null,
  engineer: "",
  architect: "",
  workers: "",
  status: "planejamento",
};

const NewProject = () => {
  const navigate = useNavigate();
  const { createProject } = useProjects();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState(initialFormData);

  const formProgress = useMemo(() => {
    let filled = 0;
    REQUIRED_FIELDS.forEach((field) => {
      const value = formData[field];
      if (value !== "" && value !== null) filled++;
    });
    return Math.round((filled / REQUIRED_FIELDS.length) * 100);
  }, [formData]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value?.trim()) newErrors.name = "Nome é obrigatório";
        else if (value.trim().length < 3)
          newErrors.name = "Mínimo 3 caracteres";
        else delete newErrors.name;
        break;
      case "description":
        if (!value?.trim()) newErrors.description = "Descrição é obrigatória";
        else if (value.trim().length < 10)
          newErrors.description = "Mínimo 10 caracteres";
        else delete newErrors.description;
        break;
      case "location":
        if (!value?.trim()) newErrors.location = "Localização é obrigatória";
        else delete newErrors.location;
        break;
      case "budget":
        if (!value) newErrors.budget = "Orçamento é obrigatório";
        else if (parseFloat(value) <= 0)
          newErrors.budget = "Deve ser maior que zero";
        else delete newErrors.budget;
        break;
      case "startDate":
        if (!value) newErrors.startDate = "Data de início é obrigatória";
        else delete newErrors.startDate;
        break;
      case "expectedEndDate":
        if (!value) newErrors.expectedEndDate = "Data de término é obrigatória";
        else if (
          formData.startDate &&
          dayjs(value).isBefore(dayjs(formData.startDate))
        )
          newErrors.expectedEndDate = "Deve ser após a data de início";
        else delete newErrors.expectedEndDate;
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[name];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseCurrencyInput(value);
    setFormData((prev) => ({ ...prev, [name]: numericValue }));
    if (touched[name]) validateField(name, numericValue);
  };

  const handleDateChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasErrors = false;
    REQUIRED_FIELDS.forEach((key) => {
      setTouched((prev) => ({ ...prev, [key]: true }));
      if (!validateField(key, formData[key])) hasErrors = true;
    });

    setTimeout(() => {
      if (!hasErrors && Object.keys(errors).length === 0) {
        setShowConfirmModal(true);
      } else {
        setAlert({ type: "error", message: "Corrija os campos em vermelho" });
      }
    }, 100);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newProject = {
        id: Date.now().toString(),
        ...formData,
        startDate: formData.startDate?.format("YYYY-MM-DD") || "",
        expectedEndDate: formData.expectedEndDate?.format("YYYY-MM-DD") || "",
        budget: parseFloat(formData.budget),
        workers: parseInt(formData.workers) || 0,
        progress: 0,
        spent: 0,
        expenses: [],
        image: `https://source.unsplash.com/800x600/?construction,building,${Date.now()}`,
        team: {
          engineer: formData.engineer || "Não informado",
          architect: formData.architect || "Não informado",
          workers: parseInt(formData.workers) || 0,
        },
      };

      createProject(newProject);

      setAlert({ type: "success", message: "Projeto criado com sucesso!" });
      setTimeout(() => navigate("/projects"), 1500);
    } catch {
      setAlert({ type: "error", message: "Erro ao criar projeto." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", pb: 4 }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <CustomButton
          variant="text"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/projects")}
        >
          Voltar
        </CustomButton>
      </Box>
      {alert && (
        <Alert
          severity={alert.type}
          onClose={() => setAlert(null)}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {alert.message}
        </Alert>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <CustomCard padding={{ xs: 2, md: 4 }}>
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
              <BusinessOutlined sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Novo Projeto
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preencha os dados para criar um novo projeto
              </Typography>
            </Box>
            <Chip
              label={`${formProgress}%`}
              color={formProgress === 100 ? "success" : "primary"}
              variant="outlined"
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

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
              value={formData.name}
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
              value={formatCurrencyInput(formData.budget)}
              onChange={handleCurrencyChange}
              onBlur={handleBlur}
              error={!!errors.budget && touched.budget}
              helperText={
                errors.budget && touched.budget
                  ? errors.budget
                  : formData.budget
                  ? formatCurrency(formData.budget)
                  : ""
              }
            />
            <CustomTextField
              required
              name="location"
              label="Localização da Obra"
              placeholder="Endereço completo"
              value={formData.location}
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
                value={formData.description}
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

          {/* Seção: Cronograma */}
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
            <DatePicker
              label="Data de Início *"
              value={formData.startDate}
              onChange={(val) => handleDateChange("startDate", val)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.startDate && touched.startDate,
                  helperText:
                    errors.startDate && touched.startDate
                      ? errors.startDate
                      : "",
                },
              }}
            />
            <DatePicker
              label="Previsão de Término *"
              value={formData.expectedEndDate}
              onChange={(val) => handleDateChange("expectedEndDate", val)}
              minDate={formData.startDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.expectedEndDate && touched.expectedEndDate,
                  helperText:
                    errors.expectedEndDate && touched.expectedEndDate
                      ? errors.expectedEndDate
                      : "",
                },
              }}
            />
            <CustomTextField
              select
              name="status"
              label="Status Inicial"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="planejamento">Planejamento</MenuItem>
              <MenuItem value="em_andamento">Em Andamento</MenuItem>
              <MenuItem value="pausado">Pausado</MenuItem>
            </CustomTextField>
          </Box>

          {/* Seção: Equipe (opcional) */}
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
              value={formData.engineer}
              onChange={handleChange}
            />
            <CustomTextField
              name="architect"
              label="Arquiteto"
              placeholder="Nome completo"
              value={formData.architect}
              onChange={handleChange}
            />
            <CustomTextField
              type="number"
              name="workers"
              label="Nº de Trabalhadores"
              placeholder="0"
              value={formData.workers}
              onChange={handleChange}
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
              onClick={() => navigate("/projects")}
              disabled={loading}
              sx={{ order: { xs: 2, sm: 1 } }}
            >
              Cancelar
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
              loading={loading}
              disabled={formProgress < 100}
              startIcon={<Send />}
              sx={{ order: { xs: 1, sm: 2 }, px: 4 }}
            >
              {loading ? "Criando..." : "Criar Projeto"}
            </CustomButton>
          </Box>
        </CustomCard>
      </form>
      {/* Modal de Confirmação */}
      <Dialog
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        PaperProps={{ sx: { borderRadius: 3, maxWidth: 450 } }}
      >
        <Box
          sx={{
            p: 3,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <CheckCircleOutlined sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h6">Confirmar Criação</Typography>
        </Box>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Nome:
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formData.name}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Local:
              </Typography>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ textAlign: "right", maxWidth: "60%" }}
              >
                {formData.location}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Orçamento:
              </Typography>
              <Typography variant="body2" fontWeight={600} color="success.main">
                {formatCurrency(parseFloat(formData.budget))}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <CustomButton
            variant="outlined"
            onClick={() => setShowConfirmModal(false)}
          >
            Revisar
          </CustomButton>
          <CustomButton variant="success" onClick={handleConfirmSubmit}>
            Confirmar
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewProject;
