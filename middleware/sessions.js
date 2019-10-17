const expressSession = require("express-session");

const sessionConfig = {
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {}
}

module.exports = function(app) {

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionConfig.cookie.secure = true // serve secure cookies
  }
  return expressSession(sessionConfig);

}