import React, {useState} from "react";
import "./index.css";

interface IPredefinedMessages {
  onSelect: (S: string) => void;
}

const PredefinedMessages = (props: IPredefinedMessages) => {
  const [selectedMessage, setSelectedMessage] = useState("");

  const messages = [
    "How are you feeling today?",
    "How can I help you?",
    "I am here. Tell me what happened?",
    "How can I help you? You are not alone in this.",

  ];

  return (
    <div className="PredefinedMessages-container">
      <div className="font-primary font-thick m4">Start a chat</div>
      <div className="font-primary m4">
        Here are some questions you can start with{" "}
      </div>
      <div className="dflex" style={{flexWrap: "wrap"}}>
        {messages.map((message, index) => (
          <div
            className="PredefinedMessages-message font-primary"
            onClick={() => props.onSelect(message)}
            key={index}
          >
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredefinedMessages;
