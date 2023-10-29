import { Button, Col, Form, Input, Space } from "antd";
import { EnvelopeSimple, Lock, Phone } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { registerAccount } from "../../redux/slice/login.slice";

const SignupComponent = ({ setSignup }) => {
  const dispatch = useDispatch();

  const key = "das@32@#1DKSJAH^%$";
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerStatus = useSelector(
    (state) => state.authentication.registerStatus
  );

  useEffect(() => {
    if (registerStatus !== "loading" && isSignup) {
      if (registerStatus === "success") {
        let encrypted = CryptoJS.AES.encrypt(password, key);
        Cookies.set("email", email);
        Cookies.set("password", encrypted);
      }
      setTimeout(
        () => setSignup(registerStatus === "success" ? false : true),
        1000
      );
      setIsSignup(false);
    }
  }, [registerStatus, isSignup, email, password]);

  const onFinish = async (values) => {
    const username = values.email.trim();
    const password = values.password.trim();
    // const phone = values.phone.trim();
    const payload = {
      username: username,
      password: password,
    };
    dispatch(registerAccount({ payload }));
    setEmail(email);
    setPassword(password);
    setIsSignup(true);
  };

  const validatePassword = () => ({
    validator(_, value) {
      var passwordformat = /^[\S]{8,}$/;
      if (!value || passwordformat.test(value)) {
        return Promise.resolve();
      }

      const error = new Error();
      error.message = "not valid password";
      return Promise.reject(error);
    },
  });

  return (
    <Form onFinish={onFinish}>
      <span>{"Signup"}</span>

      <Form.Item
        name="email"
        label={<span>Email</span>}
        labelCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: "field-required",
          },
          () => ({
            validator(_, value) {
              var mailformat = /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/;
              if (!value || mailformat.test(value)) {
                return Promise.resolve();
              } else {
                return Promise.reject(new Error("not valid email"));
              }
            },
          }),
        ]}
      >
        <Input
          autoComplete="username"
          type="email"
          placeholder={"your email"}
          prefix={<EnvelopeSimple size={18} color="#ADADAD" />}
        />
      </Form.Item>

      <Form.Item
        name="password"
        label={<span>{"Password"}</span>}
        labelCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: "field required",
          },
          {
            min: 8,
            message: "short pass",
          },
          validatePassword,
        ]}
      >
        <Input.Password
          className="login-input"
          placeholder={"your password"}
          prefix={<Lock size={18} color="#ADADAD" />}
          autoComplete="new-password"
        />
      </Form.Item>
      <Form.Item
        name="confirmpassword"
        label={
          <span
            className="text-12 login-form__label"
            style={{ margin: 0, padding: 0 }}
          >
            {"Confirm Password"}
          </span>
        }
        labelCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: "field required",
          },

          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error("not match password"));
            },
          }),
        ]}
      >
        <Input.Password
          className="login-input"
          placeholder={"your password"}
          prefix={<Lock size={18} color="#ADADAD" />}
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {"Signup"}
        </Button>
      </Form.Item>
      <span>{"Already have account? "}</span>
      <span onClick={() => setSignup(false)}>{"Login"}</span>
    </Form>
  );
};
export default SignupComponent;
