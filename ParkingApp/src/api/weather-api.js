import axios from "axios";

const weatherApi = axios.create({
  baseURL: process.env.REACT_APP_OPENWEATHERMAP_API_DOMAIN,
  headers: {
    "Content-Type": "application/json",
  },
});

export default weatherApi;
