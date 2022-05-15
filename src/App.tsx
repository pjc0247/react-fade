import React, { useState } from "react";
import styled from "styled-components";

import { FadeDiv } from "./component/FadeDiv";

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const onSendMessage = (message: string) => {
    setMessages((prev) => [...prev, message]);
  };
  const onRemoveMessage = (message: string) => {
    setMessages((prev) => prev.filter((x) => x !== message));
  };

  return (
    <div className="App">
      <Messages messages={messages} onRemoveMessage={onRemoveMessage} />
      <Input onSubmit={onSendMessage} />
    </div>
  );
};

interface MessagesProps {
  messages: string[];
  onRemoveMessage: (x: string) => void;
}
const Messages = ({ messages, onRemoveMessage }: MessagesProps) => {
  return (
    <div>
      {messages.map((x) => (
        <MessageBubble key={x}>
          {x} <button onClick={() => onRemoveMessage(x)}>X</button>
        </MessageBubble>
      ))}
    </div>
  );
};

interface InputProps {
  onSubmit: (message: string) => void;
}
const Input = ({ onSubmit }: InputProps) => {
  const [value, setValue] = useState("");

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button
        onClick={() => {
          onSubmit(value);
          setValue("");
        }}
      >
        send
      </button>
    </div>
  );
};

const MessageBubble = styled(FadeDiv)`
  max-width: 240px;

  border: 1px solid black;
  border-radius: 8px;

  padding: 4px;
`;

export default App;
