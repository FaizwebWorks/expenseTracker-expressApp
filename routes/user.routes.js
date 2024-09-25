var express = require("express");
var router = express.Router();
const userModel = require("../models/user.schema");
const fs = require("fs");
const path = require("path");

const passport = require("passport");
const localStrategy = require("passport-local");
const { isLoggedIn } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multimedia.middleware");
const sendEmail = require("../services/email");
passport.use(new localStrategy(userModel.authenticate()));
const GoogleStrategy = require("passport-google-oauth20").Strategy;

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
  res.render("signinuser", {
    title: "Expense Tracker | Signin",
    user: req.user,
  });
});

router.post(
  "/signin",
  passport.authenticate("local"),
  async (req, res, next) => {
    try {
      req.flash("success", "Successfully Logged in!");
      res.redirect("/user/profile");
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
);

// router.post(
//   "/signin",
//   passport.authenticate("local", {
//     successRedirect: "/user/profile",
//     failureRedirect: "/user/signin",
//   }),
//   (req, res) => {}
// );

router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    const message = req.flash("success");
    res.render("profile", {
      title: "Expense Tracker | Profile",
      user: req.user,
      message: message,
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

router.get("/update-user", isLoggedIn, (req, res, next) => {
  res.render("updateuser", {
    title: "Expense Tracker | Update User",
    user: req.user,
  });
});

router.post("/update-user", isLoggedIn, async (req, res, next) => {
  try {
    await userModel.findByIdAndUpdate(req.user._id, req.body);
    res.redirect("/user/profile");
  } catch (error) {
    next(error);
  }
});

router.get("/reset-password", isLoggedIn, async (req, res, next) => {
  try {
    res.render("resetpassword", {
      title: "Expense | Reset Password",
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password", isLoggedIn, async (req, res, next) => {
  try {
    await req.user.changePassword(req.body.oldpassword, req.body.newpassword);
    await req.user.save();
    res.redirect("/user/profile");
  } catch (error) {
    next(error);
  }
});

router.get("/delete-account", isLoggedIn, async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndDelete(req.user._id);
    if (user.avatar != "") {
      fs.unlinkSync(`public/images/${user.avatar}`);
    }
    res.redirect("/user/signin");
  } catch (error) {
    next(error);
  }
});

// router.post("/avatar", isLoggedIn, (req, res, next) => {
//   try {
//     // user multer and req.file.filename and update to user
//   } catch (error) {
//     next(error);
//   }
// });

router.post(
  "/avatar",
  isLoggedIn,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      req.user.avatar = req.file.filename;
      await req.user.save();
      res.redirect("/user/update-user");
    } catch (error) {
      next(error);
    }
  }
);

router.get("/forget-password", (req, res, next) => {
  res.render("forgetpassword_email", {
    title: "Expense Tracker | Forget Password",
    user: req.user,
  });
});

router.post("/forget-password", async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    console.log(req.body.email);
    if (!user) return next(new Error("User not found!"));

    // send email to user with the OTP
    const OTP = Math.floor(100000 + Math.random() * 900000);
    console.log("OTP:", OTP);
    sendEmail(
      process.env.EMAIL_USER,
      "OTP for Reset Password",
      OTP.toString(), // Convert OTP to string
      `<h1> OTP for Reset Password: ${OTP}</h1>`
    );

    // save the OTP to the database
    user.OTP = OTP;
    await user.save();
    res.redirect(`/user/forget-password/${user._id}`);
  } catch (error) {
    next(error);
  }
});

router.get("/forget-password/:id", async (req, res, next) => {
  res.render("forgetpassword_otp", {
    title: "Expense Tracker | Forget Password",
    user: req.user,
    id: req.params.id,
  });
});

router.post("/forget-password/:id", async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);

    // compare the req.body.otp with the otp in database
    // if matched redirect to password page else ERROR
    if (user.OTP == req.body.otp) {
      res.redirect(`/user/set-password/${user._id}`);
    } else {
      res.redirect("/user/forget-password");
    }
  } catch (error) {
    next(error);
  }
});

router.get("/set-password/:id", (req, res, next) => {
  res.render("forgetpassword_password", {
    title: "Expense Tracker | Set Password",
    user: req.user,
    id: req.params.id,
  });
});

router.post("/set-password/:id", async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    await user.setPassword(req.body.password);
    await user.save();
    res.redirect("/user/signin");
  } catch (error) {
    next(error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/user/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("profile:", profile);
      // Here you can save the user profile to your database
      return done(null, profile);
    }
  )
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  (req, res, next) => {
    console.log("req =>", req.query);
    return next();
  },
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res, next) => {
    try {
      const isUserAlreadyExists = await userModel.findOne({
        email: req.user.emails[0].value,
      });

      if (isUserAlreadyExists) {
        req.login(isUserAlreadyExists, (err) => {
          if (err) {
            return next(err);
          }
          return res.redirect("/user/profile"); // Ensure only one response is sent
        });
      } else {
        const newUser = await userModel.create({
          username: req.user.displayName,
          email: req.user.emails[0].value,
          avatar: req.user.photos[0].value,
        });

        req.login(newUser, (err) => {
          if (err) {
            return next(err);
          }
          return res.redirect("/user/profile"); // Ensure only one response is sent
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
