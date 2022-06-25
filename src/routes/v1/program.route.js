const express = require('express');
const programController = require('../../controllers/program.controller');

const router = express.Router();

router.route('/').get(programController.getPrograms);

router.route('/').post(programController.createProgram);

router.route('/').put(programController.updatePrograms);

router.route('/').delete(programController.deletePrograms);

router.route('/:code').get(programController.getProgram);

module.exports = router;
