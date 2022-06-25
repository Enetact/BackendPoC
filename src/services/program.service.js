const { Program } = require('../models');

/**
 * Create (store) a single Program or a collection of Program objects in the database.
 * @param {Object | Object[]} programs The Program or collection of Programs to be persisted.
 * @returns {Promise<Object|Object[]} The persisted single or collection of Program objects.
 */
const createProgram = async (programs) => {
  return Program.create(programs);
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
const queryPrograms = async (filter, options) => {
  const programs = await Program.paginate(filter, options);
  return programs;
};

/**
 * Get program by code
 * @param {String} code
 * @returns {Promise<Program>}
 */
const getProgramByCode = async (code) => {
  return Program.findOne({code: code});
};

/**
 * Update one to many Programs.
 * @param {Object[]} programs A collection of Program objects containing updated values.
 * @returns A Promise containing a collection of updated Programs.
 */
const updatePrograms = async (programs = []) => {
  const promises = programs.map((program) => {
    return Program.updateOne({ _id: program.id }, program);
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
 * Delete one to many Programs.
 * @param {Object[]} programs A collection of Progam objects to be deleted.
 * @returns A Promise that resolves to null if successful; otherwise, rejects with an error.
 */
const deletePrograms = async (programs = []) => {
  const promises = programs.map(async (program) => {
    return Program.deleteOne({ _id: program.id });
  });
  await Promise.all(promises);
  return;
};

module.exports = {
  createProgram,
  queryPrograms,
  getProgramByCode,
  updatePrograms,
  deletePrograms,
};
