const  mongoose  = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const quotationSchema = mongoose.Schema(
  {
      userId: {
        type: String,
        required: true
      },
      firstName:{
        type: String,
        required: true
      },
      lastName:{
        type: String,
        required: true
      },
      stateCode:{
        type: String,
        required: true
      },
      zipCode:{
        type: String,
        required: true
      },
      address:{
        type: String
      },
      categoryCodes:{
        type: Array
      },
      jobDurationCode:{
        type: String
      },
      crewSizeCode:{
        type: String
      },
      limitCode:{
        type: String
      },
      email:{
        type: String,
        required: true
      },
      startDate:{
        type: String,
        required: true
      },
      endDate:{
        type: String,
        required: true
      },
      additionalInsuredCoverage:{
        type: Number
      },
      waiverOfSubrogation:{
        type: Number
      },
      isComplete: {
        type: String,
        required: true
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
quotationSchema.plugin(toJSON);
quotationSchema.plugin(paginate);

/**
 * @typedef Quotation
 */
const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation;
