import { BlueButton } from "../ButtonStyle";
import { NavLink } from "react-router-dom";
import { Typography, Button } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import ShareUs from "../ShareUs";

function DesktopNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { state: authCtx, handleLogout } = useAuth();

  const handleLogOut = async () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        <div style={{ textAlign: "right" }}>
          <BlueButton
            color="inherit"
            component={NavLink}
            to="/about-us"
            style={{
              background:
                location.pathname === "/" || location.pathname === "/about-us"
                  ? "#1565c0"
                  : "inherit",
            }}
          >
            About Us
          </BlueButton>
          {authCtx.login_status ? (
            <>
              <Button
                color="inherit"
                component={NavLink}
                to="/main"
                style={{
                  background:
                    location.pathname === "/main" ? "#1565c0" : "inherit",
                }}
              >
                Home
              </Button>
              <BlueButton
                color="inherit"
                component={NavLink}
                to="/main/trip-planner"
                style={{
                  background:
                    location.pathname === "/main/trip-planner"
                      ? "#1565c0"
                      : "inherit",
                }}
              >
                Directions
              </BlueButton>
              <BlueButton
                color="inherit"
                component={NavLink}
                onClick={handleLogOut}
              >
                Log out
              </BlueButton>
            </>
          ) : (
            <>
              <BlueButton
                color="inherit"
                component={NavLink}
                to="/login"
                style={{
                  background:
                    location.pathname === "/login" ? "#1565c0" : "inherit",
                }}
              >
                Login
              </BlueButton>
              <BlueButton
                color="inherit"
                component={NavLink}
                to="/signup"
                style={{
                  background:
                    location.pathname === "/signup" ? "#1565c0" : "inherit",
                }}
              >
                Sign Up
              </BlueButton>
            </>
          )}
          <ShareUs />
        </div>
      </Typography>
    </>
  );
}

export default DesktopNavBar;
