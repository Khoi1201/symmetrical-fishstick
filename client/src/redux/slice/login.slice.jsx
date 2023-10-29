import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import Cookies from "js-cookie";
import tbAuthController from "../api/tb.auth.controler";

export const initialState = {
  user: null,
  authenticated: false,
  status: "idle",
  registerStatus: "idle",
};

export const loadUser = createAsyncThunk("loadUser", async () => {
  try {
    const response = await tbAuthController.getUser();
    return response.data.user;
  } catch (error) {
    Cookies.remove("token");
    throw new Error("Invalid token");
  }
});

export const loginAccount = createAsyncThunk(
  "loginAccount",
  async (data, { dispatch }) => {
    const { username, password } = data;
    try {
      const response = await tbAuthController.loginEndpoint(username, password);
      const accessToken = response.data.accessToken;
      Cookies.set("token", accessToken, { expires: 7 });
      await dispatch(loadUser()).unwrap();

      return accessToken;
    } catch (error) {
      console.log(error);
    }
  }
);

export const logoutAccount = createAsyncThunk("logoutAccount", () => {
  Cookies.remove("token");
  Cookies.remove("refreshToken");
});

export const registerAccount = createAsyncThunk(
  "registerAccount",
  async (data) => {
    try {
      const { payload } = data;
      await tbAuthController.registerUser(payload);
    } catch (error) {
      console.log(error);
    }
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
      state.statusLoad = "loading";
    });
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.statusLoad = "idle";
      state.user = action.payload;
      state.authenticated = true;
    });
    builder.addCase(loadUser.rejected, (state) => {
      state.statusLoad = "failed";
      state.authenticated = false;
      state.user = null;
    });

    // loginAccount
    builder.addCase(loginAccount.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(loginAccount.fulfilled, (state, action) => {
      state.status = "idle";
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
