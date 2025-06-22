import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/MyMoblieBookmark.module.css";
import IPTVCard from "../components/IPTVCard";

const MyIPTVBookmark = () => {

    const navigate = useNavigate();

    // 북마크 요금제 불러오기
    const fetchPlans = async (pageNum) => {
        try {
            setLoading(true);
            const res = await api.get("/bookmark", {
                params: {
                    planType,          // 'MOBILE' 또는 'INTERNET' 또는 'IPTV'
                    size,              // 기본값 5
                    lastBookmarkId,    // 없으면 undefined 처리됨
                },
            });
            const newPlans = res.data?.data?.content || [];
            const lastPage = res.data?.data?.last;

            setPlans((prev) => [...prev, ...newPlans]);
            setHasMore(!lastPage);

            return response.data;
        } catch (error) {
            console.error("요금제 불러오기 실패:", error);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="mypage-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="side-menu">User Menu</div>
                <nav className="menu">
                    <button
                        className="menu-item"
                        onClick={() => navigate("/mypage")}
                    >
                        👤 User profile
                    </button>
                    <button className="menu-item" onClick={() => navigate("/myreviews")}>
                        💬 Reviews
                    </button>
                    <button className="menu-item active" onClick={() => navigate("/mymobilebookmark")}>
                        🌟 Bookmark
                    </button>
                </nav>
            </aside>

            <main className="main-content">
                <h1 className="page-title">IPTV 요금제 북마크</h1>

            </main>
        </div>
    );
};

export default MyIPTVBookmark;