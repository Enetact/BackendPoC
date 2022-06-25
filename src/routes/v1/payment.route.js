const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const paymentController = require('../../controllers/payment.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createPayment'), paymentController.createPayment)

router
  .route('/')
   .get(auth('getPayments'), paymentController.getPayments)


module.exports = router;

