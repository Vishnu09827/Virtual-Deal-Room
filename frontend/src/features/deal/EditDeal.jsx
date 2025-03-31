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
import { useNavigate, useParams } from "react-router-dom";
import { fetchDeal, updateDeal } from "./dealSlice";
import "./Deal.css";
import { fetchUsers } from "../auth/authSlice";

const EditDeal = () => {
  const { did } = useParams();
  const navigate = useNavigate();
  const { users, user } = useSelector((state) => state.auth);
  const { deal } = useSelector((state) => state.deals);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (deal) {
      setTitle(deal.title || "");
      setDescription(deal.description || "");
      setPrice(deal.price || "");
      setSelectedId(
        user.role === "buyer" ? deal?.seller?._id : deal?.buyer?._id || ""
      );
    }
  }, [deal, user.role]);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchDeal(did));
  }, [dispatch, did]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { role } = user;
      const userKey = role === "buyer" ? "seller" : "buyer";
      const payload = {
        _id: did,
        title,
        description,
        price,
        [userKey]: selectedId,
      };
      const data = await dispatch(updateDeal(payload)).unwrap();
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
      <h2 className="deal-heading">Update Deal</h2>
      <form onSubmit={handleUpdate} className="deal-form-container">
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
            Update Deal
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditDeal;
