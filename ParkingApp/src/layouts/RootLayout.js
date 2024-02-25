import { Container } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import React, { lazy, Suspense } from "react";
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Navbar from "../components/Layout/Navbar";
import { useAuth } from "../context/AuthContext";

// Lazy-loaded components
const AboutUs = lazy(() => import("../components/AboutUs"));
const LoginPage = lazy(() => import("../components/LoginPage"));
const SignUpPage = lazy(() => import("../components/SignUpPage"));
const MainPage = lazy(() => import("../components/MainPage"));
const CarparkPage = lazy(() => import("../components/CarparkPage"));
const WeatherPage = lazy(() => import("../components/WeatherPage"));
const TripPlannerPage = lazy(() => import("../components/TripPlannerPage"));

const RootLayout = () => {
  const { state: authCtx } = useAuth();
  const isLoggedIn = () => authCtx.login_status;

  // To prevent users from entering website forcefully without logging in
  const ProtectedRoute = ({ element, redirectTo = "/" }) => {
    return isLoggedIn() ? element : <Navigate to={redirectTo} />;
  };

  return (
    <Router>
      <div>
        <Navbar />
        <Container
          sx={{ paddingTop: "64px", paddingBottom: "64px", minHeight: "80vh" }}
        >
          <Suspense
            fallback={
              <LinearProgress variant="buffer" value={0} valueBuffer={100} />
            }
          >
            <Routes>
              <Route path="/" element={<AboutUs />}></Route>
              <Route path="/about-us" element={<AboutUs />} />
              <Route
                path="/login"
                element={
                  !isLoggedIn() ? <LoginPage /> : <Navigate to="/main" />
                }
              />
              <Route
                path="/signup"
                element={
                  !isLoggedIn() ? <SignUpPage /> : <Navigate to="/main" />
                }
              />
              <Route
                path="/main"
                element={<ProtectedRoute element={<Outlet />} />}
              >
                <Route index element={<MainPage />} />
                <Route
                  path="carpark"
                  element={<ProtectedRoute element={<CarparkPage />} />}
                />
                <Route
                  path="weather"
                  element={<ProtectedRoute element={<WeatherPage />} />}
                />
                <Route
                  path="trip-planner"
                  element={<ProtectedRoute element={<TripPlannerPage />} />}
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Route>
            </Routes>
          </Suspense>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default RootLayout;
