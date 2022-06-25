const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const logger = require('../config/logger');

const createUser = catchAsync(async (req, res) => {
  logger.info('UserController::createUser');
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  logger.info('UserController::getUsers');
  const filter = pick(req.query, ['firstName', 'lastName', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  logger.info('UserController::getUser');
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  logger.info('UserController::updateUser');
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

/**
 * Handles requests to change a User email address value.
 */
const updateEmail = catchAsync(async (req, res) => {
  logger.info('UserController::updateEmail');
  const user = await userService.updateEmail(req.params.userId, req.body.password, req.body.email);
  res.send(user);
});

/**
 * Handles requests to change a User password value.
 */
const changePassword = catchAsync(async (req, res) => {
  logger.info('UserController::changePassword');
  const user = await userService.changePassword(req.params.userId, req.body.currentPassword, req.body.newPassword);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  logger.info('UserController::deleteUser');
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateEmail,
  changePassword,
  deleteUser,
};
