// src/components/CPlanCard.jsx
import React from 'react';
import styles from '../styles/CPlanCard.module.css';

function CPlanCard({ plan, selected, onSelect, disabled }) {
    // 카드 전체를 클릭했을 때 호출될 함수 (onSelect 호출)
    const handleCardClick = (e) => {
        // disabled 상태가 아닐 때만 onSelect 호출
        if (!disabled) {
            onSelect(plan.planId);
        }
    };

    // 체크박스 자체의 변경 이벤트 핸들러 (선택 상태 변경)
    // 이전에 빈 함수로 설정했던 부분을 다시 onSelect 호출로 변경
    const handleCheckboxChange = (e) => {
        e.stopPropagation(); // 체크박스 클릭 시 카드 전체 클릭 이벤트 방지
        // disabled 상태는 input 태그의 disabled prop으로 이미 처리되므로 여기서 추가 로직 필요 없음
        onSelect(plan.planId);
    };

    return (
        <div
            className={`${styles.card} ${selected ? styles.selected : ''}`}
            onClick={handleCardClick} // 카드 전체 클릭 시 onSelect 호출 (disabled가 아니라면)
        >
            <div className={styles['content-wrapper']}>
                <h3 className={styles['plan-name']}>{plan.planName}</h3>
                <p className={styles['plan-price']}>{plan.planPrice.toLocaleString()}원</p>

                <label
                    className={`${styles['checkbox-area']} ${disabled ? styles['checkbox-area-disabled'] : ''}`}
                    // label 자체의 onClick은 제거하거나, handleCheckboxChange를 연결
                    // input의 onChange가 발생하면 label의 onClick은 필요 없음
                >
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={selected}
                        onChange={handleCheckboxChange} // 핵심: onChange에 onSelect 연결
                        disabled={disabled}
                    />
                    <span className={styles['checkbox-custom-box']}></span>
                    <span className={styles['checkbox-label']}>비교 선택</span>
                </label>
            </div>
        </div>
    );
}

export default CPlanCard;