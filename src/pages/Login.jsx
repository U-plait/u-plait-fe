import React from "react";
import { getKakaoLoginUrl } from "../api/auth";
import { useNavigate } from "react-router-dom";
import UplaitLogo from "../assets/img/uplait_logo.png";
import UplaitText from "../assets/img/uplait_text.png";
import "./Login.css"; // 새로 생성한 CSS 파일 임포트

const Login = () => {
  const navigate = useNavigate();

  const handleKakaoLoginClick = () => {
    const kakaoLoginUrl = getKakaoLoginUrl();
    if (kakaoLoginUrl) {
      window.location.href = kakaoLoginUrl;
    } else {
      console.error(
        "카카오 로그인 URL을 생성할 수 없습니다. 로그인 페이지로 이동합니다."
      );
      navigate("/login");
    }
  };

  return (
    <div className="login-container">
      {/* 하단 웨이브 디자인 (SVG로 대체) */}
      <svg
        className="wave-svg"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D63484" />
            <stop offset="100%" stopColor="#701B45" />
          </linearGradient>
        </defs>
        <path
          fill="url(#waveGradient)"
          fillOpacity="1"
          d="M0,150 C360,80 720,170 1440,80 L1440,200 L0,200Z"
        ></path>
      </svg>

      <div className="login-card">
        <div className="uplait-logo-container">
          <img
            src={UplaitLogo}
            alt="Uplait Logo"
            className="uplait-logo-image"
          />
        </div>
        <div className="uplait-text-container">
          <img
            src={UplaitText}
            alt="Uplait Text"
            className="uplait-text-image"
          />
        </div>

        <button
          onClick={handleKakaoLoginClick}
          className="kakao-login-button"
        ></button>
      </div>
    </div>
  );
};

export default Login;
