import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/MypageEdit.css";

const MypageEdit = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [adAgree, setAdAgree] = useState(false);
    const [errors, setErrors] = useState({});
    const [dupChecked, setDupChecked] = useState({ phone: false, email: false });

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
            .catch((err) => console.error("개인정보 불러오기 실패:", err));
    }, []);

    const formatGender = (gender) => {
        if (gender === "MALE") return "남성";
        if (gender === "FEMALE") return "여성";
        return "기타";
    };

    const checkDuplicate = async (type) => {
        try {
            const param = type === "이메일" ? "email" : "phone";
            const value = type === "이메일" ? email : phoneNumber;
            const res = await api.get(`/user/duplicate/${param}`, {
                params: { value },
            });
            const isDuplicated = res.data.data.duplicated;

            const successMsg =
                type === "이메일"
                    ? "사용 가능한 이메일입니다."
                    : "사용 가능한 전화번호입니다.";
            const errorMsg =
                type === "이메일"
                    ? "이미 사용 중인 이메일입니다."
                    : "이미 사용 중인 전화번호입니다.";

            if (type === "이메일") {
                setErrors((prev) => ({
                    ...prev,
                    email: isDuplicated ? errorMsg : successMsg,
                }));
                setDupChecked((prev) => ({
                    ...prev,
                    email: !isDuplicated,
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    phone: isDuplicated ? errorMsg : successMsg,
                }));
                setDupChecked((prev) => ({
                    ...prev,
                    phone: !isDuplicated,
                }));
            }
        } catch (err) {
            setErrors((prev) => ({
                ...prev,
                [type === "이메일" ? "email" : "phone"]: `${type} 중복 확인 중 오류가 발생했습니다.`,
            }));
        }
    };

    const handleSubmit = () => {
        const newErrors = {};
        if (!phoneNumber) newErrors.phone = "전화번호를 입력해주세요.";
        if (!email) newErrors.email = "이메일을 입력해주세요.";
        if (!dupChecked.phone) newErrors.phone = "전화번호 중복 확인이 필요합니다.";
        if (!dupChecked.email) newErrors.email = "이메일 중복 확인이 필요합니다.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            api
                .put(
                    "/user/detail/update",
                    {
                        phoneNumber,
                        email,
                        adAgree,
                    },
                    { withCredentials: true }
                )
                .then(() => {
                    alert("개인정보가 성공적으로 수정되었습니다.");
                    navigate("/mypage");
                })
                .catch(() => {
                    alert("수정에 실패했습니다.");
                });
        }
    };

    return (
        <div className="mypage-edit-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="side-menu">User Menu</div>
                <nav className="menu">
                    <button
                        className="menu-item active"
                        onClick={() => navigate("/mypage")}
                    >
                        👤 User profile
                    </button>
                    <button
                        className="menu-item"
                        onClick={() => navigate("/myreviews")}
                    >
                        💬 Reviews
                    </button>
                </nav>
            </aside>

            <main className="main-content">
                <h1 className="page-title">개인정보 수정</h1>

                {userInfo ? (
                    <section className="profile-card">
                        <div className="form-group readonly">
                            <label>이름</label>
                            <input type="text" value={userInfo.name} readOnly />
                        </div>

                        <div className="form-group">
                            <label>핸드폰 번호</label>
                            <div className="input-with-button">
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                        setDupChecked((prev) => ({ ...prev, phone: false }));
                                        setErrors((prev) => ({ ...prev, phone: "" }));
                                    }}
                                    placeholder="010-1234-5678"
                                />
                                <button
                                    className="edit-btn"
                                    type="button"
                                    onClick={() => checkDuplicate("전화번호")}
                                >
                                    중복 확인
                                </button>
                            </div>
                            {errors.phone && <p className="error-text">{errors.phone}</p>}
                        </div>

                        <div className="form-group">
                            <label>이메일</label>
                            <div className="input-with-button">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setDupChecked((prev) => ({ ...prev, email: false }));
                                        setErrors((prev) => ({ ...prev, email: "" }));
                                    }}
                                    placeholder="example@domain.com"
                                />
                                <button
                                    className="edit-btn"
                                    type="button"
                                    onClick={() => checkDuplicate("이메일")}
                                >
                                    중복 확인
                                </button>
                            </div>
                            {errors.email && <p className="error-text">{errors.email}</p>}
                        </div>

                        <div className="form-group readonly">
                            <label>나이</label>
                            <input type="text" value={`${userInfo.age}세`} readOnly />
                        </div>

                        <div className="form-group readonly">
                            <label>성별</label>
                            <input type="text" value={formatGender(userInfo.gender)} readOnly />
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={adAgree}
                                    onChange={(e) => setAdAgree(e.target.checked)}
                                />
                                광고 수신에 동의합니다.
                            </label>
                        </div>

                        <div className="edit-btn-wrapper">
                            <button className="edit-btn" onClick={handleSubmit}>
                                저장하기
                            </button>
                        </div>
                    </section>
                ) : (
                    <p>불러오는 중...</p>
                )}
            </main>
        </div>
    );
};

export default MypageEdit;