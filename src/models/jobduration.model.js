const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const jobDurationSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    unit: {
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

jobDurationSchema.plugin(toJSON);
jobDurationSchema.plugin(paginate);

const JobDuration = mongoose.model('JobDuration', jobDurationSchema);

module.exports = JobDuration;
