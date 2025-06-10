import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/ExtraInfo.css";

const SignupForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    phoneNumber: "",
    email: "",
    age: "",
    gender: "",
    adAgree: false,
  });

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const checkDuplicate = async (type) => {
    try {
      const param = type === "이메일" ? "email" : "phone";
      const value = type === "이메일" ? form.email : form.phoneNumber;
      const res = await api.get(`/user/duplicate/${param}`, {
        params: { value },
      });
      const isDuplicated = res.data.data.duplicated;

      const successMsg =
        type === "이메일"
          ? "사용 가능한 이메일입니다."
          : "사용 가능한 전화번호입니다.";
      const errorMsg =
        type === "이메일"
          ? "이미 사용 중인 이메일입니다."
          : "이미 사용 중인 전화번호입니다.";

      if (type === "이메일") {
        setEmailError(isDuplicated ? errorMsg : successMsg);
      } else {
        setPhoneError(isDuplicated ? errorMsg : successMsg);
      }
    } catch (err) {
      alert(`${type} 중복 확인 중 오류가 발생했습니다.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user/extra-info", form);
      alert("회원가입이 완료되었습니다.");
      navigate("/");
    } catch (err) {
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-wrapper">
      <h1 className="signup-title">회원가입</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        {/* 이메일 */}
        <div className="form-row">
          <label className="form-label">이메일</label>
          <div className="form-input-group">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input"
              placeholder="example@domain.com"
            />
            <button
              type="button"
              onClick={() => checkDuplicate("이메일")}
              className="btn-outline"
            >
              중복확인
            </button>
          </div>
          {emailError && (
            <span
              className={`error-text ${
                emailError === "사용 가능한 이메일입니다." ? "success-text" : ""
              }`}
            >
              {emailError}
            </span>
          )}
        </div>

        {/* 광고 동의 */}
        <div className="form-row">
          <div className="form-label" />
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              name="adAgree"
              checked={form.adAgree}
              onChange={handleChange}
              className="checkbox"
            />
            <label>광고 수신에 동의합니다.</label>
          </div>
        </div>

        {/* 전화번호 */}
        <div className="form-row">
          <label className="form-label">전화번호</label>
          <div className="form-input-group">
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="010-1234-5678"
              pattern="^010-\d{4}-\d{4}$"
              required
              className="input"
            />
            <button
              type="button"
              onClick={() => checkDuplicate("전화번호")}
              className="btn-outline"
            >
              중복확인
            </button>
          </div>
          {phoneError && (
            <span
              className={`error-text ${
                phoneError === "사용 가능한 전화번호입니다."
                  ? "success-text"
                  : ""
              }`}
            >
              {phoneError}
            </span>
          )}
        </div>

        {/* 나이 */}
        <div className="form-row">
          <label className="form-label">나이</label>
          <input
            type="number"
            name="age"
            min="0"
            max="150"
            value={form.age}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        {/* 성별 */}
        <div className="form-row">
          <label className="form-label">성별</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="MALE"
                checked={form.gender === "MALE"}
                onChange={handleChange}
                className="radio"
              />
              남자
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={form.gender === "FEMALE"}
                onChange={handleChange}
                className="radio"
              />
              여자
            </label>
          </div>
        </div>

        <button type="submit" className="btn-submit">
          가입하기
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
