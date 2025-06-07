import axios from "axios";

// 토큰을 쿠키에 저장하는 함수
export const setTokens = (accessToken, refreshToken) => {
  // Access Token 저장 (HttpOnly, Secure, SameSite=Strict)
  document.cookie = `access_token=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/`;
  // Refresh Token 저장 (HttpOnly, Secure, SameSite=Strict)
  document.cookie = `refresh_token=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/`;
};

// 토큰을 쿠키에서 가져오는 함수
export const getTokens = () => {
  const cookies = document.cookie.split(";");
  const accessToken = cookies.find((cookie) =>
    cookie.trim().startsWith("access_token=")
  );
  const refreshToken = cookies.find((cookie) =>
    cookie.trim().startsWith("refresh_token=")
  );

  return {
    accessToken: accessToken ? accessToken.split("=")[1] : null,
    refreshToken: refreshToken ? refreshToken.split("=")[1] : null,
  };
};

// 토큰을 쿠키에서 삭제하는 함수
export const removeTokens = () => {
  // Max-Age=0 또는 Expires를 과거 날짜로 설정하여 쿠키 삭제
  document.cookie =
    "access_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0";
  document.cookie =
    "refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0";
};

// Access Token 갱신 함수
export const refreshAccessToken = async () => {
  try {
    const { refreshToken } = getTokens();
    if (!refreshToken) {
      // 리프레시 토큰이 없으면 로그인 페이지로 리다이렉트
      removeTokens();
      window.location.href = "/login";
      throw new Error("No refresh token available");
    }

    // 백엔드에 토큰 갱신 요청
    const response = await axios.post("/user/refresh", {
      refreshToken,
    });

    const { accessToken, newRefreshToken } = response.data;
    // 새 토큰 저장
    setTokens(accessToken, newRefreshToken);
    return accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    removeTokens();
    window.location.href = "/login";
    throw error;
  }
};

// Axios 요청 인터셉터: 모든 요청에 Access Token 추가
axios.interceptors.request.use(
  (config) => {
    const { accessToken } = getTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios 응답 인터셉터: 401 에러 발생 시 Access Token 갱신 시도
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 이전에 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Access Token 갱신
        const newAccessToken = await refreshAccessToken();
        // 갱신된 토큰으로 원래 요청 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // 원래 요청 다시 실행
        return axios(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 에러 반환 (이미 refreshAccessToken에서 리다이렉트 처리)
        return Promise.reject(refreshError);
      }
    }

    // 다른 에러는 그대로 반환
    return Promise.reject(error);
  }
);
