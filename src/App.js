import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import KakaoCallback from "./pages/KakaoCallback";
import PlanManager from "./pages/Admin/PlanManager";
import BanWordsManager from "./pages/Admin/BanWordsManager";
import ReviewManager from "./pages/Admin/ReviewManager";
import Mypage from "./pages/Mypage";
import ExtraInfo from "./pages/ExtraInfo";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/kakaocallback" element={<KakaoCallback />} />
            <Route path="/extra-info" element={<ExtraInfo />} />
            <Route path="/admin/plans" element={<PlanManager />} />
            <Route path="/admin/banwords" element={<BanWordsManager />} />
            <Route path="/admin/reviews" element={<ReviewManager />} />
            <Route path="/mypage" element={<Mypage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
