import React, { useState, useRef, useEffect } from "react";
import "../styles/chat.css";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [recommendedPlans, setRecommendedPlans] = useState([]);
  const messagesEndRef = useRef(null);

  //메시지가 추가될 때 맨 아래로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  const handleSend = async () => {
    if (!query.trim()) return;

    // 1. 사용자 메시지 추가
    setMessages((prev) => [...prev, { from: "user", text: query }]);
    setQuery("");
    setIsBotTyping(true);

    // 2. 서버 요청
    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ query }),
    });

    // 3. 스트리밍 응답 처리
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let botMessageStarted = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // 마지막 잘린 줄은 다음 루프에 이어서 사용

      for (let line of lines) {
        if (!line.startsWith("data: ")) continue;

        const data = line.slice("data: ".length);

        console.log("🔥 받은 data:", JSON.stringify(data));

        if (data === "[END_OF_MESSAGE]") {
          setIsBotTyping(false);
          continue;
        }

        try {
          // const json = JSON.parse(data);
          // if (typeof json === "object" && json.plan_ids) continue;
          // // JSON이지만 단순 텍스트일 경우 스트림으로 처리
          // const text = String(json);
          // // if (json.plan_ids) continue; // JSON 데이터는 무시
          const json = JSON.parse(data);
          // if (typeof json === "object" && json.plan_ids) continue;
          // JSON이지만 단순 텍스트일 경우 스트림으로 처리

          if (json.plan_ids) continue;

          if (json.plans) {
            setRecommendedPlans(json.plans);
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
          // 텍스트 스트리밍 처리
          // if (!botMessageStarted) {
          //   setIsBotTyping(false);
          //   setMessages((prev) => [...prev, { from: "bot", text: data }]);
          //   botMessageStarted = true;
          // } else {
          //   setMessages((prev) =>
          //     prev.map((msg, i) =>
          //       i === prev.length - 1 && msg.from === "bot"
          //         ? { ...msg, text: String(msg.text ?? "") + String(data) }
          //         : msg
          //     )
          //   );
          //   console.log("data:", JSON.stringify(data)); // "2" 이렇게 잘 찍힘
          // }
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
        {/* 메시지 목록 렌더링 */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.from === "user" ? "user" : "bot"}`}
          >
            {/* <div className="message-bubble">{msg.text}</div> */}
            <div className="message-bubble">
              {msg.text.split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {/* 봇 타이핑 중일때 애니메이션 표시 */}
        {isBotTyping && (
          <div className="chat-message bot">
            <div className="message-bubble typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}

        {/* 요금제 카드 렌더링 */}
        {recommendedPlans.length > 0 && (
          <div className="plan-card-container">
            {recommendedPlans.map((plan, idx) => (
              <div className="plan-card" key={idx}>
                <div className="plan-name">{plan.plan_name.trim()}</div>
                <div className="plan-price">
                  {plan.plan_price.toLocaleString()}원
                </div>
                <div className="plan-description">{plan.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 입력창 영역 */}
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
