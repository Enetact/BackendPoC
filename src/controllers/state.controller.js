const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { stateService } = require('../services');

/**
 * A request handler function to create a single State or a collection of them.
 * The request body may contain a single object or a collection.
 */
const createState = catchAsync(async (req, res) => {
  logger.info('StateController::createState');
  const result = await stateService.createState(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const getStates = catchAsync(async (req, res) => {
  logger.info('StateController::getStates');
  const filter = pick(req.query, ['state']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await stateService.queryStates(filter, options);
  res.send(result);
});

const getStateById = catchAsync(async (req, res) => {
  logger.info('StateController::getStateById');
  const state = await stateService.getStateById(req.params.stateId);
  if (!state) {
    throw new ApiError(httpStatus.NOT_FOUND, 'State not found');
  }
  res.send(state);
});

const getStateByZipCode = catchAsync(async (req, res) => {
  logger.info('StateController::getStateByZipCode');
  const state = await stateService.getStateByZipCode(req.params.zipCode);
  if (!state) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  res.send(state);
});

/**
 * A request handler function to update a collection of State options.
 */
const updateStates = catchAsync(async (req, res) => {
  logger.info('StateController::updateStates');
  const modifiedCount = await stateService.updateStates(req.body);
  res.send({
    modifiedCount,
  });
});

/**
 * A request handler function to delete a collection of State options.
 */
const deleteStates = catchAsync(async (req, res) => {
  logger.info('StateController::deleteStates');
  await stateService.deleteStates(req.body);
  res.status(httpStatus.NO_CONTENT).end();
});

module.exports = {
  createState,
  getStates,
  getStateById,
  getStateByZipCode,
  updateStates,
  deleteStates,
};
