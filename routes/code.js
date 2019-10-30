const express = require('express');
const router = express.Router();
const { ensureLoggedIn } = require('connect-ensure-login');

// Require controller modules.
const projectController = require('../controllers/projectController');

/// PROJECT ROUTES MIDDLEWARE ///

// Check if the user is logged in
router.use(ensureLoggedIn('/login'));

// Check if project belongs to the user
router.use('/project/:id/', projectController.checkIsProjectOwner);


/// PROJECT ROUTES ///

// GET home page.
router.get('/', projectController.index);

// GET request for creating a Project.
// NOTE This must come before routes that display Project (uses id).
router.get('/project/create', projectController.projectCreateGet);

// POST request for creating Project.
router.post('/project/create', projectController.projectCreatePost);

// GET request to delete Project.
router.get('/project/:id/delete', projectController.projectDeleteGet);

// POST request to delete Project.
router.post('/project/:id/delete', projectController.projectDeletePost);

// GET request to update Project.
router.get('/project/:id/update', projectController.projectUpdateGet);

// POST request to update Project.
router.post('/project/:id/update', projectController.projectUpdatePost);

// GET request for one Project.
router.get('/project/:id', projectController.projectDetail);

// POST request for one Project.
router.post('/project/:id', projectController.projectDetailPost);

// GET request for list of all Project items.
router.get('/projects', projectController.projectList);

module.exports = router;
