import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearNotifications } from "../slices/notificationSlice";
import "../styles/Notification.css";
import { Notifications } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const Notification = () => {
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  return (
    <div className="notification-wrapper">
      {/* Toggle Button */}
      <IconButton color="primary" id="notif-btn" onClick={() => setVisible(!visible)}>
        <Notifications/> {notifications.length}
      </IconButton>

      {/* Notification List */}
      {visible && (
        <div className="notification-container">
          <h3>Notifications</h3>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notif, index) => (
                <li
                  key={index}
                  className={`notification-item ${notif.type.toLowerCase()}`}
                >
                  <strong>{notif.type}</strong>: {notif.message}
                </li>
              ))}
            </ul>
          ) : (
            <p>No new notifications</p>
          )}
          <button onClick={() => dispatch(clearNotifications())}>Clear</button>
        </div>
      )}
    </div>
  );
};

export default Notification;
