import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlanDetailAPI, updateMobilePlanAPI } from '../../api/plan';
import '../../styles/PlanEdit.css'; // 공통 수정 페이지 CSS 재사용
import TagSelectionModal from "./TagSelectionModal";
import CommunityBenefitSelectionModal from "./CommunityBenefitSelectionModal";

const MobilePlanEdit = () => {
    const { planId } = useParams();
    const navigate = useNavigate();

    const [planData, setPlanData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [isCommunityBenefitModalOpen, setIsCommunityBenefitModalOpen] = useState(false);

    useEffect(() => {
        const fetchPlanDetailsForEdit = async () => {
            try {
                const response = await getPlanDetailAPI("MobilePlan", planId);
                if (response.statusCode === 0) {
                    setPlanData(response.data);
                } else {
                    alert('요금제 정보를 불러오는데 실패했습니다.');
                    navigate('/admin/plan');
                }
            } catch (error) {
                console.error('Error fetching mobile plan details:', error);
                alert('오류가 발생했습니다.');
                navigate('/admin/plan');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlanDetailsForEdit();
    }, [planId, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : (type === 'number' ? parseInt(value, 10) || 0 : value);
        
        setPlanData(prevData => ({
            ...prevData,
            [name]: finalValue,
        }));
    };

    const handleTagSelect = (selectedTagIds) => {
        setPlanData(prev => ({ ...prev, tagIdList: selectedTagIds }));
    };

    const handleCommunityBenefitSelect = (selectedBenefitIds) => {
        setPlanData(prev => ({ ...prev, communityBenefitIdList: selectedBenefitIds }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!planData) return;
        const requestBody = {
            planName: planData.planName,
            planPrice: parseInt(planData.planPrice, 10) || 0,
            planBenefit: planData.planBenefit,
            description: planData.description,
            data: planData.data,
            sharedData: planData.sharedData,
            voiceCall: planData.voiceCall,
            message: planData.message,
            extraData: planData.extraData,
            mediaBenefit: planData.mediaBenefit,
            durationDiscountRate: parseInt(planData.durationDiscountRate, 10) || 0,
            premierDiscountRate: parseInt(planData.premierDiscountRate, 10) || 0,
            availability: planData.availability,
            tagIdList: planData.tagIdList || [],
            communityBenefitIdList: planData.communityBenefitIdList || [],
        };
        try {
            const response = await updateMobilePlanAPI(planId, requestBody);
            if (response.statusCode === 0 || response.statusCode === 3004) {
                alert('모바일 요금제가 성공적으로 수정되었습니다.');
                navigate('/admin/plan');
            } else {
                alert(`수정 실패: ${response.message}`);
            }
        } catch (error) {
            console.error('Error updating mobile plan:', error);
            alert('수정 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return <div className="loading-container">데이터를 불러오는 중입니다...</div>;
    }

    if (!planData) {
        return <div className="loading-container">요금제 데이터를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="plan-edit-container"> 
            <h1 className="edit-title">모바일 요금제 수정</h1>
            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-grid">
                    {/* ... (이전과 동일한 폼 그룹들) ... */}
                    <div className="form-group">
                        <label htmlFor="planName">요금제 이름</label>
                        <input id="planName" type="text" name="planName" value={planData.planName || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="planPrice">가격 (원)</label>
                        <input id="planPrice" type="number" name="planPrice" value={planData.planPrice || 0} onChange={handleChange} required />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="planBenefit">주요 혜택</label>
                        <input id="planBenefit" type="text" name="planBenefit" value={planData.planBenefit || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="description">설명</label>
                        <textarea id="description" name="description" value={planData.description || ''} onChange={handleChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="data">데이터</label>
                        <input id="data" type="text" name="data" value={planData.data || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="extraData">데이터 소진 후</label>
                        <input id="extraData" type="text" name="extraData" value={planData.extraData || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sharedData">데이터 쉐어링</label>
                        <input id="sharedData" type="text" name="sharedData" value={planData.sharedData || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="voiceCall">음성통화</label>
                        <input id="voiceCall" type="text" name="voiceCall" value={planData.voiceCall || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">문자</label>
                        <input id="message" type="text" name="message" value={planData.message || ''} onChange={handleChange} required />
                    </div>
                     <div className="form-group">
                         <label htmlFor="durationDiscountRate">약정 할인율 (%)</label>
                        <input id="durationDiscountRate" type="number" name="durationDiscountRate" value={planData.durationDiscountRate || 0} onChange={handleChange} />
                    </div>
                     <div className="form-group">
                        <label htmlFor="premierDiscountRate">프리미어 할인율 (%)</label>
                        <input id="premierDiscountRate" type="number" name="premierDiscountRate" value={planData.premierDiscountRate || 0} onChange={handleChange} />
                    </div>
                    <div className="form-group checkbox-group">
                        <input id="mediaBenefit" type="checkbox" name="mediaBenefit" checked={!!planData.mediaBenefit} onChange={handleChange} />
                        <label htmlFor="mediaBenefit">미디어 혜택 제공</label>
                    </div>
                     <div className="form-group checkbox-group">
                        <input id="availability" type="checkbox" name="availability" checked={!!planData.availability} onChange={handleChange} />
                        <label htmlFor="availability">가입 가능</label>
                    </div>
                    <div className="form-group">
                        <button type="button" onClick={() => setIsTagModalOpen(true)}>
                            태그 선택
                        </button>
                        <button type="button" onClick={() => setIsCommunityBenefitModalOpen(true)}>
                            결합 혜택 선택
                        </button>
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => navigate('/admin/plan')}>취소</button>
                    <button type="submit" className="submit-btn">수정 완료</button>
                </div>
            </form>
            {isTagModalOpen && (
                <TagSelectionModal
                    onClose={() => setIsTagModalOpen(false)}
                    onSelect={handleTagSelect}
                    initialSelectedIds={planData.tagIdList || []}
                />
            )}
            {isCommunityBenefitModalOpen && (
                <CommunityBenefitSelectionModal
                    onClose={() => setIsCommunityBenefitModalOpen(false)}
                    onSelect={handleCommunityBenefitSelect}
                    initialSelectedIds={planData.communityBenefitIdList || []}
                />
            )}
        </div>
    );
};

export default MobilePlanEdit;
