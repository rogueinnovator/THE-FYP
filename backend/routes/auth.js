const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Auth = require("../models/Auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyuser = require("../middleware/fetchuser");
const IsAdmin = require("../middleware/admin");
const JWT_secret = process.env.JWT_secret;
// const User = require("../models/User");
// router.post(
//   "createadmin",
//   [
//     body("name").isLength({ min: 3 }),
//     body("email").isEmail(),
//     body("password").isLength({ min: 4 }),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(404).json({ errors: errors.array() });
//     }
//   }
// )
router.post(
  "/createuser",
  IsAdmin,
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 4 }),
  ],
  // IsAdmin,
  async (req, res) => {
    const { name, password, email } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    } //for authentication of admin

    try {
      let user = await Auth.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "a user with this email exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const secpass = await bcrypt.hash(password, salt);
      user = await Auth.create({
        name: name,
        email: email,
        password: secpass,
      });
      // await user.save();
      res.json(user);
    } catch (error) {
      res.status(500).send("server error");
    }
  }
);
router.delete("/deleteuser/:userId", IsAdmin, async (req, res) => {
  const userId = req.params.userId.trim();
  try {
    //find is used to retrieve multiple while findOne is used for single retrieval
    if (IsAdmin) {
      const user = await Auth.findById(userId);
      // console.log(user);
      // console.log(userId);
      if (userId !== "64a54e084bf7df4740213bc4") {
        if (user) {
          await Auth.findByIdAndDelete(userId);
          res.status(404).send("user deleted");
        } else {
          res.status(404).send("user dosent exist");
        }
      } else {
        res.status(404).send("can't delete admin account");
      }
    } else {
      res.status(401).send("unauthorize access !ADMIN");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error Occured");
  }
});
router.get("/getuser", verifyuser, async (req, res) => {
  try {
    const Id = req.user.id;
    const user = await Auth.findById(Id).select("-password");
    res.send({ success: true, user });
  } catch (error) {
    res.status(500).send("server error");
  }
});
router.get(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(500).send({ error: error.array() });
    }
    let isadmin = false;
    const { email, password } = req.body;
    if (password === "alchmh1islfail" && email === "police@gmail.com") {
      isadmin = true;
    }
    try {
      const user = await Auth.findOne({ email });
      if (!user) {
        return res.status(500).send("try to log in with correct credientials");
      }
      const passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare) {
        return res.status(500).send("try with a correct password");
      }
      const data = {
        user: { id: user.id, isAdmin: isadmin },
      };
      // console.log(data.user.isAdmin);
      const Auth_token = jwt.sign(data, JWT_secret);
      res.json(Auth_token);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  }
);
module.exports = router;
