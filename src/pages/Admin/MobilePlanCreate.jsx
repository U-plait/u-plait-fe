import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createMobilePlanAPI } from "../../api/plan.js";
import "../../styles/MobilePlanCreate.css"; // IPTV와 동일한 공통 CSS 사용

const MobilePlanCreate = () => {
  const navigate = useNavigate();
  // 모바일 요금제에 맞는 초기 상태
  const initialState = {
    planName: "",
    planPrice: "",
    planBenefit: "",
    description: "",
    data: "",
    sharedData: "",
    voiceCall: "",
    message: "",
    extraData: "",
    durationDiscountRate: "",
    premierDiscountRate: "",
    tagIdList: [],
    communityBenefitList: [],
    availability: true,
    mediaBenefit: false,
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      data: formData.data,
      sharedData: formData.sharedData,
      voiceCall: formData.voiceCall,
      message: formData.message,
      extraData: formData.extraData,
      mediaBenefit: formData.mediaBenefit,
      durationDiscountRate: parseInt(formData.durationDiscountRate, 10) || 0,
      premierDiscountRate: parseInt(formData.premierDiscountRate, 10) || 0,
      tagIdList: [],
      communityBenefitList: [],
    };

    try {
      const result = await createMobilePlanAPI(requestBody);

      // 백엔드가 명시한 생성 성공 코드(3005) 또는 범용 성공 코드(0)를 기준으로 판단합니다.
      if (result && (result.statusCode === 3005 || result.statusCode === 0)) {
        alert("모바일 요금제가 성공적으로 생성되었습니다.");
        navigate('/admin/plan'); // 성공 시 목록 페이지로 즉시 이동
      } else {
        alert(`생성에 실패했습니다: ${result?.message || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("모바일 요금제 생성 오류:", error);
      const errorMessage = error.response?.data?.message || "서버에 연결할 수 없습니다.";
      alert(`오류가 발생했습니다: ${errorMessage}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    // 사이드바 없는 전체 화면 레이아웃
    <div className="plan-create-wrapper">
      <form className="plan-create-card" onSubmit={handleSubmit}>
        <h2>모바일 요금제 추가</h2>
        
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
          <input id="planBenefit" name="planBenefit" value={formData.planBenefit} placeholder="예: 데이터 무제한, 통화 무제한" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description">요금제 설명</label>
          <input id="description" name="description" value={formData.description} placeholder="요금제에 대한 상세 설명" onChange={handleChange} />
        </div>

        {/* 모바일 전용 입력 필드 */}
        <div className="form-group">
          <label htmlFor="data">제공 데이터 용량</label>
          <input id="data" name="data" value={formData.data} placeholder="예: 10GB, 무제한" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="sharedData">공유 데이터 용량</label>
          <input id="sharedData" name="sharedData" value={formData.sharedData} placeholder="예: 40GB" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="voiceCall">음성통화 정보</label>
          <input id="voiceCall" name="voiceCall" value={formData.voiceCall} placeholder="예: 집/이동전화 무제한" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="message">문자 정보</label>
          <input id="message" name="message" value={formData.message} placeholder="예: 기본 제공" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="extraData">추가 데이터 정보</label>
          <input id="extraData" name="extraData" value={formData.extraData} placeholder="예: QoS 5Mbps 속도 제어" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="durationDiscountRate">약정 할인율 (%)</label>
          <input id="durationDiscountRate" name="durationDiscountRate" type="number" value={formData.durationDiscountRate} placeholder="숫자만 입력 (예: 25)" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="premierDiscountRate">프리미어 할인율 (%)</label>
          <input id="premierDiscountRate" name="premierDiscountRate" type="number" value={formData.premierDiscountRate} placeholder="숫자만 입력 (예: 10)" onChange={handleChange} />
        </div>

        {/* 체크박스 그룹 */}
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input name="availability" type="checkbox" checked={formData.availability} onChange={handleChange} />
            가입 가능
          </label>
          <label className="checkbox-label">
            <input name="mediaBenefit" type="checkbox" checked={formData.mediaBenefit} onChange={handleChange} />
            미디어 혜택 제공
          </label>
        </div>
        
        <button className="submit-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "생성 중..." : "모바일 요금제 생성"}
        </button>
      </form>
    </div>
  );
};

export default MobilePlanCreate;
