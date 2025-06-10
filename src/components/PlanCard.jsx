import React from "react";
import "../styles/PlanManager.css";

const PlanCard = ({ title, price, benefits }) => {
    return (
        <div className="plan-card">
            <input type="checkbox" className="plan-checkbox" />
            <h4>{title}</h4>
            <p>{price}</p>
            <ul>
                {benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                ))}
            </ul>
            <div className="plan-buttons">
                <button className="edit">수정</button>
                <button className="delete">삭제</button>
            </div>
        </div>
    );
};

export default PlanCard;