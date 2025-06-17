// src/components/Csidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // useLocation 훅 추가
import styles from '../styles/Csidebar.module.css'; // 파일 이름 변경에 맞춰 수정

// 아이콘 라이브러리를 사용한다면 임포트 (예: react-icons)
// import { FaUser, FaClipboardList, FaFileAlt } from 'react-icons/fa'; // 예시 아이콘

function Csidebar() {
    const location = useLocation(); // 현재 경로를 가져오기 위해 useLocation 사용

    // 메뉴 아이템 데이터 (아이콘은 예시)
    const menuItems = [
        { name: '모바일 요금제', path: '/Cmobile', icon: '📱' }, // 예시 아이콘 문자
        { name: '인터넷 요금제', path: '/Cinternet', icon: '💻' },
        { name: 'IPTV 요금제', path: '/Ciptv', icon: '📺' },
    ];


    return (
        // .sidebar 클래스를 적용할 최상위 div로 변경
        <div className={styles.sidebar}>
            <nav className={styles['sidebar-nav']}>
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                // 현재 경로에 따라 active 클래스 적용
                                className={`${styles['sidebar-item']} ${location.pathname === item.path ? styles.active : ''}`}
                            >
                                {/* 아이콘 렌더링 (폰트 아이콘 또는 SVG 등) */}
                                {item.icon && <span className={styles.icon}>{item.icon}</span>}
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default Csidebar;