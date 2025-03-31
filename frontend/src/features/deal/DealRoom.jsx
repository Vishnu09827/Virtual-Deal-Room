import { Button } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { SendOutlined } from "@mui/icons-material";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { fetchDeals, updateDeal } from "./dealSlice";

const socket = io("http://localhost:3500");

const DealRoom = ({ deal, userType, setIsOpen }) => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!deal || !deal.length) return;

    socket.emit("join_room", { dealId: deal[0]._id, userType });

    socket.on("receive_message", (data) => {
      setTyping("");
      setMessages((prev) => [...prev, data]);
    });

    socket.on("typing", (name) => {
      setTyping(`${name} is typing...`);
    });

    socket.on("deal_updated", (updateddeal) => {
      dispatch(fetchDeals());
      setIsOpen(false);
    });

    return () => {
      socket.emit("leave_room", deal[0]._id);
      socket.off("receive_message");
      socket.off("typing");
    };
  }, [deal, userType, dispatch]);

  const onChange = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", {
      room: deal[0]._id,
      name: userType,
    });
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    const messageData = {
      dealId: deal[0]._id,
      sender: userType,
      text: message,
    };

    socket.emit("send_message", messageData);
    setMessage("");
  };

  const onChangePrice = (e) => {
    setPrice(e.target.value);
  };

  const sendOffer = () => {
    if (!price) return;
    socket.emit("send_offer", {
      dealId: deal[0]._id,
      sender: userType,
      price,
    });
    setPrice("");
  };

  const acceptOffer = (offer) => {
    socket.emit("accept_offer", {
      dealId: deal[0]._id,
      sender: userType,
      price: offer.price,
    });
  };

  const rejectOffer = (offer) => {
    socket.emit("reject_offer", {
      dealId: deal[0]._id,
      sender: userType,
      price: offer.price,
    });
  };

  // console.log("mes", messages);

  return (
    <div className="deal-room-container">
      <div className="deal-room-msg-container">
        {messages.map((msg, index) => (
          <p
            key={index}
            style={{ color: msg.type === "info" ? "gray" : "black" }}
            className="deal-room-msg"
          >
            {msg.type === "offer" ? (
              <strong>
                {msg.sender}: Offered ${msg.price}
              </strong>
            ) : msg.type === "chat" ? (
              <>
                {msg.sender}: {msg.text}
              </>
            ) : (
              <em>{msg.text}</em>
            )}
            {msg.type === "offer" && userType !== msg.sender && (
              <>
                <Button onClick={() => acceptOffer(msg)}>Accept</Button>
                <Button onClick={() => rejectOffer(msg)}>Reject</Button>
              </>
            )}
          </p>
        ))}
        <p style={{ color: "gray" }}>{typing}</p>
      </div>
      <div className="deal-room-input-btn-sec">
        <input
          className="deal-room-input"
          placeholder="Enter your message"
          value={message}
          onChange={onChange}
        />
        <Button
          id="deal-room-btn"
          startIcon={<SendOutlined />}
          variant="outlined"
          onClick={sendMessage}
        >
          Send
        </Button>
      </div>
      <div className="deal-room-input-btn-sec">
        <input
          type="number"
          className="deal-room-input"
          placeholder="Enter your price"
          value={price}
          onChange={onChangePrice}
        />
        <Button
          id="deal-room-btn"
          startIcon={<SendOutlined />}
          variant="outlined"
          onClick={sendOffer}
        >
          Send Offer
        </Button>
      </div>
    </div>
  );
};

export default DealRoom;
