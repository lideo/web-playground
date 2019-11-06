const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    max: 100
  },
  last_name: {
    type: String,
    required: true,
    max: 100
  },
  email: {
    type: String,
    required: true,
    max: 254
  },
  password: {
    type: String,
    required: true,
    // Don't return the value of this field when getting the users details
    select: false
  }
});

// Virtual for user's full name
UserSchema.virtual("full_name").get(function() {
  return this.first_name + " " + this.last_name;
});

UserSchema.virtual("url").get(function() {
  return "/user/" + this._id;
});

UserSchema.methods.verifyPassword = function(inputPassword, cb) {
  bcrypt.compare(inputPassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
