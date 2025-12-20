import { Button, CircularProgress } from '@mui/material';

const CustomButton = ({
  children,
  variant = 'primary',
  loading = false,
  fullWidth = false,
  size = 'medium',
  startIcon,
  sx = {},
  ...props
}) => {
  const variants = {
    primary: {
      variant: 'contained',
      sx: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
        },
      },
    },
    success: {
      variant: 'contained',
      color: 'success',
      sx: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        '&:hover': {
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        },
      },
    },
    error: {
      variant: 'contained',
      color: 'error',
      sx: {},
    },
    outlined: {
      variant: 'outlined',
      sx: {},
    },
    text: {
      variant: 'text',
      sx: {},
    },
  };

  const config = variants[variant] || variants.primary;

  return (
    <Button
      variant={config.variant}
      color={config.color}
      disabled={loading || props.disabled}
      fullWidth={fullWidth}
      size={size}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      sx={{
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 600,
        ...config.sx,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
