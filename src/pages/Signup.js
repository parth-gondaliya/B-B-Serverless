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
import UserPool from "../UserPool";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import useInput from "../hooks/use-input";
import { snackbar } from "../components";
import { useNavigate } from "react-router-dom";
import {
  serverInfo,
  regEx,
  simpleChangeHandler,
  onlyTextChangeHandler,
  onlyIntegerChangeHandler,
} from "../utils";
import axios from "axios";

const signUpCognito = async (formData, navigate) => {
  let attributeList = [
    new CognitoUserAttribute({
      Name: "email",
      Value: formData.email,
    }),
  ];

  UserPool.signUp(
    formData.email,
    formData.password,
    attributeList,
    null,
    (error, data) => {
      if (error) {
        console.log("Error", error);
        snackbar.current.showSnackbar(true, error.name);
        return;
      }
      snackbar.current.showSnackbar(true, "Registration Successful!");
      saveUserToDb(formData, data.userSub, navigate);
    }
  );
};

const saveUserToDb = async (data, userId, navigate) => {
  try {
    const response = await axios.post(serverInfo.baseUrl + serverInfo.users, {
      userId: userId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      answer: data.answer,
      cipherNumber: data.cipherNumber,
    });
    saveQuestionToFirebase(userId, data.answer, navigate);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const saveQuestionToFirebase = async (userId, answer, navigate) => {
  try {
    const response = await axios.post(
      serverInfo.firebaseUrl + serverInfo.postQuestion,
      {
        userId: userId,
        answer: answer,
      }
    );
    snackbar.current.showSnackbar(
      true,
      "Please check email for verification email!"
    );
    navigate("/login");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const Signup = () => {
  const navigate = useNavigate();
  // First Name
  const {
    value: firstName,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    reset: resetFirstNameInput,
  } = useInput((value) => value.trim() !== "", onlyTextChangeHandler);

  // Last Name
  const {
    value: lastName,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    reset: resetLastNameInput,
  } = useInput((value) => value.trim() !== "", onlyTextChangeHandler);

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
  } = useInput((value) => value.length >= 8, simpleChangeHandler);

  // Confirm Password
  const {
    value: confirmPassword,
    isValid: confirmPasswordIsValid,
    hasError: confirmPasswordHasError,
    valueChangeHandler: confirmPasswordChangeHandler,
    inputBlurHandler: confirmPasswordBlurHandler,
    reset: resetConfirmPasswordInput,
  } = useInput((value) => value.trim() === password, simpleChangeHandler);

  // User Question
  const {
    value: userQuestion,
    isValid: userQuestionIsValid,
    hasError: userQuestionHasError,
    valueChangeHandler: userQuestionChangeHandler,
    inputBlurHandler: userQuestionBlurHandler,
    reset: resetUserQuestionInput,
  } = useInput((value) => value.trim() !== "", onlyTextChangeHandler);

  // Cipher Number
  const {
    value: cipherNumber,
    isValid: cipherNumberIsValid,
    hasError: cipherNumberHasError,
    valueChangeHandler: cipherNumberChangeHandler,
    inputBlurHandler: cipherNumberBlurHandler,
    reset: resetCipherNumberInput,
  } = useInput((value) => value > 0 && value < 10, onlyIntegerChangeHandler);

  let formIsValid = false;

  if (
    firstNameIsValid &&
    lastNameIsValid &&
    emailIsValid &&
    passwordIsValid &&
    confirmPasswordIsValid &&
    userQuestionIsValid &&
    cipherNumberIsValid
  ) {
    formIsValid = true;
  }

  const formSubmissionHandler = (event) => {
    event.preventDefault();

    signUpCognito(
      {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        answer: userQuestion,
        cipherNumber: cipherNumber,
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
          {"User Registration"}
        </Typography>

        <form onSubmit={formSubmissionHandler}>
          <TextField
            id="first_name"
            label="First Name"
            variant="outlined"
            fullWidth={true}
            sx={{
              mt: 2,
            }}
            value={firstName}
            onChange={firstNameChangeHandler}
            onBlur={firstNameBlurHandler}
            error={firstNameHasError}
            helperText={firstNameHasError && "First Name is required"}
          />

          <TextField
            id="last_name"
            label="Last Name"
            variant="outlined"
            fullWidth={true}
            sx={{
              mt: 2,
            }}
            value={lastName}
            onChange={lastNameChangeHandler}
            onBlur={lastNameBlurHandler}
            error={lastNameHasError}
            helperText={lastNameHasError && "Last Name is required"}
          />

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
            helperText={
              passwordHasError &&
              "Password is required with minimum 8 characters"
            }
          />

          <TextField
            id="confirm_password"
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth={true}
            sx={{
              mt: 2,
            }}
            value={confirmPassword}
            onChange={confirmPasswordChangeHandler}
            onBlur={confirmPasswordBlurHandler}
            error={confirmPasswordHasError}
            helperText={confirmPasswordHasError && "Passwords do not match."}
          />

          <TextField
            id="userQuestion"
            label="In which city were you born?"
            variant="outlined"
            fullWidth={true}
            sx={{
              mt: 2,
            }}
            value={userQuestion}
            onChange={userQuestionChangeHandler}
            onBlur={userQuestionBlurHandler}
            error={userQuestionHasError}
            helperText={userQuestionHasError && "Answer is required"}
          />

          <TextField
            id="cipherNumber"
            label="Enter your Cipher Number"
            variant="outlined"
            fullWidth={true}
            sx={{
              mt: 2,
            }}
            value={cipherNumber}
            onChange={cipherNumberChangeHandler}
            onBlur={cipherNumberBlurHandler}
            error={cipherNumberHasError}
            helperText={cipherNumberHasError && "Cipher Number is required"}
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
              Register
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
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Signup;
