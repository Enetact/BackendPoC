const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { policyService, origamiService, memberService } = require('../services');

const updatePolicyNumber = catchAsync(async (req, res) => {
  logger.info('policy controller: update requested');
  const request = req.body;
  let policyResult='';
  if(!request.memberId || !request.proposalId){
    logger.info('policy controller: update - memberid or proposalid not provided');
    throw new ApiError(httpStatus.PRECONDITION_FAILED, 'Please check memberid / proposalid');
  }
  const memberDetails = await memberService.getMemberByMemberId(request.memberId);
  if(!memberDetails || !memberDetails.userId){
    logger.info('policy controller: update - member does not exist in middleware');
    throw new ApiError(httpStatus.PRECONDITION_FAILED, 'Member does not exist');
  }
  
  if(request.error && request.error.message)
  {
    policyResult = await policyService.updatePolicyNumber(request, memberDetails.userId);
    logger.info('policy controller: update completed');
    return res.json({
      status:200,
      result:policyResult
    });
  }
  else if(!request.policy || !request.policy.id || !request.policy.number){
    logger.info('policy controller: update - policyid or policy number not provided');
    throw new ApiError(httpStatus.PRECONDITION_FAILED, 'Please check policy id / policy number');
  }
  policyResult = await policyService.updatePolicyNumber(request, memberDetails.userId);
  logger.info('policy controller: update completed');
    res.json({
      status:200,
      result:policyResult
    });
});

const getPolicies = catchAsync(async (req, res) => {
  logger.info('policy controller: get all requested');
  const filter = pick(req.query, ['userid']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await policyService.queryPolicies(filter, options);
  logger.info('policy controller: get all completed');
  res.send(result);
});

const getPolicyByUserId = catchAsync(async (req, res) => {
  logger.info('policy controller: get requested');
  const policies = await origamiService.getPoliciesByUser(req.params.userid);
  if (!policies) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Policy not found');
  }
  logger.info('policy controller: get completed');
  res.send(policies);
});


module.exports = {
    getPolicies,
    getPolicyByUserId,
    updatePolicyNumber
};
