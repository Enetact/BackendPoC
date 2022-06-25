const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const jobCategorySchema = mongoose.Schema(
  {
    name: {
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
    includedCoverages: {
      type: Array,
      required: true,
    },
    excludedCoverages: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
jobCategorySchema.plugin(toJSON);
jobCategorySchema.plugin(paginate);

const JobCategory = mongoose.model('JobCategory', jobCategorySchema);

module.exports = JobCategory;
