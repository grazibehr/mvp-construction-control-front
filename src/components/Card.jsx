import { useNavigate } from 'react-router-dom';
import {
  Card as MuiCard,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  LocationOnOutlined,
} from '@mui/icons-material';
import { formatCurrency, getStatusColor, getStatusText } from '../utils/formatters';
import { CustomButton } from './ui';

const Card = ({ project }) => {
  const navigate = useNavigate();

  const budgetPercentage = (project.spent / project.budget) * 100;
  const isOverBudget = budgetPercentage > 100;

  return (
    <MuiCard
      sx={{
        height: '100%',
        minHeight: 480,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={project.image}
          alt={project.name}
          sx={{ objectFit: 'cover' }}
        />
        <Chip
          label={getStatusText(project.status)}
          color={getStatusColor(project.status)}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            fontWeight: 600,
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 1,
            minHeight: 32,
          }}
        >
          {project.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            height: 40,
            lineHeight: '20px',
          }}
        >
          {project.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Tooltip title="Progresso da obra" arrow>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Progresso
              </Typography>
            </Tooltip>
            <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
              {project.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={project.progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tooltip title="Orçamento total do projeto" arrow>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Orçamento
              </Typography>
            </Tooltip>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {formatCurrency(project.budget)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tooltip title="Valor já gasto no projeto" arrow>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Gasto
              </Typography>
            </Tooltip>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: isOverBudget ? 'error.main' : 'success.main',
              }}
            >
              {formatCurrency(project.spent)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tooltip title="Localização da obra" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnOutlined sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Local
                </Typography>
              </Box>
            </Tooltip>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '55%',
                textAlign: 'right',
              }}
            >
              {project.location}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <CustomButton
          variant="primary"
          fullWidth
          onClick={() => navigate(`/project/${project.id}`)}
          sx={{ py: 1 }}
        >
          Ver Detalhes
        </CustomButton>
      </CardActions>
    </MuiCard>
  );
};

export default Card;
