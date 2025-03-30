import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeals } from "./dealSlice";

const DealList = () => {
  const dispatch = useDispatch();
  const { deals, loading } = useSelector((state) => state.deals);

  useEffect(() => {
    dispatch(fetchDeals());
  }, [dispatch]);

  return (
    <div>
      <h2>Deals</h2>
      {loading ? <p>Loading...</p> : deals.map((deal) => (
        <div key={deal._id}>
          <h3>{deal.title}</h3>
          <p>{deal.description}</p>
          <p>Price: ${deal.price}</p>
        </div>
      ))}
    </div>
  );
};

export default DealList;
