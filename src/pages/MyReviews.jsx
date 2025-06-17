import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/api";
import '../styles/MyReviews.css';

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedReview, setSelectedReview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [editedRating, setEditedRating] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await api.get('/user/detail/review', { withCredentials: true });
                const data = response?.data?.data;
                setReviews(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('리뷰를 불러오는데 실패했습니다.');
                setReviews([]);
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

    const getPlanUrl = (planType, planId) => {
        return `/${planType.toLowerCase()}/plan/${planId}`;
    };

    const handleContentClick = (review) => {
        setSelectedReview(review);
        setEditMode(false);
    };

    const handleEditClick = (review) => {
        setSelectedReview(review);
        setEditedTitle(review.title);
        setEditedContent(review.content);
        setEditedRating(review.rating);  // 별점 초기화
        setEditMode(true);
    };

    const handleSaveEdit = async () => {
        try {
            await api.put(
                `/review/update`,
                {
                    reviewId: selectedReview.reviewId,
                    title: editedTitle,
                    content: editedContent,
                    rating: editedRating,
                },
                { withCredentials: true }
            );

            setReviews((prev) =>
                prev.map((r) =>
                    r.reviewId === selectedReview.reviewId
                        ? { ...r, title: editedTitle, content: editedContent, rating: editedRating }
                        : r
                )
            );

            setSelectedReview(null);
            setEditMode(false);
        } catch (err) {
            console.error('리뷰 수정 실패:', err);
            alert('리뷰 수정에 실패했습니다.');
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await api.delete(`/review/${reviewId}`, { withCredentials: true });
            setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
        } catch (err) {
            console.error('리뷰 삭제 실패:', err);
            alert('삭제에 실패했습니다.');
        }
    };

    const closeModal = () => {
        setSelectedReview(null);
        setEditMode(false);
    };

    // 별점 선택 UI (1~5)
    const renderRatingInput = () => {
        return (
            <div className="rating-input">
                {[1, 2, 3, 4, 5].map((num) => (
                    <span
                        key={num}
                        className={`star ${num <= editedRating ? 'filled' : ''}`}
                        onClick={() => setEditedRating(num)}
                        role="button"
                        aria-label={`${num} 별점`}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') setEditedRating(num); }}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5; // 한 페이지당 5개 리뷰

    const indexOfLast = currentPage * reviewsPerPage;
    const indexOfFirst = indexOfLast - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const navigate = useNavigate();

    return (
        <div className="myreviews-container">
            <aside className="sidebar">
                <div className="side-menu">User Menu</div>
                <nav className="menu">
                    <button
                        className="menu-item"
                        onClick={() => navigate('/mypage')}
                    >
                        👤 User profile
                    </button>
                    <button
                        className="menu-item active"
                        onClick={() => navigate('/myreviews')}
                    >
                        💬 Reviews
                    </button>
                </nav>
            </aside>

            <div className="main-content">
                <h1 className="page-title">내가 작성한 리뷰</h1>

                {loading && <p>리뷰를 불러오는 중...</p>}
                {error && <p className="error-message">{error}</p>}

                {!loading && !error && reviews.length === 0 && (
                    <p className="no-reviews">작성한 리뷰가 없습니다.</p>
                )}

                {!loading && !error && currentReviews.length > 0 && (
                    <>
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
                            {currentReviews.map((review) => (
                                <tr key={review.reviewId}>
                                    <td>{review.reviewId}</td>
                                    <td className="plan-name-cell">
                                        <span
                                            className="clickable-plan-name"
                                            onClick={() => navigate(getPlanUrl(review.planType, review.planId))}
                                        >
                                            {review.planName}
                                        </span>
                                    </td>
                                    <td>{review.title}</td>
                                    <td className="review-content-cell"
                                        onClick={() => handleContentClick(review)}>
                                        {review.content.length > 30
                                            ? review.content.slice(0, 30) + '...'
                                            : review.content}
                                    </td>
                                    <td className="review-rating-cell">{'★'.repeat(review.rating)}</td>
                                    <td>{formatDate(review.createdAt)}</td>
                                    <td>
                                        <button
                                            className="review-btn"
                                            onClick={() => handleEditClick(review)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="review-btn"
                                            onClick={() => handleDelete(review.reviewId)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="pagination">
                            {pageNumbers.map((number) => (
                                <button
                                    key={number}
                                    onClick={() => setCurrentPage(number)}
                                    className={number === currentPage ? 'active-page' : ''}
                                >
                                    {number}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {selectedReview && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            {editMode ? (
                                <>
                                    <h2>리뷰 수정</h2>
                                    <input
                                        type="text"
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                        className="modal-input"
                                    />
                                    <textarea
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        className="modal-textarea"
                                    />
                                    <label>별점:</label>
                                    {renderRatingInput()}

                                    <div className="modal-buttons">
                                        <button onClick={handleSaveEdit} className="modal-save-btn">저장</button>
                                        <button onClick={closeModal} className="modal-close-btn">취소</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2>{selectedReview.title}</h2>
                                    <p>{selectedReview.content}</p>
                                    <button className="modal-close-btn" onClick={closeModal}>닫기</button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReviews;