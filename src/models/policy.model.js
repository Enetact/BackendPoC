const  mongoose  = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const policySchema = mongoose.Schema(
  {
      userId: {
        type: String
      },
      middlewareQuotationId: {
        type: String
      },
      origamiMemberId: {
        type: String,
        required: true
      },
      insured: {
        type: String
      },
      policyProposalId:{
        type: String,
        required: true
      },
      policyId:{
        type: String
      },
      policyNumber:{
        type: String
      },
      policyError:{
        type: String
      },
      street: {
        type: String
      },
      state: {
        type: String
      },
      zip: {
        type: String
      },
      category: {
        type: String
      },
      premiumAmount: {
        type: String
      },
      effectiveDate:{
        type: String
      },
      expiryDate:{
        type: String
      },
      isActive: {
        type: String,
        required: true
      }
  },
  {
      timestamps: true,
  }
);

// add plugin that converts mongoose to json
policySchema.plugin(toJSON);
policySchema.plugin(paginate);

/**
 * @typedef Policy
 */
const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;
