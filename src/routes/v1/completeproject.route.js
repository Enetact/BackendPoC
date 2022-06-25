const express = require('express');
const completeProjectController = require('../../controllers/completeproject.controller');

const router = express.Router();

router.route('/').get(completeProjectController.getCompleteProjects);

router.route('/').post(completeProjectController.createCompleteProject);

router.route('/').put(completeProjectController.updateCompleteProjects);

router.route('/').delete(completeProjectController.deleteCompleteProjects);

router.route('/:completeProjectId').get(completeProjectController.getCompleteProject);

module.exports = router;
