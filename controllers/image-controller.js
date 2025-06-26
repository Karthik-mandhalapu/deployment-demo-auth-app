const Image = require("../models/image");
const { uploadToCloudinary } = require("../helpers/cloudinary-helper");
const image = require("../models/image");
const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "file is required. please upload a image",
      });
    }

    const { url, publicId } = await uploadToCloudinary(req.file.path);

    const newImage = await Image.create({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    res.status(201).json({
      success: true,
      message: "image uploaded successfully",
      image: newImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

//get all images
const getAllImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if (images) {
      res.status(200).json({
        success: true,
        currentPage: page,
        totalImages: totalImages,
        totalPages: totalPages,
        data: images,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "no images found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

//delete image
const deleteImage = async (req, res) => {
  try {
    //getting image id
    const imageId = req.params.id;
    const userId = req.userInfo.userId;

    //finding image
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "no image found with given id",
      });
    }

    //matching the user with uploadedBy
    if (userId !== image.uploadedBy.toString()) {
      return res.status(403).json({
        success: false,
        message: "you do not have permission to delete this image",
      });
    }

    //deleting from cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    //deleting from mongoDB
    await Image.findByIdAndDelete(imageId);

    res.status(201).json({
      success: true,
      message: "image deleted successfully",
      image: image,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

module.exports = {
  uploadImage,
  getAllImages,
  deleteImage,
};
