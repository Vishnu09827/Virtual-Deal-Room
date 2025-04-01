const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorOrder = async (req, res) => {
  try {
    const { amount, currency, dealId } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt: `deal_${dealId}`,
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createRazorOrder };
