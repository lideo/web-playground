var Project = require('../models/project');

exports.index = function(req, res) {
  res.send('NOT IMPLEMENTED: Site Home Page');
};

exports.project_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Project list');
};

exports.project_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Project detail: ' + req.params.id);
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
