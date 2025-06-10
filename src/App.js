import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import KakaoCallback from "./pages/KakaoCallback";

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
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
