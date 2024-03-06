require("dotenv").config();
const mongoose = require("mongoose");
const mongoURI = process.env.mongoURI;
mongoose.set("strictPopulate", false);
const connectTomongo = async () => {
  await mongoose.connect(mongoURI);
  console.log("shy connect shu");
};
module.exports = connectTomongo;
