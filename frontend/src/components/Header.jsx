import { Button } from "@mui/material";
import { ExitToAppOutlined } from "@mui/icons-material";
import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import "../styles/Header.css";
import Notification from "./Notification";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="header-container">
      <h1 className="header-app-name" onClick={() => navigate("/")}>
        Virtual Deal Room
      </h1>
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
