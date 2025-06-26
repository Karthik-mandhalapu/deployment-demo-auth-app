const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth-middleware");

router.get("/home", authMiddleware, (req, res) => {
  const { userId, userName, role } = req.userInfo;
  res.status(200).json({
    message: "Welcome to our Home page",
    user: {
      _id: userId,
      userName,
      role,
    },
  });
});

module.exports = router;
