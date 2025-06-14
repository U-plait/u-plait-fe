import React from 'react';
import '../styles/PlanManager.css'; // PlanManager의 모달 스타일을 재사용합니다.

const DeleteConfirmModal = ({ planName, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content delete-modal">
                <h2>요금제 삭제</h2>
                <p>
                    정말로 <strong>'{planName}'</strong> 요금제를 삭제하시겠습니까?
                    <br />
                    이 작업은 되돌릴 수 없습니다.
                </p>
                <div className="modal-actions">
                    <button onClick={onCancel} className="cancel-btn">취소</button>
                    <button onClick={onConfirm} className="delete-confirm-btn">삭제 확인</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
