import { Box, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import CarparkPage from "./CarparkPage";
import styles from "./CarparkPage.module.css";
import LoadLocation from "./LoadLocation";
import WeatherPage from "./WeatherPage";
import { useNavigate } from "react-router-dom";
import AddressConfirmationModal from "./AddressConfirmationModal";
import ReactLoading from "react-loading";
import useMediaQuery from "@mui/material/useMediaQuery";

function MainPage() {
  const { state: authCtx } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleConfirmNavigation = () => {
    setIsModalOpen(false);
    navigate("/main/trip-planner");
  };

  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (!authCtx.currentAddress) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [authCtx.currentAddress]);

  useEffect(() => {
    if (authCtx.login_status && initialLoadRef.current) {
      initialLoadRef.current = false;
    }
  }, [authCtx.login_status]);

  return (
    <div className={styles.container}>
      {!isLoading ? (
        <>
          <Grid
            container
            spacing={{ xs: 1, md: 3 }}
            minHeight={400}
            rowSpacing={2}
          >
            <Grid item xs={12} textAlign="left">
              {authCtx && authCtx.login_status && (
                <Typography
                  variant="h4"
                  style={{ fontWeight: "bold" }}
                  gutterBottom
                >
                  <span style={{ color: "#000" }}>Welcome, </span>
                  <span
                    style={{
                      color: "#0d47a1",
                    }}
                  >
                    {authCtx.username}
                  </span>
                  !
                </Typography>
              )}
            </Grid>
            <Grid item xs={isMobile ? 12 : 6}>
              <Paper
                elevation={3}
                style={{
                  padding: "10px",
                  marginTop: isMobile ? "20px" : "80px",
                  minHeight: isMobile ? "80px" : "100px",
                  background: "#2196f3",
                }}
              >
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: "bold",
                    color: "#0d47a1",
                    fontSize: isMobile ? "1rem" : "1.5rem",
                  }}
                >
                  Selected Location:
                </Typography>
                <Typography
                  variant="h5"
                  style={{
                    fontWeight: "bold",
                    color: "#fff",
                    fontSize: isMobile ? "1rem" : "1.5rem",
                  }}
                >
                  {authCtx.inputAddress && (
                    <u
                      style={{ cursor: "pointer" }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      {authCtx.inputAddress}
                    </u>
                  )}
                </Typography>
                <AddressConfirmationModal
                  open={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onConfirm={handleConfirmNavigation}
                  address={authCtx.inputAddress}
                />
              </Paper>
              <Grid item xs={12} rowSpacing={2} marginTop={isMobile ? 2 : 5}>
                <LoadLocation />
              </Grid>
            </Grid>
            <Grid item xs={isMobile ? 12 : 6}>
              <Box
                minHeight={isMobile ? "300px" : "400px"}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <WeatherPage />
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={1} marginTop="2px">
            <Grid item xs={12}>
              <Box
                minHeight={isMobile ? "300px" : "400px"}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <CarparkPage isMobile={isMobile} />
              </Box>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <ReactLoading
            type={"bars"}
            color={"rgb(0, 191, 255)"}
            height={"65%"}
            width={"65%"}
          />
          {isMobile && (
            <h3 style={{ color: "rgb(0, 191, 255)" }}>TodayJalanWhereSG</h3>
          )}
        </>
      )}
    </div>
  );
}

export default MainPage;
