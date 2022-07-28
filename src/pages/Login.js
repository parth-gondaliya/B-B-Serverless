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
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import { useNavigate } from "react-router-dom";
import { regEx, simpleChangeHandler } from "../utils";
import UserPool from "../UserPool";
import { snackbar } from "../components";
import axios from "axios";
import { serverInfo } from "../utils";

const loginCognito = (formData, navigate) => {
  const authenticationData = {
    Username: formData.email,
    Password: formData.password,
  };

  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const userData = {
    Username: formData.email,
    Pool: UserPool,
  };

  const cognitoUser = new CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      const jwtToken = result.idToken.jwtToken;
      const userId = result.idToken.payload.sub;
      snackbar.current.showSnackbar(true, "Step 1 Authentication Successful!");
      getLoggedInUserDetails(navigate, userId, jwtToken);
    },
    onFailure: (error) => {
      snackbar.current.showSnackbar(true, error.message);
    },
  });
};

const getLoggedInUserDetails = async (navigate, userId, jwtToken) => {
  try {
    const response = await axios.get(
      serverInfo.baseUrl + serverInfo.users + "/" + userId,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "content-type": "application/json",
        },
      }
    );

    const firstName = response.data.data.Item.firstName;
    const lastName = response.data.data.Item.lastName;
    const email = response.data.data.Item.email;
    const cipherNumber = response.data.data.Item.cipherNumber;
    console.log(cipherNumber);

    const userDetails = {
      jwtToken,
      userId,
      firstName,
      lastName,
      email,
      cipherNumber,
    };

    navigate("/qa-challenge", { state: { user: userDetails } });
  } catch (error) {
    console.log(`Error: ${error}`);
    snackbar.current.showSnackbar(true, error.message);
  }
};

const Login = () => {
  const navigate = useNavigate();

  // Email
  const {
    value: email,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInput(
    (value) => regEx.email.test(value) === true,
    simpleChangeHandler
  );

  // Password
  const {
    value: password,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInput((value) => value.trim() !== "", simpleChangeHandler);

  let formIsValid = false;

  if (emailIsValid && passwordIsValid) {
    formIsValid = true;
  }

  // Form Submit Handler
  const formSubmissionHandler = (event) => {
    event.preventDefault();

    loginCognito(
      {
        email: email,
        password: password,
      },
      navigate
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
          {"Step 1: Email and Password"}
        </Typography>

        <form onSubmit={formSubmissionHandler}>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            fullWidth={true}
            sx={{
              mt: 2,
            }}
            value={email}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            error={emailHasError}
            helperText={emailHasError && "Valid Email is required"}
          />

          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth={true}
            sx={{
              mt: 2,
            }}
            value={password}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            error={passwordHasError}
            helperText={passwordHasError && "Password is required"}
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
              onClick={() => navigate("/signup")}
              sx={{ cursor: "pointer" }}
            >
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login;
