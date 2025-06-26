const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  //getting bearer from request
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  //obtaining the token
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided",
    });
  }

  //decode the token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedToken);
    req.userInfo = decodedToken;

    next();
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Access denied. Some error occured",
    });
  }
};

module.exports = authMiddleware;
