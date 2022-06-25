const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const faqSchema = mongoose.Schema(
  {
    programId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
faqSchema.plugin(toJSON);
faqSchema.plugin(paginate);

/**
 * @typedef Faq
 */
const Faq = mongoose.model('Faq', faqSchema);

module.exports = Faq;
