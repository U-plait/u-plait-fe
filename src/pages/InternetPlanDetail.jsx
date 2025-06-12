import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../api/api';
import '../styles/PlanDetail.css';
import editIcon from '../assets/img/edit_button.png';
import trashIcon from '../assets/img/trashcan_button.png';
import dataIcon from '../assets/img/data_icon.png';

function InternetPlanDetail() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [lastReviewId, setLastReviewId] = useState(null);
  const [error, setError] = useState(null);
  const combineList = [1, 2];
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 리뷰 등록 로직 (API 호출 등)
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
        console.error("요금제 불러오기 실패:", err);
        setError("요금제 정보를 불러오는 중 오류가 발생했습니다.");
      });
  }, [planId]);

  useEffect(() => {
    const size = 5;
    api.get('/review/', {
      params: {
        planId,
        lastReviewId: null,
        size,
      }
    })
      .then(res => {
        const reviewList = res.data.data.reviewList;
        setReviews(reviewList);
        setHasNext(res.data.data.hasNext);
        if (reviewList.length > 0) {
          setLastReviewId(reviewList[reviewList.length - 1].reviewId);
        } else {
          setLastReviewId(null);
        }
      })
      .catch(err => {
        console.error("리뷰 불러오기 실패:", err);
      });
  }, [planId]);

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
        console.error("리뷰 더 불러오기 실패:", err);
      });
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!plan) return <div>로딩중...</div>;

  return (
    <div className="plan-detail">
      {/* 상단 요금제 카드 */}
      <div className="plan-card">
        <div className="wrap">
          <div className="plan-header">
            <div className="plan-title-box">
              <h2 className="plan-title">{plan.planName}</h2>
                <div className="plan-benefit">
                  <img
                    src={dataIcon}
                    alt="데이터 아이콘"
                    className="plan-benefit-icon"
                    width={20}
                    height={20}
                    style={{ verticalAlign: 'middle', marginRight: '8px' }}
                  />
                  속도 {plan.velocity}
                </div>
            </div>
            <div className="plan-price-box">
              <div className="plan-price-main">월 {plan.internetDiscount.toLocaleString()}원</div>
              <div className="plan-price-sub">
                원가 {plan.planPrice.toLocaleString()}원
              </div>
            </div>
          </div>

          <div className="plan-features">
            <div className="feature-card">
              <div className="feature-title-benefit">✨기본 혜택</div>
                <ul className="feature-value-benefit">
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
      <h3 className="benefit-title"><br/>할인 혜택</h3>
      {combineList.map((type, idx) => {
        if (type === 1) {
          return (
            <div className="discount-card" key={`combine-1-${idx}`}>
              <div className="discount-row">
                <div className="discount-title">가족결합할인</div>
                <div className="discount-divider" />
                <ul className="discount-desc">
                  <li>가족 결합 시 요금제에서 추가 할인을 받을 수 있습니다.</li>
                  <li>자세한 내용은 고객센터 또는 매장에서 확인해 주세요.</li>
                </ul>
              </div>
            </div>
          );
        }
        if (type === 2) {
          return (
            <div className="discount-card" key={`combine-2-${idx}`}>
              <div className="discount-row">
                <div className="discount-title">U+ 투게더 결합</div>
                <div className="discount-divider" />
                <ul className="discount-desc">
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
      <h3 className="benefit-title"><br/>리뷰</h3>
      
      {/* 리뷰 작성 form 칸 */}
      <div className="review-form-wrapper">
        {/* 폼은 항상 렌더링, inUse=false면 블러 처리 */}
        <form className={!plan.inUse ? "blurred" : ""} onSubmit={handleSubmit}>
          <div className="review-rating-input">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={i < reviewRating ? "star star-filled" : "star"}
                onClick={() => plan.inUse && setReviewRating(i + 1)}
                style={{ cursor: plan.inUse ? "pointer" : "not-allowed" }}
              >★</span>
            ))}
            <span className="rating-label">{reviewRating} / 5</span>
          </div>
          <input
            className="review-title-input"
            type="text"
            placeholder="리뷰 제목을 입력하세요"
            maxLength={40}
            disabled={!plan.inUse}
            value={reviewTitle}
            onChange={e => setReviewTitle(e.target.value)}
            required
          />
          <div className="review-text-input">
            <textarea
              className="review-textarea"
              placeholder="리뷰 본문을 입력하세요"
              disabled={!plan.inUse}
              value={reviewContent}
              onChange={e => setReviewContent(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit"
            className="review-submit"
            disabled={!plan.inUse}
          >
            작성
          </button>
        </form>

        {/* 경고문구도 폼 위에 */}
        {!plan.inUse && (
          <div className="review-warning">
            현재 해당 요금제 사용 중인 사용자만 작성 가능합니다.
          </div>
        )}
      </div>

      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <p className="review-empty">첫번째 리뷰어가 되어보세요!</p>
      ) : (
        <ul className="review-list">
          {reviews.map(({ reviewId, userName, title, content, rating, createdAt, author }) => (
            <li key={reviewId} className="review-item">
              <div className="review-row">
                <div className="review-title-rating">
                  <div className="review-title">{title}</div>
                  <div className="review-rating">
                    {Array.from({ length: 5 }).map((_, i) =>
                      <span key={i} className={i < rating ? "star star-filled" : "star"}>★</span>
                    )}
                  </div>
                </div>
                <div className="review-meta">
                  <div className="review-nickname">
                    {userName.length >= 2
                      ? userName[0] + '*' + userName.slice(2)
                      : userName}
                  </div>
                  <div className="review-date">{createdAt}</div>
                </div>
              </div>
              <div className="review-content">{content}</div>
              {author && (
                <div className="review-actions">
                  <button className="review-edit-btn" title="수정">
                    <img src={editIcon} alt="수정" width={20} height={20} />
                  </button>
                  <button className="review-delete-btn" title="삭제">
                    <img src={trashIcon} alt="삭제" width={20} height={20} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

      )}
      {hasNext && (
        <button className="review-more-btn" onClick={handleLoadMore}>
          더 보기
        </button>
      )}
    </div>
  );
}

export default InternetPlanDetail;
