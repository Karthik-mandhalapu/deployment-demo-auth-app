const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const {
  uploadImage,
  getAllImages,
  deleteImage,
} = require("../controllers/image-controller");

router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImage
);
router.get("/get", authMiddleware, getAllImages);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteImage);

module.exports = router;
