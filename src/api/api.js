import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${API_URL}/auth/reissue`,
          {},
          {
            withCredentials: true,
          }
        );
        return api(originalRequest);
      } catch (refreshError) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if ([401, 403].includes(error.response?.status)) {
      if (window.location.pathname !== "/") {
        alert("접근 권한이 없습니다. 로그인 후 이용해주세요.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
