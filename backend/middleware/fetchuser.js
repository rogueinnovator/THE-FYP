const jwt = require("jsonwebtoken");
const JWT_secret = process.env.JWT_secret;
const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .send({ error: "please authenticate using a valid key" });
  }
  try {
    const data = jwt.verify(token, JWT_secret);
    req.user = data.user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).send({ error: "invalid token" });
    }
    return res.status(500).send({ error: "internal server error " });
  }
};
module.exports = fetchuser;
