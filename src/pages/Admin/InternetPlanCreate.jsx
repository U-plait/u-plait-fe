import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createInternetPlanAPI } from "../../api/plan.js";
import "../../styles/InternetPlanCreate.css"; // IPTV 생성 페이지와 동일한 공통 CSS 사용

const InternetPlanCreate = () => {
  const navigate = useNavigate();
  const initialState = {
    planName: "",
    planPrice: "",
    planBenefit: "",
    description: "",
    velocity: "",
    internetDiscountRate: "",
    availability: true,
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const requestBody = {
      planName: formData.planName,
      planPrice: parseInt(formData.planPrice, 10) || 0,
      planBenefit: formData.planBenefit,
      description: formData.description,
      availability: formData.availability,
      velocity: formData.velocity, // 인터넷 속도 필드
      internetDiscountRate: parseInt(formData.internetDiscountRate, 10) || 0,
      tagIdList: [],
      communityBenefitList: [],
    };

    try {
      const result = await createInternetPlanAPI(requestBody);

      if (result && (result.statusCode === 3005 || result.statusCode === 0)) {
        alert("인터넷 요금제가 성공적으로 생성되었습니다.");
        navigate('/admin/plan');
      } else {
        alert(`생성에 실패했습니다: ${result?.message || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("인터넷 요금제 생성 오류:", error);
      const errorMessage = error.response?.data?.message || "서버에 연결할 수 없습니다.";
      alert(`오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // 🚨 AdminSidebar와 admin-page div를 제거했습니다.
    <div className="plan-create-wrapper">
      <form className="plan-create-card" onSubmit={handleSubmit}>
        <h2>인터넷 요금제 추가</h2>
        
        <div className="form-group">
          <label htmlFor="planName">요금제 이름</label>
          <input id="planName" name="planName" value={formData.planName} placeholder="요금제 이름" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="planPrice">요금제 가격</label>
          <input id="planPrice" name="planPrice" type="number" value={formData.planPrice} placeholder="월정액 (숫자만 입력)" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="planBenefit">혜택 설명</label>
          <input id="planBenefit" name="planBenefit" value={formData.planBenefit} placeholder="예: 1년 약정 시 추가 할인" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description">요금제 설명</label>
          <input id="description" name="description" value={formData.description} placeholder="요금제에 대한 상세 설명" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="velocity">인터넷 속도</label>
          <input id="velocity" name="velocity" value={formData.velocity} placeholder="예: 500Mbps, 1Gbps" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="internetDiscountRate">인터넷 할인율/가격</label>
          <input id="internetDiscountRate" name="internetDiscountRate" type="number" value={formData.internetDiscountRate} placeholder="숫자만 입력" onChange={handleChange} />
        </div>
        
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input name="availability" type="checkbox" checked={formData.availability} onChange={handleChange} />
            가입 가능
          </label>
        </div>
        
        <button className="submit-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "생성 중..." : "인터넷 요금제 생성"}
        </button>
      </form>
    </div>
  );
};

export default InternetPlanCreate;
