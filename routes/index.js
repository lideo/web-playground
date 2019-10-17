const express = require('express');
const passport = require('passport');
const router = express.Router();
const { ensureLoggedIn } = require('connect-ensure-login');

const user_controller = require('../controllers/userController');

// GET home page.
router.get('/', function(req, res, next) {
  res.render('home');
});

////// USERS ROUTES //////

router.get('/profile',
  ensureLoggedIn('/login'),
  user_controller.profile
);

router.get('/login', user_controller.login_get);

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login'
  }),
  user_controller.login_post
);

router.get('/logout', user_controller.logout);

router.get('/signup', user_controller.signup_get);

router.post('/signup', user_controller.signup_post);


module.exports = router;