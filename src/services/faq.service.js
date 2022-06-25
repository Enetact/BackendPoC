const { Faq } = require('../models');
const logger = require('../config/logger');

/**
 * Create (store) a single Program or a collection of Program objects in the database.
 * @param {Object | Object[]} programs The Program or collection of Programs to be persisted.
 * @returns {Promise<Object|Object[]} The persisted single or collection of Program objects.
 */
const createFaq = async (programs) => {
  logger.debug('FaqService::createFaq');
  return Faq.create(programs);
};

/**
 * Query for program
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 100)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFaqs = async (filter, options) => {
  logger.debug('FaqService::queryFaqs');
  const programs = await Faq.paginate(filter, options);
  return programs;
};

/**
 * Get faqs by programId
 * @param {String} programId
 * @returns {Promise<Faq>}
 */
const getFaqByProgram = async (programId) => {
  logger.debug('FaqService::getFaqByProgram');
  return Faq.find({ programId: programId });
};

/**
 * Get faqs by type
 * @param {String} type
 * @returns {Promise<Faq>}
 */
const getFaqByType = async (type) => {
  logger.debug('FaqService::getFaqByType');
  return Faq.find({ type: type });
};

/**
 * Get faqs by programId and type
 * @param {String, String} programId and type
 * @returns {Promise<Faq>}
 */
const getFaqByProgramType = async (programId, type) => {
  logger.debug('FaqService::getFaqByProgramType');
  return Faq.find({ programId:programId, type:type });
};

/**
 * Get faq by id
 * @param {String} id
 * @returns {Promise<Faq>}
 */
const getFaqById = async (id) => {
  logger.debug('FaqService::getFaqById');
  return Faq.findById(id);
};

/**
 * Update one to many Faqs.
 * @param {Object[]} faq A collection of Faq objects containing updated values.
 * @returns A Promise containing a collection of updated Faqs.
 */
const updateFaqs = async (faqs = []) => {
  logger.debug('FaqService::updateFaqs');
  const promises = faqs.map((faq) => {
    return Faq.updateOne({ _id: faq.id }, faq);
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
 * Delete one to many Faqs.
 * @param {Object[]} faqs A collection of Faq objects to be deleted.
 * @returns A Promise that resolves to null if successful; otherwise, rejects with an error.
 */
const deleteFaqs = async (faqs = []) => {
  logger.debug('FaqService::deleteFaqs');
  const promises = faqs.map(async (faq) => {
    return Faq.deleteOne({ _id: faq.id });
  });
  await Promise.all(promises);
  return;
};

module.exports = {
  createFaq,
  queryFaqs,
  getFaqById,
  getFaqByProgram,
  updateFaqs,
  deleteFaqs,
  getFaqByProgramType,
  getFaqByType,
};
