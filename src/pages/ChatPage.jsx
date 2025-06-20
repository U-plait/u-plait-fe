import React, { useState, useRef, useEffect } from "react";
import "../styles/chat.css";
import { fetchWithAuth } from "../api/fetchClient";
// import { useNavigate } from "react-router-dom";

const CHATBOT_URL = process.env.REACT_APP_CHATBOT_URL;

const ChatPage = () => {
  // const navigate = useNavigate();
  const [messages, setMessages] = useState([{ from: "bot", text: "" }]);
  const [query, setQuery] = useState("");
  const [isWelcomeTyping, setIsWelcomeTyping] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const messagesEndRef = useRef(null);

  // 컴포넌트 첫 렌더링 시 인사말 타이핑 효과
  useEffect(() => {
    if (messages.length > 1) return;

    const welcomeMessage = " 안녕하세요 고객님, 무엇을 도와드릴까요?";
    let index = 0;

    setIsWelcomeTyping(true);

    const interval = setInterval(() => {
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 && msg.from === "bot"
            ? {
                ...msg,
                text: String(msg.text ?? "") + String(welcomeMessage[index]),
              }
            : msg
        )
      );
      index++;

      if (index === welcomeMessage.length - 1) {
        clearInterval(interval);
        setIsWelcomeTyping(false);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [messages.length]);

  // 스크롤을 맨 아래로 이동시키는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 요금제 카드를 클릭하면 상세 페이지를 새 탭에서 엽니다
  const handleCardClick = (plan) => {
    const dtype = plan.dtype?.slice(0, -4).toLowerCase(); // "MobilePlan" → "mobile"
    const url = `/${dtype}/plan/${plan.id}`;
    window.open(url, "_blank"); // 새 탭에서 열기
  };

  // 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  // 요금제 추천 카드에서 이전 버튼
  const handlePrev = () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.from === "plan" && lastMessage.plans?.length) {
      setCurrentPlanIndex((prev) =>
        prev === 0 ? lastMessage.plans.length - 1 : prev - 1
      );
    }
  };

  // 요금제 추천 카드에서 다음 버튼
  const handleNext = () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.from === "plan" && lastMessage.plans?.length) {
      setCurrentPlanIndex((prev) =>
        prev === lastMessage.plans.length - 1 ? 0 : prev + 1
      );
    }
  };

  // 메시지 전송 및 챗봇 응답 스트리밍 처리
  const handleSend = async () => {
    if (!query.trim()) return;

    // 사용자의 메시지를 추가
    setMessages((prev) => [...prev, { from: "user", text: query }]);
    setQuery("");
    setIsBotTyping(true);

    // 챗봇 API에 POST 요청
    const response = await fetchWithAuth(`${CHATBOT_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let botMessageStarted = false;
    let emptyDataCount = 0; // 빈 data 카운트

    // 스트리밍으로 한 글자씩 받아서 처리
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

        // 빈 data 처리 (띄어쓰기/줄바꿈)
        if (data === "") {
          emptyDataCount++;
          continue;
        }
        if (emptyDataCount === 1) {
          // 한 번 비었으면 공백 추가
          if (!botMessageStarted) {
            setIsBotTyping(false);
            setMessages((prev) => [...prev, { from: "bot", text: " " }]);
            botMessageStarted = true;
          } else {
            setMessages((prev) =>
              prev.map((msg, i) =>
                i === prev.length - 1 && msg.from === "bot"
                  ? { ...msg, text: String(msg.text ?? "") + " " }
                  : msg
              )
            );
          }
          emptyDataCount = 0;
          // 다음 data 처리로 넘어감
          continue;
        } else if (emptyDataCount >= 2) {
          // 두 번 이상 비었으면 줄바꿈 추가
          if (!botMessageStarted) {
            setIsBotTyping(false);
            setMessages((prev) => [...prev, { from: "bot", text: "\n\n" }]);
            botMessageStarted = true;
          } else {
            setMessages((prev) =>
              prev.map((msg, i) =>
                i === prev.length - 1 && msg.from === "bot"
                  ? { ...msg, text: String(msg.text ?? "") + "\n\n" }
                  : msg
              )
            );
          }
          emptyDataCount = 0;
          //continue;
        }
        emptyDataCount = 0;

        // 일반 텍스트/JSON 응답 처리
        try {
          const json = JSON.parse(data);

          if (json.plan_ids) continue; // plan_ids는 무시

          if (json.plans) {
            // 요금제 추천 응답
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
          // 파싱이 안 되면 일반 텍스트로 처리
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

  // 요금제 타입에 따라 이모지 반환
  const getPlanEmoji = (dtype) => {
    switch (dtype) {
      case "MobilePlan":
        return "📱";
      case "InternetPlan":
        return "🌐";
      case "IPTVPlan":
        return "📺";
      default:
        return "";
    }
  };

  // 마크다운 스타일 굵은 글씨를 처리하는 함수
  const renderMarkdownText = (text) => {
    return text.split("\n").map((line, lineIndex) => (
      <React.Fragment key={lineIndex}>
        {line.split(/(\*\*.*?\*\*)/g).map((part, index) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            const boldText = part.slice(2, -2);
            return <strong key={index}>{boldText}</strong>;
          }
          return part;
        })}
        {lineIndex < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {/* 메시지 목록 렌더링 */}
        {messages.map((msg, idx) => {
          if (msg.from === "plan") {
            // 요금제 추천 카드 렌더링
            return (
              <div className="plan-slide-wrapper" key={`plan-${idx}`}>
                <button className="arrow-button" onClick={handlePrev}>
                  ◀
                </button>
                <div
                  className="plan-card"
                  onClick={() => handleCardClick(msg.plans[currentPlanIndex])}
                  style={{ cursor: "pointer" }}
                >
                  <div className="plan-card-header">
                    <div className="plan-name">
                      {getPlanEmoji(msg.plans[currentPlanIndex].dtype)}{" "}
                      {msg.plans[currentPlanIndex].plan_name.trim()}
                    </div>
                    <div className="plan-price">
                      {msg.plans[currentPlanIndex].plan_price.toLocaleString()}
                      원
                    </div>
                  </div>
                  <div className="plan-description">
                    {renderMarkdownText(
                      msg.plans[currentPlanIndex].description
                    )}
                  </div>
                </div>
                <button className="arrow-button" onClick={handleNext}>
                  ▶
                </button>
              </div>
            );
          }

          // 일반 메시지(사용자/봇) 렌더링
          return (
            <div
              key={idx}
              className={`chat-message ${msg.from === "user" ? "user" : "bot"}`}
            >
              <div className="message-bubble">
                {renderMarkdownText(msg.text)}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
        {/* 챗봇이 답변 중일 때 타이핑 효과 */}
        {isBotTyping && !isWelcomeTyping && (
          <div className="chat-message bot">
            <div className="message-bubble typing">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        )}
      </div>

      {/* 입력창 영역 */}
      <div className="input-area">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="메시지를 입력하세요"
          disabled={isBotTyping}
        />
        <button onClick={handleSend} disabled={isBotTyping}>
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
