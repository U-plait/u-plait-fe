import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleKakaoLogin } from "../api/auth";
import useUserStore from "../context/userStore";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = new URLSearchParams(location.search).get("code");

        if (!code) {
          console.error("URL에 인증 코드가 없습니다.");
          navigate("/login");
          return;
        }

        // 백엔드로 인증 코드 전송하여 로그인 처리 및 토큰 발급/저장
        const loginResult = await handleKakaoLogin(code);
        const userRole = loginResult?.data.role;
        const userName = loginResult?.data.username;

        setUser({ userRole, userName });

        console.log("카카오 로그인 처리 성공");

        if (userRole === "TMP_USER") {
          navigate("/extra-info");
        } else {
          navigate("/");
          // window.location.reload();
        }
      } catch (error) {
        console.error("카카오 로그인 콜백 처리 중 오류 발생:", error);
        navigate("/login"); // 예시: 로그인 페이지로 이동
      }
    };

    handleCallback();
  }, [navigate, location, setUser]); // 의존성 배열에 navigate와 location 추가

  return (
    <div className="callback-container">
      <p>카카오 로그인 처리 중입니다. 잠시만 기다려 주세요...</p>
      {/* 로딩 스피너 추가*/}
    </div>
  );
};

export default KakaoCallback;
