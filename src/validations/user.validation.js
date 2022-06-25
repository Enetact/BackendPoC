const Joi = require('joi');
const { objectId } = require('./custom.validation');

/**
 * Request validation rules for the "createUser" API.
 */
const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .min(10)
      .max(30)
      .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()]{10,30}$')) // password length 10-30
      .pattern(new RegExp('[a-z]+')) // must contain at least 1 lowercase letter
      .pattern(new RegExp('[A-Z]+')) // must contain at least 1 uppercase letter
      .pattern(new RegExp('[0-9]+')) // must contain at least 1 number
      .pattern(new RegExp('[!@#$%^&*()]+')), // must contain at least one of these symbols
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin', 'service'),
    isActive: Joi.boolean().default(true),
    isLocked: Joi.boolean().default(false),
    isEmailVerified: Joi.boolean().default(false),
    agreements: {
      termsAndConditions: Joi.boolean().required(),
      marketingCommunication: Joi.boolean().default(false),
    },
  }),
};

/**
 * Request validation rules for the "listUsers" API.
 */
const getUsers = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

/**
 * Request validation rules for the "getUserById" API.
 */
const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

/**
 * Request validation rules for the "updateUser" API.
 */
const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
  body: Joi.object()
    .keys({
      id: Joi.string().length(24),
      email: Joi.string().email(),
      password: Joi.string()
        .min(12)
        .max(30)
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()]{10,30}$'))
        .pattern(new RegExp('[a-z]+'))
        .pattern(new RegExp('[A-Z]+'))
        .pattern(new RegExp('[0-9]+'))
        .pattern(new RegExp('[!@#$%^&*()]+')),
      firstName: Joi.string(),
      lastName: Joi.string(),
      role: Joi.string().valid('user', 'admin', 'service'),
      isActive: Joi.boolean(),
      isLocked: Joi.boolean(),
      isEmailVerified: Joi.boolean(),
      agreements: {
        termsAndConditions: Joi.boolean(),
        marketingCommunication: Joi.boolean(),
      },
    })
    .min(1),
};

/**
 * Request validation rules for the "updateEmail" API.
 */
const updateEmail = {
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string()
        .required()
        .min(12)
        .max(30)
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()]{10,30}$'))
        .pattern(new RegExp('[a-z]+'))
        .pattern(new RegExp('[A-Z]+'))
        .pattern(new RegExp('[0-9]+'))
        .pattern(new RegExp('[!@#$%^&*()]+')),
    })
    .min(1),
};

/**
 * Request validation rules for the "changePassword" API.
 */
const changePassword = {
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
  body: Joi.object()
    .keys({
      currentPassword: Joi.string()
        .required()
        .min(12)
        .max(30)
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()]{10,30}$'))
        .pattern(new RegExp('[a-z]+'))
        .pattern(new RegExp('[A-Z]+'))
        .pattern(new RegExp('[0-9]+'))
        .pattern(new RegExp('[!@#$%^&*()]+')),
      newPassword: Joi.string()
        .required()
        .min(12)
        .max(30)
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()]{10,30}$'))
        .pattern(new RegExp('[a-z]+'))
        .pattern(new RegExp('[A-Z]+'))
        .pattern(new RegExp('[0-9]+'))
        .pattern(new RegExp('[!@#$%^&*()]+')),
    })
    .min(1),
};

/**
 * Request validation rules for the "deleteUser" API.
 */
const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateEmail,
  changePassword,
  deleteUser,
};
