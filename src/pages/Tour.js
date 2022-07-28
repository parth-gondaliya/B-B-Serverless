import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  IconButton,
} from "@mui/material";
import { snackbar } from "../components";
import axios from "axios";
import { serverInfo } from "../utils";
import { useNavigate } from "react-router-dom";
import { onlyIntegerChangeHandler } from "../utils";
import useInput from "../hooks/use-input";
import { useEffect, useState } from "react";

const Tour = () => {
  const navigate = useNavigate();
  const [showTour, setShowTour] = useState(false);
  const [tours, setTours] = useState([]);

  const findTour = async (duration) => {
    try {
      const response = await axios.get(
        serverInfo.firebaseUrl +
          serverInfo.getRecommendation +
          "?stayDuration=" +
          duration
      );
      console.log(response.data);
      let recommendationArray = [
        {
          id: 0,
          tour_name: response.data.tour_name,
          tour_location: response.data.tour_location,
          tour_price: response.data.tour_price,
        },
        {
          id: 1,
          tour_name: response.data.tour_name_2,
          tour_location: response.data.tour_location_2,
          tour_price: response.data.tour_price_2,
        },
        {
          id: 2,
          tour_name: response.data.tour_name_3,
          tour_location: response.data.tour_location_3,
          tour_price: response.data.tour_price_3,
        },
      ];
      setTours(recommendationArray);
      snackbar.current.showSnackbar(true, "Tours Recommended");
      setShowTour(true);
    } catch (error) {
      console.log(`Error: ${error}`);
      snackbar.current.showSnackbar(true, error.message);
    }
  };

  const bookTourAPICall = async (tour) => {
    const userId = localStorage.getItem("USER_ID");

    var body = {
      userId: userId,
      tour_name: tour.tour_name,
      tour_location: tour.tour_location,
      tour_price: tour.tour_price,
    };
    try {
      const response = await axios.post(
        serverInfo.baseUrl + serverInfo.bookTour,
        body
      );
    } catch (error) {
      console.log(`Error: ${error}`);
      snackbar.current.showSnackbar(true, error.message);
    }
  };

  // people
  const {
    value: people,
    isValid: peopleIsValid,
    hasError: peopleHasError,
    valueChangeHandler: peopleChangeHandler,
    inputBlurHandler: peopleBlurHandler,
    reset: resetPeopleInput,
  } = useInput((value) => value > 0, onlyIntegerChangeHandler);

  // duration
  const {
    value: duration,
    isValid: durationIsValid,
    hasError: durationHasError,
    valueChangeHandler: durationChangeHandler,
    inputBlurHandler: durationBlurHandler,
    reset: resetDurationInput,
  } = useInput((value) => value > 0, onlyIntegerChangeHandler);

  let formIsValid = false;

  if (durationIsValid && peopleIsValid) {
    formIsValid = true;
  }

  const formSubmissionHandler = (e) => {
    e.preventDefault();
    findTour(duration);
  };

  const bookTour = (e, tour) => {
    e.preventDefault();

    bookTourAPICall(tour);
    snackbar.current.showSnackbar(true, "Tour Booked!");
    navigate("/");
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
          {"Tour Booking"}
        </Typography>
        <form onSubmit={formSubmissionHandler}>
          <TextField
            id="people"
            label="Number of People"
            variant="outlined"
            fullWidth={true}
            multiline={true}
            sx={{
              mt: 2,
            }}
            value={people}
            onChange={peopleChangeHandler}
            onBlur={peopleBlurHandler}
            error={peopleHasError}
            helperText={peopleHasError && "Number of people is required"}
          />
          <TextField
            id="duration"
            label="Duration of Stay (in Days)"
            variant="outlined"
            fullWidth={true}
            multiline={true}
            sx={{
              mt: 2,
            }}
            value={duration}
            onChange={durationChangeHandler}
            onBlur={durationBlurHandler}
            error={durationHasError}
            helperText={durationHasError && "Duration of stay is required"}
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
              Find Tour
            </Button>
          </Box>
        </form>
        {showTour && (
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="start">Id</TableCell>
                  <TableCell align="start">Name</TableCell>
                  <TableCell align="start">Location</TableCell>
                  <TableCell align="start">Price</TableCell>
                  <TableCell align="center">Select</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tours.map((tour) => (
                  <TableRow
                    key={tour.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="start">{tour.id + 1}</TableCell>
                    <TableCell align="start">{tour.tour_name}</TableCell>
                    <TableCell align="start">{tour.tour_location}</TableCell>
                    <TableCell align="start">${tour.tour_price}</TableCell>
                    <TableCell align="center">
                      <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        onClick={(event) => bookTour(event, tour)}
                      >
                        Book
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default Tour;
