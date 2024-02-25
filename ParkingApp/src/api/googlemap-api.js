import axios from "axios";

const googleMapApi = axios.create({
  baseURL: process.env.REACT_APP_GOOGLE_MAP_API_DOMAIN,
  headers: {
    "Content-Type": "application/json",
  },
});

export default googleMapApi;
