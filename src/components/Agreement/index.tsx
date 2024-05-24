import React, {useState} from "react";
import "./index.css";

interface IPredefinedMessages {
  onSelect: (S: string) => void;
}

const PredefinedMessages = (props: IPredefinedMessages) => {
  const [selectedMessage, setSelectedMessage] = useState("");

  const messages = [
    "I am ashamed of my body",
    "I am facing panic attacks",
    "Someone close died recently",
    "I am feeling hopeless?",
    "I am not able to move on.",
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
