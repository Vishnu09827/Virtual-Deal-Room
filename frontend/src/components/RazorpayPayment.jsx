import { api } from "../app/api/api";

const RazorpayPayment = ({ amount, dealId }) => {
  const btnStyle = {
    padding: "8px 15px",
    fontSize: "14px",
    textTransform: "none",
    borderRadius: "4px",
    background: "#1976d2",
    color: "white",
    border:0,
    cursor:"pointer"
  };

  const handlePayment = async () => {
    try {
      const { data } = await api.post("payment/create-razor-order", {
        amount,
        currency: "INR",
        dealId,
      });

      const options = {
        key: import.meta.env.REACT_APP_RAZORPAY_KEY_ID,
        key_secret: import.meta.env.REACT_APP_RAZORPAY_KEY_SECRET,
        amount: data.amount,
        currency: "INR",
        name: "Virtual Deal Room",
        description: `Payment for Deal #${dealId}`,
        order_id: data.id,
        handler: function (response) {
          alert(
            "Payment Successful! Payment ID: " + response.razorpay_payment_id
          );
        },
        theme: { color: "#1976d2" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("payment err", err);
    }
  };

  return (
    <button style={btnStyle} onClick={handlePayment}>
      Pay ₹{amount}
    </button>
  );
};

export default RazorpayPayment;
