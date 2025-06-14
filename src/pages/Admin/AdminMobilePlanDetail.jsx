// src/pages/admin/AdminMobilePlanDetail.jsx

import React from 'react';
import '../../styles/AdminPlanDetail.css';

const AdminMobilePlanDetail = ({ plan, isLoading, onClose }) => {
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
          <h2>모바일 요금제 상세 정보</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {isLoading ? (
            <div className="loading-container">로딩 중...</div>
          ) : (
            <div className="detail-grid">
              <DetailItem label="요금제 이름" value={plan.planName} />
              <DetailItem label="가격" value={`${plan.planPrice.toLocaleString()}원`} />
              <DetailItem label="주요 혜택" value={plan.planBenefit} />
              <DetailItem label="데이터" value={plan.data} />
              <DetailItem label="공유 데이터" value={plan.sharedData} />
              <DetailItem label="음성통화" value={plan.voiceCall} />
              <DetailItem label="메시지" value={plan.message} />
              <DetailItem label="추가 데이터" value={plan.extraData} />
              <DetailItem label="미디어 혜택" value={plan.mediaBenefit ? '제공' : '미제공'} />
              <DetailItem label="선택 약정 할인" value={`${plan.durationDiscountRate}%`} />
              <DetailItem label="프리미어 약정 할인" value={`${plan.premierDiscountRate.toLocaleString()}원`} />
              <DetailItem label="등록 가능 여부" value={plan.availability ? '가능' : '불가능'} />
              <DetailItem label="사용 여부" value={plan.inUse ? '사용 중' : '미사용'} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMobilePlanDetail;