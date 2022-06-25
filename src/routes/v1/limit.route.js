const express = require('express');
const limitController = require('../../controllers/limit.controller');

const router = express.Router();

router.route('/').get(limitController.getLimits);

router.route('/').post(limitController.createLimit);

router.route('/').put(limitController.updateLimits);

router.route('/').delete(limitController.deleteLimits);

router.route('/:limitId').get(limitController.getLimit);

module.exports = router;
