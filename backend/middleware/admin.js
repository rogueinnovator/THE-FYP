const jwt = require("jsonwebtoken");
const JWT_secret = process.env.JWT_secret;

const admin = (req, res, next) => {
  const token = req.header("auth-token");

  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid key" });
  }

  try {
    const data = jwt.verify(token, JWT_secret);
    const { isAdmin } = data.user;
    console.log("isadmin:",isAdmin);
    if (!isAdmin) {
      return res
        .status(403)
        .send({ error: "Access denied. Admin authorization required" });
    }

    req.user = data.user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).send({ error: "Invalid token" });
    }
    return res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = admin;
