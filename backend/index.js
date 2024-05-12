// const connectTomongo = require("./db");
const express = require("express");
require("dotenv").config();
// connectTomongo();
const app = express();
PORT = process.env.PORT;
app.use(express.json());
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/user", require("./routes/user"));
// app.use("/api/ps", require("./routes/ps"));
app.use("/api/blockchain", require("./routes/blockchain"));
app.listen(PORT, () => {
  console.log("app is listening on port " + PORT);
});
