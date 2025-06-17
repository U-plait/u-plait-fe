import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import KakaoCallback from "./pages/KakaoCallback";
import PlanManager from "./pages/Admin/PlanManager";
import MobilePlanCreate from "./pages/Admin/MobilePlanCreate";
import IPTVPlanCreate from "./pages/Admin/IPTVPlanCreate";
import InternetPlanCreate from "./pages/Admin/InternetPlanCreate";
import BanWordsManager from "./pages/Admin/BanWordsManager";
import ReviewManager from "./pages/Admin/ReviewManager";
import Mypage from "./pages/Mypage";
import MypageEdit from "./pages/MypageEdit";
import MyReviews from "./pages/MyReviews";
import MobilePlanList from "./pages/MobilePlanList";
import InternetPlanList from "./pages/InternetPlanList";
import IPTVPlanList from "./pages/IPTVPlanList";
import MobilePlanDetail from "./pages/MobilePlanDetail";
import InternetPlanDetail from "./pages/InternetPlanDetail";
import IPTVPlanDetail from "./pages/IPTVPlanDetail";
import ExtraInfo from "./pages/ExtraInfo";
import MobilePlanEdit from "./pages/Admin/MobilePlanEdit";
import IPTVPlanEdit from "./pages/Admin/IPTVPlanEdit";
import InternetPlanEdit from "./pages/Admin/InternetPlanEdit";
import CMobilePlanList from "./pages/CMobilePlanList";
import CInternetPlanList from "./pages/CInternetPlanList";
import CIPTVPlanList from "./pages/CIPTVPlanList";
import ComparisonMobilePlanList from "./pages/ComparisonMobilePlanList";
import ComparisonInternetPlanList from "./pages/ComparisonInternetPlanList";
import ComparisonIPTVPlanList from "./pages/ComparisonIPTVPlanList";
import ChatPage from "./pages/ChatPage";
import FloatingChatButton from "./components/FloatingChatButton";
import ChatModal from "./pages/ChatModal";

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="App">
      <Router>
        <div className="App">
          <Navbar />
          <FloatingChatButton onClick={() => setShowChat(true)} />
          {showChat && <ChatModal onClose={() => setShowChat(false)} />}
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/kakaocallback" element={<KakaoCallback />} />
            <Route path="/extra-info" element={<ExtraInfo />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/admin/plan" element={<PlanManager />} />
            <Route path="/admin/mobile/create" element={<MobilePlanCreate />} />
            <Route path="/admin/iptv/create" element={<IPTVPlanCreate />} />
            <Route
              path="/admin/internet/create"
              element={<InternetPlanCreate />}
            />
            <Route
              path="/admin/mobile/edit/:planId"
              element={<MobilePlanEdit />}
            />
            <Route path="/admin/iptv/edit/:planId" element={<IPTVPlanEdit />} />
            <Route
              path="/admin/internet/edit/:planId"
              element={<InternetPlanEdit />}
            />
            <Route path="/admin/banwords" element={<BanWordsManager />} />
            <Route path="/admin/reviews" element={<ReviewManager />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/mypage/edit" element={<MypageEdit />} />
            <Route path="/myreviews" element={<MyReviews />} />
            <Route path="/mobile" element={<MobilePlanList />} />
            <Route path="/internet" element={<InternetPlanList />} />
            <Route path="/iptv" element={<IPTVPlanList />} />
            <Route path="/Cmobile" element={<CMobilePlanList />} />
            <Route path="/Cinternet" element={<CInternetPlanList />} />
            <Route path="/Ciptv" element={<CIPTVPlanList />} />
            <Route
              path="/comparison/mobile"
              element={<ComparisonMobilePlanList />}
            />
            <Route
              path="/comparison/internet"
              element={<ComparisonInternetPlanList />}
            />
            <Route
              path="/comparison/iptv"
              element={<ComparisonIPTVPlanList />}
            />
            {/* Plan Detail */}
            <Route path="/mobile/plan/:planId" element={<MobilePlanDetail />} />
            <Route
              path="/internet/plan/:planId"
              element={<InternetPlanDetail />}
            />
            <Route path="/iptv/plan/:planId" element={<IPTVPlanDetail />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
