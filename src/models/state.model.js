const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const zipCodeSchema = new mongoose.Schema({
  zipcode: {
    type: String,
    required: true,
  },
  factor: {
    type: String,
    required: true,
  },
});

const stateSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    suffix: {
      type: String,
    },
    rate: {
      type: String,
      required: true,
    },
    zipCodes: [zipCodeSchema],
  },
  {
    timestamps: true,
  }
);

stateSchema.plugin(toJSON);
stateSchema.plugin(paginate);

const State = mongoose.model('State', stateSchema);

module.exports = State;
