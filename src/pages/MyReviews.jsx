import { useEffect, useState } from "react";
import axios from "axios";
import "./MyReviews.css";

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios.get('/user/detail/review', { withCredentials: true }) // 인증 쿠키 필요 시
            .then(response => {
                setReviews(response.data);
            })
            .catch(error => {
                console.error('리뷰 불러오기 실패:', error);
            });
    }, []);

    return (
        <div className="myreviews-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="side-menu">User Menu</div>
                <nav className="menu">
                    <button className="menu-item">👤 User profile</button>
                    <button className="menu-item active">💬 Reviews</button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <h1 className="page-title">내가 작성한 리뷰</h1>

                <div className="reviews-list">
                    {reviews.length === 0 ? (
                        <p className="no-reviews">작성한 리뷰가 없습니다.</p>
                    ) : (
                        reviews.map(review => (
                            <div className="review-card" key={review.reviewId}>
                                <h3 className="review-title">{review.title}</h3>
                                <p className="review-plan-name">요금제: {review.planName}</p>
                                <p className="review-rating">⭐ {review.rating}점</p>
                                <p className="review-date">{formatDate(review.createdAt)}</p>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}

// 날짜 포맷 함수 (예: 2025.06.08 → 25.06.08 형식으로)
function formatDate(dateString) {
    const date = new Date(dateString);
    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yy}.${mm}.${dd}`;
}

export default MyReviews;