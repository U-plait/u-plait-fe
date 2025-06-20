import styles from "../styles/MobileCard.module.css";
import { Link } from "react-router-dom";
import callIcon from "../assets/img/call_icon.png";
import messageIcon from "../assets/img/message_icon.png";
import dataIcon from "../assets/img/data_icon.png";

const MobileCard = ({ plan, isFavorite, toggleFavorite, lastPlanRef }) => {
  return (
    <div className={styles["mcard-card-wrapper"]}>
      <div className={styles["mcard-plan-card"]} ref={lastPlanRef}>
        {/* 즐겨찾기 버튼 */}
        <button
          className={`${styles["mcard-favorite-button"]} ${isFavorite ? styles["mcard-active"] : ""}`}
          onClick={() => toggleFavorite(plan.planId)}
          aria-label="즐겨찾기"
        >
          ★
        </button>
        <div className={styles["mcard-card-inner"]}>
          {/* 왼쪽: 이름 + 버튼 */}
          <div className={styles["mcard-card-left"]}>
            <div className={styles["mcard-plan-name"]}>{plan.planName}</div>
            <Link
              to={`/mobile/plan/${plan.planId}`}
              className={styles["mcard-plan-detail-button"]}
            >
              상세보기
            </Link>
          </div>
          {/* 오른쪽: 가격, 할인, 정보 */}
          <div className={styles["mcard-card-right"]}>
            <div className={styles["mcard-price-block"]}>
              <div className={styles["mcard-plan-price"]}>
                월 {plan.planPrice.toLocaleString()}원
              </div>
              <div className={styles["mcard-plan-discount-price"]}>
                할인 적용 시 월 {(plan.planPrice * (100 - plan.durationDiscountRate) / 100 - plan.premierDiscountRate).toLocaleString()}원
              </div>
            </div>
            <div className={styles["mcard-default-info"]}>
              <div>
                <img src={dataIcon} alt="데이터" />
                <span>{plan.data}</span>
              </div>
              <div>
                <img src={callIcon} alt="전화" />
                <span>{plan.voiceCall}</span>
              </div>
              <div>
                <img src={messageIcon} alt="메시지" />
                <span>{plan.message}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCard;
