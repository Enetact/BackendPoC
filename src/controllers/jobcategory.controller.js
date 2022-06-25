const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const catchAsync = require('../utils/catchAsync');
const { jobCategoryService } = require('../services');

/**
 * A request handler function to create a single JobCategory or a collection of them.
 * The request body may contain a single limit object or a collection.
 */
const createJobCategory = catchAsync(async (req, res) => {
  logger.info('JobCategoryController::createJobCategory');
  const result = await jobCategoryService.createJobCategory(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const getJobCategories = catchAsync(async (req, res) => {
  logger.info('JobCategoryController::getJobCategories');
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await jobCategoryService.queryJobCategories(filter, options);
  res.send(result);
});

const getJobCategory = catchAsync(async (req, res) => {
  logger.info('JobCategoryController::getJobCategory');
  const jobCategory = await jobCategoryService.getJobCategoryById(req.params.jobCategoryId);
  if (!jobCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'JobCategory not found');
  }
  res.send(jobCategory);
});

/**
 * A request handler function to update a collection of JobCategory objects.
 */
const updateJobCategories = catchAsync(async (req, res) => {
  logger.info('JobCategoryController::updateJobCategories');
  const modifiedCount = await jobCategoryService.updateJobCategories(req.body);
  res.send({
    modifiedCount,
  });
});

/**
 * A request handler function to delete a collection of JobCategory objects.
 */
const deleteJobCategories = catchAsync(async (req, res) => {
  logger.info('JobCategoryController::updateJobCategories');
  await jobCategoryService.deleteJobCategories(req.body);
  res.status(httpStatus.NO_CONTENT).end();
});

module.exports = {
  createJobCategory,
  getJobCategories,
  getJobCategory,
  updateJobCategories,
  deleteJobCategories,
};
