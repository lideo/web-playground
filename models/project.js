var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProjectSchema = new Schema(
  {
    name: {type: String, required: true, max: 100},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    html_code: {type: String},
    css_code: {type: String},
    js_code: {type: String}
  }
);

// Virtual for author's URL
ProjectSchema
  .virtual('url')
  .get(function () {
    return '/code/project/' + this._id;
  });

//Export model
module.exports = mongoose.model('Project', ProjectSchema);