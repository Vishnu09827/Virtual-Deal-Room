import { Button } from "@mui/material";
import { ExitToAppOutlined } from "@mui/icons-material";
import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import "../styles/Header.css"

const Header = () => {
  const dispatch = useDispatch();
  return (
    <div className="header-container">
      <p className="header-app-name">App name</p>
      <Button
        id="header-logout-btn"
        endIcon={<ExitToAppOutlined />}
        variant="contained"
        onClick={() => dispatch(logoutUser())}
      >
        LOGOUT
      </Button>
    </div>
  );
};

export default Header;
