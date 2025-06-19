import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createMobilePlanAPI } from "../../api/plan.js";
import "../../styles/MobilePlanCreate.css";
import TagSelectionModal from "./TagSelectionModal";
import CommunityBenefitSelectionModal from "./CommunityBenefitSelectionModal"; // communityBenefit 관련 모달 유지

const MobilePlanCreate = () => {
  const navigate = useNavigate();
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isCommunityBenefitModalOpen, setIsCommunityBenefitModalOpen] = useState(false); // communityBenefit 관련 모달 상태 유지

  const mediaBenefitOptions = ["NORMAL", "PREMIUM", "NONE"];

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
    tagIdList: [], // 초기화
    communityBenefitIdList: [], // communityBenefit 관련 유지 및 초기화
    availability: true,
    mediaBenefit: "NONE",
  };

  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 태그 모달 열기 핸들러
  const handleOpenTagModal = () => {
    setIsTagModalOpen(true);
  };

  // communityBenefit 모달 열기 핸들러 (기존 유지)
  const handleOpenCommunityBenefitModal = () => {
    setIsCommunityBenefitModalOpen(true);
  };

  // --- tagIdList 관련 수정 ---
  const handleTagSelect = (selectedTagIds) => {
    // console.log("handleTagSelect called with:", selectedTagIds); // 디버깅용
    setFormData((prev) => ({ ...prev, tagIdList: selectedTagIds }));
  };
  // --- tagIdList 관련 수정 끝 ---

  // communityBenefit 관련 핸들러 (기존 유지)
  const handleCommunityBenefitSelect = (selectedBenefitIds) => {
    // console.log("handleCommunityBenefitSelect called with:", selectedBenefitIds); // 디버깅용
    setFormData((prev) => ({ ...prev, communityBenefitIdList: selectedBenefitIds }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      data: formData.data,
      sharedData: formData.sharedData,
      voiceCall: formData.voiceCall,
      message: formData.message,
      extraData: formData.extraData,
      mediaBenefit: formData.mediaBenefit,
      durationDiscountRate: parseInt(formData.durationDiscountRate, 10) || 0,
      premierDiscountRate: parseInt(formData.premierDiscountRate, 10) || 0,
      tagIdList: formData.tagIdList, // 이미 배열이므로 그대로 전송
      communityBenefitIdList: formData.communityBenefitIdList, // communityBenefit 관련 유지
    };

    // console.log("Request Body sent:", requestBody); // 최종 전송될 데이터 확인용

    try {
      const result = await createMobilePlanAPI(requestBody);

      if (result && (result.statusCode === 3005 || result.statusCode === 0)) {
        alert("모바일 요금제가 성공적으로 생성되었습니다.");
        navigate('/admin/plan');
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

        {/* 가입 가능 여부 체크박스 */}
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input name="availability" type="checkbox" checked={formData.availability} onChange={handleChange} />
            가입 가능
          </label>
        </div>

        {/* 미디어 혜택 유형 선택 드롭다운 */}
        <div className="form-group">
          <label htmlFor="mediaBenefit">미디어 혜택 유형</label>
          <select id="mediaBenefit" name="mediaBenefit" value={formData.mediaBenefit} onChange={handleChange}>
            {mediaBenefitOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* 태그 및 결합 혜택 불러오기 버튼 -> 이제 각각의 모달을 엽니다. */}
        <div className="form-group">
          <button type="button" onClick={handleOpenTagModal} disabled={isSubmitting}>
            태그 선택
          </button>
          <button type="button" onClick={handleOpenCommunityBenefitModal} disabled={isSubmitting}>
            결합 혜택 선택
          </button>
        </div>

        {/* 태그 선택 모달 */}
        {isTagModalOpen && (
          <TagSelectionModal
            onClose={() => setIsTagModalOpen(false)}
            onSelect={handleTagSelect}
            initialSelectedIds={formData.tagIdList}
          />
        )}

        {/* 결합 혜택 선택 모달 */}
        {isCommunityBenefitModalOpen && (
          <CommunityBenefitSelectionModal
            onClose={() => setIsCommunityBenefitModalOpen(false)}
            onSelect={handleCommunityBenefitSelect}
            initialSelectedIds={formData.communityBenefitIdList}
          />
        )}

        {/* 폼 제출 버튼 */}
        <button className="submit-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "생성 중..." : "모바일 요금제 생성"}
        </button>
      </form>
    </div>
  );
};

export default MobilePlanCreate;