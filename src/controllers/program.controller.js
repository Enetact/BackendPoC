const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { programService } = require('../services');

/**
 * A request handler function to create a single Program or a collection of Programs.
 * The request body may contain a single program object or a collection.
 */
const createProgram = catchAsync(async (req, res) => {
  logger.info('ProgramController::createProgram');
  const program = await programService.createProgram(req.body);
  res.status(httpStatus.CREATED).send(program);
});

const getPrograms = catchAsync(async (req, res) => {
  logger.info('ProgramController::getPrograms');
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await programService.queryPrograms(filter, options);
  logger.info('ProgramController::getPrograms completed');
  res.send(result);
});

const getProgram = catchAsync(async (req, res) => {
  logger.info('ProgramController::getProgram');
  const program = await programService.getProgramByCode(req.params.code);
  if (!program) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Program not found');
  }
  logger.info('ProgramController::getProgram completed');
  res.send(program);
});

/**
 * A request handler function to update a collection of Programs.
 */
const updatePrograms = catchAsync(async (req, res) => {
  logger.info('ProgramController::updatePrograms');
  const modifiedCount = await programService.updatePrograms(req.body);
  res.send({
    modifiedCount,
  });
});

/**
 * A request handler function to delete a collection of Programs.
 */
const deletePrograms = catchAsync(async (req, res) => {
  logger.info('ProgramController::deletePrograms');
  await programService.deletePrograms(req.body);
  res.status(httpStatus.NO_CONTENT).end();
});

module.exports = {
  createProgram,
  getPrograms,
  getProgram,
  updatePrograms,
  deletePrograms,
};
