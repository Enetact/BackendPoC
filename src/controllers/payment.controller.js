const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ObjectId } = require('mongodb');
const { paymentService, quotationService, userService, policyService, origamiService } = require('../services');

const createPayment = catchAsync(async (req, res) => {
    const request = req.body;
    if(request && (!request.userId || !request.amount || !request.quotationId)){
        throw new ApiError(httpStatus.NOT_FOUND, 'quotationId, userId, and amount are must');
    }
  
    if(!(await userService.getUserById(request.userId))){
        throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
    }
    if(!(await quotationService.getQuotationById(request.quotationId))){
        throw new ApiError(httpStatus.NOT_FOUND, 'quotation not found');
    }

    //get the policy for payment.
    const policy = await policyService.getPolicyByQuotationId(request.quotationId);
    if(!policy || !policy.policyProposalId){
        throw new ApiError(httpStatus.NOT_FOUND, 'policy not found for this payment');
    }

    //send payment to Origami
    const result = await origamiService.sendPaymentConfirmation(policy.policyProposalId, request.amount);
    
    if(result){
         //save payment detail to middleware
        const payment = await paymentService.createPayment(request);
    }
    res.status(httpStatus.CREATED).send(result);
   
});

const getPayments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await paymentService.queryPayments(filter, options);
  res.send(result);
});



module.exports = {
  getPayments,
  createPayment
};
