import {
  Grid,
  Paper,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { snackbar } from "../components";
import { useNavigate } from "react-router-dom";

const placeOrder = async (mainItem, toppingItem, drinks, navigate) => {
  const userId = localStorage.getItem("USER_ID");

  console.log("Place Order");

  const prices = {
    english: 10,
    indian: 15,
    Continental: 12,
    tea: 10,
    coffee: 10,
    greentea: 12,
    Veggies: 10,
    eggs: 15,
    Bacon: 12,
  };

  const formData = {
    main: {
      quantity: 1,
      description: mainItem,
      "tax-rate": 6,
      price: prices[mainItem],
    },
    side: {
      quantity: 1,
      description: toppingItem,
      "tax-rate": 6,
      price: prices[toppingItem],
    },
    drink: {
      quantity: 1,
      description: drinks,
      "tax-rate": 6,
      price: prices[drinks],
    },
    userId: userId,
  };

  console.log(formData);

  try {
    const response = await axios.post(
      "https://a7072ljrba.execute-api.us-east-1.amazonaws.com/api/kitchen",
      formData
    );
    console.log(response.data);
    snackbar.current.showSnackbar(true, "Order Placed");
    navigate("/");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const Kitchen = () => {
  const navigate = useNavigate();
  const [datePicker, setDatePciker] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [mainItem, setMainItem] = useState("");
  const [toppingItem, setToppingItem] = useState("");
  const [drinks, setDrinks] = useState("");

  const mainItemHandler = (event) => {
    setMainItem(event.target.value);
  };

  const toppingHandler = (event) => {
    setToppingItem(event.target.value);
  };

  const drinksHandler = (event) => {
    setDrinks(event.target.value);
  };

  const orderHandler = () => {
    placeOrder(mainItem, toppingItem, drinks, navigate);
  };

  useEffect(() => {
    console.log("home");
  }, []);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <img
            src="https://csci5410invoice.s3.amazonaws.com/Simple+Botanical+Menu.png"
            width="100%"
          />
        </Grid>
        <Grid item xs={6}>
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 2,
              padding: 4,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Main Items</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Main Items"
                onChange={mainItemHandler}
              >
                <MenuItem value={"english"}>English</MenuItem>
                <MenuItem value={"indian"}>Indian</MenuItem>
                <MenuItem value={"Continental"}>Continental</MenuItem>
              </Select>
            </FormControl>
          </Paper>
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 2,
              padding: 4,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Topping Items
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Topping Items"
                onChange={toppingHandler}
              >
                <MenuItem value={"Veggies"}>Veggies</MenuItem>
                <MenuItem value={"eggs"}>Eggs</MenuItem>
                <MenuItem value={"Bacon"}>Bacon</MenuItem>
              </Select>
            </FormControl>
          </Paper>
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 2,
              padding: 4,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Drinks</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Main Items"
                onChange={drinksHandler}
              >
                <MenuItem value={"tea"}>Tea</MenuItem>
                <MenuItem value={"coffee"}>Coffee</MenuItem>
                <MenuItem value={"greentea"}>Green Tea</MenuItem>
              </Select>
            </FormControl>
          </Paper>
          <Button
            type="button"
            variant="contained"
            marginTop="4px"
            disabled={
              mainItem.length < 1 ||
              toppingHandler.length < 1 ||
              drinks.length < 1
            }
            color="secondary"
            onClick={orderHandler}
          >
            Order
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Kitchen;
