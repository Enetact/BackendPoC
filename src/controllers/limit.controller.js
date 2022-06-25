const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { limitService } = require('../services');

/**
 * A request handler function to create a single Limit or a collection of Limits.
 * The request body may contain a single limit object or a collection.
 */
const createLimit = catchAsync(async (req, res) => {
  logger.info('LimitController::createLimit');
  const limit = await limitService.createLimit(req.body);
  res.status(httpStatus.CREATED).send(limit);
});

const getLimits = catchAsync(async (req, res) => {
  logger.info('LimitController::getLimits');
  const filter = pick(req.query, ['aggregate']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await limitService.queryLimits(filter, options);
  logger.info('limit controller: get all completed');
  res.send(result);
});

const getLimit = catchAsync(async (req, res) => {
  logger.info('LimitController::getLimit');
  const Limit = await limitService.getLimitById(req.params.limitId);
  if (!Limit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Limit not found');
  }
  logger.info('limit controller: get completed');
  res.send(Limit);
});

/**
 * A request handler function to update a collection of Limits.
 */
const updateLimits = catchAsync(async (req, res) => {
  logger.info('LimitController::updateLimits');
  const modifiedCount = await limitService.updateLimits(req.body);
  res.send({
    modifiedCount,
  });
});

/**
 * A request handler function to delete a collection of Limits.
 */
const deleteLimits = catchAsync(async (req, res) => {
  logger.info('LimitController::deleteLimits');
  await limitService.deleteLimits(req.body);
  res.status(httpStatus.NO_CONTENT).end();
});

module.exports = {
  createLimit,
  getLimits,
  getLimit,
  updateLimits,
  deleteLimits,
};
