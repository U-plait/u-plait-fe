import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/AdminSidebar.css";

const menuItems = [
    { label: "리뷰 관리", path: "/admin/reviews"},
    { label: "요금제 관리", path: "/admin/plan"},
    { label: "금칙어 관리", path: "/admin/banwords"},
];

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // ✅ 현재 경로 확인용

    return (
        <div className="admin-sidebar">
            <div className="admin-logo">
                Uplait<br /><span>Admin</span>
            </div>
            <ul className="admin-menu">
                {menuItems.map((item) => (
                    <li
                        key={item.label}
                        className={`admin-menu-item ${location.pathname === item.path ? "active" : ""}`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="icon">{item.icon}</span> {item.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminSidebar;