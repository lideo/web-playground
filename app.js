const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config({
  path:
    typeof process.env.NODE_ENV != "undefined"
      ? `./.env.${process.env.NODE_ENV}`
      : "./.env"
});

const indexRouter = require("./routes/index");
const codeRouter = require("./routes/code");

const helmet = require("helmet");
const compression = require("compression");

const nunjucks = require("nunjucks");

const app = express();

//Set up mongoose connection
const mongoose = require("mongoose");
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const passport = require("./middleware/authentication");
const session = require("./middleware/sessions")(app, db);

// Congigure nunjucks templating engine
nunjucks.configure("views", {
  autoescape: true,
  express: app
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "njk");

app.use(compression()); //Compress all routes
app.use(helmet()); // Security
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const staticAssetsPath = path.join(__dirname, "client/dist");
app.use("/static", express.static(staticAssetsPath));

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

const graphqlServer = require("./graphql/server");
// Enable access to GraphQL Playround on route "/__graphql"
graphqlServer.applyMiddleware({ app, path: "/__graphql" });

app.use("/favicon.ico", function(req, res) {
  res.type("image/x-icon");
  res.status(301);
  res.end();
});

app.use("/", indexRouter);
app.use("/code", codeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
