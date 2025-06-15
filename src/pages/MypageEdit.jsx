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

    const validatePhone = (number) =>
        /^010-\d{4}-\d{4}$/.test(number);

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const checkPhoneDuplicate = () => {
        if (!validatePhone(phoneNumber)) {
            setErrors(prev => ({ ...prev, phone: "전화번호 형식이 올바르지 않습니다." }));
            return;
        }
        api
            .get(`/user/duplicate/phone?value=${phoneNumber}`)
            .then((res) => {
                if (res.data.data.duplicated) {
                    setErrors(prev => ({ ...prev, phone: "이미 사용 중인 번호입니다." }));
                    setDupChecked(prev => ({ ...prev, phone: false }));
                } else {
                    setErrors(prev => ({ ...prev, phone: "" }));
                    setDupChecked(prev => ({ ...prev, phone: true }));
                    alert("사용 가능한 전화번호입니다.");
                }
            })
            .catch(() => alert("전화번호 중복 확인 실패"));
    };

    const checkEmailDuplicate = () => {
        if (!validateEmail(email)) {
            setErrors(prev => ({ ...prev, email: "이메일 형식이 올바르지 않습니다." }));
            return;
        }
        api
            .get(`/user/duplicate/email?value=${email}`)
            .then((res) => {
                if (res.data.data.duplicated) {
                    setErrors(prev => ({ ...prev, email: "이미 사용 중인 이메일입니다." }));
                    setDupChecked(prev => ({ ...prev, email: false }));
                } else {
                    setErrors(prev => ({ ...prev, email: "" }));
                    setDupChecked(prev => ({ ...prev, email: true }));
                    alert("사용 가능한 이메일입니다.");
                }
            })
            .catch(() => alert("이메일 중복 확인 실패"));
    };

    const handleSubmit = () => {
        const newErrors = {};
        if (!validatePhone(phoneNumber)) newErrors.phone = "전화번호 형식이 올바르지 않습니다.";
        if (!validateEmail(email)) newErrors.email = "이메일 형식이 올바르지 않습니다.";
        if (!dupChecked.phone) newErrors.phone = "전화번호 중복 확인이 필요합니다.";
        if (!dupChecked.email) newErrors.email = "이메일 중복 확인이 필요합니다.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            api
                .put("/user/detail/update", {
                    phoneNumber,
                    email,
                    adAgree
                }, { withCredentials: true })
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
            {/* Sidebar - Mypage와 동일하게 하드코딩 */}
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
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                        setDupChecked(prev => ({ ...prev, phone: false }));
                                    }}
                                />
                                <button className="edit-btn" onClick={checkPhoneDuplicate}>
                                    중복 확인
                                </button>
                            </div>
                            {errors.phone && <p className="error-text">{errors.phone}</p>}
                        </div>

                        <div className="form-group">
                            <label>이메일</label>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setDupChecked(prev => ({ ...prev, email: false }));
                                    }}
                                />
                                <button className="edit-btn" onClick={checkEmailDuplicate}>
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