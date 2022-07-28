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

const DisplayTours = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    console.log("Display Tours");
    getAllTours();
  }, []);

  const getAllTours = async () => {
    try {
      const response = await axios.get(
        serverInfo.baseUrl + serverInfo.bookTour
      );

      setTours(response.data.allToursData);
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
          {"Tour Confirmed Bookings"}
        </Typography>

        <Paper
          variant="outlined"
          sx={{ display: "flex", alignItems: "center", mt: 2 }}
        >
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Booking Id</TableCell>
                  <TableCell align="left">User Id</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Location</TableCell>
                  <TableCell align="left">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tours.map((tour) => (
                  <TableRow
                    key={tour.BookingId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{tour.BookingId}</TableCell>
                    <TableCell align="left">{tour.UserId}</TableCell>
                    <TableCell align="left">{tour.Name}</TableCell>
                    <TableCell align="left">{tour.Location}</TableCell>
                    <TableCell align="left">${tour.Price}</TableCell>
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

export default DisplayTours;
