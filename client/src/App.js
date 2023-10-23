import "./App.css";
import React, { Suspense, useState } from "react";

import ContextComponent from "./contexts/ContextComponent";
import { PathnameProvider } from "./contexts/PathnameContext";
import Router from "./routers/Router";

const AppContainerStyle = {
  width: "100%",
  height: "100vh",
};

function App() {
  const localStorageTheme = localStorage.getItem("theme");

  const [checkIsLogin, setCheckIsLogin] = useState(false);

  const [theme, setTheme] = useState(
    localStorageTheme !== null && localStorageTheme !== undefined
      ? localStorageTheme
      : "dark"
  );

  const handleChangeTheme = (theme) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <ContextComponent.Provider
      value={{
        theme,
        handleChangeTheme,
        checkIsLogin,
        setCheckIsLogin,
      }}
    >
      <PathnameProvider>
        <div style={AppContainerStyle}>
          <Suspense fallback={null /* loading screen */}>
            <Router />
          </Suspense>
        </div>
      </PathnameProvider>
    </ContextComponent.Provider>
  );
}
export default App;
