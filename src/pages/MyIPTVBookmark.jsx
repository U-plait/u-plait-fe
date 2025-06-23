import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import styles from "../styles/MyIPTVBookmark.module.css"; // IPTV 전용 스타일 모듈
import IPTVCard from "../components/IPTVCard";
import useUserStore from "../context/userStore";

const MyIPTVBookmark = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef();
    const planType = "IPTV"; // IPTV 타입 고정
    const size = 5;

    // 즐겨찾기 해제 함수
    const toggleFavorite = async (planId) => {
        try {
            await api.delete("/bookmark", { params: { planId } });
            // 삭제 성공하면 리스트에서 제거
            setPlans((prev) => prev.filter((plan) => plan.planId !== planId));
        } catch (error) {
            console.error("즐겨찾기 해제 실패:", error);
        }
    };

    const fetchPlans = async (pageNum) => {
        try {
            setLoading(true);
            const lastBookmarkId = plans.length > 0 ? plans[plans.length - 1].bookmarkId : undefined;

            const res = await api.get("/bookmark", {
                params: { planType, size, lastBookmarkId },
            });

            const newPlans = res.data?.data?.bookmarkList || [];
            const hasNext = res.data?.data?.hasNext;

            setPlans((prev) => [...prev, ...newPlans]);
            setHasMore(hasNext);
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

    return (
        <div className="mypage-container">
            {/* Sidebar 유지 */}
            <aside className="sidebar">
                <div className="side-menu">User Menu</div>
                <nav className="menu">
                    <button className="menu-item" onClick={() => navigate("/mypage")}>👤 User profile</button>
                    <button className="menu-item" onClick={() => navigate("/myreviews")}>💬 Reviews</button>
                    <button className="menu-item active" onClick={() => navigate("/myiptvbookmark")}>🌟 Bookmark</button>
                </nav>
                <div className="logout-section">
                    <button
                        className="logout-btn"
                        onClick={async () => {
                            try {
                                await api.post("/auth/logout");
                            } catch (e) {
                                console.error("로그아웃 실패", e);
                            } finally {
                                const setUser = useUserStore.getState().setUser;
                                setUser(null);
                                window.location.href = "/login";
                            }
                        }}
                    >
                        로그아웃
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="main-content">
                <div className={styles["bookmark-type-buttons"]}>
                    <Link to="/mymobilebookmark" className={styles["bookmark-type-button"]}>모바일</Link>
                    <Link to="/myinternetbookmark" className={styles["bookmark-type-button"]}>인터넷</Link>
                    <Link to="/myiptvbookmark" className={`${styles["bookmark-type-button"]} ${styles.active}`}>IPTV</Link>
                </div>

                {plans.length === 0 && !loading ? (
                    <p className={styles["plan-empty"]}>북마크가 비어 있습니다.</p>
                ) : (
                    <div className={styles["plan-list"]}>
                        {plans.map((plan, index) => (
                            <IPTVCard
                                key={plan.planId}
                                plan={plan}
                                isFavorite={true}
                                toggleFavorite={toggleFavorite}
                                lastPlanRef={index === plans.length - 1 ? lastPlanRef : null}
                            />
                        ))}
                    </div>
                )}

                {loading && <p className={styles["plan-loading"]}>불러오는 중...</p>}
            </main>
        </div>
    );
};

export default MyIPTVBookmark;