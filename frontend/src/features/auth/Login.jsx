import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import "./Auth.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="login-form-container">
      <div className="login-form-heading">LOGIN</div>
      <form className="login-form" onSubmit={handleLogin}>
        <TextField
          id="login-form-email"
          label="Email"
          variant="outlined"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          id="login-form-password"
          label="Password"
          variant="outlined"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button onClick={handleLogin} disabled={loading}>
          LOGIN
        </Button>
        <p>
          Don't have an account ? <Link to="/register"> SignIn </Link>
        </p>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
