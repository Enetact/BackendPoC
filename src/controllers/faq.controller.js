const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { faqService } = require('../services');

/**
 * A request handler function to create a single Faq or a collection of Faqs.
 * The request body may contain a single faq object or a collection.
 */
const createFaq = catchAsync(async (req, res) => {
  logger.info('FaqController::createFaq');
  const faq = await faqService.createFaq(req.body);
  res.status(httpStatus.CREATED).send(faq);
});

/**
 * A request handler function to get a collection of Faqs.
 */
const getFaqs = catchAsync(async (req, res) => {
  logger.info('FaqController::getFaqs');
  const filter = pick(req.query, ['question']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await faqService.queryFaqs(filter, options);
  res.send(result);
});

/**
 * A request handler function to get a Faq.
 */
const getFaq = catchAsync(async (req, res) => {
  logger.info('FaqController::getFaq');
  const faq = await faqService.getFaqById(req.params.id);
  if (!faq) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faq not found');
  }
  res.send(faq);
});

/**
 * A request handler function to get a collection of Faqs based on program.
 */
const getFaqByProgram = catchAsync(async (req, res) => {
  logger.info('FaqController::getFaqByProgram');
  const faq = await faqService.getFaqByProgram(req.params.programId);
  if (!faq) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faq not found');
  }
  res.send(faq);
});

/**
 * A request handler function to get a collection of Faqs based on program and type.
 */
const getFaqByProgramType = catchAsync(async (req, res) => {
  logger.info('FaqController::getFaqByProgramType');
  const faq = await faqService.getFaqByProgramType(req.params.programId, req.params.type);
  if (!faq) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faq not found');
  }
  res.send(faq);
});

/**
 * A request handler function to update a collection of Faqs.
 */
const updateFaqs = catchAsync(async (req, res) => {
  logger.info('FaqController::updateFaqs');
  const modifiedCount = await faqService.updateFaqs(req.body);
  logger.info('FaqController::updateFaqs completed');
  res.send({
    modifiedCount,
  });
});

/**
 * A request handler function to delete a collection of Faqs.
 */
const deleteFaqs = catchAsync(async (req, res) => {
  logger.info('FaqController::deleteFaqs');
  await faqService.deleteFaqs(req.body);
  res.status(httpStatus.NO_CONTENT).end();
});

module.exports = {
  createFaq,
  getFaqs,
  getFaq,
  getFaqByProgram,
  getFaqByProgramType,
  updateFaqs,
  deleteFaqs,
};
