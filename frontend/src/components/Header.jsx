import { Button } from "@mui/material";
import { ExitToAppOutlined } from "@mui/icons-material";
import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import "../styles/Header.css";
import Notification from "./Notification";

const Header = () => {
  const dispatch = useDispatch();
  return (
    <div className="header-container">
      <h1 className="header-app-name">Virtual Deal Room</h1>
      <div className="header-utils">
        <Notification />
        <Button
          id="header-logout-btn"
          endIcon={<ExitToAppOutlined />}
          variant="contained"
          onClick={() => dispatch(logoutUser())}
        >
          LOGOUT
        </Button>
      </div>
    </div>
  );
};

export default Header;
