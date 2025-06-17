// src/pages/CInternetPlanList.jsx
import React, { useState, useEffect } from 'react';
import { getInternetPlans } from '../api/plan';
import CPlanCard from '../components/CPlanCard';
import styles from '../styles/CInternetPlanList.module.css'; // CInternetPlanList.module.css 사용
import sidebarStyles from '../styles/Csidebar.module.css';
import Csidebar from '../components/Csidebar';
import { useNavigate } from 'react-router-dom';

function CInternetPlanList() {
    const [plans, setPlans] = useState([]);
    const [selectedPlanIds, setSelectedPlanIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await getInternetPlans();
                setPlans(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // useEffect 의존성 경고 무시

    const handleSelectPlan = (planId) => {
        setSelectedPlanIds((prevSelectedPlanIds) => {
            if (prevSelectedPlanIds.includes(planId)) {
                return prevSelectedPlanIds.filter((id) => id !== planId);
            } else {
                if (prevSelectedPlanIds.length < 2) {
                    return [...prevSelectedPlanIds, planId];
                } else {
                    alert("요금제는 최대 2개까지만 비교할 수 있습니다."); // 경고 메시지 일관성 유지
                    return prevSelectedPlanIds;
                }
            }
        });
    };

    const handleCompareClick = () => {
        if (selectedPlanIds.length < 2) {
            alert("비교할 인터넷 요금제를 2개 이상 선택해주세요.");
            return;
        }
        navigate(`/comparison/internet?ids=${selectedPlanIds.join(',')}`);
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>오류 발생: {error.message}</div>;

    return (
        <div className={sidebarStyles['page-with-sidebar-layout']}>
            <Csidebar />
            <div className={sidebarStyles['main-content-area']}>
                <div className={styles.container}>
                    <h1>인터넷 요금제 목록</h1>
                    <div className={styles.planList}>
                        {plans.map((plan) => {
                            const isSelected = selectedPlanIds.includes(plan.planId);
                            // 2개 선택되었을 때, 현재 카드가 선택된 상태가 아니라면 비활성화 (선택 해제는 가능)
                            const isDisabled = selectedPlanIds.length >= 2 && !isSelected;

                            return (
                                <div key={plan.planId} className={styles.planItem}>
                                    <CPlanCard
                                        plan={plan}
                                        // onClick prop 제거: 이제 카드를 누르면 비교 선택이 됨 (Mobile과 동일)
                                        selected={isSelected} // CPlanCard에 selected prop 전달
                                        onSelect={handleSelectPlan} // CPlanCard에 onSelect prop 전달
                                        disabled={isDisabled} // CPlanCard에 disabled prop 전달
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={handleCompareClick} disabled={selectedPlanIds.length < 2}>
                        선택된 인터넷 요금제 비교 ({selectedPlanIds.length} / 2) {/* Mobile과 동일하게 (X / 2) 표시 */}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CInternetPlanList;