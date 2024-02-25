import AssistantDirectionRoundedIcon from "@mui/icons-material/AssistantDirectionRounded";
import DirectionsBikeRoundedIcon from "@mui/icons-material/DirectionsBikeRounded";
import DirectionsBusRoundedIcon from "@mui/icons-material/DirectionsBusRounded";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import TimeToLeaveRoundedIcon from "@mui/icons-material/TimeToLeaveRounded";
import WrongLocationRoundedIcon from "@mui/icons-material/WrongLocationRounded";
import { Box, Button, FormControl, Grid, TextField } from "@mui/material";
import { blue, green, red, orange, grey } from "@mui/material/colors";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./CarparkPage.module.css";
import PanelComponent from "./PanelStyle";
import useMediaQuery from "@mui/material/useMediaQuery";

const TripPlannerPage = () => {
  const {
    state: authCtx,
    handleGetLocationAddress,
    handleGetAddressLatlng,
    handleSetTravelMode,
  } = useAuth();
  const [waypoints, setWaypoints] = useState([]);
  const [newWaypoint, setNewWaypoint] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const isInitialLoad = useRef(true);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [directionsError, setDirectionsError] = useState(null);
  const [countdown, setCountdown] = useState(10);

  const origin = `${authCtx.currentCoords.lat},${authCtx.currentCoords.lng}`;
  const destination = authCtx.inputAddress;
  const travelMode = authCtx.travelMode;

  useEffect(() => {
    if (
      authCtx.currentCoords.lat &&
      authCtx.currentCoords.lng &&
      authCtx.inputAddress &&
      isInitialLoad.current
    ) {
      const initMap = () => {
        const map = new window.google.maps.Map(document.getElementById("map"), {
          zoom: 14,
          center: {
            lat: authCtx.currentCoords.lat,
            lng: authCtx.inputCoords.lng,
          },
        });

        // Remove existing elements with class "adp"
        const existingAdpElements = document.querySelectorAll(".adp");
        existingAdpElements.forEach((element) => element.remove());

        // TODO : upon selecting suggestsed routes, element kept shifting
        // Remove Suggested Routes if waypoints exist
        if (waypoints.length > 0) {
          const existingAdpListElements =
            document.querySelectorAll(".adp-list");
          existingAdpListElements.forEach((element) => element.remove());
        }

        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          draggable: false,
          map,
          panel: document.getElementById("panel"),
        });

        directionsRenderer.addListener("directions_changed", () => {
          const directions = directionsRenderer.getDirections();
          if (directions) {
            computeTotalDistance(directions);
          }
        });

        displayRoute(
          origin,
          destination,
          waypoints.filter((waypoint) => waypoint.trim() !== ""),
          travelMode,
          directionsService,
          directionsRenderer
        );

        // Add click event listener to the panel to zoom in and show the directions on the map
        document.getElementById("panel").addEventListener("click", () => {
          // Get the coordinates of the selected location
          const selectedLocation =
            directionsRenderer.getDirections().routes[0].legs[0].end_location;

          map.setZoom(16); // Set the desired zoom level
          map.setCenter(selectedLocation); // Center the map to the selected location
          directionsRenderer.setMap(map); // Show the directions on the map
        });

        // Cleanup function
        return () => {
          // Clear the map-related content
          isInitialLoad.current = false;
          if (directionsRenderer) {
            directionsRenderer.setMap(null);
          }
        };
      };

      const displayRoute = (
        origin,
        destination,
        waypoints,
        travelMode,
        service,
        display
      ) => {
        const request = {
          origin: origin,
          destination: destination,
          waypoints: waypoints.map((waypoint) => ({
            location: waypoint,
            stopover: true,
          })),
          optimizeWaypoints: true, //rearrange waypoints
          travelMode: window.google.maps.TravelMode[travelMode],
          provideRouteAlternatives: true,
          avoidTolls: true,
        };

        // TODO - to add more travelModes - bus / train
        // If travelMode is transit, add transitOptions to the request for BUS / TRAIN
        // if (travelMode === "TRANSIT") {
        //   request.transitOptions = {
        //     modes: ["TRAIN"],
        //     routingPreference: "FEWER_TRANSFERS",
        //   };
        // }

        service
          .route(request)
          .then((result) => {
            display.setDirections(result);
            setDirectionsError(null);
          })
          .catch((error) => {
            const errorMessage =
              error && error.message
                ? error.message
                : "An error occurred while fetching directions.";

            setDirectionsError(errorMessage);
          });
      };

      const computeTotalDistance = (result) => {
        let total = 0;
        const myroute = result.routes[0];

        if (!myroute) {
          return;
        }

        for (let i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value;
        }

        total = total / 1000;
        document.getElementById("total").innerHTML =
          "Total Distance: " + total.toFixed(1) + " km";
      };

      if (window.google) {
        initMap();
      } else {
        // Handle the case when the Google Maps API is not loaded.
        console.error("Google Maps API not loaded");
      }
    }
  }, [
    destination,
    origin,
    travelMode,
    authCtx.currentCoords.lat,
    authCtx.currentCoords.lng,
    authCtx.inputAddress,
    authCtx.inputCoords.lng,
    waypoints,
  ]);

  const handleSetInputAddress = () => {
    try {
      handleGetAddressLatlng({ inputAddress });
      handleGetLocationAddress({
        lat: authCtx.inputCoords.lat,
        lng: authCtx.inputCoords.lng,
      });
    } catch (error) {
      console.error("Error in setting input address:", error);
      setDirectionsError("Error setting input address. Please try again.");
      return;
    }
  };

  const handleAddWaypoint = (e) => {
    e.preventDefault();
    try {
      const newWaypointWithSG = newWaypoint.trim() + " SG";
      setWaypoints((prevWaypoints) => [...prevWaypoints, newWaypointWithSG]);
      setNewWaypoint("");
    } catch (error) {
      console.error("Error in adding waypoint:", error);
      setDirectionsError("Error adding waypoint. Please try again.");

      // Set a timer to reset waypoints after 10 seconds
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      // Clear the timer after 10 seconds
      setTimeout(() => {
        clearInterval(timer);
        setWaypoints([]);
        setDirectionsError(null);
        setCountdown(10);
      }, 10000);
    }
  };

  const handleRemoveWaypoint = (index) => {
    try {
      setWaypoints((prevWaypoints) => {
        const newWaypoints = [...prevWaypoints];
        newWaypoints.splice(index, 1);
        return newWaypoints;
      });
    } catch (error) {
      console.error("Error in removing waypoint:", error);
      return;
    }
  };

  return (
    <div>
      {authCtx.currentCoords.lat && authCtx.currentCoords.lng ? (
        <div>
          <div className={styles.header}>
            <h1
              className={styles.title}
              style={{ fontSize: isMobile ? "0.75rem" : "1rem" }}
            >
              Directions to:{" "}
              <span style={{ color: "#0d47a1", textDecoration: "underline" }}>
                {authCtx.inputAddress}
              </span>
              <div id="total"></div>
            </h1>
          </div>

          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {/* Map on the left */}
            <Grid item xs={12} md={9}>
              <div id="map" style={{ height: "400px", width: "100%" }}></div>
            </Grid>

            {/* Right column for Input Address, Waypoint Form, and Waypoints List */}
            <Grid item xs={12} md={3}>
              {/* Travel Mode Icons */}
              <Box mt={2} mb={2}>
                <Grid container spacing={2} justifyContent="left">
                  <Grid item>
                    <TimeToLeaveRoundedIcon
                      onClick={() => handleSetTravelMode("DRIVING")}
                      sx={{
                        color: blue[500],
                        backgroundColor:
                          authCtx.travelMode === "DRIVING"
                            ? blue[100]
                            : "transparent",
                      }}
                      style={{
                        cursor: "pointer",
                        width: isMobile ? "20px" : "40px",
                        height: isMobile ? "20px" : "40px",
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <DirectionsBusRoundedIcon
                      sx={{
                        color: orange[500],
                        backgroundColor:
                          authCtx.travelMode === "TRANSIT"
                            ? orange[100]
                            : "transparent",
                      }}
                      onClick={() => handleSetTravelMode("TRANSIT")}
                      style={{
                        cursor: "pointer",
                        width: isMobile ? "20px" : "40px",
                        height: isMobile ? "20px" : "40px",
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <DirectionsWalkRoundedIcon
                      onClick={() => handleSetTravelMode("WALKING")}
                      sx={{
                        color: green[500],
                        backgroundColor:
                          authCtx.travelMode === "WALKING"
                            ? green[100]
                            : "transparent",
                      }}
                      style={{
                        cursor: "pointer",
                        width: isMobile ? "20px" : "40px",
                        height: isMobile ? "20px" : "40px",
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <DirectionsBikeRoundedIcon
                      onClick={() => handleSetTravelMode("BICYCLING")}
                      sx={{
                        color: grey[500],
                        backgroundColor:
                          authCtx.travelMode === "BICYCLING"
                            ? grey[100]
                            : "transparent",
                      }}
                      style={{
                        cursor: "pointer",
                        width: isMobile ? "20px" : "40px",
                        height: isMobile ? "20px" : "40px",
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
              {/* Input Address TextField */}
              <Box mt={2} mb={2} sx={{ display: "flex", alignItems: "center" }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={10} md={8}>
                    <TextField
                      label={authCtx.inputAddress}
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      value={inputAddress}
                      onChange={(e) => setInputAddress(e.target.value)}
                      error={inputAddress.length > 0 && inputAddress.length < 3}
                      helperText={
                        inputAddress.length > 0 && inputAddress.length < 3
                          ? "Requires at least 3 characters"
                          : ""
                      }
                      InputProps={{
                        style: { fontSize: isMobile ? "0.75rem" : "1rem" },
                      }}
                      InputLabelProps={{
                        style: { fontSize: isMobile ? "0.75rem" : "1rem" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={2} md={2}>
                    <Button
                      type="submit"
                      disabled={inputAddress.length < 3}
                      style={{ padding: 0 }}
                      onClick={handleSetInputAddress}
                    >
                      <AssistantDirectionRoundedIcon
                        sx={{
                          color:
                            inputAddress.length < 3 ? green[50] : green[400],
                        }}
                        style={{
                          cursor: "pointer",
                          width: isMobile ? "20px" : "40px",
                          height: isMobile ? "20px" : "40px",
                        }}
                      />
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Add Waypoint Form */}
              {authCtx.travelMode !== "TRANSIT" && (
                <>
                  <Box
                    mt={2}
                    mb={2}
                    sx={{ display: "flex", alignItems: "center" }}
                    fullWidth
                  >
                    <form onSubmit={handleAddWaypoint}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={10} md={8}>
                          <FormControl variant="outlined">
                            <TextField
                              id="waypoint"
                              label="Add Stopover"
                              variant="outlined"
                              fullWidth
                              value={newWaypoint}
                              onChange={(e) => setNewWaypoint(e.target.value)}
                              error={
                                waypoints.length > 2 && waypoints.length < 3
                              }
                              disabled={waypoints.length > 1}
                              InputProps={{
                                style: {
                                  fontSize: isMobile ? "0.75rem" : "1rem",
                                },
                              }}
                              InputLabelProps={{
                                style: {
                                  fontSize: isMobile ? "0.75rem" : "1rem",
                                },
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={2} md={2}>
                          <Button
                            type="submit"
                            disabled={
                              waypoints.length > 1 || newWaypoint.trim() === ""
                            }
                            style={{ padding: 0 }}
                          >
                            <RouteRoundedIcon
                              sx={{
                                color:
                                  waypoints.length > 1 ||
                                  newWaypoint.trim() === ""
                                    ? blue[50]
                                    : blue[400],
                              }}
                              style={{
                                cursor: "pointer",
                                width: "30px",
                                height: "30px",
                              }}
                            />
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Box>

                  {/* Waypoints List */}
                  {waypoints.map((waypoint, index) => (
                    <div key={index}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={10} md={8}>
                          <TextField
                            label={`Stopover Location ${index + 1}`}
                            variant="outlined"
                            value={waypoint}
                            fullWidth
                            disabled
                            InputProps={{
                              style: {
                                fontSize: isMobile ? "0.75rem" : "1rem",
                              },
                            }}
                            InputLabelProps={{
                              style: {
                                fontSize: isMobile ? "0.75rem" : "1rem",
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={2} md={2}>
                          <Button
                            onClick={() => handleRemoveWaypoint(index)}
                            style={{ padding: 0 }}
                          >
                            <WrongLocationRoundedIcon
                              sx={{ color: red[400] }}
                              style={{
                                cursor: "pointer",
                                width: "30px",
                                height: "30px",
                              }}
                            />
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                </>
              )}

              {directionsError && (
                <div
                  style={{
                    color: "red",
                    marginTop: "10px",
                    fontSize: isMobile ? "5px" : "10px",
                  }}
                >
                  {directionsError}
                  <br />
                  {`Refreshing waypoints in ${countdown} seconds`}
                </div>
              )}
            </Grid>

            {/* Panel */}
            <Grid item xs={12} sm={12} md={12}>
              <Box mt={2} mb={2}>
                <PanelComponent
                  travelMode={authCtx.travelMode}
                  isMobile={isMobile}
                />
              </Box>
            </Grid>
          </Grid>
        </div>
      ) : (
        <div>
          <p>Hello, {authCtx.username}, please enter your location.</p>
        </div>
      )}
    </div>
  );
};

export default TripPlannerPage;
