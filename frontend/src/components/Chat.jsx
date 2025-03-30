import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3500");

const Chat = ({ dealId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("joinRoom", dealId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [dealId]);

  const sendMessage = () => {
    socket.emit("sendMessage", { dealId, message });
    setMessages((prev) => [...prev, message]);
    setMessage("");
  };

  return (
    <div>
      <h3>Chat</h3>
      <div>
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
