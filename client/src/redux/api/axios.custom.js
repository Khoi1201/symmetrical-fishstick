import Cookies from "js-cookie";
import axios from "axios";
import tbAuthController from "./tb.auth.controler";

export const axiosCustom = axios.create({
  baseURL: process.env.API_HOST,
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
  },
});

axiosCustom.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    const { headers } = config;

    // Check headers before add Authorization
    if (!headers) return config;

    if (token) {
      const tokenParts = token.split(".");
      const payload = JSON.parse(atob(tokenParts[1]));
      const expirationTime = payload.exp * 1000; // Convert expiration time to millisecond
      if (expirationTime > Date.now()) {
        headers["X-Authorization"] = token === null ? "" : `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let callCount = 0;
const maxCallCount = 3;

const refreshToken = async () => {
  const refreshToken = Cookies.get("refreshtoken");

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  if (callCount >= maxCallCount) {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    window.location.href = "/login";
    throw new Error("Max call count reached");
  }
  try {
    const response = await tbAuthController.postAuthRefreshToken(refreshToken);
    Cookies.set("token", response.token);
    Cookies.set("refreshToken", response.refreshToken);
    callCount++;
    return response.token;
  } catch (error) {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    window.location.href = "/login";
    throw new Error(error);
  }
};

axiosCustom.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const originalRequest = error.config;
    if (
      (error.response.status === 401 || error.response.status === 500) && // Assuming 401 indicates token expiration
      !originalRequest._retry && // Avoid infinite loops
      originalRequest.url !== "/auth/user" &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/register"
    ) {
      // Perform token refresh here, then retry the original request
      return refreshToken()
        .then((token) => {
          originalRequest.headers["X-Authorization"] = `Bearer ${token}`;
          return axiosCustom(originalRequest);
        })
        .catch((refreshError) => {
          // Handle refresh error or redireact to login page
          console.error("Token refresh failed:", refreshError);
          // Redirect to login page or handle the error in another way
        });
    }
    return Promise.reject(error);
  }
);
