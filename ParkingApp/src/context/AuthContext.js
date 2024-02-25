import { googleLogout } from "@react-oauth/google";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { Navigate } from "react-router-dom";
import googleMapApi from "../api/googlemap-api";
import { authReducer, initialState } from "../reducers/AuthReducer";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState, () => {
    const loggedInUser = localStorage.getItem("user");
    return loggedInUser ? JSON.parse(loggedInUser) : initialState;
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state));
  }, [state]);
  const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  const handleLogin = (username, email, isGoogleUser) => {
    dispatch({
      type: "LOGIN",
      payload: { username, email, isGoogleUser },
    });
  };

  const handleLogout = () => {
    if (state.isGoogleUser) {
      googleLogout();
      <Navigate to="/" />;
    }
    dispatch({ type: "LOGOUT" });
    localStorage.clear("user");
    <Navigate to="/" />;
  };

  const handleSetTravelMode = async (mode) => {
    try {
      dispatch({
        type: "SET_TRAVEL_MODE",
        payload: { travelMode: mode },
      });
    } catch (error) {
      console.error("Error setting travel mode:", error.message);
    }
  };

  const handleGetCurrentAddress = async ({ lat, lng }) => {
    try {
      const response = await googleMapApi.get("/geocode/json", {
        params: {
          latlng: `${lat},${lng}`,
          key: googleApiKey,
        },
      });
      console.log("Calling handleGetCurrentAddress API", response);

      const data = response.data.results[0].formatted_address;
      dispatch({
        type: "SET_CURRENT_ADDRESS",
        payload: { currentAddress: data },
      });

      dispatch({
        type: "SET_INPUT_ADDRESS",
        payload: { inputAddress: data },
      });
    } catch (error) {
      console.error("Error fetching location address:", error.message);
    }
  };

  const handleGetLocationAddress = async ({ lat, lng }) => {
    try {
      const response = await googleMapApi.get("/geocode/json", {
        params: {
          latlng: `${lat},${lng}`,
          key: googleApiKey,
        },
      });
      console.log("Calling handleGetLocationAddress API", response);

      const data = response.data.results[0].formatted_address;
      dispatch({
        type: "SET_INPUT_ADDRESS",
        payload: { inputAddress: data },
      });
    } catch (error) {
      console.error("Error fetching location address:", error.message);
    }
  };

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      return;
    }

    await navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log("Calling handleGetCurrentLocation API", position);
        const { latitude, longitude } = position.coords;

        // Update state with new coordinates
        dispatch({
          type: "SET_CURRENT_COORDINATES",
          payload: {
            coordinates: { lat: latitude, lng: longitude },
          },
        });
        dispatch({
          type: "SET_INPUT_COORDINATES",
          payload: {
            coordinates: {
              lat: parseFloat(latitude),
              lng: parseFloat(longitude),
            },
          },
        });

        await handleGetCurrentAddress({ lat: latitude, lng: longitude });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.error("Location access was denied by the user.");
        } else {
          console.error("Error getting location:", error.message);
        }
      }
    );
  };

  //  to convert inputAddress to latlng
  //  in order to call weather and carpark API for more specific information

  const handleGetAddressLatlng = async ({ inputAddress }) => {
    try {
      const response = await googleMapApi.get("/geocode/json", {
        params: {
          address: inputAddress,
          components: "country:SG",
          key: googleApiKey,
        },
      });
      console.log("Calling handleGetAddressLatlng API", response);

      const data = response.data.results[0];

      const formattedAddress = data.formatted_address;

      dispatch({
        type: "SET_INPUT_ADDRESS",
        payload: { inputAddress: formattedAddress },
      });

      // Extract coordinates from the API response
      const { lat, lng } = data.geometry.location;

      // Update the inputAddress' lat,lng
      dispatch({
        type: "SET_INPUT_COORDINATES",
        payload: {
          coordinates: {
            lat: parseFloat(lat.toFixed(7)),
            lng: parseFloat(lng.toFixed(7)),
          },
        },
      });
    } catch (error) {
      console.error("Error fetching user location:", error.message);
    }
  };

  const context = {
    state,
    dispatch,
    handleLogin,
    handleLogout,
    handleGetCurrentLocation,
    handleGetAddressLatlng,
    handleGetLocationAddress,
    handleSetTravelMode,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};
