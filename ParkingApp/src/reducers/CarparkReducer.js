export const defaultCarpark = {
  carparkData: [],
};

export const carparkReducer = (state, action) => {
  switch (action.type) {
    case "SET_CARPARK_DATA":
      return { ...state, carparkData: action.payload };

    default:
      return state;
  }
};
