import React, { createContext, useContext, useReducer } from "react";
import weatherApi from "../api/weather-api";
import { defaultWeather, weatherReducer } from "../reducers/WeatherReducer";

export const WeatherContext = createContext();
const openWeatherMapApiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

export const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, defaultWeather);

  const handleGetWeatherData = async ({ lat, lng }) => {
    try {
      const response = await weatherApi.get("/weather", {
        params: {
          lat: lat,
          lon: lng,
          units: "metric",
          appid: openWeatherMapApiKey,
        },
      });
      console.log("Calling handleGetWeatherData API", response);

      const data = response.data;

      dispatch({ type: "SET_WEATHER_DATA", payload: data });
    } catch (error) {
      console.error("Error getting weather data:", error.message);
      dispatch({ type: "SET_WEATHER_DATA", payload: null });
    }
  };

  const context = {
    state,
    dispatch,
    handleGetWeatherData,
  };

  return (
    <WeatherContext.Provider value={context}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};
