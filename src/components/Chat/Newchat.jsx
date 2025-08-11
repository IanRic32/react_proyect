import React from "react";
import "../../styles/newchat.css";

export default function NewChatIcon() {
  return (
    <div className="chat-icon-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="48"
        height="48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="chat-icon">
          
        <path d="M8 32C8 17.64 20.64 6 36 6s28 11.64 28 26-12.64 26-28 26H16L8 62z" />
      </svg>
      <div className="chat-dots">
        <span className="dot dot1"></span>
        <span className="dot dot2"></span>
        <span className="dot dot3"></span>
      </div>
    </div>
  );
}
