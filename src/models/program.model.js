const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const programSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
programSchema.plugin(toJSON);
programSchema.plugin(paginate);

/**
 * @typedef Program
 */
const Program = mongoose.model('Program', programSchema);

module.exports = Program;
