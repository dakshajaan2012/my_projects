import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DummyUsers from "./DummyUsers";
import { loginSchema } from "./ValidationSchemas";
import { useAuth } from "../context/AuthContext";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import Copyright from "./CopyRight";
import GoogleLoginButton from "./GoogleLogin";

const defaultTheme = createTheme();

function LoginPage() {
  const { handleLogin, handleGetCurrentLocation } = useAuth();
  const navigate = useNavigate();

  const responseMessage = (response) => {
    console.log("response", response);
  };
  const errorMessage = (error) => {
    console.log(error);
  };

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    const inputValue = e.target.type === "checkbox" ? checked : value;
    setInputs({ ...inputs, [name]: inputValue });
  };

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationResult = loginSchema.validate(inputs, {
      abortEarly: false,
    });

    if (validationResult.error) {
      alert(`Validation failed: ${validationResult.error.message}`);
      return;
    }

    const user = DummyUsers.find(
      (u) => u.email === inputs.email && u.password === inputs.password
    );

    if (user && inputs.termsAccepted) {
      handleLogin(user.username, user.password);
      handleGetCurrentLocation();
      navigate("/main");
      alert(`Login successful! Welcome, ${user.username}`);
    } else {
      alert("Login failed");
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOpenOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleToggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="termsAccepted"
                  color="primary"
                  checked={inputs.termsAccepted}
                  onChange={handleChange}
                />
              }
              label="Accept Terms & Conditions"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2" onClick={handleSignUp}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Grid>or</Grid>
          <GoogleLoginButton
            onSuccess={responseMessage}
            onError={errorMessage}
          />
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default LoginPage;
