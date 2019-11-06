const Project = require("../models/project");

const he = require("he");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");

exports.index = function(req, res) {
  res.redirect("/code/projects");
};

exports.projectList = async function(req, res, next) {
  try {
    const user = req.user;

    const projectList = await Project.find({ user: user.id }, "name")
      .sort({ name: "ascending" })
      .exec();

    res.render("project/list", {
      title: "Project list",
      projectList: projectList
    });
  } catch (err) {
    return next(err);
  }
};

exports.projectDetail = async function(req, res, next) {
  try {
    const project = await Project.findById(req.params.id)
      .populate("user")
      .exec();

    if (project == null) {
      const err = new Error("Project not found.");
      err.code = 404;
      return next(err);
    }

    project.html_code = he.decode(project.html_code);
    project.css_code = he.decode(project.css_code);
    project.js_code = he.decode(project.js_code);

    res.render("project/detail", {
      title: project.name,
      project: project
    });
  } catch (err) {
    return next(err);
  }
};

exports.projectPreview = async function(req, res, next) {
  try {
    const project = await Project.findById(req.params.id).exec();

    if (project == null) {
      const err = new Error("Project not found.");
      err.status = 404;
      return next(err);
    }

    project.html_code = he.decode(project.html_code);
    project.css_code = he.decode(project.css_code);
    project.js_code = he.decode(project.js_code);

    res.render("project/preview", {
      title: `${project.name} preview`,
      project: project
    });
  } catch (err) {
    return next(err);
  }
};

exports.projectDetailPost = [
  sanitizeBody("*").escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const project = new Project({
      html_code: req.body.html_code,
      css_code: req.body.css_code,
      js_code: req.body.js_code,
      _id: req.params.id //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      res.render("project/detail", {
        title: project.name,
        project: project,
        errors: errors.array()
      });
      return;
    } else {
      try {
        const updatedProject = await Project.findByIdAndUpdate(
          req.params.id,
          project,
          { new: true }
        ).exec();

        if (updatedProject == null) {
          const err = new Error("Project not found.");
          err.status = 404;
          return next(err);
        }

        res.redirect(updatedProject.url);
      } catch (err) {
        return next(err);
      }
    }
  }
];

// Display project create form on GET.
exports.projectCreateGet = function(req, res) {
  res.render("project/form", {
    title: "Create Project"
  });
};

// Handle project create on POST.
exports.projectCreatePost = [
  body("name", "Name must not be empty.")
    .isLength({ min: 1, max: 100 })
    .trim(),

  sanitizeBody("*").escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const project = new Project({
      name: req.body.name,
      html_code: "",
      css_code: "",
      js_code: "",
      user: req.user.id
    });

    if (!errors.isEmpty()) {
      res.render("project/form", {
        name: "Create Project",
        project: project,
        errors: errors.array()
      });
      return;
    } else {
      try {
        const newProject = await project.save();

        if (newProject == null) {
          const err = new Error("Project not found.");
          err.status = 404;
          return next(err);
        }

        res.redirect(newProject.url);
      } catch (err) {
        return next(err);
      }
    }
  }
];

// Display project delete form on GET.
exports.projectDeleteGet = async function(req, res, next) {
  try {
    const project = await Project.findById(req.params.id).exec();

    if (project == null) {
      const err = new Error("Project not found.");
      err.status = 404;
      return next(err);
    }

    res.render("project/delete", {
      title: "Delete Project",
      project: project
    });
  } catch (err) {
    return next(err);
  }
};

// Handle project delete on POST.
exports.projectDeletePost = async function(req, res, next) {
  try {
    await Project.findByIdAndRemove(req.body.projectid).exec();

    res.redirect("/code/projects");
  } catch (err) {
    return next(err);
  }
};

// Display project update form on GET.
exports.projectUpdateGet = async function(req, res, next) {
  try {
    const project = await Project.findById(req.params.id).exec();

    if (project == null) {
      const err = new Error("Project not found.");
      err.status = 404;
      return next(err);
    }

    project.html_code = he.decode(project.html_code);
    project.css_code = he.decode(project.css_code);
    project.js_code = he.decode(project.js_code);

    res.render("project/form", {
      title: "Update Project Details",
      project: project
    });
  } catch (err) {
    return next(err);
  }
};

// Handle project update on POST.
exports.projectUpdatePost = [
  body("name", "Name must not be empty.")
    .isLength({ min: 1, max: 100 })
    .trim(),

  sanitizeBody("name").escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    const project = new Project({
      name: req.body.name,
      _id: req.params.id //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      res.render("project/form", {
        title: "Update Project Details",
        project: project,
        errors: errors.array()
      });
      return;
    } else {
      try {
        const updatedProject = await Project.findByIdAndUpdate(
          req.params.id,
          project,
          { new: true }
        ).exec();

        if (updatedProject == null) {
          const err = new Error("Project not found.");
          err.status = 404;
          return next(err);
        }

        res.redirect(updatedProject.url);
      } catch (err) {
        return next(err);
      }
    }
  }
];

exports.checkIsProjectOwner = async function(req, res, next) {
  const user = req.user;

  if (req.params.id == "create") {
    return next();
  }

  try {
    const project = await Project.findById(req.params.id).exec();

    if (project == null) {
      const err = new Error("Project not found.");
      err.status = 404;
      return next(err);
    }

    if (user.id != project.user) {
      const err = new Error("Forbidden.");
      err.status = 403;
      return next(err);
    }

    return next();
  } catch (err) {
    return next(err);
  }
};
