import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
} from "@mui/material";
import { snackbar } from "../components";
import axios from "axios";
import { serverInfo } from "../utils";
import { useNavigate } from "react-router-dom";
import { simpleChangeHandler } from "../utils";
import useInput from "../hooks/use-input";

const postFeedback = async (feedback, navigate) => {
  const userId = localStorage.getItem("USER_ID");

  console.log({
    userId: userId,
    feedback: feedback,
  });

  try {
    const response = await axios.post(
      serverInfo.firebaseUrl + serverInfo.postFeedback,
      {
        userId: userId,
        feedback: feedback,
      }
    );
    snackbar.current.showSnackbar(true, "Feedback Saved!");
    navigate("/");
  } catch (error) {
    console.log(`Error: ${error}`);
    snackbar.current.showSnackbar(true, error.message);
  }
};

const Feedback = () => {
  const navigate = useNavigate();

  // feedback
  const {
    value: feedback,
    isValid: feedbackIsValid,
    hasError: feedbackHasError,
    valueChangeHandler: feedbackChangeHandler,
    inputBlurHandler: feedbackBlurHandler,
    reset: resetFeedbackInput,
  } = useInput((value) => value.trim() !== "", simpleChangeHandler);

  let formIsValid = !feedbackHasError;

  const formSubmissionHandler = (e) => {
    e.preventDefault();
    postFeedback(feedback, navigate);
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
          {"Customer Feedback"}
        </Typography>
        <form onSubmit={formSubmissionHandler}>
          <TextField
            id="feedback"
            label="Feedback"
            variant="outlined"
            fullWidth={true}
            multiline={true}
            sx={{
              mt: 2,
            }}
            value={feedback}
            onChange={feedbackChangeHandler}
            onBlur={feedbackBlurHandler}
            error={feedbackHasError}
            helperText={feedbackHasError && "Feedback is required"}
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
              Send Feedback
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Feedback;
