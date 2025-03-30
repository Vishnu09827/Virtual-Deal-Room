import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./Auth.css";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "./authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
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
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextField
          id="register-form-email"
          label="Email"
          variant="outlined"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <TextField
          id="register-form-password"
          label="Password"
          variant="outlined"
          value={form.password}
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
            <MenuItem value={"Seller"}>Seller</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={handleRegister}>SUBMIT</Button>
        <p>
          Have an account ? <Link to="/login"> LogIn </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
