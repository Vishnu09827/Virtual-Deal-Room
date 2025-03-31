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

// router.get("/", authMiddleware, async (req, res) => {
//   client.get("deals", async (err, data) => {
//     if (data) return res.json(JSON.parse(data));

//     const deals = await Deal.find();
//     client.setex("deals", 3600, JSON.stringify(deals));
//     res.json(deals);
//   });
// });

// Create Deal
router.post(
  "/",
  authMiddleware,
  [
    body("title").notEmpty(),
    body("description").notEmpty(),
    body("price").isNumeric(),
    body("selectedId").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { role } = req.user;
      const userKey = role === "buyer" ? "seller" : "buyer";
      const data = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        [userKey]: req.body.selectedId,
      };
      const deal = new Deal({ ...data, [role]: req.user.userId });
      await deal.save();
      res.status(201).json(deal);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

router.put(
  "/:id",
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
      
      const updatedDeal = await Deal.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      if (!updatedDeal) {
        return res.status(404).json({ message: "Deal not found" });
      }

      res
        .status(200)
        .json({ message: "Deal updated successfully", data: updatedDeal });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    const deletedDeal = await Deal.findByIdAndDelete(req.params.id);

    if (!deletedDeal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    console.log("Deal deleted successfully:", deletedDeal);
    res.status(200).json({ message: "Deal deleted successfully", data: deletedDeal });
  } catch (error) {
    console.error("Error deleting Deal:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get Deals
router.get("/", authMiddleware, async (req, res) => {
  try {
    const deals = await Deal.find().populate("buyer seller", "name email");
    res.json(deals);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).populate(
      "buyer seller",
      "name email"
    );
    console.log("deal", deal);
    res.json(deal);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
