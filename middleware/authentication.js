const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.use(new Strategy(
  function(username, password, done) {
    // Since we have configured our model to not return the value
    // of the password field, we need to add the ".select('+password')" bit
    // to the query to tell it to also return the password value in this case,
    // because we need to verify the password.
    User.findOne({ email: username }).select('+password').exec(function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      user.verifyPassword(password, function(err, isMatch) {
        if (err) throw err;
        if (!isMatch) { return done(null, false); }
        return done(null, user);
      });
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

module.exports = passport;