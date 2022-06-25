const express = require('express');
const stateController = require('../../controllers/state.controller');

const router = express.Router();

router.route('/').get(stateController.getStates);

router.route('/').post(stateController.createState);

router.route('/').put(stateController.updateStates);

router.route('/').delete(stateController.deleteStates);

router.route('/:stateId').get(stateController.getStateById);

router.route('/zipcodes/:zipCode').get(stateController.getStateByZipCode);

module.exports = router;
