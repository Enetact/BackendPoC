const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const memberController = require('../../controllers/member.controller');

const router = express.Router();

router
  .route('/')
  .get(auth('getMembers'), memberController.getMembers);

router
  .route('/:userId')
  .get(memberController.getMember);

  router
  .route('/:userId')
  .put(auth('updateMember'), memberController.updateMember);

module.exports = router;

