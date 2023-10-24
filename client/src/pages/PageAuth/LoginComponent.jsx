import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import CryptoJS from "crypto-js";
import { loginAccount } from "../../redux/slice/login.slice";

import { Button, Form, Input, Spin } from "antd";
import { EnvelopeSimple, Lock } from "phosphor-react";

const LoginComponent = ({ setSignup }) => {
  const dispatch = useDispatch();

  const key = "das@32@#1DKSJAH^%$";
  const email = Cookies.get("email");
  const password = Cookies.get("password");

  const [isRemember, setIsRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);

  const timer = useRef();

  useEffect(() => {
    if (password) {
      let decrypted = CryptoJS.AES.decrypt(password, key);
      let passDecrypted = decrypted.toString(CryptoJS.enc.Utf8);
      setFields([
        {
          name: ["userName"],
          value: email,
        },
        {
          name: ["password"],
          value: passDecrypted,
        },
      ]);
    }
  }, [email, password]);

  const onFinish = (values) => {
    const username = values.userName.trim();
    const password = values.password.trim();
    if (!loading) {
      let encrypted = CryptoJS.AES.encrypt(password, key);

      dispatch(loginAccount({ username, password }));

      if (isRemember) {
        Cookies.set("email", username);
        Cookies.set("password", encrypted);
      } else {
        Cookies.set("email", "");
        Cookies.set("password", "");
      }

      setLoading(true);
      timer.current = window.setTimeout(() => {
        setLoading(false);
      }, 4000);
    }
  };

  const validatePassword = () => ({
    validator(_, value) {
      var passwordformat = /^[\S]{8,}$/;
      if (!value || passwordformat.test(value)) {
        return Promise.resolve();
      }

      const error = new Error();
      error.message = "not-valid-password";
      return Promise.reject(error);
    },
  });

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <Form onFinish={onFinish} fields={fields}>
      <span>login</span>
      <Form.Item
        name={"userName"}
        label={"email"}
        labelCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: "field-required",
          },
        ]}
      >
        <Input
          placeholder={"your-email"}
          prefix={<EnvelopeSimple size={18} color="#ADADAD" />}
        />
      </Form.Item>
      <Form.Item
        name={"password"}
        label={"password"}
        labelCol={{ span: 24 }}
        rules={[
          {
            required: true,
            message: "field-required",
          },
          validatePassword,
        ]}
      >
        <Input.Password
          placeholder={"your-password"}
          prefix={<Lock size={18} color="#ADADAD" />}
        />
      </Form.Item>
      <Input
        type="checkbox"
        checked={isRemember}
        onClick={() => setIsRemember(!isRemember)}
        style={{
          width: "24px",
          height: "20px",
        }}
      />
      <span>{"forgot-password"}</span>

      <Form.Item>
        <Button htmlType="submit">{loading ? <Spin /> : "login"}</Button>
      </Form.Item>
      <span>{"dont have account?"}</span>
      <span onClick={() => setSignup(true)}>{"signup"}</span>
    </Form>
  );
};

export default LoginComponent;
