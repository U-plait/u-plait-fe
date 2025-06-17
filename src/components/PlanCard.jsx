import React from "react";
import { useNavigate } from 'react-router-dom';

const PlanCard = ({ plan, onShowDetails, onDelete }) => {
    const navigate = useNavigate();
    const { planId, planName, planPrice, planBenefit, planType } = plan;
    const formattedPrice = planPrice ? planPrice.toLocaleString('ko-KR') : '가격 정보 없음';

    const handleEditClick = () => {
        if (!planType) {
            alert("요금제 타입을 알 수 없어 수정할 수 없습니다.");
            return;
        }
        const typeForUrl = planType.toLowerCase().replace('plan', '');
        navigate(`/admin/${typeForUrl}/edit/${planId}`);
    };

    return (
        <div className="plan-card-container">
            <div className="plan-card-header">
                <input type="checkbox" />
            </div>

            <div className="plan-card-main-info">
                <h3 className="plan-card-title">{planName}</h3>
                <p className="plan-card-price">{formattedPrice}원</p>
            </div>

            <ul className="plan-card-benefits">
                {planBenefit && <li>{planBenefit}</li>}
            </ul>

            <div className="plan-card-actions">
                <button className="plan-details-btn" onClick={onShowDetails}>
                    상세
                </button>
                <button className="plan-edit-btn" onClick={handleEditClick}>
                    수정
                </button>
                <button className="plan-delete-btn" onClick={onDelete}>
                    삭제
                </button>
            </div>
        </div>
    );
};

export default PlanCard;
