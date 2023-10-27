import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import tbAuthController from "../api/tb.auth.controler";

export const initialState = {
  profile: null,
  status: "idle",
};

export const getDataUser = createAsyncThunk("getDataUser", async () => {
  const user = await tbAuthController.getUser();
  return user;
});

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getDataUser
    builder.addCase(getDataUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getDataUser.fulfilled, (state, action) => {
      state.status = "idle";
      state.profile = action.payload;
    });
    builder.addCase(getDataUser.rejected, (state) => {
      state.status = "failed";
      state.profile = [];
    });
  },
});
