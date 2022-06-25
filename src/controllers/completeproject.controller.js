const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { completeProjectService } = require('../services');

/**
 * A request handler function to create a single CompleteProject or a collection of them.
 * The request body may contain a single object or a collection.
 */
const createCompleteProject = catchAsync(async (req, res) => {
  logger.info('CompleteProjectController::createCompleteProject');
  const result = await completeProjectService.createCompleteProject(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const getCompleteProjects = catchAsync(async (req, res) => {
  logger.info('CompleteProjectController::getCompleteProjects');
  const filter = pick(req.query, ['month']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const completeProjects = await completeProjectService.queryCompleteProjects(filter, options);
  res.send(completeProjects);
});

const getCompleteProject = catchAsync(async (req, res) => {
  logger.info('CompleteProjectController::getCompleteProject');
  const completeProject = await completeProjectService.getCompleteProjectById(req.params.completeProjectId);
  if (!completeProject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'CompleteProject not found');
  }
  res.send(completeProject);
});

/**
 * A request handler function to update a collection of CompleteProjects.
 */
const updateCompleteProjects = catchAsync(async (req, res) => {
  logger.info('CompleteProjectController::updateCompleteProjects');
  const modifiedCount = await completeProjectService.updateCompleteProjects(req.body);
  res.send({
    modifiedCount,
  });
});

/**
 * A request handler function to delete a collection of CrewSizes.
 */
const deleteCompleteProjects = catchAsync(async (req, res) => {
  logger.info('CompleteProjectController::deleteCompleteProjects');
  await completeProjectService.deleteCompleteProjects(req.body);
  res.status(httpStatus.NO_CONTENT).end();
});

module.exports = {
  createCompleteProject,
  getCompleteProjects,
  getCompleteProject,
  updateCompleteProjects,
  deleteCompleteProjects,
};
