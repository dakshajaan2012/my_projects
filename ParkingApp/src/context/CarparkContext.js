import { createContext, useContext, useReducer } from "react";

import * as geolib from "geolib";
import { carparkData, mergeCarparkData } from "../api/carpark-api";
import { carparkReducer, defaultCarpark } from "../reducers/CarparkReducer";

export const CarparkContext = createContext();

export const CarparkProvider = ({ children }) => {
  const [state, dispatch] = useReducer(carparkReducer, defaultCarpark);

  const handleFetchCarparkData = async ({ lat, lng }) => {
    try {
      const { availabilityResponse, addressResponse } = await carparkData();
      const mergedData = mergeCarparkData(
        availabilityResponse,
        addressResponse
      );
      console.log("Calling handleFetchCarparkData API", mergedData);

      // Calculate distances based on coordinates
      const carparkDataWithDistance = mergedData.map((item) => {
        if (lat !== null && lng !== null) {
          const dist =
            geolib.getDistance(
              {
                lat: lat,
                lon: lng,
              },
              { lat: item.lat, lon: item.lon }
            ) / 1000;
          return { ...item, distance: isNaN(dist) ? "" : dist.toFixed(2) };
        } else {
          // If coordinates are not available, set distance as empty string
          return { ...item, distance: "" };
        }
      });

      dispatch({ type: "SET_CARPARK_DATA", payload: carparkDataWithDistance });
    } catch (error) {
      console.error("Error fetching carpark data:", error.message);
      dispatch({ type: "SET_CARPARK_DATA", payload: null });
    }
  };

  const context = {
    state,
    dispatch,
    handleFetchCarparkData,
  };

  return (
    <CarparkContext.Provider value={context}>
      {children}
    </CarparkContext.Provider>
  );
};

export const useCarpark = () => {
  const context = useContext(CarparkContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
