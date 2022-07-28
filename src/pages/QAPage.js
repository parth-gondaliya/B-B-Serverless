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
import { snackbar } from "../components";
import axios from "axios";
import { serverInfo } from "../utils";

const getAnswerFromFirebase = async (user, navigate) => {
  try {
    const response = await axios.post(
      serverInfo.firebaseUrl + serverInfo.getAnswer,
      {
        userId: user.userId,
      }
    );
    console.log("QA", response.data);
    if (response.data.answer.toLowerCase() === user.answer.toLowerCase()) {
      snackbar.current.showSnackbar(true, "Step 2: Answer Matched!");
      navigate("/caesar-cipher", { state: { user: user } });
    } else {
      snackbar.current.showSnackbar(true, "Wrong Answer!");
      navigate("/login");
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const QAPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state.user) {
    navigate("/login");
  }

  // User Question
  const {
    value: userQuestion,
    isValid: userQuestionIsValid,
    hasError: userQuestionHasError,
    valueChangeHandler: userQuestionChangeHandler,
    inputBlurHandler: userQuestionBlurHandler,
    reset: resetUserQuestionInput,
  } = useInput((value) => value.trim() !== "", onlyTextChangeHandler);

  let formIsValid = userQuestionIsValid;

  // Form Submit Handler
  const formSubmissionHandler = (event) => {
    event.preventDefault();

    getAnswerFromFirebase({ ...state.user, answer: userQuestion }, navigate);
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
          {"Step 2: Question & Answer"}
        </Typography>

        <form onSubmit={formSubmissionHandler}>
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

export default QAPage;
