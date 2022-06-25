const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const crewSizeSchema = mongoose.Schema(
  {
    count: {
      type: String,
      required: true,
    },
    factor: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
crewSizeSchema.plugin(toJSON);
crewSizeSchema.plugin(paginate);

/**
 * @typedef Crew
 */
const CrewSize = mongoose.model('CrewSize', crewSizeSchema);

module.exports = CrewSize;
