const httpStatus = require('http-status');
const { Policy } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a policy
 * @param {Object} policyBody
 * @returns {Promise<Policy>}
 */
const createPolicy = async (policyBody) => {
  return Policy.create(policyBody);
};

const updatePolicyError = async(policyResult, request) =>{
  policyResult.policyError = request.error.message;
  await Policy.create(policyResult);
};

const updatePolicy = async(policyResult, request) =>{
  policyResult.policyId = request.policy.id;
  policyResult.policyNumber = request.policy.number;
  await Policy.create(policyResult);
};

const updatePolicyNumber = async(request, userId) =>{
  const policyResult = await Policy.findOne({ 'origamiMemberId':request.memberId, 'policyProposalId': request.proposalId}) ;
  if(policyResult)
  {
    if(request.error && request.error.message){
      await updatePolicyError(policyResult, request);
      return 'Policy error updated successfully';
    }
    else{
      await updatePolicy(policyResult, request);
    }
  }
  else{
    return 'Policy does not exist with given member id and proposal id';
  }
  return 'Policy number updated successfully';
};

/**
 * Query for policies
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPolicies = async (filter, options) => {
  const policies = await Policy.paginate(filter, options);
  return policies;
};

/**
 * Get policy by member id
 * @param {ObjectId} memberId
 * @returns {Promise<Policy>}
 */
const getPolicyByMemberId = async (memberId) => {
  return Policy.find({ 'origamiMemberId':memberId}).exec() ;
};

/**
 * Get insurances by userid
 * @param {ObjectId} userid
 * @returns {Promise<Policy>}
 */
 const getPolicyByUserId = async (userid) => {
    return Policy.find({ 'userid':memberId}).exec() ;
  }

//get policy by quotation id
const getPolicyByQuotationId = async (quoteId) => {
  return await Policy.findOne({ 'quotationId': quoteId});
}

module.exports = {
    createPolicy,
    queryPolicies,
    getPolicyByMemberId,
    getPolicyByUserId,
    updatePolicyNumber,
    getPolicyByQuotationId
};
