const express = require("express");
const { body } = require("express-validator");
const redis = require("redis");
const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/auth");
const dealController = require("../controllers/dealController");
const chatController = require("../controllers/chatController");

const router = express.Router();
const client = redis.createClient();

router.post("/upload", upload.single("file"), dealController.uploadDocuments);

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

//Chat routes
router.post("/chat", authMiddleware, chatController.saveChat);

router.get("/chat/:dealId", authMiddleware, chatController.getChatHistory);
router.get("/chat/read/:messageId", authMiddleware, chatController.getChatHistory);

module.exports = router;
