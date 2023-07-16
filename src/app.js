/* eslint-disable no-unused-vars */
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog");

const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

const app = express();

app.use(compression()); // Compress all routes
// NOTE: For a high-traffic website in production you wouldn't use this middleware.
// Instead, you would use a reverse proxy like Nginx.

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
});
// Apply rate limiter to all requests
app.use(limiter);

// Set up mongoose connection
// eslint-disable-next-line import/order
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
// Defined in .env
const mongoDB = process.env.MONGODB_URI;
async function main() {
  console.log(mongoDB);
  console.log(process.env.MONGODB_URI);
  console.log("here");
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
