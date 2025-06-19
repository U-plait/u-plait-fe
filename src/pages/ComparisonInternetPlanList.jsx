// src/pages/ComparisonInternetPlanList.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { comparePlans } from '../api/plan';
import styles from '../styles/ComparisonPlanList.module.css'; // 동일한 CSS 파일 사용
import CDeleteConfirmModal from '../components/CDeleteConfirmModal';

function ComparisonInternetPlanList() {
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
                const results = await comparePlans("InternetPlan", planIds);
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

    if (loading) return <div className={styles.loading}>인터넷 요금제 비교 결과를 불러오는 중...</div>;
    if (error) return <div className={styles.error}>오류 발생: {error.message}</div>;
    if (!comparisonResults || comparisonResults.length === 0) return <div className={styles.noResults}>비교할 인터넷 요금제를 찾을 수 없습니다.</div>;

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
            <h1>인터넷 요금제 비교</h1>
            <button onClick={() => navigate(-1)} className={styles.backButton}>뒤로 가기</button>

            <div className={styles.comparisonCardsContainer}>
                {comparisonResults.map((plan, index) => (
                    <div key={plan.planId || index} className={styles.planCard}>
                        {/* 카드 상단 배경 (MobilePlan과 동일) */}
                        <div className={styles.cardTopBackground}></div>

                        <div className={styles.cardHeader}>
                            <h2 className={styles.planName}>{plan.planName}</h2>
                            <p className={styles.monthlyFeeText}>월정액 (부가세 포함 금액)</p>
                            <p className={styles.planPrice}>월 {getDisplayValue(plan.planPrice)}원</p>
                        </div>

                        {/* 할인 상세내역 섹션 */}
                        <div className={styles.cardSection}>
                            <h3 className={styles.sectionTitle}>할인 상세내역</h3>
                            {/* DTO의 internetDiscount 필드 사용 */}
                            <p className={styles.discountDetail}>월 {getDisplayValue(plan.internetDiscount)}원</p>
                            {/* 다른 할인 관련 필드가 있다면 여기에 추가 */}
                        </div>

                        {/* 인터넷 고유 정보 섹션 */}
                        <div className={styles.cardSection}>
                            <div className={styles.detailItem}>
                                <h3 className={styles.detailTitle}>속도</h3>
                                <p className={styles.detailValue}>{getDisplayValue(plan.velocity)}</p> {/* DTO의 velocity 필드 사용 */}
                            </div>
                            {/* 설치비, 약정 기간 등 다른 인터넷 요금제 관련 필드들이 InternetPlanDetailResponse에 정의되어 있다면 여기에 추가 */}
                            {/* 예시:
                            {plan.installationFee && (
                                <div className={styles.detailItem}>
                                    <h3 className={styles.detailTitle}>설치비</h3>
                                    <p className={styles.detailValue}>{getDisplayValue(plan.installationFee)}원</p>
                                </div>
                            )}
                            {plan.contractPeriod && (
                                <div className={styles.detailItem}>
                                    <h3 className={styles.detailTitle}>약정 기간</h3>
                                    <p className={styles.detailValue}>{getDisplayValue(plan.contractPeriod)}개월</p>
                                </div>
                            )}
                            */}
                        </div>

                        {/* 요금제 혜택 (PlanDetailResponse의 공통 필드) */}
                        {plan.planBenefit && (
                            <div className={styles.cardSection}>
                                <h3 className={styles.sectionTitle}>요금제 혜택</h3>
                                <div className={styles.detailItem}>
                                    <p className={styles.detailValue}>{getDisplayValue(plan.planBenefit)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
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

export default ComparisonInternetPlanList;