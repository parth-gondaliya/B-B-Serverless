import { useContext, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Link,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
} from "@mui/material";
import useInput from "../hooks/use-input";
import { useLocation, useNavigate } from "react-router-dom";
import { onlyTextChangeHandler } from "../utils";
import { AuthContext } from "../context";
import { snackbar } from "../components";
import axios from "axios";
import { serverInfo, generateRandomText } from "../utils";

const VerifyCipherFromFirebase = async (
  user,
  randomText,
  answer,
  navigate,
  setLogin
) => {
  try {
    const response = await axios.post(
      serverInfo.firebaseUrl + serverInfo.verifyCaesarCipher,
      {
        key: +user.cipherNumber,
        text: randomText,
        answer: answer,
      }
    );

    console.log(response);
    if (response.data.isVerified) {
      snackbar.current.showSnackbar(true, "Step 3: Answer Matched!");

      localStorage.setItem("AWS_JWT_TOKEN", user.jwtToken);
      localStorage.setItem("USER_FIRST_NAME", user.firstName);
      localStorage.setItem("USER_LAST_NAME", user.lastName);
      localStorage.setItem("USER_EMAIL", user.email);
      localStorage.setItem("USER_ID", user.userId);

      setLogin(true);
      navigate("/", { state: { user: user } });
    } else {
      snackbar.current.showSnackbar(true, "Wrong Answer!");
      navigate("/login");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const CaesarCipher = () => {
  const { isLogin, setLogin } = useContext(AuthContext);
  const [randomText, setRandomText] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    setRandomText(generateRandomText(4));
  }, []);

  const cipherQuestion = `What is the Caesar Cipher of ${randomText}?`;
  if (!state.user) {
    navigate("/login");
  }

  // User Question
  const {
    value: cipherText,
    isValid: cipherTextIsValid,
    hasError: cipherTextHasError,
    valueChangeHandler: cipherTextChangeHandler,
    inputBlurHandler: cipherTextBlurHandler,
    reset: resetCipherTextInput,
  } = useInput((value) => value.trim() !== "", onlyTextChangeHandler);

  let formIsValid = cipherTextIsValid;

  // Form Submit Handler
  const formSubmissionHandler = (event) => {
    event.preventDefault();

    VerifyCipherFromFirebase(
      state.user,
      randomText,
      cipherText,
      navigate,
      setLogin
    );
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ m: "50px", p: "30px" }}>
        <Typography
          variant="h5"
          component="h5"
          sx={{ lineHeight: 1.2, mb: 2 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {"Login"}
        </Typography>

        <Typography
          variant="h6"
          component="h6"
          sx={{ lineHeight: 1.2, mb: 2 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {"Step 3: Caesar Cipher"}
        </Typography>

        <form onSubmit={formSubmissionHandler}>
          <TextField
            id="cipherText"
            label={cipherQuestion}
            variant="outlined"
            fullWidth={true}
            sx={{
              mt: 2,
            }}
            value={cipherText}
            onChange={cipherTextChangeHandler}
            onBlur={cipherTextBlurHandler}
            error={cipherTextHasError}
            helperText={cipherTextHasError && "This is required"}
          />

          <Box
            sx={{ mt: 4, position: "relative" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              type="submit"
              variant="contained"
              disabled={!formIsValid}
              color="secondary"
            >
              Submit
            </Button>
          </Box>
        </form>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link
              variant="body2"
              onClick={() => navigate("/login")}
              sx={{ cursor: "pointer" }}
            >
              {"Cancel"}
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CaesarCipher;
