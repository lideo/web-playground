const User = require("../models/user");

const passport = require("passport");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALT_WORK_FACTOR);
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");

exports.profile = function(req, res) {
  res.render("user/profile", { user: req.user });
};

exports.loginGet = function(req, res) {
  res.render("user/login", { title: "Log in" });
};

exports.loginPost = function(req, res) {
  res.redirect("/profile");
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect("/");
};

exports.signupGet = function(req, res) {
  res.render("user/signup", { title: "Sign Up" });
};

exports.signupPost = [
  body("first_name", "First Name must not be empty.")
    .isLength({ min: 1, max: 100 })
    .withMessage("First Name must be between 1 and 100 characters long.")
    .trim(),
  body("last_name", "Last Name must not be empty.")
    .isLength({ min: 1, max: 100 })
    .withMessage("Last Name must be between 1 and 100 characters long.")
    .trim(),
  body("email", "Email must not be empty.")
    .isLength({ min: 3, max: 254 })
    .withMessage("Email must be between 3 and 254 characters long.")
    .trim(),
  body("password", "Password must not be empty.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .trim(),

  sanitizeBody("*").escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: ""
    });

    if (!errors.isEmpty()) {
      res.render("user/signup", {
        title: "Sign Up",
        user: user,
        errors: errors.array()
      });
    } else {
      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        user.password = hash;
        user.save(function(err) {
          if (err) {
            return next(err);
          }
          res.redirect("/login");
        });
      });
    }
  }
];

exports.authenticate = passport.authenticate("local", {
  failureRedirect: "/login"
});

exports.checkEmailNotInUse = body("email").custom(value => {
  return User.findOne({ email: value }).then(user => {
    if (user) {
      return Promise.reject("E-mail already in use.");
    }
  });
});

exports.checkPasswordsMatch = body("password_repeat").custom(
  (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }
);
