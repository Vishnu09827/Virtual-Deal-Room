import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Drawer, IconButton } from "@mui/material";
import { AddCircle, Delete } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import DealRoom from "./DealRoom";
import { deleteDeal, fetchDeals } from "./dealSlice";

const DealList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    deals,
    loading,
    error: dealError,
  } = useSelector((state) => state.deals);
  const { user, error } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [deal, setDeal] = useState(null);

  useEffect(() => {
    dispatch(fetchDeals());
  }, [dispatch]);

  useEffect(() => {
    if (error === "Unauthorized") {
      navigate("/login");
    }
  }, [error, navigate]);

  const onDeal = (e, dealId) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(true);
    const deal = deals.filter((deal) => deal._id === dealId);
    setDeal(deal);
  };

  const onDeleteDeal = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(deleteDeal(id));
  };

  return (
    <div className="deals-container">
      <div className="deals-header-sec">
        <h2 className="deal-header">Deals</h2>
        <Button
          variant="outlined"
          onClick={() => navigate("/deals/new")}
          startIcon={<AddCircle />}
        >
          Create Deal
        </Button>

        {isOpen && (
          <Drawer open={isOpen} onClose={() => setIsOpen(false)} anchor="right">
            <DealRoom deal={deal} userType={user.role} setIsOpen={setIsOpen}/>
          </Drawer>
        )}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        deals.map((deal) => (
          <Link
            to={`/deals/${deal._id}`}
            key={deal._id}
            className="deal-card-container"
          >
            <h3 className="deal-title">{deal.title}</h3>
            <p className="deal-description">{deal.description}</p>
            <p className="deal-price">
              <strong>Price:</strong> ${deal.price}
            </p>
            <p className="deal-buyer">
              <strong>Buyer:</strong> {deal.buyer?.name}
            </p>
            <p className="deal-seller">
              <strong>Seller:</strong> {deal.seller?.name}
            </p>
            <Button
              id="deal-card-btn"
              variant="contained"
              onClick={(e) => onDeal(e, deal._id)}
            >
              Negotiate
            </Button>
            <IconButton
              id="deal-card-delete-btn"
              onClick={(e) => onDeleteDeal(e, deal._id)}
            >
              <Delete color="error" />
            </IconButton>
          </Link>
        ))
      )}
    </div>
  );
};

export default DealList;
