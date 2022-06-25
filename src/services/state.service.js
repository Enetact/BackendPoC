const { State } = require('../models');
const logger = require('../config/logger');

/**
 * Create a single or collection of State objects in the database.
 * @param {Object|Object[]} states The State or collection of.
 * @returns {Promise<Object|Object[]>} The persisted single or collection of State objects.
 */
const createState = async (state) => {
  logger.debug('StateService::createState');
  return State.create(state);
};

/**
 * Find a collection of states matching the supplied filter criteria.
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryStates = async (filter, options) => {
  logger.debug('StateService::queryStates');
  const states = await State.paginate(filter, options);
  return states;
};

/**
 * Get a single State by identifier.
 * @param {ObjectId} id
 * @returns {Promise<State>}
 */
const getStateById = async (id) => {
  logger.debug('StateService::getStateById');
  return State.findById(id);
};

/**
 * Get a single State whose ZIP Codes array contains the supplied zip code value.
 * @param {string} zipCode A ZIP Code value, e.g. '84001'.
 * @returns {Promise<State|null>} A Promise that resolves to a State if found,
 * null if not found, otherwise rejects with an Error.
 */
const getStateByZipCode = async (zipCode) => {
  logger.debug('StateService::getStateByZipCode');
  return State.findOne({ zipCodes: { $elemMatch: { zipcode: zipCode } } });
};

/**
 * Update one to many State objects.
 * @param {Object[]} states A collection of State objects containing updated values.
 * @returns {Promise<number>} A Promise containing a the number of updated items.
 */
const updateStates = async (states = []) => {
  logger.debug('StateService::updateStates');
  const promises = states.map((state) => {
    return State.updateOne({ _id: state.id }, state);
  });
  const allResults = await Promise.all(promises);
  const updatedCount = allResults
    .map((result) => result.nModified)
    .reduce((count, total) => {
      return total + count;
    }, 0);
  return updatedCount;
};

/**
 * Delete one to many State items.
 * @param {Object[]} states A collection of State objects to be deleted.
 * @returns {Promise<void>} A Promise that resolves to null if successful; otherwise, rejects with an error.
 */
const deleteStates = async (states = []) => {
  logger.debug('StateService::deleteStates');
  const promises = states.map(async (state) => {
    return State.deleteOne({ _id: state.id });
  });
  await Promise.all(promises);
  return;
};

module.exports = {
  createState,
  queryStates,
  getStateById,
  getStateByZipCode,
  updateStates,
  deleteStates,
};
