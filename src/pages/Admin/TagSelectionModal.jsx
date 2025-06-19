import React, { useState, useEffect } from 'react';
import { getPlanCreationInfoAPI } from "../../api/plan.js";
import styles from '../../styles/SelectionModal.module.css';

const TagSelectionModal = ({ onClose, onSelect, initialSelectedIds }) => {
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState(initialSelectedIds || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getPlanCreationInfoAPI();
            console.log("API Response for Tags:", response); // API 응답 전체 확인
            if (response && response.statusCode === 0) {
                console.log("Tag List from API:", response.data.tagList); // tagList 내용 확인
                setTags(response.data.tagList || []);
            } else {
                setError(response?.message || "태그 정보를 불러오는데 실패했습니다.");
                setTags([]);
            }
        } catch (err) {
            setError("서버 연결 오류: 태그 정보를 불러올 수 없습니다.");
            console.error("Error fetching tags:", err);
            setTags([]);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
}, []);

const handleCheckboxChange = (e) => {
    const value = e.target.value; // 원래 문자열 값 확인
    const tagId = parseInt(value, 10);
    console.log("Checkbox clicked. Raw value:", value, "Parsed ID:", tagId, "Checked state:", e.target.checked);
    if (isNaN(tagId)) {
        console.warn("Invalid tag ID parsed as NaN:", value); // 어떤 값이 NaN이 되는지 정확히 확인
        return;
    }
    setSelectedTagIds((prevSelectedIds) => {
        const newSelectedIds = e.target.checked
            ? [...prevSelectedIds, tagId]
            : prevSelectedIds.filter((id) => id !== tagId);
        console.log("New selected IDs state:", newSelectedIds);
        return newSelectedIds;
    });
};

  const handleApply = () => {
    // console.log("Applying selected tags:", selectedTagIds); // 디버깅용
    onSelect(selectedTagIds);
    onClose();
  };

  if (isLoading) {
    return (
      <div className={styles['modal-backdrop']}>
        <div className={styles['modal-content']}>
          <p>태그 불러오는 중...</p>
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
        <h3>태그 선택</h3>
        <div className={styles['selection-list']}>
          {tags.length > 0 ? (
            tags.map((tag) => (
              <label key={tag.id} className={styles['checkbox-card']}>
                <input
                  type="checkbox"
                  value={tag.id}
                  checked={selectedTagIds.includes(tag.id)}
                  onChange={handleCheckboxChange}
                />
                <span>{tag.tagName}</span>
              </label>
            ))
          ) : (
            <p>선택할 태그가 없습니다.</p>
          )}
        </div>
        <div className={styles['modal-actions']}>
          <button onClick={handleApply} className={styles['modal-apply-button']}>선택 완료</button>
          <button onClick={onClose} className={styles['modal-close-button']}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default TagSelectionModal;