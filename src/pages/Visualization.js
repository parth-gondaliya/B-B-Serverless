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

const Visualization = () => {
  function Iframe(props) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : "" }}
      />
    );
  }
  const iFrameVar1 =
    '<iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/9c5658bf-0773-49be-a426-5fef753eff11/page/DCZyC" frameborder="0" style="border:0" allowfullscreen></iframe>';

  const iFrameVar2 =
    '<iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/7c56ed76-f966-468b-b796-baf56867ca9e/page/COZyC" frameborder="0" style="border:0" allowfullscreen></iframe>';

  const iFrameVar3 =
    '<iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/334e7066-db08-48d3-bedf-e08b6674e7a2/page/JBZyC" frameborder="0" style="border:0" allowfullscreen></iframe>';

  return (
    <Container maxWidth="lg">
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
        <Stack spacing={2}>
          <div>
            <Iframe iframe={iFrameVar1} />,
          </div>
          <div>
            <Iframe iframe={iFrameVar3} />,
          </div>
          <div>
            <Iframe iframe={iFrameVar2} />,
          </div>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Visualization;
