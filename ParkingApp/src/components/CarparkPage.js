import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import { Box, Button } from "@mui/material";
import AddressConfirmationModal from "./AddressConfirmationModal";
import TableToolbar from "./DataGridToolBar";
import clsx from "clsx";

import {
  DataGrid,
  gridFilteredSortedRowIdsSelector,
  selectedGridRowsSelector,
} from "@mui/x-data-grid";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApplicableOperatorsList, renderDateTime } from "../DataGridUtils";
import { useAuth } from "../context/AuthContext";
import { useCarpark } from "../context/CarparkContext";
import styles from "./CarparkPage.module.css";

const CarparkPage = ({ isMobile }) => {
  const {
    state: authCtx,
    handleGetLocationAddress,
    handleGetAddressLatlng,
  } = useAuth();
  const [inputAddress, setInputAddress] = useState("");
  const { state: carparkCtx, handleFetchCarparkData } = useCarpark();
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  // Track if it's the initial load
  const initialLoadRef = useRef(true);

  // Memoize the coordinates to avoid redundant API calls
  const memoizedCoords = useMemo(
    () => ({
      lat: authCtx.inputCoords.lat,
      lng: authCtx.inputCoords.lng,
    }),
    [authCtx.inputCoords.lat, authCtx.inputCoords.lng]
  );

  useEffect(() => {
    if (initialLoadRef.current) {
      handleFetchCarparkData(memoizedCoords);
      initialLoadRef.current = false;
    }
  }, [memoizedCoords]);

  useEffect(() => {
    if (
      initialLoadRef.current &&
      authCtx.inputCoords.lat !== null &&
      authCtx.inputCoords.lng !== null
    ) {
      handleGetLocationAddress(memoizedCoords);
      initialLoadRef.current = false;
    }
  }, [memoizedCoords]);

  const getSelectedRowsToExport = ({ apiRef }) => {
    const selectedRowIds = selectedGridRowsSelector(apiRef);
    if (selectedRowIds.size > 0) {
      return Array.from(selectedRowIds.keys());
    }

    return gridFilteredSortedRowIdsSelector(apiRef);
  };

  const handleConfirmNavigation = () => {
    handleGetAddressLatlng({ inputAddress: inputAddress });
    setOpenModal(false);
    navigate("/main/trip-planner");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const columns = [
    {
      field: "carpark_number",
      headerName: "CP#",
      width: 80,
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "address",
      headerName: "Address",
      width: isMobile ? "250" : "350",
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
      renderCell: (cellValue) => {
        const handleClick = () => {
          setInputAddress(cellValue.formattedValue);
          setOpenModal(true);
        };
        const fontSize = isMobile ? "10px" : "12px";

        return (
          <>
            <Button color="primary" onClick={handleClick}>
              <span style={{ fontSize, textAlign: "left" }}>
                {cellValue.row.address}
              </span>
            </Button>
            <AddressConfirmationModal
              open={openModal}
              onClose={handleCloseModal}
              onConfirm={handleConfirmNavigation}
              address={inputAddress}
            />
          </>
        );
      },
    },
    {
      field: "distance",
      headerName: "Distance (KM)",
      width: 100,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 2,
      filterOperators: getApplicableOperatorsList("number"),
    },
    {
      field: "lots_available",
      headerName: "Lots Available",
      width: isMobile ? "100" : "150",
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      align: "center",
      filterOperators: getApplicableOperatorsList("number"),
      cellClassName: (params) => {
        if (params.value == null) {
          return "";
        }
        return clsx("super-app", {
          red: params.value < 20,
          orange: params.value >= 20 && params.value < 100,
          green: params.value > 100,
        });
      },
    },
    {
      field: "lot_type",
      headerName: "Type",
      width: 80,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      align: "center",
    },

    {
      field: "update_datetime",
      headerName: "Update Time",
      width: 150,
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
      filterOperators: getApplicableOperatorsList("date"),
      renderCell: (cellValue) => {
        return <div>{renderDateTime(cellValue.row.update_datetime, true)}</div>;
      },
    },
  ];

  const data = {
    rows: carparkCtx.carparkData.filter((item) => item.distance !== ""),
    columns: columns,
  };

  const gridInitialState = {
    ...data.initialState,
    sorting: {
      sortModel: [{ field: "distance", sort: "asc" }],
    },
    filter: {
      ...data.initialState?.filter,
      filterModel: {
        items: [{ field: "distance", operator: "<", value: "3" }],
      },
    },
    pagination: { paginationModel: { pageSize: 10 } },
  };

  if (isMobile) {
    gridInitialState.columns = {
      ...gridInitialState.columns,
      columnVisibilityModel: {
        carpark_number: false,
        lot_type: false,
        update_datetime: false,
      },
    };
  }

  return (
    <div className={styles.container}>
      {carparkCtx.carparkData.length > 0 && (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>
              <DirectionsCarRoundedIcon />
              <br />
              Nearest Carpark:
            </h1>
          </div>

          <Box
            sx={{
              height: "70%",
              width: "100%",
              "& .super-app-theme--header": {
                backgroundColor: "#2196f3",
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: "600",
              },
              "& .MuiDataGrid-row": {
                fontSize: isMobile ? "10px" : "12px",
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: "#bbdefb",
              },
              "& .MuiDataGrid-row:nth-of-type(odd)": {
                backgroundColor: "#e3f2fd",
              },
              "& .super-app.red": {
                backgroundColor: "#c62828",
                color: "#fff",
                fontWeight: "600",
              },
              "& .super-app.orange": {
                backgroundColor: "#ef6c00",
                color: "#fff",
                fontWeight: "600",
              },
              "& .super-app.green": {
                backgroundColor: "#2e7d32",
                color: "#fff",
                fontWeight: "600",
              },
            }}
          >
            <DataGrid
              {...data}
              initialState={gridInitialState}
              pageSizeOptions={[10, 30, 50]}
              checkboxSelection
              density="compact"
              slots={{
                toolbar: TableToolbar,
              }}
              slotProps={{
                toolbar: {
                  printOptions: { getRowsToExport: getSelectedRowsToExport },
                },
              }}
            />
          </Box>
        </>
      )}
    </div>
  );
};

export default CarparkPage;
