import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import KakaoCallback from "./pages/KakaoCallback";
import "./utils/auth";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/kakaocallback" element={<KakaoCallback />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
