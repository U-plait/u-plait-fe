import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import SearchBar from "../../components/SearchBar";
import "../../styles/BanWordsManager.css";

const dummyData = Array.from({ length: 10 }, (_, i) => ({
    id: 151 - i,
    word: "ㅅㅂ",
    createdAt: "March 21, 2020 00:28",
    updatedAt: "March 21, 2020 00:28",
}));

const BanWords = () => {
    const [banWords, setBanWords] = useState([]);

    useEffect(() => {
        // API 대체용 더미 데이터
        setBanWords(dummyData);
    }, []);

    return (
        <div className="admin-page">
            <AdminSidebar />
            <div className="banwords-content">
                <h1>금칙어 관리</h1>
                <div className="banwords-toolbar">
                    <SearchBar />
                </div>

                <table className="banwords-table">
                    <thead>
                    <tr>
                        <th><input type="checkbox" /></th>
                        <th>ID</th>
                        <th>금칙어</th>
                        <th>금칙어 생성일</th>
                        <th>금칙어 수정일</th>
                        <th>삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {banWords.map((item) => (
                        <tr key={item.id}>
                            <td><input type="checkbox" /></td>
                            <td>{item.id}</td>
                            <td>{item.word}</td>
                            <td>{item.createdAt}</td>
                            <td>{item.updatedAt}</td>
                            <td><button className="delete">Delete</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="banwords-footer">
                    <button className="add-banword-button">금칙어 추가</button>
                    <button className="delete-all-button">일괄삭제</button>
                </div>
            </div>
        </div>
    );
};

export default BanWords;