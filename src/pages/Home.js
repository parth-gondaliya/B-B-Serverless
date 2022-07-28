import {
  Grid,
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
  Stack,
  TableBody,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { snackbar } from "../components";

const searchRooms = async (date, setRooms) => {
  try {
    const response = await axios.post(
      "https://a7072ljrba.execute-api.us-east-1.amazonaws.com/api/roomsearch",
      {
        date: date,
      }
    );
    const data = [
      { type: "AC", availability: response.data.body["AC"] },
      { type: "Non-AC", availability: response.data.body["NONAC"] },
    ];

    setRooms(data);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const bookRooms = async (date, roomType, setRooms) => {
  const userId = localStorage.getItem("USER_ID");
  try {
    const response = await axios.post(
      "https://a7072ljrba.execute-api.us-east-1.amazonaws.com/api/booking",
      {
        date: date,
        type: roomType === "AC" ? "AC": "NONAC",
        userId: userId,
      }
    );
    snackbar.current.showSnackbar(true, "Room Booked!");
    searchRooms(date, setRooms);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const Home = () => {
  const [datePicker, setDatePciker] = useState(null);
  const [rooms, setRooms] = useState([]);

  const dateChangeHandler = (newValue) => {
    setDatePciker(newValue);
    searchRooms(moment(newValue).format("DD/MM/YYYY"), setRooms);
  };

  const bookHandler = (room) => {
    bookRooms(moment(datePicker).format("DD/MM/YYYY"), room.type, setRooms);
  };

  useEffect(() => {
    console.log("home");
  }, []);

  return (
    <Container maxWidth="sm">
      <Paper
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 2,
          padding: 4
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Booking Date"
            value={datePicker}
            onChange={dateChangeHandler}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Paper>
      <Paper
        variant="outlined"
        sx={{ display: "flex", alignItems: "center", mt: 2 }}
      >
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="start">Room Type</TableCell>
                <TableCell align="right">Available Rooms</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell align="start">{room.type}</TableCell>
                  <TableCell align="right">{room.availability}</TableCell>
                  <TableCell align="right">
                    <Button
                      type="button"
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        bookHandler(room);
                      }}
                    >
                      Book
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Home;
