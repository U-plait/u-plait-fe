import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import {
    fetchBanWords,
    addBanWord,
    deleteBanWord,
    deleteBanWordsBulk
} from "../../api/banword";
import "../../styles/BanWordsManager.css";

const BanWordsManager = () => {
    const [banWords, setBanWords] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [newWord, setNewWord] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);

    const MAX_PAGINATION_BUTTONS = 10;

    useEffect(() => {
        loadBanWords();
    }, [currentPage]);

    const loadBanWords = async () => {
        try {
            const res = await fetchBanWords({
                page: currentPage - 1,
                keyword: searchTerm,
            });
            const pageData = res.data.data;
            setBanWords(pageData.content);
            setPageCount(pageData.totalPages);
        } catch (error) {
            console.error("금칙어 로딩 실패:", error);
            alert(error.response?.data?.message || "금칙어 목록을 불러오는데 실패했습니다.");
        }
    };

    const handleCheck = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleDelete = async (id) => {
        try {
            await deleteBanWord(id);
            await loadBanWords();
        } catch (error) {
            alert(error.response?.data?.message || "삭제 중 오류가 발생했습니다.");
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) {
            alert("삭제할 항목을 선택하세요.");
            return;
        }
        try {
            await deleteBanWordsBulk(selectedIds);
            setSelectedIds([]);
            await loadBanWords();
        } catch (error) {
                alert(error.response?.data?.message || "일괄 삭제 중 오류가 발생했습니다.");
        }
    };

    const handleAddBanWord = async () => {
        if (!newWord.trim()) {
            alert("금칙어를 입력하세요.");
            return;
        }
        try {
            await addBanWord(newWord);
            alert("금칙어가 추가되었습니다.");
            setNewWord("");
            setShowModal(false);
            await loadBanWords();
        } catch (error) {
            alert(error.response?.data?.message || "금칙어 추가 중 오류가 발생했습니다.");
        }
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        let startPage = Math.max(1, currentPage - Math.floor(MAX_PAGINATION_BUTTONS / 2));
        let endPage = Math.min(pageCount, startPage + MAX_PAGINATION_BUTTONS - 1);

        if (endPage - startPage + 1 < MAX_PAGINATION_BUTTONS) {
            startPage = Math.max(1, endPage - MAX_PAGINATION_BUTTONS + 1);
        }

        if (currentPage > 1) {
            buttons.push(
                <button key="prev" onClick={() => setCurrentPage(currentPage - 1)} className="pagination-arrow">
                    &lt;
                </button>
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    className={currentPage === i ? "active" : ""}
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </button>
            );
        }

        if (currentPage < pageCount) {
            buttons.push(
                <button key="next" onClick={() => setCurrentPage(currentPage + 1)} className="pagination-arrow">
                    &gt;
                </button>
            );
        }

        return buttons;
    };


    return (
        <div className="admin-page">
            <AdminSidebar />
            <div className="banwords-content">
                <h1>금칙어 관리</h1>

                <div className="banwords-toolbar">
                    <label className="search-label">금칙어 검색</label>
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className="search-btn"
                            onClick={() => {
                                setCurrentPage(1);
                                loadBanWords();
                            }}
                        >
                            검색
                        </button>
                    </div>
                </div>

                <table className="banwords-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>금칙어</th>
                            <th>금칙어 생성일</th>
                            <th>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banWords.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(item.id)}
                                        onChange={() => handleCheck(item.id)}
                                    />
                                </td>
                                <td>{item.id}</td>
                                <td>{item.banWord}</td>
                                <td>{item.createdAt}</td>
                                <td>
                                    <button className="delete" onClick={() => handleDelete(item.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="banwords-bottom-wrap">
                    <div className="banwords-footer">
                        <button className="add-banword-button" onClick={() => setShowModal(true)}>
                        금칙어 추가
                        </button>
                        <button className="delete-all-button" onClick={handleBulkDelete}>
                        선택 항목 일괄삭제
                        </button>
                    </div>

                    <div className="pagination">
                        {renderPaginationButtons()}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2>금칙어 추가</h2>
                        <input
                            type="text"
                            value={newWord}
                            onChange={(e) => setNewWord(e.target.value)}
                            placeholder="새 금칙어 입력"
                        />
                        <div className="modal-actions">
                            <button onClick={handleAddBanWord}>등록</button>
                            <button onClick={() => setShowModal(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BanWordsManager;