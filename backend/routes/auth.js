const express = require("express");
const { body } = require("express-validator");
const User = require("../models/User");
const authMiddleware = require("../middlewares/auth");
const authController = require("../controllers/authController");

const router = express.Router();

//User Registration
router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["buyer", "seller"]),
  ],
  authController.register
);

//User Login
router.post("/login", authController.login);

//Get Current User
router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json(user);
});

//Get All User or role by
router.get("/users",authMiddleware,authController.fetchUsers)

module.exports = router;
