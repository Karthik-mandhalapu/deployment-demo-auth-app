const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");

router.get("/home", authMiddleware, adminMiddleware, (req, res) => {
  //   const { userId, userName, role } = req.userInfo;
  res.status(200).json({
    message: "Welcome to Admin Home page",
  });
});

module.exports = router;
