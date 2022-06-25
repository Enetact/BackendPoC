const { JobCategory } = require('../models');
const logger = require('../config/logger');

/**
 * Create a single JobCategory or a collection of JobCategory objects in the database.
 * @param {Object|Object[]} jobCategories The JobCategory or collection of JobCategories to be persisted.
 * @returns {Promise<Object|Object[]>} The persisted single or collection of JobCategory objects.
 */
const createJobCategory = async (jobCategories) => {
  logger.debug('JobCategoryService::createJobCategory');
  return JobCategory.create(jobCategories);
};

/**
 * Query for JobCategory
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryJobCategories = async (filter, options) => {
  logger.debug('JobCategoryService::queryJobCategories');
  const jobcategories = await JobCategory.paginate(filter, options);
  return jobcategories;
};

/**
 * Fetch a collection of JobCategory objects by their code values.
 * @param {string[]} codes A collection of JobCategory code values.
 * @returns {Promise<Object[]>} A Promise containing a collection of JobCategory objects if successful;
 * otherwise rejects with an Error.
 */
const listJobCategoriesByCode = async (codes = []) => {
  logger.debug('JobCategoryService::listJobCategoriesByCode');
  const promises = codes.map((code) => getJobCategoryByCode(code));
  return Promise.all(promises);
};

/**
 * Get JobCategory by id
 * @param {ObjectId} id
 * @returns {Promise<JobCategory>}
 */
const getJobCategoryById = async (id) => {
  logger.debug('JobCategoryService::getJobCategoryById');
  return JobCategory.findById(id);
};

/**
 * Get a single JobCategory by the code attribute value.
 * @param {string} code A JobCategory code attribute value.
 * @returns {Promise<Object|null>} A Promise which resolves to a JobCategory object if found, null if not found;
 * otherwise throws an Error.
 */
const getJobCategoryByCode = async (code) => {
  logger.debug('JobCategoryService::getJobCategoryByCode');
  return JobCategory.findOne({ code });
};

/**
 * Update one to many JobCategory objects.
 * @param {Object[]} jobCategories A collection of JobCategory objects containing updated values.
 * @returns {Promise<number>}A Promise containing a the number of updated items.
 */
const updateJobCategories = async (jobCategories = []) => {
  logger.debug('JobCategoryService::updateJobCategories');
  const promises = jobCategories.map((jobCategory) => {
    return JobCategory.updateOne({ _id: jobCategory.id }, jobCategory);
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
 * Delete one to many JobCategory items.
 * @param {Object[]} jobCategories A collection of JobCategory objects to be deleted.
 * @returns {Promise<void>}A Promise that resolves to null if successful; otherwise, rejects with an error.
 */
const deleteJobCategories = async (jobCategories = []) => {
  logger.debug('JobCategoryService::deleteJobCategories');
  const promises = jobCategories.map(async (jobCategory) => {
    return JobCategory.deleteOne({ _id: jobCategory.id });
  });
  await Promise.all(promises);
  return;
};

module.exports = {
  createJobCategory,
  queryJobCategories,
  listJobCategoriesByCode,
  getJobCategoryById,
  getJobCategoryByCode,
  updateJobCategories,
  deleteJobCategories,
};
