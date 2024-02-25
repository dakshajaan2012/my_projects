import axios from "axios";
import moment from "moment";
import { SVY21 } from "../svy21";
import { v4 as uuid } from "uuid";

let cv = new SVY21();

const carparkAddressApi = axios.create({
  baseURL: process.env.REACT_APP_GOVSG_DATASTORE_DOMAIN,
  headers: {
    "Content-Type": "application/json",
  },
});

const carparkAvailabilityApi = axios.create({
  baseURL: process.env.REACT_APP_GOVSG_API_DOMAIN,
  headers: {
    "Content-Type": "application/json",
  },
});

const carparkData = async () => {
  let availabilityResponse, addressResponse;

  try {
    [availabilityResponse, addressResponse] = await Promise.all([
      // https://beta.data.gov.sg/collections/85/view
      carparkAvailabilityApi.get("/transport/carpark-availability"),
      // https://beta.data.gov.sg/datasets/d_23f946fa557947f93a8043bbef41dd09/view
      carparkAddressApi.get("/datastore_search", {
        params: {
          resource_id: "d_23f946fa557947f93a8043bbef41dd09",
          limit: "3000",
        },
      }),
    ]);
  } catch (error) {
    console.error("Error fetching carpark data:", error.message);
  }
  return { availabilityResponse, addressResponse };
};

const getLotTypeDescription = (lotType) => {
  switch (lotType) {
    case "C":
      return "Car";
    case "M":
      return "Motorcycle";
    case "H":
      return "Heavy Vehicle";
    default:
      return "";
  }
};

// Function to merge availability and address data
const mergeCarparkData = (availabilityResponse, addressResponse) => {
  const carparkWithLots = availabilityResponse.data.items.flatMap((item) =>
    item.carpark_data.map((row) => ({
      ...row,
      carpark_number: row.carpark_number,
      update_datetime: moment(row.update_datetime) || "",
      total_lots: row.carpark_info[0]?.total_lots || 0,
      lot_type: getLotTypeDescription(row.carpark_info[0]?.lot_type) || "",
      lots_available: row.carpark_info[0]?.lots_available || 0,
      distance: 0,
    }))
  );

  const carparkWithAddr = addressResponse.data.result.records.map((row) => ({
    ...row,
    carpark_number: row.car_park_no,
    address: row.address,
  }));

  const merge = carparkWithLots.map((item) => {
    const findMatching = carparkWithAddr.find(
      (cp) => cp.carpark_number.trim() === item.carpark_number.trim()
    );

    const coodinates = cv.computeLatLon(
      findMatching?.y_coord,
      findMatching?.x_coord
    );

    const id = item.car_park_no || uuid();

    const newObj = findMatching
      ? {
          ...item,
          ...(findMatching || {}),
          lat: coodinates.lat.toFixed(7),
          lon: coodinates.lon.toFixed(7),
          id: id,
        }
      : {
          ...item,
          carpark_info: [],
          update_datetime: "Not available",
          lat: coodinates.lat.toFixed(7),
          lon: coodinates.lon.toFixed(7),
          id: id,
        };
    return newObj;
  });

  return merge;
};

export { carparkData, mergeCarparkData };
