const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { jobDurationService } = require('../services');

/**
 * A request handler function to create a single JobDuration or a collection of them.
 * The request body may contain a single object or a collection.
 */
const createJobDuration = catchAsync(async (req, res) => {
  logger.info('JobDurationController::createJobDuration');
  const result = await jobDurationService.createJobDuration(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const getJobDurations = catchAsync(async (req, res) => {
  logger.info('JobDurationController::getJobDurations');
  const filter = pick(req.query, ['type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await jobDurationService.queryJobDurations(filter, options);
  res.send(result);
});

const getJobDuration = catchAsync(async (req, res) => {
  logger.info('JobDurationController::getJobDuration');
  const jobDuration = await jobDurationService.getJobDurationById(req.params.jobDurationId);
  if (!jobDuration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'JobDuration not found');
  }
  res.send(jobDuration);
});

/**
 * A request handler function to update a collection of JobDuration options.
 */
const updateJobDurations = catchAsync(async (req, res) => {
  logger.info('JobDurationController::updateJobDuration');
  const modifiedCount = await jobDurationService.updateJobDurations(req.body);
  res.send({
    modifiedCount,
  });
});

/**
 * A request handler function to delete a collection of JobDuration options.
 */
const deleteJobDurations = catchAsync(async (req, res) => {
  logger.info('JobDurationController::deleteJobDurations');
  await jobDurationService.deleteJobDurations(req.body);
  res.status(httpStatus.NO_CONTENT).end();
});

module.exports = {
  createJobDuration,
  getJobDurations,
  getJobDuration,
  updateJobDurations,
  deleteJobDurations,
};
