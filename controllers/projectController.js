const Project = require('../models/project');
const User = require('../models/user');

const async = require('async');
const he = require('he');
const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

exports.index = function(req, res) {
  res.redirect('/code/projects');
};

exports.project_list = function(req, res, next) {
  const user = req.user;

  Project.find({ user: user.id }, 'name user')
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
      const err = new Error('Project not found.');
      err.status = 404;
      return next(err);
    }

    results.project.html_code = he.decode(results.project.html_code);
    results.project.css_code = he.decode(results.project.css_code);
    results.project.js_code = he.decode(results.project.js_code);

    res.render('project_detail', {
      title: results.project.name,
      project: results.project
    });
  });

};

exports.project_detail_post = [
    sanitizeBody('*').escape(),

    (req, res, next) => {
      const errors = validationResult(req);
      const project = new Project({
        html_code: req.body.html_code,
        css_code: req.body.css_code,
        js_code: req.body.js_code,
        _id: req.params.id //This is required, or a new ID will be assigned!
      });

      if (!errors.isEmpty()) {
        res.render('project_detail', {
          title: project.name,
          project: project,
          errors: errors.array()
        });
        return;
      } else {
        Project.findByIdAndUpdate(req.params.id, project, {}, function(err, theproject) {
          if (err) { return next(err); }
          res.redirect(theproject.url);
        });
      }
    }
];

// Display project create form on GET.
exports.project_create_get = function(req, res, next) {

  res.render('project_form', {
    title: 'Create Project'
  });

};

// Handle project create on POST.
exports.project_create_post = [
  body('name', 'Name must not be empty.')
    .isLength({ min: 1, max: 100 })
    .trim(),

  sanitizeBody('*').escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const project = new Project({
      name: req.body.name,
      user: req.body.user,
      html_code: '',
      css_code: '',
      js_code: '',
      user: req.user.id
    });

    if (!errors.isEmpty()) {
      res.render('project_form', {
        name: 'Create Project',
        project: project,
        errors: errors.array()
      });
      return;
    } else {
      project.save(function (err) {
        if (err) { return next(err); }
        res.redirect(project.url);
      });
    }
  }
];

// Display project delete form on GET.
exports.project_delete_get = function(req, res, next) {
  async.parallel({
    project: function(callback) {
      Project.findById(req.params.id).exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.project == null) {
      res.redirect('/code/projects');
    }
    res.render('project_delete', {
      title: 'Delete Project',
      project: results.project
    });
  });
};

// Handle project delete on POST.
exports.project_delete_post = function(req, res, next) {
  async.parallel({
    project: function(callback) {
      Project.findById(req.body.projectid).exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.project == null) {
      res.redirect('/code/projects');
    }
    Project.findByIdAndRemove(req.body.projectid, function deleteProject(err) {
      if (err) { return next(err); }
      res.redirect('/code/projects');
    })

  });
};

// Display project update form on GET.
exports.project_update_get = function(req, res, next) {
  async.parallel({
    project: function(callback) {
      Project.findById(req.params.id).exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.project == null) {
      const err = new Error('Project not found.');
      err.status = 404;
      return next(err);
    }

    results.project.html_code = he.decode(results.project.html_code);
    results.project.css_code = he.decode(results.project.css_code);
    results.project.js_code = he.decode(results.project.js_code);

    res.render('project_form', {
      title: 'Update Project Details',
      project: results.project
    });
  });
};

// Handle project update on POST.
exports.project_update_post = [
  body('name', 'Name must not be empty.')
    .isLength({ min: 1, max: 100 })
    .trim(),

    sanitizeBody('name').escape(),

    (req, res, next) => {
      const errors = validationResult(req);
      const project = new Project({
        name: req.body.name,
        _id: req.params.id //This is required, or a new ID will be assigned!
      });

      if (!errors.isEmpty()) {
        res.render('project_form', {
          title: 'Update Project Details',
          project: project,
          errors: errors.array()
        });
        return;
      } else {
        Project.findByIdAndUpdate(req.params.id, project, {}, function(err, theproject) {
          if (err) { return next(err); }
          res.redirect(theproject.url);
        });
      }
    }
];

exports.check_is_project_owner = function(req, res, next) {
  const user = req.user;

  async.parallel({
    project: function(callback) {
      Project.findById(req.params.id).exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.project == null) {
      const err = new Error('Project not found.');
      err.status = 404;
      return next(err);
    }

    if (user.id != results.project.user) {
      const err = new Error('Forbidden.');
      err.status = 403;
      return next(err);
    }

    next();

  });
}
