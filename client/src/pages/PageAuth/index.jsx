import { useContext, useEffect, useState } from "react";
import ContextComponent from "../../contexts/ContextComponent";
import Cookies from "js-cookie";
import { usePathname } from "../../contexts/PathnameContext";
import { Card, Col, Row, Space } from "antd";
import LoginComponent from "./LoginComponent";
import SignupComponent from "./SignupComponent";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PageAuth = () => {
  const context = useContext(ContextComponent);

  const theme = localStorage.getItem("theme");

  const [changeTabs, setChangeTabs] = useState(false);

  const token = Cookies.get("token");

  const pathname = usePathname();

  const authenticated = useSelector(
    (state) => state.authentication.authenticated
  );

  return !authenticated ? (
    <Row align={"middle"} justify={"center"} style={{ height: "100vh" }}>
      <Col span={6}>
        {!changeTabs ? (
          <Card>
            <LoginComponent setSignup={setChangeTabs} />
          </Card>
        ) : (
          <Card>
            <SignupComponent setSignup={setChangeTabs} />
          </Card>
        )}
      </Col>
    </Row>
  ) : (
    <Navigate to={"/dashboard"} replace={true} />
  );
};

export default PageAuth;
