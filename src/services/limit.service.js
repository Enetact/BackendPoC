const { Limit } = require('../models');
const logger = require('../config/logger');

/**
 * Create (store) a single Limit or a collection of Limit objects in the database.
 * @param {Object | Object[]} limits The Limit or collection of Limits to be persisted.
 * @returns {Promise<Object|Object[]} The persisted single or collection of Limit objects.
 */
const createLimit = async (limits) => {
  return Limit.create(limits);
};

/**
 * Query for limit
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLimits = async (filter, options) => {
  const limits = await Limit.paginate(filter, options);
  return limits;
};

/**
 * Get limit by id
 * @param {ObjectId} id
 * @returns {Promise<Limit>}
 */
const getLimitById = async (id) => {
  return Limit.findById(id);
};

const getLimitByCode = async (code) => {
  logger.debug('LimitService::getLimitByCode');
  return Limit.findOne({ code });
};

/**
 * Update one to many Limits.
 * @param {Object[]} limits A collection of Limit objects containing updated values.
 * @returns A Promise containing a collection of updated Limits.
 */
const updateLimits = async (limits = []) => {
  const promises = limits.map((limit) => {
    return Limit.updateOne({ _id: limit.id }, limit);
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
 * Delete one to many Limits.
 * @param {Object[]} limits A collection of Limit objects to be deleted.
 * @returns A Promise that resolves to null if successful; otherwise, rejects with an error.
 */
const deleteLimits = async (limits = []) => {
  const promises = limits.map(async (limit) => {
    return Limit.deleteOne({ _id: limit.id });
  });
  await Promise.all(promises);
  return;
};

module.exports = {
  createLimit,
  queryLimits,
  getLimitById,
  getLimitByCode,
  updateLimits,
  deleteLimits,
};
