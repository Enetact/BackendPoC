const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../config/logger');
const { memberService, origamiService } = require('../services');

const getMembers = catchAsync(async (req, res) => {
  logger.info('member controller: get all requested');
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await memberService.queryMembers(filter, options);
  logger.info('member controller: get all completed');
  res.send(result);
});

//get member based on member id
const getMember = catchAsync(async (req, res) => {
  logger.info('member controller: get requested');
  const member = await memberService.getMemberByMemberId(req.params.memberId);
  if (!member) {
    logger.info('member controller: get - member not found');
    throw new ApiError(httpStatus.NOT_FOUND, 'Member not found');
  }
  logger.info('member controller: get completed');
  res.send(member);
});

//get member based on user id
const getMemberByUserId = catchAsync(async (req, res) => {
  logger.info('member controller: get by userid requested');
  const member = await memberService.getMemberByUserId(req.params.userId);
  if (!member) {
    logger.info('member controller: get all requested');
    throw new ApiError(httpStatus.NOT_FOUND, 'Member not found');
  }
  logger.info('member controller: get by userid completed');
  res.send(member);
});

const updateMember = catchAsync(async (req, res) => {
  logger.info('member controller: update requested');
  const request = req.body;
  if(!request){
    logger.info('member controller: update- emailid or name was not provided');
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide emailId or name to update');
  }
  if(!request.emailId && !request.name){
    logger.info('member controller: update- emailid or name was not provided');
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide emailId or name to update');
  }

  const member = await origamiService.updateMember(req.params.userId, 
    req.body);

  if (!member)
  {
    logger.info('member controller: update- member not found');
    throw new ApiError(httpStatus.NOT_FOUND, 'Member not found');
  }
  logger.info('member controller: update completed');
  res.send(member);
});


module.exports = {
  getMembers,
  getMember,
  updateMember,
  getMemberByUserId
};
