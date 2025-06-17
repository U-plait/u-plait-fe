// src/pages/CIPTVPlanList.jsx
import React, { useState, useEffect } from 'react';
import { getIptvPlans } from '../api/plan';
import CPlanCard from '../components/CPlanCard';
import styles from '../styles/CIPTVPlanList.module.css';
import sidebarStyles from '../styles/Csidebar.module.css'; // .module.css로 변경 확인!
import Csidebar from '../components/Csidebar';
import { useNavigate } from 'react-router-dom';

function CIPTVPlanList() {
    const [plans, setPlans] = useState([]);
    const [selectedPlanIds, setSelectedPlanIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await getIptvPlans();
                setPlans(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelectPlan = (planId) => {
        setSelectedPlanIds((prevSelectedPlanIds) => {
            if (prevSelectedPlanIds.includes(planId)) {
                return prevSelectedPlanIds.filter((id) => id !== planId);
            } else {
                if (prevSelectedPlanIds.length < 2) {
                    return [...prevSelectedPlanIds, planId];
                } else {
                    alert("요금제는 최대 2개까지만 비교할 수 있습니다.");
                    return prevSelectedPlanIds;
                }
            }
        });
    };

    const handleCompareClick = () => {
        if (selectedPlanIds.length < 2) {
            alert("비교할 IPTV 요금제를 2개 이상 선택해주세요.");
            return;
        }
        navigate(`/comparison/iptv?ids=${selectedPlanIds.join(',')}`);
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>오류 발생: {error.message}</div>;

    return (
        <div className={sidebarStyles['page-with-sidebar-layout']}>
            <Csidebar />
            <div className={sidebarStyles['main-content-area']}>
                <div className={styles.container}>
                    <h1>IPTV 요금제 목록</h1>
                    <div className={styles.planList}>
                        {plans.map((plan) => {
                            const isSelected = selectedPlanIds.includes(plan.planId);
                            const isDisabled = selectedPlanIds.length >= 2 && !isSelected;

                            return (
                                <div key={plan.planId} className={styles.planItem}>
                                    <CPlanCard
                                        plan={plan}
                                        selected={isSelected}
                                        onSelect={handleSelectPlan}
                                        disabled={isDisabled}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={handleCompareClick} disabled={selectedPlanIds.length < 2}>
                        선택된 IPTV 요금제 비교 ({selectedPlanIds.length} / 2)
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CIPTVPlanList;