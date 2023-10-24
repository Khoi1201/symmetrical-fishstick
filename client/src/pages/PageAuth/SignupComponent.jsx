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
  }, [registerStatus, isSignup , email, password]);

  const onFinish = async (values) => {
    const email = values.email.trim();
    const password = values.password.trim();
    const phone = values.phone.trim();
    const firstName = values.firstName.trim();
    const lastName = values.lastName.trim();
    const payload = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
      phone: phone,
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
      <span>{"signup"}</span>

      <Space direction="horizontal">
        <Col>
          <Form.Item
            name="firstName"
            label={<span>{"first name"}</span>}
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "field required",
              },
            ]}
          >
            <Input
              type="text"
              placeholder={"your name"}
              prefix={<EnvelopeSimple size={18} color="#ADADAD" />}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            name="lastName"
            label={<span>{"last-name"}</span>}
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "field required",
              },
            ]}
          >
            <Input
              type="text"
              placeholder={"your name"}
              prefix={<EnvelopeSimple size={18} color="#ADADAD" />}
            />
          </Form.Item>
        </Col>
      </Space>
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
          type="email"
          placeholder={"your email"}
          prefix={<EnvelopeSimple size={18} color="#ADADAD" />}
        />
      </Form.Item>

      <Form.Item
        name="password"
        label={<span>{"password"}</span>}
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
        />
      </Form.Item>
      <Form.Item
        name="confirmpassword"
        label={
          <span
            className="text-12 login-form__label"
            style={{ margin: 0, padding: 0 }}
          >
            {"confirm password"}
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
        />
      </Form.Item>
      <Form.Item
        name="phone"
        label={<span>{"phone number"}</span>}
        labelCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: "field required",
          },
          () => ({
            validator(_, value) {
              var phoneno = /^\d{10,11}$/;
              if (!value || phoneno.test(value)) {
                return Promise.resolve();
              } else {
                return Promise.reject(new Error("not valid phone"));
              }
            },
          }),
        ]}
      >
        <Input
          placeholder={"phone number"}
          prefix={<Phone size={18} color="#ADADAD" />}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {"signup"}
        </Button>
      </Form.Item>
      <span>{"already have account?"}</span>
      <span onClick={() => setSignup(false)}>{"login"}</span>
    </Form>
  );
};
export default SignupComponent;
