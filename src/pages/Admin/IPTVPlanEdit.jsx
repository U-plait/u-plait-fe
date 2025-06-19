import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlanDetailAPI, updateIptvPlanAPI } from '../../api/plan'; // IPTV 수정 API import
import '../../styles/PlanEdit.css'; // 공통 수정 페이지 CSS 재사용
import TagSelectionModal from "./TagSelectionModal";
import CommunityBenefitSelectionModal from "./CommunityBenefitSelectionModal";

const IPTVPlanEdit = () => {
    const { planId } = useParams();
    const navigate = useNavigate();

    const [planData, setPlanData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [isCommunityBenefitModalOpen, setIsCommunityBenefitModalOpen] = useState(false);

    useEffect(() => {
        const fetchPlanDetailsForEdit = async () => {
            try {
                const response = await getPlanDetailAPI("IPTVPlan", planId);
                if (response.statusCode === 0) {
                    setPlanData(response.data);
                } else {
                    alert('요금제 정보를 불러오는데 실패했습니다.');
                    navigate('/admin/plan');
                }
            } catch (error) {
                console.error('Error fetching IPTV plan details for editing:', error);
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
        const finalValue = type === 'checkbox' ? checked : value;
        
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
            availability: planData.availability,
            description: planData.description,
            tagIdList: planData.tagIdList || [],
            communityBenefitIdList: planData.communityBenefitIdList || [],
            channel: parseInt(planData.channel, 10) || 0,
            iptvDiscountRate: parseInt(planData.iptvDiscountRate, 10) || 0
        };
        try {
            const response = await updateIptvPlanAPI(planId, requestBody);
            if (response.statusCode === 0 || response.statusCode === 3004) {
                alert('IPTV 요금제가 성공적으로 수정되었습니다.');
                navigate('/admin/plan');
            } else {
                alert(`수정 실패: ${response.message}`);
            }
        } catch (error) {
            console.error('Error updating IPTV plan:', error);
            const errorMessage = error.response?.data?.message || "서버에 연결할 수 없습니다.";
            alert(`수정 중 오류가 발생했습니다: ${errorMessage}`);
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
            <h1 className="edit-title">IPTV 요금제 수정</h1>
            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-grid">
                    {/* 공통 정보 */}
                    <div className="form-group">
                        <label htmlFor="planName">요금제 이름</label>
                        <input id="planName" type="text" name="planName" value={planData.planName ?? ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="planPrice">가격 (원)</label>
                        <input id="planPrice" type="number" name="planPrice" value={planData.planPrice ?? ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="planBenefit">주요 혜택</label>
                        <input id="planBenefit" type="text" name="planBenefit" value={planData.planBenefit ?? ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="description">설명</label>
                        <textarea id="description" name="description" value={planData.description ?? ''} onChange={handleChange}></textarea>
                    </div>

                    {/* IPTV 전용 정보 */}
                    <div className="form-group">
                        <label htmlFor="channel">채널 수</label>
                        <input id="channel" type="number" name="channel" value={planData.channel ?? ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="iptvDiscountRate">IPTV 할인율 (%)</label>
                        <input id="iptvDiscountRate" type="number" name="iptvDiscountRate" value={planData.iptvDiscountRate ?? ''} onChange={handleChange} />
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

export default IPTVPlanEdit;
