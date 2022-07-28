import {
  Paper,
  Typography,
  Container,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
} from "@mui/material";
import { snackbar } from "../components";
import axios from "axios";
import { serverInfo } from "../utils";
import { useEffect, useState } from "react";

const DisplayFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    console.log("Display Feedback");
    getAllFeedback();
  }, []);

  const getAllFeedback = async () => {
    try {
      const response = await axios.get(
        serverInfo.firebaseUrl + serverInfo.getFeedback
      );
      setFeedbacks(response.data);
    } catch (error) {
      console.log(`Error: ${error}`);
      snackbar.current.showSnackbar(true, error.message);
    }
  };

  return (
    <Container maxWidth="xl">
      <Paper sx={{ m: "50px", p: "30px" }}>
        <Typography
          variant="h5"
          component="h5"
          sx={{ lineHeight: 1.2, mb: 2 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {"Feedback Analysis Report"}
        </Typography>

        <Paper
          variant="outlined"
          sx={{ display: "flex", alignItems: "center", mt: 2 }}
        >
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="start">User Id</TableCell>
                  <TableCell align="start">Feedback</TableCell>
                  <TableCell align="start">Polairty</TableCell>
                  <TableCell align="start">Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feedbacks.map((feedback) => (
                  <TableRow
                    key={feedback.userId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="start">{feedback.userId}</TableCell>
                    <TableCell align="start">{feedback.feedback}</TableCell>
                    <TableCell align="start">{feedback.Polarity}</TableCell>
                    <TableCell align="start">
                      {feedback.SentimentScore}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Paper>
    </Container>
  );
};

export default DisplayFeedback;
