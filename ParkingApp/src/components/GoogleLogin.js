import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./GoogleLogin.css";
import GoogleIcon from "./GoogleIcon";

function GoogleLoginButton({ onSuccess, onError }) {
  const [login, setLogin] = useState(null);

  const navigate = useNavigate();

  const { handleLogin, handleGetCurrentLocation } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => setLogin(codeResponse),
    onError: (error) => {
      console.log("Login Failed:", error);
      if (onError) onError(error);
    },
  });

  useEffect(() => {
    if (login && login.access_token) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json`, {
          headers: {
            Authorization: `Bearer ${login.access_token}`,
          },
        })
        .then((res) => {
          console.log("user info", res.date);
          handleLogin(res.data.name, res.data.email, true);
          handleGetCurrentLocation();
          navigate("/main");
        })
        .catch((error) => {
          console.log("Error fetching user info:", error);
          if (onError) onError(error);
        });
    }
  }, [login, onSuccess, onError]);

  return (
    <button className="gsi-material-button" onClick={handleGoogleLogin}>
      <div className="gsi-material-button-state"></div>
      <div className="gsi-material-button-content-wrapper">
        <div className="gsi-material-button-icon">
          <GoogleIcon />
        </div>
        <span className="gsi-material-button-contents">
          Sign in with Google
        </span>
        <span style={{ display: "none" }}>Sign in with Google</span>
      </div>
    </button>
  );
}

export default GoogleLoginButton;
