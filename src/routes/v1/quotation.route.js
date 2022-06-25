const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const quotationController = require('../../controllers/quotation.controller');

const router = express.Router();

// router
//   .route('/getQuotation')
//   .post(auth('getQuotation'),  quotationController.getQuotation)

router
  .route('/getestimatedquotation')
  .post(quotationController.getEstimatedQuotation)

router
  .route('/getactualquotation')
  .post(auth('getQuotation'),  quotationController.getActualQuotation)

// router
//   .route('/getactualestimation')
//   .post(quotationController.getActualQuotation)

router
  .route('/getQuotationByUserId/:userId')
  .get(auth('getQuotationByUserId'),  quotationController.getQuotationByUserId)

router
  .route('/:quoteId')
  .get(quotationController.getQuotationById);

module.exports = router;
