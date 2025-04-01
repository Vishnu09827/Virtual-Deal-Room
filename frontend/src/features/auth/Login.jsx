import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./authSlice";
import "./Auth.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user && localStorage.getItem("token")) {
      navigate("/deals");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(form)).unwrap();
      navigate("/deals");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials! Please try again.");
    }
  };

  return (
    <div className="login-form-container">
      <h2 className="login-form-heading">LOGIN</h2>
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
        <Button onClick={handleLogin} variant="contained" disabled={loading}>
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
