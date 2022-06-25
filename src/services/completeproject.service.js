const { CompleteProject } = require('../models');
const logger = require('../config/logger');

/**
 * Create a single or collection of CompleteProject options in the database.
 * @param {Object|Object[]} completeProjects The single or collection of CompleteProject options to be persisted.
 * @returns {Promise<Object|Object[]>} The persisted single or collection of CompleteProject objects.
 */
const createCompleteProject = async (completeProjects) => {
  logger.debug('CompleteProjectService::createCompleteProject');
  return CompleteProject.create(completeProjects);
};

/**
 * Query for completeproject
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCompleteProjects = async (filter, options) => {
  logger.debug('CompleteProjectService::queryCompleteProjects');
  const result = await CompleteProject.paginate(filter, options);
  return result;
};

/**
 * Get completeproject by id
 * @param {ObjectId} id
 * @returns {Promise<CompleteProject>}
 */
const getCompleteProjectById = async (id) => {
  logger.debug('CompleteProjectService::getCompleteProjectById');
  return CompleteProject.findById(id);
};

/**
 * Find a CompleteProject by code attribute value.
 * @param {string} code A CompleteProject code attribute value.
 * @returns {Promise<Object|null>} A Promise which resolves to a CompleteProject if found or `null` if not found;
 * otherwise rejects with an Error.
 */
const getCompleteProjectByCode = async (code) => {
  logger.debug('CompleteProjectService::getCompleteProjectByCode');
  return CompleteProject.findOne({ month: code });
};

/**
 * Update one to many CompleteProject objects.
 * @param {Object[]} completeProjects A collection of CompleteProject objects containing updated values.
 * @returns {Promise<number>}A Promise containing a the number of updated items.
 */
const updateCompleteProjects = async (completeProjects = []) => {
  logger.debug('CompleteProjectService::updateCompleteProjects');
  const promises = completeProjects.map((completeProject) => {
    return CompleteProject.updateOne({ _id: completeProject.id }, completeProject);
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
 * Delete one to many CompleteProject items.
 * @param {Object[]} completeProjects A collection of CompleteProject objects to be deleted.
 * @returns {Promise<void>}A Promise that resolves to null if successful; otherwise, rejects with an error.
 */
const deleteCompleteProjects = async (completeProjects = []) => {
  logger.debug('CompleteProjectService::deleteCompleteProjects');
  const promises = completeProjects.map(async (completeProject) => {
    return CompleteProject.deleteOne({ _id: completeProject.id });
  });
  await Promise.all(promises);
  return;
};

module.exports = {
  createCompleteProject,
  queryCompleteProjects,
  getCompleteProjectById,
  getCompleteProjectByCode,
  updateCompleteProjects,
  deleteCompleteProjects,
};
