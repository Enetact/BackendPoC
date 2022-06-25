const  mongoose  = require('mongoose');
const { toJSON, paginate } = require('./plugins');


const paymentSchema = mongoose.Schema(
  {
      userId: {
        type: String,
        required: true
      },
      quotationId: {
        type: String,
        required: true
      },
      amount: {
        type: String,
        required: true
      }
  },
  {
      timestamps: true,
  }
);


// add plugin that converts mongoose to json
paymentSchema.plugin(toJSON);
paymentSchema.plugin(paginate);

/**
 * @typedef Payment
 */
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
