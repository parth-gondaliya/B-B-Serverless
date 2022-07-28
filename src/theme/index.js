import { grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: grey[100],
    },
    primary: {
      main: "#273c75", // Mazarine Blue
    },
    secondary: {
      main: "#e1b12c", // Nanohanacha Gold
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

export default theme;
