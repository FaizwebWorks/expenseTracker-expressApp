var express = require("express");
var router = express.Router();
const userModel = require("../models/user.schema");

const passport = require("passport");
const localStrategy = require("passport-local");
const { isLoggedIn } = require("../middlewares/auth.middleware");
passport.use(new localStrategy(userModel.authenticate()));
// passport.use(User.createStrategy()); // crediential other than username

/* GET home page. */
router.get("/signup", function (req, res, next) {
  res.render("signupuser", {
    title: "Expense Tracker | signup",
    user: req.user,
  });
});

router.post("/signup", async function (req, res, next) {
  try {
    var { username, email, password } = req.body;
    await userModel.register({ username, email }, password);

    // to direct signin and redirect to profile page
    // await UserSchema.authenticate(username, password);
    // res.redirect("/user/profile");
    res.redirect("/user/signin");
  } catch (error) {
    next(error);
  }
});

router.get("/signin", function (req, res, next) {
  res.render("signinuser", { title: "Expense Tracker | Signin", user: req.user, });
});

// router.post("/signin", passport.authenticate("local"), async (req, res, next) => {
//     try {
//       res.redirect("/user/profile");
//     } catch (error) {
//       next(error);
//     }
//   }
// );

router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/user/profile",
    failureRedirect: "/user/signin",
  }),
  (req, res) => {}
);

router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    res.render("profile", {
      title: "Expense Tracker | Profile",
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout(() => {
    res.redirect("/user/signin");
  });
});

module.exports = router;
