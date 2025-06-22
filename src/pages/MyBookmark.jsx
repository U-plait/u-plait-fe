import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/MyBookmark.module.css";

const MyBookmark = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        api
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
                    <button
                        className="menu-item"
                        onClick={() => navigate("/mypage")}
                    >
                        👤 User profile
                    </button>
                    <button className="menu-item" onClick={() => navigate("/myreviews")}>
                        💬 Reviews
                    </button>
                    <button className="menu-item active" onClick={() => navigate("/mybookmark")}>
                        🌟 Bookmark
                    </button>
                </nav>
            </aside>
        </div>
    );
};

export default MyBookmark;