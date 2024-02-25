import { useState } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ShareUs from "../ShareUs";

function MobileNavBar() {
  const { state: authCtx, handleLogout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileLogOut = async () => {
    handleClose();
    handleLogout();
  };

  return (
    <>
      <IconButton
        edge="end"
        color="inherit"
        aria-label="menu"
        onClick={handleMenu}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem component={NavLink} to="/about-us" onClick={handleClose}>
          About Us
        </MenuItem>
        {authCtx.login_status ? (
          <>
            <MenuItem component={NavLink} to="/main" onClick={handleClose}>
              Home
            </MenuItem>
            <MenuItem
              component={NavLink}
              to="/main/trip-planner"
              onClick={handleClose}
            >
              Directions
            </MenuItem>
            <MenuItem component={NavLink} onClick={handleMobileLogOut}>
              LOGOUT
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem component={NavLink} to="/login" onClick={handleClose}>
              Login
            </MenuItem>
            <MenuItem component={NavLink} to="/signup" onClick={handleClose}>
              Sign Up
            </MenuItem>
          </>
        )}
        <ShareUs />
      </Menu>
    </>
  );
}
export default MobileNavBar;
