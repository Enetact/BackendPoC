const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const completeProjectSchema = mongoose.Schema(
  {
    month: {
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

completeProjectSchema.plugin(toJSON);
completeProjectSchema.plugin(paginate);

const CompleteProject = mongoose.model('CompleteProject', completeProjectSchema);

module.exports = CompleteProject;
