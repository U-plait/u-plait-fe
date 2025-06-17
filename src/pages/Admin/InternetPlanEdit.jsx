import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlanDetailAPI, updateInternetPlanAPI } from '../../api/plan';
import '../../styles/PlanEdit.css';

const InternetPlanEdit = () => {
    const { planId } = useParams();
    const navigate = useNavigate();

    const [planData, setPlanData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlanDetailsForEdit = async () => {
            try {
                const response = await getPlanDetailAPI("InternetPlan", planId);
                if (response.statusCode === 0) {
                    setPlanData(response.data);
                } else {
                    alert('요금제 정보를 불러오는데 실패했습니다.');
                    navigate('/admin/plan');
                }
            } catch (error) {
                console.error('Error fetching Internet plan details:', error);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!planData) return;

        // 🚨 여기가 수정된 최종 핵심 부분입니다 🚨
        // 백엔드 DTO 구조와 100% 일치하도록 요청 본문을 새로 구성합니다.
        const requestBody = {
            planName: planData.planName,
            planPrice: parseInt(planData.planPrice, 10) || 0,
            planBenefit: planData.planBenefit,
            availability: planData.availability,
            description: planData.description,
            velocity: String(planData.velocity), // DTO에 명시된 타입(String)으로 변환
            internetDiscountRate: parseInt(planData.internetDiscountRate, 10) || 0, // DTO에 명시된 타입(Integer)으로 변환
            tagIdList: [], // 현재 UI에 없으므로 빈 배열로 전송
            communityBenefitList: [], // 현재 UI에 없으므로 빈 배열로 전송
        };

        try {
            const response = await updateInternetPlanAPI(planId, requestBody);
            if (response.statusCode === 0 || response.statusCode === 3004) {
                alert('인터넷 요금제가 성공적으로 수정되었습니다.');
                navigate('/admin/plan');
            } else {
                alert(`수정 실패: ${response.message}`);
            }
        } catch (error) {
            console.error('Error updating Internet plan:', error);
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
            <h1 className="edit-title">인터넷 요금제 수정</h1>
            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-grid">
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
                    <div className="form-group">
                        <label htmlFor="velocity">인터넷 속도</label>
                        <input id="velocity" type="text" name="velocity" value={planData.velocity ?? ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="internetDiscountRate">인터넷 할인율/가격</label>
                        <input id="internetDiscountRate" type="number" name="internetDiscountRate" value={planData.internetDiscountRate ?? ''} onChange={handleChange} />
                    </div>
                    <div className="form-group checkbox-group">
                        <input id="availability" type="checkbox" name="availability" checked={!!planData.availability} onChange={handleChange} />
                        <label htmlFor="availability">가입 가능</label>
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => navigate('/admin/plan')}>취소</button>
                    <button type="submit" className="submit-btn">수정 완료</button>
                </div>
            </form>
        </div>
    );
};

export default InternetPlanEdit;
