const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const policyController = require('../../controllers/policy.controller');

const router = express.Router();

router
  .route('/')
  .put(auth('updatePolicyNumber'), policyController.updatePolicyNumber)

router
  .route('/')
   .get(auth('managePolicies'), policyController.getPolicies)

router
  .route('/:userid')
  .get(auth('getPolicyByUserId'), policyController.getPolicyByUserId);

module.exports = router;

