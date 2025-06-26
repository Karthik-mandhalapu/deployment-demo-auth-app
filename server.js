require("dotenv").config();
const express = require("express");
const connect = require("./database/db");
const authRouter = require("./routes/auth-routes");
const userRouter = require("./routes/home-routes");
const adminRouter = require("./routes/admin-routes");
const imageRouter = require("./routes/image-routes");

//creating app
const app = express();

//connecting to database
connect();

//middleware
app.use(express.json());

//creating routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/image", imageRouter);

//setting up server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is listening to port ${PORT}`);
});
