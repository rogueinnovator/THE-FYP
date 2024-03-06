const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const { verify } = require("jsonwebtoken");
router.post(
  "/createemp",
  [body("name").isEmpty(), body("cinc").isNumeric(), body("email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.ststus(400).json({ errors: errors.array() });
    }
    let newuser = await User.findOne({ cnic: req.body.cnic });
    if (newuser) {
      return res.status(400).json({ errors: "a user with this CNIC exist" });
    }
    try {
      const { name, cnic, email, rank, policestationId } = req.body;
      newuser = await User.create({
        name,
        cnic,
        email,
        rank,
        PS: policestationId,
      });
      res.json(newuser);
    } catch (error) {}
  }
);
router.get("/employee/:policestationId", async (req, res) => {
  const policestationId = req.params.policestationId;

  try {
    let user = await User.find({ PS: policestationId })
      .populate("policestations")
      // .populate({ path: "policestations",select:"name" })

      .sort("policestations.name")
      .exec();
    console.log(user);
    res.status(200).json(user);
    console.log(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/employedetails/:userId", verify, async (req, res) => {
  try {
    const UserId = req.params.userId.trim();
    const user = await User.findById(UserId).populate("PS");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server ERROR" });
  }
});
module.exports = router;
