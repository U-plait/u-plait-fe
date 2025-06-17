import React from "react";
import "../styles/PlanManager.css";

const SearchBar = ({ onChange }) => {
    return (
        <div className="search-bar">
            <input type="text" placeholder="요금제 검색" onChange={onChange} />
            <button className="search-button">Search</button>
        </div>
    );
};

export default SearchBar;