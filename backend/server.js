require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDatabase = require("./config/dbConnection");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");

connectDatabase();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));
// Routes
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);
const PORT = process.env.PORT || 3500;

mongoose.connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB database connection error: ", err);
  logEvents(
    `${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrorLog.log"
  );
});
