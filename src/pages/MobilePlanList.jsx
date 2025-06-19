import { useEffect, useRef, useState, useCallback } from "react";
import api from "../api/api";
import styles from "../styles/MobilePlanList.module.css";  // CSS module import
import MobileCard from "../components/MobileCard";

const MobilePlanList = () => {
    const [plans, setPlans] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    // 요금제 불러오기
    const fetchPlans = async (pageNum) => {
        try {
            setLoading(true);
            const res = await api.get(`/admin/plan/mobile?page=${pageNum}&size=5`);
            const newPlans = res.data?.data?.content || [];
            const lastPage = res.data?.data?.last;

            setPlans((prev) => [...prev, ...newPlans]);
            setHasMore(!lastPage);

            // 서버에서 즐겨찾기 정보(plan.isBookmarked)가 내려온다면 Set에 추가
            setFavorites(prev => {
                const newSet = new Set(prev);
                newPlans.forEach(plan => {
                    if (plan.isBookmarked) newSet.add(plan.planId);
                });
                return newSet;
            });
        } catch (error) {
            console.error("요금제 불러오기 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans(page);
        // eslint-disable-next-line
    }, [page]);

    // 페이지네이션 (무한스크롤)
    const lastPlanRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    // 즐겨찾기 토글
    const toggleFavorite = async (planId) => {
        const isBookmarked = favorites.has(planId);
        try {
            if (isBookmarked) {
                await api.delete(`/bookmark`, { params: { planId } });
            } else {
                await api.post(`/bookmark`, null, { params: { planId } });
            }
            setFavorites(prev => {
                const newFavorites = new Set(prev);
                isBookmarked ? newFavorites.delete(planId) : newFavorites.add(planId);
                return newFavorites;
            });
        } catch (error) {
            alert("즐겨찾기 처리 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    return (
        <div className={styles["plan-container"]}>
            <div className={styles["plan-title"]}>모바일 요금제</div>
            <div className={styles["plan-list"]}>
                {plans.map((plan, index) => (
                    <MobileCard
                        key={plan.planId}
                        plan={plan}
                        isFavorite={favorites.has(plan.planId)}
                        toggleFavorite={toggleFavorite}
                        lastPlanRef={index === plans.length - 1 ? lastPlanRef : null}
                    />
                ))}
            </div>
            {loading && <p className={styles["plan-loading"]}>불러오는 중...</p>}
        </div>
    );
};

export default MobilePlanList;
