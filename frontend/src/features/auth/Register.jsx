import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "./authSlice";
import "./Auth.css";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await dispatch(registerUser(form)).unwrap();
      if (data) navigate("/login");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="register-form-container">
      <div className="register-form-heading">CREATE AN ACCOUNT</div>
      <form className="register-form" onSubmit={handleRegister}>
        <TextField
          id="register-form-username"
          label="UserName"
          variant="outlined"
          value={form.name}
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          id="register-form-email"
          label="Email"
          variant="outlined"
          value={form.email}
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          id="register-form-password"
          label="Password"
          variant="outlined"
          value={form.password}
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <FormControl fullWidth>
          <InputLabel id="register-form-role">Role</InputLabel>
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <MenuItem value={"buyer"}>Buyer</MenuItem>
            <MenuItem value={"seller"}>Seller</MenuItem>
          </Select>
        </FormControl>
        <Button type="sumbit" disabled={loading}>
          SUBMIT
        </Button>
        <p>
          Have an account ? <Link to="/login"> LogIn </Link>
        </p>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
