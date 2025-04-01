const express = require("express");
const { body } = require("express-validator");
const redis = require("redis");
const path = require("path");
const fs = require("fs");
const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/auth");
const dealController = require("../controllers/dealController");

const router = express.Router();
const client = redis.createClient();

router.post("/upload", upload.single("file"), dealController.uploadDocuments);

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
  dealController.createDeal
);

router.put(
  "/:id",
  authMiddleware,
  [
    body("title").notEmpty(),
    body("description").notEmpty(),
    body("price").isNumeric(),
  ],
  dealController.updateDeal
);

router.delete("/:id", dealController.deleteDeal);

// Get Deals
router.get("/", authMiddleware, dealController.getDeals);

router.get("/:id", authMiddleware, dealController.getDeal);

module.exports = router;
