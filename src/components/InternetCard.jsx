import styles from "../styles/InternetCard.module.css";
import { Link } from "react-router-dom";
import dataIcon from "../assets/img/data_icon.png";

const InternetCard = ({ plan, isFavorite, toggleFavorite, lastPlanRef }) => {
  return (
    <div className={styles["icard-card-wrapper"]}>
      <div className={styles["icard-plan-card"]} ref={lastPlanRef}>
        {/* 즐겨찾기 버튼 */}
        <button
          className={`${styles["icard-favorite-button"]} ${
            isFavorite ? styles["icard-active"] : ""
          }`}
          onClick={() => toggleFavorite(plan.planId)}
          aria-label="즐겨찾기">
          ★
        </button>
        <div className={styles["icard-card-inner"]}>
          {/* 왼쪽: 이름 + 버튼 */}
          <div className={styles["icard-card-left"]}>
            {typeof plan.internetDiscount === "number" &&
              plan.internetDiscount !== 0 && (
                <div className={styles["icard-discount-badge"]}>
                  온라인 단독 할인
                </div>
              )}
            <div className={styles["icard-plan-name"]}>{plan.planName}</div>
            <div className={styles["icard-plan-description"]}>
              {plan.description}
            </div>
            <div className={styles["icard-default-info"]}>
              <img src={dataIcon} alt="데이터" />
              <span>최대 {plan.velocity} 속도</span>
            </div>
          </div>
          {/* 오른쪽: 가격, 할인, 정보 */}
          <div className={styles["icard-card-right"]}>
            <div className={styles["icard-price-block"]}>
              <div className={styles["icard-plan-price"]}>
                월{" "}
                {(typeof plan.internetDiscount === "number" &&
                plan.internetDiscount !== 0
                  ? plan.internetDiscount
                  : plan.planPrice
                )?.toLocaleString()}
                원
              </div>
              {typeof plan.internetDiscount === "number" &&
                plan.internetDiscount !== 0 &&
                typeof plan.planPrice === "number" && (
                  <div className={styles["icard-plan-discount-price"]}>
                    원가 {plan.planPrice.toLocaleString()}원
                  </div>
                )}
            </div>
            <Link
              to={`/internet/plan/${plan.planId}`}
              className={styles["icard-plan-detail-button"]}>
              상세보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternetCard;
