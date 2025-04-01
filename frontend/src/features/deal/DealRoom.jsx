import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { SendOutlined, UploadFile } from "@mui/icons-material";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { fetchDeals } from "./dealSlice";
import axios from "axios";
import { api } from "../../app/api/api";

const socket = io("http://localhost:3500");

const DealRoom = ({ deal, userType, setIsOpen }) => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);

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

    socket.on("document_uploaded", (newDoc) => {
      setDocuments((prev) => [...prev, newDoc]);
    });

    return () => {
      socket.emit("leave_room", deal[0]._id);
      socket.off("receive_message");
      socket.off("typing");
      socket.off("document_uploaded");
    };
  }, [deal, userType, dispatch]);

  useEffect(() => {
    if (!deal || !deal.length) return;
    setDocuments(deal[0].documents ?? []);
  }, [deal]);

  const onChange = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { room: deal[0]._id, name: userType });
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
    socket.emit("send_offer", { dealId: deal[0]._id, sender: userType, price });
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

  const uploadDocument = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("dealId", deal[0]._id);
    formData.append("uploader", userType);

    try {
      const response = await api.post("deals/upload", formData);
      socket.emit("document_uploaded", {
        dealId: deal[0]._id,
        ...response.data,
      });
      setDocuments([...documents, response.data]);
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // console.log("mes", messages);

  return (
    <div className="deal-room-container">
      <div className="deal-room-msg-container">
        {messages.map((msg, index) => (
          <p
            key={index}
            className={`deal-room-msg ${
              msg.type === "offer" ? "deal-room-offer-msg" : ""
            }`}
          >
            {msg.type === "offer" ? (
              <>
                <strong>
                  {msg.sender}: Offered ${msg.price}
                </strong>
                {userType !== msg.sender && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => acceptOffer(msg)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => rejectOffer(msg)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </>
            ) : msg.type === "info" ? (
              <>{msg.text}</>
            ) : (
              <>
                {msg.sender}: {msg.text}
              </>
            )}
          </p>
        ))}
        <p style={{ color: "gray" }}>{typing}</p>
      </div>

      {/* Message Input */}
      <div className="deal-room-input-btn-sec">
        <input
          className="deal-room-input"
          placeholder="Enter your message"
          value={message}
          onChange={onChange}
        />
        <Button
          startIcon={<SendOutlined />}
          variant="outlined"
          onClick={sendMessage}
        >
          Send
        </Button>
      </div>

      {/* Price Negotiation */}
      <div className="deal-room-input-btn-sec">
        <input
          type="number"
          className="deal-room-input"
          placeholder="Enter your price"
          value={price}
          onChange={onChangePrice}
        />
        <Button
          startIcon={<SendOutlined />}
          variant="outlined"
          onClick={sendOffer}
        >
          Send Offer
        </Button>
      </div>

      {/* Document Upload Section */}
      <div className="deal-room-input-btn-sec">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <Button
          startIcon={<UploadFile />}
          variant="outlined"
          onClick={uploadDocument}
        >
          Upload
        </Button>
      </div>

      {/* Display Uploaded Documents */}
      <div className="deal-documents">
        <h3>Uploaded Documents</h3>
        {documents.length > 0 ? (
          <ul>
            {documents.map((doc, index) => (
              <li key={index}>
                <a
                  href={`http://localhost:3500${doc.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {doc.filename}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No documents uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default DealRoom;
