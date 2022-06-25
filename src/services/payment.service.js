const httpStatus = require('http-status');
const { Payment } = require('../models');

/**
 * Create a Payment
 * @param {Object} paymentBody
 * @returns {Promise<Payment>}
 */
const createPayment = async (paymentBody) => {
    const existPayment = await Payment.findOne({userId: paymentBody.userId, quotationId: paymentBody.quotationId});
    if(existPayment){
        return existPayment;
    }
    return Payment.create(paymentBody);
};

/**
 * Query for Payment
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryPayments = async (filter, options) => {
  const payments = await Payment.paginate(filter, options);
  return payments;
};



module.exports = {
    createPayment,
    queryPayments
};
