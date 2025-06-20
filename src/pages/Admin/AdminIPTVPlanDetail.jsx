// src/pages/Admin/AdminIPTVPlanDetail.jsx

import React from 'react';
import '../../styles/AdminPlanDetail.css';

const AdminIPTVPlanDetail = ({ plan, isLoading, onClose }) => {
  if (!plan) return null;

  const DetailItem = ({ label, value }) => (
    <div className="detail-item">
      <span className="detail-item-label">{label}</span>
      <span className="detail-item-value">{value}</span>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>IPTV 요금제 상세 정보</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {isLoading ? (
            <div className="loading-container">로딩 중...</div>
          ) : (
            <div className="detail-grid">
              <DetailItem label="요금제 이름" value={plan.planName} />
              <DetailItem label="가격" value={`${plan.planPrice.toLocaleString()}원`} />
              <DetailItem label="채널" value={plan.channel} />
              <DetailItem label="주요 혜택" value={plan.planBenefit} />
              <DetailItem label="IPTV 결합 할인" value={`${plan.iptvDiscount.toLocaleString()}원`} />
              <DetailItem label="등록 가능 여부" value={plan.availability ? '가능' : '불가능'} />
              <DetailItem label="사용 여부" value={plan.inUse ? '사용 중' : '미사용'} />
              {/* 태그 목록 */}
              {plan.tagList && plan.tagList.length > 0 && (
                <DetailItem label="태그" value={plan.tagList.map(tag => tag.tagName).join(', ')} />
              )}
              {/* 결합 혜택 목록 */}
              {plan.communityBenefitList && plan.communityBenefitList.length > 0 && (
                <DetailItem label="결합 혜택" value={plan.communityBenefitList.map(b => b.communityName).join(', ')} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminIPTVPlanDetail;