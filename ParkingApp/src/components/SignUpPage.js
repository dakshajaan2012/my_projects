import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DummyUsers from "./DummyUsers";
import { signUpSchema } from "./ValidationSchemas";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import Copyright from "./CopyRight";
import "./ProgressBar.css";

function SignUpPage() {
  const [inputs, setInputs] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Use state for DummyUsers
  const [dummyUsers, setDummyUsers] = useState(DummyUsers);

  const handlePassword = (password) => {
    const strengthChecks = {
      length: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasDigit: false,
      hasSpecialChar: false,
    };

    strengthChecks.length = password.length >= 8 ? true : false;
    strengthChecks.hasUpperCase = /[A-Z]+/.test(password);
    strengthChecks.hasLowerCase = /[a-z]+/.test(password);
    strengthChecks.hasDigit = /[0-9]+/.test(password);
    strengthChecks.hasSpecialChar = /[^A-Za-z0-9]+/.test(password);

    let verifiedList = Object.values(strengthChecks).filter((value) => value);

    let strength =
      verifiedList.length === 5
        ? "Strong"
        : verifiedList.length >= 2
        ? "Medium"
        : "weak";

    setProgress(`${(verifiedList.length / 5) * 100}%`);
    setMessage(strength);

    console.log("verifiedList: ", `${(verifiedList.length / 5) * 100}%`);
  };

  const getActiveColor = (type) => {
    if (type === "Strong") return "#8BC926";
    if (type === "Medium") return "#FEBD01";
    return "#FF0054";
  };

  const defaultTheme = createTheme();

  const navigate = useNavigate();

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationResult = signUpSchema.validate(inputs, {
      abortEarly: false,
    });

    if (validationResult.error) {
      alert(
        validationResult.error.details
          .map((detail) => detail.message)
          .join(", ")
      );
      return;
    }
    // change fro DummyUsers to dummyUsers
    const EmailExists = dummyUsers.some((user) => user.email === inputs.email);
    if (EmailExists) {
      alert("This Email has been taken");
      return;
    }

    if (inputs.password !== inputs.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!inputs.termsAccepted) {
      alert("You must accept the terms and conditions");
      return;
    }

    // Use the setDummyUsers function to update the state with a new array
    setDummyUsers((prevUsers) => [
      ...prevUsers,
      {
        id: prevUsers.length + 1,
        email: inputs.email,
        username: inputs.username,
        password: inputs.password,
      },
    ]);

    navigate("/login");
    alert("Signed up successfully, Now you can log in");
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value, checked } = e.target;

    const inputValue = e.target.type === "checkbox" ? checked : value;
    setInputs({ ...inputs, [name]: inputValue });
    if (name === "password") {
      handlePassword(value);
    }
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up with Us Today!
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  id="email"
                  label="Email"
                  autoFocus
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="username"
                  id="username"
                  label="User Name"
                  autoFocus
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  label="Password"
                  autoComplete="new-password"
                  onChange={handleChange}
                  required
                  autoFocus
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
                <div className="progress-bg">
                  <div
                    className="progress"
                    style={{
                      width: progress,
                      backgroundColor: getActiveColor(message),
                    }}
                  ></div>
                </div>
                {inputs.password.length !== 0 ? (
                  <p
                    className="message"
                    style={{ color: getActiveColor(message) }}
                  >
                    Your password is {message}
                  </p>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  label="Confirm password"
                  id="confirmPassword"
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleToggleShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {inputs.confirmPassword.length > 0 &&
                  (inputs.confirmPassword === inputs.password ? (
                    <p className="message" style={{ color: "#8BC926" }}>
                      Passwords match.
                    </p>
                  ) : (
                    <p className="message" style={{ color: "#FEBD01" }}>
                      Passwords do not match.
                    </p>
                  ))}
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#" variant="body2" onClick={handleLogin}>
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default SignUpPage;
