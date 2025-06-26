const mongoose = require("mongoose");
require("dotenv").config();

//function to connect to database
async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database is connected");
  } catch (e) {
    console.error("Mongo DB connection failed");
    process.exit(1);
  }
}

//export
module.exports = connectToDB;
