const  mongoose  = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');


const memberSchema = mongoose.Schema(
  {
      userId: {
        type: String,
        required: true,
        index: true,
        unique: true
      },
      name: {
        type: String,
        required: true
      },
      origamiMemberId: {
        type: String,
        required: true,
        index: true,
        unique: true,
      },
      contactEmail: {
        type: String,
        required: true
      },
      createdOn: {
        type: String
      },
      isActive: {
        type: Number,
        required: true
      },
  },
  {
      timestamps: true,
  }
);

// add plugin that converts mongoose to json
memberSchema.plugin(toJSON);
memberSchema.plugin(paginate);

/**
 * @typedef Member
 */
const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
