const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controllers/auth-controllers");
//creating router
const router = express.Router();

//creating route

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/changepassword", authMiddleware, changePassword);

//export
module.exports = router;
