import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const authenticated = useSelector(
    (state) => state.authentication.authenticated
  );
  return authenticated ? <Outlet /> : <Navigate to={"/login"} replace />;
};

export default ProtectedRoute;
