const expressSession = require("express-session");
const MongoStore = require('connect-mongo')(expressSession);

const sessionConfig = {
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {}
}

module.exports = function(app, connection) {

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionConfig.cookie.secure = true // serve secure cookies
  }

  // We configure mongo/mongoose as our session store instead of
  // the default MemoryStore for persistence.
  sessionConfig.store = new MongoStore({ mongooseConnection: connection });

  return expressSession(sessionConfig);

}