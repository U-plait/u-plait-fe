import React, { useRef } from "react";
import ChatPage from "./ChatPage";
import Draggable from "react-draggable";
import "../styles/ChatModal.css";

const ChatModal = ({ onClose }) => {
  const nodeRef = useRef(null);

  return (
    <div className="chat-modal-backdrop">
      <Draggable handle=".chat-modal-header" nodeRef={nodeRef}>
        <div className="chat-modal-content" ref={nodeRef}>
          <div className="chat-modal-header">
            <span>💬 챗봇</span>
            <button onClick={onClose}>✖</button>
          </div>
          <ChatPage />
        </div>
      </Draggable>
    </div>
  );
};
export default ChatModal;
