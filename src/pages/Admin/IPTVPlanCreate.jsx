import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createIptvPlanAPI } from "../../api/plan.js"; // IPTV 생성 API import
import "../../styles/IPTVPlanCreate.css"; // IPTV 생성 페이지 전용 CSS import

const IPTVPlanCreate = () => {
  const navigate = useNavigate();
  // IPTV 요금제에 맞는 초기 상태
  const initialState = {
    planName: "",
    planPrice: "",
    planBenefit: "",
    description: "",
    channel: "",
    iptvDiscountRate: "",
    
    availability: true,
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false); // 중복 제출 방지 상태

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 폼 제출 핸들러
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
      channel: parseInt(formData.channel, 10) || 0,
      iptvDiscountRate: parseInt(formData.iptvDiscountRate, 10) || 0,
      tagIdList: [],
      communityBenefitList: [],
    };

    try {
      const result = await createIptvPlanAPI(requestBody);

      // 백엔드가 명시한 생성 성공 코드(3005) 또는 범용 성공 코드(0)를 기준으로 판단합니다.
      if (result && (result.statusCode === 3005 || result.statusCode === 0)) {
        alert("IPTV 요금제가 성공적으로 생성되었습니다.");
        navigate('/admin/plan'); // 성공 시 목록 페이지로 즉시 이동
      } else {
        alert(`생성에 실패했습니다: ${result?.message || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("IPTV 요금제 생성 오류:", error);
      const errorMessage = error.response?.data?.message || "서버에 연결할 수 없습니다.";
      alert(`오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // admin-page div와 AdminSidebar를 제거하고, wrapper가 최상위 요소가 됩니다.
    <div className="plan-create-wrapper">
      <form className="plan-create-card" onSubmit={handleSubmit}>
        <h2>IPTV 요금제 추가</h2>
        
        {/* 공통 정보 입력 필드 */}
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
          <input id="planBenefit" name="planBenefit" value={formData.planBenefit} placeholder="예: 디즈니+ 3개월 무료" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description">요금제 설명</label>
          <input id="description" name="description" value={formData.description} placeholder="요금제에 대한 상세 설명" onChange={handleChange} />
        </div>

        {/* IPTV 전용 입력 필드 */}
        <div className="form-group">
          <label htmlFor="channel">채널 수</label>
          <input id="channel" name="channel" type="number" value={formData.channel} placeholder="제공 채널 수 (숫자만 입력)" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="iptvDiscountRate">IPTV 할인율 (%)</label>
          <input id="iptvDiscountRate" name="iptvDiscountRate" type="number" value={formData.iptvDiscountRate} placeholder="숫자만 입력 (예: 5)" onChange={handleChange} />
        </div>
        
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input name="availability" type="checkbox" checked={formData.availability} onChange={handleChange} />
            가입 가능
          </label>
        </div>
        
        <button className="submit-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "생성 중..." : "IPTV 요금제 생성"}
        </button>
      </form>
    </div>
  );
};

export default IPTVPlanCreate;
