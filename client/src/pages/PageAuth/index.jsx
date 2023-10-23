import { useContext, useEffect, useState } from "react";
import ContextComponent from "../../contexts/ContextComponent";
import Cookies from "js-cookie";
import { usePathname } from "../../contexts/PathnameContext";
import { Col, Row, Space } from "antd";
import LoginComponent from "./LoginComponent";
import SignupComponent from "./SignupComponent";

const PageAuth = () => {
  const context = useContext(ContextComponent);

  const theme = localStorage.getItem("theme");

  const [changeTabs, setChangeTabs] = useState(false);

  const token = Cookies.get("token");
  const pathname = usePathname();

  useEffect(() => {
    if (
      pathname === "/" &&
      token === undefined &&
      Cookies.get("is_login" === "true")
    ) {
      context?.set("is_login", "checking");
    }
  }, [token, pathname, context]);

  useEffect(() => {
    if (context?.checkIsLogin && Cookies.get("is_login") === "checking") {
      setTimeout(() => {
        window.location.href = "/";
      }, 200);
    }
  }, [context?.checkIsLogin]);

  return !context?.checkIsLogin ? (
    <Row align={"middle"} justify={"center"}>
      <Col span={24}>
        {!changeTabs ? (
          <LoginComponent setSignup={setChangeTabs} />
        ) : (
          <SignupComponent />
        )}
      </Col>
    </Row>
  ) : (
    <></>
  );
};

export default PageAuth;
