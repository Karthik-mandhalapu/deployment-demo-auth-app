const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register user
const registerUser = async (req, res) => {
  try {
    //collecting user given data
    const { userName, email, password, role } = req.body;

    //checking uniqueness
    const unique = await User.findOne({ $or: [{ userName }, { email }] });
    if (unique) {
      return res.status(400).json({
        success: false,
        message: "user already exits! try a diffent name",
      });
    }

    //hashinng password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating user
    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    if (newUser) {
      res.status(201).json({
        success: true,
        message: "created new user successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "unable to create new user please try again",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      mesage: "something went wrong! try again",
    });
  }
};

//login user
const loginUser = async (req, res) => {
  try {
    //collecting data from user
    const { userName, password } = req.body;

    //checking for correct username
    const user = await User.findOne({ userName });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "given user doesnot exit! enter a valid username",
      });
    }

    //checking for correct password
    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      res.status(400).json({
        success: false,
        message: "incorrect password!please enter correct password",
      });
    }

    //creating user token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        userName: user.userName,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30m" }
    );

    //returning access token
    res.status(200).json({
      success: true,
      message: "logged in successfully",
      accessToken,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: true,
      mesage: "something went wrong! try again",
    });
  }
};

//change password
const changePassword = async (req, res) => {
  try {
    //getting user details
    const userId = req.userInfo.userId;

    //getting old and new passwords
    const { oldPassword, newPassword } = req.body;

    //checking if user exits or not
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user doesnt exist",
      });
    }

    //checking if old password is correct or not
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "current password doesnot match",
      });
    }

    //hashing new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    //updating DB with new password
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "pasword changed successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: true,
      mesage: "something went wrong! try again",
    });
  }
};

//export
module.exports = { registerUser, loginUser, changePassword };
