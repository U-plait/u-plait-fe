// src/pages/ComparisonMobilePlanList.jsx (최종 버전)
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { comparePlans } from '../api/plan';
import styles from '../styles/ComparisonPlanList.module.css';
import CDeleteConfirmModal from '../components/CDeleteConfirmModal';

function ComparisonMobilePlanList() {
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
                const results = await comparePlans("MobilePlan", planIds);
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

    if (loading) return <div className={styles.loading}>모바일 요금제 비교 결과를 불러오는 중...</div>;
    if (error) return <div className={styles.error}>오류 발생: {error.message}</div>;
    if (!comparisonResults || comparisonResults.length === 0) return <div className={styles.noResults}>비교할 모바일 요금제를 찾을 수 없습니다.</div>;

    // 상세 정보 표시를 위한 데이터 매핑 유틸리티 함수 (재사용)
    const getDisplayValue = (value, type) => {
        if (value === undefined || value === null || value === '') {
            return '-'; // 빈 값 처리
        }
        if (type === 'boolean') {
            return value ? '예' : '아니오';
        }
        if (typeof value === 'number' && type !== 'raw') {
            return value.toLocaleString();
        }
        return value;
    };

    return (
        <div className={styles.container}>
            <h1>모바일 요금제 비교</h1>
            <button onClick={() => navigate(-1)} className={styles.backButton}>뒤로 가기</button>

            <div className={styles.comparisonCardsContainer}>
                {comparisonResults.map((plan, index) => (
                    <div key={plan.planId || index} className={styles.planCard}>
                        {/* 카드 상단 배경 (스크린샷의 곡선 부분) */}
                        <div className={styles.cardTopBackground}></div>

                        <div className={styles.cardHeader}>
                            <h2 className={styles.planName}>{plan.planName}</h2>
                            <p className={styles.monthlyFeeText}>월정액 (부가세 포함 금액)</p>
                            <p className={styles.planPrice}>월 {getDisplayValue(plan.planPrice)}원</p>
                        </div>

                        <div className={styles.cardSection}>
                            <h3 className={styles.sectionTitle}>할인 상세내역</h3>
                            {/* 실제 할인 상세 내역 데이터가 있다면 여기에 매핑합니다. */}
                            {/* 현재 DTO에는 직접적인 할인 금액 필드가 없으므로, 예시 텍스트로 대체하거나 추가 DTO 필드를 활용해야 합니다. */}
                            <p className={styles.discountDetail}>월 {getDisplayValue(plan.premierDiscountRate)}원</p> {/* premierDiscountRate를 할인 상세 금액으로 가정 */}
                            <div className={styles.discountItem}>
                                <span className={styles.discountLabel}>선택 약정 할인</span>
                                <span className={styles.discountValue}>{getDisplayValue(plan.durationDiscountRate, 'number')}%</span>
                            </div>
                            <div className={styles.discountItem}>
                                <span className={styles.discountLabel}>프리미엄 요금제 약정 할인</span>
                                <span className={styles.discountValue}>{getDisplayValue(plan.premierDiscountRate, 'number')}원</span>
                            </div>
                        </div>

                        <div className={styles.cardSection}>
                            <div className={styles.detailItem}>
                                <h3 className={styles.detailTitle}>데이터</h3>
                                <p className={styles.detailValue}>{getDisplayValue(plan.data)}</p>
                                {plan.extraData && <p className={styles.detailSubtext}>추가 데이터: {getDisplayValue(plan.extraData)}</p>}
                                {plan.sharedData && <p className={styles.detailSubtext}>기본제공량 내 테더링+쉐어링 {getDisplayValue(plan.sharedData)}</p>}
                            </div>

                            <div className={styles.detailItem}>
                                <h3 className={styles.detailTitle}>음성통화</h3>
                                <p className={styles.detailValue}>{getDisplayValue(plan.voiceCall)}</p>
                            </div>

                            <div className={styles.detailItem}>
                                <h3 className={styles.detailTitle}>문자메시지</h3>
                                <p className={styles.detailValue}>{getDisplayValue(plan.message)}</p>
                            </div>

                            <div className={styles.detailItem}>
                                <h3 className={styles.detailTitle}>미디어 혜택</h3>
                                <p className={styles.detailValue}>{getDisplayValue(plan.mediaBenefit, 'boolean')}</p>
                            </div>

                            {/* 기타 필드들을 유사하게 추가 */}
                            {plan.planBenefit && (
                                <div className={styles.detailItem}>
                                    <h3 className={styles.detailTitle}>요금제 혜택</h3>
                                    <p className={styles.detailValue}>{getDisplayValue(plan.planBenefit)}</p>
                                </div>
                            )}
                        </div>
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

export default ComparisonMobilePlanList;