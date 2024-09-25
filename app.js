var createError = require("http-errors");
var express = require("express");
var app = express();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const expressSession = require("express-session");
const passport = require("passport");
const userModel = require("./models/user.schema");
const flash = require("connect-flash");
const sendEmail = require("./services/email");

// env config
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

//db connection
require("./config/db");

var indexRouter = require("./routes/index.routes");
var expenseRouter = require("./routes/expenses.routes");
var userRouter = require("./routes/user.routes");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// logger
app.use(logger("dev"));
// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// static route
app.use(express.static(path.join(__dirname, "public")));

// passport & session config
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
  })
);

// flash
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// base routes
app.use("/", indexRouter);
app.use("/expense", expenseRouter);
app.use("/user", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
  res.render("error", { title: "Expense Tracker | Error" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

module.exports = app;
