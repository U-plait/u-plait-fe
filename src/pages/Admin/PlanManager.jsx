import React, { useState, useEffect, useCallback } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import PlanCard from "../../components/PlanCard";
import SearchBar from "../../components/SearchBar";
import "../../styles/PlanManager.css";
import { useNavigate } from "react-router-dom";
import AdminPlanDetail from "./AdminPlanDetail";
import DeleteConfirmModal from "../../components/DeleteConfirmModal"; // 삭제 모달 import
import { 
    getMobilePlansAPI, 
    getInternetPlansAPI, 
    getIptvPlansAPI, 
    getPlanDetailAPI,
    deletePlanAPI // 삭제 API import
} from '../../api/plan';

const PlanManager = () => {
    // --- State & Navigate ---
    const [plans, setPlans] = useState([]);
    const [selectedTab, setSelectedTab] = useState("모바일");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isLoadingModal, setIsLoadingModal] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태
    const [planToDelete, setPlanToDelete] = useState(null); // 삭제할 요금제 정보
    const navigate = useNavigate();

    // --- Data Fetching ---
    const fetchPlans = useCallback(async (tab, pageNum) => {
        try {
            let response;
            switch (tab) {
                case "모바일":
                    response = await getMobilePlansAPI(pageNum);
                    break;
                case "인터넷":
                    response = await getInternetPlansAPI(pageNum);
                    break;
                case "IPTV":
                    response = await getIptvPlansAPI(pageNum);
                    break;
                default:
                    response = await getMobilePlansAPI(pageNum);
            }
            if (response.statusCode === 0 && response.data && response.data.content) {
                setPlans(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                console.error("데이터 구조가 예상과 다릅니다:", response);
                setPlans([]);
            }
        } catch (error) {
            console.error(`Error fetching ${tab} plans:`, error);
            setPlans([]);
        }
    }, []);

    useEffect(() => {
        fetchPlans(selectedTab, page);
    }, [selectedTab, page, fetchPlans]);

    // --- Event Handlers ---
    const handleTabClick = (tab) => {
        setPage(0);
        setSelectedTab(tab);
    };

    const handlePageClick = (pageNumber) => setPage(pageNumber - 1);
    const handlePreviousPage = () => setPage(page > 0 ? page - 1 : 0);
    const handleNextPage = () => setPage(page < totalPages - 1 ? page + 1 : page);

    const getAddButtonText = () => {
        switch (selectedTab) {
            case "모바일": return "모바일 요금제 추가";
            case "인터넷": return "인터넷 요금제 추가";
            case "IPTV": return "IPTV 요금제 추가";
            default: return "요금제 추가";
        }
    };

    const handleAddPlanClick = () => {
        switch (selectedTab) {
            case "모바일":
                navigate("/admin/mobile/create");
                break;
            case "인터넷":
                navigate("/admin/internet/create");
                break;
            case "IPTV":
                navigate("/admin/iptv/create");
                break;
            default:
                alert("알 수 없는 요금제 타입입니다.");
        }
    };
    
    // 상세보기 모달 핸들러
    const handleShowDetails = async (planId, planType) => {
        setIsDetailModalOpen(true);
        setIsLoadingModal(true);
        try {
            const response = await getPlanDetailAPI(planType, planId);
            if (response.statusCode === 0) {
                setSelectedPlan(response.data);
            } else {
                alert("상세 정보를 불러오는데 실패했습니다.");
                handleCloseDetailModal();
            }
        } catch (error) {
            console.error("상세보기 API 호출 에러:", error);
            alert("오류가 발생했습니다.");
            handleCloseDetailModal();
        } finally {
            setIsLoadingModal(false);
        }
    };
    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedPlan(null);
    };

    // --- 삭제 관련 핸들러 ---
    const handleDeleteClick = (plan) => {
        setPlanToDelete(plan);
        setIsDeleteModalOpen(true);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setPlanToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!planToDelete) return;
        try {
            const response = await deletePlanAPI(planToDelete.planId);
            if (response.statusCode === 0 || response.statusCode === 3003) {
                alert("요금제가 성공적으로 삭제되었습니다.");
                // 현재 페이지의 아이템이 모두 삭제되면 이전 페이지로 이동
                if (plans.length === 1 && page > 0) {
                    setPage(page - 1);
                } else {
                    fetchPlans(selectedTab, page); // 현재 페이지 목록 새로고침
                }
            } else {
                alert(`삭제 실패: ${response.message}`);
            }
        } catch (error) {
            console.error("삭제 중 오류 발생:", error);
            alert("삭제 중 오류가 발생했습니다.");
        } finally {
            handleCancelDelete(); // 모달 닫기
        }
    };

    // --- Render JSX ---
    return (
        <div className="admin-page">
            <AdminSidebar />
            <div className="plan-content">
                <h1>요금제 관리</h1>
                <div className="plan-toolbar">
                    <div className="left-toolbar">
                        <SearchBar />
                        <div className="tab-bar">
                            {["모바일", "인터넷", "IPTV"].map((t) => (
                                <button
                                    key={t}
                                    className={`tab ${selectedTab === t ? "active" : ""}`}
                                    onClick={() => handleTabClick(t)}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="add-plan-button" onClick={handleAddPlanClick}>
                        {getAddButtonText()}
                    </button>
                </div>
                <div className="plan-grid">
                    {plans.length > 0 ? (
                        plans.map((plan) => (
                            <PlanCard
                                key={plan.planId}
                                plan={plan}
                                onShowDetails={() => handleShowDetails(plan.planId, plan.planType)}
                                onDelete={() => handleDeleteClick(plan)}
                            />
                        ))
                    ) : (
                        <p>등록된 요금제가 없습니다.</p>
                    )}
                </div>
                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button onClick={handlePreviousPage} disabled={page === 0}>
                            이전
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                            <button
                                key={number}
                                onClick={() => handlePageClick(number)}
                                className={page + 1 === number ? "active" : ""}
                                disabled={page + 1 === number}
                            >
                                {number}
                            </button>
                        ))}
                        <button onClick={handleNextPage} disabled={page === totalPages - 1}>
                            다음
                        </button>
                    </div>
                )}
            </div>

            {/* 상세보기 모달 */}
            {isDetailModalOpen && (
                <AdminPlanDetail 
                    plan={selectedPlan} 
                    isLoading={isLoadingModal}
                    onClose={handleCloseDetailModal} 
                />
            )}

            {/* 삭제 확인 모달 */}
            {isDeleteModalOpen && (
                <DeleteConfirmModal
                    planName={planToDelete?.planName}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
};

export default PlanManager;
