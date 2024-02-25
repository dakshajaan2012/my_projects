import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import { Button, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { green, red } from "@mui/material/colors";

import AssistantDirectionRoundedIcon from "@mui/icons-material/AssistantDirectionRounded";

const useDelayedButton = (onClick, delay = 10000) => {
  const [disabled, setDisabled] = useState(false);

  const handleClick = async () => {
    setDisabled(true);
    onClick();

    setTimeout(() => {
      setDisabled(false);
    }, delay);
  };

  return { handleClick, disabled };
};

const LoadLocation = () => {
  const [inputAddress, setInputAddress] = useState("");
  const { handleGetAddressLatlng, handleGetCurrentLocation } = useAuth();

  const searchButton = useDelayedButton(async () => {
    await handleGetAddressLatlng({ inputAddress });
  }, 80000);

  const currentButton = useDelayedButton(() => {
    handleGetCurrentLocation();
  });

  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      <TextField
        label="Enter Location"
        variant="outlined"
        fullWidth
        value={inputAddress}
        onChange={(e) => setInputAddress(e.target.value)}
        required
        error={inputAddress.length > 0 && inputAddress.length < 3}
        helperText={
          inputAddress.length > 0 && inputAddress.length < 3
            ? "Location must be at least 3 characters"
            : ""
        }
      />
      <Button
        variant="contained"
        onClick={() => {
          searchButton.handleClick();
        }}
        disabled={searchButton.disabled || inputAddress.length < 3}
      >
        {searchButton.disabled ? (
          <CircularProgress size={24} />
        ) : (
          <>
            <AssistantDirectionRoundedIcon
              sx={{
                color: inputAddress.length < 3 ? green[50] : green[500],
              }}
              style={{
                cursor: "pointer",
                width: "30px",
                height: "30px",
              }}
            />
          </>
        )}
      </Button>

      <Button
        variant="contained"
        onClick={currentButton.handleClick}
        disabled={currentButton.disabled}
      >
        {currentButton.disabled ? (
          <CircularProgress size={24} />
        ) : (
          <GpsFixedRoundedIcon
            sx={{
              color: red[900],
            }}
            style={{
              cursor: "pointer",
              width: "30px",
              height: "30px",
            }}
          />
        )}
      </Button>
    </div>
  );
};

export default LoadLocation;
