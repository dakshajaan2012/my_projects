import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useWeather } from "../context/WeatherContext";
import CloudyIcon from "./CloudyIcon";
import { Typography, Paper, Grid } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWind } from "@fortawesome/free-solid-svg-icons";
import WavesIcon from "@mui/icons-material/Waves";
import BarChartIcon from "@mui/icons-material/BarChart";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import useMediaQuery from "@mui/material/useMediaQuery";

const WeatherPage = () => {
  const { state: authCtx } = useAuth();
  const { state: weatherCtx, handleGetWeatherData } = useWeather();
  const [currentTime, setCurrentTime] = useState(new Date());
  const isMobile = useMediaQuery("(max-width:600px)");

  const sunrise = weatherCtx.weatherData?.sys?.sunrise
    ? new Date(weatherCtx.weatherData.sys.sunrise * 1000)
    : null;
  const sunset = weatherCtx.weatherData?.sys?.sunset
    ? new Date(weatherCtx.weatherData.sys.sunset * 1000)
    : null;

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    // Update the current time every minute
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const getCurrentDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[currentTime.getDay()];
  };

  const getCurrentDateAndTime = () => {
    const options = {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "numeric",
    };
    return currentTime.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (authCtx.inputCoords.lat && authCtx.inputCoords.lng) {
        await handleGetWeatherData({
          lat: authCtx.inputCoords.lat,
          lng: authCtx.inputCoords.lng,
        });
      }
    };

    fetchData(); // Call the function

    // Include handleGetWeatherData in the dependency array
  }, [authCtx.inputCoords.lat, authCtx.inputCoords.lng, handleGetWeatherData]);

  return (
    <Paper
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        margin: "10px auto",
        overflow: "hidden",
        width: isMobile ? "90%" : "95%",
        minHeight: "250px",
        maxWidth: "800px",
        height: "auto",
        background: "#2196f3",
        /* background: "orange", */
        animation: "fadeIn 1s ease-in-out",
        borderRadius: isMobile ? "10px" : "20px",
      }}
      elevation={2}
    >
      {weatherCtx.weatherData && (
        <>
          <div
            style={{
              background: "#0d47a1",
              padding: "1px",
              borderRadius: "20px",
              width: "100%",
            }}
          >
            <Typography variant="h5" color="#fff" style={{ margin: 0 }}>
              Weather Forecast
            </Typography>
          </div>

          {/* New section for day, date, and month */}
          <Typography variant="h6" color="#fff" style={{ margin: "5px 0" }}>
            {getCurrentDay()} - {getCurrentDateAndTime()}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            {/* Left column: Weather icon, temperature, and description */}
            <Grid item xs={12} sm={isMobile ? 12 : 6}>
              <Grid
                container
                direction="column"
                alignItems="center"
                style={{
                  width: "100%",
                  borderRadius: "20px",
                }}
              >
                <Grid item>
                  <CloudyIcon
                    weatherDescription={
                      weatherCtx.weatherData.weather[0].description
                    }
                  />
                </Grid>
                <Grid item>
                  <div style={{ textAlign: "center" }}>
                    <Typography variant="h6" color="#D3D3D3">
                      <ArrowDropUpIcon style={{ verticalAlign: "sub" }} />{" "}
                      {(
                        Math.round(weatherCtx.weatherData.main.temp_max * 10) /
                        10
                      ).toFixed(1)}
                      °C
                    </Typography>
                  </div>
                  <Typography
                    variant="h4"
                    color="#fff"
                    fontWeight="bold"
                    fontSize={isMobile ? "40px" : "60px"}
                  >
                    {(
                      Math.round(weatherCtx.weatherData.main.temp * 10) / 10
                    ).toFixed(1)}
                    °C
                  </Typography>
                  <div style={{ textAlign: "center" }}>
                    <Typography variant="h6" color="#D3D3D3">
                      <ArrowDropDownIcon style={{ verticalAlign: "sub" }} />{" "}
                      {(
                        Math.round(weatherCtx.weatherData.main.temp_min * 10) /
                        10
                      ).toFixed(1)}
                      °C
                    </Typography>
                  </div>
                </Grid>
                <Grid item>
                  <div style={{ textAlign: "center", marginBottom: "25px" }}>
                    <Typography
                      variant="h6"
                      color="#000"
                      fontWeight="bold"
                      style={{
                        textAlign: "center",
                        textTransform: "capitalize",
                        marginRight: isMobile ? "0px" : "0px",
                      }}
                    >
                      {weatherCtx.weatherData.weather[0].description}
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Grid>

            {/* Right column: Feels like, Wind, Humidity, Pressure, Sunrise, Sunset */}
            <div
              sx={{
                textAlign: "center",
                marginBottom: isMobile ? "0px" : "10px",
                width: "100%", // Ensure the entire width for mobile
              }}
            >
              <Grid item xs={12} sm={isMobile ? 12 : 6}>
                <Grid container spacing={2} direction="column">
                  {/* First row */}
                  <Grid
                    container
                    item
                    spacing={0}
                    xs={12}
                    style={{
                      width: isMobile ? "100%" : "270px",
                      height: "200px",
                      background: "white",
                      padding: "5px",
                      marginTop: "5px",
                      borderRadius: "5px",
                      border: "2px solid orange",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                      marginBottom: isMobile ? "1px" : "5px",
                      marginLeft: isMobile ? "auto" : "0px",
                    }}
                  >
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        color="#0d47a1"
                        fontWeight="bold"
                      >
                        Feels like:
                      </Typography>
                      <Typography variant="body1" color="green">
                        {weatherCtx.weatherData.main.feels_like}°C
                        <span style={{ fontSize: "24px" }}>🌡️</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        color="#0d47a1"
                        fontWeight="bold"
                      >
                        Wind:
                      </Typography>
                      <Typography variant="body1" color="ligthblue">
                        {weatherCtx.weatherData.wind.speed} m/s
                        <FontAwesomeIcon
                          icon={faWind}
                          size="2x"
                          color="lightblue"
                        />
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Second row */}
                  <Grid
                    container
                    item
                    spacing={0}
                    xs={12}
                    style={{
                      width: isMobile ? "100%" : "270px",
                      height: "auto",
                      background: "white",
                      padding: "5px",
                      borderRadius: "5px",
                      marginTop: "0px",
                      marginBottom: isMobile ? "1px" : "5px",
                      border: "2px solid orange",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                      marginLeft: isMobile ? "auto" : "0px",
                      alignContent: isMobile ? "center" : "left",
                    }}
                  >
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        color="#0d47a1"
                        fontWeight="bold"
                      >
                        Humidity:
                      </Typography>
                      <Typography variant="body1" color="tan">
                        {weatherCtx.weatherData.main.humidity}%
                        <WavesIcon fontSize="large" style={{ color: "tan" }} />
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        color="#0d47a1"
                        fontWeight="bold"
                      >
                        Pressure:
                      </Typography>
                      <Typography variant="body1" color="red">
                        {weatherCtx.weatherData.main.pressure} hPa
                        <BarChartIcon
                          fontSize="large"
                          style={{ color: "red" }}
                        />
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* Third row */}
                  <Grid
                    container
                    item
                    spacing={0}
                    xs={12}
                    style={{
                      width: isMobile ? "100%" : "270px",
                      background: "white",
                      padding: "5px",
                      borderRadius: "5px",
                      marginTop: "0px",
                      border: "2px solid orange",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                      marginLeft: isMobile ? "80px" : "0px",
                      marginBottom: isMobile ? "1px" : "5px",
                    }}
                  >
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        color="#0d47a1"
                        fontWeight="bold"
                      >
                        Sunrise:
                      </Typography>
                      <Typography variant="body1" color="orange">
                        {sunrise && formatTime(sunrise)}
                        <WbSunnyIcon
                          fontSize="large"
                          style={{ color: "orange" }}
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        color="#0d47a1"
                        fontWeight="bold"
                      >
                        Sunset:
                      </Typography>
                      <Typography variant="body1" color="brown">
                        {sunset && formatTime(sunset)}
                        <Brightness3Icon
                          fontSize="large"
                          style={{ color: "brown" }}
                        />
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </>
      )}
    </Paper>
  );
};

export default WeatherPage;
