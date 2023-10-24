import React, { useContext, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Cookies from "js-cookie";
import NotificationBar from "../components/NotificationBar/NotificationBar";
import ContextComponent from "../contexts/ContextComponent";
import useWindowDimensions from "../hooks/useWindowDimension";
import { useSelector } from "react-redux";
import PageAuth from "../pages/PageAuth";
import NotFound from "../pages/NotFound";

const Router = () => {
  const token = Cookies.get("token");
  const context = useContext(ContextComponent);
  const { width } = useWindowDimensions();
  const tokenRedux = useSelector((state)=>state.authentication.token.token);

  // const authority = useSelector((state) => state.profile.profile.authority);

  const [menu, setMenu] = useState();
  const [collapsed, setCollapsed] = useState(
    JSON.parse(localStorage.getItem("collapsed"))
      ? JSON.parse(localStorage.getItem("collapsed"))
      : false
  );

  return (
    <BrowserRouter>
      <NotificationBar />
      {token || tokenRedux ? (
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
