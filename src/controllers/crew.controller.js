const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { crewSizeService } = require('../services');

/**
 * A request handler function to create a single CrewSize or a collection of them.
 * The request body may contain a single object or a collection.
 */
const createCrewSize = catchAsync(async (req, res) => {
  logger.info('CrewSizeController::createCrewSize');
  const crewSize = await crewSizeService.createCrewSize(req.body);
  res.status(httpStatus.CREATED).send(crewSize);
});

const getCrewSizes = catchAsync(async (req, res) => {
  logger.info('CrewSizeController::getCrewSizes');
  const filter = pick(req.query, ['count']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await crewSizeService.queryCrewSizes(filter, options);
  res.send(result);
});

const getCrewSize = catchAsync(async (req, res) => {
  logger.info('CrewSizeController::getCrewSize');
  const crew = await crewSizeService.getCrewSizeById(req.params.crewId);
  if (!crew) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Crew Size not found');
  }
  res.send(crew);
});

/**
 * A request handler function to update a collection of CrewSizes.
 */
const updateCrewSizes = catchAsync(async (req, res) => {
  logger.info('CrewSizeController::updateCrewSizes');
  const modifiedCount = await crewSizeService.updateCrewSizes(req.body);
  res.send({
    modifiedCount,
  });
});

/**
 * A request handler function to delete a collection of CrewSizes.
 */
const deleteCrewSizes = catchAsync(async (req, res) => {
  logger.info('CrewSizeController::deleteCrewSizes');
  await crewSizeService.deleteCrewSizes(req.body);
  res.status(httpStatus.NO_CONTENT).end();
});

module.exports = {
  createCrewSize,
  getCrewSizes,
  getCrewSize,
  updateCrewSizes,
  deleteCrewSizes,
};
