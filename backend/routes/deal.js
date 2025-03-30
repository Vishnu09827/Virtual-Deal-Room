const express = require("express");
const { body, validationResult } = require("express-validator");
const redis = require("redis");
const upload = require("../middlewares/upload");
const Deal = require("../models/Deal");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();
const client = redis.createClient();

router.post("/upload", authMiddleware, upload.single("file"), (req, res) => {
  res.json({ fileUrl: `/uploads/${req.file.filename}` });
});

router.get("/", authMiddleware, async (req, res) => {
  client.get("deals", async (err, data) => {
    if (data) return res.json(JSON.parse(data));

    const deals = await Deal.find();
    client.setex("deals", 3600, JSON.stringify(deals));
    res.json(deals);
  });
});

// Create Deal
router.post(
  "/",
  authMiddleware,
  [
    body("title").notEmpty(),
    body("description").notEmpty(),
    body("price").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const deal = new Deal({ ...req.body, buyer: req.user.userId });
      await deal.save();
      res.status(201).json(deal);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// Get Deals
router.get("/", authMiddleware, async (req, res) => {
  try {
    const deals = await Deal.find().populate("buyer seller", "name email");
    res.json(deals);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
