import {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "../styles/Mypage.css";

const Mypage = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        axios
            .get("/user/detail", { withCredentials: true })
            .then((res) => setUserInfo(res.data.data))
            .catch((err) => console.error("마이페이지 정보 불러오기 실패:", err));
    }, []);

    const formatGender = (gender) => {
        if (gender === "MALE") return "남성";
        if (gender === "FEMALE") return "여성";
        return "기타";
    };

    const navigate = useNavigate();

    return (
        <div className="mypage-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="side-menu">User Menu</div>
                <nav className="menu">
                    <button className="menu-item active">👤 User profile</button>
                    <button
                        className="menu-item"
                        onClick={() => navigate('/myreviews')}
                    >
                        💬 Reviews
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <h1 className="page-title">마이페이지</h1>

                <section className="profile-card">
                    {userInfo ? (
                        <>
                            <ul className="info-list">
                                <InfoItem label="이름" value={userInfo.name} />
                                <InfoItem label="핸드폰 번호" value={userInfo.phoneNumber} />
                                <InfoItem label="이메일" value={userInfo.email} />
                                <InfoItem label="나이" value={`${userInfo.age}세`} />
                                <InfoItem label="성별" value={formatGender(userInfo.gender)} />
                                <InfoItem label="광고 수신 동의" value={userInfo.adAgree ? "동의함" : "동의하지 않음"} />
                            </ul>

                            <div className="edit-btn-wrapper">
                                <button className="edit-btn">내 정보 수정하기</button>
                            </div>
                        </>
                    ) : (
                        <p>불러오는 중...</p>
                    )}
                </section>
            </main>
        </div>
    );
};

const InfoItem = ({ label, value }) => (
    <li className="info-item">
        <span className="info-label">{label}</span>
        <span className="info-value">{value}</span>
    </li>
);

export default Mypage;