var Project = require('../models/project');
var User = require('../models/user');

var async = require('async');

exports.index = function(req, res) {

  async.parallel({
    project_count: function (callback) {
      Project.countDocuments({}, callback);
    }
  }, function(err, results) {
      res.render('index', {
        title: 'Web Playground Home',
        error: err,
        data: results
      });
  });

};

exports.project_list = function(req, res, next) {

  Project.find({}, 'name user')
    .populate('user')
    .exec(function (err, list_projects) {
      if (err) { return next(err); }
      res.render('project_list', { title: 'Project list', project_list: list_projects });
    });

};

exports.project_detail = function(req, res, next) {

  async.parallel({
    project: function(callback) {
      Project.findById(req.params.id)
        .populate('user')
        .exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.project == null) {
      var err = new Error('Project not found.');
      err.status = 400;
      return next(err);
    }
    res.render('project_detail', {
      title: results.project.name,
      project: results.project
    });
  });

};

// Display project create form on GET.
exports.project_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Project create GET');
};

// Handle project create on POST.
exports.project_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Project create POST');
};

// Display project delete form on GET.
exports.project_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Project delete GET');
};

// Handle project delete on POST.
exports.project_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Project delete POST');
};

// Display project update form on GET.
exports.project_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Project update GET');
};

// Handle project update on POST.
exports.project_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Project update POST');
};
