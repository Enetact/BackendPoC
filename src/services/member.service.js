const httpStatus = require('http-status');
const { Member } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a member
 * @param {Object} memberBody
 * @returns {Promise<Member>}
 */
const createMember = async (memberBody) => {
  return Member.create(memberBody);
};

/**
 * Query for members
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMembers = async (filter, options) => {
  const members = await Member.paginate(filter, options);
  return members;
};

/**
 * Get member by userid
 * @param {ObjectId} userid
 * @returns {Promise<Member>}
 */
const getMemberByUserId = async (id) => {
  return await Member.find({userId: id});
};

/**
 * Get member by memberid
 * @param {ObjectId} memberid
 * @returns {Promise<Member>}
 */
 const getMemberByMemberId = async (memberId) => {
    return await Member.findOne({'origamiMemberId': memberId});
};

module.exports = {
  createMember,
  queryMembers,
  getMemberByUserId,
  getMemberByMemberId
};
