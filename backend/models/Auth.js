const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const AuthSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
const Auth = mongoose.model("auth", AuthSchema);
module.exports = Auth;
