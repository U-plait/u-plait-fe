import axios from "axios";

axios.defaults.withCredentials = true;

const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

// 카카오 로그인 인가 코드 요청 URL 생성
export const getKakaoLoginUrl = () => {
  if (!KAKAO_CLIENT_ID || !KAKAO_REDIRECT_URI) {
    console.error(
      "환경 변수 REACT_APP_KAKAO_CLIENT_ID 또는 REACT_APP_KAKAO_REDIRECT_URI가 설정되지 않았습니다."
    );
    return null;
  }
  return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
};

// 카카오 로그인 콜백 처리 (백엔드와 통신)
export const handleKakaoLogin = async (code) => {
  try {
    const response = await axios.post(
      "/auth/login",
      { code },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Kakao login failed during token exchange:", error);
    throw error;
  }
};
