import "./App.css";
import RootLayout from "./layouts/RootLayout";
import { AuthProvider } from "./context/AuthContext";
import { CarparkProvider } from "./context/CarparkContext";
import { LoadScript } from "@react-google-maps/api";
import { WeatherProvider } from "./context/WeatherContext";

const googleApiKey = process.env.REACT_APP_GOOGLE_API_KEY;

function App() {
  console.log("Running App on Environment:", process.env.REACT_APP_ENVIRONMENT);
  return (
    <AuthProvider>
      <CarparkProvider>
        <WeatherProvider>
          <LoadScript googleMapsApiKey={googleApiKey}>
            <RootLayout />
          </LoadScript>
        </WeatherProvider>
      </CarparkProvider>
    </AuthProvider>
  );
}

export default App;
