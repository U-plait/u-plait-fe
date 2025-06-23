import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api/api";
import styles from "../styles/MyMobileBookmark.module.css";
import MobileCard from "../components/MobileCard";
import useUserStore from "../context/userStore";

const MyMobileBookmark = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const [plans, setPlans] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef();
    const planType = "MOBILE";
    const size = 5;

    // 즐겨찾기 목록 조회
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

    // 무한스크롤 관찰자
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

    // 즐겨찾기 해제 핸들러
    const handleUnbookmark = async (planId) => {
        try {
            await api.delete("/bookmark", { params: { planId } });
            setPlans(prev => prev.filter(plan => plan.planId !== planId));
        } catch (error) {
            alert("즐겨찾기 해제 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    return (
        <div className="mypage-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="side-menu">User Menu</div>
                <nav className="menu">
                    <button className="menu-item" onClick={() => navigate("/mypage")}>👤 User profile</button>
                    <button className="menu-item" onClick={() => navigate("/myreviews")}>💬 Reviews</button>
                    <button className="menu-item active" onClick={() => navigate("/mymobilebookmark")}>🌟 Bookmark</button>
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

            {/* Main */}
            <main className="main-content">
                {/* ✅ 탭 버튼 */}
                <div className={styles["bookmark-type-buttons"]}>
                    <Link
                        to="/mymobilebookmark"
                        className={`${styles["bookmark-type-button"]} ${currentPath === "/mymobilebookmark" ? styles["active"] : ""}`}
                    >
                        모바일
                    </Link>
                    <Link
                        to="/myinternetbookmark"
                        className={`${styles["bookmark-type-button"]} ${currentPath === "/myinternetbookmark" ? styles["active"] : ""}`}
                    >
                        인터넷
                    </Link>
                    <Link
                        to="/myiptvbookmark"
                        className={`${styles["bookmark-type-button"]} ${currentPath === "/myiptvbookmark" ? styles["active"] : ""}`}
                    >
                        IPTV
                    </Link>
                </div>

                {/* 카드 목록 */}
                <div className={styles["plan-list"]}>
                    {plans.map((plan, index) => (
                        <MobileCard
                            key={plan.planId}
                            plan={plan}
                            isFavorite={true}
                            toggleFavorite={handleUnbookmark}
                            lastPlanRef={index === plans.length - 1 ? lastPlanRef : null}
                        />
                    ))}
                </div>

                {/* 비어 있음 */}
                {!loading && plans.length === 0 && (
                    <p className={styles["plan-empty"]}>북마크가 비어 있습니다.</p>
                )}

                {/* 로딩 중 */}
                {loading && <p className={styles["plan-loading"]}>불러오는 중...</p>}
            </main>
        </div>
    );
};

export default MyMobileBookmark;