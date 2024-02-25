import { AppBar, Toolbar, Typography } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Copyright from "../CopyRight";
import useMediaQuery from "@mui/material/useMediaQuery";

const Footer = () => {
  const { state: authCtx } = useAuth();
  const [isMobile, setIsMobile] = useState(useMediaQuery("(max-width:600px)"));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      {!isMobile && (
        <AppBar position="fixed" sx={{ top: "auto", bottom: 0 }}>
          <Toolbar>
            <>
              <Typography variant="body1" sx={{ marginLeft: "20px" }}>
                <Copyright />
              </Typography>
              {authCtx.login_status && (
                <Typography
                  variant="body1"
                  sx={{ marginLeft: "auto", marginRight: "20px" }}
                >
                  Logged in as <b>{authCtx.username}</b> at{" "}
                  {moment(authCtx.login_time).format("DD-MMM-YY hh:mm A")}
                </Typography>
              )}
            </>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
};

export default Footer;
