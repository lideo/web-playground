var express = require('express');
var router = express.Router();

// Require controller modules.
var project_controller = require('../controllers/projectController');

/// PROJECT ROUTES ///

// GET home page.
router.get('/', project_controller.index);

// GET request for creating a Project.
// NOTE This must come before routes that display Project (uses id).
router.get('/project/create', project_controller.project_create_get);

// POST request for creating Project.
router.post('/project/create', project_controller.project_create_post);

// GET request to delete Project.
router.get('/project/:id/delete', project_controller.project_delete_get);

// POST request to delete Project.
router.post('/project/:id/delete', project_controller.project_delete_post);

// GET request to update Project.
router.get('/project/:id/update', project_controller.project_update_get);

// POST request to update Project.
router.post('/project/:id/update', project_controller.project_update_post);

// GET request for one Project.
router.get('/project/:id', project_controller.project_detail);

// GET request for list of all Project items.
router.get('/projects', project_controller.project_list);

module.exports = router;
