import React from "react";
import "../styles/FloatingChatButton.css";
import chatIcon from "../assets/img/chatbot_button.png";

const FloatingChatButton = ({ onClick }) => {
  return (
    <button className="floating-chat-button" onClick={onClick}>
      <img src={chatIcon} alt="Chat Button" />
    </button>
  );
};

export default FloatingChatButton;
