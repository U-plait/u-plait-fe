// src/pages/ComparisonIPTVPlanList.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { comparePlans } from '../api/plan';
import styles from '../styles/ComparisonPlanList.module.css'; // 동일한 CSS 파일 사용
import CDeleteConfirmModal from '../components/CDeleteConfirmModal';

function ComparisonIPTVPlanList() {
    const [comparisonResults, setComparisonResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const ids = queryParams.get('ids');

        if (!ids) {
            setError(new Error("비교할 요금제 ID가 없습니다."));
            setLoading(false);
            return;
        }

        const planIds = ids.split(',').map(Number);
        if (planIds.length < 2) {
            setError(new Error("비교할 요금제를 2개 이상 선택해야 합니다."));
            setLoading(false);
            return;
        }

        const fetchComparison = async () => {
            try {
                const results = await comparePlans("IPTVPlan", planIds);
                setComparisonResults(results);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchComparison();
    }, [location.search]);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (loading) return <div className={styles.loading}>IPTV 요금제 비교 결과를 불러오는 중...</div>;
    if (error) return <div className={styles.error}>오류 발생: {error.message}</div>;
    if (!comparisonResults || comparisonResults.length === 0) return <div className={styles.noResults}>비교할 IPTV 요금제를 찾을 수 없습니다.</div>;

    // 상세 정보 표시를 위한 데이터 매핑 유틸리티 함수 (재사용)
    const getDisplayValue = (value, type) => {
        if (value === undefined || value === null || value === '') {
            return '-'; // 빈 값 처리
        }
        if (type === 'boolean') {
            return value ? '예' : '아니오';
        }
        if (typeof value === 'number' && type !== 'raw') {
            return value.toLocaleString(); // 숫자 쉼표 포맷팅
        }
        return value;
    };

    return (
        <div className={styles.container}>
            <h1>IPTV 요금제 비교</h1>
            <button onClick={() => navigate(-1)} className={styles.backButton}>뒤로 가기</button>

            <div className={styles.comparisonCardsContainer}>
                {comparisonResults.map((plan, index) => {
                    const finalPrice = plan.iptvDiscount || plan.planPrice;
                    const totalDiscount = plan.planPrice - finalPrice;

                    return (
                        <div key={plan.planId || index} className={`${styles.planCard} ${styles.alwaysShadow}`}>
                            <div className={styles.cardTopBackground}></div>

                            <div className={styles.cardHeader}>
                                <h2 className={styles.planName}>{plan.planName}</h2>
                                <p className={styles.originalPrice}>월 {getDisplayValue(plan.planPrice)}원</p>
                                <p className={styles.planPrice}>월 {getDisplayValue(finalPrice)}원</p>
                            </div>

                            <div className={styles.cardSection}>
                                <h3 className={styles.sectionTitle}>할인 상세내역</h3>
                                <p className={styles.discountDetail}>월 {getDisplayValue(totalDiscount)}원</p>
                            </div>

                            <div className={styles.cardSection}>
                                <div className={styles.detailItem}>
                                    <h3 className={styles.detailTitle}>채널 수</h3>
                                    <p className={styles.detailValue}>{getDisplayValue(plan.channel)}개</p>
                                </div>
                            </div>

                            {plan.planBenefit && (
                                <div className={styles.cardSection}>
                                    <h3 className={styles.sectionTitle}>요금제 혜택</h3>
                                    <div className={styles.detailItem}>
                                        <p className={styles.detailValue}>{getDisplayValue(plan.planBenefit)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {showModal && (
                <CDeleteConfirmModal onConfirm={handleCloseModal} onCancel={handleCloseModal} hideCancel={true} confirmText="확인">
                    <div>
                        <h2>비교 결과 요약 (모달 내)</h2>
                        {comparisonResults.map(plan => (
                            <p key={plan.planId}>{plan.planName}: {getDisplayValue(plan.planPrice)}원</p>
                        ))}
                    </div>
                </CDeleteConfirmModal>
            )}
        </div>
    );
}

export default ComparisonIPTVPlanList;