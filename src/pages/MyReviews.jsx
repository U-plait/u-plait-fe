import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyReviews.css';

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/user/detail/review'); // 실제 API 경로로 변경하세요
                setReviews(response.data.data);
                setError(null);
            } catch (err) {
                setError('리뷰를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
    };

    const handleContentClick = (review) => {
        setSelectedReview(review);
    };

    const closeModal = () => {
        setSelectedReview(null);
    };

    return (
        <div className="myreviews-container">
            <div className="sidebar">
                <h2 className="side-menu">마이페이지</h2>
                <div className="menu">
                    <button className="menu-item active">내 리뷰</button>
                    <button className="menu-item">회원 정보</button>
                </div>
            </div>

            <div className="main-content">
                <h1 className="page-title">내가 작성한 리뷰</h1>

                {loading && <p>리뷰를 불러오는 중...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && reviews.length === 0 && (
                    <p className="no-reviews">작성한 리뷰가 없습니다.</p>
                )}

                {!loading && !error && reviews.length > 0 && (
                    <table className="reviews-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>요금제명</th>
                            <th>제목</th>
                            <th>내용</th>
                            <th>별점</th>
                            <th>작성일</th>
                            <th>수정</th>
                            <th>삭제</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reviews.map((review) => (
                            <tr key={review.reviewId}>
                                <td>{review.reviewId}</td>
                                <td>{review.planName}</td>
                                <td>{review.title}</td>
                                <td
                                    className="review-content-cell review-content-clickable"
                                    onClick={() => handleContentClick(review)}
                                >
                                    {review.content}
                                </td>
                                <td className="review-rating-cell">{'★'.repeat(review.rating)}</td>
                                <td>{formatDate(review.createdAt)}</td>
                                <td>
                                    <button
                                        className="review-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            alert('수정 기능 준비 중');
                                        }}
                                    >
                                        Edit
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="review-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            alert('삭제 기능 준비 중');
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                {selectedReview && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h2>{selectedReview.title}</h2>
                            <p>{selectedReview.content}</p>
                            <button className="modal-close-btn" onClick={closeModal}>
                                닫기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReviews;
