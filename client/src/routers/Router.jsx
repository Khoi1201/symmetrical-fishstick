import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Cookies from "js-cookie";
import NotificationBar from "../components/NotificationBar/NotificationBar";
import ContextComponent from "../contexts/ContextComponent";
import useWindowDimensions from "../hooks/useWindowDimension";
import { useDispatch, useSelector } from "react-redux";
import PageAuth from "../pages/PageAuth";
import NotFound from "../pages/NotFound";
import { loadUser } from "../redux/slice/login.slice";

const Router = () => {
  const token = Cookies.get("token");
  const dispatch = useDispatch();
  const context = useContext(ContextComponent);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (token) dispatch(loadUser);
  });
  const authenticated = useSelector(
    (state) => state.authentication.authenticated
  );

  const [menu, setMenu] = useState();
  const [collapsed, setCollapsed] = useState(
    JSON.parse(localStorage.getItem("collapsed"))
      ? JSON.parse(localStorage.getItem("collapsed"))
      : false
  );

  return (
    <BrowserRouter>
      <NotificationBar />
      {authenticated ? (
        <>Dashboard</>
      ) : (
        <Routes>
          {!context?.checkIsLogin && (
            <Route path="/" element={<Navigate to="/login" replace />}></Route>
          )}
          <Route path="/login" element={<PageAuth />} />
          <Route path="*" element={<NotFound setMenu={setMenu} />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default Router;
