import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  HomeOutlined,
  ArrowBackOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Paper
        sx={{
          maxWidth: 600,
          width: "100%",
          p: 6,
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <WarningAmberOutlined
            sx={{
              fontSize: 80,
              color: "warning.main",
            }}
          />
        </Box>

        <Typography
          variant="h1"
          sx={{
            fontSize: "6rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          Página Não Encontrada
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Desculpe, a página que você está procurando não existe ou foi movida.
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 4,
            p: 2,
            bgcolor: "action.hover",
            borderRadius: 1,
            fontFamily: "monospace",
          }}
        >
          URL solicitada: {location.pathname}
        </Typography>

        <Box sx={{ mb: 4, textAlign: "left" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, mb: 1, textAlign: "center" }}
          >
            Sugestões:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="• Verifique se o endereço foi digitado corretamente"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Retorne à página anterior"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Acesse a página inicial"
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
          </List>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackOutlined />}
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            startIcon={<HomeOutlined />}
            onClick={() => navigate("/")}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #4d5eb8 0%, #573879 100%)",
              },
            }}
          >
            Ir para Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFound;
