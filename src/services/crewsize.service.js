const logger = require('../config/logger');
const { CrewSize } = require('../models');

/**
 * Create a single CrewSize or a collection of CrewSize objects in the database.
 * @param {Object | Object[]} crewsizes The CrewSize or collection of CrewSizes to be persisted.
 * @returns {Promise<Object|Object[]>} The persisted single or collection of CrewSize objects.
 */
const createCrewSize = async (crewsizes) => {
  logger.debug('CrewSizeService::createCrewSize');
  return CrewSize.create(crewsizes);
};

/**
 * Query for crewSize
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCrewSizes = async (filter, options) => {
  logger.debug('CrewSizeService::queryCrewSizes');
  const crewsizes = await CrewSize.paginate(filter, options);
  return crewsizes;
};

/**
 * Get crewsize by id
 * @param {ObjectId} id
 * @returns {Promise<CrewSize>}
 */
const getCrewSizeById = async (id) => {
  logger.debug('CrewSizeService::getCrewSizeById');
  return CrewSize.findById(id);
};

/**
 * Find a Crew Size by the code attribute value.
 * @param {string} code A CrewSize code attribute value.
 * @returns {Promise<Object|null>} A Promise that resolves to a CrewSize object if found, null if not found;
 * othwerwise rejects with an error.
 */
const getCrewSizeByCode = async (code) => {
  logger.debug('CrewSizeService::getCrewSizeByCode');
  return CrewSize.findOne({ count: code });
};

/**
 * Update one to many CrewSize objects.
 * @param {Object[]} crewSizes A collection of CrewSize objects containing updated values.
 * @returns {Promise<number>}A Promise containing a the number of updated items.
 */
const updateCrewSizes = async (crewSizes = []) => {
  logger.debug('CrewSizeService::updateCrewSizes');
  const promises = crewSizes.map((crewSize) => {
    return CrewSize.updateOne({ _id: crewSize.id }, crewSize);
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
 * Delete one to many CrewSize items.
 * @param {Object[]} crewSizes A collection of CrewSize objects to be deleted.
 * @returns {Promise<void>}A Promise that resolves to null if successful; otherwise, rejects with an error.
 */
const deleteCrewSizes = async (crewSizes = []) => {
  logger.debug('CrewSizeService::deleteCrewSizes');
  const promises = crewSizes.map(async (crewSize) => {
    return CrewSize.deleteOne({ _id: crewSize.id });
  });
  await Promise.all(promises);
  return;
};

module.exports = {
  createCrewSize,
  queryCrewSizes,
  getCrewSizeById,
  getCrewSizeByCode,
  updateCrewSizes,
  deleteCrewSizes,
};
