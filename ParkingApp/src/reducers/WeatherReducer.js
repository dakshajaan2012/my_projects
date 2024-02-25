export const defaultWeather = {
  weatherData: null,
};

export const weatherReducer = (state, action) => {
  switch (action.type) {
    case "SET_WEATHER_DATA":
      return { ...state, weatherData: action.payload };
    default:
      return state;
  }
};
