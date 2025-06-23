import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import "../styles/PlanDetail.css";
import editIcon from "../assets/img/edit_button.png";
import trashIcon from "../assets/img/trashcan_button.png";
import ailandIcon from "../assets/img/ailand_icon.png";
import genieIcon from "../assets/img/genie_icon.png";
import millieIcon from "../assets/img/millie_icon.png";
import uplayIcon from "../assets/img/uplay_icon.png";
import vibeIcon from "../assets/img/vibe_icon.png";
import prem1 from "../assets/img/phone_change.png";
import prem2 from "../assets/img/samsung.png";
import prem3 from "../assets/img/tving.png";
import prem4 from "../assets/img/disney_plus.png";
import prem5 from "../assets/img/netflix.png";
import prem6 from "../assets/img/hello_rental.png";
import prem7 from "../assets/img/coffee.png";
import prem8 from "../assets/img/smarthome1.png";
import prem9 from "../assets/img/smarthome2.png";
import prem10 from "../assets/img/shinhan.png";
import prem11 from "../assets/img/youtube_premium.png";
import prem12 from "../assets/img/multipack.png";

function MobilePlanDetail() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [hasNext, setHasNext] = useState(false);
  const [lastReviewId, setLastReviewId] = useState(null);
  const [error, setError] = useState(null);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [premiumPage, setPremiumPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    api
      .get(`/plan/${planId}`)
      .then((res) => {
        const { statusCode, data } = res.data;

        if (statusCode !== 0) {
          setError("요금제 정보를 찾을 수 없습니다.");
          return;
        }

        setPlan(data);
      })
      .catch((err) => {
        console.error("요금제 불러오기 실패:", err);
        setError("요금제 정보를 불러오는 중 오류가 발생했습니다.");
      });
  }, [planId]);

  // 리뷰 목록 fetch
  const fetchReviews = () => {
    const size = 5;
    api
      .get("/review/", {
        params: {
          planId,
          lastReviewId: null,
          size,
        },
      })
      .then((res) => {
        const reviewList = res.data.data.reviewList;
        setReviews(reviewList);
        setHasNext(res.data.data.hasNext);
        if (reviewList.length > 0) {
          setLastReviewId(reviewList[reviewList.length - 1].reviewId);
        } else {
          setLastReviewId(null);
        }
      })
      .catch((err) => {
        console.error("리뷰 불러오기 실패:", err);
      });
  };

  // 리뷰 더 불러오기
  const handleLoadMore = () => {
    const size = 5;
    api
      .get("/review/", {
        params: {
          planId,
          lastReviewId,
          size,
        },
      })
      .then((res) => {
        const newReviews = res.data.data.reviewList;
        setReviews((prev) => [...prev, ...newReviews]);
        setHasNext(res.data.data.hasNext);
        if (newReviews.length > 0) {
          setLastReviewId(newReviews[newReviews.length - 1].reviewId);
        }
      })
      .catch((err) => {
        console.error("리뷰 더 불러오기 실패:", err);
      });
  };

  // 리뷰 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/review/", {
        planId: Number(planId),
        title: reviewTitle,
        content: reviewContent,
        rating: reviewRating,
      });
      setReviewTitle("");
      setReviewContent("");
      setReviewRating(0);
      fetchReviews();
    } catch (err) {
      console.error("리뷰 등록 실패:", err);
    }
  };

  // 리뷰 삭제
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/review/${reviewId}`);
      fetchReviews();
    } catch (err) {
      console.error("리뷰 삭제 실패:", err);
    }
  };

  // 리뷰 수정 진입
  const handleEditClick = (review) => {
    setEditingReviewId(review.reviewId);
    setEditTitle(review.title);
    setEditContent(review.content);
    setEditRating(review.rating);
  };

  const handleEditSave = async (reviewId) => {
    if (!window.confirm("수정을 완료하시겠습니까?")) return;
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
      console.error("리뷰 수정 실패:", err);
    }
  };

  // 리뷰 수정 취소
  const handleEditCancel = () => {
    setEditingReviewId(null);
  };

  useEffect(() => {
    api
      .get(`/plan/${planId}`)
      .then((res) => {
        const { statusCode, data } = res.data;
        if (statusCode !== 0) {
          setError("요금제 정보를 찾을 수 없습니다.");
          return;
        }
        setPlan(data);
      })
      .catch((err) => {
        console.error("요금제 불러오기 실패:", err);
        setError("요금제 정보를 불러오는 중 오류가 발생했습니다.");
      });
  }, [planId]);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [planId]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerPage(1); // 모바일
      } else if (width < 1024) {
        setItemsPerPage(2); // 태블릿
      } else if (width < 1500) {
        setItemsPerPage(3); // 작은 데스크톱
      } else {
        setItemsPerPage(4); // 큰 데스크톱
      }
    };

    handleResize(); // 초기 설정
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const MediaBox = ({ icon, title, desc }) => (
    <div className="pd-media-box">
      <div className="pd-media-icon">{icon}</div>
      <h5 className="pd-media-title">{title}</h5>
      <p className="pd-media-desc">{desc}</p>
    </div>
  );

  const PremMediaBox = ({ icon, title, desc }) => (
    <div className="pd-prem-media-box">
      <div className="pd-media-icon">{icon}</div>
      <h5 className="pd-media-title">{title}</h5>
      <p className="pd-media-desc">{desc}</p>
    </div>
  );

  const premieritems = [
    {
      icon: <img src={prem1} alt="삭제" width={160} height={100} />,
      title: "폰교체 패스",
      desc: "휴대폰이 파손됐을 때\n수리 또는 교체 중 원하는 방식을\n선택할 수 있는 폰케어 서비스",
    },
    {
      icon: <img src={prem2} alt="삭제" width={160} height={100} />,
      title: "삼성팩",
      desc: "삼성 디바이스 할부금 할인\n삼성팩 대신 다른 카테고리 팩 선택 가능",
    },
    {
      icon: <img src={prem3} alt="삭제" width={160} height={100} />,
      title: "티빙 이용권 할인",
      desc: "유독에서 '티빙 이용권(U+ 요금제 전용)'\n가입 시 티빙 이용권 매달 9,500원 할인",
    },
    {
      icon: <img src={prem4} alt="삭제" width={160} height={100} />,
      title: "디즈니+",
      desc: "요금이 U+통신료와 함께 청구되기 때문에\n결제 정보를 따로 입력할 필요가 없는\n디즈니+ 서비스",
    },
    {
      icon: <img src={prem5} alt="삭제" width={160} height={100} />,
      title: "넷플릭스",
      desc: "U+통신료와 한번에 결제하여\n신용카드 정보를 등록할 필요없이\n편리하게 넷플릭스를 이용 가능한 서비스",
    },
    {
      icon: <img src={prem6} alt="삭제" width={160} height={100} />,
      title: "헬로렌탈 구독",
      desc: "LG헬로렌탈 월 이용요금 8,000원 할인 제공\n헬로렌탈 구독팩 대신\n다른 카테고리 팩 선택 가능",
    },
    {
      icon: <img src={prem7} alt="삭제" width={160} height={100} />,
      title: "일리커피 구독",
      desc: "일리 커피 구독 팩을 무료로 이용 가능\n일리 커피 구독 팩 대신\n다른 카테고리 팩 선택 가능",
    },
    {
      icon: <img src={prem8} alt="삭제" width={160} height={100} />,
      title: "우리집지킴이 Easy2+",
      desc: "해킹 차단 보안 칩이 내장된 맘카와 각종 보안 \n센서로 우리집을 지키고 도난/화재 보험 혜택을 \n누릴 수 있는 스마트홈 패키지",
    },
    {
      icon: <img src={prem9} alt="삭제" width={160} height={100} />,
      title: "우리집돌봄이 Kids",
      desc: "초고화질의 프리미엄 홈 CCTV 1대\n화재/가전/가구 파손 보험을\n이용할 수 있는 스마트홈 패키지",
    },
    {
      icon: <img src={prem10} alt="삭제" width={160} height={100} />,
      title: "신한카드 Air",
      desc: "'LG U+ SKYPASS 신한카드'로 통신요금 \n자동이체 설정하면 매달 대한항공 마일리지 적립,\n여행 특화 혜택 등을 받을 수 있는 혜택",
    },
    {
      icon: <img src={prem11} alt="삭제" width={160} height={100} />,
      title: "유튜브 프리미엄 할인",
      desc: "유독에서 '유튜브 프리미엄(U+ 요금제 전용)'\n가입 시, 매달 구독료를 할인 받아\n유튜브 프리미엄 이용 가능\n(월 4,450원 추가 청구)",
    },
    {
      icon: <img src={prem12} alt="삭제" width={160} height={100} />,
      title: "멀티팩",
      desc: "프리미엄 서비스 대신 미디어 서비스 4개\n(아이들나라 스탠다드+러닝, 바이브 음악감상,\n지니뮤직 음악감상, 밀리의 서재) \n중 3개 선택 가능",
    },
  ];

  const basicitems = [
    {
      icon: <img src={ailandIcon} alt="삭제" width={60} height={60} />,
      title: "아이들나라 스탠다드+러닝",
      desc: "검증된 학습 콘텐츠와 유아동 베스트셀러 등\n2만여 편의 아이들나라 콘텐츠를\n앱으로 만나볼 수 있는 서비스",
    },
    {
      icon: <img src={vibeIcon} alt="삭제" width={60} height={60} />,
      title: "바이브 300회 음악감상",
      desc: "기존에 없던 새로운 오디오 경험과\n취향에 맞는 음악을 제공하는 뮤직 앱",
    },
    {
      icon: <img src={uplayIcon} alt="삭제" width={60} height={60} />,
      title: "유플레이",
      desc: "최신 영화, OTT 오리지널 콘텐츠 등\n8만여 편의 콘텐츠를 볼 수 있는 서비스",
    },
    {
      icon: <img src={genieIcon} alt="삭제" width={60} height={60} />,
      title: "지니뮤직 300회 음악감상",
      desc: "지니뮤직 앱과 홈페이지에서 좋아하는 음악을\n월 300회 감상할 수 있는 서비스",
    },
    {
      icon: <img src={millieIcon} alt="삭제" width={60} height={60} />,
      title: "밀리의 서재",
      desc: "독서 컨텐츠를 언제 어디서나\n무제한으로 즐길 수 있는\n국내 최대 독서 플랫폼 서비스",
    },
  ];

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
              <div className="pd-plan-benefit">{plan.description}</div>
            </div>
            <div className="pd-plan-price-box">
              <div className="pd-plan-price-main">
                월 {plan.planPrice.toLocaleString()}원
              </div>
              <div className="pd-plan-price-sub">
                약정 할인 시 월{" "}
                {(
                  (plan.planPrice * (100 - plan.durationDiscountRate)) / 100 -
                  plan.premierDiscountRate
                ).toLocaleString()}
                원
              </div>
            </div>
          </div>

          <div className="pd-plan-features">
            <div className="pd-feature-card">
              <div className="pd-feature-title">데이터</div>
              <div className="pd-feature-value">{plan.data}</div>
              {plan.extraData !== "없음" && (
                <div className="pd-feature-value">다 쓰면 {plan.extraData}</div>
              )}
            </div>
            <div className="pd-feature-card">
              <div className="pd-feature-title">공유 데이터</div>
              <div className="pd-feature-value">{plan.sharedData}</div>
            </div>
            <div className="pd-feature-card">
              <div className="pd-feature-title">음성통화</div>
              <div className="pd-feature-value">{plan.voiceCall}</div>
            </div>
            <div className="pd-feature-card">
              <div className="pd-feature-title">문자메시지</div>
              <div className="pd-feature-value">{plan.message}</div>
            </div>
            <div className="pd-feature-card">
              <div className="pd-feature-title">기타혜택</div>
              <div className="pd-feature-value">
                {plan.planBenefit.split(",").map((item, idx) => (
                  <span key={idx}>
                    {item.trim()}
                    <br />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 요금제 가입 혜택 */}
      {plan.mediaBenefit !== "NONE" && (
        <div className="pd-margin">
          <h3 className="pd-benefit-title">
            <br />
            요금제 가입 혜택
          </h3>
          <div className="pd-plan-benefits">
            <h4 className="pd-benefit-subtitle">기본 혜택</h4>
            <p className="pd-benefit-label">미디어 서비스 기본 제공 (택 1)</p>
            <div className="pd-media-boxes">
              {basicitems.map((item, idx) => (
                <MediaBox
                  key={idx}
                  icon={item.icon}
                  title={item.title}
                  desc={item.desc}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {plan.mediaBenefit === "PREMIUM" && (
        <div className="pd-margin">
          <div className="pd-plan-benefits">
            <h4 className="pd-benefit-subtitle">특별 혜택</h4>
            <div className="pd-benefit-label">
              프리미엄 서비스 기본 제공 (택 1)
            </div>

            {/* 슬라이더 */}
            <div className="pd-premium-slider">
              <button
                className="pd-slider-arrow-button"
                onClick={() => setPremiumPage((p) => Math.max(p - 1, 0))}
                disabled={premiumPage === 0}
              >
                ◀
              </button>

              <div className="pd-prim-media-boxes">
                {premieritems
                  .slice(
                    premiumPage * itemsPerPage,
                    premiumPage * itemsPerPage + itemsPerPage
                  )
                  .map((item, idx) => (
                    <PremMediaBox
                      key={idx}
                      icon={item.icon}
                      title={item.title}
                      desc={item.desc}
                    />
                  ))}
              </div>

              <button
                className="pd-slider-arrow-button"
                onClick={() =>
                  setPremiumPage((p) =>
                    p < Math.ceil(premieritems.length / itemsPerPage) - 1
                      ? p + 1
                      : p
                  )
                }
                disabled={
                  premiumPage >=
                  Math.ceil(premieritems.length / itemsPerPage) - 1
                }
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 할인 혜택 */}
      <h3 className="pd-benefit-title">
        <br />
        할인 혜택
      </h3>
      {plan.premierDiscountRate !== 0 && (
        <div className="pd-discount-card">
          <div className="pd-discount-row">
            <div className="pd-discount-title">프리미어 요금제 약정할인</div>
            <div className="pd-discount-divider" />
            <ul className="pd-discount-desc">
              <li>
                약정 기간 24개월 동안 통신요금을 매달 5,250원 추가 할인 받을 수
                있어요.
              </li>
              <li>
                LG유플러스 매장 또는 고객센터 114(무료)에서 별도 신청 필요
              </li>
            </ul>
          </div>
        </div>
      )}
      {plan.communityIdList.map((type, idx) => {
        if (type === 1) {
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
        if (type === 2) {
          return (
            <div className="pd-discount-card" key={`combine-1-${idx}`}>
              <div className="pd-discount-row">
                <div className="pd-discount-title">가족결합할인</div>
                <div className="pd-discount-divider" />
                <ul className="pd-discount-desc">
                  <li>
                    U+ 휴대폰을 쓰는 친구, 가족과 결합 시 요금제를 더 저렴하게
                    이용할 수 있습니다.
                  </li>
                  <li>
                    만 18세 이하 청소년은 매달 추가 할인을 받을 수 있습니다.
                  </li>
                </ul>
              </div>
            </div>
          );
        }
        return null;
      })}

      {/* 리뷰 섹션 */}
      <h3 className="pd-benefit-title">
        <br />
        리뷰
      </h3>
      <div className="pd-review-form-wrapper">
        <form
          className={!plan.inUse ? "pd-blurred" : ""}
          onSubmit={handleSubmit}
        >
          <div className="pd-review-rating-input">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={
                  i < reviewRating ? "pd-star pd-star-filled" : "pd-star"
                }
                onClick={() => plan.inUse && setReviewRating(i + 1)}
                style={{ cursor: plan.inUse ? "pointer" : "not-allowed" }}
              >
                ★
              </span>
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
            onChange={(e) => setReviewTitle(e.target.value)}
            required
          />
          <div className="pd-review-text-input">
            <textarea
              className="pd-review-textarea"
              placeholder="리뷰 본문을 입력하세요"
              disabled={!plan.inUse}
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
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
                      onChange={(e) => setEditContent(e.target.value)}
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
                          onClick={() =>
                            handleEditClick({
                              reviewId,
                              title,
                              content,
                              rating,
                            })
                          }
                          type="button"
                        >
                          <img
                            src={editIcon}
                            alt="수정"
                            width={20}
                            height={20}
                          />
                        </button>
                        <button
                          className="pd-review-delete-btn"
                          title="삭제"
                          onClick={() => handleDeleteReview(reviewId)}
                          type="button"
                        >
                          <img
                            src={trashIcon}
                            alt="삭제"
                            width={20}
                            height={20}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            )
          )}
        </ul>
      )}
      {hasNext && (
        <button className="pd-review-more-btn" onClick={handleLoadMore}>
          더 보기
        </button>
      )}
    </div>
  );
}

export default MobilePlanDetail;
