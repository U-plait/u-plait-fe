import { useState, useEffect } from "react";
import api from "../api/api";
import "../styles/ExtraTag.css";

const ExtraTag = () => {
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [currentStep, setCurrentStep] = useState("selection");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                setLoading(true);

                const response = await api.get("/admin/plan/Info");
                const tagList = response.data?.data?.tagList ?? [];

                const transformedTags = tagList.map((tag) => ({
                    id: String(tag.tagId),
                    label: tag.tagName,
                    category: "", // 현재 카테고리 정보 없음
                }));

                setAvailableTags(transformedTags);
            } catch (err) {
                setError("태그를 불러오는데 실패했습니다.");
                console.error("태그 로딩 에러:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    const toggleTag = (tagId) => {
        const stringId = String(tagId);
        setSelectedTags((prev) =>
            prev.includes(stringId)
                ? prev.filter((id) => id !== stringId)
                : [...prev, stringId]
        );
    };

    const handleSave = async () => {
        console.log("선택된 태그들:", selectedTags);

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setCurrentStep("next");
        } catch (err) {
            console.error("저장 에러:", err);
            alert("저장에 실패했습니다.");
        }
    };

    const handleReset = () => {
        setSelectedTags([]);
        setCurrentStep("selection");
    };

    if (loading) {
        return (
            <div className="center-container">
                <div className="card success-card">
                    <div className="loading-content">
                        <div className="loading-text">
                            <div className="spinner"></div>
                            <p style={{ color: "#4b5563" }}>태그를 불러오는 중...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="center-container">
                <div className="card success-card">
                    <div className="error-content">
                        <p className="error-text">{error}</p>
                        <button className="button button-retry" onClick={() => window.location.reload()}>
                            다시 시도
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (currentStep === "next") {
        return (
            <div className="center-container">
                <div className="card success-card">
                    <div className="card-header">
                        <h1 className="card-title success-title">저장 완료!</h1>
                    </div>
                    <div className="card-content">
                        <div className="success-content">
                            <div>
                                <p className="selected-tags-label">선택된 태그:</p>
                                <div className="selected-tags-container">
                                    {selectedTags.map((tagId) => {
                                        const tag = availableTags.find((t) => t.id === tagId);
                                        return (
                                            <span key={tagId} className="selected-tag">
                        {tag?.label}
                      </span>
                                        );
                                    })}
                                </div>
                            </div>
                            <button className="button button-full" onClick={handleReset}>
                                다시 선택하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="main-container">
            <div className="content-wrapper">
                <div className="card">
                    <div className="card-header">
                        <h1 className="card-title">회원가입을 축하드립니다!<br/>이제 마지막 단계입니다.<br/>관심있는 분야를 선택해주세요.</h1>
                    </div>
                    <div className="card-content">
                        <div className="card-content-spacing">
                            <div className="tags-container">
                                {availableTags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        onClick={() => toggleTag(tag.id)}
                                        className={`tag-button ${
                                            selectedTags.includes(String(tag.id))
                                                ? "tag-button-selected"
                                                : "tag-button-unselected"
                                        }`}
                                        title={tag.category || ""}
                                    >
                                        {tag.label}
                                    </button>
                                ))}
                            </div>

                            <div className="button-container">
                                <button className="button" onClick={handleSave} disabled={selectedTags.length === 0}>
                                    저장
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExtraTag;