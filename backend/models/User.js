const { mongoose, Schema } = require("mongoose");
const UserSchema = new Schema({
  userKey: {
    type: String,
    require: true,
  },
  cnic: {
    type: String,
    require: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  
  rank: String,
  badgeNumber: String,
  PS: {
    type: Schema.Types.ObjectId,
    name: Schema.name,
    ref: "policestations",
  },
});
const User = mongoose.model("user", UserSchema);
module.exports = User;
