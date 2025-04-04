import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createDeal } from "./dealSlice";
import "./Deal.css";
import { fetchUsers } from "../auth/authSlice";

const CreateDeal = () => {
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.auth);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await dispatch(
        createDeal({ title, description, price, selectedId })
      ).unwrap();
      navigate("/deals");
      setTitle("");
      setDescription("");
      setPrice("");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="deal-container">
      <h2 className="deal-heading">Create a New Deal</h2>
      <form onSubmit={handleSubmit} className="deal-form-container">
        <TextField
          id="deal-title-input"
          variant="outlined"
          label="Title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <TextField
          id="deal-description-input"
          variant="outlined"
          placeholder="Description"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          required
        />
        <TextField
          id="deal-price-input"
          variant="outlined"
          type="number"
          placeholder="Price"
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <FormControl fullWidth>
          <InputLabel id="register-form-role">User</InputLabel>
          <Select
            label="User"
            value={selectedId}
            placeholder="Select seller/buyer"
            required
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {users?.map((user) => (
              <MenuItem value={user._id}>{user.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="deal-btn-sec">
          <Button
            id="deal-cancel-btn"
            variant="outlined"
            onClick={() => navigate("/deals")}
          >
            Cancel
          </Button>
          <Button type="submit" variant="outlined">
            Add Deal
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateDeal;
