const express = require('express');
const crewController = require('../../controllers/crew.controller');

const router = express.Router();

router.route('/').get(crewController.getCrewSizes);

router.route('/').post(crewController.createCrewSize);

router.route('/').put(crewController.updateCrewSizes);

router.route('/').delete(crewController.deleteCrewSizes);

router.route('/:crewId').get(crewController.getCrewSize);

module.exports = router;
