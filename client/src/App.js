import "./App.css";
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

import axios from "axios";

function App() {
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      const response = await axios.post("http://localhost:1711/api/auth/google", {
        code: codeResponse.code,
      });
      console.log(response);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <div>
      <h2>React Google Login</h2>
      <br />
      <br />
      <button onClick={googleLogin}> Sign in with Google 🚀</button>
      <></>
    </div>
  );
}
export default App;
