const merge = require('lodash/merge');
const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Create and persist a User in the data store.
 * @param {Object} user The User object to be created.
 * @returns {Promise<Object>} A Promise that resolves to the created User object if successful;
 * otherwise rejects with an Error.
 */
const createUser = async (user) => {
  logger.debug('UserService::createUser');
  if (await User.isEmailTaken(user.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'A user with this email address exists.');
  }
  return User.create(user);
};

/**
 * Fetch a collection of Users matching the supplied filter critera.
 * @param {Object} filter A filter object containing search criteria. A MongoDB filter.
 * @param {Object} options An object containing pagination and sort options.
 * @param {string} [options.sortBy] Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] Maximum number of results per page (default = 10)
 * @param {number} [options.page] Current page (default = 1)
 * @returns {Promise<Object>} A Promise that resolves to the search result if successful;
 * otherwise rejects with an Error.
 */
const queryUsers = async (filter, options) => {
  logger.debug('UserService::queryUsers');
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Fetch a single User object by the ID.
 * @param {ObjectId} id A User identifier.
 * @returns {Promise<Object|null>} A Promise that resolves to the User if found or null if not found;
 * otherwise rejects with an Error.
 */
const getUserById = async (id) => {
  logger.debug('UserService::getUserById');
  return User.findById(id);
};

/**
 * Fetch a single User object by the email attribute value.
 * @param {string} email A email address.
 * @returns {Promise<Object|null>} A Promise that resolves to the User if found or null if not found;
 * otherwise rejects with an Error.
 */
const getUserByEmail = async (email) => {
  logger.debug('UserService::getUserByEmail');
  return User.findOne({ email });
};

/**
 * Update a User, persisting the changes in the data store.
 * @param {ObjectId} id A User identifier.
 * @param {Object} editedUser A User object containing edited attributes.
 * @returns {Promise<Object|null>} A Promise that resolves to the updated User if found or null if not found;
 * otherwise rejects with an Error.
 */
const updateUserById = async (id, editedUser) => {
  logger.debug('UserService::updateUserById');
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (editedUser.password) {
    // check if password has been used in last NN passwords
    const isPasswordReused = await user.isPasswordReused(editedUser.password, 24);
    if (isPasswordReused) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Password has been used recently.');
    }
  }

  if (editedUser.email && (await User.isEmailTaken(editedUser.email, id))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'A user with this email address exists.');
  }

  merge(user, editedUser);
  await user.save();
  return user;
};

/**
 * Change the `password` attribute of a User.
 * @param {ObjectId} id A User identifier.
 * @param {string} currentPassword The User's current password value.
 * @param {string} newPassword The User's new password value.
 * @returns {Promise<Object|null>} A Promise that resolves to the updated User if successful;
 * otherwise rejects with an Error.
 */
const changePassword = async (id, currentPassword, newPassword) => {
  logger.debug('UserService::changePassword');
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // check if password has been used in last NN passwords
  const isPasswordReused = await user.isPasswordReused(newPassword, 24);
  if (isPasswordReused) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password has been used recently.');
  }

  const isPasswordMatch = await user.isPasswordMatch(currentPassword);
  if (isPasswordMatch) {
    // supplied current password matches stored value
    user.password = newPassword;
    await user.save();
    return user;
  } else {
    // supplied current password does NOT match stored value
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password mismatch.');
  }
};

/**
 * Update the `email` attribute of a User. Enforces enhanced authentication for a
 * customer changing their email address.
 * @param {ObjectId} id A User identifier.
 * @param {string} currentPassword The User's current password value.
 * @param {string} email The User's new email address value.
 * @returns {Promise<Object|null>} A Promise that resolves to the updated User if successful;
 * otherwise rejects with an Error.
 */
const updateEmail = async (id, currentPassword, email) => {
  logger.debug('UserService::updateEmail');
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isPasswordMatch = await user.isPasswordMatch(currentPassword);
  if (isPasswordMatch) {
    // supplied current password matches stored value
    user.email = email;
    await user.save();
    return user;
  } else {
    // supplied current password does NOT match stored value
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password mismatch.');
  }
};

/**
 * Delete a User.
 * @param {ObjectId} id A User identifier.
 * @returns {Promise<Object>} A Promise that resolves to the deleted User if found;
 * otherwise rejects with an Error.
 */
const deleteUserById = async (id) => {
  logger.debug('UserService::deleteUserById');
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  updateEmail,
  changePassword,
  deleteUserById,
};
