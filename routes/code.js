const express = require('express');
const router = express.Router();
const { ensureLoggedIn } = require('connect-ensure-login');

// Require controller modules.
const project_controller = require('../controllers/projectController');

/// PROJECT ROUTES MIDDLEWARE ///

// Check if the user is logged in
router.use(ensureLoggedIn('/login'));

// Check if project belongs to the user
router.use('/project/:id/', project_controller.check_is_project_owner);


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

// POST request for one Project.
router.post('/project/:id', project_controller.project_detail_post);

// GET request for list of all Project items.
router.get('/projects', project_controller.project_list);

module.exports = router;
