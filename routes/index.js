const express = require('express');
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

const router = express.Router();

const userController = require('../controllers/userController');

router.use('/login', ensureLoggedOut({ redirectTo: '/profile' }));
router.use('/signup', ensureLoggedOut({ redirectTo: '/profile' }));

// GET home page.
router.get('/', function(req, res, next) {
  res.render('home');
});

////// USERS ROUTES //////

router.get('/profile',
  ensureLoggedIn('/login'),
  userController.profile
);

router.get('/login', userController.loginGet);

router.post('/login',
  userController.authenticate,
  userController.loginPost
);

router.get('/logout', userController.logout);

router.get('/signup', userController.signupGet);

router.post('/signup',
  userController.checkEmailNotInUse,
  userController.checkPasswordsMatch,
  userController.signupPost
);


module.exports = router;