import { configureStore } from "@reduxjs/toolkit";
import authenticationSlice from "../slice/login.slice";

export const store = configureStore({
  reducer: {
    authentication: authenticationSlice,
  },
});
