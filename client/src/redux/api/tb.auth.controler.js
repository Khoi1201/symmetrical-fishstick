import { axiosCustom } from "./axios.custom";

const tbAuthController = {
  getUser() {
    const url = "/auth/user";
    return axiosCustom.get(url, {});
  },
  postAuthRefreshToken(refreshToken) {
    const url = "/auth/token";
    const payload = { refreshToken: refreshToken };
    return axiosCustom.post(url, payload);
  },
  loginEndpoint(username, password) {
    const url = "/auth/login";
    const payload = { username: username, password: password };
    return axiosCustom.post(url, payload);
  },
  registerUser(data) {
    const url = "/auth/register";
    const payload = data;
    return axiosCustom.post(url, payload);
  },
};

export default tbAuthController;
