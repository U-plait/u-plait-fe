import React, { useState, useRef, useEffect } from "react";
import "../styles/chat.css";

const CHATBOT_URL = process.env.REACT_APP_CHATBOT_URL;

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  const handlePrev = () => {
    setCurrentPlanIndex((prev) =>
      prev === 0 ? messages[messages.length - 1].plans.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentPlanIndex((prev) =>
      prev === messages[messages.length - 1].plans.length - 1 ? 0 : prev + 1
    );
  };

  const handleSend = async () => {
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: query }]);
    setQuery("");
    setIsBotTyping(true);

    const response = await fetch(CHATBOT_URL + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ query }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let botMessageStarted = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (let line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice("data: ".length);

        if (data === "[END_OF_MESSAGE]") {
          setIsBotTyping(false);
          continue;
        }

        try {
          const json = JSON.parse(data);

          if (json.plan_ids) continue;

          if (json.plans) {
            setCurrentPlanIndex(0);
            setMessages((prev) => [
              ...prev,
              { from: "plan", plans: json.plans },
            ]);
            continue;
          }

          const text = String(json);
          if (!botMessageStarted) {
            setIsBotTyping(false);
            setMessages((prev) => [...prev, { from: "bot", text }]);
            botMessageStarted = true;
          } else {
            setMessages((prev) =>
              prev.map((msg, i) =>
                i === prev.length - 1 && msg.from === "bot"
                  ? { ...msg, text: String(msg.text ?? "") + text }
                  : msg
              )
            );
          }
        } catch {
          const text = String(data);
          if (!botMessageStarted) {
            setIsBotTyping(false);
            setMessages((prev) => [...prev, { from: "bot", text }]);
            botMessageStarted = true;
          } else {
            setMessages((prev) =>
              prev.map((msg, i) =>
                i === prev.length - 1 && msg.from === "bot"
                  ? { ...msg, text: String(msg.text ?? "") + text }
                  : msg
              )
            );
          }
        }
      }
    }
    setIsBotTyping(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, idx) => {
          if (msg.from === "plan") {
            return (
              <div className="plan-slide-wrapper" key={`plan-${idx}`}>
                <button className="arrow-button" onClick={handlePrev}>
                  ◀
                </button>
                <div className="plan-card">
                  <div className="plan-name">
                    {msg.plans[currentPlanIndex].plan_name.trim()}
                  </div>
                  <div className="plan-price">
                    {msg.plans[currentPlanIndex].plan_price.toLocaleString()}원
                  </div>
                  <div className="plan-description">
                    {msg.plans[currentPlanIndex].description}
                  </div>
                </div>
                <button className="arrow-button" onClick={handleNext}>
                  ▶
                </button>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`chat-message ${msg.from === "user" ? "user" : "bot"}`}
            >
              <div className="message-bubble">
                {msg.text.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
        {isBotTyping && (
          <div className="chat-message bot">
            <div className="message-bubble typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={handleSend}>전송</button>
      </div>
    </div>
  );
};

export default ChatPage;
