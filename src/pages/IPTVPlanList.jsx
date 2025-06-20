import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import "../styles/IPTVPlanList.css";

const IPTVPlanList = () => {
    const [plans, setPlans] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    const fetchPlans = async (pageNum) => {
        try {
            setLoading(true);
            const res = await api.get(`/plan/iptv?page=${pageNum}&size=5`);
            const newPlans = res.data?.data?.content || [];
            const lastPage = res.data?.data?.last;

            setPlans((prev) => [...prev, ...newPlans]);
            setHasMore(!lastPage);
        } catch (error) {
            console.error("IPTV 요금제 불러오기 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans(page);
    }, [page]);

    const lastPlanRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prev) => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const toggleFavorite = (id) => {
        setFavorites((prev) => {
            const newFavorites = new Set(prev);
            newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
            return newFavorites;
        });
    };

    return (
        <div className="plan-container">
            <h2 className="plan-title">IPTV 요금제</h2>
            <div className="plan-list">
                {plans.map((plan, index) => (
                    <div
                        key={plan.planId}
                        ref={index === plans.length - 1 ? lastPlanRef : null}
                        className="plan-card"
                    >
                        <button
                            className={`favorite-button ${favorites.has(plan.planId) ? "active" : ""}`}
                            onClick={() => toggleFavorite(plan.planId)}
                            aria-label="즐겨찾기"
                        >
                            ★
                        </button>

                        <div className="plan-info">
                            <h3 className="plan-name">{plan.planName}</h3>
                            <ul className="plan-benefits">
                                <li>{plan.planBenefit}</li>
                                {!plan.availability && <li>현재 가입 불가</li>}
                            </ul>
                        </div>

                        <div className="plan-price-box">
                            <p className="plan-price">월 {plan.planPrice.toLocaleString()}원</p>
                            <Link to={`/iptv/plan/${plan.planId}`} className="plan-detail-button">
                                상세보기
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            {loading && <p className="plan-loading">불러오는 중...</p>}
        </div>
    );
};

export default IPTVPlanList;