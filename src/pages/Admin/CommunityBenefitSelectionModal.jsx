import React, { useState, useEffect } from 'react';
import { getPlanCreationInfoAPI } from "../../api/plan.js";
import styles from '../../styles/SelectionModal.module.css';

const CommunityBenefitSelectionModal = ({ onClose, onSelect, initialSelectedIds }) => {
  const [benefits, setBenefits] = useState([]);
  const [selectedBenefitIds, setSelectedBenefitIds] = useState(initialSelectedIds || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPlanCreationInfoAPI();
        if (response && response.statusCode === 0) {
          // console.log("API Response for Community Benefits:", response.data.communityBenefitList); // 디버깅용 로그
          setBenefits(response.data.communityBenefitList || []);
        } else {
          setError(response?.message || "결합 혜택을 불러오는데 실패했습니다.");
          setBenefits([]);
        }
      } catch (err) {
        setError("서버 연결 오류: 결합 혜택을 불러올 수 없습니다.");
        console.error("Error fetching community benefits:", err);
        setBenefits([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBenefits();
  }, []);

  const handleCheckboxChange = (e) => {
    const benefitId = parseInt(e.target.value, 10);
    if (isNaN(benefitId)) {
        console.warn("Invalid benefit ID:", e.target.value);
        return;
    }
    setSelectedBenefitIds((prevSelectedIds) => {
      const newSelectedIds = e.target.checked
        ? [...prevSelectedIds, benefitId]
        : prevSelectedIds.filter((id) => id !== benefitId);
      // console.log("Benefit selected IDs:", newSelectedIds); // 디버깅용
      return newSelectedIds;
    });
  };

  const handleApply = () => {
    // console.log("Applying selected benefits:", selectedBenefitIds); // 디버깅용
    onSelect(selectedBenefitIds);
    onClose();
  };

  if (isLoading) {
    return (
      <div className={styles['modal-backdrop']}>
        <div className={styles['modal-content']}>
          <p>결합 혜택 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['modal-backdrop']}>
        <div className={styles['modal-content']}>
          <p className={styles['error-message']}>오류: {error}</p>
          <button onClick={onClose} className={styles['modal-close-button']}>닫기</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['modal-backdrop']}>
      <div className={styles['modal-content']}>
        <h3>결합 혜택 선택</h3>
        {benefits.length > 0 ? (
          <div className={styles['tag-grid-list']}>
            {benefits.map((benefit) => (
              <label
                key={benefit.id}
                className={styles['checkbox-card']}
              >
                <input
                  type="checkbox"
                  value={benefit.id}
                  checked={selectedBenefitIds.includes(benefit.id)}
                  onChange={handleCheckboxChange}
                />
                <span>{benefit.communityName}</span>
              </label>
            ))}
          </div>
        ) : (
          <p>선택할 결합 혜택이 없습니다.</p>
        )}
        <div className={styles['modal-actions']}>
          <button onClick={handleApply} className={styles['modal-apply-button']}>선택 완료</button>
          <button onClick={onClose} className={styles['modal-close-button']}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default CommunityBenefitSelectionModal;