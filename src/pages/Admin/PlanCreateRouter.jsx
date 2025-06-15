// src/pages/Admin/PlanCreateRouter.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar'; // src/pages/Admin에서 src/components로 이동

// 레이아웃 CSS 경로 수정: AdminPageLayout.css 대신 ReviewManager.css를 임포트하거나
// AdminPageLayout.css가 실제로 존재하는지 확인하여 해당 파일로 임포트해야 합니다.
import '../../styles/ReviewManager.css'; // ✨ 수정: ReviewManager.css로 임포트 (기존 PlanManager에서 사용)
import '../../styles/PlanCreateRouter.css'; // src/pages/Admin에서 src/styles로 이동

// 실제 파일 이름에 맞춰 요금제 생성 컴포넌트들을 임포트합니다.
// 파일 구조 스크린샷에 따르면 이름은 'MobilePlanCreate.jsx'와 'IPTVPlanCreate.jsx' 입니다.
import MobilePlanCreatePage from './MobilePlanCreate'; // ✨ 중요: 실제 파일 이름은 'MobilePlanCreate.jsx' 임포트 시 './MobilePlanCreate' 사용
import IptvCreatePage from './IPTVPlanCreate'; // ✨ 중요: 실제 파일 이름은 'IPTVPlanCreate.jsx' 임포트 시 './IPTVPlanCreate' 사용 (IPTV가 모두 대문자)
// import InternetPlanCreatePage from './InternetPlanCreatePage'; // 인터넷 요금제 컴포넌트가 있다면 임포트

const PlanCreateRouter = () => {
    const location = useLocation(); // 현재 URL의 쿼리 파라미터를 가져오기 위해 사용
    const navigate = useNavigate(); // 리다이렉트 등을 위해 사용
    const [planType, setPlanType] = useState(''); // 현재 생성할 요금제 종류 (mobile, iptv, internet)

    useEffect(() => {
        // URL에서 'type' 쿼리 파라미터 추출
        const params = new URLSearchParams(location.search);
        const type = params.get('type');

        if (type) {
            setPlanType(type);
        } else {
            // type 파라미터가 없는 경우 처리 (예: 경고 메시지 표시 또는 기본값 설정)
            console.warn("PlanCreateRouter: 'type' query parameter is missing. Redirecting to admin plan list.");
            // navigate('/admin/plan'); // 요금제 관리 메인 페이지로 리다이렉트할 수도 있습니다.
        }
    }, [location.search, navigate]); // URL 쿼리 파라미터가 변경될 때마다 실행

    // 선택된 요금제 타입에 따라 적절한 컴포넌트를 렌더링합니다.
    const renderPlanCreationForm = () => {
        switch (planType) {
            case 'mobile':
                return <MobilePlanCreatePage />;
            case 'iptv':
                return <IptvCreatePage />;
            case 'internet':
                // 여기에 InternetPlanCreatePage 컴포넌트를 렌더링합니다.
                // 인터넷 요금제 생성 컴포넌트 파일 이름도 확인하여 정확하게 임포트해야 합니다.
                return (
                    <div className="plan-form-section">
                        <h2>인터넷 요금제 추가 폼 (준비 중)</h2>
                        <p>인터넷 요금제 생성 폼이 여기에 들어갈 예정입니다.</p>
                        {/* <InternetPlanCreatePage /> */}
                    </div>
                );
            default:
                return (
                    <p className="no-type-message">
                        생성할 요금제 종류가 지정되지 않았습니다. 사이드바에서 요금제 추가 메뉴를 선택해주세요.
                    </p>
                );
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-sidebar">
                <AdminSidebar />
            </div>
            <div className="plan-create-content">
                <h1>{planType ? `${planType.toUpperCase()} 요금제 추가` : '요금제 추가'}</h1>
                {/* 폼 렌더링 함수 호출 */}
                {renderPlanCreationForm()}
            </div>
        </div>
    );
};

export default PlanCreateRouter;
