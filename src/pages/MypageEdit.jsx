import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/MypageEdit.css";

const MypageEdit = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [adAgree, setAdAgree] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api
            .get("/user/detail", { withCredentials: true })
            .then((res) => {
                const data = res.data.data;
                setUserInfo(data);
                setPhoneNumber(data.phoneNumber || "");
                setEmail(data.email || "");
                setAdAgree(data.adAgree || false);
            })
            .catch((err) => console.error("정보 불러오기 실패:", err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        api
            .put(
                "/user/detail/update",
                { phoneNumber, email, adAgree },
                { withCredentials: true }
            )
            .then(() => {
                alert("개인정보가 수정되었습니다.");
                navigate("/mypage");
            })
            .catch((err) => {
                console.error("수정 실패:", err);
                alert("수정에 실패했습니다.");
            });
    };

    const formatGender = (gender) => {
        if (gender === "MALE") return "남성";
        if (gender === "FEMALE") return "여성";
        return "기타";
    };

    return (
        <div className="mypage-edit-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="side-menu">User Menu</div>
                <nav className="menu">
                    <button className="menu-item active"
                            onClick={() => navigate('/mypage')}
                    >
                        👤 User profile
                    </button>
                    <button
                        className="menu-item"
                        onClick={() => navigate('/myreviews')}
                    >
                        💬 Reviews
                    </button>
                </nav>
            </aside>

            <main className="main-content">
                <h1 className="page-title">개인정보 수정</h1>
                {userInfo ? (
                    <section className="profile-card">
                        <form onSubmit={handleSubmit}>
                            {/* 이름 (readonly) */}
                            <div className="form-group readonly">
                                <label>이름</label>
                                <input type="text" value={userInfo.name} readOnly />
                            </div>

                            {/* 핸드폰 번호 */}
                            <div className="form-group">
                                <label htmlFor="phone">핸드폰 번호</label>
                                <input
                                    type="text"
                                    id="phone"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>

                            {/* 이메일 */}
                            <div className="form-group">
                                <label htmlFor="email">이메일</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* 나이 (readonly) */}
                            <div className="form-group readonly">
                                <label>나이</label>
                                <input type="text" value={`${userInfo.age}세`} readOnly />
                            </div>

                            {/* 성별 (readonly) */}
                            <div className="form-group readonly">
                                <label>성별</label>
                                <input type="text" value={formatGender(userInfo.gender)} readOnly />
                            </div>

                            {/* 광고 수신 동의 */}
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={adAgree}
                                        onChange={(e) => setAdAgree(e.target.checked)}
                                    />
                                    광고 수신에 동의합니다
                                </label>
                            </div>

                            {/* 저장 버튼 */}
                            <div className="edit-btn-wrapper">
                                <button type="submit" className="edit-btn">
                                    저장하기
                                </button>
                            </div>
                        </form>
                    </section>
                ) : (
                    <p>불러오는 중...</p>
                )}
            </main>
        </div>
    );
};

export default MypageEdit;