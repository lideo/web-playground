const User = require('../models/user');

const async = require('async');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

exports.profile = function(req, res, next) {
  res.render('profile', { user: req.user });
}

exports.login_get = function(req, res, next) {
  res.render('login');
}

exports.login_post = function(req, res, next) {
  res.redirect('/profile');
}

exports.logout = function(req, res, next) {
  req.logout();
  res.redirect('/');
}

exports.signup_get = function(req, res, next) {
  res.send('User signup GET: not implemented.');
}

exports.signup_post = function(req, res, next) {
  res.send('User signup POST: not implemented.');
}