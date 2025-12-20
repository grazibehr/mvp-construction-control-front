import { Paper } from '@mui/material';

const CustomCard = ({
  children,
  variant = 'default',
  padding = 3,
  sx = {},
  ...props
}) => {
  const variants = {
    default: {
      bgcolor: 'background.paper',
    },
    gradient: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
    },
    success: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
    },
    outlined: {
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
    },
  };

  return (
    <Paper
      elevation={variant === 'outlined' ? 0 : 1}
      sx={{
        p: padding,
        borderRadius: 3,
        ...variants[variant],
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};

export default CustomCard;
