const express = require('express');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

const router = express.Router();

const user_controller = require('../controllers/userController');

router.use('/login', ensureLoggedOut({ redirectTo: '/profile' }));
router.use('/signup', ensureLoggedOut({ redirectTo: '/profile' }));

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
  user_controller.authenticate,
  user_controller.login_post
);

router.get('/logout', user_controller.logout);

router.get('/signup', user_controller.signup_get);

router.post('/signup',
  user_controller.check_email_not_in_use,
  user_controller.check_passwords_match,
  user_controller.signup_post
);


module.exports = router;