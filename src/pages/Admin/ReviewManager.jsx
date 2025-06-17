import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import SearchBar from "../../components/SearchBar";
import "../../styles/ReviewManager.css";

const dummyReviews = Array.from({ length: 7 }, (_, i) => ({
    id: 21 - i,
    plan: "5G 요금제 A",
    content: `리뷰가 어쩌고 저쩌고_${i + 1}`,
    createdAt: "March 21, 2020 00:28",
    updatedAt: "March 21, 2020 00:28",
    rating: 5,
}));

const ReviewManager = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        setReviews(dummyReviews);
    }, []);

    return (
        <div className="admin-page">
            <AdminSidebar />
            <div className="review-content">
                <h2>리뷰 관리</h2>
                <div className="review-toolbar">
                    <SearchBar />
                </div>

                <table className="review-table">
                    <thead>
                    <tr>
                        <th><input type="checkbox" /></th>
                        <th>ID</th>
                        <th>요금제명</th>
                        <th>리뷰 내용</th>
                        <th>리뷰 작성일</th>
                        <th>리뷰 수정일</th>
                        <th>별점</th>
                        <th>삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reviews.map((item) => (
                        <tr key={item.id}>
                            <td><input type="checkbox" /></td>
                            <td>{item.id}</td>
                            <td>{item.plan}</td>
                            <td>{item.content}</td>
                            <td>{item.createdAt}</td>
                            <td>{item.updatedAt}</td>
                            <td>{"⭐".repeat(item.rating)}</td>
                            <td><button className="delete">Delete</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="review-footer">
                    <button className="delete-all-button">일괄삭제</button>
                </div>
            </div>
        </div>
    );
};

export default ReviewManager;