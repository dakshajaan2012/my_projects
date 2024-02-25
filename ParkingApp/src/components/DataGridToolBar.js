import React from "react";
import {
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { styled } from "@mui/system";

const CustomTableToolbar = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  //   backgroundColor: "#2196f3",
  padding: theme.spacing(1),
}));

const CustomToolbarButton = styled("div")(({ theme }) => ({
  marginLeft: theme.spacing(1),
  color: theme.palette.common.white,
}));

const TableToolbar = () => {
  return (
    <CustomTableToolbar>
      <GridToolbarColumnsButton className={CustomToolbarButton} />
      <GridToolbarFilterButton className={CustomToolbarButton} />
      <GridToolbarExport className={CustomToolbarButton} />
    </CustomTableToolbar>
  );
};

export default TableToolbar;
