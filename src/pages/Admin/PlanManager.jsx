import React from "react";
import AdminSidebar from "../../components/AdminSidebar";
import PlanCard from "../../components/PlanCard";
import SearchBar from "../../components/SearchBar";
import "../../styles/PlanManager.css";

const dummyPlans = Array(8).fill({
    title: "더미 데이터 요금제",
    price: "월 17,000원",
    benefits: ["혜택 정보1", "혜택 정보2", "혜택 정보3"],
});

const PlanManager = () => {
    return (
        <div className="admin-page">
            <AdminSidebar />
            <div className="plan-content">
                <h1>요금제 관리</h1>

                <div className="plan-toolbar">
                    <div className="left-toolbar">
                        <SearchBar />
                        <div className="tab-bar">
                            {["모바일", "인터넷", "IPTV"].map((t) => (
                                <button key={t} className="tab">
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        className="add-plan-button"
                        onClick={() => alert("요금제 추가 클릭됨")}
                    >
                        요금제 추가
                    </button>
                </div>

                <div className="plan-grid">
                    {dummyPlans.map((plan, index) => (
                        <PlanCard key={index} {...plan} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlanManager;
