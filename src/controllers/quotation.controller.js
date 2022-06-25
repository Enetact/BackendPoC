const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { quotationService, origamiService, userService } = require('../services');

const getEstimatedQuotation = catchAsync(async (req, res) => {
  logger.info('QuotationController::getEstimatedQuotation');
  const quote = await quotationService.getEstimatedQuoteWithoutPersistence(req.body);
  res.json({
    status: 200,
    result: quote,
  });
});

const getActualQuotation = catchAsync(async (req, res) => {
  logger.info('quotation controller: get actual quotation requested');
  var response = null;
  if (req.body) {
    const user = await userService.getUserById(req.body.userId);
    if (user) {
      const createQuotationDraft = await quotationService.createQuotation(req.body);
      if (!createQuotationDraft || !createQuotationDraft._id) {
        logger.info('quotation controller: get actual quotation - quotationid not provided');
        throw new ApiError(httpStatus.NOT_FOUND, 'Quotation Id is must');
      }
      req.body.quotationId = createQuotationDraft._id;
      response = await origamiService.getQuotationRate(req.body);
      if (response && response.rate && response.rate > 0) {
        await quotationService.updateCompleteQuotation(req.body.quotationId);
      }
    } else {
      logger.info('quotation controller: get actual quotation - user not found');
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  }
  logger.info('quotation controller: get actual quotation completed');
  res.json({
    status: 200,
    result: response,
  });
});

const getQuotationById = catchAsync(async (req, res) => {
  logger.info('quotation controller: get quotation by quotationid requested');
  const quotation = await quotationService.getQuotationById(req.params.quoteId);
  if (!quotation) {
    logger.info('quotation controller: get quotation by userid - quotation not found');
    throw new ApiError(httpStatus.NOT_FOUND, 'Quotation not found');
  }
  logger.info('quotation controller: get quotation by quotationid completed');
  res.send(quotation);
});

const getQuotationByUserId = catchAsync(async (req, res) => {
  logger.info('quotation controller: get quotation by userid requested');
  const quotations = await quotationService.getQuotationByUserId(req.params.userId);
  if (!quotations) {
    logger.info('quotation controller: get quotation by userid - quotation not found');
    throw new ApiError(httpStatus.NOT_FOUND, 'Quotation not found');
  }
  logger.info('quotation controller: get quotation by userid completed');
  res.send(quotations);
});

module.exports = {
  getQuotationByUserId,
  getQuotationById,
  getActualQuotation,
  getEstimatedQuotation,
};
