import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../api/api';
import '../styles/PlanDetail.css';
import editIcon from '../assets/img/edit_button.png';
import trashIcon from '../assets/img/trashcan_button.png';
import tvicon from '../assets/img/tv_icon.png';

function IPTVPlanDetail() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [lastReviewId, setLastReviewId] = useState(null);
  const [error, setError] = useState(null);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');

  // 수정 상태 관리
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(0);

  // 모달 상태
  const [pdShowModal, setPdShowModal] = useState(false);
  const [pdModalMessage, setPdModalMessage] = useState('');

  // 리뷰 목록을 새로 가져오는 함수
  const fetchReviews = async () => {
    const size = 5;
    try {
      const res = await api.get('/review/', {
        params: {
          planId,
          lastReviewId: null,
          size,
        }
      });
      const reviewList = res.data.data.reviewList;
      setReviews(reviewList);
      setHasNext(res.data.data.hasNext);
      if (reviewList.length > 0) {
        setLastReviewId(reviewList[reviewList.length - 1].reviewId);
      } else {
        setLastReviewId(null);
      }
    } catch (err) {
      // 에러 처리 필요시 추가
    }
  };

  // 리뷰 더 불러오기
  const handleLoadMore = () => {
    const size = 5;
    api.get('/review/', {
      params: {
        planId,
        lastReviewId,
        size,
      }
    })
      .then(res => {
        const newReviews = res.data.data.reviewList;
        setReviews(prev => [...prev, ...newReviews]);
        setHasNext(res.data.data.hasNext);
        if (newReviews.length > 0) {
          setLastReviewId(newReviews[newReviews.length - 1].reviewId);
        }
      })
      .catch(err => {
        // 에러 처리 필요시 추가
      });
  };

  // 리뷰 삭제 함수
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/review/${reviewId}`);
      fetchReviews();
    } catch (err) {
      // 에러 처리 필요시 추가
    }
  };

  // 리뷰 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/review/', {
        planId: Number(planId),
        title: reviewTitle,
        content: reviewContent,
        rating: reviewRating
      });
      setReviewTitle('');
      setReviewContent('');
      setReviewRating(0);
      fetchReviews();
    } catch (err) {
      if (err.response?.data?.statusCode === 6002) {
        setPdModalMessage("리뷰에 부적절한 단어가 포함되어 있어 등록할 수 없습니다.");
        setPdShowModal(true);
      } else {
        setPdModalMessage("리뷰 등록 중 오류가 발생했습니다.");
        setPdShowModal(true);
      }
    }
  };

  // 리뷰 수정 진입
  const handleEditClick = (review) => {
    setEditingReviewId(review.reviewId);
    setEditTitle(review.title);
    setEditContent(review.content);
    setEditRating(review.rating);
  };

  // 리뷰 수정 저장
  const handleEditSave = async (reviewId) => {
    try {
      await api.put("/review/update", {
        reviewId,
        title: editTitle,
        content: editContent,
        rating: editRating,
      });
      setEditingReviewId(null);
      fetchReviews();
    } catch (err) {
      if (err.response?.data?.statusCode === 6002) {
        setPdModalMessage("리뷰에 부적절한 단어가 포함되어 있어 등록할 수 없습니다.");
        setPdShowModal(true);
      } else {
        setPdModalMessage("리뷰 수정 중 오류가 발생했습니다.");
        setPdShowModal(true);
      }
    }
  };

  // 리뷰 수정 취소
  const handleEditCancel = () => {
    setEditingReviewId(null);
  };

  useEffect(() => {
    api.get(`/plan/${planId}`)
      .then(res => {
        const { statusCode, data } = res.data;
        if (statusCode !== 0) {
          setError("요금제 정보를 찾을 수 없습니다.");
          return;
        }
        setPlan(data);
      })
      .catch(err => {
        setError("요금제 정보를 불러오는 중 오류가 발생했습니다.");
      });
  }, [planId]);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [planId]);

  if (error) return <div className="pd-error-message">{error}</div>;
  if (!plan) return <div>로딩중...</div>;

  return (
    <div className="pd-plan-detail">
      {/* 상단 요금제 카드 */}
      <div className="pd-plan-card">
        <div className="pd-wrap">
          <div className="pd-plan-header">
            <div className="pd-plan-title-box">
              <h2 className="pd-plan-title">{plan.planName}</h2>
              <div className="pd-plan-benefit">
                <img
                  src={tvicon}
                  alt="tv 아이콘"
                  className="pd-plan-benefit-icon"
                  width={20}
                  height={20}
                  style={{ verticalAlign: 'middle', marginRight: '8px' }}
                />
                채널 {plan.channel}개 제공
              </div>
            </div>
            <div className="pd-plan-price-box">
              <div className="pd-plan-price-main">
                월 {plan.iptvDiscount !== 0 ? plan.iptvDiscount.toLocaleString() : plan.planPrice.toLocaleString()}원
              </div>
              {plan.iptvDiscount !== 0 && (
                <div className="pd-plan-price-sub">
                  원가 {plan.planPrice.toLocaleString()}원
                </div>
              )}
            </div>
          </div>

          <div className="pd-plan-features">
            <div className="pd-feature-card">
              <div className="pd-feature-title-benefit">✨기본 혜택</div>
              <ul className="pd-feature-value-benefit">
                {plan.planBenefit
                  .split('+')
                  .map((item, idx) => (
                    <li key={idx}>{item.trim()}</li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 할인 혜택 */}
      <h3 className="pd-benefit-title"><br />할인 혜택</h3>
      {plan.communityIdList.map((type, idx) => {
        if (type === 1) {
          return (
            <div className="pd-discount-card" key={`combine-1-${idx}`}>
              <div className="pd-discount-row">
                <div className="pd-discount-title">가족결합할인</div>
                <div className="pd-discount-divider" />
                <ul className="pd-discount-desc">
                  <li>가족 결합 시 요금제에서 추가 할인을 받을 수 있습니다.</li>
                  <li>자세한 내용은 고객센터 또는 매장에서 확인해 주세요.</li>
                </ul>
              </div>
            </div>
          );
        }
        if (type === 2) {
          return (
            <div className="pd-discount-card" key={`combine-2-${idx}`}>
              <div className="pd-discount-row">
                <div className="pd-discount-title">U+ 투게더 결합</div>
                <div className="pd-discount-divider" />
                <ul className="pd-discount-desc">
                  <li>U+ 휴대폰을 쓰는 친구, 가족과 결합 시 요금제를 더 저렴하게 이용할 수 있습니다.</li>
                  <li>만 18세 이하 청소년은 매달 추가 할인을 받을 수 있습니다.</li>
                </ul>
              </div>
            </div>
          );
        }
        return null;
      })}

      {/* 리뷰 섹션 */}
      <h3 className="pd-benefit-title"><br />리뷰</h3>
      <div className="pd-review-form-wrapper">
        <form className={!plan.inUse ? "pd-blurred" : ""} onSubmit={handleSubmit}>
          <div className="pd-review-rating-input">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < reviewRating ? "pd-star pd-star-filled" : "pd-star"}
                onClick={() => plan.inUse && setReviewRating(i + 1)}
                style={{ cursor: plan.inUse ? "pointer" : "not-allowed" }}
              >★</span>
            ))}
            <span className="pd-rating-label">{reviewRating} / 5</span>
          </div>
          <input
            className="pd-review-title-input"
            type="text"
            placeholder="리뷰 제목을 입력하세요"
            maxLength={40}
            disabled={!plan.inUse}
            value={reviewTitle}
            onChange={e => setReviewTitle(e.target.value)}
            required
          />
          <div className="pd-review-text-input">
            <textarea
              className="pd-review-textarea"
              placeholder="리뷰 본문을 입력하세요"
              disabled={!plan.inUse}
              value={reviewContent}
              onChange={e => setReviewContent(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="pd-review-submit"
            disabled={!plan.inUse}
          >
            작성
          </button>
        </form>
        {!plan.inUse && (
          <div className="pd-review-warning">
            현재 해당 요금제 사용 중인 사용자만 작성 가능합니다.
          </div>
        )}
      </div>
      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <p className="pd-review-empty">첫번째 리뷰어가 되어보세요!</p>
      ) : (
        <ul className="pd-review-list">
          {reviews.map(({ reviewId, userName, title, content, rating, createdAt, author }) => (
            <li
              key={reviewId}
              className={
                `pd-review-item${editingReviewId === reviewId ? ' pd-review-item-editing' : ''}`
              }
            >
              <div className="pd-review-row">
                <div className="pd-review-title-rating">
                  {editingReviewId === reviewId ? (
                    <>
                      <input
                        className="pd-review-title-input-edit"
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        maxLength={40}
                        required
                      />
                      <div className="pd-review-rating-input">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={i < editRating ? "pd-star pd-star-filled" : "pd-star"}
                            onClick={() => setEditRating(i + 1)}
                            style={{ cursor: "pointer" }}
                          >★</span>
                        ))}
                        <span className="pd-rating-label">{editRating} / 5</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="pd-review-title">{title}</div>
                      <div className="pd-review-rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < rating ? "pd-star pd-star-filled" : "pd-star"}>★</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="pd-review-meta">
                  <div className="pd-review-nickname">
                    {userName.length === 2
                      ? userName[0] + '*'
                      : userName.length > 2
                        ? userName[0] + '*' + userName.slice(2)
                        : userName}
                  </div>
                  <div className="pd-review-date">{createdAt}</div>
                </div>
              </div>
              <div className="pd-review-content">
                {editingReviewId === reviewId ? (
                  <textarea
                    className="pd-review-textarea"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    required
                  />
                ) : (
                  content
                )}
              </div>
              {author && (
                <div className="pd-review-actions">
                  {editingReviewId === reviewId ? (
                    <>
                      <button
                        className="pd-review-edit-btn"
                        onClick={() => handleEditSave(reviewId)}
                        title="저장"
                        type="button"
                      >
                        저장
                      </button>
                      <button
                        className="pd-review-edit-btn"
                        onClick={handleEditCancel}
                        title="취소"
                        type="button"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <div className="pd-buttons">
                      <button
                        className="pd-review-edit-btn"
                        title="수정"
                        onClick={() => handleEditClick({ reviewId, title, content, rating })}
                        type="button"
                      >
                        <img src={editIcon} alt="수정" width={20} height={20} />
                      </button>
                      <button
                        className="pd-review-delete-btn"
                        title="삭제"
                        onClick={() => handleDeleteReview(reviewId)}
                        type="button"
                      >
                        <img src={trashIcon} alt="삭제" width={20} height={20} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {hasNext && (
        <button className="pd-review-more-btn" onClick={handleLoadMore}>
          더 보기
        </button>
      )}

      {/* 모달 */}
      {pdShowModal && (
        <div className="pd-modal-overlay" onClick={() => setPdShowModal(false)}>
          <div
            className="pd-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="pd-modal-message">
              {pdModalMessage}
            </div>
            <button
              className="pd-modal-close-btn"
              onClick={() => setPdShowModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default IPTVPlanDetail;
