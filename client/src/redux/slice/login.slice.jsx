import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import Cookies from "js-cookie";
import tbAuthController from "../api/tb.auth.controler";

export const initialState = {
  user: null,
  authenticated: false,
  loginStatus: "idle",
  registerStatus: "idle",
};

export const loadUser = createAsyncThunk("loadUser", async () => {
  const { token, refreshToken } = await tbAuthController.getUser();
  
  Cookies.set("token", token, { expires: 7 });
  Cookies.set("refreshToken", refreshToken, { expires: 7 });
});

export const loginAccount = createAsyncThunk("loginAccount", async (data) => {
  const { username, password } = data;
  const token = await tbAuthController.loginEndpoint(username, password);

  Cookies.set("token", token.token, { expires: 7 });
  Cookies.set("refreshToken", token.refreshToken, { expires: 7 });
  return token;
});

export const logoutAccount = createAsyncThunk("logoutAccount", () => {
  Cookies.remove("token");
  Cookies.remove("refreshToken");
});

export const registerAccount = createAsyncThunk(
  "registerAccount",
  async (data) => {
    const { payload } = data;
    const response = await tbAuthController.registerUser(payload);
    return response;
  }
);

export const requestRefreshToken = createAsyncThunk(
  "refreshToken",
  async (data) => {
    const { refreshToken } = data;
    const response = await tbAuthController.postAuthRefreshToken(refreshToken);
    Cookies.set("token", response.token);
    Cookies.set("refreshToken", response.refreshToken);

    return response;
  }
);

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // loadUser
    builder.addCase(loadUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.status = "idle";
      state.user = action.payload.user;
      state.authenticated = true;
    });
    builder.addCase(loadUser.rejected, (state) => {
      state.status = "failed";
      state.profile = [];
    });

    // loginAccount
    builder.addCase(loginAccount.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(loginAccount.fulfilled, (state, action) => {
      state.status = "idle";
      state.user = action.payload.user;
      state.authenticated = true;
    });
    builder.addCase(loginAccount.rejected, (state) => {
      state.status = "failed";
    });

    // registerAccount
    builder.addCase(registerAccount.pending, (state) => {
      state.registerStatus = "loading";
    });
    builder.addCase(registerAccount.fulfilled, (state, action) => {
      state.registerStatus = "success";
    });
    builder.addCase(registerAccount.rejected, (state) => {
      state.registerStatus = "failed";
    });
  },
});

export default authenticationSlice.reducer;
