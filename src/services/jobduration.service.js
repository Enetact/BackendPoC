const { JobDuration } = require('../models');
const logger = require('../config/logger');

/**
 * Create a single or collection of JobDuration options in the database.
 * @param {Object|Object[]} jobdurations The JobDuration or collection of.
 * @returns {Promise<Object|Object[]>} The persisted single or collection of JobDuration objects.
 */
const createJobDuration = async (jobDurations) => {
  logger.debug('JobDurationService::createJobDuration');
  return JobDuration.create(jobDurations);
};

/**
 * Query for JobDuration
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryJobDurations = async (filter, options) => {
  logger.debug('JobDurationService::queryJobDurations');
  const jobdurations = await JobDuration.paginate(filter, options);
  return jobdurations;
};

/**
 * Get JobDuration by id
 * @param {ObjectId|string} id A JobDuration identifier.
 * @returns {Promise<JobDuration>} A Promise containing a JobDuration object if successful;
 * otherwise rejects with an Error.
 */
const getJobDurationById = async (id) => {
  logger.debug('JobDurationService::getJobDurationById');
  return JobDuration.findById(id);
};

/**
 * Find a single JobDuration by the code attribute value.
 * @param {string} code A JobDuration code attribute value.
 * @returns {Promise<Object>} A Promise containing a JobDuration object if successful;
 * otherwise rejects with an Error.
 */
const getJobDurationByCode = async (code) => {
  logger.debug('JobDurationService::getJobDurationByCode');
  return JobDuration.findOne({ code });
};

/**
 * Update one to many JobDuration objects.
 * @param {Object[]} jobDurations A collection of JobDuration objects containing updated values.
 * @returns {Promise<number>} A Promise containing a the number of updated items.
 */
const updateJobDurations = async (jobDurations = []) => {
  logger.debug('JobDurationService::updateJobDurations');
  const promises = jobDurations.map((jobDuration) => {
    return JobDuration.updateOne({ _id: jobDuration.id }, jobDuration);
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
 * Delete one to many JobDuration items.
 * @param {Object[]} jobDurations A collection of JobDuration objects to be deleted.
 * @returns {Promise<void>} A Promise that resolves to null if successful; otherwise, rejects with an error.
 */
const deleteJobDurations = async (jobDurations = []) => {
  logger.debug('JobDurationService::deleteJobDurations');
  const promises = jobDurations.map(async (jobDuration) => {
    return JobDuration.deleteOne({ _id: jobDuration.id });
  });
  await Promise.all(promises);
  return;
};

module.exports = {
  createJobDuration,
  queryJobDurations,
  getJobDurationById,
  getJobDurationByCode,
  updateJobDurations,
  deleteJobDurations,
};
