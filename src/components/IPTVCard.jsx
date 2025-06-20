import styles from "../styles/IPTVCard.module.css";
import { Link } from "react-router-dom";
import tvIcon from "../assets/img/tv_icon.png";

const IPTVCard = ({ plan, isFavorite, toggleFavorite, lastPlanRef }) => {
  return (
    <div className={styles["iptv-card-wrapper"]}>
      <div className={styles["iptv-plan-card"]} ref={lastPlanRef}>
        {/* 즐겨찾기 버튼 */}
        <button
          className={`${styles["iptv-favorite-button"]} ${
            isFavorite ? styles["iptv-active"] : ""
          }`}
          onClick={() => toggleFavorite(plan.planId)}
          aria-label="즐겨찾기">
          ★
        </button>
        <div className={styles["iptv-card-inner"]}>
          {/* 왼쪽: 이름 + 버튼 */}
          <div className={styles["iptv-card-left"]}>
            {typeof plan.iptvDiscount === "number" &&
              plan.iptvDiscount !== 0 && (
                <div className={styles["iptv-discount-badge"]}>
                  온라인 단독 할인
                </div>
              )}
            <div className={styles["iptv-plan-name"]}>{plan.planName}</div>
              <div className={styles["iptv-plan-description"]}>
                {plan.description?.split('\n')[0]}
              </div>
            <div className={styles["iptv-default-info"]}>
              <img src={tvIcon} alt="채널" />
              <span>{plan.channel}개 채널 제공</span>
            </div>
          </div>
          {/* 오른쪽: 가격, 할인, 정보 */}
          <div className={styles["iptv-card-right"]}>
            <div className={styles["iptv-price-block"]}>
              <div className={styles["iptv-plan-price"]}>
                월{" "}
                {(typeof plan.iptvDiscount === "number" &&
                plan.iptvDiscount !== 0
                  ? plan.iptvDiscount
                  : plan.planPrice
                )?.toLocaleString()}
                원
              </div>
              {typeof plan.iptvDiscount === "number" &&
                plan.iptvDiscount !== 0 &&
                typeof plan.planPrice === "number" && (
                  <div className={styles["iptv-plan-discount-price"]}>
                    원가 {plan.planPrice.toLocaleString()}원
                  </div>
                )}
            </div>
            <Link
              to={`/iptv/plan/${plan.planId}`}
              className={styles["iptv-plan-detail-button"]}>
              상세보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPTVCard;
