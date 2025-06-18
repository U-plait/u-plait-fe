// src/pages/Admin/ReviewManager.jsx
import React, { useEffect, useState, useCallback } from "react";
import { getReviewsAPI, deleteReviewAPI, deleteMultipleReviewsAPI, getReviewDetailAPI } from "../../api/review";
import AdminSidebar from "../../components/AdminSidebar";
// import SearchBar from "../../components/SearchBar"; // SearchBar 컴포넌트 임포트 제거
import "../../styles/ReviewManager.css"; // 기존 스타일 시트 유지

// 재사용 가능한 로딩 스피너 컴포넌트
const LoadingSpinner = () => <div className="loading-spinner"></div>;

// 재사용 가능한 에러 표시 컴포넌트
const ErrorDisplay = ({ message }) => <div className="error-display">⚠️ {message}</div>;

// 리뷰 상세 정보 모달 컴포넌트
const ReviewDetailModal = ({ review, onClose }) => {
    if (!review) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>리뷰 상세 정보</h3>
                <p><strong>ID:</strong> {review.reviewId}</p>
                <p><strong>작성자:</strong> {review.userName}</p>
                <p><strong>제목:</strong> {review.title}</p>
                <p><strong>별점:</strong> {"⭐".repeat(review.rating)}</p>
                <p><strong>작성일:</strong> {review.createdAt}</p>
                <p><strong>내용:</strong> {review.content}</p>
                <button onClick={onClose} className="modal-close-button">닫기</button>
            </div>
        </div>
    );
};

const ReviewManager = () => {
    const [reviews, setReviews] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 1,
    });
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedReviewDetail, setSelectedReviewDetail] = useState(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState(null);

    const fetchReviews = useCallback(async (page) => {
        setIsLoading(true);
        setError(null);
        setSelectedIds(new Set());
        try {
            const response = await getReviewsAPI(page, 10);

            if (response.statusCode === 0 && response.data) {
                setReviews(response.data.content);
                setPagination({
                    currentPage: response.data.number,
                    totalPages: response.data.totalPages,
                });
            } else {
                setError(response.message || "리뷰 목록을 불러오는 데 실패했습니다.");
                setReviews([]);
            }
        } catch (err) {
            setError("리뷰 목록을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
            console.error("리뷰 목록 API 오류:", err);
            setReviews([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews(0);
    }, [fetchReviews]);

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm(`정말로 ID ${reviewId}인 리뷰를 삭제하시겠습니까?`)) {
            try {
                await deleteReviewAPI(reviewId);
                alert("리뷰가 성공적으로 삭제되었습니다.");
                fetchReviews(pagination.currentPage);
            } catch (err) {
                alert("리뷰 삭제에 실패했습니다.");
                console.error("리뷰 삭제 API 오류:", err);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) {
            return alert("삭제할 리뷰를 선택해주세요.");
        }
        if (window.confirm(`정말로 선택된 ${selectedIds.size}개의 리뷰를 삭제하시겠습니까?`)) {
            try {
                await deleteMultipleReviewsAPI(Array.from(selectedIds));
                alert("선택된 리뷰가 모두 삭제되었습니다.");
                fetchReviews(pagination.currentPage);
            } catch (err) {
                alert("선택된 리뷰 삭제에 실패했습니다.");
                console.error("일괄 삭제 API 오류:", err);
            }
        }
    };

    const handleViewDetail = useCallback(async (reviewId) => {
        setIsDetailLoading(true);
        setDetailError(null);
        try {
            const response = await getReviewDetailAPI(reviewId);
            if (response.statusCode === 0 && response.data) {
                setSelectedReviewDetail(response.data);
                setIsDetailModalOpen(true);
            } else {
                setDetailError(response.message || "리뷰 상세 정보를 불러오는 데 실패했습니다.");
            }
        } catch (err) {
            setDetailError("리뷰 상세 정보를 불러오는 중 오류가 발생했습니다.");
            console.error("리뷰 상세 정보 가져오기 실패:", err);
        } finally {
            setIsDetailLoading(false);
        }
    }, []);

    const handleCheckboxChange = (id) => {
        setSelectedIds(prev => {
            const newSelectedIds = new Set(prev);
            newSelectedIds.has(id) ? newSelectedIds.delete(id) : newSelectedIds.add(id);
            return newSelectedIds;
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(reviews.map((r) => r.reviewId)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const renderTableContent = () => {
        const colCount = 7; // 체크박스, 작성자, 리뷰 제목, 작성일, 별점, 상세보기, 삭제

        if (isLoading) {
            return (
                <tr>
                    <td colSpan={colCount}><LoadingSpinner /></td>
                </tr>
            );
        }
        if (error) {
            return (
                <tr>
                    <td colSpan={colCount}><ErrorDisplay message={error} /></td>
                </tr>
            );
        }
        if (reviews.length === 0) {
            return (
                <tr>
                    <td colSpan={colCount}>표시할 리뷰가 없습니다.</td>
                </tr>
            );
        }

        return reviews.map((item) => (
            <tr key={item.reviewId}>
                <td><input type="checkbox" checked={selectedIds.has(item.reviewId)} onChange={() => handleCheckboxChange(item.reviewId)} /></td>
                <td>{item.userName}</td>
                <td>{item.title}</td>
                <td>{item.createdAt}</td>
                <td>{"⭐".repeat(item.rating)}</td>
                <td><button className="detail-button" onClick={() => handleViewDetail(item.reviewId)}>상세보기</button></td>
                <td><button className="delete-button" onClick={() => handleDeleteReview(item.reviewId)}>삭제</button></td>
            </tr>
        ));
    };

    return (
        <div className="admin-page">
            <AdminSidebar />
            {/* main 태그에 사이드바 너비(200px)만큼 marginLeft를 적용합니다. */}
            <main className="review-content" style={{ marginLeft: '240px', padding: '20px' }}>
                <h2 style={{padding:'20px'}}> 리뷰 관리</h2>
                <div className="review-toolbar">
                    {/* SearchBar 컴포넌트 제거 (이전 요청에 따라) */}
                </div>
                <table className="review-table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" onChange={handleSelectAll} checked={!isLoading && reviews.length > 0 && selectedIds.size === reviews.length} /></th>
                            <th>작성자</th>
                            <th>리뷰 제목</th>
                            <th>작성일</th>
                            <th>별점</th>
                            <th>상세보기</th>
                            <th>삭제</th>
                        </tr>
                    </thead>
                    <tbody>{renderTableContent()}</tbody>
                </table>
                <div className="review-footer">
                    <button className="bulk-delete-button" onClick={handleBulkDelete} disabled={selectedIds.size === 0}>선택 삭제</button>
                    {/* 페이지네이션 UI */}
                    {!isLoading && !error && pagination.totalPages > 1 && (
                        <div className="pagination">
                            <button onClick={() => fetchReviews(pagination.currentPage - 1)} disabled={pagination.currentPage === 0}>이전</button>
                            <span>페이지 {pagination.currentPage + 1} / {pagination.totalPages}</span>
                            <button onClick={() => fetchReviews(pagination.currentPage + 1)} disabled={pagination.currentPage + 1 >= pagination.totalPages}>다음</button>
                        </div>
                    )}
                </div>
            </main>
            {isDetailModalOpen && (
                <ReviewDetailModal review={selectedReviewDetail} onClose={() => setIsDetailModalOpen(false)} />
            )}
            {isDetailLoading && <LoadingSpinner />}
            {detailError && <ErrorDisplay message={detailError} />}
        </div>
    );
};

export default ReviewManager;