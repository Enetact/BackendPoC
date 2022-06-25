const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const find = require('lodash/find');
const orderBy = require('lodash/orderBy');
const take = require('lodash/take');

const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const passwordHistorySchema = new mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  changedAt: {
    type: Date,
    required: true,
  },
});

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    invalidLoginAttempts: {
      type: Number,
      default: 0,
    },
    passwordLastChangedAt: {
      type: Date,
      default: new Date(),
    },
    agreements: {
      termsAndConditions: {
        type: Boolean,
        required: true,
      },
      marketingCommunication: {
        type: Boolean,
        default: true,
      },
    },
    passwordHistory: {
      type: [passwordHistorySchema],
      private: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

/**
 * Check if password exists in password history.
 * @param {string} password The password value to compare to previous passwords.
 * @param {number} [historyCount=1] The number of password history records to compare.
 * @returns {Promise<boolean} A Promise which resolves to a boolean indicating if the password is
 * present in the history records; otherwise rejects with an Error.
 */
userSchema.methods.isPasswordReused = async function (password, historyCount = 1) {
  const user = this;
  // fetch NN of the most recent passwords
  const recentPasswords = take(orderBy(user.passwordHistory, ['changedAt'], ['desc']), historyCount);
  const passwordMatch = find(recentPasswords, (recentPassword) => {
    return bcrypt.compareSync(password, recentPassword.password);
  });
  return !!passwordMatch;
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const password = await bcrypt.hash(user.password, 8);
    const now = new Date();
    user.password = password;
    user.passwordHistory.push({ password, changedAt: now });
    user.passwordLastChangedAt = now;
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
