import React, { createContext, useContext, useEffect, useState } from "react";

const PathnameContext = createContext();

export const usePathname = () => useContext(PathnameContext);

export const PathnameProvider = ({ children }) => {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePathnameChange = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener("popstate", handlePathnameChange);

    return () => {
      window.removeEventListener("popstate", handlePathnameChange);
    };
  }, []);

  return (
    <PathnameContext.Provider value={pathname}>
      {children}
    </PathnameContext.Provider>
  );
};
