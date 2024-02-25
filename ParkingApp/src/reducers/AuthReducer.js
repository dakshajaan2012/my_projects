import moment from "moment";
import "moment-timezone";

export const initialState = {
  username: "",
  currentCoords: { lat: null, lng: null },
  currentAddress: "",
  inputCoords: { lat: null, lng: null },
  inputAddress: "",
  login_status: false,
  login_time: "",
  isGoogleUser: false,
  travelMode: "DRIVING",
  errors: {},
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const login_time = moment()
        .tz("Asia/Singapore")
        .format("YYYY-MM-DD HH:mm:ss");
      return {
        ...state,
        username: action.payload.username,
        isGoogleUser: action.payload.isGoogleUser,
        login_status: true,
        login_time: login_time,
      };
    case "LOGOUT":
      return {
        ...initialState,
      };
    case "SET_CURRENT_COORDINATES":
      return {
        ...state,
        currentCoords: action.payload.coordinates,
      };
    case "SET_INPUT_COORDINATES":
      return {
        ...state,
        inputCoords: action.payload.coordinates,
      };
    case "SET_INPUT_ADDRESS":
      return {
        ...state,
        inputAddress: action.payload.inputAddress,
      };
    case "SET_CURRENT_ADDRESS":
      return {
        ...state,
        currentAddress: action.payload.currentAddress,
      };
    case "SET_TRAVEL_MODE":
      return {
        ...state,
        travelMode: action.payload.travelMode,
      };
    default:
      return state;
  }
};
