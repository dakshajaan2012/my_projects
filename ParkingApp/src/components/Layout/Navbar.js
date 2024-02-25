import React from "react";
import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import ElectricCarRoundedIcon from "@mui/icons-material/ElectricCarRounded";
import { blue } from "@mui/material/colors";
import MobileNavBar from "./NavBar/MobileNavBar";
import DesktopNavBar from "./NavBar/DesktopNavBar";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { state: authCtx } = useAuth();

  return (
    <AppBar className="navbar">
      <Toolbar
        className="container"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <NavLink
          to={authCtx.login_status ? "/main" : "/"}
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button style={{ padding: 0 }}>
            <ElectricCarRoundedIcon
              sx={{ color: blue[50] }}
              style={{
                cursor: "pointer",
                width: isMobile ? "30px" : "50px",
                height: isMobile ? "30px" : "50px",
              }}
            />
          </Button>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              fontSize: isMobile ? "1rem" : "1.5rem",
              color: blue[100],
              marginLeft: isMobile ? "0px" : "10px",
            }}
          >
            TodayJalanWhereSG
          </Typography>
        </NavLink>
        {isMobile ? <MobileNavBar /> : <DesktopNavBar />}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
