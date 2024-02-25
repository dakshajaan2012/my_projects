import React from "react";
import styles from "./AboutUs.module.css";
import { useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useAuth } from "../context/AuthContext";

const defaultTheme = createTheme();

function AboutUs() {
  const navigate = useNavigate();
  const { state: authCtx } = useAuth();

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container>
        <div className={styles.container}>
          <h1>Our Story</h1>
          <p>
            <strong>Welcome to TodayJalanWhereSG!</strong>
          </p>
          <p>
            We're here to simplify your commute by offering real-time carpark
            availability alongside accurate weather forecasts for your parking
            spots. Our team sources parking data and partners with reliable
            weather services, ensuring you're informed and prepared for your
            travels. Count on us to streamline your parking experience and keep
            you weather-ready, wherever you go.
          </p>
          <span>
            Special thanks from our developer team: Mellissa - Mastermind &
            Leader, Yao Hai - Strong Support, Sunil - Big Brother, Kelvin -
            Maknae
          </span>
        </div>

        <div className={styles.leftcontainers}>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <img src="/WhyChooseUs-image.jpg" alt="WhyChooseUs"></img>
          </Box>
          <h2>Why Choose Us?</h2>
          <h3>
            <strong>Get immediate insights</strong> into available parking
            spaces and precise weather forecasts for your chosen spots.
            <strong> Save time and stress</strong> by knowing where to park and
            what conditions to expect, all at your fingertips. Trust in our
            <strong> vetted data sources</strong> and partnerships with weather
            services for accurate, dependable information.
          </h3>
        </div>

        <div className={styles.rightcontainers}>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <img src="/Weather-image.jpg" alt="weather"></img>
          </Box>
          <h2>Weather</h2>
          <h3>
            "Stay ahead of the elements. Access precise, location-based weather
            forecasts for confident planning—know what to expect, from hourly
            updates to extended outlooks"
          </h3>
        </div>

        <div className={styles.leftcontainers}>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <img src="/Navigation-image.jpg" alt="parking"></img>
          </Box>
          <h2>Parking</h2>
          <h3>
            "Parking made simple. Real-time updates on available spaces in
            various areas, saving you time and hassle. Find your spot before you
            arrive and streamline your journey."
          </h3>
        </div>
        <div className={styles.footer}>
          <h2>Become our member, it's easy</h2>

          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            {authCtx.login_status ? (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Sign up
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Sign up
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Login
                </Button>
              </>
            )}
          </Stack>
          <h3>No credit card is required.</h3>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default AboutUs;
