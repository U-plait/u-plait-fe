// src/components/CDeleteConfirmModal.jsx
import React from 'react';
import '../styles/PlanManager.css'; // PlanManager의 모달 스타일을 재사용합니다.

const CDeleteConfirmModal = ({ planName, onConfirm, onCancel, children }) => { // 컴포넌트명 변경
    return (
        <div className="modal-overlay">
            <div className="modal-content delete-modal">
                {/* planName이 제공되면 삭제 확인 메시지를, 그렇지 않으면 children을 렌더링 */}
                {planName ? (
                    <>
                        <h2>요금제 삭제</h2>
                        <p>
                            정말로 <strong>'{planName}'</strong> 요금제를 삭제하시겠습니까?
                            <br />
                            이 작업은 되돌릴 수 없습니다.
                        </p>
                    </>
                ) : (
                    children
                )}
                <div className="modal-actions">
                    <button onClick={onCancel} className="cancel-btn">취소</button>
                    <button onClick={onConfirm} className="delete-confirm-btn">삭제 확인</button>
                </div>
            </div>
        </div>
    );
};

export default CDeleteConfirmModal; // 내보내는 이름도 변경