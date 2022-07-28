import AppBar from "@mui/material/AppBar";
import { Box, Toolbar, Container, Button } from "@mui/material/";
import NavTitle from "./nav-title";
import NavMenuPages from "./nav-menu-pages";
import NavUser from "./nav-user";
import { useNavigate } from "react-router-dom";

const pages = ["Home", "Kitchen", "Feedback", "Tour", "Visualization"];

const Navbar = () => {
  const navigate = useNavigate();

  const navigateToPage = (page) => {
    if (page === "Home") {
      navigate("/");
    }
    if (page === "Kitchen") {
      navigate("/kitchen");
    }
    if (page === "Feedback") {
      navigate("/feedback");
    }
    if (page === "Tour") {
      navigate("/tour");
    }
    if (page === "Visualization") {
      navigate("/visualization");
    }
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <NavTitle
            title="Serverless B&B"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
            }}
          />

          <NavMenuPages pages={pages} />

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => navigateToPage(page)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <NavUser />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
