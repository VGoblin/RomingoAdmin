import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HotelRouter } from "./Hotels/Router";
import { LocationRouter } from "./Locations/Router";
import { Booking } from "./Bookings/Booking";
import { Home } from "./Home";
import { Settings } from "./Settings";
import { States } from "./Locations/States";
import { Layout } from "./Layout";
import { ThemeContextWrapper } from "./ThemeContextWrapper";
import { useState, useEffect } from "react";
import { LoginOverlay } from "./LoginOverylay";
import { EnvContextWrapper } from "./EnvContextWrapper";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
      ? true : false
  );

  useEffect(() => {
    if (localStorage.getItem('email') === 'sydwoodsva@gmail.com' || localStorage.getItem('email') === 'j.fraser.santarosa@gmail.com') {
      setLoggedIn(false)
      return
    }
    
    const loggedIn = localStorage.getItem("loggedIn") === "true"
      ? true : false
    setLoggedIn(loggedIn)
  }, [])

  return (
    <EnvContextWrapper>
      <ThemeContextWrapper>
        <BrowserRouter>
          <Layout>
            <Routes>
              {loggedIn ? (
                <>
                  {" "}
                  <Route path="/" element={<Home />} />
                  <Route path="/settings" element={<Settings setLoggedIn={setLoggedIn} />} />
                  <Route path="/hotels/*" element={<HotelRouter />} />
                  <Route path="/locations/*" element={<LocationRouter />} />
                  <Route path="/bookings/" element={<Booking />} />
                </>
              ) : (
                <Route
                  path="*"
                  element={<LoginOverlay setLoggedIn={setLoggedIn} />}
                />
              )}
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeContextWrapper>
    </EnvContextWrapper>
  );
};

export default App;
