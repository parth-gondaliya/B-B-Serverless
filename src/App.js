import { useState } from "react";
import { MaterialSnackbar } from "./components";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import AlertDialog, { AlertProvider } from "./components/alert-dialog";
import { snackbarRef } from "./components/material-snackbar";
import { AuthContext } from "./context";

function App() {
  const [isLogin, setLogin] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{ isLogin, setLogin }}>
        <BrowserRouter>
          <AlertProvider>
            <CssBaseline />
            <AppRoutes />
            <AlertDialog />
            <MaterialSnackbar ref={snackbarRef} />
          </AlertProvider>
        </BrowserRouter>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
