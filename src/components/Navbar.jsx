import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import api from "../api/api";
import logo from "../assets/img/uplait_logo.png";
import text from "../assets/img/uplait_text.png";

const Navbar = () => {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user/me", {
          // withCredentials: true,
        });
        setUserName(res.data.data.name);
      } catch (error) {
        setUserName(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
          <img src={text} alt="text" className="text" />
        </Link>
      </div>
      <ul className="nav-menu">
        <li className="nav-item">
          <Link to="/mobile">
            <button className="nav-button">Mobile</button>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/internet">
            <button className="nav-button">Internet</button>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/iptv">
            <button className="nav-button">IPTV</button>
          </Link>
        </li>
        {/* <li className="nav-item">
          <Link to="/mypage">
            <button className="nav-button">MyPage</button>
          </Link>
        </li> */}
      </ul>
      <div className="auth-buttons">
        {userName ? (
          <Link to="/mypage" className="user-name-button">
            {userName} 님
          </Link>
        ) : (
          <Link to="/login">
            <button className="login-button">로그인</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
