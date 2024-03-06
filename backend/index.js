const connectTomongo = require("./db");
const express = require("express");
connectTomongo();
const app = express();
const port = process.env.port;
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/ps", require("./routes/ps"));
app.listen(port, () => {
  console.log("app is listening on port " + port);
});
