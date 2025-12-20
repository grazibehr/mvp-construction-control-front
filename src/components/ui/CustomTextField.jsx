import { TextField, InputAdornment } from '@mui/material';

const CustomTextField = ({
  icon,
  prefix,
  suffix,
  size = 'medium',
  sx = {},
  InputProps = {},
  ...props
}) => {
  const buildInputProps = () => {
    const adornments = { ...InputProps };

    if (icon || prefix) {
      adornments.startAdornment = (
        <InputAdornment position="start">
          {icon}
          {prefix}
        </InputAdornment>
      );
    }

    if (suffix) {
      adornments.endAdornment = (
        <InputAdornment position="end">
          {suffix}
        </InputAdornment>
      );
    }

    return adornments;
  };

  return (
    <TextField
      fullWidth
      size={size}
      InputProps={buildInputProps()}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default CustomTextField;
