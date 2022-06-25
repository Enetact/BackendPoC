const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const limitSchema = mongoose.Schema(
  {
    aggregate: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    factor: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
limitSchema.plugin(toJSON);
limitSchema.plugin(paginate);

/**
 * @typedef Limit
 */
const Limit = mongoose.model('Limit', limitSchema);

module.exports = Limit;
