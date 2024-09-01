var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Expense Tracker | Homepage", user: req.user });
});

router.get("/about", function (req, res, next) {
  res.render("about", { title: "Expense Tracker | About", user: req.user });
});

router.get("/createsession", (req, res, next) => {
  req.session.expenseLogin = true;
  res.status(200).json({ message: "Session Created" });
});

router.get("/checksession", (req, res, next) => {
  console.log(req.session);
  if (req.session.expenseLogin) {
    res.status(200).json({ message: "Session Exists" });
  } else {
    res.status(401).json({ message: "Session Expired" });
  }
});

router.get("/destroysession", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Session Destroyed" });
  });
});

router.get("/createcookie", (req, res, next) => {
  res.cookie("expenseCookie", true, {
    maxAge: 900000,
    secure: true,
    httpOnly: true,
  });
  res.status(200).json({ message: "Cookie Created" });
});

router.get("/checkcookie", (req, res, next) => {
  console.log(req.cookies);
  if (req.cookies.expenseCookie) {
    res.status(200).json({ message: "Cookie Exists" });
  } else {
    res.status(401).json({ message: "Cookie Expired" });
  }
});

router.get("/destroycookie", (req, res, next) => {
  res.clearCookie("expenseCookie");
  res.status(200).json({ message: "Cookie Destroyed" });
});

router.get("/createflash", (req, res, next) => {
  req.flash("success", "Flash message created successfully!");
  res.status(200).json("Flash Message Created");
});

router.get("/checkflash", (req, res, next) => {
  console.log(req.flash());
  res.status(200).json({ message: "Flash Message Checked" });
});

router.get("/destroyflash", (req, res, next) => {
  req.flash("success", null);
  res.status(200).json({ message: "Flash Message Destroyed" });
});

module.exports = router;
