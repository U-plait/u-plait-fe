import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/MypageEdit.css";

const MypageEdit = () => {
    const [userInfo, setUserInfo] = useState({
        name: "",
        gender: "",
        phoneNumber: "",
        email: "",
        adAgree: false,
    });

    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("/user/detail", { withCredentials: true })
            .then((res) => {
                const data = res.data.data;
                setUserInfo({
                    name: data.name || "",
                    gender: data.gender || "",
                    phoneNumber: data.phoneNumber || "",
                    email: data.email || "",
                    adAgree: data.adAgree || false,
                });
            })
            .catch((err) => {
                console.error("유저 정보 불러오기 실패:", err);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserInfo((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { phoneNumber, email, adAgree } = userInfo;
        axios
            .post(
                "/user/detail/update",
                { phoneNumber, email, adAgree },
                { withCredentials: true }
            )
            .then(() => {
                alert("정보가 성공적으로 수정되었습니다.");
                navigate("/mypage");
            })
            .catch((err) => {
                console.error("정보 수정 실패:", err);
                alert("정보 수정에 실패했습니다.");
            });
    };

    return (
        <div className="mypage-edit-container">
            <aside className="sidebar">
                <div className="side-menu">User Menu</div>
                <nav className="menu">
                    <button className="menu-item" onClick={() => navigate("/mypage")}>
                        👤 User profile
                    </button>
                    <button className="menu-item" onClick={() => navigate("/myreviews")}>
                        💬 Reviews
                    </button>
                </nav>
            </aside>

            <main className="main-content">
                <h1 className="page-title">개인정보 수정</h1>
                <form className="profile-card" onSubmit={handleSubmit}>
                    {/* 읽기 전용 항목 */}
                    <div className="form-group readonly">
                        <label>이름</label>
                        <input type="text" value={userInfo.name} readOnly />
                    </div>

                    <div className="form-group readonly">
                        <label>성별</label>
                        <input type="text" value={userInfo.gender} readOnly />
                    </div>

                    {/* 수정 가능한 항목 */}
                    <div className="form-group">
                        <label>핸드폰 번호</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={userInfo.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="adAgree"
                                checked={userInfo.adAgree}
                                onChange={handleChange}
                            />
                            광고 수신에 동의합니다
                        </label>
                    </div>

                    <div className="edit-btn-wrapper">
                        <button type="submit" className="edit-btn">
                            수정 완료
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default MypageEdit;